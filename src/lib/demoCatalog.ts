// SERVER ONLY — searches Qualixe's demos/projects so the voice assistant can suggest them.
import { chatDb } from '@/lib/chatServer';

export type DemoKind = 'laravel' | 'shopify-theme' | 'client-project';

export type Demo = {
  name: string;
  kind: DemoKind;
  /** e.g. "Laravel demo store", "Shopify theme", "Client website" */
  label: string;
  category: string;
  summary: string;
  /** Live demo / website */
  url: string | null;
  /** Page on qualixe.com with more details (relative) */
  page: string | null;
  tech: string[];
};

/**
 * Business keywords (English + Bangla + common spellings) → canonical tags.
 * Both the visitor's request and each demo's text are mapped through this,
 * so "বেবি শপ", "kids store" and "Baby shop" all meet on the tag "baby".
 */
const SYNONYMS: Record<string, string[]> = {
  baby: ['baby', 'babies', 'kid', 'kids', 'child', 'children', 'toddler', 'toy', 'toys', 'infant', 'বেবি', 'শিশু', 'বাচ্চা', 'খেলনা', 'kiddo'],
  fashion: ['fashion', 'clothing', 'clothes', 'apparel', 'dress', 'garment', 'boutique', 'wear', 'saree', 'panjabi', 'women-fasion', 'কাপড়', 'পোশাক', 'ড্রেস', 'ফ্যাশন', 'শাড়ি', 'clothy'],
  shoes: ['shoe', 'shoes', 'footwear', 'sneaker', 'sneakers', 'sandal', 'জুতা', 'জুতো', 'স্যান্ডেল'],
  electronics: ['electronics', 'electronic', 'gadget', 'gadgets', 'mobile', 'phone', 'laptop', 'computer', 'tech', 'ইলেকট্রনিক্স', 'গ্যাজেট', 'মোবাইল', 'voltix'],
  beauty: ['beauty', 'cosmetic', 'cosmetics', 'makeup', 'skincare', 'skin', 'beauty-product', 'মেকআপ', 'কসমেটিক্স', 'স্কিনকেয়ার', 'বিউটি', 'glowy'],
  food: ['food', 'grocery', 'restaurant', 'cafe', 'bakery', 'snack', 'খাবার', 'গ্রোসারি', 'রেস্টুরেন্ট'],
  sunglass: ['sunglass', 'sunglasses', 'eyewear', 'glasses', 'optical', 'চশমা', 'সানগ্লাস'],
  health: ['medicine', 'medical', 'pharmacy', 'health', 'supplement', 'peptide', 'peptides', 'wellness', 'ওষুধ', 'ফার্মেসি', 'হেলথ'],
  herbal: ['herbal', 'harbal', 'organic', 'natural', 'ginger', 'হারবাল', 'অর্গানিক'],
  lifestyle: ['lifestyle', 'home', 'decor', 'furniture', 'লাইফস্টাইল'],
  campaign: ['campaign', 'landing', 'awareness', 'ক্যাম্পেইন'],
  ecommerce: ['ecommerce', 'e-commerce', 'shop', 'store', 'online', 'ই-কমার্স', 'শপ', 'দোকান'],
};

const PLATFORM_WORDS: Record<'laravel' | 'shopify', string[]> = {
  laravel: ['laravel', 'php', 'custom', 'লারাভেল'],
  shopify: ['shopify', 'theme', 'শপিফাই'],
};

function tagsOf(text: string): Set<string> {
  const t = text.toLowerCase();
  const tags = new Set<string>();
  for (const [tag, words] of Object.entries(SYNONYMS)) {
    if (words.some((w) => t.includes(w))) tags.add(tag);
  }
  return tags;
}

// Words too generic to say anything about the kind of business
const STOP = new Set(['shop', 'store', 'website', 'site', 'online', 'want', 'need', 'like', 'with', 'for', 'and', 'the', 'build', 'make', 'demo', 'ecommerce', 'e-commerce', 'laravel', 'shopify', 'theme', 'custom', 'php', 'web', 'app']);

function words(text: string) {
  return text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 2 && !STOP.has(w));
}

let cache: { at: number; demos: Demo[] } | null = null;

async function loadDemos(): Promise<Demo[]> {
  if (cache && Date.now() - cache.at < 5 * 60_000) return cache.demos;
  const db = chatDb();
  const [laravel, themes, portfolio] = await Promise.all([
    db.from('laravel_projects').select('title, slug, category, industry, short_description, tech_stack, features, live_url').eq('status', 'published'),
    db.from('themes').select('name, category, description, features, demo_url, store_url, status'),
    db.from('portfolio').select('title, category, client, description, project_url'),
  ]);

  const demos: Demo[] = [
    ...(laravel.data ?? []).map((p) => ({
      name: p.title,
      kind: 'laravel' as const,
      label: 'Laravel demo store',
      category: [p.category, p.industry].filter(Boolean).join(' / '),
      summary: p.short_description || (p.features ?? []).slice(0, 3).join(', ') || '',
      url: p.live_url || null,
      page: p.slug ? `/laravel-projects/${p.slug}` : null,
      tech: p.tech_stack ?? [],
    })),
    ...(themes.data ?? [])
      .filter((t) => !t.status || t.status === 'active')
      .map((t) => ({
        name: t.name,
        kind: 'shopify-theme' as const,
        label: 'Shopify theme',
        category: t.category || '',
        summary: t.description || (t.features ?? []).slice(0, 3).join(', ') || '',
        url: t.demo_url || t.store_url || null,
        page: '/themes',
        tech: ['Shopify'],
      })),
    ...(portfolio.data ?? []).map((p) => ({
      name: p.title.trim(),
      kind: 'client-project' as const,
      label: 'Client website we built',
      category: p.category || '',
      summary: p.description || '',
      url: p.project_url || null,
      page: '/portfolio',
      tech: ['Shopify'],
    })),
  ];
  cache = { at: Date.now(), demos };
  return demos;
}

/**
 * Find the best-matching demos for a request like "baby shop" + platform "laravel".
 * Returns up to `limit` matches, best first, preferring the requested platform.
 */
export async function searchDemos(query: string, platform: 'laravel' | 'shopify' | 'any' = 'any', limit = 3) {
  const demos = await loadDemos();
  const q = query.toLowerCase();

  // Platform can also be implied by the query itself ("baby shop in laravel")
  let want = platform;
  if (want === 'any') {
    if (PLATFORM_WORDS.laravel.some((w) => q.includes(w))) want = 'laravel';
    else if (PLATFORM_WORDS.shopify.some((w) => q.includes(w))) want = 'shopify';
  }

  const qTags = tagsOf(q);
  qTags.delete('ecommerce'); // too generic to rank on
  const qWords = words(q);

  const scored = demos.map((d) => {
    const hay = `${d.name} ${d.category} ${d.summary} ${d.tech.join(' ')}`;
    const dTags = tagsOf(hay);
    const hayWords = words(hay);
    let score = 0;
    let tagHits = 0;
    for (const t of qTags) if (dTags.has(t)) { score += 10; tagHits++; }
    // Whole words only (so "pet" doesn't match "peptides")
    const wordHits = qWords.filter((w) => hayWords.some((h) => h === w || (w.length >= 4 && h.startsWith(w)))).length;
    score += wordHits * 2;
    const platformMatch =
      want === 'any' ||
      (want === 'laravel' && d.kind === 'laravel') ||
      (want === 'shopify' && d.kind !== 'laravel');
    if (platformMatch) score += 3;
    if (d.kind === 'laravel' || d.kind === 'shopify-theme') score += 1; // live demos first
    // On-topic = shares a business type with the request (or, if none recognised, a real word)
    const topical = qTags.size ? tagHits > 0 : qWords.length ? wordHits > 0 : true;
    return { d, score, topical, platformMatch };
  });

  const exact = scored.filter((s) => s.topical && s.platformMatch && s.score > 3).sort((a, b) => b.score - a.score);
  const sameTopicOtherPlatform = scored.filter((s) => s.topical && !s.platformMatch && s.score > 3).sort((a, b) => b.score - a.score);
  const samePlatform = scored.filter((s) => s.platformMatch).sort((a, b) => b.score - a.score);

  let matches = exact.slice(0, limit).map((s) => s.d);
  let note: string;
  if (matches.length) {
    note = 'These match the request.';
    // Mention one related demo on the other platform if there's room
    if (matches.length < limit && sameTopicOtherPlatform[0]) matches.push(sameTopicOtherPlatform[0].d);
  } else if (sameTopicOtherPlatform.length) {
    matches = sameTopicOtherPlatform.slice(0, limit).map((s) => s.d);
    note = `No ${want} demo for this exact business yet, but these are the same kind of business on another platform. The team can build it on ${want}.`;
  } else {
    matches = samePlatform.slice(0, Math.min(2, limit)).map((s) => s.d);
    note = 'No demo for this exact business yet — these show our general work. The team can build a custom one.';
  }
  return { platform: want, note, matches };
}

import { supabase } from '../supabaseClient';

export interface HeroContent {
  badge: string;
  heading: string;
  subheading: string;
  cta_text: string;
  cta_url: string;
}

export interface ServiceItem {
  icon: string;
  title: string;
  desc: string;
}

export interface ServicesContent {
  heading: string;
  subheading: string;
  items: ServiceItem[];
}

export interface ProcessItem {
  title: string;
  desc: string;
}

export interface ProcessContent {
  heading: string;
  subheading: string;
  items: ProcessItem[];
}

export interface WhyUsItem {
  icon: string;
  title: string;
  desc: string;
}

export interface WhyUsContent {
  heading: string;
  subheading: string;
  items: WhyUsItem[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqContent {
  heading: string;
  subheading: string;
  items: FaqItem[];
}

export interface CtaContent {
  heading: string;
  subheading: string;
  btn_text: string;
  btn_url: string;
}

export interface ShopifyServicePage {
  hero: HeroContent;
  services: ServicesContent;
  process: ProcessContent;
  why_us: WhyUsContent;
  faq: FaqContent;
  cta: CtaContent;
}

// Fetch all sections at once
export async function getShopifyServicePage(): Promise<ShopifyServicePage | null> {
  const { data, error } = await supabase
    .from('shopify_service_page')
    .select('section, content');

  if (error || !data) return null;

  const map: Record<string, any> = {};
  data.forEach((row) => { map[row.section] = row.content; });

  return map as ShopifyServicePage;
}

// Upsert a single section
export async function upsertSection(section: string, content: object): Promise<void> {
  const { error } = await supabase
    .from('shopify_service_page')
    .upsert({ section, content }, { onConflict: 'section' });

  if (error) throw error;
}

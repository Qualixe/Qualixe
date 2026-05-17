import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = 'https://www.qualixe.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date('2025-11-24'), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date('2025-11-24'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/services`, lastModified: new Date('2025-11-24'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services/shopify-development`, lastModified: new Date('2025-11-24'), changeFrequency: 'monthly', priority: 0.95 },
    { url: `${BASE_URL}/services/digital-marketing`, lastModified: new Date('2025-11-24'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services/uiux-design`, lastModified: new Date('2025-11-24'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/portfolio`, lastModified: new Date('2025-11-24'), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/themes`, lastModified: new Date('2025-11-24'), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: new Date('2025-11-24'), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/shop`, lastModified: new Date('2025-11-24'), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date('2025-11-24'), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Dynamic blog posts — use published boolean (not status string)
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, created_at, published')
      .eq('published', true)
      .order('created_at', { ascending: false });

    blogPages = (posts ?? [])
      .filter((post: any) => post.slug)
      .map((post: any) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch {
    // skip if blog fetch fails
  }

  return [...staticPages, ...blogPages];
}

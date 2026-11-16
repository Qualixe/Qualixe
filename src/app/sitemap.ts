import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
//new update  
const BASE_URL = 'https://www.qualixe.com';

// Uses the file's last git commit date as its lastmod — falls back to now if git history is unavailable (e.g. shallow clone).
function getFileLastModified(relativePath: string): Date {
  try {
    const output = execSync(`git log -1 --format=%cI -- "${relativePath}"`, {
      cwd: process.cwd(),
    })
      .toString()
      .trim();
    return output ? new Date(output) : new Date();
  } catch {
    return new Date();
  }
}

const STATIC_PAGE_FILES: { url: string; file: string }[] = [
  { url: BASE_URL, file: 'src/app/(main)/page.tsx' },
  { url: `${BASE_URL}/about`, file: 'src/app/(main)/about/page.tsx' },
  { url: `${BASE_URL}/services`, file: 'src/app/(main)/services/page.tsx' },
  { url: `${BASE_URL}/services/shopify-development`, file: 'src/app/(main)/services/shopify-development/page.tsx' },
  { url: `${BASE_URL}/services/digital-marketing`, file: 'src/app/(main)/services/digital-marketing/page.tsx' },
  { url: `${BASE_URL}/services/shopify-app-development`, file: 'src/app/(main)/services/shopify-app-development/content.ts' },
  { url: `${BASE_URL}/services/laravel-development`, file: 'src/app/(main)/services/laravel-development/content.ts' },
  { url: `${BASE_URL}/services/web-app-development`, file: 'src/app/(main)/services/web-app-development/content.ts' },
  { url: `${BASE_URL}/services/saas-development`, file: 'src/app/(main)/services/saas-development/content.ts' },
  { url: `${BASE_URL}/portfolio`, file: 'src/app/(main)/portfolio/page.tsx' },
  { url: `${BASE_URL}/laravel-projects`, file: 'src/app/(main)/laravel-projects/page.tsx' },
  { url: `${BASE_URL}/themes`, file: 'src/app/(main)/themes/page.tsx' },
  { url: `${BASE_URL}/blog`, file: 'src/app/(main)/blog/page.tsx' },
  { url: `${BASE_URL}/shop`, file: 'src/app/(main)/shop/page.tsx' },
  { url: `${BASE_URL}/shopify-headless`, file: 'src/app/(main)/shopify-headless/page.tsx' },
  { url: `${BASE_URL}/ecommerce-website`, file: 'src/app/(landing)/ecommerce-website/page.tsx' },
  { url: `${BASE_URL}/privacy`, file: 'src/app/(landing)/privacy/page.tsx' },
  { url: `${BASE_URL}/contact`, file: 'src/app/(main)/contact/page.tsx' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = STATIC_PAGE_FILES.map(({ url, file }) => ({
    url,
    lastModified: getFileLastModified(file),
  }));

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
      }));
  } catch {
    // skip if blog fetch fails
  }

  // Laravel project case studies (RLS only exposes published rows to anon)
  let laravelPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: projects } = await supabase
      .from('laravel_projects')
      .select('slug, updated_at, created_at')
      .eq('status', 'published');

    type Row = { slug: string | null; updated_at: string | null; created_at: string };
    laravelPages = ((projects ?? []) as Row[])
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${BASE_URL}/laravel-projects/${p.slug}`,
        lastModified: new Date(p.updated_at || p.created_at),
      }));
  } catch {
    // skip if table missing or fetch fails
  }

  return [...staticPages, ...blogPages, ...laravelPages];
}

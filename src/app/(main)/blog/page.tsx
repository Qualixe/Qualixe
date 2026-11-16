import type { Metadata } from 'next';
import { blogAPI, type BlogPost } from '../../../../lib/api/blog';
import ClosingCta from '../home/sections/ClosingCta';
import BlogExplorer from './BlogExplorer';
import '../home/sections/home.css';
import './blog.css';


const SITE = 'https://www.qualixe.com';
const TITLE = 'Blog – Shopify Guides & E-Commerce Tips | Qualixe';
const DESCRIPTION =
  'Shopify guides, e-commerce growth tips, Laravel and Next.js insights and digital marketing advice from the Qualixe team — practical notes on building stores that sell.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['shopify blog', 'shopify guides', 'ecommerce tips', 'shopify seo', 'digital marketing blog', 'web development blog', 'qualixe blog'],
  alternates: { canonical: `${SITE}/blog` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/blog`,
    type: 'website',
    siteName: 'Qualixe',
    images: [{ url: `${SITE}/assets/img/web-logo.png`, width: 1200, height: 630, alt: 'Qualixe Blog' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  // ?q= comes from the header search ("/blog?q=…")
  const { q } = await searchParams;
  const initialQuery = typeof q === 'string' ? q.slice(0, 100) : '';

  let posts: BlogPost[] = [];
  try {
    posts = ((await blogAPI.getAllPublished()) ?? []) as BlogPost[];
  } catch {
    posts = [];
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${SITE}/blog#blog`,
        url: `${SITE}/blog`,
        name: 'Qualixe Blog',
        description: DESCRIPTION,
        publisher: { '@type': 'Organization', name: 'Qualixe', url: SITE, logo: `${SITE}/assets/img/logo.png` },
        blogPost: posts.slice(0, 20).map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
          url: `${SITE}/blog/${p.slug}`,
          datePublished: p.published_at || p.created_at,
          dateModified: p.updated_at || p.published_at || p.created_at,
          image: p.featured_image || undefined,
          author: { '@type': 'Person', name: p.author_name || 'Qualixe Team' },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
        ],
      },
    ],
  };

  return (
    <main className="bl-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogExplorer key={initialQuery} posts={posts} initialQuery={initialQuery} />

      {/* Same closing call-to-action as the home page */}
      <div className="hx-home">
        <ClosingCta />
      </div>
    </main>
  );
}

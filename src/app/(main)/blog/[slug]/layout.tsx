import type { Metadata } from 'next';
import { blogAPI } from '../../../../../lib/api/blog';

// Generate per-post metadata server-side
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  try {
    const post = await blogAPI.getBySlug(params.slug);
    if (!post) {
      return {
        title: 'Post Not Found | Qualixe Blog',
        description: 'The blog post you are looking for does not exist.',
      };
    }

    const title = post.meta_title || `${post.title} | Qualixe Blog`;
    const description = post.meta_description || post.excerpt || `Read ${post.title} on the Qualixe blog.`;
    const image = post.featured_image || '/assets/img/web-logo.png';
    const url = `https://www.qualixe.com/blog/${post.slug}`;

    return {
      title,
      description,
      keywords: post.meta_keywords || post.tags?.join(', ') || undefined,
      alternates: { canonical: url },
      openGraph: {
        title: post.title,
        description,
        url,
        type: 'article',
        publishedTime: post.published_at || post.created_at,
        authors: [post.author_name || 'Qualixe Team'],
        images: [{ url: image, width: 1200, height: 630, alt: post.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: 'Blog | Qualixe',
      description: 'Read the latest articles on the Qualixe blog.',
    };
  }
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/* eslint-disable @next/next/no-img-element -- featured/author images come from arbitrary CMS URLs */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogAPI, type BlogPost } from '../../../../../lib/api/blog';
import ClosingCta from '../../home/sections/ClosingCta';
import { ArticleProgress, ArticleToc, PostActions, ViewCounter } from './ArticleClient';
import '../../home/sections/home.css';
import '../blog.css';
import './article.css';

export const revalidate = 60;

const SITE = 'https://www.qualixe.com';

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const post = (await blogAPI.getBySlug(slug)) as BlogPost | null;
    return post && post.published ? post : null;
  } catch {
    return null;
  }
}

function readMinutes(html?: string) {
  if (!html) return 1;
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function formatDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();
}

/** Give every H2/H3 an id (for the table of contents) and collect them */
function withHeadingIds(html: string) {
  const toc: { id: string; text: string; level: 2 | 3 }[] = [];
  const used = new Set<string>();
  const out = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, lvl: string, attrs: string, inner: string) => {
    const text = stripTags(inner);
    if (!text) return match;
    const existing = attrs.match(/\sid=["']([^"']+)["']/i)?.[1];
    let id = existing || text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60) || `section-${toc.length + 1}`;
    if (!existing) {
      let n = 2;
      const base = id;
      while (used.has(id)) id = `${base}-${n++}`;
    }
    used.add(id);
    toc.push({ id, text, level: Number(lvl) as 2 | 3 });
    return existing ? match : `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>`;
  });
  return { html: out, toc };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Article not found | Qualixe Blog', robots: { index: false } };

  const title = post.meta_title || `${post.title} | Qualixe Blog`;
  const description =
    post.meta_description || post.excerpt || stripTags(post.content || '').slice(0, 155) || `Read ${post.title} on the Qualixe blog.`;
  const url = `${SITE}/blog/${post.slug}`;
  const image = post.featured_image || `${SITE}/assets/img/web-logo.png`;

  return {
    title,
    description,
    keywords: post.meta_keywords || post.tags?.join(', ') || undefined,
    alternates: { canonical: url },
    authors: [{ name: post.author_name || 'Qualixe Team' }],
    openGraph: {
      title: post.title,
      description,
      url,
      type: 'article',
      siteName: 'Qualixe',
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at || undefined,
      authors: [post.author_name || 'Qualixe Team'],
      section: post.category || undefined,
      tags: post.tags || undefined,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description, images: [image] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { html, toc } = withHeadingIds(post.content || '');
  const mins = readMinutes(post.content);
  const published = post.published_at || post.created_at;
  const url = `${SITE}/blog/${post.slug}`;
  const author = post.author_name || 'Qualixe Team';

  // Related: same category first, then most recent
  let related: BlogPost[] = [];
  try {
    const all = ((await blogAPI.getAllPublished()) ?? []) as BlogPost[];
    const others = all.filter((p) => p.id !== post.id);
    const sameCat = others.filter((p) => post.category && p.category?.toLowerCase() === post.category.toLowerCase());
    related = [...sameCat, ...others.filter((p) => !sameCat.includes(p))].slice(0, 3);
  } catch {
    related = [];
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        headline: post.title,
        description: post.meta_description || post.excerpt || undefined,
        image: post.featured_image ? [post.featured_image] : undefined,
        datePublished: published,
        dateModified: post.updated_at || published,
        wordCount: stripTags(post.content || '').split(/\s+/).filter(Boolean).length,
        articleSection: post.category || undefined,
        keywords: post.tags?.join(', ') || undefined,
        author: { '@type': author === 'Qualixe Team' ? 'Organization' : 'Person', name: author },
        publisher: { '@type': 'Organization', name: 'Qualixe', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/assets/img/logo.png` } },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <main className="ar-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleProgress />
      <ViewCounter postId={post.id} />

      {/* ── Hero ─────────────────────────────────────── */}
      <header className="ar-hero">
        <div className="ar-hero__bg" aria-hidden="true">
          <div className="hx-hero__grid" />
          <div className="hx-hero__aurora hx-hero__aurora--1" />
          <div className="hx-hero__aurora hx-hero__aurora--2" />
          <div className="hx-hero__noise" />
        </div>
        <div className="container">
          <div className="ar-hero__inner">
            <nav className="ar-crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <i className="bi bi-chevron-right" aria-hidden="true" />
              <Link href="/blog">Blog</Link>
              {post.category && (
                <>
                  <i className="bi bi-chevron-right" aria-hidden="true" />
                  <Link href={`/blog?q=${encodeURIComponent(post.category)}`}>{post.category}</Link>
                </>
              )}
            </nav>

            {post.category && <span className="ar-cat">{post.category}</span>}
            <h1 className="ar-title">{post.title}</h1>
            {post.excerpt && <p className="ar-excerpt">{post.excerpt}</p>}

            <div className="ar-meta">
              <span className="ar-author">
                {post.author_avatar ? (
                  <img src={post.author_avatar} alt="" className="ar-author__img" />
                ) : (
                  <span className="ar-author__avatar" aria-hidden="true">{author.charAt(0).toUpperCase()}</span>
                )}
                <span>
                  <strong>{author}</strong>
                  <small>Author</small>
                </span>
              </span>
              <span className="ar-meta__sep" aria-hidden="true" />
              <span className="ar-meta__item"><i className="bi bi-calendar3" aria-hidden="true" /> <time dateTime={published}>{formatDate(published)}</time></span>
              <span className="ar-meta__item"><i className="bi bi-clock" aria-hidden="true" /> {mins} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Featured image ───────────────────────────── */}
      {post.featured_image && (
        <div className="container">
          <figure className="ar-cover">
            <img src={post.featured_image} alt={post.title} fetchPriority="high" />
          </figure>
        </div>
      )}

      {/* ── Body ─────────────────────────────────────── */}
      <div className={`container ar-body${post.featured_image ? '' : ' ar-body--nocover'}`}>
        <div className={`ar-layout${toc.length >= 2 ? '' : ' ar-layout--notoc'}`}>
          <aside className="ar-rail" aria-label="Share this article">
            <PostActions postId={post.id} initialLikes={post.likes || 0} url={url} title={post.title} variant="rail" />
          </aside>

          <article className="ar-article">
            <div className="ar-prose" dangerouslySetInnerHTML={{ __html: html }} />

            {post.tags && post.tags.length > 0 && (
              <div className="ar-tags">
                <i className="bi bi-tags" aria-hidden="true" />
                {post.tags.map((t) => (
                  <Link key={t} href={`/blog?q=${encodeURIComponent(t)}`} className="ar-tag">#{t}</Link>
                ))}
              </div>
            )}

            <div className="ar-actions">
              <span className="ar-actions__label">Found this useful?</span>
              <PostActions postId={post.id} initialLikes={post.likes || 0} url={url} title={post.title} variant="bar" />
            </div>

            <div className="ar-authorbox">
              {post.author_avatar ? (
                <img src={post.author_avatar} alt="" className="ar-authorbox__img" />
              ) : (
                <span className="ar-authorbox__avatar" aria-hidden="true">{author.charAt(0).toUpperCase()}</span>
              )}
              <div>
                <span className="ar-authorbox__label">Written by</span>
                <strong className="ar-authorbox__name">{author}</strong>
                <p>Part of the Qualixe team building Shopify stores, custom apps and web applications for brands in Bangladesh and worldwide.</p>
              </div>
            </div>

            <aside className="ar-cta">
              <div className="ar-cta__glow" aria-hidden="true" />
              <div>
                <strong>Need help putting this into practice?</strong>
                <p>Our team builds and grows Shopify stores every day. Tell us what you&apos;re working on.</p>
              </div>
              <Link href="/contact" className="ar-cta__btn">
                Talk to us <i className="bi bi-arrow-right" aria-hidden="true" />
              </Link>
            </aside>
          </article>

          {toc.length >= 2 && (
            <aside className="ar-toc-wrap">
              <ArticleToc items={toc} />
            </aside>
          )}
        </div>
      </div>

      {/* ── Related ──────────────────────────────────── */}
      {related.length > 0 && (
        <section className="ar-related bl-page" aria-labelledby="ar-related-title">
          <div className="container">
            <div className="ar-related__head">
              <h2 id="ar-related-title" className="ar-related__title">Keep reading</h2>
              <Link href="/blog" className="ar-related__link">All articles <i className="bi bi-arrow-right" aria-hidden="true" /></Link>
            </div>
            <ul className="bl-grid">
              {related.map((p) => (
                <li key={p.id} className="bl-card">
                  <div className="bl-card__media">
                    {p.featured_image ? <img src={p.featured_image} alt="" loading="lazy" /> : <div className="bl-thumb-ph" aria-hidden="true"><i className="bi bi-journal-text" /></div>}
                  </div>
                  <div className="bl-card__body">
                    <div className="bl-meta">
                      {p.category && <span className="bl-meta__cat">{p.category}</span>}
                      <span>{formatDate(p.published_at || p.created_at)}</span>
                      <span>{readMinutes(p.content)} min read</span>
                    </div>
                    <h3 className="bl-card__title"><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
                    {p.excerpt && <p className="bl-card__excerpt">{p.excerpt}</p>}
                  </div>
                  <span className="bl-go bl-go--sm" aria-hidden="true"><i className="bi bi-arrow-up-right" /></span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="hx-home">
        <ClosingCta />
      </div>
    </main>
  );
}

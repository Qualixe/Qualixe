'use client';
/* eslint-disable @next/next/no-img-element -- featured images come from arbitrary CMS URLs */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import CenteredHero from '@/components/CenteredHero';
import type { BlogPost } from '../../../../lib/api/blog';

const PAGE_SIZE = 9;

function readMinutes(html?: string) {
  if (!html) return null;
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function formatDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function PostMeta({ post }: { post: BlogPost }) {
  const mins = readMinutes(post.content);
  return (
    <div className="bl-meta">
      {post.category && <span className="bl-meta__cat">{post.category}</span>}
      <span>{formatDate(post.published_at || post.created_at)}</span>
      {mins && <span>{mins} min read</span>}
    </div>
  );
}

function Thumb({ post, eager }: { post: BlogPost; eager?: boolean }) {
  return post.featured_image ? (
    <img src={post.featured_image} alt="" loading={eager ? 'eager' : 'lazy'} />
  ) : (
    <div className="bl-thumb-ph" aria-hidden="true"><i className="bi bi-journal-text" /></div>
  );
}

export default function BlogExplorer({ posts, initialQuery }: { posts: BlogPost[]; initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('all');
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Unique categories (case-insensitive) with counts
  const categories = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();
    posts.forEach((p) => {
      const c = p.category?.trim();
      if (!c) return;
      const key = c.toLowerCase();
      const cur = map.get(key);
      map.set(key, { label: cur?.label ?? c, count: (cur?.count ?? 0) + 1 });
    });
    return [{ key: 'all', label: 'All', count: posts.length }, ...Array.from(map, ([key, v]) => ({ key, ...v }))];
  }, [posts]);

  const filtering = query.trim() !== '' || category !== 'all';

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const catOk = category === 'all' || p.category?.trim().toLowerCase() === category;
      if (!catOk) return false;
      if (!q) return true;
      return [p.title, p.excerpt, p.category, ...(p.tags ?? [])].some((v) => v?.toLowerCase().includes(q));
    });
  }, [posts, query, category]);

  // Latest post is featured when not filtering
  const featured = !filtering ? filtered[0] : undefined;
  const list = featured ? filtered.slice(1) : filtered;
  const shown = list.slice(0, visible);

  const reset = () => { setQuery(''); setCategory('all'); setVisible(PAGE_SIZE); };

  return (
    <>
      {/* ── Hero (home-page style) ───────────────────── */}
      <CenteredHero
        crumb="Blog"
        pill="Qualixe Insights"
        title="Notes on building stores that sell"
        accent="that sell"
        subtitle="Shopify guides, e-commerce growth tips and lessons from the projects we build — practical advice you can use today."
      >
          <form className="bl-search" role="search" onSubmit={(e) => e.preventDefault()}>
            <i className="bi bi-search" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search articles, topics or tags…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
              aria-label="Search articles"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            )}
          </form>

          {categories.length > 1 && (
            <div className="bl-cats" role="tablist" aria-label="Filter by category">
              {categories.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  role="tab"
                  aria-selected={category === c.key}
                  className={`bl-cat${category === c.key ? ' is-active' : ''}`}
                  onClick={() => { setCategory(c.key); setVisible(PAGE_SIZE); }}
                >
                  {c.label} <span className="bl-cat__count">{c.count}</span>
                </button>
              ))}
            </div>
          )}
      </CenteredHero>

      {/* ── Posts ────────────────────────────────────── */}
      <section className="bl-posts" aria-label="Articles">
        <div className="container">
          {posts.length === 0 ? (
            <div className="bl-empty">
              <i className="bi bi-journal-text" aria-hidden="true" />
              <h2>Articles coming soon</h2>
              <p>We&apos;re writing our first guides. Check back shortly.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bl-empty">
              <i className="bi bi-search" aria-hidden="true" />
              <h2>No articles found</h2>
              <p>{query ? <>No results for &ldquo;{query}&rdquo;.</> : 'Nothing in this category yet.'}</p>
              <button type="button" className="bl-btn" onClick={reset}>Show all articles</button>
            </div>
          ) : (
            <>
              {filtering && (
                <p className="bl-count">
                  {filtered.length} article{filtered.length === 1 ? '' : 's'}
                  {query && <> for &ldquo;{query}&rdquo;</>}
                  <button type="button" onClick={reset}>Clear filters</button>
                </p>
              )}

              {featured && (
                <article className="bl-featured">
                  <div className="bl-featured__media"><Thumb post={featured} eager /></div>
                  <div className="bl-featured__body">
                    <span className="bl-featured__label"><i className="bi bi-stars" aria-hidden="true" /> Latest article</span>
                    <PostMeta post={featured} />
                    <h2 className="bl-featured__title">
                      <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
                    </h2>
                    {featured.excerpt && <p className="bl-featured__excerpt">{featured.excerpt}</p>}
                    <div className="bl-featured__foot">
                      <span className="bl-author">
                        <span className="bl-author__avatar" aria-hidden="true">
                          {(featured.author_name || 'Q').charAt(0).toUpperCase()}
                        </span>
                        {featured.author_name || 'Qualixe Team'}
                      </span>
                      <span className="bl-go" aria-hidden="true"><i className="bi bi-arrow-up-right" /></span>
                    </div>
                  </div>
                </article>
              )}

              {shown.length > 0 && (
                <ul className="bl-grid">
                  {shown.map((post) => (
                    <li key={post.id} className="bl-card">
                      <div className="bl-card__media"><Thumb post={post} /></div>
                      <div className="bl-card__body">
                        <PostMeta post={post} />
                        <h3 className="bl-card__title">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        {post.excerpt && <p className="bl-card__excerpt">{post.excerpt}</p>}
                      </div>
                      <span className="bl-go bl-go--sm" aria-hidden="true"><i className="bi bi-arrow-up-right" /></span>
                    </li>
                  ))}
                </ul>
              )}

              {list.length > visible && (
                <div className="bl-more">
                  <button type="button" className="bl-btn" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    Load more articles <i className="bi bi-arrow-down" aria-hidden="true" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

/* eslint-disable @next/next/no-img-element -- featured images come from arbitrary CMS URLs */
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { BlogPost } from '../../../../../lib/api/blog';

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

export default function InsightsSection({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  const [lead, ...rest] = posts;

  return (
    <section className="hx-section hx-insights" aria-labelledby="hx-insights-title">
      <div className="container">
        <div className="hx-insights__head">
          <div>
            <span className="hx-eyebrow">Insights</span>
            <h2 id="hx-insights-title" className="hx-h2">Notes on building stores that sell</h2>
          </div>
          <Link href="/blog" className="hx-link">
            Read the blog <ArrowRight size={16} />
          </Link>
        </div>

        <div className="hx-insights__grid">
          {[lead, ...rest].map((p, i) => {
            const mins = readMinutes(p.content);
            return (
              <article key={p.id} className={`hx-post${i === 0 ? ' hx-post--lead' : ''}`}>
                <div className="hx-post__media">
                  {p.featured_image ? (
                    <img src={p.featured_image} alt="" loading="lazy" />
                  ) : (
                    <div className="hx-post__ph" aria-hidden="true"><i className="bi bi-journal-text" /></div>
                  )}
                </div>
                <div className="hx-post__body">
                  <div className="hx-post__meta">
                    {p.category && <span className="hx-post__cat">{p.category}</span>}
                    <span>{formatDate(p.published_at || p.created_at)}</span>
                    {mins && <span>{mins} min read</span>}
                  </div>
                  <h3 className="hx-post__title">
                    <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                  </h3>
                  {i === 0 && p.excerpt && <p className="hx-post__excerpt">{p.excerpt}</p>}
                </div>
                <span className="hx-post__go" aria-hidden="true"><ArrowUpRight size={18} /></span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

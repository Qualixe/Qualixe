'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import type { Portfolio } from '../../../../lib/api/portfolio';

const PAGE_SIZE = 9;

function hostOf(url?: string) {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export default function PortfolioShowcase({ items }: { items: Portfolio[] }) {
  const [category, setCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((p) => {
      if (p.category) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    });
    return [{ name: 'All', count: items.length }, ...Array.from(counts, ([name, count]) => ({ name, count }))];
  }, [items]);

  const filtered = useMemo(
    () => (category === 'All' ? items : items.filter((p) => p.category === category)),
    [items, category]
  );
  const shown = filtered.slice(0, visibleCount);
  const remaining = filtered.length - shown.length;

  const selectCategory = (name: string) => {
    setCategory(name);
    setVisibleCount(PAGE_SIZE);
  };

  if (items.length === 0) {
    return (
      <section className="pf-section">
        <div className="container">
          <div className="pf-empty">
            <i className="bi bi-briefcase" aria-hidden="true" />
            <h2>New work coming soon</h2>
            <p>We&apos;re adding our latest projects. Check back shortly.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pf-section">
      <div className="container">
        {categories.length > 2 && (
          <div className="pf-toolbar">
            <div className="pf-cats" role="tablist" aria-label="Filter by category">
              {categories.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  role="tab"
                  aria-selected={category === c.name}
                  className={`pf-cat${category === c.name ? ' is-active' : ''}`}
                  onClick={() => selectCategory(c.name)}
                >
                  {c.name}
                  <span className="pf-cat__count">{c.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pf-grid">
          {shown.map((item, i) => {
            const host = hostOf(item.project_url);
            const hasLink = Boolean(item.project_url);
            return (
              <article key={item.id ?? i} className="pf-card" style={{ '--i': i % PAGE_SIZE } as React.CSSProperties}>
                <div className="pf-card__frame">
                  <div className="pf-card__bar" aria-hidden="true">
                    <span className="pf-card__dots"><i /><i /><i /></span>
                    <span className="pf-card__url">
                      <i className="bi bi-lock-fill" />
                      {host || 'shopify-store'}
                    </span>
                  </div>
                  <div className="pf-card__screen">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={`${item.title} website screenshot`}
                        fill
                        className="pf-card__img"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        priority={i < 3}
                      />
                    ) : (
                      <div className="pf-card__placeholder" aria-hidden="true">
                        <i className="bi bi-image" />
                      </div>
                    )}
                    {hasLink && (
                      <span className="pf-card__hover" aria-hidden="true">
                        Visit live site <ArrowUpRight size={15} />
                      </span>
                    )}
                  </div>
                </div>

                <div className="pf-card__body">
                  <div className="pf-card__meta">
                    {item.category && <span className="pf-card__cat">{item.category}</span>}
                    {item.client && <span>{item.client}</span>}
                  </div>
                  <h3 className="pf-card__title">
                    {hasLink ? (
                      <a href={item.project_url} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </h3>
                  {item.description && <p className="pf-card__desc">{item.description}</p>}
                  {hasLink && (
                    <span className="pf-card__link" aria-hidden="true">
                      {host || 'View project'} <ArrowUpRight size={14} />
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="pf-more">
          <p className="pf-more__count">
            Showing {shown.length} of {filtered.length} project{filtered.length === 1 ? '' : 's'}
          </p>
          {remaining > 0 && (
            <button type="button" className="pf-btn pf-btn--ghost" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
              Load {Math.min(remaining, PAGE_SIZE)} more <ChevronDown size={16} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

'use client';
/* eslint-disable @next/next/no-img-element -- images come from arbitrary CMS URLs */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Search, X } from 'lucide-react';
import type { LaravelProject } from '../../../../lib/api/laravel-projects';

function hostOf(url?: string) {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function BrowserFrame({
  image,
  alt,
  url,
  eager = false,
}: {
  image?: string;
  alt: string;
  url?: string;
  eager?: boolean;
}) {
  const host = hostOf(url);
  return (
    <div className="lp-browser">
      <div className="lp-browser__bar" aria-hidden="true">
        <span className="lp-browser__dots"><i /><i /><i /></span>
        <span className="lp-browser__url">
          <i className="bi bi-lock-fill" />
          {host || 'laravel-app'}
        </span>
      </div>
      <div className="lp-browser__screen">
        {image ? (
          <img src={image} alt={alt} loading={eager ? 'eager' : 'lazy'} />
        ) : (
          <div className="lp-browser__placeholder" aria-hidden="true">
            <div className="lp-ph-side" />
            <div className="lp-ph-main">
              <div className="lp-ph-row lp-ph-row--cards"><span /><span /><span /></div>
              <div className="lp-ph-chart" />
              <div className="lp-ph-row"><span /><span /></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TechChips({ tech, max = 4 }: { tech?: string[]; max?: number }) {
  if (!tech?.length) return null;
  const shown = tech.slice(0, max);
  const rest = tech.length - shown.length;
  return (
    <ul className="lp-chips" aria-label="Tech stack">
      {shown.map((t) => <li key={t} className="lp-chip">{t}</li>)}
      {rest > 0 && <li className="lp-chip lp-chip--more">+{rest}</li>}
    </ul>
  );
}

export default function LaravelShowcase({ projects }: { projects: LaravelProject[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const featured = useMemo(() => projects.find((p) => p.featured), [projects]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => {
      const c = p.category || 'Other';
      counts.set(c, (counts.get(c) ?? 0) + 1);
    });
    return [{ name: 'All', count: projects.length }, ...Array.from(counts, ([name, count]) => ({ name, count }))];
  }, [projects]);

  const filtering = query.trim() !== '' || category !== 'All';

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      // The spotlight project is shown above, so skip it in the unfiltered grid
      if (!filtering && featured && p.id === featured.id) return false;
      const catOk = category === 'All' || (p.category || 'Other') === category;
      if (!catOk) return false;
      if (!q) return true;
      return [p.title, p.client_name, p.short_description, p.category, p.industry, ...(p.tech_stack ?? [])]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
  }, [projects, query, category, filtering, featured]);

  const reset = () => { setQuery(''); setCategory('All'); };

  if (projects.length === 0) {
    return (
      <section className="lp-section">
        <div className="container">
          <div className="lp-empty">
            <i className="bi bi-hourglass-split" aria-hidden="true" />
            <h2>Case studies coming soon</h2>
            <p>We&apos;re putting together write-ups of our latest Laravel work. Check back shortly.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ── Featured spotlight ───────────────────────── */}
      {featured && !filtering && (
        <section className="lp-section lp-section--featured">
          <div className="container">
            <article className="lp-featured">
              <Link href={`/laravel-projects/${featured.slug}`} className="lp-featured__media" tabIndex={-1} aria-hidden="true">
                <BrowserFrame image={featured.cover_image} alt="" url={featured.live_url} eager />
              </Link>
              <div className="lp-featured__body">
                <span className="lp-featured__label"><i className="bi bi-star-fill" /> Featured project</span>
                <div className="lp-meta">
                  {featured.category && <span>{featured.category}</span>}
                  {featured.year && <span>{featured.year}</span>}
                </div>
                <h2 className="lp-featured__title">
                  <Link href={`/laravel-projects/${featured.slug}`}>{featured.title}</Link>
                </h2>
                {featured.short_description && <p className="lp-featured__desc">{featured.short_description}</p>}

                {featured.results && featured.results.length > 0 && (
                  <dl className="lp-featured__results">
                    {featured.results.slice(0, 3).map((r, i) => (
                      <div key={i}><dt>{r.label}</dt><dd>{r.value}</dd></div>
                    ))}
                  </dl>
                )}

                <TechChips tech={featured.tech_stack} max={6} />

                <div className="lp-featured__actions">
                  <Link href={`/laravel-projects/${featured.slug}`} className="lp-btn lp-btn--primary">
                    View case study <ArrowRight size={16} />
                  </Link>
                  {featured.live_url && (
                    <a href={featured.live_url} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn--ghost">
                      Visit site <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* ── Toolbar + grid ─────────────────────────────
          Hidden when the only project is already in the featured spotlight
          (otherwise the grid would show a misleading "no projects" message). */}
      {(filtering || visible.length > 0) && (
      <section className="lp-section lp-section--grid">
        <div className="container">
          {projects.length > 1 && (
          <div className="lp-toolbar">
            <div className="lp-cats" role="tablist" aria-label="Filter by category">
              {categories.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  role="tab"
                  aria-selected={category === c.name}
                  className={`lp-cat${category === c.name ? ' is-active' : ''}`}
                  onClick={() => setCategory(c.name)}
                >
                  {c.name}
                  <span className="lp-cat__count">{c.count}</span>
                </button>
              ))}
            </div>

            <label className="lp-search">
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search projects or tech…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search projects"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </label>
          </div>
          )}

          {/* ── Grid ───────────────────────────────────── */}
          {visible.length === 0 ? (
            <div className="lp-empty lp-empty--inline">
              <p>No projects match your filters.</p>
              <button type="button" className="lp-btn lp-btn--ghost" onClick={reset}>Reset filters</button>
            </div>
          ) : (
            <div className="lp-grid">
              {visible.map((p) => (
                <article key={p.id} className="lp-card">
                  <Link href={`/laravel-projects/${p.slug}`} className="lp-card__media" tabIndex={-1} aria-hidden="true">
                    <BrowserFrame image={p.cover_image} alt="" url={p.live_url} />
                    <span className="lp-card__overlay">
                      View case study <ArrowUpRight size={16} />
                    </span>
                  </Link>
                  <div className="lp-card__body">
                    <div className="lp-meta">
                      {p.category && <span>{p.category}</span>}
                      {p.year && <span>{p.year}</span>}
                    </div>
                    <h3 className="lp-card__title">
                      <Link href={`/laravel-projects/${p.slug}`}>{p.title}</Link>
                    </h3>
                    {p.short_description && <p className="lp-card__desc">{p.short_description}</p>}
                    <TechChips tech={p.tech_stack} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      )}
    </>
  );
}

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ClientsGrid from '../home/Clients';
import { portfolioAPI, type Portfolio } from '../../../../lib/api/portfolio';
import PortfolioShowcase from './PortfolioShowcase';
import './portfolio.css';

export { metadata } from './metadata';

export const revalidate = 60;

export default async function PortfolioPage() {
  let items: Portfolio[] = [];
  try {
    items = ((await portfolioAPI.getAll()) ?? []) as Portfolio[];
  } catch {
    items = [];
  }

  const categoryCount = new Set(items.map((p) => p.category).filter(Boolean)).size;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Qualixe Portfolio',
    url: 'https://www.qualixe.com/portfolio',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        url: p.project_url || undefined,
      })),
    },
  };

  return (
    <main className="pf-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="pf-hero">
        <div className="pf-hero__bg" aria-hidden="true" />
        <div className="container">
          <span className="pf-eyebrow">
            <span className="pf-eyebrow__dot" aria-hidden="true" /> Our Work
          </span>
          <h1 className="pf-hero__title">
            Stores we&apos;ve designed, built <span className="pf-accent">&amp; launched</span>
          </h1>
          <p className="pf-hero__sub">
            A collection of Shopify stores and e-commerce experiences crafted for brands across
            Bangladesh and worldwide — each one built to look sharp and sell more.
          </p>

          <nav className="pf-switch" aria-label="Portfolio type">
            <span className="pf-switch__item is-active" aria-current="page">
              <i className="bi bi-bag-check" aria-hidden="true" /> Shopify &amp; E-commerce
            </span>
            <Link href="/laravel-projects" className="pf-switch__item">
              <i className="bi bi-code-square" aria-hidden="true" /> Laravel Applications
            </Link>
          </nav>

          {items.length > 0 && (
            <dl className="pf-hero__stats">
              <div><dt>Projects delivered</dt><dd>{items.length}</dd></div>
              {categoryCount > 1 && <div><dt>Categories</dt><dd>{categoryCount}</dd></div>}
            </dl>
          )}
        </div>
      </section>

      <PortfolioShowcase items={items} />

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="pf-cta-section">
        <div className="container">
          <div className="pf-cta">
            <div className="pf-cta__glow" aria-hidden="true" />
            <div className="pf-cta__text">
              <h2>Want your store to be next?</h2>
              <p>
                Tell us about your brand and goals — we&apos;ll come back with a plan, timeline
                and a clear quote.
              </p>
            </div>
            <Link href="/contact" className="pf-btn pf-btn--light">
              Get a free quote <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <ClientsGrid />
    </main>
  );
}

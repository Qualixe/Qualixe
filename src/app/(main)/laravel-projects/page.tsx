import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { laravelProjectsAPI, type LaravelProject } from '../../../../lib/api/laravel-projects';
import LaravelShowcase from './LaravelShowcase';
import './laravel-projects.css';

export const revalidate = 60;

const URL = 'https://www.qualixe.com/laravel-projects';

export const metadata: Metadata = {
  title: 'Laravel Projects – Custom Web Applications We\'ve Built | Qualixe',
  description:
    'Explore custom Laravel web applications built by Qualixe — SaaS platforms, dashboards, ERPs, booking systems and APIs engineered for performance and scale.',
  keywords: ['laravel development', 'laravel portfolio', 'custom web application', 'laravel agency bangladesh', 'saas development'],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Laravel Projects | Qualixe',
    description: 'Custom Laravel web applications, SaaS platforms and dashboards built by Qualixe.',
    url: URL,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Laravel Projects | Qualixe',
    description: 'Custom Laravel web applications built by Qualixe.',
  },
};

export default async function LaravelProjectsPage() {
  let projects: LaravelProject[] = [];
  try {
    projects = await laravelProjectsAPI.getPublished();
  } catch {
    projects = [];
  }

  const techCount = new Set(projects.flatMap((p) => p.tech_stack ?? [])).size;
  const industryCount = new Set(projects.map((p) => p.industry || p.category).filter(Boolean)).size;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Laravel Projects by Qualixe',
    url: URL,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${URL}/${p.slug}`,
        name: p.title,
      })),
    },
  };

  return (
    <main className="lp-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero__bg" aria-hidden="true" />
        <div className="container">
          <span className="lp-eyebrow">
            <i className="bi bi-code-square" aria-hidden="true" /> Laravel Development
          </span>
          <h1 className="lp-hero__title">
            Web applications engineered <span className="lp-accent">with Laravel</span>
          </h1>
          <p className="lp-hero__sub">
            A selection of custom platforms, dashboards and SaaS products we&apos;ve designed, built
            and shipped — fast, secure and built to scale with the business behind them.
          </p>

          {projects.length > 0 && (
            <dl className="lp-hero__stats">
              <div><dt>Projects shipped</dt><dd>{projects.length}</dd></div>
              {industryCount > 0 && <div><dt>Industries</dt><dd>{industryCount}</dd></div>}
              {techCount > 0 && <div><dt>Technologies</dt><dd>{techCount}</dd></div>}
            </dl>
          )}
        </div>
      </section>

      <LaravelShowcase projects={projects} />

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="lp-cta-section">
        <div className="container">
          <div className="lp-cta">
            <div className="lp-cta__glow" aria-hidden="true" />
            <div className="lp-cta__text">
              <h2>Have a Laravel project in mind?</h2>
              <p>
                From MVPs to complex business systems — tell us what you&apos;re building and
                we&apos;ll help you plan, design and ship it.
              </p>
            </div>
            <Link href="/contact" className="lp-btn lp-btn--light">
              Start your project <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

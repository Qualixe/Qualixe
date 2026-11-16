import type { Metadata } from 'next';
import Link from 'next/link';
import NextImage from 'next/image';
import PageBanner from '@/components/PageBanner';
import { getShopifyServicePage, type ShopifyServicePage } from '../../../../lib/api/shopify-service';
import { getDigitalMarketingPage } from '../../../../lib/api/digital-marketing-service';
import { FALLBACK as SHOPIFY_FALLBACK } from './shopify-development/fallback';
import { FALLBACK as MARKETING_FALLBACK } from './digital-marketing/fallback';
import { CONTENT as SHOPIFY_APPS } from './shopify-app-development/content';
import { CONTENT as LARAVEL } from './laravel-development/content';
import { CONTENT as WEB_APPS } from './web-app-development/content';
import { CONTENT as SAAS } from './saas-development/content';
import { SERVICES, SERVICE_ORDER, SITE, type ServiceSlug } from './serviceConfig';
import { HEADLESS_SERVICE } from '@/lib/services';
import ServiceReveal from './ServiceReveal';
import './service-page.css';

export const revalidate = 60;

const TITLE = 'Shopify, Laravel, SaaS & Web App Services | Qualixe';
const DESCRIPTION =
  'Qualixe services: Shopify stores and apps, Laravel development, Node.js & Next.js web apps, SaaS products and digital marketing for growing brands.';
const URL = `${SITE}/services`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'shopify development services',
    'shopify app development',
    'laravel development services',
    'next.js development',
    'node.js development',
    'saas development',
    'digital marketing services',
    'headless shopify',
    'web development agency bangladesh',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: 'website',
    siteName: 'Qualixe',
    images: [{ url: `${SITE}/assets/img/service-hero.jpg`, width: 1920, height: 1440, alt: 'Qualixe services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE}/assets/img/service-hero.jpg`],
  },
};

const ORDER = SERVICE_ORDER;

const EXTRAS = [
  {
    href: HEADLESS_SERVICE.href,
    name: HEADLESS_SERVICE.name,
    text: HEADLESS_SERVICE.blurb,
    icon: HEADLESS_SERVICE.icon,
    tags: HEADLESS_SERVICE.tags,
  },
  {
    href: '/laravel-projects',
    name: 'Laravel Project Showcase',
    text: 'See the Laravel websites, dashboards and web applications we have designed, built and shipped.',
    icon: 'bi-collection',
    tags: ['Case studies', 'Laravel', 'Live projects'],
  },
];

export default async function ServicesPage() {
  const [shopify, marketing] = await Promise.all([
    getShopifyServicePage().catch(() => null),
    getDigitalMarketingPage().catch(() => null),
  ]);
  const content: Record<ServiceSlug, ShopifyServicePage> = {
    'shopify-development': shopify ?? SHOPIFY_FALLBACK,
    'shopify-app-development': SHOPIFY_APPS,
    'laravel-development': LARAVEL,
    'web-app-development': WEB_APPS,
    'saas-development': SAAS,
    'digital-marketing': marketing ?? MARKETING_FALLBACK,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${URL}#webpage`,
        url: URL,
        name: TITLE,
        description: DESCRIPTION,
        breadcrumb: { '@id': `${URL}#breadcrumb` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: [
            ...ORDER.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Service',
                name: `${SERVICES[s].name} Services`,
                url: `${SITE}/services/${s}`,
                description: SERVICES[s].blurb,
                provider: { '@type': 'Organization', name: 'Qualixe', url: SITE },
              },
            })),
            ...EXTRAS.map((e, i) => ({
              '@type': 'ListItem',
              position: ORDER.length + i + 1,
              item: { '@type': 'Service', name: e.name, url: `${SITE}${e.href}`, description: e.text },
            })),
          ],
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${URL}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Services', item: URL },
        ],
      },
    ],
  };

  return (
    <main className="sv-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ServiceReveal />

      <PageBanner
        eyebrow="What we do"
        heading="Commerce & software, built to grow"
        accent="built to grow"
        subtitle="Shopify stores and apps, Laravel and Node.js web applications, SaaS products and digital marketing — one team from first idea to scaling sales."
        breadcrumb={[{ label: 'Services' }]}
      />

      {/* ── Core services ─────────────────────────────── */}
      <section className="sv-section sx-list" aria-label="Core services">
        <div className="container">
          {ORDER.map((slug, i) => {
            const cfg = SERVICES[slug];
            const page = content[slug];
            return (
              <article key={slug} className={`sx-row${i % 2 ? ' sx-row--flip' : ''}`} data-reveal>
                <div className="sx-row__media">
                  <NextImage
                    src={cfg.image.src}
                    alt={cfg.image.alt}
                    width={cfg.image.width}
                    height={cfg.image.height}
                    sizes="(max-width: 991px) 92vw, 560px"
                    className="sx-row__img"
                    priority={i === 0}
                  />
                  <span className="sx-row__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="sx-row__body">
                  <span className="sx-row__icon" aria-hidden="true"><i className={`bi ${cfg.icon}`} /></span>
                  <h2 className="sx-row__title">
                    <Link href={`/services/${slug}`}>{cfg.name}</Link>
                  </h2>
                  <p className="sx-row__text">{page.hero.heading}. {cfg.blurb}</p>
                  <ul className="sx-row__list">
                    {page.services.items.slice(0, 6).map((s) => (
                      <li key={s.title}>
                        <i className={`bi ${s.icon}`} aria-hidden="true" />
                        {s.title}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/services/${slug}`} className="sv-btn sv-btn--primary sx-row__cta">
                    Explore {cfg.name}
                    <span className="sv-btn__icon" aria-hidden="true"><i className="bi bi-arrow-right" /></span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Specialist builds ─────────────────────────── */}
      <section className="sv-section sv-offer" aria-labelledby="sx-extra-title">
        <div className="container">
          <header className="sv-head sv-head--split" data-reveal>
            <div>
              <span className="sv-eyebrow">More from Qualixe</span>
              <h2 id="sx-extra-title" className="sv-h2">Headless commerce &amp; real project work</h2>
            </div>
            <p className="sv-lead">Go beyond themes with a custom storefront, or browse applications we have already shipped.</p>
          </header>
          <ul className="sx-extras">
            {EXTRAS.map((e) => (
              <li key={e.href} className="sx-extra" data-reveal>
                <span className="sv-offer__icon" aria-hidden="true"><i className={`bi ${e.icon}`} /></span>
                <h3 className="sx-extra__title"><Link href={e.href}>{e.name}</Link></h3>
                <p className="sx-extra__text">{e.text}</p>
                <ul className="sx-extra__tags">
                  {e.tags.map((t) => <li key={t}>{t}</li>)}
                </ul>
                <span className="sv-related__go sx-extra__go" aria-hidden="true"><i className="bi bi-arrow-up-right" /></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="sv-cta" aria-labelledby="sx-cta-title">
        <div className="sv-cta__bg" aria-hidden="true">
          <div className="sv-cta__orb sv-cta__orb--1" />
          <div className="sv-cta__orb sv-cta__orb--2" />
          <div className="sv-hero__grid sv-cta__grid" />
        </div>
        <div className="container">
          <div className="sv-cta__inner" data-reveal>
            <h2 id="sx-cta-title" className="sv-cta__title">Not sure where to start?</h2>
            <p className="sv-cta__text">
              Tell us about your brand and goals — we&apos;ll recommend the right mix of services and send a clear plan and quote.
            </p>
            <div className="sv-cta__actions">
              <Link href="/contact" className="sv-btn sv-btn--glow">
                Get a free quote
                <span className="sv-btn__icon" aria-hidden="true"><i className="bi bi-arrow-right" /></span>
              </Link>
              <a href="https://wa.me/8801318552266" target="_blank" rel="noopener noreferrer" className="sv-btn sv-btn--glass">
                <i className="bi bi-whatsapp sv-wa" aria-hidden="true" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

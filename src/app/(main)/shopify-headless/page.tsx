import type { Metadata } from 'next';
import Image from 'next/image';
import SpeedAuditForm from './SpeedAuditForm';
import Faq from './Faq';
import CalendlyEmbed from './CalendlyEmbed';
import './ShopifyHeadless.css';

export const metadata: Metadata = {
  title: 'Shopify Headless Development Agency | Qualixe',
  description:
    'Turn your slow, template-based Shopify store into a fast, custom headless storefront that converts better. USA ecommerce brands — free speed audit, 4–8 week delivery.',
  keywords: [
    'shopify headless development',
    'headless commerce agency',
    'headless shopify storefront',
    'shopify headless agency',
    'custom shopify storefront',
    'shopify performance optimization',
  ],
  alternates: { canonical: 'https://www.qualixe.com/shopify-headless' },
  openGraph: {
    title: 'Shopify Headless Development — Built for Speed, Built to Scale',
    description:
      'We turn slow, template-based Shopify stores into fast, custom headless storefronts that convert better.',
    url: 'https://www.qualixe.com/shopify-headless',
    type: 'website',
    images: [{ url: '/assets/img/service-hero.jpg', width: 1200, height: 630, alt: 'Shopify Headless Development – Qualixe' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shopify Headless Development — Built for Speed, Built to Scale',
    description: 'Fast, custom headless Shopify storefronts for USA ecommerce brands.',
    images: ['/assets/img/service-hero.jpg'],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Shopify Headless Development',
    description:
      'Custom headless Shopify storefront development for USA-based ecommerce brands — built for speed and conversion.',
    provider: {
      '@type': 'Organization',
      name: 'Qualixe',
      url: 'https://www.qualixe.com',
      logo: 'https://www.qualixe.com/assets/img/logo.png',
    },
    serviceType: 'Shopify Headless Development',
    areaServed: 'US',
    url: 'https://www.qualixe.com/shopify-headless',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.qualixe.com' },
      { '@type': 'ListItem', position: 2, name: 'Shopify Headless Development', item: 'https://www.qualixe.com/shopify-headless' },
    ],
  },
];

export default function ShopifyHeadlessPage() {
  return (
    <div className="sh-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO */}
      <section className="sh-hero">
        <div className="container">
          <div className="sh-hero-inner">
            <div className="sh-hero-text">
              <h1>
                Shopify Headless<br />
                <span className="sh-hero-heading--accent">
                  Development — Built for Speed, Built to Scale
                </span>
              </h1>
              <p>
                We turn slow, template-based Shopify stores into fast, custom headless
                storefronts that convert better.
              </p>
              <div className="sh-hero-btns">
                <a
                  href="https://fashion.qualixe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sh-btn-primary"
                >
                  See Live Demo <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                </a>
                <a href="#sh-lead-heading" className="sh-btn-secondary">
                  Get a Free Speed Audit <i className="bi bi-arrow-right" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="sh-hero-visual">
              <Image
                src="/assets/img/headless-hero.svg"
                alt="Illustration of a headless ecommerce storefront on a laptop with a shopping cart"
                width={1000}
                height={1000}
                className="sh-hero-img"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. BEFORE/AFTER SPEED COMPARISON */}
      <section className="sh-compare" aria-labelledby="sh-compare-heading">
        <div className="container">
          <span className="sh-eyebrow d-block text-center">PageSpeed Insights Score (0–100)</span>
          <h2 id="sh-compare-heading" className="text-center">Before vs. After</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="sh-score-card sh-score-card--before">
                <i className="bi bi-hourglass-split sh-score-icon sh-score-icon--before" aria-hidden="true" />
                <h3>Typical Shopify Store</h3>
                <div
                  className="sh-gauge"
                  role="progressbar"
                  aria-valuenow={38}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Typical Shopify store PageSpeed score: 38 out of 100"
                >
                  <div className="sh-gauge-fill sh-gauge-fill--before" style={{ width: '38%' }} />
                  <div className="sh-gauge-marker" style={{ left: '50%' }} aria-hidden="true">
                    <span className="sh-gauge-marker-label">average store</span>
                  </div>
                </div>
                <span className="sh-score-value sh-score-value--before">38/100</span>
                {/* TODO: placeholder load time — swap for the real number once we test the demo store */}
                <p className="sh-score-translation">~5.2s to load — visitors start leaving</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-5">
              <div className="sh-score-card sh-score-card--after">
                <i className="bi bi-lightning-charge-fill sh-score-icon sh-score-icon--after" aria-hidden="true" />
                <h3>Headless Shopify Store</h3>
                <div
                  className="sh-gauge"
                  role="progressbar"
                  aria-valuenow={96}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Headless Shopify store PageSpeed score: 96 out of 100"
                >
                  <div className="sh-gauge-fill sh-gauge-fill--after" style={{ width: '96%' }} />
                  <div className="sh-gauge-marker" style={{ left: '50%' }} aria-hidden="true">
                    <span className="sh-gauge-marker-label">average store</span>
                  </div>
                </div>
                <span className="sh-score-value sh-score-value--after">96/100</span>
                {/* TODO: placeholder load time — swap for the real number once we test the demo store */}
                <p className="sh-score-translation">~0.6s to load — feels instant</p>
              </div>
            </div>
          </div>
          <p className="sh-compare-note text-center">
            Scores measured via Google PageSpeed Insights
          </p>
        </div>
      </section>

      {/* 3. LIVE DEMO */}
      <section id="demo" className="sh-demo" aria-labelledby="sh-demo-heading">
        <div className="container">
          <h2 id="sh-demo-heading" className="text-center">See It In Action</h2>
          <div className="sh-demo-frame">
            <div className="sh-demo-frame-bar" aria-hidden="true">
              <span className="sh-demo-dot" />
              <span className="sh-demo-dot" />
              <span className="sh-demo-dot" />
              <span className="sh-demo-frame-url">fashion.qualixe.com</span>
            </div>
            <div className="sh-demo-frame-body">
              {/* Mock storefront preview — gives the frame real content instead of empty space */}
              <div className="sh-demo-mock" aria-hidden="true">
                <div className="sh-demo-mock-nav">
                  <span className="sh-demo-mock-logo" />
                  <span className="sh-demo-mock-navlink" />
                  <span className="sh-demo-mock-navlink" />
                  <span className="sh-demo-mock-navlink" />
                  <i className="bi bi-cart3" />
                </div>
                <div className="sh-demo-mock-banner" />
                <div className="sh-demo-mock-grid">
                  <div className="sh-demo-mock-card" />
                  <div className="sh-demo-mock-card" />
                  <div className="sh-demo-mock-card" />
                  <div className="sh-demo-mock-card" />
                </div>
              </div>
              <div className="sh-demo-overlay" aria-hidden="true" />
              <a
                href="https://fashion.qualixe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="sh-btn-primary sh-demo-cta"
              >
                Visit Live Demo <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
              </a>
            </div>
          </div>
          <p className="sh-demo-caption text-center">
            A fully headless Shopify storefront built by Qualixe — browse it like a real
            customer would.
          </p>
        </div>
      </section>

      {/* 4. PROCESS */}
      <section className="sh-process" aria-labelledby="sh-process-heading">
        <div className="container">
          <span className="sh-eyebrow d-block text-center">Our Process</span>
          <h2 id="sh-process-heading" className="text-center">From Slow Store to Headless — Step by Step</h2>
          <div className="sh-process-steps">
            <div className="sh-process-rail" aria-hidden="true" />
            <div className="sh-process-step">
              <div className="sh-process-icon-circle">
                <span className="sh-process-number">1</span>
                <i className="bi bi-search-heart" aria-hidden="true" />
              </div>
              <h3>Discovery &amp; Audit</h3>
              <p>We review your current store and map what headless will improve.</p>
            </div>
            <div className="sh-process-step">
              <div className="sh-process-icon-circle">
                <span className="sh-process-number">2</span>
                <i className="bi bi-palette" aria-hidden="true" />
              </div>
              <h3>Design &amp; Architecture</h3>
              <p>Custom storefront design, built on your brand and Shopify&apos;s product data.</p>
            </div>
            <div className="sh-process-step">
              <div className="sh-process-icon-circle">
                <span className="sh-process-number">3</span>
                <i className="bi bi-code-slash" aria-hidden="true" />
              </div>
              <h3>Development &amp; Testing</h3>
              <p>Build, performance testing, and cross-device QA before launch.</p>
            </div>
            <div className="sh-process-step">
              <div className="sh-process-icon-circle">
                <span className="sh-process-number">4</span>
                <i className="bi bi-rocket-takeoff" aria-hidden="true" />
              </div>
              <h3>Launch &amp; Support</h3>
              <p>Go live, plus post-launch support to handle anything that comes up.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4b. FAQ */}
      <section className="sh-faq" aria-labelledby="sh-faq-heading">
        <div className="container">
          <span className="sh-eyebrow d-block text-center">FAQ</span>
          <h2 id="sh-faq-heading" className="text-center">Common Questions</h2>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <Faq />
            </div>
          </div>
        </div>
      </section>

      {/* 5. LEAD CAPTURE FORM + CALENDLY */}
      <section className="sh-lead" aria-labelledby="sh-lead-heading">
        <div className="container">
          <h2 id="sh-lead-heading" className="text-center">Request Your Free Speed Audit</h2>
          <div className="sh-lead-grid">
            <div className="sh-lead-option">
              <span className="sh-lead-option-label">Send us a message</span>
              <div className="sh-lead-card">
                <SpeedAuditForm />
              </div>
            </div>

            <div className="sh-lead-divider" aria-hidden="true">
              <span className="sh-lead-divider-line" />
              <span className="sh-lead-divider-text">OR</span>
              <span className="sh-lead-divider-line" />
            </div>

            <div className="sh-lead-option">
              <span className="sh-lead-option-label">Or book a call directly</span>
              <div className="sh-lead-card sh-lead-card--calendly">
                <h3 className="sh-lead-calendly-heading">Pick a time that works for you</h3>
                <CalendlyEmbed />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CAPABILITIES = [
  'Shopify Development',
  'Shopify Apps',
  'Custom Themes',
  'Headless Commerce',
  'Laravel',
  'Node.js',
  'Next.js',
  'SaaS Products',
  'E-commerce SEO',
  'Digital Marketing',
];

/** Giant scrolling list of capabilities */
export function CapabilityMarquee() {
  const words = [...CAPABILITIES, ...CAPABILITIES];
  return (
    <section className="hx-bigmarquee" aria-label="What we do">
      <div className="hx-bigmarquee__track">
        {words.map((w, i) => (
          <span key={i} className={i % 2 ? 'is-outline' : ''} aria-hidden={i >= CAPABILITIES.length ? true : undefined}>
            {w}
            <i className="bi bi-asterisk" aria-hidden="true" />
          </span>
        ))}
      </div>
    </section>
  );
}

export default function ClosingCta() {
  return (
    <>
      {/* Closing CTA */}
      <section className="hx-cta" aria-labelledby="hx-cta-title">
        <div className="hx-cta__bg" aria-hidden="true">
          <div className="hx-cta__orb hx-cta__orb--1" />
          <div className="hx-cta__orb hx-cta__orb--2" />
          <div className="hx-cta__orb hx-cta__orb--3" />
          <div className="hx-hero__grid" />
        </div>
        <div className="container">
          <div className="hx-cta__inner">
            <span className="hx-pill">
              <span className="hx-pill__dot" aria-hidden="true" /> Ready when you are
            </span>
            <h2 id="hx-cta-title" className="hx-cta__title">
              Let&apos;s build a store <br className="d-none d-md-block" />
              <span className="hx-gradient-text">that actually sells.</span>
            </h2>
            <p className="hx-cta__text">
              Tell us where your brand is headed. We&apos;ll come back with a plan, a timeline and a clear quote.
            </p>
            <div className="hx-cta__actions">
              <Link href="/contact" className="hx-btn hx-btn--glow hx-btn--lg">
                <span>Start your project</span>
                <span className="hx-btn__icon" aria-hidden="true"><ArrowRight size={18} /></span>
              </Link>
              <a
                href="https://wa.me/8801318552266"
                target="_blank"
                rel="noopener noreferrer"
                className="hx-btn hx-btn--glass hx-btn--lg"
              >
                <i className="bi bi-whatsapp" aria-hidden="true" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

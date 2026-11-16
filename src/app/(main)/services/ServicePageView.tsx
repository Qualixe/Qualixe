import Link from 'next/link';
import NextImage from 'next/image';
import type { ShopifyServicePage } from '../../../../lib/api/shopify-service';
import { SERVICES, SERVICE_ORDER, type ServiceConfig, type ServiceSlug } from './serviceConfig';
import { HEADLESS_SERVICE } from '@/lib/services';
import ServiceReveal from './ServiceReveal';
import './service-page.css';

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

/** First sentence → large lead, remainder → supporting copy */
function splitLead(text: string) {
  const sub = (text || '').trim();
  const stop = sub.search(/[.!?](\s|$)/);
  if (stop <= 0) return { lead: sub, rest: '' };
  return { lead: sub.slice(0, stop + 1), rest: sub.slice(stop + 1).trim() };
}

const HEADLESS_RELATED = {
  href: HEADLESS_SERVICE.href,
  name: HEADLESS_SERVICE.name,
  blurb: HEADLESS_SERVICE.blurb,
  icon: HEADLESS_SERVICE.icon,
};

const LARAVEL_SHOWCASE = {
  href: '/laravel-projects',
  name: 'Laravel Project Showcase',
  blurb: 'Browse Laravel applications we have designed, built and shipped.',
  icon: 'bi-collection',
};

export default function ServicePageView({ cfg, page }: { cfg: ServiceConfig; page: ShopifyServicePage }) {
  const { hero, services, process, why_us, faq, cta } = page;
  const { lead, rest } = splitLead(hero.subheading);

  const related = [
    ...(cfg.slug === 'laravel-development' ? [LARAVEL_SHOWCASE] : []),
    ...SERVICE_ORDER
      .filter((s: ServiceSlug) => s !== cfg.slug)
      .map((s) => ({ href: `/services/${s}`, name: SERVICES[s].name, blurb: SERVICES[s].blurb, icon: SERVICES[s].icon })),
    HEADLESS_RELATED,
  ].slice(0, 6);

  return (
    <main className="sv-page">
      <ServiceReveal />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="sv-hero" aria-labelledby="sv-title">
        <div className="sv-hero__bg" aria-hidden="true">
          <div className="sv-hero__grid" />
          <div className="sv-hero__glow sv-hero__glow--1" />
          <div className="sv-hero__glow sv-hero__glow--2" />
        </div>

        <div className="container">
          <nav className="sv-crumbs sv-anim" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li aria-current="page">{cfg.name}</li>
            </ol>
          </nav>

          <div className="sv-hero__inner">
            <div className="sv-hero__text">
              <span className="sv-badge sv-anim" style={{ '--d': '40ms' } as CSSVars}>
                <span className="sv-badge__icon" aria-hidden="true"><i className={`bi ${cfg.badgeIcon}`} /></span>
                {hero.badge}
              </span>

              <h1 id="sv-title" className="sv-hero__title sv-anim" style={{ '--d': '100ms' } as CSSVars}>
                {hero.heading}
              </h1>

              {lead && <p className="sv-hero__lead sv-anim" style={{ '--d': '160ms' } as CSSVars}>{lead}</p>}
              {rest && <p className="sv-hero__desc sv-anim" style={{ '--d': '200ms' } as CSSVars}>{rest}</p>}

              <div className="sv-hero__actions sv-anim" style={{ '--d': '260ms' } as CSSVars}>
                <Link href={hero.cta_url} className="sv-btn sv-btn--primary">
                  {hero.cta_text}
                  <span className="sv-btn__icon" aria-hidden="true"><i className="bi bi-arrow-right" /></span>
                </Link>
                <a href="https://wa.me/8801318552266" target="_blank" rel="noopener noreferrer" className="sv-btn sv-btn--ghost">
                  <i className="bi bi-whatsapp sv-wa" aria-hidden="true" /> Chat on WhatsApp
                </a>
              </div>

              {hero.highlights && hero.highlights.length > 0 && (
                <ul className="sv-highlights sv-anim" style={{ '--d': '320ms' } as CSSVars}>
                  {hero.highlights.map((h, i) => (
                    <li key={i}>
                      <span className="sv-highlights__check" aria-hidden="true"><i className="bi bi-check-lg" /></span>
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="sv-hero__visual sv-anim" style={{ '--d': '180ms' } as CSSVars}>
              <div className="sv-visual">
                <div className="sv-visual__backdrop" aria-hidden="true" />
                <div className="sv-visual__dots" aria-hidden="true" />
                <div className="sv-visual__frame">
                  <NextImage
                    src={cfg.image.src}
                    alt={cfg.image.alt}
                    width={cfg.image.width}
                    height={cfg.image.height}
                    sizes="(max-width: 991px) 92vw, 540px"
                    className="sv-visual__img"
                    priority
                  />
                </div>
                {cfg.chips.map((c, i) => (
                  <div key={c.title} className={`sv-float sv-float--${i === 0 ? 'top' : 'bottom'}`} aria-hidden="true">
                    <span className={`sv-float__icon sv-float__icon--${c.tone ?? 'blue'}`}><i className={`bi ${c.icon}`} /></span>
                    <span><strong>{c.title}</strong><small>{c.text}</small></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What we offer ────────────────────────────────── */}
      <section className="sv-section sv-offer" aria-labelledby="sv-offer-title">
        <div className="container">
          <header className="sv-head sv-head--split" data-reveal>
            <div>
              <span className="sv-eyebrow">What we offer</span>
              <h2 id="sv-offer-title" className="sv-h2">{services.heading}</h2>
            </div>
            <p className="sv-lead">{services.subheading}</p>
          </header>

          <ul className="sv-offer__grid">
            {services.items.map((s, i) => (
              <li key={i} className="sv-offer__card" data-reveal style={{ '--i': i % 3 } as CSSVars}>
                <div className="sv-offer__top">
                  <span className="sv-offer__icon" aria-hidden="true"><i className={`bi ${s.icon}`} /></span>
                  <span className="sv-offer__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="sv-offer__title">{s.title}</h3>
                <p className="sv-offer__text">{s.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Process (dark) ───────────────────────────────── */}
      <section className="sv-section sv-process" aria-labelledby="sv-process-title">
        <div className="sv-process__bg" aria-hidden="true" />
        <div className="container">
          <div className="sv-process__layout">
            <header className="sv-process__head" data-reveal>
              <span className="sv-eyebrow sv-eyebrow--light">How it works</span>
              <h2 id="sv-process-title" className="sv-h2 sv-h2--light">{process.heading}</h2>
              <p className="sv-lead sv-lead--light">{process.subheading}</p>
              <Link href={hero.cta_url} className="sv-btn sv-btn--light">
                {hero.cta_text}
                <span className="sv-btn__icon" aria-hidden="true"><i className="bi bi-arrow-right" /></span>
              </Link>
            </header>

            <ol className="sv-steps">
              {process.items.map((step, i) => (
                <li key={i} className="sv-step" data-reveal>
                  <span className="sv-step__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="sv-step__title">{step.title}</h3>
                    <p className="sv-step__text">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Why us ───────────────────────────────────────── */}
      <section className="sv-section sv-why" aria-labelledby="sv-why-title">
        <div className="container">
          <header className="sv-head sv-head--center" data-reveal>
            <span className="sv-eyebrow">Why Qualixe</span>
            <h2 id="sv-why-title" className="sv-h2">{why_us.heading}</h2>
            <p className="sv-lead">{why_us.subheading}</p>
          </header>

          <ul className="sv-why__grid">
            {why_us.items.map((item, i) => (
              <li key={i} className="sv-why__card" data-reveal style={{ '--i': i % 4 } as CSSVars}>
                <span className="sv-why__icon" aria-hidden="true"><i className={`bi ${item.icon}`} /></span>
                <h3 className="sv-why__title">{item.title}</h3>
                <p className="sv-why__text">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      {faq.items.length > 0 && (
        <section className="sv-section sv-faq" aria-labelledby="sv-faq-title">
          <div className="container">
            <div className="sv-faq__layout">
              <header className="sv-faq__head" data-reveal>
                <span className="sv-eyebrow">FAQ</span>
                <h2 id="sv-faq-title" className="sv-h2">{faq.heading}</h2>
                <p className="sv-lead">{faq.subheading}</p>
                <div className="sv-faq__help">
                  <span className="sv-faq__help-icon" aria-hidden="true"><i className="bi bi-chat-dots" /></span>
                  <div>
                    <strong>Still have a question?</strong>
                    <p>Talk to us directly — we&apos;re happy to help.</p>
                    <a href="https://wa.me/8801318552266" target="_blank" rel="noopener noreferrer">
                      Message us on WhatsApp <i className="bi bi-arrow-up-right" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </header>

              <div className="sv-faq__list">
                {faq.items.map((item, i) => (
                  <details key={i} className="sv-faq__item" open={i === 0} data-reveal>
                    <summary>
                      <h3>{item.q}</h3>
                      <span className="sv-faq__toggle" aria-hidden="true" />
                    </summary>
                    <div className="sv-faq__answer"><p>{item.a}</p></div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Related services (internal links) ───────────── */}
      <section className="sv-section sv-related" aria-labelledby="sv-related-title">
        <div className="container">
          <header className="sv-head sv-head--split" data-reveal>
            <div>
              <span className="sv-eyebrow">Explore more</span>
              <h2 id="sv-related-title" className="sv-h2">Other ways we can help</h2>
            </div>
            <Link href="/services" className="sv-link">
              All services <i className="bi bi-arrow-right" aria-hidden="true" />
            </Link>
          </header>
          <ul className="sv-related__grid">
            {related.map((r) => (
              <li key={r.href} className="sv-related__card" data-reveal>
                <span className="sv-related__icon" aria-hidden="true"><i className={`bi ${r.icon}`} /></span>
                <h3 className="sv-related__title">
                  <Link href={r.href}>{r.name}</Link>
                </h3>
                <p className="sv-related__text">{r.blurb}</p>
                <span className="sv-related__go" aria-hidden="true"><i className="bi bi-arrow-up-right" /></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="sv-cta" aria-labelledby="sv-cta-title">
        <div className="sv-cta__bg" aria-hidden="true">
          <div className="sv-cta__orb sv-cta__orb--1" />
          <div className="sv-cta__orb sv-cta__orb--2" />
          <div className="sv-hero__grid sv-cta__grid" />
        </div>
        <div className="container">
          <div className="sv-cta__inner" data-reveal>
            <h2 id="sv-cta-title" className="sv-cta__title">{cta.heading}</h2>
            <p className="sv-cta__text">{cta.subheading}</p>
            <div className="sv-cta__actions">
              <Link href={cta.btn_url} className="sv-btn sv-btn--glow">
                {cta.btn_text}
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

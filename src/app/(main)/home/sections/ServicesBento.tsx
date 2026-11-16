'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import type { HomeServices } from '../../../../../lib/api/home-page';
import { SERVICE_CATALOG, HEADLESS_SERVICE } from '@/lib/services';

type Card = {
  key: string;
  title: string;
  body: string;
  href: string;
  icon: string;
  tags?: string[];
};

function onSpotlight(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}

function StoreMock() {
  return (
    <div className="hx-mock" aria-hidden="true">
      <div className="hx-mock__bar"><i /><i /><i /><span /></div>
      <div className="hx-mock__hero">
        <span className="hx-mock__line hx-mock__line--lg" />
        <span className="hx-mock__line" />
        <span className="hx-mock__btn" />
      </div>
      <div className="hx-mock__grid">
        {[0, 1, 2].map((i) => (
          <div key={i} className="hx-mock__card" style={{ '--i': i } as React.CSSProperties}>
            <span className="hx-mock__img" />
            <span className="hx-mock__line" />
            <span className="hx-mock__price" />
          </div>
        ))}
      </div>
      <div className="hx-mock__toast">
        <i className="bi bi-bag-check-fill" /> New order received
      </div>
    </div>
  );
}

export default function ServicesBento({ data }: { data: HomeServices }) {
  // Service list comes from the shared catalog; dashboard copy is used where it exists
  const cmsByHref = new Map(data.items.map((s) => [s.href, s]));
  const cards: Card[] = [...SERVICE_CATALOG, HEADLESS_SERVICE].map((s) => {
    const cms = cmsByHref.get(s.href);
    return {
      key: s.href,
      title: cms?.heading || s.name,
      body: cms?.content || s.blurb,
      href: s.href,
      icon: s.icon,
      tags: s.tags,
    };
  });

  return (
    <section className="hx-section hx-services" aria-labelledby="hx-services-title">
      <div className="container">
        <div className="hx-head">
          <span className="hx-eyebrow">{data.label}</span>
          <h2 id="hx-services-title" className="hx-h2">{data.heading}</h2>
          <p className="hx-lead">{data.subheading}</p>
        </div>

        <div className="hx-bento">
          {cards.map((c, i) => (
            <motion.article
              key={c.key}
              className={`hx-card${i === 0 ? ' hx-card--feature' : ''}`}
              onPointerMove={onSpotlight}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hx-card__top">
                <span className="hx-card__icon" aria-hidden="true"><i className={`bi ${c.icon}`} /></span>
                <span className="hx-card__num">{String(i + 1).padStart(2, '0')}</span>
              </div>

              {i === 0 && <StoreMock />}

              <div className="hx-card__body">
                <h3 className="hx-card__title">
                  <Link href={c.href}>{c.title}</Link>
                </h3>
                <p className="hx-card__text">{c.body}</p>
                {i !== 0 && c.tags && (
                  <ul className="hx-card__tags">
                    {c.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                )}
              </div>
              <span className="hx-card__arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
            </motion.article>
          ))}

          {/* Final tile: link to all services */}
          <motion.div
            className="hx-card hx-card--all"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hx-card--all__label">Not sure what you need?</span>
            <h3 className="hx-card__title">
              <Link href="/services">Explore all services</Link>
            </h3>
            <p className="hx-card__text">Compare what we offer, or tell us about your project and we&apos;ll recommend the right mix.</p>
            <span className="hx-card--all__go" aria-hidden="true"><ArrowRight size={20} /></span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

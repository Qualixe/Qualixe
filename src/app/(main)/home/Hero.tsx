import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import './Hero.css';
import type { HomeHero } from '../../../../lib/api/home-page';

function Hero({ data }: { data: HomeHero }) {
  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      {/* Decorative background */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-bg__grid" />
        <div className="hero-bg__glow hero-bg__glow--1" />
        <div className="hero-bg__glow hero-bg__glow--2" />
      </div>

      <div className="container">
        <div className="hero-inner">
          <div className="hero-text">
            <span className="hero-badge hero-anim" style={{ '--d': '0ms' } as React.CSSProperties}>
              <span className="hero-badge__dot" aria-hidden="true" />
              {data.badge}
            </span>

            <h1 id="hero-heading" className="hero-heading hero-anim" style={{ '--d': '80ms' } as React.CSSProperties}>
              {data.heading_line1}{' '}
              <span className="hero-heading--accent">
                {data.heading_line2}
                <svg className="hero-heading__swoosh" viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 10 C 70 3, 160 2, 298 7" />
                </svg>
              </span>
            </h1>

            <p className="hero-desc hero-anim" style={{ '--d': '160ms' } as React.CSSProperties}>
              {data.description}
            </p>

            <div className="hero-actions hero-anim" style={{ '--d': '240ms' } as React.CSSProperties}>
              <Link href={data.cta_primary_url} className="hero-cta hero-cta--primary">
                {data.cta_primary_text}
                <span className="hero-cta__icon"><ArrowRight size={16} /></span>
              </Link>
              <Link href={data.cta_secondary_url} className="hero-cta hero-cta--secondary">
                {data.cta_secondary_text}
                <ArrowUpRight size={16} className="hero-cta__arrow" />
              </Link>
            </div>

            {data.proof?.length > 0 && (
              <dl className="hero-proof hero-anim" style={{ '--d': '320ms' } as React.CSSProperties}>
                {data.proof.map((p, i) => (
                  <div className="hero-proof__item" key={i}>
                    <dt>{p.label}</dt>
                    <dd>{p.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="hero-visual hero-anim" style={{ '--d': '200ms' } as React.CSSProperties}>
            <div className="hero-img-wrap">
              <div className="hero-img-backdrop" aria-hidden="true" />
              <div className="hero-img-dots" aria-hidden="true" />
              <div className="hero-img-frame">
                <Image
                  src="/assets/img/hero-workspace.jpg"
                  alt="Developer workstation showing code alongside a conversion-focused landing page design"
                  width={1400}
                  height={1400}
                  sizes="(max-width: 991px) 90vw, 520px"
                  className="hero-img"
                  priority
                />
                <div className="hero-img-shade" aria-hidden="true" />
              </div>

              {data.float_top && (
                <div className="hero-float hero-float--top">{data.float_top}</div>
              )}
              {data.float_bottom && (
                <div className="hero-float hero-float--bottom">{data.float_bottom}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

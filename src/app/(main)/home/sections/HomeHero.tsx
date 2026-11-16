'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, ArrowDown } from 'lucide-react';
import type { HomeHero as HomeHeroData } from '../../../../../lib/api/home-page';

// three.js is only loaded in the browser, after the page is interactive
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

/** Strip a leading emoji so the badge can use its own live dot */
function cleanBadge(text: string) {
  return text.replace(/^[\p{Extended_Pictographic}️‍\s]+/u, '');
}

export default function HomeHero({ data }: { data: HomeHeroData }) {
  const [sceneReady, setSceneReady] = useState(false);
  const handleReady = useCallback(() => setSceneReady(true), []);

  return (
    <section className={`hx-hero${sceneReady ? ' is-ready' : ''}`} aria-labelledby="hx-hero-title">
      {/* Backdrop */}
      <div className="hx-hero__bg" aria-hidden="true">
        <div className="hx-hero__grid" />
        <div className="hx-hero__aurora hx-hero__aurora--1" />
        <div className="hx-hero__aurora hx-hero__aurora--2" />
        <div className="hx-hero__orb" />
        <div className="hx-hero__noise" />
      </div>

      <HeroScene onReady={handleReady} />

      <div className="container hx-hero__container">
        <div className="hx-hero__content">
          <span className="hx-pill hx-rise" style={{ '--d': '0ms' } as React.CSSProperties}>
            <span className="hx-pill__dot" aria-hidden="true" />
            {cleanBadge(data.badge)}
          </span>

          <h1 id="hx-hero-title" className="hx-hero__title">
            <span className="hx-line"><span className="hx-line__inner" style={{ '--d': '120ms' } as React.CSSProperties}>{data.heading_line1}</span></span>
            <span className="hx-line"><span className="hx-line__inner hx-gradient-text" style={{ '--d': '240ms' } as React.CSSProperties}>{data.heading_line2}</span></span>
          </h1>

          <p className="hx-hero__desc hx-rise" style={{ '--d': '420ms' } as React.CSSProperties}>{data.description}</p>

          <div className="hx-hero__actions hx-rise" style={{ '--d': '520ms' } as React.CSSProperties}>
            <Link href={data.cta_primary_url} className="hx-btn hx-btn--glow">
              <span>{data.cta_primary_text}</span>
              <span className="hx-btn__icon" aria-hidden="true"><ArrowRight size={16} /></span>
            </Link>
            <Link href={data.cta_secondary_url} className="hx-btn hx-btn--glass">
              {data.cta_secondary_text}
            </Link>
          </div>

          {data.proof?.length > 0 && (
            <dl className="hx-hero__proof hx-rise" style={{ '--d': '620ms' } as React.CSSProperties}>
              {data.proof.map((p, i) => (
                <div key={i}>
                  <dt>{p.label}</dt>
                  <dd>{p.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {(data.float_top || data.float_bottom) && (
          <div className="hx-hero__chips" aria-hidden="true">
            {data.float_top && <span className="hx-chip hx-chip--a">{data.float_top}</span>}
            {data.float_bottom && <span className="hx-chip hx-chip--b">{data.float_bottom}</span>}
          </div>
        )}
      </div>

      <a href="#hx-after-hero" className="hx-scroll" aria-label="Scroll to content">
        <span>Scroll</span>
        <ArrowDown size={14} />
      </a>
    </section>
  );
}

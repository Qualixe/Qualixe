import Link from 'next/link';
import './Hero.css';
import type { HomeHero } from '../../../../lib/api/home-page';

function Hero({ data }: { data: HomeHero }) {
  return (
    <section className="hero-section">
      <div className="hero-blob hero-blob--1" aria-hidden="true" />
      <div className="hero-blob hero-blob--2" aria-hidden="true" />

      <div className="container">
        <div className="hero-inner">
          <div className="hero-text">
            <span className="hero-badge">{data.badge}</span>
            <h1 className="hero-heading">
              {data.heading_line1}<br />
              <span className="hero-heading--accent">{data.heading_line2}</span>
            </h1>
            <p className="hero-desc">{data.description}</p>

            <div className="hero-actions">
              <Link href={data.cta_primary_url} className="hero-cta hero-cta--primary">
                {data.cta_primary_text}
              </Link>
              <Link href={data.cta_secondary_url} className="hero-cta hero-cta--secondary">
                {data.cta_secondary_text}
              </Link>
            </div>

            <div className="hero-proof">
              {data.proof.map((p, i) => (
                <>
                  {i > 0 && <div key={`div-${i}`} className="hero-proof__divider" />}
                  <div key={i} className="hero-proof__item">
                    <strong>{p.value}</strong>
                    <span>{p.label}</span>
                  </div>
                </>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-img-wrap">
              <img src="/assets/img/hero.png" alt="Qualixe Shopify development"
                className="hero-img" loading="eager" />
              <div className="hero-float hero-float--top">{data.float_top}</div>
              <div className="hero-float hero-float--bottom">{data.float_bottom}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

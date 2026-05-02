import Link from 'next/link';
import './Hero.css';

function Hero() {
  return (
    <section className="hero-section">
      {/* Background blobs */}
      <div className="hero-blob hero-blob--1" aria-hidden="true" />
      <div className="hero-blob hero-blob--2" aria-hidden="true" />

      <div className="container">
        <div className="hero-inner">

          {/* Text side */}
          <div className="hero-text">
            <span className="hero-badge">🚀 Shopify &amp; E-Commerce Experts</span>
            <h1 className="hero-heading">
              We Build Shopify Stores<br />
              <span className="hero-heading--accent">That Actually Sell</span>
            </h1>
            <p className="hero-desc">
              From custom theme development to full-stack e-commerce solutions —
              Qualixe helps brands in Bangladesh and worldwide launch stores that
              convert visitors into customers.
            </p>

            <div className="hero-actions">
              <Link href="/contact" className="hero-cta hero-cta--primary">
                Get a Free Quote
              </Link>
              <Link href="/portfolio" className="hero-cta hero-cta--secondary">
                View Our Work
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="hero-proof">
              <div className="hero-proof__item">
                <strong>50+</strong>
                <span>Stores Built</span>
              </div>
              <div className="hero-proof__divider" />
              <div className="hero-proof__item">
                <strong>100%</strong>
                <span>Client Satisfaction</span>
              </div>
              <div className="hero-proof__divider" />
              <div className="hero-proof__item">
                <strong>4.9★</strong>
                <span>Avg Rating</span>
              </div>
            </div>
          </div>

          {/* Image side */}
          <div className="hero-visual">
            <div className="hero-img-wrap">
              <img
                src="/assets/img/hero.png"
                alt="Qualixe Shopify development"
                className="hero-img"
                loading="eager"
              />
              {/* Floating badge */}
              <div className="hero-float hero-float--top">
                <span>⚡</span> Shopify Expert
              </div>
              <div className="hero-float hero-float--bottom">
                <span>✅</span> 4–8 Week Delivery
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;

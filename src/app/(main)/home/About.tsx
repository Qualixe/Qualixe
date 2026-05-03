import Link from 'next/link';
import './About.css';

const stats = [
  { value: '50+', label: 'Stores Built' },
  { value: '5+',  label: 'Years Experience' },
  { value: '98%', label: 'Client Retention' },
];

const reasons = [
  { icon: '🎯', text: 'Client satisfaction is our #1 goal' },
  { icon: '🧠', text: 'Talented team of Shopify specialists' },
  { icon: '⚡', text: 'Fast delivery without cutting corners' },
  { icon: '🔒', text: 'Transparent pricing, no hidden fees' },
];

function About() {
  return (
    <section className="about-section">
      <div className="container">
        <div className="about-inner">

          {/* Image side */}
          <div className="about-img-col">
            <div className="about-img-wrap">
              <img
                src="/assets/img/about.jpeg"
                alt="About Qualixe"
                className="about-img"
              />
              {/* Stats card */}
              <div className="about-stats-card">
                {stats.map((s, i) => (
                  <div key={i} className="about-stat">
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className="about-text-col">
            <span className="about-label">About Us</span>
            <h2 className="about-heading">
              We Build E-Commerce Stores<br />
              That Drive Real Revenue
            </h2>
            <p className="about-desc">
              Qualixe is a dedicated Shopify development agency based in Bangladesh,
              serving brands worldwide. We combine creative design, technical expertise,
              and conversion-focused strategy to build online stores that don't just
              look great — they sell.
            </p>

            <ul className="about-reasons">
              {reasons.map((r, i) => (
                <li key={i}>
                  <span className="about-reasons__icon">{r.icon}</span>
                  {r.text}
                </li>
              ))}
            </ul>

            <Link href="/about" className="about-cta">
              Learn More About Us →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default About;

import Link from 'next/link';
import './Services.css';
import type { HomeServices } from '../../../../lib/api/home-page';
import { FALLBACK } from './fallback';

function Services({ data = FALLBACK.services }: { data?: HomeServices }) {
  return (
    <section className="services-section">
      <div className="container">
        <div className="services-head">
          <span className="services-label">{data.label}</span>
          <h2 className="services-heading">{data.heading}</h2>
          <p className="services-sub">{data.subheading}</p>
        </div>

        <div className="services-grid">
          {data.items.map((s, i) => (
            <div key={i} className="service-card"
              style={{ '--card-bg': s.color, '--card-accent': s.accent } as React.CSSProperties}>
              <div className="service-card__icon-wrap">
                <span className="service-card__icon">{s.icon}</span>
              </div>
              <h3 className="service-card__heading">{s.heading}</h3>
              <p className="service-card__text">{s.content}</p>
              <Link href={s.href} className="service-card__link">Learn more →</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;

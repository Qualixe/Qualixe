import Link from 'next/link';
import './Services.css';

const services = [
  {
    icon: '🛍️',
    heading: 'Shopify Development',
    content: 'Custom Shopify stores built from scratch — tailored to your brand, optimized for conversions, and delivered fast. From theme design to full-stack integrations.',
    href: '/services/shopify-development',
    color: '#eef2ff',
    accent: '#0c3cc3',
  },
  {
    icon: '📣',
    heading: 'Digital Marketing',
    content: 'Data-driven SEO, paid ads, and social media campaigns that drive real traffic and revenue. We treat your budget like our own.',
    href: '/services/digital-marketing',
    color: '#f0fdf4',
    accent: '#16a34a',
  },
  {
    icon: '🎨',
    heading: 'UI/UX Design',
    content: 'Beautiful, intuitive interfaces designed around your users. From wireframes to pixel-perfect handoff — we design experiences people love.',
    href: '/services/uiux-design',
    color: '#fff7ed',
    accent: '#ea580c',
  },
];

function Services() {
  return (
    <section className="services-section">
      <div className="container">
        <div className="services-head">
          <span className="services-label">What We Do</span>
          <h2 className="services-heading">Services Built for Growth</h2>
          <p className="services-sub">
            Everything you need to launch, grow, and scale your online business.
          </p>
        </div>

        <div className="services-grid">
          {services.map((s, i) => (
            <div key={i} className="service-card" style={{ '--card-bg': s.color, '--card-accent': s.accent } as React.CSSProperties}>
              <div className="service-card__icon-wrap">
                <span className="service-card__icon">{s.icon}</span>
              </div>
              <h3 className="service-card__heading">{s.heading}</h3>
              <p className="service-card__text">{s.content}</p>
              <Link href={s.href} className="service-card__link">
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;

import Link from 'next/link';
import './About.css';
import type { HomeAbout } from '../../../../lib/api/home-page';

function About({ data }: { data: HomeAbout }) {
  return (
    <section className="about-section">
      <div className="container">
        <div className="about-inner">
          <div className="about-img-col">
            <div className="about-img-wrap">
              <img src="/assets/img/about.jpeg" alt="About Qualixe" className="about-img" />
              <div className="about-stats-card">
                {data.stats.map((s, i) => (
                  <div key={i} className="about-stat">
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="about-text-col">
            <span className="about-label">{data.label}</span>
            <h2 className="about-heading">
              {data.heading.split('\n').map((line, i) => (
                <span key={i}>{line}{i < data.heading.split('\n').length - 1 && <br />}</span>
              ))}
            </h2>
            <p className="about-desc">{data.description}</p>

            <ul className="about-reasons">
              {data.reasons.map((r, i) => (
                <li key={i}>
                  <span className="about-reasons__icon">{r.icon}</span>
                  {r.text}
                </li>
              ))}
            </ul>

            <Link href={data.cta_url} className="about-cta">{data.cta_text}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;

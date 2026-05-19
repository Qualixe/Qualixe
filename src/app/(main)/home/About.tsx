import Link from 'next/link';
import Image from 'next/image';
import './About.css';
import type { HomeAbout } from '../../../../lib/api/home-page';
import { FALLBACK } from './fallback';

function About({ data = FALLBACK.about }: { data?: HomeAbout }) {
  return (
    <section className="about-section">
      <div className="container">
        <div className="about-inner">
          <div className="about-img-col">
            <div className="about-img-wrap">
              <Image 
                src="/assets/img/modern-about.jpg" 
                alt="About Qualixe - Our team and expertise" 
                width={600}
                height={500}
                className="about-img" 
              />
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

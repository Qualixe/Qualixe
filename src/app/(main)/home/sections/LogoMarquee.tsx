/* eslint-disable @next/next/no-img-element -- logos come from arbitrary CMS URLs */
import type { Client } from '../../../../../lib/api/clients';

export default function LogoMarquee({ clients }: { clients: Client[] }) {
  const logos = clients.filter((c) => c.logo_url);
  if (logos.length === 0) return null;

  // Repeat so the strip is always wider than the viewport, then duplicate for a seamless loop
  const base = logos.length < 8 ? [...logos, ...logos, ...logos] : logos;
  const track = [...base, ...base];
  const duration = Math.max(28, base.length * 3.2);

  return (
    <section className="hx-logos" id="hx-after-hero" aria-label="Brands we've worked with">
      <div className="container">
        <p className="hx-logos__label">Trusted by ambitious brands across Bangladesh &amp; worldwide</p>
      </div>
      <div className="hx-marquee" style={{ '--dur': `${duration}s` } as React.CSSProperties}>
        <ul className="hx-marquee__track">
          {track.map((c, i) => (
            <li key={`${c.id ?? c.name}-${i}`} aria-hidden={i >= base.length ? true : undefined}>
              <a
                href={c.website_url || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="hx-logo"
                tabIndex={i >= base.length ? -1 : undefined}
                style={c.background_color ? { background: c.background_color } : undefined}
                title={c.name}
              >
                <img src={c.logo_url} alt={c.name} loading="lazy" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

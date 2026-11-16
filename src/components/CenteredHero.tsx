import Link from 'next/link';
import './CenteredHero.css';

interface CenteredHeroProps {
  /** Breadcrumb label for the current page */
  crumb: string;
  pill: string;
  title: string;
  /** Part of `title` rendered with the animated gradient */
  accent?: string;
  subtitle?: string;
  /** Extra content under the subtitle (search box, buttons, chips…) */
  children?: React.ReactNode;
}

/** Dark, centred page hero in the same style as the home page hero */
export default function CenteredHero({ crumb, pill, title, accent, subtitle, children }: CenteredHeroProps) {
  let heading: React.ReactNode = title;
  if (accent && title.includes(accent)) {
    const [before, after] = title.split(accent);
    heading = (
      <>
        {before}
        <span className="ch-gradient">{accent}</span>
        {after}
      </>
    );
  }

  return (
    <section className="ch-hero" aria-labelledby="ch-title">
      <div className="ch-bg" aria-hidden="true">
        <div className="ch-grid" />
        <div className="ch-aurora ch-aurora--1" />
        <div className="ch-aurora ch-aurora--2" />
        <div className="ch-noise" />
      </div>
      <div className="container">
        <nav className="ch-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <i className="bi bi-chevron-right" aria-hidden="true" />
          <span aria-current="page">{crumb}</span>
        </nav>
        <span className="ch-pill">
          <span className="ch-pill__dot" aria-hidden="true" /> {pill}
        </span>
        <h1 id="ch-title" className="ch-title">{heading}</h1>
        {subtitle && <p className="ch-sub">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

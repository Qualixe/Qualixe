import Link from 'next/link';
import './PageBanner.css';

interface PageBannerProps {
  heading: string;
  subtitle?: string;
  /** Small label above the heading, e.g. "About Qualixe" */
  eyebrow?: string;
  /** Part of the heading to render with the gradient accent (must appear in `heading`) */
  accent?: string;
  breadcrumb?: { label: string; href?: string }[];
}

function PageBanner({ heading, subtitle, eyebrow, accent, breadcrumb }: PageBannerProps) {
  const crumbs = breadcrumb ?? [{ label: heading }];

  let title: React.ReactNode = heading;
  if (accent && heading.includes(accent)) {
    const [before, after] = heading.split(accent);
    title = (
      <>
        {before}
        <span className="pb-accent">{accent}</span>
        {after}
      </>
    );
  }

  return (
    <section className="pb-section" aria-labelledby="pb-heading">
      <div className="pb-bg" aria-hidden="true">
        <div className="pb-grid" />
        <div className="pb-orb pb-orb--1" />
        <div className="pb-orb pb-orb--2" />
        <div className="pb-orb pb-orb--3" />
        <div className="pb-noise" />
      </div>

      <div className="container">
        <div className="pb-inner">
          <nav className="pb-breadcrumb" aria-label="Breadcrumb">
            <Link href="/" className="pb-breadcrumb__link">Home</Link>
            {crumbs.map((crumb, i) => (
              <span key={i} className="pb-breadcrumb__item">
                <i className="bi bi-chevron-right pb-breadcrumb__sep" aria-hidden="true" />
                {crumb.href
                  ? <Link href={crumb.href} className="pb-breadcrumb__link">{crumb.label}</Link>
                  : <span className="pb-breadcrumb__current" aria-current="page">{crumb.label}</span>}
              </span>
            ))}
          </nav>

          {eyebrow && (
            <span className="pb-eyebrow">
              <span className="pb-eyebrow__dot" aria-hidden="true" />
              {eyebrow}
            </span>
          )}

          <h1 id="pb-heading" className="pb-heading">{title}</h1>

          {subtitle && <p className="pb-subtitle">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}

export default PageBanner;

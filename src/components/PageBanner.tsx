import Link from 'next/link';
import './PageBanner.css';

interface PageBannerProps {
  heading: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
}

function PageBanner({ heading, subtitle, breadcrumb }: PageBannerProps) {
  return (
    <section className="pb-section" aria-label={heading}>

      {/* Animated mesh gradient orbs */}
      <div className="pb-orb pb-orb--1" aria-hidden="true" />
      <div className="pb-orb pb-orb--2" aria-hidden="true" />
      <div className="pb-orb pb-orb--3" aria-hidden="true" />

      {/* Noise texture overlay */}
      <div className="pb-noise" aria-hidden="true" />

      <div className="container">
        <div className="pb-inner">

          {/* Breadcrumb pill */}
          <nav className="pb-breadcrumb" aria-label="Breadcrumb">
            <Link href="/" className="pb-breadcrumb__link">
              <i className="bi bi-house" />
              Home
            </Link>
            {breadcrumb?.map((crumb, i) => (
              <span key={i} className="pb-breadcrumb__item">
                <i className="bi bi-chevron-right pb-breadcrumb__sep" />
                {crumb.href
                  ? <Link href={crumb.href} className="pb-breadcrumb__link">{crumb.label}</Link>
                  : <span className="pb-breadcrumb__current">{crumb.label}</span>}
              </span>
            ))}
            {!breadcrumb && (
              <span className="pb-breadcrumb__item">
                <i className="bi bi-chevron-right pb-breadcrumb__sep" />
                <span className="pb-breadcrumb__current">{heading}</span>
              </span>
            )}
          </nav>

          {/* Heading */}
          <h1 className="pb-heading">
            {heading}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="pb-subtitle">{subtitle}</p>
          )}

          {/* Decorative line */}
          <div className="pb-line" aria-hidden="true" />

        </div>
      </div>
    </section>
  );
}

export default PageBanner;

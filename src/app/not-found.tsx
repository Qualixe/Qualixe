import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './not-found.css';

export const metadata = {
  title: 'Page Not Found | Qualixe',
};

export default function NotFound() {
  return (
    <CartProvider>
      <Header />
      <main className="nf-page">
        {/* Animated background blobs */}
        <div className="nf-blob nf-blob--1" aria-hidden="true" />
        <div className="nf-blob nf-blob--2" aria-hidden="true" />
        <div className="nf-blob nf-blob--3" aria-hidden="true" />

        {/* Floating particles */}
        <div className="nf-particles" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className={`nf-particle nf-particle--${i + 1}`} />
          ))}
        </div>

        <div className="nf-content">
          {/* Glitch 404 */}
          <div className="nf-code" aria-hidden="true">
            <span className="nf-code__digit" data-text="4">4</span>
            <span className="nf-code__zero">
              <span className="nf-code__orbit" />
              <span className="nf-code__planet" />
              0
            </span>
            <span className="nf-code__digit" data-text="4">4</span>
          </div>

          <div className="nf-badge">Page Not Found</div>

          <h1 className="nf-heading">
            Looks like you&apos;re lost<br />
            <span className="nf-heading--accent">in the digital void</span>
          </h1>

          <p className="nf-desc">
            The page you&apos;re looking for doesn&apos;t exist, was moved, or is temporarily unavailable.
            Let&apos;s get you back on track.
          </p>

          <div className="nf-actions">
            <Link href="/" className="nf-btn nf-btn--primary">
              <i className="bi bi-house-fill"></i>
              Back to Home
            </Link>
            <Link href="/services/shopify-development" className="nf-btn nf-btn--secondary">
              <i className="bi bi-shop"></i>
              Our Services
            </Link>
            <Link href="/contact" className="nf-btn nf-btn--ghost">
              <i className="bi bi-envelope"></i>
              Contact Us
            </Link>
          </div>

          <div className="nf-suggestions">
            <span className="nf-suggestions__label">Popular pages:</span>
            {[
              { href: '/portfolio', label: 'Portfolio' },
              { href: '/blog', label: 'Blog' },
              { href: '/shop', label: 'Shop' },
              { href: '/themes', label: 'Themes' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="nf-suggestions__link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </CartProvider>
  );
}

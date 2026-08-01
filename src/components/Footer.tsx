"use client";

import Image from "next/image";
import Link from "next/link";
import "./Footer.css";

const resources = [
  { href: '/services',  label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog',      label: 'Blog' },
  { href: '/about',     label: 'About' },
];

const quickLinks = [
  { href: '/contact',                              label: 'Get a Free Quote' },
  { href: '/shop',                                 label: 'Templates' },
  { href: '/services/shopify-development',         label: 'Shopify Development' },
  { href: '/services/digital-marketing',           label: 'Digital Marketing' },
  { href: '/services/uiux-design',                 label: 'UI/UX Design' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-grid">

            {/* Brand col */}
            <div className="footer-brand">
              <Image
                src="/assets/img/logo.png"
                alt="Qualixe"
                width={140} height={48}
                className="footer-brand__logo"
              />

              <h4 className="footer-col__heading">Follow us</h4>
              <div className="footer-social">
                <a href="https://www.linkedin.com/company/qualixe" target="_blank" rel="noopener noreferrer"
                  className="footer-social__link" aria-label="LinkedIn">
                  <i className="bi bi-linkedin" />
                </a>
                <a href="https://twitter.com/qualixe" target="_blank" rel="noopener noreferrer"
                  className="footer-social__link" aria-label="X">
                  <i className="bi bi-twitter-x" />
                </a>
                <a href="https://www.facebook.com/qualixe" target="_blank" rel="noopener noreferrer"
                  className="footer-social__link" aria-label="Facebook">
                  <i className="bi bi-facebook" />
                </a>
                <a href="https://wa.me/8801318552266" target="_blank" rel="noopener noreferrer"
                  className="footer-social__link" aria-label="WhatsApp">
                  <i className="bi bi-whatsapp" />
                </a>
              </div>
            </div>

            {/* Resources */}
            <div className="footer-col">
              <h4 className="footer-col__heading">Resources</h4>
              <ul className="footer-col__list">
                {resources.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="footer-col__link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick links */}
            <div className="footer-col">
              <h4 className="footer-col__heading">Quick Links</h4>
              <ul className="footer-col__list">
                {quickLinks.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="footer-col__link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="footer-newsletter-col">
              <h4 className="footer-col__heading">Subscribe to our newsletter</h4>
              <p className="footer-newsletter-col__desc">
                Tips on Shopify growth, store-building best practices, and updates on
                new templates — straight to your inbox.
              </p>
              <form className="footer-newsletter__form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" required placeholder="Enter email" className="footer-newsletter__input" />
                <button type="submit" className="footer-newsletter__btn">Submit</button>
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom__inner">
            <p className="footer-bottom__copy">
              © {new Date().getFullYear()} Qualixe. All rights reserved.
            </p>
            <div className="footer-bottom__links">
              <Link href="/contact">Terms</Link>
              <span>&</span>
              <Link href="/contact">Privacy</Link>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}

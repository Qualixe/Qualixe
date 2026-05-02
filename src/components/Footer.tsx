import Image from "next/image";
import Link from "next/link";
import "./Footer.css";

const quickLinks = [
  { href: '/about',     label: 'About' },
  { href: '/services',  label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog',      label: 'Blog' },
  { href: '/shop',      label: 'Templates' },
  { href: '/contact',   label: 'Contact' },
];

const services = [
  { href: '/services/shopify-development', label: 'Shopify Development' },
  { href: '/services/digital-marketing',   label: 'Digital Marketing' },
  { href: '/services/uiux-design',         label: 'UI/UX Design' },
  { href: '/themes',                       label: 'Shopify Themes' },
  { href: '/shop',                         label: 'HTML Templates' },
];

export default function Footer() {
  return (
    <footer className="footer">

      {/* ── Main grid ── */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">

            {/* Brand col */}
            <div className="footer-brand">
            
              <Image
                src="/assets/img/logo.png"
                alt="Qualixe"
                width={140} height={48}
                className="footer-brand__logo"
              />
              <p className="footer-brand__desc">
                Bangladesh's leading Shopify development agency. We build high-converting
                e-commerce stores for brands worldwide.
              </p>
              <div className="footer-social">
                <a href="https://www.facebook.com/qualixe" target="_blank" rel="noopener noreferrer"
                  className="footer-social__link" aria-label="Facebook">
                  <i className="bi bi-facebook" />
                </a>
                <a href="https://www.linkedin.com/company/qualixe" target="_blank" rel="noopener noreferrer"
                  className="footer-social__link" aria-label="LinkedIn">
                  <i className="bi bi-linkedin" />
                </a>
                <a href="https://wa.me/8801318552266" target="_blank" rel="noopener noreferrer"
                  className="footer-social__link" aria-label="WhatsApp">
                  <i className="bi bi-whatsapp" />
                </a>
              </div>
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

            {/* Services */}
            <div className="footer-col">
              <h4 className="footer-col__heading">Services</h4>
              <ul className="footer-col__list">
                {services.map(s => (
                  <li key={s.href}>
                    <Link href={s.href} className="footer-col__link">{s.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col">
              <h4 className="footer-col__heading">Contact</h4>
              <ul className="footer-contact-list">
                <li>
                  <i className="bi bi-envelope" />
                  <a href="mailto:qualixe.info@gmail.com">qualixe.info@gmail.com</a>
                </li>
                <li>
                  <i className="bi bi-telephone" />
                  <a href="tel:+8801318552266">+88 01318 55 22 66</a>
                </li>
                <li>
                  <i className="bi bi-geo-alt" />
                  <span>House-06, Road-3, Mirpur-11,<br />Dhaka, Bangladesh</span>
                </li>
              </ul>
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
              <Link href="/contact">Privacy Policy</Link>
              <span>·</span>
              <Link href="/contact">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}

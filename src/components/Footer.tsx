"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { SERVICE_CATALOG, HEADLESS_SERVICE } from "@/lib/services";
import "./Footer.css";

const columns = [
  {
    title: "Services",
    links: [
      ...[...SERVICE_CATALOG, HEADLESS_SERVICE].map((s) => ({ href: s.href, label: s.name })),
      { href: "/services", label: "All services" },
    ],
  },
  {
    title: "Work",
    links: [
      { href: "/portfolio", label: "Shopify & E-commerce" },
      { href: "/laravel-projects", label: "Laravel Applications" },
      { href: "/themes", label: "Shopify Themes" },
      { href: "/shop", label: "HTML Templates" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/team", label: "Team" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

const socials = [
  { href: "https://www.linkedin.com/company/qualixe", label: "LinkedIn", icon: "bi-linkedin" },
  { href: "https://www.facebook.com/qualixe", label: "Facebook", icon: "bi-facebook" },
  { href: "https://twitter.com/qualixe", label: "X", icon: "bi-twitter-x" },
  { href: "https://wa.me/8801318552266", label: "WhatsApp", icon: "bi-whatsapp" },
];

const MARQUEE = ["Let's talk", "Start a project", "Let's talk", "Start a project"];

/** Live Dhaka time — rendered after mount to avoid hydration mismatch */
function DhakaClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      minute: "2-digit",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <span className="ft-clock__time">{time ?? "--:--"}</span>;
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ft">
      {/* ── Giant CTA marquee ── */}
      <Link href="/contact" className="ft-marquee" aria-label="Start a project with Qualixe">
        <span className="ft-marquee__track" aria-hidden="true">
          {[...MARQUEE, ...MARQUEE].map((w, i) => (
            <span key={i} className={`ft-marquee__word${i % 2 ? " is-outline" : ""}`}>
              {w}
              <i className="bi bi-asterisk" />
            </span>
          ))}
        </span>
      </Link>

      <div className="container">
        <div className="ft-main">
          {/* Contact block */}
          <div className="ft-contact">
            <h2 className="ft-contact__title">
              Have a project in mind?<br />
              <span>Let&apos;s build it together.</span>
            </h2>
            <a href="mailto:qualixe.info@gmail.com" className="ft-contact__email">
              qualixe.info@gmail.com <ArrowUpRight size={22} />
            </a>
            <div className="ft-contact__row">
              <a href="https://wa.me/8801318552266" target="_blank" rel="noopener noreferrer" className="ft-chip">
                <i className="bi bi-whatsapp" aria-hidden="true" /> WhatsApp us
              </a>
              <a href="tel:+8801318552266" className="ft-chip">
                <i className="bi bi-telephone" aria-hidden="true" /> +880 1318-552266
              </a>
            </div>
          </div>

          {/* Link columns */}
          <nav className="ft-cols" aria-label="Footer">
            {columns.map((col) => (
              <div key={col.title} className="ft-col">
                <h3 className="ft-col__title">{col.title}</h3>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="ft-col__link">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Office + socials strip */}
        <div className="ft-strip">
          <div className="ft-office">
            <span className="ft-office__label">Studio</span>
            <address>House-06, Road-3, Mirpur-11, Dhaka, Bangladesh</address>
          </div>
          <div className="ft-clock" aria-label="Local time in Dhaka">
            <span className="ft-clock__dot" aria-hidden="true" />
            Dhaka <DhakaClock />
          </div>
          <div className="ft-social">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="ft-social__link">
                <i className={`bi ${s.icon}`} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="ft-wordmark" aria-hidden="true">
        <span>qualixe</span>
      </div>

      <div className="container">
        <div className="ft-bottom">
          <div className="ft-bottom__brand">
            <Image src="/assets/img/logo.png" alt="Qualixe" width={110} height={36} className="ft-bottom__logo" />
            <p>© {year} Qualixe. All rights reserved.</p>
          </div>
          <div className="ft-bottom__links">
            <Link href="/privacy">Privacy Policy</Link>
            <button
              type="button"
              className="ft-top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to top <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

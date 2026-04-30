'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../service.css';
import { getShopifyServicePage, ShopifyServicePage } from '../../../../../lib/api/shopify-service';
import { motion } from 'motion/react';

// ── Static fallback (shown while loading or if DB is empty) ──
const FALLBACK: ShopifyServicePage = {
  hero: {
    badge: 'Shopify Development',
    heading: 'Shopify Custom Theme Development Services for High-Converting Stores',
    subheading: "Whether you're launching a new online store or upgrading your existing one, Qualixe delivers Shopify custom theme development tailored to your needs. Our themes are designed around your brand, audience, and goals—combining creative design with high performance to turn visitors into customers.",
    cta_text: 'Get a Free Quote',
    cta_url: '/contact',
  },
  services: {
    heading: 'Our Shopify Theme Development Services',
    subheading: 'Everything you need to launch, grow, and scale your online store.',
    items: [
      { icon: 'bi-shop', title: 'Shopify Theme Design', desc: "Even though Shopify offers a wide range of themes, every successful business has its own unique identity—something that cannot be fully expressed through a ready-made template. That's where custom Shopify theme development becomes essential. At Qualixe, our experienced team creates fully customized Shopify stores tailored specifically to your brand." },
      { icon: 'bi-palette2', title: 'Theme Customization', desc: 'Already have a theme? We give it a personality. From layout tweaks to full redesigns, we customize your existing Shopify theme to match your brand perfectly.' },
      { icon: 'bi-puzzle', title: 'App & Integration Setup', desc: 'We integrate the right Shopify apps and third-party tools — payment gateways, inventory systems, CRMs, and more — to streamline your operations.' },
      { icon: 'bi-speedometer2', title: 'Performance Optimization', desc: "Slow stores lose sales. We optimize your store's speed, Core Web Vitals, and mobile experience so customers stay and buy." },
      { icon: 'bi-search', title: 'E-Commerce SEO', desc: 'We set up your store with SEO best practices — structured data, meta tags, clean URLs, and fast load times — so you rank higher and get found.' },
      { icon: 'bi-headset', title: 'Ongoing Support & Maintenance', desc: "After launch, we're still here. We offer ongoing support, updates, and feature additions so your store keeps growing." },
    ],
  },
  process: {
    heading: 'Our Development Process',
    subheading: "A clear, transparent process so you always know what's happening and what's next.",
    items: [
      { title: 'Discovery & Planning', desc: 'We start by understanding your business, target audience, and goals. Then we map out the project scope, timeline, and deliverables.' },
      { title: 'Design & Prototyping', desc: "Our designers create wireframes and mockups for your approval before any code is written. You see exactly what you're getting." },
      { title: 'Development', desc: 'Our Shopify developers build your store with clean, scalable code — responsive, fast, and built to convert.' },
      { title: 'Testing & QA', desc: 'We test across devices, browsers, and screen sizes. Every feature, form, and checkout flow is verified before launch.' },
      { title: 'Launch', desc: 'We deploy your store and handle the go-live process. Your store is live, fast, and ready to sell.' },
      { title: 'Post-Launch Support', desc: 'We monitor performance, fix any issues, and help you grow with new features and optimizations.' },
    ],
  },
  why_us: {
    heading: 'Why Choose Qualixe?',
    subheading: "We don't just build stores — we build businesses.",
    items: [
      { icon: 'bi-award', title: 'Shopify Experts', desc: 'We specialize exclusively in Shopify — no generalists here. Every project benefits from deep platform expertise.' },
      { icon: 'bi-lightning-charge', title: 'Fast Turnaround', desc: 'We work efficiently without cutting corners. Most stores are delivered within 4–8 weeks.' },
      { icon: 'bi-person-check', title: 'Dedicated Project Manager', desc: 'You get a single point of contact who keeps you updated at every stage.' },
      { icon: 'bi-phone', title: 'Mobile-First Approach', desc: 'Over 70% of e-commerce traffic is mobile. We design and build for mobile first, always.' },
      { icon: 'bi-graph-up-arrow', title: 'Conversion Focused', desc: 'Every design decision is made with one goal: turning visitors into paying customers.' },
      { icon: 'bi-shield-check', title: 'Transparent Pricing', desc: "No hidden fees. You know exactly what you're paying for before we start." },
    ],
  },
  faq: {
    heading: 'Frequently Asked Questions',
    subheading: 'Everything you need to know about our e-commerce development services.',
    items: [
      { q: 'How long does it take to build a Shopify store?', a: "A standard custom Shopify store typically takes 4–8 weeks depending on complexity. We'll give you a clear timeline after the discovery call." },
      { q: 'Do I need a Shopify subscription?', a: "Yes, you'll need a Shopify plan (starting at $39/month). We'll help you choose the right plan for your business." },
      { q: 'Can you migrate my existing store to Shopify?', a: 'Absolutely. We handle migrations from WooCommerce, Magento, BigCommerce, and other platforms — including products, customers, and order history.' },
      { q: 'Will my store be mobile-friendly?', a: 'Yes. Every store we build is fully responsive and tested across all major devices and screen sizes.' },
      { q: 'Do you offer support after launch?', a: 'Yes. We offer monthly maintenance packages and on-demand support so your store stays healthy and up to date.' },
    ],
  },
  cta: {
    heading: 'Ready to Build Your Dream Store?',
    subheading: "Let's talk about your project. We'll get back to you within 24 hours.",
    btn_text: 'Start Your Project',
    btn_url: '/contact',
  },
};

// ── Animated process row ─────────────────────────────────
function ProcessRow({
  step, index, isLeft,
}: {
  step: { title: string; desc: string };
  index: number;
  isLeft: boolean;
}) {
  return (
    <div className={`process-timeline__row ${isLeft ? 'process-timeline__row--left' : 'process-timeline__row--right'}`}>

      {/* Card — slides in from its side */}
      <motion.div
        className="process-timeline__card"
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h4>{step.title}</h4>
        <p>{step.desc}</p>
      </motion.div>

      {/* Bubble — pops in with spring */}
      <motion.div
        className="process-timeline__bubble"
        initial={{ opacity: 0, scale: 0.3 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: index * 0.08 + 0.2 }}
      >
        {index + 1}
      </motion.div>

      <div className="process-timeline__spacer" />
    </div>
  );
}

export default function EcommerceDevelopmentPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [page, setPage] = useState<ShopifyServicePage>(FALLBACK);

  useEffect(() => {
    getShopifyServicePage().then((data) => {
      if (data) setPage(data);
    });
  }, []);

  const { hero, services, process, why_us, faq, cta } = page;

  return (
    <div className="service-page">

      {/* JSON-LD — Service + FAQPage schema for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'Shopify Development Services',
              description:
                'Custom Shopify theme development, app integrations, performance optimization, and e-commerce SEO for high-converting online stores.',
              provider: {
                '@type': 'Organization',
                name: 'Qualixe',
                url: 'https://www.qualixe.com',
                logo: 'https://www.qualixe.com/assets/img/logo.png',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: 'House-06, Road-3, Mirpur-11',
                  addressLocality: 'Dhaka',
                  addressCountry: 'BD',
                },
                contactPoint: {
                  '@type': 'ContactPoint',
                  telephone: '+8801318552266',
                  contactType: 'customer service',
                },
              },
              serviceType: 'Shopify Development',
              areaServed: 'Worldwide',
              url: 'https://www.qualixe.com/services/shopify-development',
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Shopify Development Services',
                itemListElement: [
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Shopify Theme Design' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Shopify Theme Customization' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Shopify App & Integration Setup' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Shopify Performance Optimization' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'E-Commerce SEO' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Ongoing Shopify Support & Maintenance' } },
                ],
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faq.items.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
              })),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.qualixe.com' },
                { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.qualixe.com/services' },
                { '@type': 'ListItem', position: 3, name: 'Shopify Development', item: 'https://www.qualixe.com/services/shopify-development' },
              ],
            },
          ]),
        }}
      />

      {/* Hero */}
      <section className="service-hero">
        <div className="container">
          <div className="service-hero-inner">
            <div className="service-hero-text">
              <span className="service-hero-badge">{hero.badge}</span>
              <h1>{hero.heading}</h1>
              <p>{hero.subheading}</p>
                <div className="service-hero-btns">
                  <Link href={hero.cta_url} className="service-hero-cta">
                    {hero.cta_text} <i className="bi bi-arrow-right"></i>
                  </Link>

                  <a 
                    href="https://wa.me/8801318552266" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="service-hero-cta2"
                    style={{border:'2px solid'}}
                  >
                    <i className="bi bi-whatsapp"></i> WhatsApp
                  </a>
                </div>
            </div>
            <div className="service-hero-image">
              <img src="/assets/img/service-hero.jpg" alt="Qualixe Shopify custom theme development services" />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="service-cards-section">
        <div className="container">
          <h2>{services.heading}</h2>
          <p className="section-sub">{services.subheading}</p>
          <div className="row g-4">
            {services.items.map((s, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="service-card">
                  <div className="service-card-icon">
                    <i className={`bi ${s.icon}`}></i>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="service-process">
        <div className="container">
          <div className="text-center mb-5">
            <h2>{process.heading}</h2>
            <p className="section-sub mx-auto">{process.subheading}</p>
          </div>

          <div className="process-timeline">
            <div className="process-timeline__line" />

            {process.items.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <ProcessRow key={i} step={step} index={i} isLeft={isLeft} />
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="service-why">
        <div className="container">
          <h2>{why_us.heading}</h2>
          <p className="section-sub">{why_us.subheading}</p>
          <div className="row g-4">
            {why_us.items.map((item, i) => (
              <div key={i} className="col-md-6">
                <div className="why-item">
                  <div className="why-icon"><i className={`bi ${item.icon}`}></i></div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="service-faq">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-5 mb-lg-0">
              <h2>{faq.heading}</h2>
              <p className="section-sub">{faq.subheading}</p>
            </div>
            <div className="col-lg-8">
              {faq.items.map((item, i) => (
                <div key={i} className="faq-item">
                  <button
                    className={`faq-question ${openFaq === i ? 'open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {item.q}
                    <i className="bi bi-chevron-down"></i>
                  </button>
                  <div className={`faq-answer ${openFaq === i ? 'open' : ''}`}>
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="service-cta">
        <div className="container">
          <h2>{cta.heading}</h2>
          <p>{cta.subheading}</p>
          <Link href={cta.btn_url} className="service-cta-btn">
            {cta.btn_text} <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>

    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import '../service.css';

const subServices = [
  {
    icon: 'bi-shop',
    title: 'Shopify Theme Design',
    desc: 'Even though Shopify offers a wide range of themes, every successful business has its own unique identity—something that cannot be fully expressed through a ready-made template. That’s where custom Shopify theme development becomes essential. At Qualixe, our experienced team creates fully customized Shopify stores tailored specifically to your brand. We combine design, functionality, and user experience to build a store that truly stands out in a competitive market. Using modern technologies, clean code, and conversion-focused strategies, we ensure your store is not only visually impressive but also optimized to drive sales and growth.',
  },
  {
    icon: 'bi-palette2',
    title: 'Theme Customization',
    desc: 'Already have a theme? We give it a personality. From layout tweaks to full redesigns, we customize your existing Shopify theme to match your brand perfectly.',
  },
  {
    icon: 'bi-puzzle',
    title: 'App & Integration Setup',
    desc: 'We integrate the right Shopify apps and third-party tools — payment gateways, inventory systems, CRMs, and more — to streamline your operations.',
  },
  {
    icon: 'bi-speedometer2',
    title: 'Performance Optimization',
    desc: 'Slow stores lose sales. We optimize your store\'s speed, Core Web Vitals, and mobile experience so customers stay and buy.',
  },
  {
    icon: 'bi-search',
    title: 'E-Commerce SEO',
    desc: 'We set up your store with SEO best practices — structured data, meta tags, clean URLs, and fast load times — so you rank higher and get found.',
  },
  {
    icon: 'bi-headset',
    title: 'Ongoing Support & Maintenance',
    desc: 'After launch, we\'re still here. We offer ongoing support, updates, and feature additions so your store keeps growing.',
  },
];

const process = [
  {
    title: 'Discovery & Planning',
    desc: 'We start by understanding your business, target audience, and goals. Then we map out the project scope, timeline, and deliverables.',
  },
  {
    title: 'Design & Prototyping',
    desc: 'Our designers create wireframes and mockups for your approval before any code is written. You see exactly what you\'re getting.',
  },
  {
    title: 'Development',
    desc: 'Our Shopify developers build your store with clean, scalable code — responsive, fast, and built to convert.',
  },
  {
    title: 'Testing & QA',
    desc: 'We test across devices, browsers, and screen sizes. Every feature, form, and checkout flow is verified before launch.',
  },
  {
    title: 'Launch',
    desc: 'We deploy your store and handle the go-live process. Your store is live, fast, and ready to sell.',
  },
  {
    title: 'Post-Launch Support',
    desc: 'We monitor performance, fix any issues, and help you grow with new features and optimizations.',
  },
];

const whyUs = [
  { icon: 'bi-award', title: 'Shopify Experts', desc: 'We specialize exclusively in Shopify — no generalists here. Every project benefits from deep platform expertise.' },
  { icon: 'bi-lightning-charge', title: 'Fast Turnaround', desc: 'We work efficiently without cutting corners. Most stores are delivered within 4–8 weeks.' },
  { icon: 'bi-person-check', title: 'Dedicated Project Manager', desc: 'You get a single point of contact who keeps you updated at every stage.' },
  { icon: 'bi-phone', title: 'Mobile-First Approach', desc: 'Over 70% of e-commerce traffic is mobile. We design and build for mobile first, always.' },
  { icon: 'bi-graph-up-arrow', title: 'Conversion Focused', desc: 'Every design decision is made with one goal: turning visitors into paying customers.' },
  { icon: 'bi-shield-check', title: 'Transparent Pricing', desc: 'No hidden fees. You know exactly what you\'re paying for before we start.' },
];

const faqs = [
  {
    q: 'How long does it take to build a Shopify store?',
    a: 'A standard custom Shopify store typically takes 4–8 weeks depending on complexity. We\'ll give you a clear timeline after the discovery call.',
  },
  {
    q: 'Do I need a Shopify subscription?',
    a: 'Yes, you\'ll need a Shopify plan (starting at $39/month). We\'ll help you choose the right plan for your business.',
  },
  {
    q: 'Can you migrate my existing store to Shopify?',
    a: 'Absolutely. We handle migrations from WooCommerce, Magento, BigCommerce, and other platforms — including products, customers, and order history.',
  },
  {
    q: 'Will my store be mobile-friendly?',
    a: 'Yes. Every store we build is fully responsive and tested across all major devices and screen sizes.',
  },
  {
    q: 'Do you offer support after launch?',
    a: 'Yes. We offer monthly maintenance packages and on-demand support so your store stays healthy and up to date.',
  },
];

export default function EcommerceDevelopmentPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="service-page">

      {/* Hero */}
      <section className="service-hero">
        <div className="container">
          <div className="service-hero-inner">
            <div className="service-hero-text">
              <span className="service-hero-badge">Shopify Development</span>
              <h1>Shopify Custom Theme Development Services for High-Converting Stores</h1>
              <p>
               Whether you’re launching a new online store or upgrading your existing one, Qualixe delivers Shopify custom theme development tailored to your needs. Our themes are designed around your brand, audience, and goals—combining creative design with high performance to turn visitors into customers.
              </p>
              <Link href="/contact" className="service-hero-cta">
                Get a Free Quote <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="service-hero-image">
              <img src="/assets/img/service-hero.jpg" alt="Shopify Development" />
            </div>
          </div>
        </div>
      </section>

      {/* Sub-services */}
      <section className="service-cards-section">
        <div className="container">
          <h2>Our Shopify Theme Development Services</h2>
          <p className="section-sub">Everything you need to launch, grow, and scale your online store.</p>
          <div className="row g-4">
            {subServices.map((s, i) => (
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
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <div className="process-image">
                <img src="/assets/img/service-proccess.png" alt="Our Development Process" />
              </div>
            </div>
            <div className="col-lg-7">
              <h2>Our Development Process</h2>
              <p className="section-sub">
                A clear, transparent process so you always know what's happening and what's next.
              </p>
              {process.map((step, i) => (
                <div key={i} className="process-step">
                  <div className="process-number">{i + 1}</div>
                  <div className="process-step-content">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="service-why">
        <div className="container">
          <h2>Why Choose Qualixe?</h2>
          <p className="section-sub">We don't just build stores — we build businesses.</p>
          <div className="row g-4">
            {whyUs.map((item, i) => (
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
              <h2>Frequently Asked Questions</h2>
              <p className="section-sub">Everything you need to know about our e-commerce development services.</p>
            </div>
            <div className="col-lg-8">
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item">
                  <button
                    className={`faq-question ${openFaq === i ? 'open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {faq.q}
                    <i className="bi bi-chevron-down"></i>
                  </button>
                  <div className={`faq-answer ${openFaq === i ? 'open' : ''}`}>
                    {faq.a}
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
          <h2>Ready to Build Your Dream Store?</h2>
          <p>Let's talk about your project. We'll get back to you within 24 hours.</p>
          <Link href="/contact" className="service-cta-btn">
            Start Your Project <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>

    </div>
  );
}

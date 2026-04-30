'use client';

import { useState } from 'react';
import Link from 'next/link';
import '../service.css';
import ReadMore from '@/components/ReadMore';
import { motion } from 'motion/react';

const subServices = [
  {
    icon: 'bi-layout-text-window',
    title: 'Website UI Design',
    desc: 'We design clean, modern, and conversion-focused website interfaces that reflect your brand and guide users toward action.',
  },
  {
    icon: 'bi-phone',
    title: 'Mobile App Design',
    desc: 'We create intuitive mobile app interfaces for iOS and Android — designed for usability, accessibility, and delight.',
  },
  {
    icon: 'bi-vector-pen',
    title: 'Brand Identity & Visual Design',
    desc: 'From logos to full brand systems — we craft visual identities that are consistent, memorable, and built to last.',
  },
  {
    icon: 'bi-diagram-3',
    title: 'UX Research & Wireframing',
    desc: 'Before any pixel is placed, we map user journeys, create wireframes, and validate ideas — so the final design solves real problems.',
  },
  {
    icon: 'bi-window-stack',
    title: 'Prototyping & User Testing',
    desc: 'We build interactive prototypes and test them with real users to catch issues early and refine the experience before development.',
  },
  {
    icon: 'bi-arrow-repeat',
    title: 'Design System Creation',
    desc: 'We build scalable design systems with reusable components, typography, and color guidelines — so your product stays consistent as it grows.',
  },
];

const process = [
  {
    title: 'Discovery & Research',
    desc: 'We learn about your users, business goals, and competitors. This shapes every design decision we make.',
  },
  {
    title: 'Information Architecture',
    desc: 'We map out the structure and user flows — ensuring the product is logical, intuitive, and easy to navigate.',
  },
  {
    title: 'Wireframing',
    desc: 'Low-fidelity wireframes let us explore layouts and interactions quickly before committing to visual design.',
  },
  {
    title: 'Visual Design',
    desc: 'We apply your brand identity to create high-fidelity designs that are polished, accessible, and on-brand.',
  },
  {
    title: 'Prototyping & Testing',
    desc: 'Interactive prototypes are tested with real users. Feedback is incorporated before handoff to development.',
  },
  {
    title: 'Developer Handoff',
    desc: 'We deliver production-ready design files with specs, assets, and documentation so developers can build with confidence.',
  },
];

const whyUs = [
  { icon: 'bi-eye', title: 'User-Centered Design', desc: 'Every design decision is grounded in user research and real behavior — not assumptions.' },
  { icon: 'bi-brush', title: 'Pixel-Perfect Execution', desc: 'We obsess over the details. Every spacing, color, and interaction is intentional.' },
  { icon: 'bi-universal-access', title: 'Accessibility First', desc: 'We design for everyone — following WCAG guidelines to ensure your product is inclusive.' },
  { icon: 'bi-lightning', title: 'Fast Iterations', desc: 'We work in short cycles with frequent feedback so you\'re never waiting long to see progress.' },
  { icon: 'bi-code-slash', title: 'Dev-Ready Deliverables', desc: 'Our designs come with full specs and assets so developers can build exactly what was designed.' },
  { icon: 'bi-chat-dots', title: 'Collaborative Process', desc: 'You\'re involved at every stage. We design with you, not just for you.' },
];

const faqs = [
  {
    q: 'What tools do you use for design?',
    a: 'We primarily use Figma for UI/UX design, prototyping, and design systems. We also use Adobe Illustrator and Photoshop for brand and visual work.',
  },
  {
    q: 'Do you also handle development?',
    a: 'Yes. We offer full-stack development alongside our design services. We can take your project from wireframe to live product.',
  },
  {
    q: 'How many design revisions are included?',
    a: 'We include up to 3 rounds of revisions per design phase. Additional revisions can be arranged if needed.',
  },
  {
    q: 'Can you redesign my existing website or app?',
    a: 'Absolutely. We start with a UX audit of your current product, identify pain points, and redesign with a focus on improving usability and conversions.',
  },
  {
    q: 'How long does a typical UI/UX project take?',
    a: 'A website UI design project typically takes 3–6 weeks. App design projects range from 6–12 weeks depending on complexity.',
  },
];

export default function UiUxDesignPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="service-page">

      {/* Hero */}
      <section className="service-hero">
        <div className="container">
          <div className="service-hero-inner">
            <div className="service-hero-text">
              <span className="service-hero-badge">UI/UX Design</span>
              <h1>Design Experiences People Love to Use</h1>
              <p>
                We design websites, apps, and digital products that are beautiful, intuitive, and built
                around your users. Great design isn't just how it looks — it's how it works.
              </p>
              <Link href="/contact" className="service-hero-cta">
                Start a Design Project <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="service-hero-image">
              <img src="/assets/img/service-hero.jpg" alt="UI/UX Design" />
            </div>
          </div>
        </div>
      </section>

      {/* Sub-services */}
      <section className="service-cards-section">
        <div className="container">
          <h2>UI/UX Design Services</h2>
          <p className="section-sub">From research to pixel-perfect handoff — we cover the full design process.</p>
          <div className="row g-4">
            {subServices.map((s, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="service-card">
                  <div className="service-card-icon">
                    <i className={`bi ${s.icon}`}></i>
                  </div>
                  <h3>{s.title}</h3>
                  <ReadMore text={s.desc} />
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
            <h2>Our Design Process</h2>
            <p className="section-sub mx-auto">
              A structured, collaborative process that delivers great design every time.
            </p>
          </div>
          <div className="process-timeline">
            <div className="process-timeline__line" />
            {process.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={i} className={`process-timeline__row ${isLeft ? 'process-timeline__row--left' : 'process-timeline__row--right'}`}>
                  <motion.div
                    className="process-timeline__card"
                    initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </motion.div>
                  <motion.div
                    className="process-timeline__bubble"
                    initial={{ opacity: 0, scale: 0.3 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18, delay: i * 0.08 + 0.2 }}
                  >
                    {i + 1}
                  </motion.div>
                  <div className="process-timeline__spacer" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="service-why">
        <div className="container">
          <h2>Why Choose Qualixe?</h2>
          <p className="section-sub">We design with purpose — every pixel has a reason.</p>
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
              <p className="section-sub">Common questions about our UI/UX design services.</p>
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
          <h2>Let's Design Something Great Together</h2>
          <p>Tell us about your project and we'll get back to you within 24 hours.</p>
          <Link href="/contact" className="service-cta-btn">
            Get in Touch <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>

    </div>
  );
}

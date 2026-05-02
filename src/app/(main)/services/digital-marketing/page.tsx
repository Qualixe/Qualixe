'use client';

import { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import '../service.css';
import { motion } from 'motion/react';

const subServices = [
  {
    icon: 'bi-search',
    title: 'Search Engine Optimization (SEO)',
    desc: 'We improve your organic rankings with technical SEO, on-page optimization, and content strategy — driving consistent, long-term traffic to your site.',
  },
  {
    icon: 'bi-meta',
    title: 'Social Media Marketing',
    desc: 'We create and manage social media campaigns on Facebook, Instagram, TikTok, and LinkedIn that build your brand and drive real engagement.',
  },
  {
    icon: 'bi-cursor',
    title: 'Pay-Per-Click Advertising (PPC)',
    desc: 'We run targeted Google Ads and Meta Ads campaigns that put your brand in front of the right people at the right time — maximizing your ROI.',
  },
  {
    icon: 'bi-envelope-paper',
    title: 'Email Marketing',
    desc: 'From welcome sequences to abandoned cart flows, we build automated email campaigns that nurture leads and drive repeat purchases.',
  },
  {
    icon: 'bi-bar-chart-line',
    title: 'Analytics & Reporting',
    desc: 'We track every campaign with detailed reporting so you always know what\'s working, what\'s not, and where to invest next.',
  },
  {
    icon: 'bi-pencil-square',
    title: 'Content Marketing',
    desc: 'We create blog posts, landing pages, and ad copy that attract, engage, and convert your target audience.',
  },
];

const process = [
  {
    title: 'Audit & Research',
    desc: 'We start with a full audit of your current digital presence, competitors, and target audience to identify the biggest opportunities.',
  },
  {
    title: 'Strategy Development',
    desc: 'We build a custom marketing strategy with clear goals, channels, budgets, and KPIs tailored to your business.',
  },
  {
    title: 'Campaign Setup',
    desc: 'We set up all campaigns, tracking pixels, analytics, and automation flows before going live.',
  },
  {
    title: 'Launch & Monitor',
    desc: 'Campaigns go live and we monitor performance daily — adjusting bids, creatives, and targeting in real time.',
  },
  {
    title: 'Optimize & Scale',
    desc: 'We continuously optimize based on data, doubling down on what works and cutting what doesn\'t.',
  },
  {
    title: 'Monthly Reporting',
    desc: 'You receive a clear monthly report showing results, insights, and the plan for the next month.',
  },
];

const whyUs = [
  { icon: 'bi-bullseye', title: 'Data-Driven Decisions', desc: 'Every strategy is backed by data, not guesswork. We track, measure, and optimize everything.' },
  { icon: 'bi-globe2', title: 'Multi-Channel Expertise', desc: 'We manage SEO, paid ads, social, and email — all under one roof for a consistent brand message.' },
  { icon: 'bi-currency-dollar', title: 'ROI Focused', desc: 'We care about your bottom line. Every campaign is optimized to deliver the best return on your investment.' },
  { icon: 'bi-people', title: 'Dedicated Team', desc: 'You get a dedicated team of specialists — not a generalist juggling 50 clients.' },
  { icon: 'bi-clock-history', title: 'Transparent Reporting', desc: 'No fluff. You get clear, honest reports that show exactly what your money is doing.' },
  { icon: 'bi-arrow-up-right-circle', title: 'Proven Results', desc: 'We\'ve helped brands grow their organic traffic, reduce ad spend, and increase conversions.' },
];

const faqs = [
  {
    q: 'How long before I see results from SEO?',
    a: 'SEO is a long-term strategy. Most clients start seeing meaningful improvements in 3–6 months, with significant growth by month 6–12.',
  },
  {
    q: 'What\'s the minimum budget for paid ads?',
    a: 'We recommend a minimum ad spend of $500/month to get meaningful data. Our management fee is separate from your ad budget.',
  },
  {
    q: 'Do you work with small businesses?',
    a: 'Yes. We work with businesses of all sizes — from startups to established brands. We tailor our approach to your budget and goals.',
  },
  {
    q: 'Which social media platforms do you manage?',
    a: 'We manage Facebook, Instagram, TikTok, LinkedIn, and X (Twitter). We\'ll recommend the right platforms based on your audience.',
  },
  {
    q: 'How do you measure success?',
    a: 'We define KPIs at the start of every engagement — traffic, leads, conversions, ROAS — and report against them monthly.',
  },
];

export default function DigitalMarketingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="service-page">

      {/* Hero */}
      <section className="service-hero">
        <div className="container">
          <div className="service-hero-inner">
            <div className="service-hero-text">
              <span className="service-hero-badge">Digital Marketing</span>
              <h1>Grow Your Brand Online With Strategies That Work</h1>
              <p>
                From SEO to paid ads and social media — we build and execute digital marketing strategies
                that drive real traffic, real leads, and real revenue.
              </p>
              <Link href="/contact" className="service-hero-cta">
                Get a Free Strategy Call <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="service-hero-image">
              <NextImage
                src="/assets/img/service-hero.jpg"
                alt="Digital Marketing"
                width={420} height={320}
                style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sub-services */}
      <section className="service-cards-section">
        <div className="container">
          <h2>Digital Marketing Services</h2>
          <p className="section-sub">Full-funnel marketing to attract, engage, and convert your audience.</p>
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
          <div className="text-center mb-5">
            <h2>Our Marketing Process</h2>
            <p className="section-sub mx-auto">
              A structured approach that turns your marketing budget into measurable growth.
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
          <p className="section-sub">We treat your marketing budget like it's our own.</p>
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
              <p className="section-sub">Common questions about our digital marketing services.</p>
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
          <h2>Ready to Grow Your Business?</h2>
          <p>Let's build a marketing strategy that works for you. Free consultation, no commitment.</p>
          <Link href="/contact" className="service-cta-btn">
            Book a Free Call <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>

    </div>
  );
}

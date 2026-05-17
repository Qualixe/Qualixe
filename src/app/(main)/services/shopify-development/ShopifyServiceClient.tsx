'use client';

import { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { motion } from 'motion/react';
import { ShopifyServicePage } from '../../../../../lib/api/shopify-service';
import '../service.css';

function ProcessRow({ step, index, isLeft }: { step: { title: string; desc: string }; index: number; isLeft: boolean }) {
  return (
    <div className={`process-timeline__row ${isLeft ? 'process-timeline__row--left' : 'process-timeline__row--right'}`}>
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

export default function ShopifyServiceClient({ page }: { page: ShopifyServicePage }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { hero, services, process, why_us, faq, cta } = page;

  return (
    <div className="service-page">
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
                <a href="https://wa.me/8801318552266" target="_blank" rel="noopener noreferrer"
                  className="service-hero-cta2" style={{ border: '2px solid' }}>
                  <i className="bi bi-whatsapp"></i> WhatsApp
                </a>
              </div>
            </div>
            <div className="service-hero-image">
              <NextImage
                src="/assets/img/service-hero.jpg"
                alt="Qualixe Shopify custom theme development services"
                width={420} height={320}
                style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
                priority
              />
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
                  <div className="service-card-icon"><i className={`bi ${s.icon}`}></i></div>
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
            {process.items.map((step, i) => (
              <ProcessRow key={i} step={step} index={i} isLeft={i % 2 === 0} />
            ))}
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
                  <div><h4>{item.title}</h4><p>{item.desc}</p></div>
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
                  <button className={`faq-question ${openFaq === i ? 'open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    {item.q}
                    <i className="bi bi-chevron-down"></i>
                  </button>
                  <div className={`faq-answer ${openFaq === i ? 'open' : ''}`}>{item.a}</div>
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

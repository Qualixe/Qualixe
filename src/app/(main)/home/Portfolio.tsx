"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { portfolioAPI } from '../../../../lib/api/portfolio';
import './portfolio.css';

const LIMIT = 3;

interface PortfolioItem {
  id: string;
  title: string;
  image_url: string;
  project_url: string;
  category?: string;
}

const Portfolio: React.FC = () => {
  const [loading, setLoading]       = useState(true);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    portfolioAPI.getAll()
      .then(data => setPortfolios(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const items = portfolios.slice(0, LIMIT);

  return (
    <section className="pf-section">
      <div className="container">

        {/* Heading */}
        <div className="pf-head">
          <span className="pf-label">Our Work</span>
          <h2 className="pf-heading">Latest Creative Work</h2>
          <p className="pf-sub">
            A selection of Shopify stores and e-commerce projects we've built for brands worldwide.
          </p>
        </div>

        {/* 3-column grid */}
        <div className="pf-grid">
          {loading
            ? Array.from({ length: LIMIT }).map((_, i) => (
                <div key={i} className="pf-skeleton" />
              ))
            : items.map(item => (
                <div key={item.id} className="pf-item">
                  <a
                    href={item.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pf-item__link"
                    aria-label={`View ${item.title}`}
                  >
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="pf-item__img"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  {/* Overlay */}
                    <div className="pf-item__overlay">
                      <div className="pf-item__info">
                        {item.category && (
                          <span className="pf-item__cat">{item.category}</span>
                        )}
                        <h3 className="pf-item__title">{item.title}</h3>
                        <span className="pf-item__cta">View Live ↗</span>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
        </div>

        {/* CTA */}
        <div className="pf-footer">
          <Link href="/portfolio" className="pf-btn">
            View All Projects →
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Portfolio;

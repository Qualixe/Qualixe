"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa';
import SkeletonCard from './Skeleton';
import { portfolioAPI } from '../../../../lib/api/portfolio';
import './portfolio.css';

const limit = 3;

interface PortfolioItem {
  id: string;
  title: string;
  image_url: string;
  project_url: string;
}

const Portfolio: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const data = await portfolioAPI.getAll();
      setPortfolios(data || []);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const randomView = (arr: PortfolioItem[]): PortfolioItem[] =>
    [...arr].sort(() => Math.random() - 0.5);

  const displayedPortfolios = randomView(portfolios).slice(0, limit);

  return (
    <section className="portfolio-section">
      <div className="container">
        <h2 className="heading portfolio-heading text-center">Latest Creative Work</h2>

        <div className="portfolio-grid">
          {loading
            ? Array.from({ length: limit }).map((_, i) => (
                <div key={i}>
                  <SkeletonCard />
                </div>
              ))
            : displayedPortfolios.map((item) => (
                <div key={item.id} className="portfolio-item">
                  <a
                    href={item.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portfolio-item-link"
                  >
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="portfolio-img"
                    />
                    <span className="portfolio-btn">
                      <FaEye />
                      <span>View Live</span>
                    </span>
                    <span className="portfolio-item-overly" />
                  </a>
                </div>
              ))}
        </div>

        <div className="text-center portfolio-button">
          <Link href="/portfolio" className="button portfolios-btn">
            View All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

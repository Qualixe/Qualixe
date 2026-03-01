"use client";
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'next/image';
import { FaEye } from 'react-icons/fa';
import Link from 'next/link';
import './portfolio.css';
import SkeletonCard from './Skeleton';
import { portfolioAPI } from '../../../../lib/api/portfolio';

const limit = 6;

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
    <div className='portfolio-section'>
      <Container>
        <Row>
          <Col>
            <h2 className='portfolio-heading heading text-center'>Latest Creative Work</h2>
          </Col>
        </Row>

        <Row>
          {loading
            ? Array.from({ length: limit }).map((_, index) => (
                <Col key={index} lg={4} md={4} sm={12} className='portfolio-item pb-4'>
                  <SkeletonCard />
                </Col>
              ))
            : displayedPortfolios.map((item) => (
                <Col key={item.id} lg={4} md={4} sm={12} className='portfolio-item pb-4'>
                  <a href={item.project_url} target='_blank' rel="noopener noreferrer" className='portfolio-item-link'>
                    <Image src={item.image_url} alt={item.title}  className='portfolio-img' width={400} height={500}/>
                    <span className='portfolio-btn'>
                      <FaEye />
                      <span>View Live</span>
                    </span>
                    <span className='portfolio-item-overly'></span>
                  </a>
                </Col>
              ))}
          <Col className='text-center portfolio-button mt-5'>
            <Link href="/portfolio" className='button portfolios-btn'>
              View All
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Portfolio;

"use client"
import { useState, useEffect } from "react";
import PageBanner from "@/components/PageBanner";
import './portfolio.css';
import '../home/portfolio.css';
import { FaEye } from "react-icons/fa";
import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import SkeletonCard from "./Skeleton";
import ClientsGrid from "../home/Clients";
import { portfolioAPI } from '../../../../lib/api/portfolio';

interface PortfolioItem {
  id: string;
  title: string;
  image_url: string;
  project_url: string;
}

function Page() {
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

  return (
    <>
    <div className="page-portfolio">
      <PageBanner heading="Our Latest Creative Endeavors" />
      <div className="page-portfolio-content">
        <div className='portfolio-section'>
          <Container>
            <Row>
              {loading
                ? Array.from({ length: 9 }).map((_, index) => (
                    <Col key={index} lg={4} md={4} sm={12} className='portfolio-item pb-4'>
                      <SkeletonCard />
                    </Col>
                  ))
                : portfolios.map((item) => (
                    <Col key={item.id} lg={4} md={4} sm={12} className='portfolio-item pb-4'>
                      <a href={item.project_url} target='_blank' rel="noopener noreferrer" className='portfolio-item-link'>
                        <Image src={item.image_url} alt={item.title} fill className='portfolio-img'/>
                        <span className='portfolio-btn'>
                          <FaEye />
                          <span>View Live</span>
                        </span>
                        <span className='portfolio-item-overly'></span>
                      </a>
                    </Col>
                  ))}
            </Row>
          </Container>
        </div>
      </div>
    </div>
    <ClientsGrid />
    </>
  );
}

export default Page;
"use client"
import { useState, useEffect, useRef, useCallback } from "react";
import PageBanner from "@/components/PageBanner";
import './portfolio.css';
import '../home/portfolio.css';
import { FaEye } from "react-icons/fa";
import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import SkeletonCard from "./Skeleton";
import ClientsGrid from "../home/Clients";
import { portfolioAPI } from '../../../../lib/api/portfolio';

const PAGE_SIZE = 6;

interface PortfolioItem {
  id: string;
  title: string;
  image_url: string;
  project_url: string;
}

function Page() {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchPage = useCallback(async (pageNum: number) => {
    try {
      const { data, count } = await portfolioAPI.getPaginated(pageNum, PAGE_SIZE);
      setPortfolios(prev => pageNum === 0 ? data : [...prev, ...data]);
      setHasMore((pageNum + 1) * PAGE_SIZE < count);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(0);
  }, [fetchPage]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          setLoadingMore(true);
          setPage(prev => {
            const next = prev + 1;
            fetchPage(next);
            return next;
          });
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => { if (sentinel) observer.unobserve(sentinel); };
  }, [hasMore, loading, loadingMore, fetchPage]);

  return (
    <>
      <div className="page-portfolio">
        <PageBanner heading="Our Latest Creative Endeavors" />
        <div className="page-portfolio-content">
          <div className='portfolio-section'>
            <Container>
              <Row>
                {loading
                  ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
                      <Col key={index} lg={4} md={4} sm={12} className='portfolio-item pb-4'>
                        <SkeletonCard />
                      </Col>
                    ))
                  : portfolios.map((item) => (
                      <Col key={item.id} lg={4} md={4} sm={12} className='portfolio-item pb-4'>
                        <a href={item.project_url} target='_blank' rel="noopener noreferrer" className='portfolio-item-link'>
                          <Image src={item.image_url} alt={item.title} fill className='portfolio-img' />
                          <span className='portfolio-btn'>
                            <FaEye />
                            <span>View Live</span>
                          </span>
                          <span className='portfolio-item-overly'></span>
                        </a>
                      </Col>
                    ))}
              </Row>

              {loadingMore && (
                <Row>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Col key={index} lg={4} md={4} sm={12} className='portfolio-item pb-4'>
                      <SkeletonCard />
                    </Col>
                  ))}
                </Row>
              )}

              <div ref={sentinelRef} style={{ height: 1 }} />
            </Container>
          </div>
        </div>
      </div>
      <ClientsGrid />
    </>
  );
}

export default Page;

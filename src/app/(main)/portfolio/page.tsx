"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import ClientsGrid from "../home/Clients";
import { portfolioAPI } from '../../../../lib/api/portfolio';
import './portfolio.css';

const PAGE_SIZE = 9;

interface PortfolioItem {
  id: string;
  title: string;
  image_url: string;
  project_url: string;
  category?: string;
}

function SkeletonGrid({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="port-skeleton" />
      ))}
    </>
  );
}

export default function PortfolioPage() {
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [portfolios, setPortfolios]   = useState<PortfolioItem[]>([]);
  const [page, setPage]               = useState(0);
  const [hasMore, setHasMore]         = useState(true);
  const sentinelRef                   = useRef<HTMLDivElement>(null);

  const fetchPage = useCallback(async (pageNum: number) => {
    try {
      const { data, count } = await portfolioAPI.getPaginated(pageNum, PAGE_SIZE);
      setPortfolios(prev => pageNum === 0 ? data : [...prev, ...data]);
      setHasMore((pageNum + 1) * PAGE_SIZE < count);
    } catch (err) {
      console.error('Failed to load portfolio:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => { fetchPage(0); }, [fetchPage]);

  // Infinite scroll sentinel
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingMore) {
          setLoadingMore(true);
          setPage(prev => { fetchPage(prev + 1); return prev + 1; });
        }
      },
      { threshold: 0.1 }
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [hasMore, loading, loadingMore, fetchPage]);

  return (
    <>
      <PageBanner heading="Our Portfolio" />

      <section className="port-section">
        <div className="container">

          {/* Intro */}
          <div className="port-intro">
            <p className="port-intro__text">
              A collection of Shopify stores, e-commerce websites, and digital experiences
              we've crafted for brands across Bangladesh and worldwide.
            </p>
          </div>

          {/* Grid */}
          <div className="port-grid">
            {loading ? (
              <SkeletonGrid count={PAGE_SIZE} />
            ) : portfolios.length === 0 ? (
              <div className="port-empty">
                <i className="bi bi-briefcase" />
                <p>No portfolio items yet.</p>
              </div>
            ) : (
              portfolios.map(item => (
                <div key={item.id} className="port-item">
                  <a
                    href={item.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="port-item__link"
                    aria-label={`View ${item.title}`}
                  >
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="port-item__img"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Gradient overlay */}
                    <div className="port-item__overlay">
                      <div className="port-item__info">
                        {item.category && (
                          <span className="port-item__cat">{item.category}</span>
                        )}
                        <h3 className="port-item__title">{item.title}</h3>
                        <span className="port-item__cta">View Live ↗</span>
                      </div>
                    </div>
                  </a>
                </div>
              ))
            )}

            {/* Load-more skeletons */}
            {loadingMore && <SkeletonGrid count={3} />}
          </div>

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} style={{ height: 1 }} />

          {/* End of results */}
          {!hasMore && !loading && portfolios.length > 0 && (
            <p className="port-end">You've seen all our work ✓</p>
          )}

        </div>
      </section>

      <ClientsGrid />
    </>
  );
}

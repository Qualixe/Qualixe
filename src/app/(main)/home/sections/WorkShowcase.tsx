'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Portfolio } from '../../../../../lib/api/portfolio';

function hostOf(url?: string) {
  if (!url) return '';
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

function WorkCard({ item, index }: { item: Portfolio; index: number }) {
  const host = hostOf(item.project_url);
  return (
    <article className="hx-work">
      <a
        href={item.project_url || '/portfolio'}
        target={item.project_url ? '_blank' : undefined}
        rel={item.project_url ? 'noopener noreferrer' : undefined}
        className="hx-work__link"
      >
        <div className="hx-work__frame">
          <div className="hx-work__bar" aria-hidden="true">
            <span className="hx-work__dots"><i /><i /><i /></span>
            <span className="hx-work__url">{host || 'shopify-store'}</span>
          </div>
          <div className="hx-work__screen">
            {item.image_url && (
              <Image
                src={item.image_url}
                alt={`${item.title} website`}
                fill
                sizes="(max-width: 768px) 85vw, 560px"
                className="hx-work__img"
              />
            )}
          </div>
        </div>
        <div className="hx-work__meta">
          <span className="hx-work__index">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3 className="hx-work__title">{item.title}</h3>
            {item.category && <span className="hx-work__cat">{item.category}</span>}
          </div>
          <span className="hx-work__go" aria-hidden="true"><ArrowUpRight size={18} /></span>
        </div>
      </a>
    </article>
  );
}

export default function WorkShowcase({ items }: { items: Portfolio[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);

  // Measure how far the track must travel; pinning only on wide screens
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const wide = window.innerWidth >= 992 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setPinned(wide);
      if (!track || !wide) { setDistance(0); return; }
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth + 48));
    };
    measure();
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => { window.removeEventListener('resize', measure); ro.disconnect(); };
  }, [items.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(xRaw, { stiffness: 120, damping: 30, mass: 0.4 });
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={`hx-workwrap${pinned ? ' is-pinned' : ''}`}
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
      aria-labelledby="hx-work-title"
    >
      <div className="hx-workwrap__sticky">
        <div className="container">
          <div className="hx-workwrap__head">
            <div>
              <span className="hx-eyebrow hx-eyebrow--light">Selected work</span>
              <h2 id="hx-work-title" className="hx-h2 hx-h2--light">
                Stores that look sharp <span className="hx-gradient-text">&amp; sell more</span>
              </h2>
            </div>
            <Link href="/portfolio" className="hx-btn hx-btn--glass">
              View all work <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <motion.div ref={trackRef} className="hx-worktrack" style={pinned ? { x } : undefined}>
          {items.map((item, i) => (
            <WorkCard key={item.id ?? i} item={item} index={i} />
          ))}
          <Link href="/portfolio" className="hx-work hx-work--more">
            <span className="hx-work--more__inner">
              <span className="hx-work--more__icon"><ArrowRight size={28} /></span>
              <strong>See every project</strong>
              <small>Shopify stores, e-commerce builds &amp; Laravel apps</small>
            </span>
          </Link>
        </motion.div>

        {pinned && (
          <div className="container">
            <div className="hx-workwrap__progress" aria-hidden="true">
              <motion.span style={{ width: progress }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

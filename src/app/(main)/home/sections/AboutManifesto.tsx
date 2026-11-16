'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform, animate, type MotionValue } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import type { HomeAbout } from '../../../../../lib/api/home-page';

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <span className="hx-word">
      <motion.span style={{ opacity }}>{children}</motion.span>{' '}
    </span>
  );
}

function RevealText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <p ref={ref} className="hx-manifesto__text">
      {words.map((w, i) => {
        const start = i / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, start + 1 / words.length]}>
            {w}
          </Word>
        );
      })}
    </p>
  );
}

/** "50+" → 50 / "+", "4.9★" → 4.9 / "★", "98%" → 98 / "%" */
function parseStat(value: string) {
  const m = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  return { prefix: m[1], num: parseFloat(m[2]), decimals: (m[2].split('.')[1] || '').length, suffix: m[3] };
}

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const parsed = parseStat(value);
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value);

  useEffect(() => {
    if (!inView || !parsed) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, parsed.num, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(`${parsed.prefix}${v.toFixed(parsed.decimals)}${parsed.suffix}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
}

export default function AboutManifesto({ data }: { data: HomeAbout }) {
  const headingLines = data.heading.split('\n');

  return (
    <section className="hx-section hx-manifesto" aria-labelledby="hx-about-title">
      <div className="container">
        <div className="hx-manifesto__grid">
          <div className="hx-manifesto__side">
            <span className="hx-eyebrow">{data.label}</span>
            <h2 id="hx-about-title" className="hx-h2">
              {headingLines.map((line, i) => (
                <span key={i} className="d-block">{line}</span>
              ))}
            </h2>
            {data.cta_url && (
              <Link href={data.cta_url} className="hx-link">
                {data.cta_text.replace(/[→>]\s*$/, '').trim()} <ArrowUpRight size={16} />
              </Link>
            )}
          </div>

          <div className="hx-manifesto__main">
            <RevealText text={data.description} />

            {data.stats?.length > 0 && (
              <dl className="hx-stats">
                {data.stats.map((s, i) => (
                  <motion.div
                    key={i}
                    className="hx-stat"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <dd><CountUp value={s.value} /></dd>
                    <dt>{s.label}</dt>
                  </motion.div>
                ))}
              </dl>
            )}

            {data.reasons?.length > 0 && (
              <ul className="hx-reasons">
                {data.reasons.map((r, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                  >
                    <span className="hx-reasons__icon" aria-hidden="true">{r.icon}</span>
                    {r.text}
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

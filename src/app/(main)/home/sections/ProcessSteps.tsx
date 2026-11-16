'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

const STEPS = [
  {
    icon: 'bi-compass',
    title: 'Discover',
    text: 'We dig into your brand, customers and goals, then map the scope, timeline and success metrics.',
  },
  {
    icon: 'bi-vector-pen',
    title: 'Design',
    text: 'Wireframes and pixel-perfect mockups you approve before a single line of code is written.',
  },
  {
    icon: 'bi-code-slash',
    title: 'Build',
    text: 'Clean, fast Shopify development — custom sections, integrations and a checkout that converts.',
  },
  {
    icon: 'bi-rocket-takeoff',
    title: 'Launch & grow',
    text: 'Thorough QA, a smooth go-live, then ongoing optimisation and support as you scale.',
  },
];

export default function ProcessSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.55'] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section className="hx-section hx-process" aria-labelledby="hx-process-title">
      <div className="container">
        <div className="hx-head hx-head--center">
          <span className="hx-eyebrow">How we work</span>
          <h2 id="hx-process-title" className="hx-h2">From idea to a store that sells</h2>
          <p className="hx-lead">A clear, collaborative process — you always know what&apos;s happening and what&apos;s next.</p>
        </div>

        <div ref={ref} className="hx-steps">
          <div className="hx-steps__line" aria-hidden="true">
            <motion.span style={{ scaleX }} />
          </div>
          <ol className="hx-steps__list">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.title}
                className="hx-step"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="hx-step__node" aria-hidden="true">
                  <i className={`bi ${s.icon}`} />
                </span>
                <span className="hx-step__num">Step {String(i + 1).padStart(2, '0')}</span>
                <h3 className="hx-step__title">{s.title}</h3>
                <p className="hx-step__text">{s.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

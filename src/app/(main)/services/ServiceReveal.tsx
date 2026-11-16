'use client';

import { useEffect } from 'react';

/**
 * Progressive scroll-reveal for elements marked [data-reveal].
 * Content is fully visible without JS (and to crawlers); the hidden
 * start state only applies once this runs and adds `.sv-js` to <html>.
 */
export default function ServiceReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    root.classList.add('sv-js');
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.classList.remove('sv-js');
    };
  }, []);
  return null;
}

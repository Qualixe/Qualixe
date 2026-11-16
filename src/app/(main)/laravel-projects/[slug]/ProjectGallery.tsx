'use client';
/* eslint-disable @next/next/no-img-element -- images come from arbitrary CMS URLs */

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

export default function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close, prev, next]);

  return (
    <>
      <div className="lp-gallery">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            className="lp-gallery__item"
            onClick={() => setIndex(i)}
            aria-label={`Open screenshot ${i + 1} of ${images.length}`}
          >
            <img src={src} alt={`${title} screen ${i + 1}`} loading="lazy" />
            <span className="lp-gallery__zoom" aria-hidden="true"><Maximize2 size={16} /></span>
          </button>
        ))}
      </div>

      {open && (
        <div className="lp-lightbox" role="dialog" aria-modal="true" aria-label={`${title} screenshots`} onClick={close}>
          <button type="button" className="lp-lightbox__close" onClick={close} aria-label="Close">
            <X size={20} />
          </button>
          {images.length > 1 && (
            <button
              type="button"
              className="lp-lightbox__nav lp-lightbox__nav--prev"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous screenshot"
            >
              <ChevronLeft size={22} />
            </button>
          )}
          <figure className="lp-lightbox__figure" onClick={(e) => e.stopPropagation()}>
            <img src={images[index!]} alt={`${title} screen ${index! + 1}`} />
            <figcaption>{index! + 1} / {images.length}</figcaption>
          </figure>
          {images.length > 1 && (
            <button
              type="button"
              className="lp-lightbox__nav lp-lightbox__nav--next"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next screenshot"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      )}
    </>
  );
}

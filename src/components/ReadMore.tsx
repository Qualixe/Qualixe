'use client';

import { useState, useRef, useEffect } from 'react';
import './ReadMore.css';

interface ReadMoreProps {
  text: string;
  lines?: number;
}

export default function ReadMore({ text, lines = 4 }: ReadMoreProps) {
  const [open, setOpen] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);
  const previewRef = useRef<HTMLParagraphElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preview = previewRef.current;
    const full = fullRef.current;
    if (!preview || !full) return;

    // Measure if text overflows the clamped box
    setIsClamped(preview.scrollHeight > preview.clientHeight + 1);
    // Capture the natural full height for smooth transition
    setFullHeight(full.scrollHeight);
  }, [text]);

  return (
    <div className="read-more">
      {/* Clamped preview — hidden once open */}
      {!open && (
        <p
          ref={previewRef}
          className="read-more__preview"
          style={{
            WebkitLineClamp: lines,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {text}
        </p>
      )}

      {/* Full text — animates via max-height with exact scrollHeight */}
      <div
        ref={fullRef}
        className="read-more__full"
        style={{ maxHeight: open ? fullHeight : 0 }}
        aria-hidden={!open}
      >
        <p>{text}</p>
      </div>

      {isClamped && (
        <button
          className="read-more__btn"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
        >
          {open
            ? <>Show less <i className="bi bi-chevron-up" /></>
            : <>Read more <i className="bi bi-chevron-down" /></>}
        </button>
      )}
    </div>
  );
}

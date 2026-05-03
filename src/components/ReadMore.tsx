'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './ReadMore.css';

interface ReadMoreProps {
  text: string;
  lines?: number;
}

export default function ReadMore({ text, lines = 4 }: ReadMoreProps) {
  const [open, setOpen] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const previewRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    setIsClamped(el.scrollHeight > el.clientHeight + 1);
  }, [text]);

  return (
    <div className="read-more">

      {/* Preview — always in DOM so we can measure it.
          Fades out when open but does NOT unmount,
          so there's no layout gap during the transition. */}
      <p
        ref={previewRef}
        className="read-more__preview"
        style={{
          WebkitLineClamp: open ? 'unset' : lines,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          overflow: open ? 'visible' : 'hidden',
          // Fade out the clamped version while full text slides in
          opacity: open ? 0 : 1,
          position: open ? 'absolute' : 'relative',
          pointerEvents: 'none',
          // Keep it out of flow once open so it doesn't add height
          visibility: open ? 'hidden' : 'visible',
        }}
        aria-hidden={open}
      >
        {text}
      </p>

      {/* Full text — Motion animates height from 0 → auto */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="full"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height:  { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.3, ease: 'easeInOut' },
            }}
            style={{ overflow: 'hidden' }}
          >
            <p className="read-more__full-text">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {isClamped && (
        <button
          className="read-more__btn"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span key="less" className="read-more__btn-inner"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
                Show less <i className="bi bi-chevron-up" />
              </motion.span>
            ) : (
              <motion.span key="more" className="read-more__btn-inner"
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }}>
                Read more <i className="bi bi-chevron-down" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      )}
    </div>
  );
}

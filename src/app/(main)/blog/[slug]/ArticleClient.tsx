'use client';

import { useEffect, useState } from 'react';
import { blogAPI, blogLikesAPI } from '../../../../../lib/api/blog';

/* ── Reading progress bar (fixed under the header) ─────── */
export function ArticleProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.querySelector('.ar-article');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      setP(Math.min(1, Math.max(0, -r.top / (total || 1))));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return (
    <div className="ar-progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}

/* ── Counts one view per browser session ───────────────── */
export function ViewCounter({ postId }: { postId: string }) {
  useEffect(() => {
    const key = `viewed:${postId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      /* storage unavailable — still count */
    }
    blogAPI.incrementViews(postId).catch(() => {});
  }, [postId]);
  return null;
}

/* ── Table of contents with active-section highlight ───── */
export function ArticleToc({ items }: { items: { id: string; text: string; level: 2 | 3 }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const headings = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px' }
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="ar-toc" aria-label="Table of contents">
      <span className="ar-toc__title"><i className="bi bi-list-ul" aria-hidden="true" /> On this page</span>
      <ol>
        {items.map((i) => (
          <li key={i.id} className={`ar-toc__item ar-toc__item--h${i.level}${active === i.id ? ' is-active' : ''}`}>
            <a href={`#${i.id}`}>{i.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ── Like + share ──────────────────────────────────────── */
async function getVisitorId() {
  // Same identifier the existing likes table uses (public IP)
  try {
    const r = await fetch('https://api.ipify.org?format=json');
    const d = await r.json();
    return d.ip as string;
  } catch {
    return 'unknown';
  }
}

export function PostActions({
  postId, initialLikes, url, title, variant,
}: { postId: string; initialLikes: number; url: string; title: string; variant: 'rail' | 'bar' }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    getVisitorId()
      .then((ip) => blogLikesAPI.hasLiked(postId, ip))
      .then((v) => { if (alive) setLiked(Boolean(v)); })
      .catch(() => {});
    return () => { alive = false; };
  }, [postId]);

  const toggleLike = async () => {
    if (busy) return;
    setBusy(true);
    const next = !liked;
    setLiked(next);
    setLikes((n) => Math.max(0, n + (next ? 1 : -1)));
    try {
      const ip = await getVisitorId();
      if (next) await blogLikesAPI.like(postId, ip);
      else await blogLikesAPI.unlike(postId, ip);
    } catch {
      // revert on failure
      setLiked(!next);
      setLikes((n) => Math.max(0, n + (next ? -1 : 1)));
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const enc = encodeURIComponent;
  const shares = [
    { label: 'Share on X', icon: 'bi-twitter-x', href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}` },
    { label: 'Share on Facebook', icon: 'bi-facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { label: 'Share on LinkedIn', icon: 'bi-linkedin', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: 'Share on WhatsApp', icon: 'bi-whatsapp', href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
  ];

  return (
    <div className={`ar-share ar-share--${variant}`}>
      <button
        type="button"
        className={`ar-share__btn ar-like${liked ? ' is-liked' : ''}`}
        onClick={toggleLike}
        aria-pressed={liked}
        aria-label={liked ? 'Unlike this article' : 'Like this article'}
      >
        <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'}`} aria-hidden="true" />
        <span className="ar-like__count">{likes}</span>
      </button>
      {variant === 'rail' && <span className="ar-share__divider" aria-hidden="true" />}
      {shares.map((s) => (
        <a key={s.icon} href={s.href} target="_blank" rel="noopener noreferrer" className="ar-share__btn" aria-label={s.label} title={s.label}>
          <i className={`bi ${s.icon}`} aria-hidden="true" />
        </a>
      ))}
      <button type="button" className="ar-share__btn" onClick={copy} aria-label="Copy link" title={copied ? 'Copied!' : 'Copy link'}>
        <i className={`bi ${copied ? 'bi-check2' : 'bi-link-45deg'}`} aria-hidden="true" />
      </button>
    </div>
  );
}

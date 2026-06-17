'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Eye, Download, ShoppingCart, Star, Check,
  ChevronRight, ExternalLink, ArrowLeft, Shield, Clock, Zap
} from 'lucide-react';
import { slugify } from '@/lib/slugify';
import './product.css';

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  badge?: string;
  badge_color?: string;
  preview_url?: string;
  demo_url?: string;
  file_path?: string;
  buy_link?: string;
  features: string[];
  active: boolean;
}

function FreeClaimModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/claim-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, productId: product.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to claim');
      router.push(`/shop/success?token=${data.token}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="pd-modal-backdrop" onClick={onClose} />
      <div className="pd-modal" role="dialog" aria-modal="true">
        <button className="pd-modal__close" onClick={onClose}>✕</button>
        <div className="pd-modal__icon">🎁</div>
        <h2 className="pd-modal__title">Get Your Free Template</h2>
        <p className="pd-modal__sub">Instant access to <strong>{product.name}</strong>.</p>
        <form className="pd-modal__form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input type="text" className="form-control" placeholder="Your name"
              value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input type="email" className="form-control" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          <button type="submit" className="btn btn-success w-100 fw-bold py-2" disabled={loading}>
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
              : <><Download size={16} className="me-2" />Download Free Template</>}
          </button>
          <p className="text-center text-muted mt-2" style={{ fontSize: 12 }}>No spam. Unsubscribe anytime.</p>
        </form>
      </div>
    </>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'features'>('overview');
  const [claimOpen, setClaimOpen] = useState(false);
  const [imgZoom, setImgZoom] = useState(false);

  const isFree = (p: Product) => Number(p.price) === 0;

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/products/${id}`).then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
    ]).then(([prod, all]) => {
      if (prod?.error) { setLoading(false); return; }
      setProduct(prod);
      setRelated((all as Product[]).filter((p: Product) => p.id !== id).slice(0, 3));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="pd-page">
        <div className="container">
          <div className="pd-skeleton">
            <div className="pd-skeleton__img skeleton-pulse" />
            <div className="pd-skeleton__info">
              <div className="skeleton-line skeleton-line--lg" />
              <div className="skeleton-line skeleton-line--md mt-3" />
              <div className="skeleton-line skeleton-line--sm mt-2" />
              <div className="skeleton-line skeleton-line--sm mt-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-page">
        <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h2>Product not found</h2>
          <Link href="/shop" className="pd-back-btn mt-4">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  const free = isFree(product);

  return (
    <div className="pd-page">
      <div className="container">

        {/* ── Breadcrumb ─────────────────────────────────── */}
        <nav className="pd-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={13} />
          <Link href="/shop">Templates</Link>
          <ChevronRight size={13} />
          <span>{product.name}</span>
        </nav>

        {/* ── Main 2-column layout ───────────────────────── */}
        <div className="pd-main">

          {/* LEFT: image preview */}
          <div className="pd-left">
            <div
              className={`pd-preview-frame${imgZoom ? ' zoomed' : ''}`}
              onClick={() => setImgZoom(z => !z)}
              title="Click to zoom"
            >
              {product.preview_url ? (
                <img
                  src={product.preview_url}
                  alt={`${product.name} preview`}
                  className="pd-preview-img"
                />
              ) : (
                <div className="pd-preview-placeholder">
                  <Eye size={40} style={{ opacity: 0.3 }} />
                  <p>No preview available</p>
                </div>
              )}
              <span className="pd-preview-hint">
                {imgZoom ? 'Click to collapse' : 'Click to expand'}
              </span>
            </div>

            {product.demo_url && (
              <Link
                href={`/preview/${product.id}?url=${encodeURIComponent(product.demo_url)}&name=${encodeURIComponent(product.name)}`}
                className="pd-demo-link"
              >
                <ExternalLink size={14} /> View Live Demo
              </Link>
            )}
          </div>

          {/* RIGHT: product info */}
          <div className="pd-right">

            {/* Tags */}
            <div className="pd-tags">
              {product.badge && (
                <span className="pd-tag" style={{ background: product.badge_color ?? '#0c3cc3', color: '#fff' }}>
                  {product.badge}
                </span>
              )}
              {free && <span className="pd-tag pd-tag--free">FREE</span>}
              {!free && <span className="pd-tag pd-tag--premium">PREMIUM</span>}
              <span className="pd-tag pd-tag--neutral">HTML Template</span>
            </div>

            {/* Title */}
            <h1 className="pd-title">{product.name}</h1>

            {/* Stars */}
            <div className="pd-rating">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
              ))}
              <span className="pd-rating__label">5.0 rating</span>
            </div>

            {/* Tagline */}
            <p className="pd-tagline">{product.tagline}</p>

            {/* Price */}
            <div className="pd-price-box">
              {free ? (
                <>
                  <span className="pd-price pd-price--free">Free</span>
                  <span className="pd-price-note">No credit card required</span>
                </>
              ) : (
                <>
                  <span className="pd-price">${product.price.toFixed(2)}</span>
                  <span className="pd-price-note">One-time payment · Lifetime access</span>
                </>
              )}
            </div>

            {/* Features quick list */}
            {product.features?.length > 0 && (
              <ul className="pd-quick-features">
                {product.features.slice(0, 6).map((f, i) => (
                  <li key={i}><Check size={14} />{f}</li>
                ))}
              </ul>
            )}

            {/* CTA buttons */}
            <div className="pd-ctas">
              {product.demo_url && (
                <Link
                  href={`/preview/${product.id}?url=${encodeURIComponent(product.demo_url)}&name=${encodeURIComponent(product.name)}`}
                  className="pd-btn pd-btn--demo"
                >
                  <Eye size={16} /> Live Preview
                </Link>
              )}
              {free ? (
                <button className="pd-btn pd-btn--primary" onClick={() => setClaimOpen(true)}>
                  <Download size={16} /> Free Download
                </button>
              ) : (
                <a
                  href={product.buy_link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pd-btn pd-btn--primary"
                >
                  <ShoppingCart size={16} /> Purchase
                </a>
              )}
            </div>

            {/* Trust badges */}
            <div className="pd-trust">
              <div className="pd-trust__item"><Shield size={14} /><span>Clean Code</span></div>
              <div className="pd-trust__item"><Zap size={14} /><span>Instant Access</span></div>
              <div className="pd-trust__item"><Clock size={14} /><span>Lifetime License</span></div>
            </div>

          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────── */}
        <div className="pd-tabs-section">
          <div className="pd-tabs">
            <button
              className={`pd-tab${activeTab === 'overview' ? ' active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            {product.features?.length > 0 && (
              <button
                className={`pd-tab${activeTab === 'features' ? ' active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                Features
              </button>
            )}
          </div>

          <div className="pd-tab-content">
            {activeTab === 'overview' && (
              <div className="pd-overview">
                {product.description ? (
                  <p>{product.description}</p>
                ) : (
                  <p>No description available for this template.</p>
                )}
              </div>
            )}
            {activeTab === 'features' && (
              <div className="pd-features-grid">
                {product.features.map((f, i) => (
                  <div key={i} className="pd-feature-item">
                    <div className="pd-feature-icon"><Check size={16} /></div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Related products ──────────────────────────── */}
        {related.length > 0 && (
          <div className="pd-related">
            <h2 className="pd-related__title">You Might Also Like</h2>
            <div className="pd-related__grid">
              {related.map(p => (
                <Link key={p.id} href={`/shop/${slugify(p.name)}`} className="pd-related-card">
                  <div className="pd-related-card__thumb">
                    {p.preview_url ? (
                      <img src={p.preview_url} alt={p.name} />
                    ) : (
                      <div className="pd-related-card__placeholder" />
                    )}
                    {isFree(p) && <span className="pd-related-card__badge">FREE</span>}
                  </div>
                  <div className="pd-related-card__info">
                    <h3>{p.name}</h3>
                    <p>{p.tagline}</p>
                    <span className="pd-related-card__price">
                      {isFree(p) ? 'Free' : `$${p.price.toFixed(2)}`}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Back to shop ──────────────────────────────────── */}
      <div className="pd-back-bar">
        <div className="container">
          <Link href="/shop" className="pd-back-link">
            <ArrowLeft size={16} /> Back to all templates
          </Link>
        </div>
      </div>

      {claimOpen && product && (
        <FreeClaimModal product={product} onClose={() => setClaimOpen(false)} />
      )}

      {imgZoom && (
        <div className="pd-lightbox" onClick={() => setImgZoom(false)}>
          <div className="pd-lightbox__inner" onClick={e => e.stopPropagation()}>
            <button className="pd-lightbox__close" onClick={() => setImgZoom(false)}>✕</button>
            <img src={product.preview_url} alt={product.name} />
          </div>
        </div>
      )}
    </div>
  );
}

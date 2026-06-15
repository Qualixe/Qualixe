'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Download } from 'lucide-react';
import Link from 'next/link';
import { slugify } from '@/lib/slugify';
import './shop.css';

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category?: string;
  badge?: string;
  badge_color?: string;
  preview_url?: string;
  demo_url?: string;
  file_path?: string;
  buy_link?: string;
  features: string[];
  active: boolean;
}

/* ── Free claim modal ─────────────────────────────────── */
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
      <div className="shop-modal-backdrop" onClick={onClose} />
      <div className="shop-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="shop-modal__close" onClick={onClose} aria-label="Close">✕</button>
        <div className="shop-modal__icon">🎁</div>
        <h2 className="shop-modal__title" id="modal-title">Get Your Free Template</h2>
        <p className="shop-modal__sub">
          Enter your details for instant access to <strong>{product.name}</strong>.
        </p>
        <form className="shop-modal__form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="claim-name" className="form-label fw-semibold">Full Name</label>
            <input
              id="claim-name" type="text" className="form-control"
              placeholder="Your name" value={name}
              onChange={e => setName(e.target.value)} required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="claim-email" className="form-label fw-semibold">Email Address</label>
            <input
              id="claim-email" type="email" className="form-control"
              placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)} required
            />
          </div>
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          <button type="submit" className="btn btn-success w-100 fw-bold py-2" disabled={loading}>
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
              : <><Download size={16} className="me-2" />Download Free Template</>}
          </button>
          <p className="text-center text-muted mt-2" style={{ fontSize: 12 }}>
            No spam. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </>
  );
}

/* ── Main page ────────────────────────────────────────── */
export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [claimProduct, setClaimProduct] = useState<Product | null>(null);
  const [typeFilter, setTypeFilter] = useState<'All' | 'Free' | 'Premium'>('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const isFree = (p: Product) => Number(p.price) === 0;

  function handleFreeClick(p: Product) {
    if (p.id) setClaimProduct(p);
    else if (p.file_path) window.open(p.file_path, '_blank');
  }

  /* derive category label: use category field, else tagline, else 'Other' */
  const getCategory = (p: Product) => p.category || p.tagline || 'Other';

  /* unique categories from all products */
  const allCategories = ['All', ...Array.from(new Set(products.map(getCategory)))];

  /* filtered list */
  const visibleProducts = products.filter(p => {
    const typeOk =
      typeFilter === 'All' ||
      (typeFilter === 'Free' && isFree(p)) ||
      (typeFilter === 'Premium' && !isFree(p));
    const catOk = categoryFilter === 'All' || getCategory(p) === categoryFilter;
    return typeOk && catOk;
  });

  /* count per category for pills */
  const countForCategory = (cat: string) =>
    cat === 'All'
      ? products.filter(p =>
          typeFilter === 'All' ? true :
          typeFilter === 'Free' ? isFree(p) : !isFree(p)
        ).length
      : products.filter(p => {
          const typeOk =
            typeFilter === 'All' ||
            (typeFilter === 'Free' && isFree(p)) ||
            (typeFilter === 'Premium' && !isFree(p));
          return typeOk && getCategory(p) === cat;
        }).length;

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Free & Premium HTML Templates by Qualixe',
            description: 'Download free and premium production-ready HTML templates.',
            url: 'https://qualixe.com/shop',
            itemListElement: products.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Product',
                name: p.name,
                description: p.description,
                offers: {
                  '@type': 'Offer',
                  price: p.price,
                  priceCurrency: 'USD',
                  availability: 'https://schema.org/InStock',
                },
              },
            })),
          }),
        }}
      />

      <main className="shop-page">

        {/* ── Page heading ──────────────────────────────── */}
        <section className="shop-heading-section">
          <div className="container">
            <h1 className="shop-main-title">HTML Templates</h1>
            <p className="shop-main-sub">
              Discover our collection of responsive, production-ready HTML templates.
              All templates are built with clean code, fully responsive, perfect for modern websites and apps.
            </p>
          </div>
        </section>

        {/* ── Filter panel ──────────────────────────────── */}
        <section className="shop-filter-section">
          <div className="container">
            <div className="shop-filter-panel">
              {/* Left: type toggles */}
              <div className="shop-type-filters">
                {(['All', 'Free', 'Premium'] as const).map(t => (
                  <button
                    key={t}
                    className={`shop-type-btn${typeFilter === t ? ' active' : ''}`}
                    onClick={() => { setTypeFilter(t); setCategoryFilter('All'); }}
                  >
                    {t === 'Free' && <i className="bi bi-gift me-1" />}
                    {t === 'Premium' && <i className="bi bi-gem me-1" />}
                    {t === 'All' && <i className="bi bi-grid-3x3-gap me-1" />}
                    {t}
                  </button>
                ))}
              </div>

              {/* Right: category pills */}
              <div className="shop-cat-filters">
                {allCategories.map(cat => {
                  const count = countForCategory(cat);
                  if (cat !== 'All' && count === 0) return null;
                  return (
                    <button
                      key={cat}
                      className={`shop-cat-btn${categoryFilter === cat ? ' active' : ''}`}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat}
                      <span className="shop-cat-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Product grid ──────────────────────────────── */}
        <section className="shop-products-section">
          <div className="container">
            {loading ? (
              <div className="shop-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="shop-card shop-card--skeleton">
                    <div className="shop-card__thumb skeleton-block" />
                    <div className="shop-card__info">
                      <div className="skeleton-line skeleton-line--lg" />
                      <div className="skeleton-line skeleton-line--sm mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="shop-empty">
                <p>No templates match the selected filters.</p>
                <button className="shop-reset-btn" onClick={() => { setTypeFilter('All'); setCategoryFilter('All'); }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="shop-grid">
                {visibleProducts.map(product => {
                  const free = isFree(product);
                  return (
                    <article key={product.id} className="shop-card">
                      {/* Thumbnail */}
                      <div className="shop-card__thumb">
                        {product.preview_url ? (
                          <img
                            src={product.preview_url}
                            alt={`${product.name} preview`}
                            className="shop-card__img"
                            loading="lazy"
                          />
                        ) : (
                          <div className="shop-card__placeholder">
                            <div className="ph-bar"><span /><span /><span /></div>
                            <div className="ph-lines">
                              <div className="ph-line ph-line--w" />
                              <div className="ph-line ph-line--m" />
                              <div className="ph-line ph-line--s" />
                            </div>
                          </div>
                        )}

                        {/* Badge */}
                        {product.badge && (
                          <span className="shop-card__badge" style={{ background: product.badge_color ?? '#0c3cc3' }}>
                            {product.badge}
                          </span>
                        )}
                        {free && !product.badge && (
                          <span className="shop-card__badge shop-card__badge--free">FREE</span>
                        )}

                        {/* Eye preview button */}
                        {product.preview_url && (
                          <button
                            className="shop-card__eye"
                            onClick={() => setLightbox(product.preview_url!)}
                            aria-label={`Preview ${product.name}`}
                          >
                            <Eye size={14} />
                          </button>
                        )}
                      </div>

                      {/* Info row */}
                      <div className="shop-card__info">
                        <div className="shop-card__meta">
                          <Link href={`/shop/${slugify(product.name)}`} className="shop-card__name-link">
                            <h3 className="shop-card__name">{product.name}</h3>
                          </Link>
                          <div className="shop-card__price">
                            {free
                              ? <span className="shop-card__price--free">Free</span>
                              : <span className="shop-card__price--paid">${product.price.toFixed(2)}</span>
                            }
                          </div>
                        </div>
                        <p className="shop-card__tagline">{product.tagline}</p>

                        {/* Actions */}
                        <div className="shop-card__actions">
                          {product.demo_url && (
                            <a
                              href={product.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shop-card__btn shop-card__btn--demo"
                            >
                              <Eye size={13} /> Demo
                            </a>
                          )}
                          {free ? (
                            <button
                              className="shop-card__btn shop-card__btn--get"
                              onClick={() => handleFreeClick(product)}
                            >
                              <Download size={14} /> Get Free
                            </button>
                          ) : (
                            <a
                              href={product.buy_link || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shop-card__btn shop-card__btn--buy"
                            >
                              Purchase
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Lightbox ──────────────────────────────────── */}
        {lightbox && (
          <div className="shop-lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
            <div className="shop-lightbox__content" onClick={e => e.stopPropagation()}>
              <button className="shop-lightbox__close" onClick={() => setLightbox(null)} aria-label="Close">&#x2715;</button>
              <div className="shop-lightbox__header">
                <h3>{products.find(p => p.preview_url === lightbox)?.name ?? 'Preview'}</h3>
                <span className="shop-lightbox__tag">HTML Template</span>
              </div>
              <div className="shop-lightbox__img-wrap">
                <img src={lightbox} alt="Template preview" />
              </div>
              <div className="shop-lightbox__footer">
                {products.find(p => p.preview_url === lightbox)?.demo_url && (
                  <a
                    href={products.find(p => p.preview_url === lightbox)!.demo_url}
                    target="_blank" rel="noopener noreferrer"
                    className="shop-lightbox__btn shop-lightbox__btn--primary"
                  >
                    <Eye size={16} /> View Live Demo
                  </a>
                )}
                <button className="shop-lightbox__btn shop-lightbox__btn--secondary" onClick={() => setLightbox(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Free claim modal ──────────────────────────── */}
        {claimProduct && (
          <FreeClaimModal product={claimProduct} onClose={() => setClaimProduct(null)} />
        )}

      </main>
    </>
  );
}

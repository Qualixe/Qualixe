'use client';

import { useEffect, useState, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Check, Eye, Download } from 'lucide-react';
import './shop.css';

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
  features: string[];
  active: boolean;
}

export default function ShopPage() {
  const { addItem, items, openCart, drawerEnabled } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const isInCart = useCallback((id: string) => items.some(i => i.id === id), [items]);
  const isFree = (p: Product) => Number(p.price) === 0;

  function handleAddToCart(p: Product) {
    addItem({ id: p.id, name: p.name, price: p.price, priceLabel: p.price.toFixed(2), description: p.tagline });
    if (!drawerEnabled) router.push('/cart');
  }

  return (
    <main className="shop-page">

      {/* Hero */}
      <section className="shop-hero">
        <div className="container">
          <span className="shop-hero__tag">Digital Products</span>
          <h1 className="shop-hero__title">HTML Templates</h1>
          <p className="shop-hero__sub">Production-ready templates. Buy once, use forever.</p>
        </div>
      </section>

      {/* Products */}
      <section className="shop-products">
        <div className="container">
          {loading ? (
            <div className="shop-grid">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="product-card product-card--skeleton">
                  <div className="product-card__preview skeleton-block" />
                  <div className="product-card__body">
                    <div className="skeleton-line skeleton-line--sm mb-2" />
                    <div className="skeleton-line skeleton-line--lg mb-2" />
                    <div className="skeleton-line skeleton-line--md mb-4" />
                    <div className="skeleton-line skeleton-line--sm" />
                    <div className="skeleton-line skeleton-line--sm" />
                    <div className="skeleton-line skeleton-line--sm mb-4" />
                    <div className="product-card__footer">
                      <div className="skeleton-line skeleton-line--price" />
                      <div className="skeleton-btn" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>No products available yet.</p>
            </div>
          ) : (
            <div className="shop-grid">
              {products.map(product => {
                const free = isFree(product);
                const inCart = isInCart(product.id);
                return (
                  <div key={product.id} className="product-card">
                    {product.badge && (
                      <span className="product-card__badge" style={{ background: product.badge_color ?? '#0d6efd' }}>
                        {product.badge}
                      </span>
                    )}
                   {product.preview_url && (
                          <button
                            className="product-card__eye-btn"
                            onClick={() => setLightbox(product.preview_url!)}
                            title="Preview"
                          >
                            <Eye size={15} />
                          </button>
                        )}

                    {/* Preview */}
                    <div className="product-card__preview" style={{ cursor: product.preview_url ? 'pointer' : 'default' }}
                      onClick={() => product.preview_url && setLightbox(product.preview_url)}>
                      {product.preview_url ? (
                        <img src={product.preview_url} alt={product.name} className="product-card__preview-img" loading="lazy" />
                      ) : (
                        <div className="product-card__preview-inner">
                          <div className="preview-bar"><span /><span /><span /></div>
                          <div className="preview-lines">
                            <div className="preview-line preview-line--wide" />
                            <div className="preview-line preview-line--mid" />
                            <div className="preview-line preview-line--short" />
                            <div className="preview-blocks">
                              <div className="preview-block" /><div className="preview-block" /><div className="preview-block" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="product-card__body">
                      <p className="product-card__tagline">{product.tagline}</p>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h2 className="product-card__name mb-0">{product.name}</h2>
                      </div>
                      <p className="product-card__desc">{product.description}</p>

                      {product.features?.length > 0 && (
                        <ul className="product-card__features">
                          {product.features.map((f, i) => (
                            <li key={i}>
                              <i className="bi bi-check-circle-fill feature-check" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="product-card__footer">
                        <div className="product-card__price">
                          {free ? (
                            <span className="price-amount price-amount--free">Free</span>
                          ) : (
                            <>
                              <span className="price-amount">${product.price.toFixed(2)}</span>
                              <span className="price-note">one-time</span>
                            </>
                          )}
                        </div>
                        <div className="product-card__actions">
                          {product.demo_url && (
                            <a href={product.demo_url} target="_blank" rel="noopener noreferrer"
                              className="product-card__btn product-card__btn--demo">
                              <Eye size={15} /> Demo
                            </a>
                          )}
                          {free ? (
                            <button className="product-card__btn product-card__btn--free"
                              onClick={() => window.open(product.file_path, '_blank')}>
                              <Download size={16} /> Get Free
                            </button>
                          ) : inCart ? (
                            <button className="product-card__btn product-card__btn--added"
                              onClick={() => drawerEnabled ? openCart() : router.push('/cart')}>
                              <Check size={16} /> In Cart
                            </button>
                          ) : (
                            <button className="product-card__btn" onClick={() => handleAddToCart(product)}>
                              <ShoppingCart size={16} /> Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Trust bar */}
      <section className="shop-trust">
        <div className="container">
          <div className="shop-trust__grid">
            {[
              { icon: '🔒', text: 'Secure Payment' },
              { icon: '⚡', text: 'Instant Download' },
              { icon: '♾️', text: 'Lifetime Access' },
              { icon: '💬', text: 'Dedicated Support' },
            ].map(t => (
              <div key={t.text} className="trust-item"><span>{t.icon}</span><span>{t.text}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="shop-lightbox" onClick={() => setLightbox(null)}>
          <div className="shop-lightbox__content" onClick={e => e.stopPropagation()}>
            <button className="shop-lightbox__close" onClick={() => setLightbox(null)} aria-label="Close">&#x2715;</button>
            <div className="shop-lightbox__header">
              <h3>{products.find(p => p.preview_url === lightbox)?.name ?? 'Preview'}</h3>
              <span className="shop-lightbox__tag">HTML Template</span>
            </div>
            <div className="shop-lightbox__img-wrap">
              <img src={lightbox} alt="Preview" />
            </div>
            <div className="shop-lightbox__footer">
              {products.find(p => p.preview_url === lightbox)?.demo_url && (
                <a
                  href={products.find(p => p.preview_url === lightbox)!.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
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
    </main>
  );
}

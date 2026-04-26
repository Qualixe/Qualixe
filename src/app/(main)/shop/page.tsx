'use client';

import { useEffect, useState, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Check, Eye, Download, Star, Zap, Shield, Clock, Gift, Crown } from 'lucide-react';
import Link from 'next/link';
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
  const { addItem, items, openCart, drawerEnabled } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [claimProduct, setClaimProduct] = useState<Product | null>(null);

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

  function handleFreeClick(p: Product) {
    if (p.id) setClaimProduct(p);
    else if (p.file_path) window.open(p.file_path, '_blank');
  }

  const freeProducts = products.filter(isFree);
  const paidProducts = products.filter(p => !isFree(p));

  return (
    <>
      {/* JSON-LD — auto-populates with real products from DB */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Free & Premium HTML Templates by Qualixe',
            description: 'Download free and premium production-ready HTML templates for e-commerce, business, and portfolio websites.',
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

        {/* ── Hero ──────────────────────────────────────── */}
        <section className="shop-hero" aria-label="HTML Templates hero">
          <div className="container">
            <span className="shop-hero__tag">Free &amp; Premium HTML Templates</span>
            <h1 className="shop-hero__title">
              Professional HTML Templates<br />
              <span className="shop-hero__title-accent">Built to Convert</span>
            </h1>
            <p className="shop-hero__sub">
              Production-ready HTML templates for e-commerce, business &amp; portfolio sites.
              Clean code, fully responsive, SEO-optimized — launch in minutes.
            </p>
            <div className="shop-hero__ctas">
              <a href="#free-templates" className="shop-hero__cta shop-hero__cta--primary">
                <Gift size={18} /> Get Free Templates
              </a>
              {/* Shows automatically when paid products exist */}
              {paidProducts.length > 0 && (
                <a href="#premium-templates" className="shop-hero__cta shop-hero__cta--secondary">
                  <Crown size={18} /> Browse Premium
                </a>
              )}
              {paidProducts.length === 0 && (
                <a href="#free-templates" className="shop-hero__cta shop-hero__cta--secondary">
                  Browse All Templates
                </a>
              )}
            </div>
            <div className="shop-hero__stats">
              <div className="shop-hero__stat"><strong>500+</strong><span>Downloads</span></div>
              <div className="shop-hero__stat-divider" />
              <div className="shop-hero__stat"><strong>Free</strong><span>To Start</span></div>
              <div className="shop-hero__stat-divider" />
              <div className="shop-hero__stat"><strong>4.9★</strong><span>Avg Rating</span></div>
            </div>
          </div>
        </section>

        {/* ── Value bar ─────────────────────────────────── */}
        <section className="shop-value-bar" aria-label="Why choose our templates">
          <div className="container">
            <div className="shop-value-grid">
              {[
                { icon: <Zap size={20} />,    title: 'Instant Download',  desc: 'Get your template immediately after claiming' },
                { icon: <Shield size={20} />, title: 'Clean Code',        desc: 'Semantic HTML5, CSS3, no bloat' },
                { icon: <Star size={20} />,   title: 'SEO Optimized',     desc: 'Built with search rankings in mind' },
                { icon: <Clock size={20} />,  title: 'Save 40+ Hours',    desc: 'Skip the build, focus on your business' },
              ].map(v => (
                <div key={v.title} className="shop-value-item">
                  <div className="shop-value-icon">{v.icon}</div>
                  <div>
                    <strong>{v.title}</strong>
                    <span>{v.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Free templates ────────────────────────────── */}
        {(loading || freeProducts.length > 0) && (
          <section className="shop-products shop-products--free" id="free-templates" aria-label="Free HTML templates">
            <div className="container">
              <div className="shop-section-head">
                <div>
                  <span className="shop-section-tag shop-section-tag--free">
                    <Gift size={14} /> 100% Free
                  </span>
                  <h2 className="shop-section-title">Free HTML Templates</h2>
                  <p className="shop-section-sub">
                    Professional templates at zero cost. Enter your email and download instantly.
                  </p>
                </div>
              </div>
              <ProductGrid
                products={loading ? [] : freeProducts}
                loading={loading}
                isFree={isFree} isInCart={isInCart}
                onFreeClick={handleFreeClick} onAddToCart={handleAddToCart}
                onPreview={setLightbox} drawerEnabled={drawerEnabled}
                openCart={openCart} router={router}
              />
            </div>
          </section>
        )}

        {/* ── Premium templates — renders automatically when paid products are added in dashboard ── */}
        {(loading || paidProducts.length > 0) && (
          <section className="shop-products shop-products--premium" id="premium-templates" aria-label="Premium HTML templates">
            <div className="container">
              <div className="shop-section-head">
                <div>
                  <span className="shop-section-tag shop-section-tag--premium">
                    <Crown size={14} /> Premium
                  </span>
                  <h2 className="shop-section-title">Premium Templates</h2>
                  <p className="shop-section-sub">
                    Advanced multi-page templates with dark mode, Figma files, and priority support.
                  </p>
                </div>
              </div>
              <ProductGrid
                products={loading ? [] : paidProducts}
                loading={false}
                isFree={isFree} isInCart={isInCart}
                onFreeClick={handleFreeClick} onAddToCart={handleAddToCart}
                onPreview={setLightbox} drawerEnabled={drawerEnabled}
                openCart={openCart} router={router}
              />
            </div>
          </section>
        )}

        {/* ── Social proof ──────────────────────────────── */}
        <section className="shop-social-proof" aria-label="Customer testimonials">
          <div className="container">
            <div className="text-center mb-5">
              <span className="shop-section-tag">Testimonials</span>
              <h2 className="shop-section-title mt-2">What Developers Say</h2>
            </div>
            <div className="shop-reviews-grid">
              {[
                {
                  name: 'Arif Rahman', role: 'Freelance Developer',
                  text: 'Saved me hours of work. The code is clean, well-commented, and easy to customize. Highly recommend!',
                  stars: 5,
                },
                {
                  name: 'Priya Sharma', role: 'UI/UX Designer',
                  text: "The design quality is on par with premium templates. I can't believe it's free. Already used it for 3 client projects.",
                  stars: 5,
                },
                {
                  name: 'James Okafor', role: 'E-commerce Entrepreneur',
                  text: 'Launched my store in a weekend using this template. The SEO structure is already built in — huge time saver.',
                  stars: 5,
                },
              ].map(r => (
                <div key={r.name} className="shop-review-card">
                  <div className="shop-review-stars">
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <p className="shop-review-text">"{r.text}"</p>
                  <div className="shop-review-author">
                    <div className="shop-review-avatar">{r.name.charAt(0)}</div>
                    <div>
                      <strong>{r.name}</strong>
                      <span>{r.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────── */}
        <section className="shop-faq" aria-label="Frequently asked questions">
          <div className="container">
            <div className="shop-faq-inner">
              <div className="shop-faq-left">
                <h2>Frequently Asked Questions</h2>
                <p>Everything you need to know about our HTML templates.</p>
                <Link href="/contact" className="shop-faq-cta">
                  Still have questions? Contact us →
                </Link>
              </div>
              <div className="shop-faq-right">
                {[
                  {
                    q: 'Are the free templates really free?',
                    a: 'Yes, 100% free. Just enter your name and email to get instant download access. No credit card required, no hidden fees.',
                  },
                  {
                    q: 'Can I use these templates for client projects?',
                    a: 'Absolutely. All templates — free and premium — come with a commercial license. Use them on unlimited personal and client projects without attribution.',
                  },
                  {
                    q: 'How does buying a premium template work?',
                    a: "Add the template to your cart, enter your email at checkout, and pay securely. You'll receive an instant download link — no account needed, no subscription.",
                  },
                  {
                    q: 'Are the templates SEO-friendly?',
                    a: 'Yes. All templates use semantic HTML5, proper heading hierarchy, meta tag placeholders, fast-loading assets, and structured data support.',
                  },
                  {
                    q: 'Do the templates work on mobile?',
                    a: 'Every template is fully responsive and tested across all major devices and screen sizes — mobile, tablet, and desktop.',
                  },
                  {
                    q: 'What technologies are used?',
                    a: 'Our templates use HTML5, CSS3, and vanilla JavaScript. No heavy frameworks — just clean, fast, maintainable code.',
                  },
                  {
                    q: 'Do you offer customization services?',
                    a: 'Yes! Our team can customize any template to match your brand. Contact us for a free quote.',
                  },
                ].map((faq, i) => (
                  <FaqItem key={i} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA banner ────────────────────────────────── */}
        <section className="shop-cta-banner" aria-label="Call to action">
          <div className="container">
            <div className="shop-cta-inner">
              <div className="shop-cta-text">
                <h2>Need a Custom Website?</h2>
                <p>
                  Our team builds fully custom Shopify stores, e-commerce sites, and web apps.
                  Let's turn your vision into a high-converting website.
                </p>
              </div>
              <div className="shop-cta-actions">
                <Link href="/contact" className="shop-cta-btn shop-cta-btn--primary">
                  Get a Free Quote
                </Link>
                <Link href="/portfolio" className="shop-cta-btn shop-cta-btn--secondary">
                  View Our Work
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust bar ─────────────────────────────────── */}
        <section className="shop-trust" aria-label="Trust signals">
          <div className="container">
            <div className="shop-trust__grid">
              {[
                { icon: '🔒', text: 'Secure Download' },
                { icon: '⚡', text: 'Instant Access' },
                { icon: '♾️', text: 'Lifetime License' },
                { icon: '💬', text: 'Free Support' },
                { icon: '🔄', text: 'Regular Updates' },
              ].map(t => (
                <div key={t.text} className="trust-item">
                  <span>{t.icon}</span><span>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Lightbox ──────────────────────────────────── */}
        {lightbox && (
          <div className="shop-lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true" aria-label="Template preview">
            <div className="shop-lightbox__content" onClick={e => e.stopPropagation()}>
              <button className="shop-lightbox__close" onClick={() => setLightbox(null)} aria-label="Close preview">&#x2715;</button>
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

/* ── Product grid ─────────────────────────────────────── */
function ProductGrid({
  products, loading, isFree, isInCart,
  onFreeClick, onAddToCart, onPreview,
  drawerEnabled, openCart, router,
}: {
  products: Product[];
  loading: boolean;
  isFree: (p: Product) => boolean;
  isInCart: (id: string) => boolean;
  onFreeClick: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onPreview: (url: string) => void;
  drawerEnabled: boolean;
  openCart: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  if (loading) {
    return (
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
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <p>No templates available yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="shop-grid">
      {products.map(product => {
        const free = isFree(product);
        const inCart = isInCart(product.id);
        return (
          <article key={product.id} className="product-card">
            {product.badge && (
              <span className="product-card__badge" style={{ background: product.badge_color ?? '#0d6efd' }}>
                {product.badge}
              </span>
            )}
            {free && !product.badge && (
              <span className="product-card__badge product-card__badge--free">FREE</span>
            )}
            {product.preview_url && (
              <button
                className="product-card__eye-btn"
                onClick={() => onPreview(product.preview_url!)}
                title="Preview template"
                aria-label={`Preview ${product.name}`}
              >
                <Eye size={15} />
              </button>
            )}

            {/* Preview */}
            <div
              className="product-card__preview"
              style={{ cursor: product.preview_url ? 'pointer' : 'default' }}
              onClick={() => product.preview_url && onPreview(product.preview_url)}
              role={product.preview_url ? 'button' : undefined}
              aria-label={product.preview_url ? `Preview ${product.name}` : undefined}
            >
              {product.preview_url ? (
                <img
                  src={product.preview_url}
                  alt={`${product.name} template preview`}
                  className="product-card__preview-img"
                  loading="lazy"
                  width={640} height={480}
                />
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
              <h3 className="product-card__name">{product.name}</h3>
              <p className="product-card__desc">{product.description}</p>

              {product.features?.length > 0 && (
                <ul className="product-card__features" aria-label="Template features">
                  {product.features.map((f, i) => (
                    <li key={i}>
                      <i className="bi bi-check-circle-fill feature-check" aria-hidden="true" />
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
                    <a
                      href={product.demo_url} target="_blank" rel="noopener noreferrer"
                      className="product-card__btn product-card__btn--demo"
                      aria-label={`Live demo of ${product.name}`}
                    >
                      <Eye size={15} /> Demo
                    </a>
                  )}
                  {free ? (
                    <button
                      className="product-card__btn product-card__btn--free"
                      onClick={() => onFreeClick(product)}
                      aria-label={`Download ${product.name} for free`}
                    >
                      <Download size={16} /> Get Free
                    </button>
                  ) : inCart ? (
                    <button
                      className="product-card__btn product-card__btn--added"
                      onClick={() => drawerEnabled ? openCart() : router.push('/cart')}
                      aria-label="View cart"
                    >
                      <Check size={16} /> In Cart
                    </button>
                  ) : (
                    <button
                      className="product-card__btn"
                      onClick={() => onAddToCart(product)}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ── FAQ accordion ────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="shop-faq-item" itemScope itemType="https://schema.org/Question">
      <button
        className={`shop-faq-q ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span itemProp="name">{q}</span>
        <i className={`bi bi-chevron-${open ? 'up' : 'down'}`} aria-hidden="true" />
      </button>
      <div
        className={`shop-faq-a ${open ? 'open' : ''}`}
        itemScope itemType="https://schema.org/Answer"
      >
        <p itemProp="text">{a}</p>
      </div>
    </div>
  );
}

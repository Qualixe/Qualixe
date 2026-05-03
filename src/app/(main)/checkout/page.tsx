'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Lock, ShoppingBag, ArrowLeft, Shield, Zap, RefreshCw, Download } from 'lucide-react';
import './checkout.css';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setError(''); setLoading(true);

    try {
      if (total === 0) {
        const res  = await fetch('/api/claim-free', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, productId: items[0].id }),
        });
        const data = await res.json();
        if (!res.ok || !data.token) { setError(data.error || 'Failed to claim.'); return; }
        clearCart();
        window.location.href = `/shop/success?token=${data.token}&email=${encodeURIComponent(email)}`;
        return;
      }

      const res  = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, productId: items[0].id }),
      });
      const data = await res.json();
      if (!res.ok || !data.payment_url) { setError(data.error || 'Failed to initiate payment.'); return; }
      clearCart();
      window.location.href = data.payment_url;
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="container">
          <div className="checkout-empty">
            <ShoppingBag size={56} strokeWidth={1} />
            <h2>Nothing to checkout</h2>
            <Link href="/shop" className="checkout-empty__btn">Go to Shop</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="container">

        {/* Breadcrumb */}
        <div className="checkout-breadcrumb">
          <Link href="/cart"><ArrowLeft size={15} /> Back to Cart</Link>
          <div className="checkout-steps">
            <span className="checkout-step checkout-step--done">Cart</span>
            <span className="checkout-step__sep">›</span>
            <span className="checkout-step checkout-step--active">Checkout</span>
            <span className="checkout-step__sep">›</span>
            <span className="checkout-step">Confirmation</span>
          </div>
        </div>

        <div className="checkout-layout">

          {/* Form */}
          <div className="checkout-form-col">
            <div className="checkout-form-card">
              <h2 className="checkout-form-card__title">
                <Lock size={20} /> Secure Checkout
              </h2>
              <p className="checkout-form-card__sub">
                Enter your details to complete the purchase
              </p>

              <form onSubmit={handleSubmit}>
                <div className="checkout-field">
                  <label>Full Name</label>
                  <input
                    type="text" className="form-control"
                    placeholder="Your full name"
                    value={name} onChange={e => setName(e.target.value)} required
                  />
                </div>
                <div className="checkout-field">
                  <label>Email Address</label>
                  <input
                    type="email" className="form-control"
                    placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} required
                  />
                  <span className="checkout-field__hint">
                    Your download link will be sent to this email
                  </span>
                </div>

                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                <button type="submit" className="checkout-submit" disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />
                      {total === 0 ? 'Processing…' : 'Redirecting to payment…'}</>
                  ) : total === 0 ? (
                    <><Download size={16} /> Get for Free</>
                  ) : (
                    <><Lock size={16} /> Pay ${total.toFixed(2)} via Uddokta Pay</>
                  )}
                </button>
              </form>

              {/* Trust badges */}
              <div className="checkout-trust">
                {[
                  { icon: <Shield size={16} />, text: 'SSL Encrypted' },
                  { icon: <Zap size={16} />,    text: 'Instant Delivery' },
                  { icon: <RefreshCw size={16} />, text: 'Secure Gateway' },
                ].map(t => (
                  <div key={t.text} className="checkout-trust__item">
                    {t.icon}<span>{t.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="checkout-summary-col">
            <div className="checkout-summary-card">
              <h3 className="checkout-summary-card__title">Order Summary</h3>
              <div className="checkout-summary-items">
                {items.map(item => (
                  <div key={item.id} className="checkout-summary-item">
                    <div className="checkout-summary-item__icon"><ShoppingBag size={20} /></div>
                    <div className="checkout-summary-item__info">
                      <p className="checkout-summary-item__name">{item.name}</p>
                      <p className="checkout-summary-item__desc">{item.description}</p>
                    </div>
                    <span className="checkout-summary-item__price">{item.priceLabel}</span>
                  </div>
                ))}
              </div>
              <div className="checkout-summary-divider" />
              <div className="checkout-summary-row"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="checkout-summary-row"><span>Tax</span><span className="text-success">$0.00</span></div>
              <div className="checkout-summary-divider" />
              <div className="checkout-summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
              <div className="checkout-summary-note">
                <span>🔒</span><span>Payment processed securely by Uddokta Pay</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

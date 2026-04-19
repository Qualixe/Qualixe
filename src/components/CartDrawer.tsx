'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Trash2, Lock } from 'lucide-react';
import './CartDrawer.css';

export default function CartDrawer() {
  const { items, removeItem, isOpen, closeCart, total } = useCart();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setError('');
    setLoading(true);

    // For now checkout the first item (single product flow)
    const item = items[0];

    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, productId: item.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.payment_url) {
        setError(data.error || 'Payment initiation failed.');
        return;
      }
      window.location.href = data.payment_url;
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? 'cart-overlay--open' : ''}`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}>
        {/* Header */}
        <div className="cart-drawer__header">
          <div className="cart-drawer__title">
            <ShoppingBag size={20} />
            <span>Your Cart</span>
            {items.length > 0 && (
              <span className="cart-drawer__count">{items.length}</span>
            )}
          </div>
          <button className="cart-drawer__close" onClick={closeCart} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <ShoppingBag size={48} strokeWidth={1} />
              <p>Your cart is empty</p>
              <button className="btn btn-outline-primary btn-sm" onClick={closeCart}>
                Browse Products
              </button>
            </div>
          ) : (
            <>
              {/* Items */}
              <ul className="cart-drawer__items">
                {items.map((item) => (
                  <li key={item.id} className="cart-drawer__item">
                    <div className="cart-item__icon">
                      <ShoppingBag size={22} />
                    </div>
                    <div className="cart-item__info">
                      <p className="cart-item__name">{item.name}</p>
                      <p className="cart-item__desc">{item.description}</p>
                      <span className="cart-item__price">{item.priceLabel}</span>
                    </div>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Total */}
              <div className="cart-drawer__total">
                <span>Total</span>
                <span className="cart-drawer__total-price">${total.toFixed(2)}</span>
              </div>

              {/* Checkout form */}
              <form onSubmit={handleCheckout} className="cart-drawer__form">
                <p className="cart-drawer__form-label">Enter your details to checkout</p>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                <button
                  type="submit"
                  className="cart-drawer__checkout-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                  ) : (
                    <><Lock size={15} className="me-2" />Pay ${total.toFixed(2)} Securely</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

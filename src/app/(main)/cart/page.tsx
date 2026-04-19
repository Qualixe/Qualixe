'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import './cart.css';

export default function CartPage() {
  const { items, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <ShoppingCart size={64} strokeWidth={1} className="cart-empty__icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link href="/shop" className="cart-empty__btn">
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="container">
        <div className="cart-page__header">
          <h1 className="cart-page__title">
            <ShoppingBag size={28} />
            Your Cart
          </h1>
          <Link href="/shop" className="cart-page__continue">
            ← Continue Shopping
          </Link>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item-row">
                <div className="cart-item-row__icon">
                  <ShoppingBag size={24} />
                </div>
                <div className="cart-item-row__info">
                  <h3 className="cart-item-row__name">{item.name}</h3>
                  <p className="cart-item-row__desc">{item.description}</p>
                  <span className="cart-item-row__tag">Digital Download · Instant Access</span>
                </div>
                <div className="cart-item-row__right">
                  <span className="cart-item-row__price">{item.priceLabel}</span>
                  <button
                    className="cart-item-row__remove"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <div className="cart-summary__card">
              <h2 className="cart-summary__title">Order Summary</h2>

              <div className="cart-summary__lines">
                {items.map((item) => (
                  <div key={item.id} className="cart-summary__line">
                    <span className="cart-summary__line-name">{item.name}</span>
                    <span>{item.priceLabel}</span>
                  </div>
                ))}
              </div>

              <div className="cart-summary__divider" />

              <div className="cart-summary__total">
                <span>Total</span>
                <span className="cart-summary__total-amount">${total.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="cart-summary__checkout">
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              <div className="cart-summary__trust">
                <span>🔒 Secure checkout via Uddokta Pay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

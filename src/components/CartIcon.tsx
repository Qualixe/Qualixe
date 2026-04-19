'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import './CartIcon.css';

export default function CartIcon() {
  const { items, openCart, drawerEnabled } = useCart();

  const badge = items.length > 0 && (
    <span className="cart-icon-badge">{items.length}</span>
  );

  if (!drawerEnabled) {
    return (
      <Link href="/cart" className="cart-icon-btn" aria-label="View cart">
        <ShoppingCart size={22} />
        {badge}
      </Link>
    );
  }

  return (
    <button className="cart-icon-btn" onClick={openCart} aria-label="Open cart">
      <ShoppingCart size={22} />
      {badge}
    </button>
  );
}

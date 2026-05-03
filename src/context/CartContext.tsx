'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  total: number;
  drawerEnabled: boolean;
  setDrawerEnabled: (v: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);
const CART_KEY = 'cart_items';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [drawerEnabled, setDrawerEnabledState] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // 1. Restore cart items from localStorage (fast, local)
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}

    // 2. Fetch drawer setting from Supabase via API (global, cross-device)
    fetch('/api/site-settings?key=cart_drawer_enabled')
      .then(r => r.json())
      .then(data => {
        // value is stored as a JSONB boolean: true / false
        if (typeof data.cart_drawer_enabled === 'boolean') {
          setDrawerEnabledState(data.cart_drawer_enabled);
        }
      })
      .catch(() => {
        // Network error — keep default true
      })
      .finally(() => {
        setHydrated(true);
      });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

  const addItem = (item: CartItem) => {
    setItems((prev) => prev.find((i) => i.id === item.id) ? prev : [...prev, item]);
    if (drawerEnabled) setIsOpen(true);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  // setDrawerEnabled is only called from the dashboard — it updates Supabase via the API
  const setDrawerEnabled = (v: boolean) => {
    setDrawerEnabledState(v);
    if (!v) setIsOpen(false);
  };

  const total = items.reduce((sum, i) => sum + i.price, 0);

  if (!hydrated) {
    return (
      <CartContext.Provider value={{
        items: [], addItem: () => {}, removeItem: () => {}, clearCart: () => {},
        isOpen: false, openCart: () => {}, closeCart: () => {},
        total: 0, drawerEnabled: true, setDrawerEnabled: () => {},
      }}>
        {children}
      </CartContext.Provider>
    );
  }

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, clearCart,
      isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
      total, drawerEnabled, setDrawerEnabled,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

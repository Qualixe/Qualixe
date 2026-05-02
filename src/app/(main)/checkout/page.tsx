'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, User, UserPlus, Mail } from 'lucide-react';
import { supabase } from '../../../../lib/supabaseClient';
import './checkout.css';

// ── Order summary sidebar ─────────────────────────────────
function OrderSummary() {
  const { items, total } = useCart();
  return (
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
      <div className="checkout-summary-note"><span>🔒</span><span>Secure checkout</span></div>
    </div>
  );
}

// ── Sign-in panel ─────────────────────────────────────────
function SignInPanel({ onSuccess }: { onSuccess: (email: string, name: string) => void }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const name = data.user?.user_metadata?.full_name || email.split('@')[0];
      onSuccess(email, name);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  }

  return (
    <div className="co-panel">
      <div className="co-panel__head">
        <div className="co-panel__icon co-panel__icon--blue"><User size={20} /></div>
        <div>
          <h3>Sign in</h3>
          <p>Use your existing account</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="co-panel__form">
        <div className="co-panel__field">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={email}
            onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="co-panel__field">
          <div className="co-panel__field-row">
            <label>Password</label>
            <Link href="/account/forgot-password" className="co-panel__link" tabIndex={-1}>
              Forgot?
            </Link>
          </div>
          <input type="password" placeholder="••••••••" value={password}
            onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p className="co-panel__error">{error}</p>}
        <button type="submit" className="co-panel__btn" disabled={loading}>
          {loading ? <span className="co-spinner" /> : 'Sign in & Continue'}
        </button>
      </form>
    </div>
  );
}

// ── Create account panel ──────────────────────────────────
function CreatePanel({ onSuccess }: { onSuccess: (email: string, name: string) => void }) {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;
      // Sign in immediately after signup (email confirm may be disabled)
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signInErr) {
        // Email confirmation required — proceed as guest with their email
        onSuccess(email, name);
        return;
      }
      onSuccess(email, name);
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
      setLoading(false);
    }
  }

  return (
    <div className="co-panel">
      <div className="co-panel__head">
        <div className="co-panel__icon co-panel__icon--green"><UserPlus size={20} /></div>
        <div>
          <h3>Create account</h3>
          <p>New here? Sign up in seconds</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="co-panel__form">
        <div className="co-panel__field">
          <label>Full name</label>
          <input type="text" placeholder="Your name" value={name}
            onChange={e => setName(e.target.value)} required />
        </div>
        <div className="co-panel__field">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={email}
            onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="co-panel__field">
          <label>Password</label>
          <input type="password" placeholder="Min 6 characters" value={password}
            onChange={e => setPassword(e.target.value)} required minLength={6} />
        </div>
        {error && <p className="co-panel__error">{error}</p>}
        <button type="submit" className="co-panel__btn co-panel__btn--green" disabled={loading}>
          {loading ? <span className="co-spinner" /> : 'Create & Continue'}
        </button>
      </form>
    </div>
  );
}

// ── Guest panel ───────────────────────────────────────────
function GuestPanel({ onSuccess }: { onSuccess: (email: string, name: string) => void }) {
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSuccess(email, name);
  }

  return (
    <div className="co-guest">
      <div className="co-guest__head">
        <Mail size={18} />
        <span>Continue as guest</span>
      </div>
      <form onSubmit={handleSubmit} className="co-guest__form">
        <input type="text" placeholder="Full name" value={name}
          onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email address" value={email}
          onChange={e => setEmail(e.target.value)} required />
        <button type="submit" className="co-guest__btn">
          Continue as Guest →
        </button>
      </form>
      <p className="co-guest__note">
        Your download link will be sent to this email. You can create an account after purchase.
      </p>
    </div>
  );
}

// ── Main checkout page ────────────────────────────────────
export default function CheckoutPage() {
  const { items } = useCart();
  const router    = useRouter();

  // Once user is identified (login / signup / guest), go to pay page
  function proceed(email: string, name: string) {
    const params = new URLSearchParams({ email, name });
    router.push(`/checkout/pay?${params.toString()}`);
  }

  // Check if already logged in → skip gate
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u    = data.session.user;
        const name = u.user_metadata?.full_name || u.email?.split('@')[0] || '';
        proceed(u.email!, name);
      }
    });
  }, []);

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
            <span className="checkout-step checkout-step--active">Account</span>
            <span className="checkout-step__sep">›</span>
            <span className="checkout-step">Payment</span>
            <span className="checkout-step__sep">›</span>
            <span className="checkout-step">Confirmation</span>
          </div>
        </div>

        <div className="checkout-layout">
          <div className="checkout-form-col">

            {/* Auth gate heading */}
            <div className="co-gate-heading">
              <h2>How would you like to continue?</h2>
              <p>Sign in or create an account to save your downloads, or continue as a guest.</p>
            </div>

            {/* Sign in + Create account side by side */}
            <div className="co-panels">
              <SignInPanel onSuccess={proceed} />
              <CreatePanel onSuccess={proceed} />
            </div>

            {/* Divider */}
            <div className="co-divider">
              <span>or</span>
            </div>

            {/* Guest */}
            <GuestPanel onSuccess={proceed} />

          </div>

          {/* Order summary */}
          <div className="checkout-summary-col">
            <OrderSummary />
          </div>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabaseClient';
import '../account.css';

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <main className="account-page">
        <div className="account-card account-card--center">
          <div className="account-success-icon">✉️</div>
          <h1 className="account-card__title">Check your email</h1>
          <p className="account-card__sub">
            We sent a password reset link to <strong>{email}</strong>.
          </p>
          <Link href="/account/login" className="account-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            Back to Sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="account-page">
      <div className="account-card">
        <div className="account-card__logo">
          <img src="/assets/img/logo.png" alt="Qualixe" />
        </div>
        <h1 className="account-card__title">Reset password</h1>
        <p className="account-card__sub">Enter your email and we'll send a reset link</p>

        <form onSubmit={handleSubmit} className="account-form">
          <div className="account-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              required autoFocus
            />
          </div>

          {error && <p className="account-error">{error}</p>}

          <button type="submit" className="account-btn" disabled={loading}>
            {loading ? <span className="account-spinner" /> : 'Send reset link'}
          </button>
        </form>

        <p className="account-footer">
          <Link href="/account/login">← Back to Sign in</Link>
        </p>
      </div>
    </main>
  );
}

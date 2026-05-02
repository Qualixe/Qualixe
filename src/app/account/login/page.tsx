'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabaseClient';
import '../account.css';

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get('redirect') || '/account/downloads';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  // Already logged in → redirect
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(redirectTo);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.replace(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  }

  return (
    <main className="account-page">
      <div className="account-card">
        <div className="account-card__logo">
          <img src="/assets/img/logo.png" alt="Qualixe" />
        </div>
        <h1 className="account-card__title">Sign in</h1>
        <p className="account-card__sub">Access your downloads and purchase history</p>

        <form onSubmit={handleSubmit} className="account-form">
          <div className="account-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              required autoFocus
            />
          </div>
          <div className="account-field">
            <div className="account-field__row">
              <label htmlFor="password">Password</label>
              <Link href="/account/forgot-password" className="account-field__link">
                Forgot password?
              </Link>
            </div>
            <input
              id="password" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="account-error">{error}</p>}

          <button type="submit" className="account-btn" disabled={loading}>
            {loading ? <span className="account-spinner" /> : 'Sign in'}
          </button>
        </form>

        <p className="account-footer">
          Don't have an account?{' '}
          <Link href={`/account/signup${redirectTo !== '/account/downloads' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}>
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return <Suspense><LoginContent /></Suspense>;
}

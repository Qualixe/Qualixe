'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabaseClient';
import '../account.css';

function SignupContent() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get('redirect') || '/account/downloads';

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [done, setDone]         = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(redirectTo);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;
      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="account-page">
        <div className="account-card account-card--center">
          <div className="account-success-icon">✉️</div>
          <h1 className="account-card__title">Check your email</h1>
          <p className="account-card__sub">
            We sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account, then sign in.
          </p>
          <Link href="/account/login" className="account-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            Go to Sign in
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
        <h1 className="account-card__title">Create account</h1>
        <p className="account-card__sub">Sign up to track your downloads</p>

        <form onSubmit={handleSubmit} className="account-form">
          <div className="account-field">
            <label htmlFor="name">Full name</label>
            <input
              id="name" type="text" placeholder="Your name"
              value={name} onChange={e => setName(e.target.value)}
              required autoFocus
            />
          </div>
          <div className="account-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="account-field">
            <label htmlFor="password">Password</label>
            <input
              id="password" type="password" placeholder="Min 6 characters"
              value={password} onChange={e => setPassword(e.target.value)}
              required minLength={6}
            />
          </div>

          {error && <p className="account-error">{error}</p>}

          <button type="submit" className="account-btn" disabled={loading}>
            {loading ? <span className="account-spinner" /> : 'Create account'}
          </button>
        </form>

        <p className="account-footer">
          Already have an account?{' '}
          <Link href="/account/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return <Suspense><SignupContent /></Suspense>;
}

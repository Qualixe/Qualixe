'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authAPI } from '../../../lib/auth';

type Notice = { type: 'error' | 'success'; text: string } | null;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [notice, setNotice] = useState<Notice>(null);

  // Already logged in → go to the dashboard
  useEffect(() => {
    authAPI.getSession().then((session) => {
      if (session) router.push('/dashboard');
    }).catch(() => {});
  }, [router]);

  const switchMode = (m: 'login' | 'reset') => {
    setMode(m);
    setNotice(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setNotice(null);
    setLoading(true);

    try {
      const data = await authAPI.signIn({ email, password });
      if (!data?.session) {
        setNotice({ type: 'error', text: 'Login failed — no session was created. Please try again.' });
        setLoading(false);
        return;
      }

      // Only admins may enter the dashboard
      const admin = await authAPI.isAdmin();
      if (!admin) {
        await authAPI.signOut();
        setNotice({ type: 'error', text: 'Access denied. This account does not have admin privileges.' });
        setLoading(false);
        return;
      }

      setNotice({ type: 'success', text: 'Signed in — taking you to the dashboard…' });
      router.push('/dashboard');
    } catch (error) {
      const msg = error instanceof Error ? error.message : '';
      setNotice({ type: 'error', text: msg || 'Login failed. Please check your email and password.' });
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setNotice({ type: 'error', text: 'Please enter your email address.' });
      return;
    }
    setNotice(null);
    setLoading(true);
    try {
      await authAPI.resetPassword(email);
      setNotice({ type: 'success', text: 'Password reset email sent — check your inbox.' });
    } catch (error) {
      const msg = error instanceof Error ? error.message : '';
      setNotice({ type: 'error', text: msg || 'Failed to send the reset email.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="lg-page">
      {/* ── Brand panel (home-page style) ─────────────── */}
      <section className="lg-brand" aria-hidden="false">
        <div className="lg-brand__bg" aria-hidden="true">
          <div className="lg-grid" />
          <div className="lg-aurora lg-aurora--1" />
          <div className="lg-aurora lg-aurora--2" />
          <div className="lg-globe">
            <span className="lg-globe__ring lg-globe__ring--1" />
            <span className="lg-globe__ring lg-globe__ring--2" />
          </div>
        </div>

        <Link href="/" className="lg-logo" aria-label="Qualixe home">
          <Image src="/assets/img/logo.png" alt="Qualixe" width={132} height={44} priority style={{ height: 'auto' }} />
        </Link>

        <div className="lg-brand__copy">
          <span className="lg-pill"><span className="lg-pill__dot" aria-hidden="true" /> Qualixe Dashboard</span>
          <h1 className="lg-brand__title">
            Manage everything <span className="lg-gradient">in one place.</span>
          </h1>
          <p className="lg-brand__text">
            Portfolio, blog, services, products, orders and analytics — all from your Qualixe admin.
          </p>
          <ul className="lg-chips" aria-label="What you can manage">
            <li><i className="bi bi-briefcase" aria-hidden="true" /> Portfolio</li>
            <li><i className="bi bi-journal-text" aria-hidden="true" /> Blog</li>
            <li><i className="bi bi-bag" aria-hidden="true" /> Orders</li>
            <li><i className="bi bi-graph-up-arrow" aria-hidden="true" /> Analytics</li>
          </ul>
        </div>

        <p className="lg-brand__foot">© {new Date().getFullYear()} Qualixe</p>
      </section>

      {/* ── Form panel ────────────────────────────────── */}
      <section className="lg-form-side">
        <div className="lg-card">
          <Link href="/" className="lg-back">
            <i className="bi bi-arrow-left" aria-hidden="true" /> Back to website
          </Link>

          <div className="lg-head">
            <span className="lg-head__icon" aria-hidden="true">
              <i className={`bi ${mode === 'login' ? 'bi-shield-lock' : 'bi-key'}`} />
            </span>
            <h2 className="lg-head__title">{mode === 'login' ? 'Welcome back' : 'Reset your password'}</h2>
            <p className="lg-head__sub">
              {mode === 'login'
                ? 'Sign in to your Qualixe admin dashboard.'
                : 'Enter your email and we’ll send you a link to set a new password.'}
            </p>
          </div>

          {notice && (
            <div className={`lg-notice lg-notice--${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
              <i className={`bi ${notice.type === 'error' ? 'bi-exclamation-circle' : 'bi-check-circle'}`} aria-hidden="true" />
              <span>{notice.text}</span>
            </div>
          )}

          <form className="lg-form" onSubmit={mode === 'login' ? handleSubmit : handleReset}>
            <div className="lg-field">
              <label htmlFor="lg-email" className="lg-label">Email address</label>
              <div className="lg-control">
                <i className="bi bi-envelope lg-icon" aria-hidden="true" />
                <input
                  id="lg-email"
                  type="email"
                  className="lg-input"
                  placeholder="you@qualixe.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            {mode === 'login' && (
              <div className="lg-field">
                <div className="lg-label-row">
                  <label htmlFor="lg-password" className="lg-label">Password</label>
                  <button type="button" className="lg-link" onClick={() => switchMode('reset')}>
                    Forgot password?
                  </button>
                </div>
                <div className="lg-control">
                  <i className="bi bi-lock lg-icon" aria-hidden="true" />
                  <input
                    id="lg-password"
                    type={showPassword ? 'text' : 'password'}
                    className="lg-input lg-input--pw"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="lg-eye"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            <button type="submit" className="lg-btn" disabled={loading}>
              {loading ? (
                <><span className="lg-spinner" aria-hidden="true" /> {mode === 'login' ? 'Signing in…' : 'Sending…'}</>
              ) : (
                <>
                  {mode === 'login' ? 'Sign in' : 'Send reset link'}
                  <span className="lg-btn__icon" aria-hidden="true"><i className="bi bi-arrow-right" /></span>
                </>
              )}
            </button>
          </form>

          <div className="lg-foot">
            {mode === 'login' ? (
              <p>Don&apos;t have an account? <Link href="/signup">Sign up</Link></p>
            ) : (
              <button type="button" className="lg-link" onClick={() => switchMode('login')}>
                <i className="bi bi-arrow-left" aria-hidden="true" /> Back to sign in
              </button>
            )}
          </div>

          <p className="lg-secure">
            <i className="bi bi-shield-check" aria-hidden="true" /> Secure, encrypted connection
          </p>
        </div>
      </section>
    </main>
  );
}

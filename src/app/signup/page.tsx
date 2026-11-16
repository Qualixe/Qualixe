'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authAPI } from '../../../lib/auth';

type Notice = { type: 'error' | 'success'; text: string } | null;

// Dashboard sign-up is restricted to these addresses (unchanged from before)
const ADMIN_EMAILS = ['qualixe.info@gmail.com', 'qualixe.hridoy@gmail.com'];

/** 0–4 rough strength score for the meter */
function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}
const STRENGTH = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const strength = passwordStrength(form.password);
  const mismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (form.password.length < 6) {
      setNotice({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (form.password !== form.confirmPassword) {
      setNotice({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    const email = form.email.trim().toLowerCase();
    if (!ADMIN_EMAILS.includes(email)) {
      setNotice({ type: 'error', text: 'Sign-up is restricted. Please contact the administrator.' });
      return;
    }

    setLoading(true);
    try {
      await authAPI.signUp({ email, password: form.password, full_name: form.full_name.trim() });
      setNotice({ type: 'success', text: 'Account created! Check your email to verify it — redirecting to sign in…' });
      setTimeout(() => router.push('/login'), 2500);
    } catch (error) {
      const msg = error instanceof Error ? error.message : '';
      setNotice({ type: 'error', text: msg || 'Sign-up failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="lg-page">
      {/* ── Brand panel (home-page style) ─────────────── */}
      <section className="lg-brand">
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
          <span className="lg-pill"><span className="lg-pill__dot" aria-hidden="true" /> Team access</span>
          <h1 className="lg-brand__title">
            Join the Qualixe <span className="lg-gradient">dashboard.</span>
          </h1>
          <p className="lg-brand__text">
            Create your admin account to manage the website, content, products and orders.
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
            <span className="lg-head__icon" aria-hidden="true"><i className="bi bi-person-plus" /></span>
            <h2 className="lg-head__title">Create your account</h2>
            <p className="lg-head__sub">Admin access is limited to approved team email addresses.</p>
          </div>

          {notice && (
            <div className={`lg-notice lg-notice--${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
              <i className={`bi ${notice.type === 'error' ? 'bi-exclamation-circle' : 'bi-check-circle'}`} aria-hidden="true" />
              <span>{notice.text}</span>
            </div>
          )}

          <form className="lg-form" onSubmit={handleSubmit}>
            <div className="lg-field">
              <label htmlFor="su-name" className="lg-label">Full name</label>
              <div className="lg-control">
                <i className="bi bi-person lg-icon" aria-hidden="true" />
                <input id="su-name" type="text" name="full_name" className="lg-input" placeholder="Your full name"
                  autoComplete="name" value={form.full_name} onChange={handleChange} required autoFocus />
              </div>
            </div>

            <div className="lg-field">
              <label htmlFor="su-email" className="lg-label">Email address</label>
              <div className="lg-control">
                <i className="bi bi-envelope lg-icon" aria-hidden="true" />
                <input id="su-email" type="email" name="email" className="lg-input" placeholder="you@qualixe.com"
                  autoComplete="email" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="lg-field">
              <label htmlFor="su-password" className="lg-label">Password</label>
              <div className="lg-control">
                <i className="bi bi-lock lg-icon" aria-hidden="true" />
                <input id="su-password" type={showPassword ? 'text' : 'password'} name="password"
                  className="lg-input lg-input--pw" placeholder="At least 6 characters" autoComplete="new-password"
                  value={form.password} onChange={handleChange} required minLength={6} aria-describedby="su-strength" />
                <button type="button" className="lg-eye" onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
                </button>
              </div>
              {form.password && (
                <div className="lg-strength" id="su-strength" aria-live="polite">
                  <div className={`lg-strength__bar lg-strength__bar--${strength}`} aria-hidden="true">
                    <span /><span /><span /><span />
                  </div>
                  <span className="lg-strength__label">{STRENGTH[strength]}</span>
                </div>
              )}
            </div>

            <div className="lg-field">
              <label htmlFor="su-confirm" className="lg-label">Confirm password</label>
              <div className={`lg-control${mismatch ? ' has-error' : ''}`}>
                <i className="bi bi-lock-fill lg-icon" aria-hidden="true" />
                <input id="su-confirm" type={showPassword ? 'text' : 'password'} name="confirmPassword"
                  className="lg-input" placeholder="Repeat your password" autoComplete="new-password"
                  value={form.confirmPassword} onChange={handleChange} required minLength={6}
                  aria-invalid={mismatch || undefined} aria-describedby={mismatch ? 'su-mismatch' : undefined} />
                {form.confirmPassword && !mismatch && (
                  <i className="bi bi-check-circle-fill lg-match" aria-hidden="true" />
                )}
              </div>
              {mismatch && (
                <p className="lg-field-error" id="su-mismatch">
                  <i className="bi bi-exclamation-circle" aria-hidden="true" /> Passwords don&apos;t match
                </p>
              )}
            </div>

            <button type="submit" className="lg-btn" disabled={loading}>
              {loading ? (
                <><span className="lg-spinner" aria-hidden="true" /> Creating account…</>
              ) : (
                <>Create account <span className="lg-btn__icon" aria-hidden="true"><i className="bi bi-arrow-right" /></span></>
              )}
            </button>
          </form>

          <div className="lg-foot">
            <p>Already have an account? <Link href="/login">Sign in</Link></p>
          </div>

          <p className="lg-secure">
            <i className="bi bi-shield-check" aria-hidden="true" /> Secure, encrypted connection
          </p>
        </div>
      </section>
    </main>
  );
}

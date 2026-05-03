'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabaseClient';
import '../account.css';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.replace('/account/login?reset=1');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
      setLoading(false);
    }
  }

  return (
    <main className="account-page">
      <div className="account-card">
        <div className="account-card__logo">
          <img src="/assets/img/logo.png" alt="Qualixe" />
        </div>
        <h1 className="account-card__title">New password</h1>
        <p className="account-card__sub">Choose a new password for your account</p>

        <form onSubmit={handleSubmit} className="account-form">
          <div className="account-field">
            <label htmlFor="password">New password</label>
            <input
              id="password" type="password" placeholder="Min 6 characters"
              value={password} onChange={e => setPassword(e.target.value)}
              required minLength={6} autoFocus
            />
          </div>
          <div className="account-field">
            <label htmlFor="confirm">Confirm password</label>
            <input
              id="confirm" type="password" placeholder="Repeat password"
              value={confirm} onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>

          {error && <p className="account-error">{error}</p>}

          <button type="submit" className="account-btn" disabled={loading}>
            {loading ? <span className="account-spinner" /> : 'Update password'}
          </button>
        </form>
      </div>
    </main>
  );
}

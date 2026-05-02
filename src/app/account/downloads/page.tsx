'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabaseClient';
import '../account.css';

interface DownloadToken {
  token: string;
  download_count: number;
  download_limit: number;
  expires_at: string;
}

interface Order {
  id: string;
  payment_id: string;
  product_id: string;
  product_name: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  token: DownloadToken | null;
}

export default function DownloadsPage() {
  const router = useRouter();
  const [user, setUser]     = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace('/account/login?redirect=/account/downloads');
      return;
    }
    setUser(session.user);
    await fetchOrders(session.user.email!);
    setLoading(false);
  }

  async function fetchOrders(email: string) {
    try {
      const res = await fetch(`/api/my-orders?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setOrders(data.orders ?? []);
    } catch {
      setOrders([]);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/account/login');
  }

  function isExpired(t: DownloadToken)    { return new Date(t.expires_at) < new Date(); }
  function isLimitReached(t: DownloadToken) { return t.download_count >= t.download_limit; }
  function canDownload(t: DownloadToken | null) {
    return t ? !isExpired(t) && !isLimitReached(t) : false;
  }
  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  const name     = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = name.slice(0, 2).toUpperCase();
  const activeCount = orders.filter(o => canDownload(o.token)).length;

  if (loading) {
    return (
      <main className="account-page account-page--wide">
        <div className="downloads-skeleton">
          {/* Header skeleton */}
          <div className="downloads-skeleton__header" />
          {/* Cards */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="downloads-skeleton__card" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="account-page account-page--wide">

      {/* ── Profile header ── */}
      <div className="downloads-header">
        <div className="downloads-header__left">
          <div className="downloads-header__avatar">{initials}</div>
          <div>
            <h1 className="downloads-header__name">{name}</h1>
            <p className="downloads-header__email">{user?.email}</p>
          </div>
        </div>
        <div className="downloads-header__stats">
          <div className="downloads-stat">
            <strong>{orders.length}</strong>
            <span>Total orders</span>
          </div>
          <div className="downloads-stat">
            <strong>{activeCount}</strong>
            <span>Active downloads</span>
          </div>
        </div>
        <button className="downloads-signout" onClick={handleSignOut}>
          <i className="bi bi-box-arrow-right" /> Sign out
        </button>
      </div>

      {/* ── Orders ── */}
      <div className="downloads-section">
        <h2 className="downloads-section__title">
          <i className="bi bi-bag-check" /> My Downloads
        </h2>

        {orders.length === 0 ? (
          <div className="downloads-empty">
            <i className="bi bi-bag-x" />
            <h3>No purchases yet</h3>
            <p>Templates you download or purchase will appear here.</p>
            <Link href="/shop" className="account-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Browse Templates
            </Link>
          </div>
        ) : (
          <div className="downloads-list">
            {orders.map(order => {
              const free        = Number(order.amount) === 0;
              const t           = order.token;
              const downloadable = canDownload(t);
              const expired     = t ? isExpired(t) : false;
              const limitHit    = t ? isLimitReached(t) : false;

              return (
                <div key={order.id} className="download-card">
                  <div className="download-card__icon">
                    <i className="bi bi-file-zip" />
                  </div>

                  <div className="download-card__info">
                    <p className="download-card__name">{order.product_name}</p>
                    <div className="download-card__meta">
                      <span><i className="bi bi-calendar3" /> {formatDate(order.created_at)}</span>
                      <span><i className="bi bi-receipt" /> #{order.payment_id.slice(-8).toUpperCase()}</span>
                      {t && (
                        <span>
                          <i className="bi bi-download" />
                          {t.download_count}/{t.download_limit} downloads used
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={`download-card__price ${free ? 'download-card__price--free' : ''}`}>
                    {free ? 'Free' : `$${Number(order.amount).toFixed(2)}`}
                  </div>

                  <div className="download-card__action">
                    {downloadable ? (
                      <a
                        href={`/api/download?token=${t!.token}`}
                        className="download-card__btn"
                        aria-label={`Download ${order.product_name}`}
                      >
                        <i className="bi bi-download" /> Download
                      </a>
                    ) : expired ? (
                      <span className="download-card__btn download-card__btn--disabled">
                        <i className="bi bi-clock" /> Expired
                      </span>
                    ) : limitHit ? (
                      <span className="download-card__btn download-card__btn--disabled">
                        <i className="bi bi-x-circle" /> Limit reached
                      </span>
                    ) : (
                      <span className="download-card__btn download-card__btn--disabled">
                        <i className="bi bi-hourglass" /> Pending
                      </span>
                    )}
                    {(expired || limitHit) && (
                      <a
                        href="mailto:support@qualixe.com"
                        className="download-card__support"
                      >
                        Contact support
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="downloads-back">
        <Link href="/shop">← Back to Shop</Link>
      </div>
    </main>
  );
}

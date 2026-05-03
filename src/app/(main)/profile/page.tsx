'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PageBanner from '@/components/PageBanner';
import './profile.css';

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

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [looked, setLooked] = useState(false);

  // Pre-fill email from URL param (e.g. from success page)
  useEffect(() => {
    const e = searchParams.get('email');
    if (e) {
      setInputEmail(e);
      setEmail(e);
      fetchOrders(e);
    }
  }, []);

  async function fetchOrders(emailToFetch: string) {
    setLoading(true);
    setError('');
    setLooked(true);
    try {
      const res = await fetch(`/api/my-orders?email=${encodeURIComponent(emailToFetch.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
      setOrders(data.orders ?? []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!inputEmail.trim()) return;
    setEmail(inputEmail.trim());
    fetchOrders(inputEmail.trim());
    // Update URL without reload
    router.replace(`/profile?email=${encodeURIComponent(inputEmail.trim())}`);
  }

  function handleReset() {
    setEmail('');
    setInputEmail('');
    setOrders([]);
    setLooked(false);
    setError('');
    router.replace('/profile');
  }

  function isExpired(token: DownloadToken) {
    return new Date(token.expires_at) < new Date();
  }

  function isLimitReached(token: DownloadToken) {
    return token.download_count >= token.download_limit;
  }

  function canDownload(token: DownloadToken | null) {
    if (!token) return false;
    return !isExpired(token) && !isLimitReached(token);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  }

  const initials = email
    ? email.split('@')[0].slice(0, 2).toUpperCase()
    : '?';

  return (
    <main className="profile-page">
      <div className="container">

        {/* ── Email lookup ── */}
        {!email && (
          <div className="profile-lookup">
            <div className="profile-lookup__icon">
              <i className="bi bi-person-circle" />
            </div>
            <h2>View Your Purchases</h2>
            <p>
              Enter the email address you used at checkout to see your orders and download your templates.
            </p>
            <form className="profile-lookup__form" onSubmit={handleLookup}>
              <input
                type="email"
                placeholder="you@example.com"
                value={inputEmail}
                onChange={e => setInputEmail(e.target.value)}
                required
                autoFocus
              />
              <button type="submit" disabled={loading}>
                {loading
                  ? <span className="spinner-border spinner-border-sm" />
                  : <><i className="bi bi-search me-1" />Look up</>}
              </button>
            </form>
          </div>
        )}

        {/* ── Profile view ── */}
        {email && (
          <>
            {/* Header */}
            <div className="profile-header">
              <div className="profile-header__avatar">{initials}</div>
              <div className="profile-header__info">
                <h2>{email}</h2>
                <p>Purchase history</p>
              </div>
              <div className="profile-header__stats">
                <div className="profile-header__stat">
                  <strong>{orders.length}</strong>
                  <span>Orders</span>
                </div>
                <div className="profile-header__stat">
                  <strong>
                    {orders.filter(o => o.token && canDownload(o.token)).length}
                  </strong>
                  <span>Active</span>
                </div>
              </div>
            </div>

            {/* Orders */}
            {loading ? (
              <div className="text-center py-5 text-muted">
                <span className="spinner-border spinner-border-sm me-2" />
                Loading your orders…
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : orders.length === 0 ? (
              <div className="profile-empty">
                <i className="bi bi-bag-x" />
                <h3>No orders found</h3>
                <p>
                  We couldn't find any completed orders for <strong>{email}</strong>.
                  Make sure you're using the same email you entered at checkout.
                </p>
                <Link href="/shop" className="btn btn-primary btn-sm px-4">
                  Browse Templates
                </Link>
              </div>
            ) : (
              <>
                <h3 className="profile-section-title">
                  <i className="bi bi-bag-check" /> Your Orders
                </h3>
                <div className="profile-orders">
                  {orders.map(order => {
                    const free = Number(order.amount) === 0;
                    const token = order.token;
                    const downloadable = canDownload(token);
                    const expired = token ? isExpired(token) : false;
                    const limitHit = token ? isLimitReached(token) : false;

                    return (
                      <div key={order.id} className="order-card">
                        <div className="order-card__icon">
                          <i className="bi bi-file-zip" />
                        </div>

                        <div className="order-card__info">
                          <p className="order-card__name">{order.product_name}</p>
                          <div className="order-card__meta">
                            <span><i className="bi bi-calendar3" />{formatDate(order.created_at)}</span>
                            <span><i className="bi bi-receipt" />#{order.payment_id.slice(-8).toUpperCase()}</span>
                            {token && (
                              <span>
                                <i className="bi bi-download" />
                                {token.download_count}/{token.download_limit} downloads used
                              </span>
                            )}
                          </div>
                        </div>

                        <div className={`order-card__amount ${free ? 'order-card__amount--free' : ''}`}>
                          {free ? 'Free' : `$${Number(order.amount).toFixed(2)}`}
                        </div>

                        <div className="order-card__actions">
                          {downloadable ? (
                            <a
                              href={`/api/download?token=${token!.token}`}
                              className="order-card__download"
                              aria-label={`Download ${order.product_name}`}
                            >
                              <i className="bi bi-download" /> Download
                            </a>
                          ) : expired ? (
                            <span className="order-card__download order-card__download--expired">
                              <i className="bi bi-clock" /> Expired
                            </span>
                          ) : limitHit ? (
                            <span className="order-card__download order-card__download--expired">
                              <i className="bi bi-x-circle" /> Limit reached
                            </span>
                          ) : (
                            <span className="order-card__download order-card__download--expired">
                              <i className="bi bi-hourglass" /> Pending
                            </span>
                          )}
                          {(expired || limitHit) && (
                            <div className="order-card__limit">
                              <a href="mailto:support@qualixe.com" className="text-primary" style={{ fontSize: 12 }}>
                                Contact support
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Change email */}
            <div className="text-center mt-4">
              <button className="profile-change-email" onClick={handleReset}>
                <i className="bi bi-arrow-left me-1" />Look up a different email
              </button>
            </div>
          </>
        )}

      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <>
      <PageBanner heading="My Profile" />
      <Suspense>
        <ProfileContent />
      </Suspense>
    </>
  );
}

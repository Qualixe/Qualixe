'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const params = useSearchParams();

  // Free flow: ?token=  |  Paid flow: ?order_id= (from Lemon Squeezy redirect)
  const directToken = params.get('token');
  const orderId     = params.get('order_id');

  const [token,    setToken]    = useState<string | null>(directToken);
  const [checking, setChecking] = useState(!directToken && !!orderId);
  const [attempts, setAttempts] = useState(0);
  const [timedOut, setTimedOut] = useState(false);

  const MAX_ATTEMPTS = 20;   // 20 × 3s = 60 seconds of polling
  const INTERVAL_MS  = 3000;

  useEffect(() => {
    if (directToken || !orderId) return;

    let count = 0;

    const poll = setInterval(async () => {
      count++;
      setAttempts(count);

      try {
        // Phase 1: lightweight DB check — did the webhook already create the token?
        const res = await fetch(`/api/get-download-token?order_id=${encodeURIComponent(orderId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.token) {
            setToken(data.token);
            setChecking(false);
            clearInterval(poll);
            return;
          }
        }

        // Phase 2: after 10 polls (~30s), call verify-payment to hit LS API directly
        if (count === 10) {
          const vRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId }),
          });
          if (vRes.ok) {
            const vData = await vRes.json();
            if (vData.token) {
              setToken(vData.token);
              setChecking(false);
              clearInterval(poll);
              return;
            }
          }
        }
      } catch {
        // network hiccup — keep polling
      }

      if (count >= MAX_ATTEMPTS) {
        clearInterval(poll);
        setChecking(false);
        setTimedOut(true);
      }
    }, INTERVAL_MS);

    return () => clearInterval(poll);
  }, [directToken, orderId]);

  const isFree   = !!directToken && !orderId;
  const elapsed  = Math.round((attempts * INTERVAL_MS) / 1000);
  const progress = Math.min((attempts / MAX_ATTEMPTS) * 100, 95);

  return (
    <main className="container py-5 text-center" style={{ maxWidth: 540 }}>
      <div className="card shadow-sm border-0 p-4 p-md-5">

        {/* Icon */}
        <div className="mb-3">
          {timedOut && !token
            ? <i className="bi bi-clock-history text-warning" style={{ fontSize: 56 }} />
            : <i className="bi bi-check-circle-fill text-success" style={{ fontSize: 56 }} />}
        </div>

        {/* Heading */}
        <h1 className="h3 fw-bold mb-2">
          {isFree     ? 'Your download is ready!'
          : token      ? 'Payment Confirmed!'
          : timedOut   ? 'Still processing…'
          :              'Payment Received!'}
        </h1>

        <p className="text-muted mb-4">
          {isFree
            ? 'Click below to download your free template.'
            : token
            ? 'Your download link is ready below.'
            : timedOut
            ? 'This is taking longer than usual. Check your email from Lemon Squeezy — it contains your receipt and download link. You can also click below to try again.'
            : "We're confirming your payment — this usually takes a few seconds."}
        </p>

        {/* Polling progress */}
        {checking && !token && (
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-center gap-2 text-muted mb-2">
              <span className="spinner-border spinner-border-sm" />
              <span>Verifying payment{elapsed > 0 ? ` (${elapsed}s)` : ''}…</span>
            </div>
            <div className="progress" style={{ height: 4, borderRadius: 4 }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                style={{ width: `${progress}%`, transition: 'width 3s linear' }}
              />
            </div>
            <small className="text-muted d-block mt-2">
              Please keep this page open. Do not refresh.
            </small>
          </div>
        )}

        {/* Download button */}
        {token && (
          <a
            href={`/api/download?token=${token}`}
            className="btn btn-success btn-lg w-100 fw-semibold mb-3"
          >
            <i className="bi bi-download me-2" />
            Download Now
          </a>
        )}

        {token && (
          <Link href="/account/downloads" className="btn btn-outline-primary w-100 fw-semibold mb-2">
            <i className="bi bi-person-circle me-2" />
            View My Downloads
          </Link>
        )}

        {/* Timeout */}
        {timedOut && !token && (
          <div className="mb-3">
            <div className="alert alert-warning text-start" role="alert">
              <strong>Check your email</strong>
              <p className="mb-2 mt-1 small">
                Lemon Squeezy sends a purchase receipt with a download link directly to your inbox.
                If you don't see it, check your spam folder.
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-warning btn-sm fw-semibold"
                  onClick={() => window.location.reload()}
                >
                  <i className="bi bi-arrow-clockwise me-1" />
                  Check Again
                </button>
                {orderId && (
                  <a
                    href={`mailto:support@qualixe.com?subject=Download%20not%20received&body=Order%20ID%3A%20${encodeURIComponent(orderId)}`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    <i className="bi bi-envelope me-1" />
                    Contact Support
                  </a>
                )}
              </div>
            </div>
            {orderId && (
              <p className="text-muted small mt-2">
                Your Order ID: <code className="user-select-all">{orderId}</code>
              </p>
            )}
          </div>
        )}

        <Link href="/" className="btn btn-link mt-1 text-muted">
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}

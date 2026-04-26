'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const params = useSearchParams();

  const directToken = params.get('token');
  const invoiceId = params.get('invoice_id');

  const [token, setToken] = useState<string | null>(directToken);
  const [checking, setChecking] = useState(!directToken && !!invoiceId);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');

  // How long we poll — 30 attempts × 3s = 90 seconds total
  const MAX_ATTEMPTS = 30;
  const INTERVAL_MS = 3000;

  useEffect(() => {
    if (directToken || !invoiceId) return;

    let count = 0;
    const poll = setInterval(async () => {
      count++;
      setAttempts(count);
      try {
        const res = await fetch(`/api/get-download-token?invoice_id=${invoiceId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.token) {
            setToken(data.token);
            setChecking(false);
            clearInterval(poll);
            return;
          }
        }
      } catch {
        // keep polling
      }

      if (count >= MAX_ATTEMPTS) {
        clearInterval(poll);
        setChecking(false);
        setError('timeout');
      }
    }, INTERVAL_MS);

    return () => clearInterval(poll);
  }, [directToken, invoiceId]);

  // Manual retry — re-mount the polling
  const [retryKey, setRetryKey] = useState(0);
  function handleRetry() {
    setError('');
    setChecking(true);
    setAttempts(0);
    setRetryKey(k => k + 1);
  }

  const isFree = !!directToken && !invoiceId;
  const elapsed = Math.round((attempts * INTERVAL_MS) / 1000);

  return (
    <main className="container py-5 text-center" style={{ maxWidth: 540 }}>
      <div className="card shadow-sm border-0 p-4 p-md-5">

        {/* Icon */}
        <div className="mb-3">
          {error ? (
            <i className="bi bi-clock-history text-warning" style={{ fontSize: 56 }} />
          ) : token ? (
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: 56 }} />
          ) : (
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: 56 }} />
          )}
        </div>

        {/* Heading */}
        <h1 className="h3 fw-bold mb-2">
          {isFree
            ? 'Your download is ready!'
            : token
            ? 'Payment Confirmed!'
            : 'Payment Received!'}
        </h1>

        <p className="text-muted mb-4">
          {isFree
            ? 'Click below to download your free template.'
            : token
            ? 'Your download link is ready below.'
            : 'Your payment was received. We\'re confirming it now — this usually takes under a minute.'}
        </p>

        {/* Polling spinner */}
        {checking && !token && (
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-center gap-2 text-muted mb-2">
              <span className="spinner-border spinner-border-sm" />
              <span>Verifying payment{elapsed > 0 ? ` (${elapsed}s)` : ''}...</span>
            </div>
            <div className="progress" style={{ height: 4, borderRadius: 4 }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                style={{ width: `${Math.min((attempts / MAX_ATTEMPTS) * 100, 95)}%`, transition: 'width 3s linear' }}
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

        {/* Timeout error */}
        {error === 'timeout' && !token && (
          <div className="mb-3">
            <div className="alert alert-warning text-start" role="alert">
              <strong>Taking longer than expected.</strong>
              <p className="mb-2 mt-1 small">
                Your payment was received but verification is delayed. This can happen with SMS-based payments.
                Try checking again in a moment.
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-warning btn-sm fw-semibold" onClick={handleRetry}>
                  <i className="bi bi-arrow-clockwise me-1" />
                  Check Again
                </button>
                {invoiceId && (
                  <a
                    href={`mailto:support@qualixe.com?subject=Download%20not%20received&body=Invoice%20ID%3A%20${invoiceId}`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    <i className="bi bi-envelope me-1" />
                    Contact Support
                  </a>
                )}
              </div>
            </div>
            {invoiceId && (
              <p className="text-muted small mt-2">
                Your Invoice ID: <code className="user-select-all">{invoiceId}</code>
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

// Retry wrapper — remounts polling when retryKey changes
function RetryableContent() {
  const [key, setKey] = useState(0);
  return <SuccessContent key={key} />;
}

export default function SuccessPage() {
  return (
    <Suspense>
      <RetryableContent />
    </Suspense>
  );
}

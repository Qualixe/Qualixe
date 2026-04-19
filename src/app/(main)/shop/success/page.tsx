'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const params = useSearchParams();

  // Free flow passes ?token= directly
  // Paid flow (Uddokta) passes ?invoice_id= on redirect
  const directToken = params.get('token');
  const invoiceId = params.get('invoice_id');

  const [token, setToken] = useState<string | null>(directToken);
  const [checking, setChecking] = useState(!directToken && !!invoiceId);
  const [error, setError] = useState('');

  useEffect(() => {
    // If we already have a direct token (free download), nothing to poll
    if (directToken || !invoiceId) return;

    let attempts = 0;
    const MAX_ATTEMPTS = 10;
    const INTERVAL_MS = 2000;

    const poll = setInterval(async () => {
      attempts++;
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

      if (attempts >= MAX_ATTEMPTS) {
        clearInterval(poll);
        setChecking(false);
        setError('Download link not ready yet. Please contact support.');
      }
    }, INTERVAL_MS);

    return () => clearInterval(poll);
  }, [directToken, invoiceId]);

  const isFree = !!directToken && !invoiceId;

  return (
    <main className="container py-5 text-center" style={{ maxWidth: 520 }}>
      <div className="card shadow-sm border-0 p-4">
        <div className="mb-3">
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: 56 }} />
        </div>
        <h1 className="h3 fw-bold mb-2">
          {isFree ? 'Your download is ready!' : 'Payment Successful!'}
        </h1>
        <p className="text-muted mb-4">
          {isFree
            ? 'Click below to download your free template.'
            : 'Thank you for your purchase. Your download is ready below.'}
        </p>

        {checking && (
          <div className="d-flex align-items-center justify-content-center gap-2 text-muted mb-3">
            <span className="spinner-border spinner-border-sm" />
            Preparing your download link...
          </div>
        )}

        {token && (
          <a
            href={`/api/download?token=${token}`}
            className="btn btn-success btn-lg w-100 fw-semibold"
          >
            <i className="bi bi-download me-2" />
            Download Now
          </a>
        )}

        {error && (
          <div className="alert alert-warning mt-3">{error}</div>
        )}

        <Link href="/" className="btn btn-link mt-3 text-muted">
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

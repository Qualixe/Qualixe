import Link from 'next/link';

export default function CancelPage() {
  return (
    <main className="container py-5 text-center" style={{ maxWidth: 480 }}>
      <div className="card shadow-sm border-0 p-4">
        <div className="mb-3">
          <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: 56 }} />
        </div>
        <h1 className="h3 fw-bold mb-2">Payment Cancelled</h1>
        <p className="text-muted mb-4">
          Your payment was not completed. No charges were made.
        </p>
        <Link href="/shop" className="btn btn-primary w-100 fw-semibold">
          Try Again
        </Link>
        <Link href="/" className="btn btn-link mt-2 text-muted">
          Back to Home
        </Link>
      </div>
    </main>
  );
}

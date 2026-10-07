// Thin wrappers around the Meta Pixel and gtag globals set up by
// _components/TrackingScripts.tsx. Both are no-ops when the tag is not configured.

type TrackFn = (...args: unknown[]) => void;

type TrackingWindow = Window & { fbq?: TrackFn; gtag?: TrackFn };

export function trackMeta(event: string, params?: Record<string, unknown>) {
  const w = window as TrackingWindow;
  if (params) w.fbq?.('track', event, params);
  else w.fbq?.('track', event);
}

export function trackGtag(event: string, params: Record<string, unknown> = {}) {
  (window as TrackingWindow).gtag?.('event', event, params);
}

// Set when the quote form succeeds, consumed by the thank-you page so that
// refreshing or opening /thank-you directly does not count as a conversion.
export const LEAD_FLAG_KEY = 'qlx_lead_submitted';

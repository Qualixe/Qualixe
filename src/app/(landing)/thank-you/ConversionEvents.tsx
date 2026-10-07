'use client';

import { useEffect } from 'react';

import { GOOGLE_ADS_CONVERSION_LABEL, GOOGLE_ADS_ID } from '../landing.config';
import { LEAD_FLAG_KEY, trackGtag, trackMeta } from '../tracking';

// Fires the lead conversions once per successful form submission. The flag is
// set by QuoteForm, so a refresh or a direct visit to /thank-you is not counted.
export default function ConversionEvents() {
  useEffect(() => {
    try {
      if (!sessionStorage.getItem(LEAD_FLAG_KEY)) return;
      sessionStorage.removeItem(LEAD_FLAG_KEY);
    } catch {
      return;
    }

    trackMeta('Lead');
    trackGtag('generate_lead');
    if (GOOGLE_ADS_ID && GOOGLE_ADS_CONVERSION_LABEL) {
      trackGtag('conversion', { send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}` });
    }
  }, []);

  return null;
}

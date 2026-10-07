'use client';

import { useEffect } from 'react';
import { trackGtag, trackMeta } from '../tracking';

// One delegated listener covers every WhatsApp button on the page, so the
// buttons themselves can stay plain server-rendered links.
export default function WhatsAppClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="https://wa.me/"]');
      if (!link) return;
      const location = link.getAttribute('data-wa') || 'unknown';
      trackMeta('Contact', { content_name: `whatsapp_${location}` });
      trackGtag('whatsapp_click', { link_location: location });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}

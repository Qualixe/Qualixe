import type { Metadata } from 'next';
import Image from 'next/image';
import { Check } from 'lucide-react';

import ConversionEvents from './ConversionEvents';
import WhatsAppIcon from '../_components/WhatsAppIcon';
import { LANDING_PATH, whatsappUrl } from '../landing.config';

export const metadata: Metadata = {
  title: { absolute: 'ধন্যবাদ | Qualixe' },
  description: 'আপনার request আমরা পেয়েছি। ২৪ ঘণ্টার মধ্যে আমাদের team WhatsApp-এ যোগাযোগ করবে।',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <main className="lp-thanks">
      <ConversionEvents />
      <Image
        src="/assets/img/logo.png"
        alt="Qualixe"
        width={123}
        height={32}
        priority
        className="lp-thanks__logo"
      />
      <div className="lp-card lp-thanks__card">
        <span className="lp-thanks__icon" aria-hidden="true">
          <Check size={44} strokeWidth={3} />
        </span>
        <h1>ধন্যবাদ! আপনার request আমরা পেয়েছি।</h1>
        <p>২৪ ঘণ্টার মধ্যে আমাদের team WhatsApp-এ যোগাযোগ করবে।</p>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          data-wa="thank_you"
          className="lp-btn lp-btn--wa"
        >
          <WhatsAppIcon size={18} />
          দ্রুত কথা বলতে WhatsApp করুন
        </a>
        <a href={LANDING_PATH} className="lp-thanks__back">
          Homepage-এ ফিরে যান
        </a>
      </div>
    </main>
  );
}

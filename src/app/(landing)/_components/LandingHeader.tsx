import Image from 'next/image';

import WhatsAppIcon from './WhatsAppIcon';
import { whatsappUrl } from '../landing.config';

// Sticky header shared by the landing page and the privacy policy. On the
// landing page both links are in-page anchors; other pages pass full paths.
export default function LandingHeader({
  homeHref = '#top',
  quoteHref = '#quote-form',
}: {
  homeHref?: string;
  quoteHref?: string;
}) {
  return (
    <header className="lp-header">
      <div className="lp-container lp-header__inner">
        <a href={homeHref} className="lp-header__logo" aria-label="Qualixe">
          <Image src="/assets/img/logo.png" alt="Qualixe" width={123} height={32} priority />
        </a>
        <nav className="lp-header__actions" aria-label="Quick actions">
          <a href={quoteHref} className="lp-btn lp-btn--primary lp-btn--sm">
            Quote নিন
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            data-wa="header"
            className="lp-btn lp-btn--wa lp-btn--sm"
          >
            <WhatsAppIcon size={18} />
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}

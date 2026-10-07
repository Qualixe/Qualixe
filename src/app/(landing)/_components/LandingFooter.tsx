import WhatsAppIcon from './WhatsAppIcon';
import { PRIVACY_POLICY_PATH, WHATSAPP_DISPLAY, whatsappUrl } from '../landing.config';

// Footer plus the floating WhatsApp button, shared by the landing page and the
// privacy policy.
export default function LandingFooter() {
  return (
    <>
      <footer className="lp-footer">
        <div className="lp-container lp-footer__inner">
          <p>
            <strong>Qualixe:</strong> Build Smart. Scale Faster.
          </p>
          <ul>
            <li>
              <a href="https://www.qualixe.com">qualixe.com</a>
            </li>
            <li>
              WhatsApp:{' '}
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" data-wa="footer">
                {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a href={PRIVACY_POLICY_PATH}>Privacy Policy</a>
            </li>
          </ul>
        </div>
      </footer>

      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        data-wa="floating"
        className="lp-wa-float"
        aria-label="WhatsApp করুন"
      >
        <WhatsAppIcon size={30} />
      </a>
    </>
  );
}

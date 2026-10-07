// Single source of truth for everything on the e-commerce landing page that
// needs replacing before launch: contact details, prices, tracking IDs and the
// Google Sheet webhook. Search for "TODO" to find every placeholder.

export const LANDING_PATH = '/ecommerce-website';
export const THANK_YOU_PATH = '/thank-you';
export const PRIVACY_POLICY_PATH = '/privacy';

// ── Privacy policy ──────────────────────────────────────────────────────────
// Shown on /privacy. Values still in [brackets] are printed as-is; once
// replaced with real ones, the email and WhatsApp number become links.
export const PRIVACY_LAST_UPDATED = '7-Oct-2026'; // TODO: e.g. '7 October 2026'
export const PRIVACY_EMAIL = 'qualixe.info@gmail.com'; // TODO
export const PRIVACY_WHATSAPP = '+8801318552266'; // TODO: e.g. '+880 1318-552266'
export const PRIVACY_ADDRESS = 'House:06, Road: 3, Block:A, Mirpur 11, Dhaka'; // TODO

// ── WhatsApp ────────────────────────────────────────────────────────────────
// Same number the main site's chat widget uses (src/components/WhatsAppChat.tsx).
// TODO: change if ad leads should go to a different number.
export const WHATSAPP_NUMBER = '8801318552266'; // international format, no "+"
export const WHATSAPP_DISPLAY = '01318552266';
export const WHATSAPP_MESSAGE = 'আসসালামু আলাইকুম, আমি e-commerce website নিয়ে জানতে চাই';

export function whatsappUrl(message: string = WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ── Lead form → Google Sheet ────────────────────────────────────────────────
// TODO: paste the Apps Script Web App URL (ends in /exec).
// Setup steps are at the top of google-apps-script/leads.gs.
export const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxrcZl9EPI1Z1vkRabCgopIuF2wJ_b3gIw0foF8EavWK4_SFrO87NTMkKEG1v9iWTo3/exec';

// ── Tracking ────────────────────────────────────────────────────────────────
// Leave a value empty to keep that tag switched off (nothing is loaded for it).
export const META_PIXEL_ID = ''; // TODO: e.g. '123456789012345'
export const GA4_MEASUREMENT_ID = 'G-NS5MM8T1NJ';
export const GOOGLE_ADS_ID = ''; // TODO: e.g. 'AW-XXXXXXX'
export const GOOGLE_ADS_CONVERSION_LABEL = ''; // TODO: the LABEL part of AW-XXXXXXX/LABEL

// ── Pricing & timeline copy ─────────────────────────────────────────────────
export const STARTING_PRICE = '৳10,000'; // TODO
export const DELIVERY_WEEKS = '1–5'; // TODO: e.g. '২–৪'

// `tier` is what the Google Sheet uses for the Hot/Cold tag ("low" = Cold), so
// the labels can be reworded freely without touching the Apps Script.
export const BUDGET_OPTIONS = [
  { tier: 'low', label: '৳10k–20k' },
  { tier: 'mid', label: '৳20k–30k' },
  { tier: 'high', label: '৳30k–50k' },
  { tier: 'premium', label: '৳50k+' },
] as const;

// ── Portfolio ───────────────────────────────────────────────────────────────
// Add a project by appending to this array; the grid adapts on its own.
export interface PortfolioProject {
  title: string;
  image: string;
  tags: string[];
  url: string;
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    title: "Focus: Women's Clothing Brand",
    image: '/images/focus.png', // TODO: placeholder image
    tags: ['Clean, minimal design', 'Occasion-based shopping', 'Quick View', 'Size Chart', 'Mobile-first'],
    url: 'https://qlix-focus.vercel.app',
  },
];

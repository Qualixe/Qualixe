import type { Viewport } from 'next';
import { Hind_Siliguri, Inter } from 'next/font/google';

import TrackingScripts from './_components/TrackingScripts';
import WhatsAppClickTracker from './_components/WhatsAppClickTracker';
import './landing.css';

// Inter covers Latin/UI text; Bangla glyphs fall through to Hind Siliguri.
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  variable: '--font-hind-siliguri',
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B1B3F',
};

// Standalone ad landing pages: no site header/footer, no Bootstrap, no GTM —
// only the pixel/gtag tags configured in landing.config.ts.
//
// <html> belongs to the root layout (src/app/layout.tsx) and is rendered with
// lang="en" for the whole site, so the Bangla language is declared on the
// wrapper here and copied onto <html> by the inline script before first paint.
export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="bn" className={`lp ${inter.variable} ${hindSiliguri.variable}`}>
      <script
        dangerouslySetInnerHTML={{
          // the privacy policy is the one English page in this group
          __html: "document.documentElement.lang=location.pathname.indexOf('/privacy')===0?'en':'bn'",
        }}
      />
      <TrackingScripts />
      {children}
      <WhatsAppClickTracker />
    </div>
  );
}

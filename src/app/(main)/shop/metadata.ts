import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free HTML Templates – Download Professional Website Templates | Qualixe',
  description:
    'Download free, production-ready HTML templates for e-commerce, business, and portfolio websites. Clean code, fully responsive, SEO-optimized. No credit card required.',
  keywords: [
    'free html templates',
    'html website templates',
    'free website templates download',
    'ecommerce html template',
    'responsive html templates',
    'free bootstrap templates',
    'html5 css3 templates',
    'free web templates',
    'business website template',
    'portfolio html template',
  ],
  openGraph: {
    title: 'Free HTML Templates – Download Professional Website Templates | Qualixe',
    description:
      'Download free, production-ready HTML templates for e-commerce, business, and portfolio websites. Clean code, fully responsive, SEO-optimized.',
    url: 'https://qualixe.com/shop',
    siteName: 'Qualixe',
    type: 'website',
    images: [
      {
        url: 'https://qualixe.com/assets/img/web-logo.png',
        width: 1200,
        height: 630,
        alt: 'Qualixe Free HTML Templates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free HTML Templates – Download Now | Qualixe',
    description:
      'Professional HTML templates at zero cost. Responsive, SEO-friendly, and ready to launch.',
    images: ['https://qualixe.com/assets/img/web-logo.png'],
  },
  alternates: {
    canonical: 'https://qualixe.com/shop',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Portfolio – Shopify & E-Commerce Projects | Qualixe',
  description: 'Browse Qualixe\'s portfolio of Shopify stores, e-commerce websites, and digital projects built for brands across Bangladesh and worldwide.',
  keywords: ['shopify portfolio', 'ecommerce projects', 'web design portfolio', 'qualixe work'],
  alternates: { canonical: 'https://www.qualixe.com/portfolio' },
  openGraph: {
    title: 'Our Portfolio – Shopify & E-Commerce Projects | Qualixe',
    description: 'Browse our portfolio of Shopify stores and e-commerce websites built for brands worldwide.',
    url: 'https://www.qualixe.com/portfolio',
    images: [{ url: '/assets/img/portfolio-flemi.jpg', width: 1200, height: 630, alt: 'Qualixe Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Portfolio | Qualixe',
    description: 'Shopify stores and e-commerce websites built for brands worldwide.',
  },
};

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog – E-Commerce Tips, Shopify Guides & Digital Marketing | Qualixe',
  description: 'Read the Qualixe blog for expert tips on Shopify development, e-commerce growth strategies, digital marketing, and UI/UX design best practices.',
  keywords: ['shopify blog', 'ecommerce tips', 'digital marketing blog', 'shopify guides', 'qualixe blog'],
  alternates: { canonical: 'https://www.qualixe.com/blog' },
  openGraph: {
    title: 'Blog – E-Commerce Tips & Shopify Guides | Qualixe',
    description: 'Expert tips on Shopify development, e-commerce growth, and digital marketing.',
    url: 'https://www.qualixe.com/blog',
    images: [{ url: '/assets/img/web-logo.png', width: 1200, height: 630, alt: 'Qualixe Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Qualixe',
    description: 'Shopify guides, e-commerce tips, and digital marketing insights.',
  },
};

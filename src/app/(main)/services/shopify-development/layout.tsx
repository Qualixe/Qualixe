import type { Metadata } from 'next';

// This layout wrapper makes metadata work for the 'use client' page inside
export const metadata: Metadata = {
  title: 'Shopify Custom Theme Development Services – High-Converting Stores | Qualixe',
  description:
    'Qualixe builds custom Shopify themes that convert visitors into customers. Expert Shopify custom theme development, app integrations, speed optimization & e-commerce SEO. Get a free quote today.',
  keywords: [
    'shopify custom theme development',
    'shopify custom theme development services',
    'custom shopify store',
    'shopify theme development',
    'shopify theme customization',
    'shopify expert bangladesh',
    'shopify developer bangladesh',
    'hire shopify developer',
    'shopify store development',
    'ecommerce development bangladesh',
    'shopify app integration',
    'shopify speed optimization',
  ],
  alternates: { canonical: 'https://www.qualixe.com/services/shopify-development' },
  openGraph: {
    title: 'Shopify Custom Theme Development Services – High-Converting Stores | Qualixe',
    description:
      'Custom Shopify theme development, app integrations, and performance optimization for high-converting e-commerce stores. Based in Bangladesh, serving clients worldwide.',
    url: 'https://www.qualixe.com/services/shopify-development',
    type: 'website',
    images: [
      {
        url: '/assets/img/service-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Qualixe Shopify Development Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shopify Custom Theme Development Services | Qualixe',
    description:
      'Custom Shopify theme development built to convert. Expert development, fast delivery, transparent pricing.',
    images: ['/assets/img/service-hero.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function ShopifyDevelopmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

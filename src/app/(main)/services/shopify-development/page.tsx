import type { Metadata } from 'next';
import { getShopifyServicePage } from '../../../../../lib/api/shopify-service';
import ShopifyServiceClient from './ShopifyServiceClient';
import { FALLBACK } from './fallback';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Shopify Custom Theme Development Services | Qualixe',
  description:
    'Custom Shopify theme development, app integrations, performance optimization, and e-commerce SEO. High-converting stores built in 4–8 weeks by Qualixe.',
  keywords: [
    'shopify development', 'shopify theme development', 'custom shopify store',
    'shopify developer bangladesh', 'shopify theme design', 'ecommerce development',
  ],
  alternates: {
    canonical: 'https://www.qualixe.com/services/shopify-development',
  },
  openGraph: {
    title: 'Shopify Custom Theme Development Services | Qualixe',
    description:
      'Custom Shopify stores built for conversions. Theme design, app integrations, SEO, and ongoing support — delivered in 4–8 weeks.',
    url: 'https://www.qualixe.com/services/shopify-development',
    type: 'website',
    images: [{ url: 'https://www.qualixe.com/assets/img/service-hero.jpg', width: 1200, height: 630, alt: 'Shopify Development Services – Qualixe' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shopify Custom Theme Development Services | Qualixe',
    description: 'Custom Shopify stores built for conversions. Delivered in 4–8 weeks.',
    images: ['https://www.qualixe.com/assets/img/service-hero.jpg'],
  },
};

export default async function ShopifyDevelopmentPage() {
  const data = await getShopifyServicePage();
  const page = data ?? FALLBACK;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Shopify Development Services',
      description:
        'Custom Shopify theme development, app integrations, performance optimization, and e-commerce SEO for high-converting online stores.',
      provider: {
        '@type': 'Organization',
        name: 'Qualixe',
        url: 'https://www.qualixe.com',
        logo: 'https://www.qualixe.com/assets/img/logo.png',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'House-06, Road-3, Mirpur-11',
          addressLocality: 'Dhaka',
          addressCountry: 'BD',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+8801318552266',
          contactType: 'customer service',
        },
      },
      serviceType: 'Shopify Development',
      areaServed: 'Worldwide',
      url: 'https://www.qualixe.com/services/shopify-development',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Shopify Development Services',
        itemListElement: page.services.items.map((s) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: s.title },
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.qualixe.com' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.qualixe.com/services' },
        { '@type': 'ListItem', position: 3, name: 'Shopify Development', item: 'https://www.qualixe.com/services/shopify-development' },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShopifyServiceClient page={page} />
    </>
  );
}

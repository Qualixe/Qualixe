import type { Metadata } from 'next';
import DigitalMarketingClient from './DigitalMarketingClient';

export const metadata: Metadata = {
  title: 'Digital Marketing Services – SEO, Paid Ads & Social Media | Qualixe',
  description:
    'Data-driven SEO, Google Ads, Meta Ads, social media marketing, and email campaigns that drive real traffic and revenue for your business.',
  keywords: ['digital marketing', 'seo services', 'google ads', 'social media marketing', 'email marketing', 'qualixe'],
  alternates: { canonical: 'https://www.qualixe.com/services/digital-marketing' },
  openGraph: {
    title: 'Digital Marketing Services – SEO, Paid Ads & Social Media | Qualixe',
    description: 'Full-funnel digital marketing — SEO, paid ads, social media, and email campaigns that grow your business.',
    url: 'https://www.qualixe.com/services/digital-marketing',
    type: 'website',
    images: [{ url: 'https://www.qualixe.com/assets/img/service-hero.jpg', width: 1200, height: 630, alt: 'Digital Marketing Services – Qualixe' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing Services | Qualixe',
    description: 'SEO, paid ads, and social media campaigns that drive real revenue.',
    images: ['https://www.qualixe.com/assets/img/service-hero.jpg'],
  },
};

export default function DigitalMarketingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.qualixe.com' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.qualixe.com/services' },
      { '@type': 'ListItem', position: 3, name: 'Digital Marketing', item: 'https://www.qualixe.com/services/digital-marketing' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DigitalMarketingClient />
    </>
  );
}

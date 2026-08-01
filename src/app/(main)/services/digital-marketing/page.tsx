import type { Metadata } from 'next';
import { getDigitalMarketingPage } from '../../../../../lib/api/digital-marketing-service';
import DigitalMarketingClient from './DigitalMarketingClient';
import { FALLBACK } from './fallback';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Digital Marketing Services – SEO, Paid Ads & Social Media | Qualixe',
  description: 'Data-driven SEO, Google Ads, Meta Ads, social media marketing, and email campaigns that drive real traffic and revenue for your business.',
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

export default async function DigitalMarketingPage() {
  const data = await getDigitalMarketingPage();
  const page = data ?? FALLBACK;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Digital Marketing Services',
      description: 'Data-driven SEO, paid ads, social media marketing, and email campaigns that drive real traffic and revenue.',
      provider: { '@type': 'Organization', name: 'Qualixe', url: 'https://www.qualixe.com' },
      serviceType: 'Digital Marketing',
      areaServed: 'Worldwide',
      url: 'https://www.qualixe.com/services/digital-marketing',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Digital Marketing Services',
        itemListElement: page.services.items.map(s => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: s.title },
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faq.items.map(item => ({
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
        { '@type': 'ListItem', position: 3, name: 'Digital Marketing', item: 'https://www.qualixe.com/services/digital-marketing' },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DigitalMarketingClient page={page} />
    </>
  );
}

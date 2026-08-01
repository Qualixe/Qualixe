import type { Metadata } from 'next';
import { getUiUxPage } from '../../../../../lib/api/uiux-service';
import UiUxDesignClient from './UiUxDesignClient';
import { FALLBACK } from './fallback';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'UI/UX Design Services – Web & App Design | Qualixe',
  description: 'Professional UI/UX design for websites and mobile apps. From wireframes to pixel-perfect handoff — we design experiences people love to use.',
  keywords: ['ui ux design', 'web design', 'app design', 'figma design', 'user experience design', 'qualixe'],
  alternates: { canonical: 'https://www.qualixe.com/services/uiux-design' },
  openGraph: {
    title: 'UI/UX Design Services – Web & App Design | Qualixe',
    description: 'Beautiful, intuitive interfaces designed around your users. From wireframes to pixel-perfect handoff.',
    url: 'https://www.qualixe.com/services/uiux-design',
    type: 'website',
    images: [{ url: 'https://www.qualixe.com/assets/img/service-hero.jpg', width: 1200, height: 630, alt: 'UI/UX Design Services – Qualixe' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UI/UX Design Services | Qualixe',
    description: 'Beautiful, intuitive interfaces designed around your users.',
    images: ['https://www.qualixe.com/assets/img/service-hero.jpg'],
  },
};

export default async function UiUxDesignPage() {
  const data = await getUiUxPage();
  const page = data ?? FALLBACK;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'UI/UX Design Services',
      description: 'Professional UI/UX design for websites and mobile apps — from wireframes to pixel-perfect handoff.',
      provider: { '@type': 'Organization', name: 'Qualixe', url: 'https://www.qualixe.com' },
      serviceType: 'UI/UX Design',
      areaServed: 'Worldwide',
      url: 'https://www.qualixe.com/services/uiux-design',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'UI/UX Design Services',
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
        { '@type': 'ListItem', position: 3, name: 'UI/UX Design', item: 'https://www.qualixe.com/services/uiux-design' },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <UiUxDesignClient page={page} />
    </>
  );
}

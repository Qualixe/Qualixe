import type { Metadata } from 'next';
import UiUxDesignClient from './UiUxDesignClient';

export const metadata: Metadata = {
  title: 'UI/UX Design Services – Web & App Design | Qualixe',
  description:
    'Professional UI/UX design for websites and mobile apps. From wireframes to pixel-perfect handoff — we design experiences people love to use.',
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

export default function UiUxDesignPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.qualixe.com' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.qualixe.com/services' },
      { '@type': 'ListItem', position: 3, name: 'UI/UX Design', item: 'https://www.qualixe.com/services/uiux-design' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <UiUxDesignClient />
    </>
  );
}

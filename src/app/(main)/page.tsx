import Hero from './home/Hero';
import About from './home/About';
import Services from './home/Service';
import Portfolio from './home/Portfolio';
import ClientsGrid from './home/Clients';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Qualixe – Shopify Development & E-Commerce Solutions',
  description: 'Qualixe builds high-converting Shopify stores, custom e-commerce websites, free HTML templates, and digital marketing solutions for brands worldwide.',
  keywords: ['shopify development', 'ecommerce development', 'shopify store', 'digital marketing', 'ui ux design', 'qualixe bangladesh'],
  alternates: { canonical: 'https://www.qualixe.com' },
  openGraph: {
    title: 'Qualixe – Shopify Development & E-Commerce Solutions',
    description: 'High-converting Shopify stores, free HTML templates, and digital marketing for e-commerce brands.',
    url: 'https://www.qualixe.com',
    type: 'website',
    images: [{ url: 'https://www.qualixe.com/assets/img/web-logo.png', width: 1200, height: 630, alt: 'Qualixe' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qualixe – Shopify Development & E-Commerce Solutions',
    description: 'High-converting Shopify stores and digital marketing for e-commerce brands.',
    images: ['https://www.qualixe.com/assets/img/web-logo.png'],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Qualixe',
  url: 'https://www.qualixe.com',
  logo: 'https://www.qualixe.com/assets/img/logo.png',
  description: 'Qualixe is a Shopify development agency based in Bangladesh, building high-converting e-commerce stores for brands worldwide.',
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
    availableLanguage: ['English', 'Bengali'],
  },
  sameAs: [
    'https://www.facebook.com/qualixe',
    'https://www.linkedin.com/company/qualixe',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Qualixe',
  url: 'https://www.qualixe.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.qualixe.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <div>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <ClientsGrid />
      </div>
    </>
  );
}

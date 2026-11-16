import type { Metadata } from 'next';
import { getHomePage } from '../../../lib/api/home-page';
import { portfolioAPI, type Portfolio } from '../../../lib/api/portfolio';
import { clientsAPI, type Client } from '../../../lib/api/clients';
import HomeHero from './home/sections/HomeHero';
import LogoMarquee from './home/sections/LogoMarquee';
import AboutManifesto from './home/sections/AboutManifesto';
import ServicesBento from './home/sections/ServicesBento';
import WorkShowcase from './home/sections/WorkShowcase';
import ProcessSteps from './home/sections/ProcessSteps';
import ClosingCta, { CapabilityMarquee } from './home/sections/ClosingCta';
import InsightsSection from './home/sections/InsightsSection';
import { blogAPI, type BlogPost } from '../../../lib/api/blog';
import './home/sections/home.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Qualixe – Shopify Development & E-Commerce Solutions',
  description: 'Qualixe builds high-converting Shopify stores, custom e-commerce websites, free HTML templates, and digital marketing solutions for brands worldwide.',
  keywords: ['shopify development', 'ecommerce development', 'shopify store', 'shopify app development', 'laravel development', 'next.js development', 'saas development', 'digital marketing', 'qualixe bangladesh'],
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

export default async function HomePage() {
  const [page, portfolio, clients, posts] = await Promise.all([
    getHomePage(),
    portfolioAPI.getAll().then((d) => (d ?? []) as Portfolio[]).catch(() => [] as Portfolio[]),
    clientsAPI.getAll().then((d) => (d ?? []) as Client[]).catch(() => [] as Client[]),
    blogAPI.getAllPublished().then((d) => ((d ?? []) as BlogPost[]).slice(0, 3)).catch(() => [] as BlogPost[]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <main className="hx-home">
        <HomeHero data={page.hero} />
        <LogoMarquee clients={clients} />
        <AboutManifesto data={page.about} />
        <ServicesBento data={page.services} />
        <CapabilityMarquee />
        <WorkShowcase items={portfolio.slice(0, 6)} />
        <ProcessSteps />
        <InsightsSection posts={posts} />
        <ClosingCta />
      </main>
    </>
  );
}

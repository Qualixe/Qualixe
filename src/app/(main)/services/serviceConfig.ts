import type { Metadata } from 'next';
import type { ShopifyServicePage } from '../../../../lib/api/shopify-service';

export const SITE = 'https://www.qualixe.com';

export type ServiceSlug =
  | 'shopify-development'
  | 'shopify-app-development'
  | 'laravel-development'
  | 'web-app-development'
  | 'saas-development'
  | 'digital-marketing';

export interface ServiceConfig {
  slug: ServiceSlug;
  /** Short name used in breadcrumbs, related links and schema */
  name: string;
  serviceType: string;
  /** SEO */
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  /** Hero visual */
  image: { src: string; width: number; height: number; alt: string };
  badgeIcon: string;
  chips: { icon: string; title: string; text: string; tone?: 'green' | 'blue' | 'violet' }[];
  /** One-line summary for the related-services cards */
  blurb: string;
  icon: string;
}

export const SERVICES: Record<ServiceSlug, ServiceConfig> = {
  'shopify-development': {
    slug: 'shopify-development',
    name: 'Shopify Development',
    serviceType: 'Shopify Development',
    title: 'Shopify Custom Theme Development Services | Qualixe',
    description:
      'Custom Shopify theme development that converts. Qualixe builds fast, SEO-friendly Shopify 2.0 stores, app integrations and migrations for brands worldwide.',
    keywords: [
      'shopify custom theme development',
      'shopify custom theme development services',
      'shopify theme development',
      'custom shopify store',
      'shopify theme customization',
      'shopify 2.0 development',
      'shopify developer bangladesh',
      'shopify expert bangladesh',
      'hire shopify developer',
      'shopify store development',
      'shopify app integration',
      'shopify speed optimization',
    ],
    ogTitle: 'Shopify Custom Theme Development Services | Qualixe',
    ogDescription:
      'Custom Shopify themes, app integrations and performance optimisation for high-converting stores. Based in Bangladesh, serving brands worldwide.',
    image: {
      src: '/assets/img/service-hero.jpg',
      width: 1920,
      height: 1440,
      alt: 'Laptop showing a Shopify storefront — Qualixe custom Shopify theme development',
    },
    badgeIcon: 'bi-bag-check-fill',
    chips: [
      { icon: 'bi-shop', title: 'Custom Shopify', text: 'Theme development', tone: 'green' },
      { icon: 'bi-phone', title: 'Mobile-first', text: 'Fast & responsive', tone: 'blue' },
    ],
    blurb: 'Custom Shopify 2.0 themes, integrations and migrations built to convert.',
    icon: 'bi-bag-heart',
  },
  'digital-marketing': {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    serviceType: 'Digital Marketing',
    title: 'Digital Marketing Services – SEO, Ads & Social | Qualixe',
    description:
      'Data-driven SEO, Google & Meta ads, social media and email marketing that grow traffic, leads and revenue for e-commerce brands. Book a free strategy call.',
    keywords: [
      'digital marketing services',
      'ecommerce marketing agency',
      'seo services',
      'shopify seo',
      'google ads management',
      'meta ads agency',
      'social media marketing',
      'email marketing',
      'digital marketing agency bangladesh',
    ],
    ogTitle: 'Digital Marketing Services – SEO, Ads & Social | Qualixe',
    ogDescription:
      'Full-funnel digital marketing — SEO, paid ads, social media and email campaigns that grow e-commerce brands.',
    image: {
      src: '/assets/img/service-marketing.jpg',
      width: 1400,
      height: 1540,
      alt: 'Analytics dashboard tracking sessions and bounce rate — Qualixe digital marketing services',
    },
    badgeIcon: 'bi-graph-up-arrow',
    chips: [
      { icon: 'bi-search', title: 'SEO & content', text: 'Long-term growth', tone: 'blue' },
      { icon: 'bi-bullseye', title: 'Paid ads', text: 'Google & Meta', tone: 'violet' },
    ],
    blurb: 'SEO, paid ads, social and email campaigns that drive real revenue.',
    icon: 'bi-graph-up-arrow',
  },
  'shopify-app-development': {
    slug: 'shopify-app-development',
    name: 'Shopify App Development',
    serviceType: 'Shopify App Development',
    title: 'Shopify App Development – Public & Custom Apps | Qualixe',
    description:
      'Shopify app development for public App Store apps and private custom apps — embedded admin, theme app extensions, Shopify Functions and integrations.',
    keywords: [
      'shopify app development',
      'shopify public app development',
      'shopify custom app development',
      'shopify app developer',
      'shopify private app',
      'shopify functions development',
      'theme app extensions',
      'shopify api integration',
      'shopify app development agency',
    ],
    ogTitle: 'Shopify App Development – Public & Custom Apps | Qualixe',
    ogDescription:
      'Public App Store apps and private custom apps that extend Shopify with the features your business needs.',
    image: {
      src: '/assets/img/service-shopify-apps.jpg',
      width: 1400,
      height: 1540,
      alt: 'Hand holding a phone showing an app dashboard — Qualixe Shopify app development',
    },
    badgeIcon: 'bi-grid-1x2-fill',
    chips: [
      { icon: 'bi-shop-window', title: 'Public apps', text: 'Shopify App Store', tone: 'green' },
      { icon: 'bi-lock', title: 'Custom apps', text: 'Built for your store', tone: 'blue' },
    ],
    blurb: 'Public App Store apps and private custom apps that extend Shopify.',
    icon: 'bi-grid-1x2',
  },
  'laravel-development': {
    slug: 'laravel-development',
    name: 'Laravel Development',
    serviceType: 'Laravel Development',
    title: 'Laravel Development Services – Web Apps & APIs | Qualixe',
    description:
      'Custom Laravel development for websites, admin dashboards, portals and APIs. Clean, secure, scalable PHP applications, upgrades and ongoing maintenance.',
    keywords: [
      'laravel development services',
      'laravel development company',
      'laravel developer bangladesh',
      'custom laravel application',
      'laravel api development',
      'laravel admin dashboard',
      'laravel upgrade',
      'php web application development',
      'hire laravel developer',
    ],
    ogTitle: 'Laravel Development Services – Web Apps & APIs | Qualixe',
    ogDescription:
      'Custom Laravel websites, dashboards, portals and APIs — clean, secure and built to scale.',
    image: {
      src: '/assets/img/service-laravel.jpg',
      width: 1400,
      height: 1540,
      alt: 'PHP source code on a monitor — Qualixe Laravel development services',
    },
    badgeIcon: 'bi-code-square',
    chips: [
      { icon: 'bi-braces', title: 'APIs & back-ends', text: 'REST & GraphQL', tone: 'violet' },
      { icon: 'bi-speedometer', title: 'Dashboards', text: 'Admin & reporting', tone: 'blue' },
    ],
    blurb: 'Custom Laravel websites, dashboards, portals and APIs built to scale.',
    icon: 'bi-code-square',
  },
  'web-app-development': {
    slug: 'web-app-development',
    name: 'Web App Development',
    serviceType: 'Web Application Development',
    title: 'Node.js & Next.js Web App Development | Qualixe',
    description:
      'Web application development with Node.js, Next.js and React — fast, SEO-friendly, TypeScript apps, APIs and MVPs, from first release to production scale.',
    keywords: [
      'web app development',
      'next.js development services',
      'node.js development services',
      'react web application development',
      'next.js agency',
      'node.js developer bangladesh',
      'mvp development',
      'typescript development',
      'full stack javascript development',
    ],
    ogTitle: 'Node.js & Next.js Web App Development | Qualixe',
    ogDescription:
      'Fast, modern web applications built with Node.js, Next.js and React — from MVP to production.',
    image: {
      src: '/assets/img/service-webapp.jpg',
      width: 1400,
      height: 1540,
      alt: 'Code editor open on a laptop — Qualixe Node.js and Next.js web app development',
    },
    badgeIcon: 'bi-window-stack',
    chips: [
      { icon: 'bi-filetype-tsx', title: 'Next.js & React', text: 'Fast, SEO-friendly', tone: 'blue' },
      { icon: 'bi-hdd-network', title: 'Node.js APIs', text: 'Scalable back-ends', tone: 'green' },
    ],
    blurb: 'Modern Node.js, Next.js and React web apps — from MVP to production.',
    icon: 'bi-window-stack',
  },
  'saas-development': {
    slug: 'saas-development',
    name: 'SaaS Development',
    serviceType: 'SaaS Development',
    title: 'SaaS Development Company – MVP to Launch | Qualixe',
    description:
      'End-to-end SaaS product development: MVPs, multi-tenant architecture, subscription billing, teams and roles, dashboards and scalable cloud hosting.',
    keywords: [
      'saas development',
      'saas development company',
      'saas mvp development',
      'multi-tenant saas',
      'subscription billing development',
      'saas application development',
      'build a saas product',
      'saas developer bangladesh',
    ],
    ogTitle: 'SaaS Development Company – MVP to Launch | Qualixe',
    ogDescription:
      'Multi-tenant SaaS products with auth, billing and dashboards — designed, built and launched end to end.',
    image: {
      src: '/assets/img/service-saas.jpg',
      width: 1400,
      height: 1540,
      alt: 'Laptop showing an analytics dashboard — Qualixe SaaS product development',
    },
    badgeIcon: 'bi-cloud-check-fill',
    chips: [
      { icon: 'bi-credit-card-2-front', title: 'Subscriptions', text: 'Plans & billing', tone: 'violet' },
      { icon: 'bi-buildings', title: 'Multi-tenant', text: 'Built to scale', tone: 'blue' },
    ],
    blurb: 'Multi-tenant SaaS products with auth, billing and dashboards.',
    icon: 'bi-cloud-check',
  },
};

/** Display order across the site */
export const SERVICE_ORDER: ServiceSlug[] = [
  'shopify-development',
  'shopify-app-development',
  'laravel-development',
  'web-app-development',
  'saas-development',
  'digital-marketing',
];

export function serviceUrl(slug: ServiceSlug) {
  return `${SITE}/services/${slug}`;
}

export function buildServiceMetadata(cfg: ServiceConfig): Metadata {
  const url = serviceUrl(cfg.slug);
  const image = `${SITE}${cfg.image.src}`;
  return {
    title: cfg.title,
    description: cfg.description,
    keywords: cfg.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: cfg.ogTitle,
      description: cfg.ogDescription,
      url,
      type: 'website',
      siteName: 'Qualixe',
      locale: 'en_US',
      images: [{ url: image, width: cfg.image.width, height: cfg.image.height, alt: cfg.image.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: cfg.ogTitle,
      description: cfg.ogDescription,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}

const ORG = {
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'Qualixe',
  url: SITE,
  logo: `${SITE}/assets/img/logo.png`,
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
  sameAs: ['https://www.facebook.com/qualixe', 'https://www.linkedin.com/company/qualixe'],
};

/** Service + FAQPage + BreadcrumbList + WebPage, linked by @id */
export function buildServiceJsonLd(cfg: ServiceConfig, page: ShopifyServicePage) {
  const url = serviceUrl(cfg.slug);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ORG,
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: cfg.title,
        description: cfg.description,
        isPartOf: { '@type': 'WebSite', '@id': `${SITE}/#website`, url: SITE, name: 'Qualixe' },
        primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}${cfg.image.src}` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        about: { '@id': `${url}#service` },
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: `${cfg.name} Services`,
        serviceType: cfg.serviceType,
        description: page.hero.subheading || cfg.description,
        url,
        image: `${SITE}${cfg.image.src}`,
        provider: { '@id': `${SITE}/#organization` },
        areaServed: 'Worldwide',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: page.services.heading,
          itemListElement: page.services.items.map((s) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: s.title, description: s.desc },
          })),
        },
      },
      ...(page.faq.items.length
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${url}#faq`,
              mainEntity: page.faq.items.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
              })),
            },
          ]
        : []),
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE}/services` },
          { '@type': 'ListItem', position: 3, name: cfg.name, item: url },
        ],
      },
    ],
  };
}

/**
 * Single source of truth for the services Qualixe offers.
 * Used by the header menu, footer, search quick-links, home page,
 * services index and sitemap — add/remove a service here only.
 */
export interface ServiceCatalogItem {
  /** URL path */
  href: string;
  /** Display name */
  name: string;
  /** One-line description for menus */
  short: string;
  /** Two-line description for cards */
  blurb: string;
  /** Bootstrap icon class */
  icon: string;
  tags: string[];
}

export const SERVICE_CATALOG: ServiceCatalogItem[] = [
  {
    href: '/services/shopify-development',
    name: 'Shopify Development',
    short: 'Custom themes & stores that convert',
    blurb: 'Custom Shopify 2.0 themes, store builds and migrations — fast, SEO-friendly and built to convert.',
    icon: 'bi-bag-heart',
    tags: ['Liquid', 'Shopify 2.0', 'Migrations'],
  },
  {
    href: '/services/shopify-app-development',
    name: 'Shopify App Development',
    short: 'Public & custom Shopify apps',
    blurb: 'Public App Store apps and private custom apps that extend Shopify with the features your business needs.',
    icon: 'bi-grid-1x2',
    tags: ['Public apps', 'Custom apps', 'Admin API'],
  },
  {
    href: '/services/laravel-development',
    name: 'Laravel Development',
    short: 'Robust PHP web applications',
    blurb: 'Custom Laravel websites, dashboards, APIs and back-office systems engineered to scale with you.',
    icon: 'bi-code-square',
    tags: ['Laravel', 'PHP', 'REST APIs'],
  },
  {
    href: '/services/web-app-development',
    name: 'Web App Development',
    short: 'Node.js & Next.js applications',
    blurb: 'Fast, modern web applications built with Node.js, Next.js and React — from MVP to production.',
    icon: 'bi-window-stack',
    tags: ['Node.js', 'Next.js', 'React'],
  },
  {
    href: '/services/saas-development',
    name: 'SaaS Development',
    short: 'Subscription products, end to end',
    blurb: 'Multi-tenant SaaS products with auth, billing and dashboards — designed, built and launched end to end.',
    icon: 'bi-cloud-check',
    tags: ['Multi-tenant', 'Subscriptions', 'Dashboards'],
  },
  {
    href: '/services/digital-marketing',
    name: 'Digital Marketing',
    short: 'SEO, paid ads & social growth',
    blurb: 'Data-driven SEO, Google & Meta ads, social media and email campaigns that drive real revenue.',
    icon: 'bi-graph-up-arrow',
    tags: ['SEO', 'Google & Meta ads', 'Email'],
  },
];

/** Related offering that lives outside /services */
export const HEADLESS_SERVICE: ServiceCatalogItem = {
  href: '/shopify-headless',
  name: 'Headless Shopify',
  short: 'Custom storefronts on Shopify',
  blurb: 'Lightning-fast custom storefronts on a modern frontend, powered by Shopify’s commerce engine underneath.',
  icon: 'bi-lightning-charge',
  tags: ['Storefront API', 'Next.js', 'Performance'],
};

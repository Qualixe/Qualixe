import type { ShopifyServicePage } from '../../../../../lib/api/shopify-service';

export const CONTENT: ShopifyServicePage = {
  hero: {
    badge: 'Shopify App Development',
    heading: 'Shopify Apps Built Around How Your Business Works',
    subheading:
      'From public apps for the Shopify App Store to private custom apps for a single store, we design and build Shopify apps that add the features your business actually needs. Embedded admin experiences, theme app extensions, checkout and Shopify Functions logic, and reliable integrations with the systems you already use — built on Shopify’s latest APIs and best practices.',
    highlights: [
      'Public App Store Apps',
      'Private Custom Apps',
      'Embedded Admin (App Bridge + Polaris)',
      'Theme App Extensions',
      'Shopify Functions & Checkout',
      'ERP, CRM & 3PL Integrations',
    ],
    cta_text: 'Discuss Your App',
    cta_url: '/contact',
  },
  services: {
    heading: 'Shopify App Development Services',
    subheading: 'Everything from a single-store automation to a public app ready for the Shopify App Store.',
    items: [
      { icon: 'bi-shop-window', title: 'Public App Development', desc: 'Multi-merchant apps built for the Shopify App Store — OAuth installation, billing via the Shopify Billing API, GDPR webhooks and a polished embedded admin that follows Shopify’s design guidelines.' },
      { icon: 'bi-lock', title: 'Custom & Private Apps', desc: 'Apps built for one store or brand to automate workflows, add bespoke admin tools or connect Shopify to your internal systems — without the overhead of a public listing.' },
      { icon: 'bi-layout-wtf', title: 'Embedded Admin Experiences', desc: 'Fast, native-feeling app screens inside the Shopify admin using App Bridge and Polaris, so merchants and staff can work without leaving Shopify.' },
      { icon: 'bi-puzzle', title: 'Theme App Extensions', desc: 'App blocks and embeds that merchants can drop into any Online Store 2.0 theme — no manual theme code edits, and clean removal when the app is uninstalled.' },
      { icon: 'bi-cart-check', title: 'Shopify Functions & Checkout', desc: 'Custom discount, shipping, payment and validation logic using Shopify Functions, plus checkout UI extensions for Shopify Plus stores.' },
      { icon: 'bi-arrow-left-right', title: 'Integrations & Automation', desc: 'Reliable two-way sync between Shopify and ERPs, CRMs, 3PLs, marketplaces and internal tools using the Admin GraphQL API and webhooks.' },
    ],
  },
  process: {
    heading: 'How We Build Your Shopify App',
    subheading: 'A clear, staged process — you see working software early and often.',
    items: [
      { title: 'Discovery & Scoping', desc: 'We map the problem the app solves, who uses it and which Shopify APIs, scopes and extensions it needs, then agree the feature set and timeline.' },
      { title: 'UX & Architecture', desc: 'We design the admin screens and storefront touchpoints, plan the data model and choose the hosting, queueing and webhook strategy.' },
      { title: 'Development', desc: 'We build the app in iterative milestones with a development store you can test on, keeping you updated at every step.' },
      { title: 'Testing & QA', desc: 'We test installs, uninstalls, permissions, billing, webhooks and edge cases across themes and devices before anything goes live.' },
      { title: 'Launch & App Review', desc: 'We deploy to production and, for public apps, prepare the listing and guide the app through Shopify’s review process.' },
      { title: 'Support & Iteration', desc: 'After launch we monitor, fix issues, keep up with Shopify API versions and add new features as your needs grow.' },
    ],
  },
  why_us: {
    heading: 'Why Build Your Shopify App With Qualixe',
    subheading: 'Shopify specialists who understand both the merchant side and the code.',
    items: [
      { icon: 'bi-bag-heart', title: 'Shopify-first team', desc: 'We build Shopify stores every day, so we design apps around how merchants and their customers really use the platform.' },
      { icon: 'bi-shield-check', title: 'Built to Shopify’s standards', desc: 'Current API versions, secure OAuth, GDPR webhooks and Polaris UI — the foundations Shopify expects from a quality app.' },
      { icon: 'bi-speedometer2', title: 'Performance-minded', desc: 'Theme app extensions and Functions keep storefronts fast, so your app adds features without slowing the store down.' },
      { icon: 'bi-chat-square-text', title: 'Clear communication', desc: 'Regular demos, a shared test store and plain-English updates — you always know where the build stands.' },
    ],
  },
  faq: {
    heading: 'Shopify App Development FAQ',
    subheading: 'Common questions about building public and custom Shopify apps.',
    items: [
      { q: 'What is the difference between a public app and a custom app?', a: 'A public app is built for many merchants and listed on the Shopify App Store, with Shopify handling discovery and billing. A custom app is built for a single store or organisation and installed directly — ideal for internal tools, automations and private integrations.' },
      { q: 'Can you build a Shopify app for the App Store?', a: 'Yes. We build public apps with OAuth installation, the Billing API, required privacy webhooks and an embedded Polaris admin, and we help prepare your listing and guide the app through Shopify’s review.' },
      { q: 'Do I need Shopify Plus for a custom app?', a: 'No. Custom apps work on all Shopify plans. Some capabilities — such as checkout UI extensions and certain Shopify Functions use cases — are limited to Shopify Plus, and we will tell you up front if a feature depends on your plan.' },
      { q: 'Can a Shopify app integrate with our ERP, CRM or warehouse system?', a: 'Yes. We regularly connect Shopify to external systems using the Admin GraphQL API and webhooks, with queues and retries so orders, inventory and customer data stay in sync reliably.' },
      { q: 'Will the app slow down my storefront?', a: 'We use theme app extensions and Shopify Functions wherever possible, which load efficiently and avoid injecting heavy scripts, so your store stays fast.' },
    ],
  },
  cta: {
    heading: 'Have an idea for a Shopify app?',
    subheading: 'Tell us what you want the app to do — we’ll help you scope it, plan it and build it.',
    btn_text: 'Start Your App Project',
    btn_url: '/contact',
  },
};

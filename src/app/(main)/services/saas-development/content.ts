import type { ShopifyServicePage } from '../../../../../lib/api/shopify-service';

export const CONTENT: ShopifyServicePage = {
  hero: {
    badge: 'SaaS Development',
    heading: 'SaaS Product Development, From Idea to Launch',
    subheading:
      'We design and build software-as-a-service products end to end — multi-tenant architecture, user accounts and roles, subscription billing, dashboards and an admin to run it all. Whether you are validating a new idea or rebuilding a product that has outgrown its first version, we help you ship a SaaS that customers are happy to pay for.',
    highlights: [
      'MVP to Full Product',
      'Multi-Tenant Architecture',
      'Subscription Billing',
      'Teams, Roles & Permissions',
      'Analytics Dashboards',
      'Scalable Cloud Hosting',
    ],
    cta_text: 'Plan Your SaaS',
    cta_url: '/contact',
  },
  services: {
    heading: 'SaaS Development Services',
    subheading: 'The building blocks every successful SaaS product needs, done properly.',
    items: [
      { icon: 'bi-rocket-takeoff', title: 'SaaS MVP Development', desc: 'A focused first release that proves your idea with real paying users — scoped tightly, built quickly and ready to grow.' },
      { icon: 'bi-buildings', title: 'Multi-Tenant Architecture', desc: 'Secure separation of each customer’s data, workspaces and settings, designed to scale from your first account to thousands.' },
      { icon: 'bi-credit-card-2-front', title: 'Subscriptions & Billing', desc: 'Plans, trials, upgrades, invoices and usage-based billing with Stripe or local payment gateways, plus automated dunning emails.' },
      { icon: 'bi-person-badge', title: 'Auth, Teams & Roles', desc: 'Sign-up, SSO and social login, team invitations and fine-grained roles and permissions for every account.' },
      { icon: 'bi-bar-chart-line', title: 'Dashboards & Reporting', desc: 'Customer-facing analytics, exports and an internal admin panel to manage accounts, plans and support.' },
      { icon: 'bi-cloud-check', title: 'Cloud Infrastructure', desc: 'Scalable hosting, background jobs, backups, monitoring and CI/CD so your product stays fast and reliable as you grow.' },
    ],
  },
  process: {
    heading: 'How We Build SaaS Products',
    subheading: 'Product-led, iterative and focused on getting to real users quickly.',
    items: [
      { title: 'Product Discovery', desc: 'We define your target customers, core problem and pricing model, and prioritise the features for the first release.' },
      { title: 'UX & Prototyping', desc: 'We map onboarding and core workflows and prototype the key screens so you can validate them early.' },
      { title: 'Architecture', desc: 'We design the tenancy model, data structure, billing flows and integrations with growth in mind.' },
      { title: 'Build in Sprints', desc: 'We develop in short sprints with a live staging environment, demoing progress regularly.' },
      { title: 'Beta & Launch', desc: 'We onboard early users, fix what they find, and launch with analytics and monitoring in place.' },
      { title: 'Grow & Scale', desc: 'We keep improving the product, adding features and scaling infrastructure as your customer base grows.' },
    ],
  },
  why_us: {
    heading: 'Why Build Your SaaS With Qualixe',
    subheading: 'A partner that cares about the product, not just the code.',
    items: [
      { icon: 'bi-compass', title: 'Product-first approach', desc: 'We focus on what customers will pay for, helping you avoid building features nobody uses.' },
      { icon: 'bi-stack', title: 'Proven stack', desc: 'Laravel, Node.js and Next.js — mature, well-supported technologies that are easy to hire for later.' },
      { icon: 'bi-shield-check', title: 'Secure foundations', desc: 'Tenant isolation, role-based access and secure payment handling built in from the start.' },
      { icon: 'bi-arrow-repeat', title: 'Long-term partnership', desc: 'We stay with you after launch to iterate, scale and support the product as it grows.' },
    ],
  },
  faq: {
    heading: 'SaaS Development FAQ',
    subheading: 'What founders and teams usually ask before starting.',
    items: [
      { q: 'What is the best way to start building a SaaS product?', a: 'Start with a focused MVP that solves one painful problem for a clear group of customers. We help you define that scope, build it quickly and gather feedback before investing in more features.' },
      { q: 'Which technologies do you use for SaaS?', a: 'Usually Laravel or Node.js on the back-end with Next.js or React on the front-end, a PostgreSQL or MySQL database, and Stripe or local gateways for billing — chosen to fit your product and team.' },
      { q: 'Can you handle subscription billing and payments?', a: 'Yes. We implement plans, free trials, upgrades and downgrades, invoices, usage-based pricing and failed-payment handling with Stripe or other gateways.' },
      { q: 'What is multi-tenancy and do I need it?', a: 'Multi-tenancy lets one application securely serve many customer accounts, each with its own data and settings. Most B2B SaaS products need it, and we design it in from the start so it is not a costly retrofit later.' },
      { q: 'Do you support the product after launch?', a: 'Yes. We offer ongoing development, maintenance, monitoring and scaling so your SaaS keeps improving as you grow.' },
    ],
  },
  cta: {
    heading: 'Let’s turn your SaaS idea into a product',
    subheading: 'Share your idea and goals — we’ll help you plan the MVP and the path to launch.',
    btn_text: 'Get a Free Quote',
    btn_url: '/contact',
  },
};

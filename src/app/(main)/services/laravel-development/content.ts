import type { ShopifyServicePage } from '../../../../../lib/api/shopify-service';

export const CONTENT: ShopifyServicePage = {
  hero: {
    badge: 'Laravel Development',
    heading: 'Laravel Development for Websites & Web Applications',
    subheading:
      'We build fast, secure and maintainable Laravel applications — from business websites and customer portals to admin dashboards, booking systems and APIs. Clean architecture, thorough testing and a codebase your team can grow with, whether we are starting fresh or improving an existing Laravel project.',
    highlights: [
      'Custom Laravel Websites',
      'Admin Panels & Dashboards',
      'REST & GraphQL APIs',
      'Livewire / Inertia Frontends',
      'Upgrades & Maintenance',
      'Payment & Third-Party Integrations',
    ],
    cta_text: 'Start a Laravel Project',
    cta_url: '/contact',
  },
  services: {
    heading: 'Laravel Development Services',
    subheading: 'Full-stack Laravel expertise for new builds, rescues and long-term support.',
    items: [
      { icon: 'bi-globe2', title: 'Custom Laravel Websites', desc: 'Content-rich business websites and portals built on Laravel, with an easy-to-use admin so your team can manage pages, products and content without a developer.' },
      { icon: 'bi-speedometer', title: 'Admin Panels & Dashboards', desc: 'Role-based back-office systems, reporting dashboards and internal tools that replace spreadsheets and streamline daily operations.' },
      { icon: 'bi-braces', title: 'API Development', desc: 'Secure, well-documented REST and GraphQL APIs for mobile apps, SPAs and partner integrations, with authentication, rate limiting and versioning.' },
      { icon: 'bi-lightning', title: 'Livewire & Inertia Frontends', desc: 'Interactive, app-like interfaces using Livewire or Inertia with Vue/React — fast to build and pleasant to use.' },
      { icon: 'bi-arrow-up-circle', title: 'Upgrades & Refactoring', desc: 'We upgrade older Laravel versions, untangle legacy code, improve performance and add tests so your application is safer to change.' },
      { icon: 'bi-credit-card', title: 'Integrations & Payments', desc: 'Stripe, SSLCommerz, bKash and other payment gateways, plus email, SMS, CRM and accounting integrations wired into your workflows.' },
    ],
  },
  process: {
    heading: 'Our Laravel Development Process',
    subheading: 'Transparent, milestone-based delivery from first call to launch and beyond.',
    items: [
      { title: 'Discovery & Planning', desc: 'We learn your goals, users and existing systems, then define the scope, data model and a realistic timeline.' },
      { title: 'Architecture & Design', desc: 'We plan the database, modules and integrations, and design the key screens before development starts.' },
      { title: 'Agile Development', desc: 'We build in short milestones with a staging site you can review, so feedback shapes the product as it grows.' },
      { title: 'Testing & QA', desc: 'Automated and manual testing covers features, permissions, edge cases and performance before release.' },
      { title: 'Deployment', desc: 'We set up hosting, CI/CD, queues, scheduled jobs and backups, then launch with zero-drama go-live.' },
      { title: 'Support & Growth', desc: 'Ongoing maintenance, security updates and new features as your business evolves.' },
    ],
  },
  why_us: {
    heading: 'Why Choose Qualixe for Laravel',
    subheading: 'Engineering that is built to last, not just to launch.',
    items: [
      { icon: 'bi-diagram-3', title: 'Clean, maintainable code', desc: 'Laravel conventions, clear structure and documentation so any developer can pick up the project later.' },
      { icon: 'bi-shield-lock', title: 'Security by default', desc: 'Validation, authorisation policies, CSRF protection and secure handling of data built in from day one.' },
      { icon: 'bi-graph-up', title: 'Built to scale', desc: 'Queues, caching and optimised queries keep your application fast as traffic and data grow.' },
      { icon: 'bi-collection', title: 'Real Laravel work to show', desc: 'Browse the Laravel applications we have shipped in our project showcase before you decide.' },
    ],
  },
  faq: {
    heading: 'Laravel Development FAQ',
    subheading: 'Answers to common questions about our Laravel services.',
    items: [
      { q: 'What kind of projects do you build with Laravel?', a: 'Business websites, customer and partner portals, admin dashboards, booking and management systems, e-commerce back-ends, and APIs for mobile and single-page apps.' },
      { q: 'Can you take over or upgrade an existing Laravel project?', a: 'Yes. We start with a code review, then upgrade the Laravel version, fix bugs, improve performance and add tests so ongoing development becomes safer and faster.' },
      { q: 'Do you build the frontend as well?', a: 'Yes. Depending on the project we use Blade, Livewire, or Inertia with Vue or React, and we can also build a separate Next.js frontend that talks to a Laravel API.' },
      { q: 'Which payment gateways can you integrate?', a: 'We integrate Stripe, PayPal and local gateways such as SSLCommerz and bKash, along with subscriptions, invoices and webhooks where needed.' },
      { q: 'Do you provide hosting and maintenance after launch?', a: 'We set up reliable hosting and deployment pipelines and offer ongoing maintenance, monitoring, security updates and feature development.' },
    ],
  },
  cta: {
    heading: 'Let’s build your Laravel application',
    subheading: 'Share what you have in mind — we’ll come back with a clear plan, timeline and quote.',
    btn_text: 'Get a Free Quote',
    btn_url: '/contact',
  },
};

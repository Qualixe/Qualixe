import type { ShopifyServicePage } from '../../../../../lib/api/shopify-service';

export const CONTENT: ShopifyServicePage = {
  hero: {
    badge: 'Web App Development',
    heading: 'Node.js & Next.js Web App Development',
    subheading:
      'We build fast, modern web applications with Node.js, Next.js and React — from MVPs that validate an idea to production platforms that serve real customers. Server-rendered pages for SEO, real-time features, clean APIs and a TypeScript codebase that stays easy to evolve.',
    highlights: [
      'Next.js & React Frontends',
      'Node.js APIs & Back-ends',
      'TypeScript End to End',
      'Real-Time Features',
      'SEO-Friendly Server Rendering',
      'Cloud Deployment & CI/CD',
    ],
    cta_text: 'Start Your Web App',
    cta_url: '/contact',
  },
  services: {
    heading: 'Web Application Development Services',
    subheading: 'Full-stack JavaScript and TypeScript development for products that need to move fast.',
    items: [
      { icon: 'bi-window-stack', title: 'Next.js Applications', desc: 'Fast, SEO-friendly web apps and marketing sites using the Next.js App Router, server components and static or server rendering where each makes sense.' },
      { icon: 'bi-hdd-network', title: 'Node.js Back-ends & APIs', desc: 'Scalable REST and GraphQL APIs with Node.js, Express or NestJS — authentication, validation, background jobs and solid error handling included.' },
      { icon: 'bi-rocket-takeoff', title: 'MVP Development', desc: 'Launch a focused first version quickly to test your idea with real users, built on foundations that can grow into a full product.' },
      { icon: 'bi-broadcast', title: 'Real-Time Features', desc: 'Live dashboards, chat, notifications and collaborative features using WebSockets and event-driven architecture.' },
      { icon: 'bi-database', title: 'Databases & Integrations', desc: 'PostgreSQL, MySQL, MongoDB and Supabase data models, plus integrations with payment, email, CRM and third-party APIs.' },
      { icon: 'bi-cloud-upload', title: 'Deployment & DevOps', desc: 'CI/CD pipelines, preview environments and cloud hosting on Vercel, AWS or DigitalOcean, with monitoring and backups.' },
    ],
  },
  process: {
    heading: 'How We Build Web Apps',
    subheading: 'Short iterations, working software early, and no surprises.',
    items: [
      { title: 'Discovery', desc: 'We clarify the problem, users and must-have features, and turn them into a prioritised roadmap.' },
      { title: 'Architecture & UX', desc: 'We choose the right stack, design the data model and APIs, and wireframe the key user flows.' },
      { title: 'Iterative Development', desc: 'We build in short sprints with preview deployments so you can click through progress every week.' },
      { title: 'Testing & QA', desc: 'Automated tests and manual QA across browsers and devices keep releases stable.' },
      { title: 'Launch', desc: 'We deploy to production with monitoring, error tracking and analytics in place from day one.' },
      { title: 'Iterate & Scale', desc: 'We help you learn from real usage, add features and scale the infrastructure as you grow.' },
    ],
  },
  why_us: {
    heading: 'Why Build Your Web App With Qualixe',
    subheading: 'Modern engineering with a product mindset.',
    items: [
      { icon: 'bi-filetype-tsx', title: 'Modern, typed stack', desc: 'TypeScript, Next.js and Node.js give you a fast, reliable codebase that is easy to hire for and extend.' },
      { icon: 'bi-search', title: 'SEO & performance built in', desc: 'Server rendering, optimised images and Core Web Vitals in mind — important for any public-facing product.' },
      { icon: 'bi-lightbulb', title: 'Product thinking', desc: 'We challenge assumptions and suggest simpler ways to reach your goal, not just write code to a spec.' },
      { icon: 'bi-people', title: 'One team, full stack', desc: 'Frontend, back-end and deployment handled together, so nothing falls between the cracks.' },
    ],
  },
  faq: {
    heading: 'Web App Development FAQ',
    subheading: 'Common questions about Node.js and Next.js projects.',
    items: [
      { q: 'Why choose Next.js for a web application?', a: 'Next.js combines React with server rendering, routing and performance optimisations out of the box. Pages load fast, are easy for search engines to index, and the same codebase can serve both marketing pages and the logged-in app.' },
      { q: 'Can you build both the frontend and the back-end?', a: 'Yes. We build Next.js or React frontends and Node.js back-ends and APIs, and we can also pair a Next.js frontend with a Laravel API if that suits your team.' },
      { q: 'How fast can you build an MVP?', a: 'It depends on scope. We help you trim the first version to the features that prove your idea, then agree a realistic timeline before development starts.' },
      { q: 'Which databases and hosting do you use?', a: 'Typically PostgreSQL, MySQL, MongoDB or Supabase, hosted on Vercel, AWS or DigitalOcean — chosen based on your needs, budget and team.' },
      { q: 'Will we own the code?', a: 'Yes. You own the source code and infrastructure accounts, and we document the project so your team or another developer can work on it later.' },
    ],
  },
  cta: {
    heading: 'Ready to build your web app?',
    subheading: 'Tell us about your idea — we’ll help you shape the first release and plan the build.',
    btn_text: 'Get a Free Quote',
    btn_url: '/contact',
  },
};

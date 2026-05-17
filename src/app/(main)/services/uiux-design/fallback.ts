import type { UiUxPage } from '../../../../../lib/api/uiux-service';

export const FALLBACK: UiUxPage = {
  hero: {
    badge: 'UI/UX Design',
    heading: 'Design Experiences People Love to Use',
    subheading: "We design websites, apps, and digital products that are beautiful, intuitive, and built around your users. Great design isn't just how it looks — it's how it works.",
    cta_text: 'Start a Design Project',
    cta_url: '/contact',
  },
  services: {
    heading: 'UI/UX Design Services',
    subheading: 'From research to pixel-perfect handoff — we cover the full design process.',
    items: [
      { icon: 'bi-layout-text-window', title: 'Website UI Design', desc: 'We design clean, modern, and conversion-focused website interfaces that reflect your brand and guide users toward action.' },
      { icon: 'bi-phone', title: 'Mobile App Design', desc: 'We create intuitive mobile app interfaces for iOS and Android — designed for usability, accessibility, and delight.' },
      { icon: 'bi-vector-pen', title: 'Brand Identity & Visual Design', desc: 'From logos to full brand systems — we craft visual identities that are consistent, memorable, and built to last.' },
      { icon: 'bi-diagram-3', title: 'UX Research & Wireframing', desc: 'Before any pixel is placed, we map user journeys, create wireframes, and validate ideas — so the final design solves real problems.' },
      { icon: 'bi-window-stack', title: 'Prototyping & User Testing', desc: 'We build interactive prototypes and test them with real users to catch issues early and refine the experience before development.' },
      { icon: 'bi-arrow-repeat', title: 'Design System Creation', desc: 'We build scalable design systems with reusable components, typography, and color guidelines — so your product stays consistent as it grows.' },
    ],
  },
  process: {
    heading: 'Our Design Process',
    subheading: 'A structured, collaborative process that delivers great design every time.',
    items: [
      { title: 'Discovery & Research', desc: 'We learn about your users, business goals, and competitors. This shapes every design decision we make.' },
      { title: 'Information Architecture', desc: 'We map out the structure and user flows — ensuring the product is logical, intuitive, and easy to navigate.' },
      { title: 'Wireframing', desc: 'Low-fidelity wireframes let us explore layouts and interactions quickly before committing to visual design.' },
      { title: 'Visual Design', desc: 'We apply your brand identity to create high-fidelity designs that are polished, accessible, and on-brand.' },
      { title: 'Prototyping & Testing', desc: 'Interactive prototypes are tested with real users. Feedback is incorporated before handoff to development.' },
      { title: 'Developer Handoff', desc: 'We deliver production-ready design files with specs, assets, and documentation so developers can build with confidence.' },
    ],
  },
  why_us: {
    heading: 'Why Choose Qualixe?',
    subheading: 'We design with purpose — every pixel has a reason.',
    items: [
      { icon: 'bi-eye', title: 'User-Centered Design', desc: 'Every design decision is grounded in user research and real behavior — not assumptions.' },
      { icon: 'bi-brush', title: 'Pixel-Perfect Execution', desc: 'We obsess over the details. Every spacing, color, and interaction is intentional.' },
      { icon: 'bi-universal-access', title: 'Accessibility First', desc: 'We design for everyone — following WCAG guidelines to ensure your product is inclusive.' },
      { icon: 'bi-lightning', title: 'Fast Iterations', desc: "We work in short cycles with frequent feedback so you're never waiting long to see progress." },
      { icon: 'bi-code-slash', title: 'Dev-Ready Deliverables', desc: 'Our designs come with full specs and assets so developers can build exactly what was designed.' },
      { icon: 'bi-chat-dots', title: 'Collaborative Process', desc: "You're involved at every stage. We design with you, not just for you." },
    ],
  },
  faq: {
    heading: 'Frequently Asked Questions',
    subheading: 'Common questions about our UI/UX design services.',
    items: [
      { q: 'What tools do you use for design?', a: 'We primarily use Figma for UI/UX design, prototyping, and design systems. We also use Adobe Illustrator and Photoshop for brand and visual work.' },
      { q: 'Do you also handle development?', a: 'Yes. We offer full-stack development alongside our design services. We can take your project from wireframe to live product.' },
      { q: 'How many design revisions are included?', a: 'We include up to 3 rounds of revisions per design phase. Additional revisions can be arranged if needed.' },
      { q: 'Can you redesign my existing website or app?', a: 'Absolutely. We start with a UX audit of your current product, identify pain points, and redesign with a focus on improving usability and conversions.' },
      { q: 'How long does a typical UI/UX project take?', a: 'A website UI design project typically takes 3–6 weeks. App design projects range from 6–12 weeks depending on complexity.' },
    ],
  },
  cta: {
    heading: "Let's Design Something Great Together",
    subheading: "Tell us about your project and we'll get back to you within 24 hours.",
    btn_text: 'Get in Touch',
    btn_url: '/contact',
  },
};

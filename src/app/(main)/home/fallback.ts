import type { HomePage } from '../../../../lib/api/home-page';

export const FALLBACK: HomePage = {
  hero: {
    badge: '🚀 Shopify & E-Commerce Experts',
    heading_line1: 'We Build Shopify Stores',
    heading_line2: 'That Actually Sell',
    description: 'From custom theme development to full-stack e-commerce solutions — Qualixe helps brands in Bangladesh and worldwide launch stores that convert visitors into customers.',
    cta_primary_text: 'Get a Free Quote',
    cta_primary_url: '/contact',
    cta_secondary_text: 'View Our Work',
    cta_secondary_url: '/portfolio',
    proof: [
      { value: '50+', label: 'Stores Built' },
      { value: '100%', label: 'Client Satisfaction' },
      { value: '4.9★', label: 'Avg Rating' },
    ],
    float_top: '⚡ Shopify Expert',
    float_bottom: '✅ 4–8 Week Delivery',
  },
  about: {
    label: 'About Us',
    heading: 'We Build E-Commerce Stores\nThat Drive Real Revenue',
    description: "Qualixe is a dedicated Shopify development agency based in Bangladesh, serving brands worldwide. We combine creative design, technical expertise, and conversion-focused strategy to build online stores that don't just look great — they sell.",
    cta_text: 'Learn More About Us →',
    cta_url: '/about',
    stats: [
      { value: '50+', label: 'Stores Built' },
      { value: '5+', label: 'Years Experience' },
      { value: '98%', label: 'Client Retention' },
    ],
    reasons: [
      { icon: '🎯', text: 'Client satisfaction is our #1 goal' },
      { icon: '🧠', text: 'Talented team of Shopify specialists' },
      { icon: '⚡', text: 'Fast delivery without cutting corners' },
      { icon: '🔒', text: 'Transparent pricing, no hidden fees' },
    ],
  },
  services: {
    label: 'What We Do',
    heading: 'Services Built for Growth',
    subheading: 'Everything you need to launch, grow, and scale your online business.',
    items: [
      { icon: '🛍️', heading: 'Shopify Development', content: 'Custom Shopify stores built from scratch — tailored to your brand, optimized for conversions, and delivered fast. From theme design to full-stack integrations.', href: '/services/shopify-development', color: '#eef2ff', accent: '#0c3cc3' },
      { icon: '📣', heading: 'Digital Marketing', content: 'Data-driven SEO, paid ads, and social media campaigns that drive real traffic and revenue. We treat your budget like our own.', href: '/services/digital-marketing', color: '#f0fdf4', accent: '#16a34a' },
      { icon: '🎨', heading: 'UI/UX Design', content: 'Beautiful, intuitive interfaces designed around your users. From wireframes to pixel-perfect handoff — we design experiences people love.', href: '/services/uiux-design', color: '#fff7ed', accent: '#ea580c' },
    ],
  },
};

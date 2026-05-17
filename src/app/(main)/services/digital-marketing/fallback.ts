import type { DigitalMarketingPage } from '../../../../../lib/api/digital-marketing-service';

export const FALLBACK: DigitalMarketingPage = {
  hero: {
    badge: 'Digital Marketing',
    heading: 'Grow Your Brand Online With Strategies That Work',
    subheading: 'From SEO to paid ads and social media — we build and execute digital marketing strategies that drive real traffic, real leads, and real revenue.',
    cta_text: 'Get a Free Strategy Call',
    cta_url: '/contact',
  },
  services: {
    heading: 'Digital Marketing Services',
    subheading: 'Full-funnel marketing to attract, engage, and convert your audience.',
    items: [
      { icon: 'bi-search', title: 'Search Engine Optimization (SEO)', desc: 'We improve your organic rankings with technical SEO, on-page optimization, and content strategy — driving consistent, long-term traffic to your site.' },
      { icon: 'bi-meta', title: 'Social Media Marketing', desc: 'We create and manage social media campaigns on Facebook, Instagram, TikTok, and LinkedIn that build your brand and drive real engagement.' },
      { icon: 'bi-cursor', title: 'Pay-Per-Click Advertising (PPC)', desc: 'We run targeted Google Ads and Meta Ads campaigns that put your brand in front of the right people at the right time — maximizing your ROI.' },
      { icon: 'bi-envelope-paper', title: 'Email Marketing', desc: 'From welcome sequences to abandoned cart flows, we build automated email campaigns that nurture leads and drive repeat purchases.' },
      { icon: 'bi-bar-chart-line', title: 'Analytics & Reporting', desc: "We track every campaign with detailed reporting so you always know what's working, what's not, and where to invest next." },
      { icon: 'bi-pencil-square', title: 'Content Marketing', desc: 'We create blog posts, landing pages, and ad copy that attract, engage, and convert your target audience.' },
    ],
  },
  process: {
    heading: 'Our Marketing Process',
    subheading: 'A structured approach that turns your marketing budget into measurable growth.',
    items: [
      { title: 'Audit & Research', desc: 'We start with a full audit of your current digital presence, competitors, and target audience to identify the biggest opportunities.' },
      { title: 'Strategy Development', desc: 'We build a custom marketing strategy with clear goals, channels, budgets, and KPIs tailored to your business.' },
      { title: 'Campaign Setup', desc: 'We set up all campaigns, tracking pixels, analytics, and automation flows before going live.' },
      { title: 'Launch & Monitor', desc: 'Campaigns go live and we monitor performance daily — adjusting bids, creatives, and targeting in real time.' },
      { title: 'Optimize & Scale', desc: "We continuously optimize based on data, doubling down on what works and cutting what doesn't." },
      { title: 'Monthly Reporting', desc: 'You receive a clear monthly report showing results, insights, and the plan for the next month.' },
    ],
  },
  why_us: {
    heading: 'Why Choose Qualixe?',
    subheading: "We treat your marketing budget like it's our own.",
    items: [
      { icon: 'bi-bullseye', title: 'Data-Driven Decisions', desc: 'Every strategy is backed by data, not guesswork. We track, measure, and optimize everything.' },
      { icon: 'bi-globe2', title: 'Multi-Channel Expertise', desc: 'We manage SEO, paid ads, social, and email — all under one roof for a consistent brand message.' },
      { icon: 'bi-currency-dollar', title: 'ROI Focused', desc: 'We care about your bottom line. Every campaign is optimized to deliver the best return on your investment.' },
      { icon: 'bi-people', title: 'Dedicated Team', desc: 'You get a dedicated team of specialists — not a generalist juggling 50 clients.' },
      { icon: 'bi-clock-history', title: 'Transparent Reporting', desc: 'No fluff. You get clear, honest reports that show exactly what your money is doing.' },
      { icon: 'bi-arrow-up-right-circle', title: 'Proven Results', desc: "We've helped brands grow their organic traffic, reduce ad spend, and increase conversions." },
    ],
  },
  faq: {
    heading: 'Frequently Asked Questions',
    subheading: 'Common questions about our digital marketing services.',
    items: [
      { q: 'How long before I see results from SEO?', a: 'SEO is a long-term strategy. Most clients start seeing meaningful improvements in 3–6 months, with significant growth by month 6–12.' },
      { q: "What's the minimum budget for paid ads?", a: 'We recommend a minimum ad spend of $500/month to get meaningful data. Our management fee is separate from your ad budget.' },
      { q: 'Do you work with small businesses?', a: 'Yes. We work with businesses of all sizes — from startups to established brands. We tailor our approach to your budget and goals.' },
      { q: 'Which social media platforms do you manage?', a: "We manage Facebook, Instagram, TikTok, LinkedIn, and X (Twitter). We'll recommend the right platforms based on your audience." },
      { q: 'How do you measure success?', a: 'We define KPIs at the start of every engagement — traffic, leads, conversions, ROAS — and report against them monthly.' },
    ],
  },
  cta: {
    heading: 'Ready to Grow Your Business?',
    subheading: "Let's build a marketing strategy that works for you. Free consultation, no commitment.",
    btn_text: 'Book a Free Call',
    btn_url: '/contact',
  },
};

import type { Metadata } from 'next';
import Image from 'next/image';
import {
  ArrowRight,
  Blocks,
  Bot,
  Check,
  ChevronDown,
  Code,
  Compass,
  ExternalLink,
  LifeBuoy,
  Megaphone,
  Palette,
  PenTool,
  Smartphone,
  Store,
  X,
} from 'lucide-react';

import QuoteForm from '../_components/QuoteForm';
import WhatsAppIcon from '../_components/WhatsAppIcon';
import {
  DELIVERY_WEEKS,
  LANDING_PATH,
  PORTFOLIO_PROJECTS,
  PRIVACY_POLICY_PATH,
  STARTING_PRICE,
  WHATSAPP_DISPLAY,
  whatsappUrl,
} from '../landing.config';

const TITLE = 'E-commerce Website Design & Development in Bangladesh | Qualixe';
const DESCRIPTION =
  'WordPress, Shopify বা Custom e-commerce website design ও development। সাথে Digital Marketing ও Automation। আজই quote নিন।';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: LANDING_PATH },
  openGraph: {
    type: 'website',
    siteName: 'Qualixe',
    locale: 'bn_BD',
    url: LANDING_PATH,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/images/og.png', width: 1200, height: 630, alt: 'Qualixe' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/images/og.png'],
  },
};

const TRUST_BADGES = ['Custom Design', 'Mobile-Friendly', 'Launch-এর পরেও Support'];

const PROBLEMS = [
  'প্রতিটা order-এর জন্য inbox-এ আলাদা করে কথা বলতে হয়',
  'Customer product খুঁজে পায় না, দাম জানতে message করে অপেক্ষা করে',
  'নিজের website না থাকায় brand-এর প্রতি বিশ্বাস কম তৈরি হয়',
  'Page-এর reach কমলে বা page-এ সমস্যা হলে পুরো business ঝুঁকিতে পড়ে',
];

const SERVICES = [
  {
    icon: Palette,
    title: 'E-commerce Website Design',
    text: 'আপনার brand-এর রং, style আর customer অনুযায়ী custom design। কোনো ready-made template না।',
  },
  {
    icon: Code,
    title: 'Website Development',
    text: 'WordPress (WooCommerce), Shopify বা Custom: fast, secure আর সব device-এ সুন্দর দেখায়।',
  },
  {
    icon: Store,
    title: 'Store Setup',
    text: 'Product upload, category, payment gateway, delivery charge, order management: launch-এর জন্য সব কিছু প্রস্তুত করে দিই।',
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    text: 'Website launch-এর পর Facebook, Instagram আর Google Ads দিয়ে আপনার store-এ customer নিয়ে আসি।',
  },
  {
    icon: Bot,
    title: 'Messenger ও WhatsApp Automation',
    text: 'Auto reply setup, যাতে customer-এর message দিন হোক বা রাত, সাথে সাথে উত্তর পায়।',
  },
];

const PLATFORMS = [
  {
    name: 'WordPress',
    sub: 'WooCommerce',
    audience: 'বেশিরভাগ ছোট ও মাঝারি business',
    benefit: 'Flexible, খরচ তুলনামূলক কম',
    monthly: 'শুধু hosting',
  },
  {
    name: 'Shopify',
    sub: null,
    audience: 'যারা সহজে নিজে store চালাতে চান',
    benefit: 'সহজ management, reliable',
    monthly: 'Shopify subscription',
  },
  {
    name: 'Custom',
    sub: null,
    audience: 'যাদের বিশেষ feature লাগবে',
    benefit: 'পুরোপুরি নিজের মতো করে বানানো',
    monthly: 'Hosting + maintenance',
  },
];

const REASONS = [
  {
    icon: PenTool,
    title: 'Custom Design',
    text: 'আপনার brand-এর জন্য আলাদা করে design, অন্যের copy না',
  },
  {
    icon: Compass,
    title: 'সঠিক Platform',
    text: 'আপনার budget আর দরকার বুঝে platform-এর পরামর্শ',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First',
    text: 'বেশিরভাগ customer phone থেকে আসে, তাই phone-এ সবচেয়ে ভালো দেখানোর মতো করে বানানো',
  },
  {
    icon: Blocks,
    title: 'Website + Marketing এক জায়গায়',
    text: 'আলাদা আলাদা agency খুঁজতে হবে না',
  },
  {
    icon: LifeBuoy,
    title: 'Launch-এর পরেও পাশে আছি',
    text: 'Support আর training দিই, যাতে নিজেই store চালাতে পারেন',
  },
];

const STEPS = [
  { title: 'আলোচনা', text: 'আপনার business আর দরকার বুঝি' },
  { title: 'Proposal', text: 'Platform, feature, সময় আর খরচ জানাই' },
  { title: 'Design', text: 'আপনার approval-এর জন্য design দেখাই' },
  { title: 'Development', text: 'Website তৈরি আর store setup করি' },
  { title: 'Launch ও Support', text: 'Website live করি আর ব্যবহার শেখাই' },
];

const FAQS = [
  {
    q: 'Website বানাতে কত দিন লাগে?',
    a: `Project-এর আকার অনুযায়ী সাধারণত ${DELIVERY_WEEKS} সপ্তাহ। Proposal-এ নির্দিষ্ট সময় জানিয়ে দেবো।`,
  },
  {
    q: 'আমি কি নিজে product যোগ করতে পারবো?',
    a: 'হ্যাঁ। Launch-এর পর আমরা training দিই, যাতে নিজেই product, order আর দাম manage করতে পারেন।',
  },
  {
    q: 'bKash, Nagad বা card payment নেওয়া যাবে?',
    a: 'হ্যাঁ, আপনার দরকার অনুযায়ী payment gateway setup করে দিই।',
  },
  {
    q: 'Domain আর hosting কি আপনারা দেবেন?',
    a: 'চাইলে আমরা ব্যবস্থা করে দিই, অথবা আপনার নিজের থাকলে সেটাতেই কাজ করি।',
  },
  {
    q: 'Launch-এর পর সমস্যা হলে?',
    a: 'Launch-এর পর নির্দিষ্ট সময় পর্যন্ত support দিই। পরে চাইলে maintenance package নিতে পারেন।',
  },
  {
    q: 'Website-এর পাশাপাশি marketing-ও করবেন?',
    a: 'হ্যাঁ। Facebook, Instagram আর Google Ads দিয়ে আপনার store-এ customer আনার কাজও আমরা করি।',
  },
];

function QuoteButton({ className = '' }: { className?: string }) {
  return (
    <a href="#quote-form" className={`lp-btn lp-btn--primary ${className}`}>
      Quote নিন
      <ArrowRight size={18} aria-hidden="true" />
    </a>
  );
}

function WhatsAppButton({
  location,
  label = 'WhatsApp করুন',
  className = '',
}: {
  location: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      data-wa={location}
      className={`lp-btn lp-btn--wa ${className}`}
    >
      <WhatsAppIcon size={18} />
      {label}
    </a>
  );
}

export default function EcommerceLandingPage() {
  return (
    <>
      {/* Sticky header */}
      <header className="lp-header">
        <div className="lp-container lp-header__inner">
          <a href="#top" className="lp-header__logo" aria-label="Qualixe">
            <Image src="/assets/img/logo.png" alt="Qualixe" width={123} height={32} priority />
          </a>
          <nav className="lp-header__actions" aria-label="Quick actions">
            <a href="#quote-form" className="lp-btn lp-btn--primary lp-btn--sm">
              Quote নিন
            </a>
            <WhatsAppButton location="header" label="WhatsApp" className="lp-btn--sm" />
          </nav>
        </div>
      </header>

      <main id="top">
        {/* 1. Hero */}
        <section className="lp-hero">
          <div className="lp-container lp-hero__grid">
            <div className="lp-hero__content">
              <h1 className="lp-hero__title">
                আপনার Brand-এর জন্য <span>
                  Professional <span>E-commerce</span> Website
                </span>
              </h1>
              <p className="lp-hero__sub">
                Custom design, fast performance আর sales-ready setup। WordPress, Shopify বা Custom:
                আপনার business-এর জন্য যেটা সঠিক, সেটাই আমরা বানাই।
              </p>
              <div className="lp-cta-row">
                <QuoteButton />
                <WhatsAppButton location="hero" />
              </div>
              <ul className="lp-badges">
                {TRUST_BADGES.map((badge) => (
                  <li key={badge}>
                    <span className="lp-tick" aria-hidden="true">
                      <Check size={12} strokeWidth={3.5} />
                    </span>
                    {badge}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lp-hero__media">
              <Image
                src="/images/hero-img.png"
                alt="Laptop আর phone-এ একটি e-commerce website"
                width={1200}
                height={900}
                priority
                sizes="(min-width: 960px) 560px, 100vw"
              />
            </div>
          </div>
        </section>

        {/* 2. Problem */}
        <section className="lp-section lp-section--alt">
          <div className="lp-container">
            <div className="lp-heading">
              <h2>শুধু Facebook page দিয়ে কি business বড় করা যায়?</h2>
              <p>Facebook page দিয়ে শুরু করা সহজ, কিন্তু business বড় হলে কিছু সমস্যা সামনে আসে:</p>
            </div>
            <ul className="lp-problems">
              {PROBLEMS.map((problem) => (
                <li key={problem} className="lp-card lp-problem">
                  <span className="lp-cross" aria-hidden="true">
                    <X size={16} strokeWidth={3} />
                  </span>
                  <p>{problem}</p>
                </li>
              ))}
            </ul>
            <p className="lp-highlight">
              নিজের website মানে নিজের platform, যেখানে নিয়ন্ত্রণ পুরোপুরি আপনার।
            </p>
          </div>
        </section>

        {/* 3. Services */}
        <section className="lp-section">
          <div className="lp-container">
            <div className="lp-heading">
              <h2>Our Services</h2>
            </div>
            <ul className="lp-services">
              {SERVICES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="lp-card lp-card--hover lp-service">
                  <span className="lp-icon" aria-hidden="true">
                    <Icon size={24} />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Platform comparison */}
        <section className="lp-section lp-section--alt">
          <div className="lp-container">
            <div className="lp-heading">
              <h2>আপনার Business-এর জন্য কোন Platform?</h2>
            </div>
            <ul className="lp-platforms">
              {PLATFORMS.map((platform) => (
                <li key={platform.name} className="lp-card lp-card--hover lp-platform">
                  <h3>
                    {platform.name}
                    {platform.sub && <small>{platform.sub}</small>}
                  </h3>
                  <dl>
                    <div>
                      <dt>কাদের জন্য</dt>
                      <dd>{platform.audience}</dd>
                    </div>
                    <div>
                      <dt>সুবিধা</dt>
                      <dd>{platform.benefit}</dd>
                    </div>
                    <div>
                      <dt>মাসিক খরচ</dt>
                      <dd>{platform.monthly}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
            <div className="lp-inline-cta">
              <p>
                কোনটা নেবেন বুঝতে পারছেন না? Form পূরণ করুন, আপনার business দেখে আমরা পরামর্শ দেবো।
              </p>
              <QuoteButton />
            </div>
          </div>
        </section>

        {/* 5. Portfolio */}
        {/* 7. Process */}
        <section className="lp-section">
          <div className="lp-container">
            <div className="lp-heading">
              <h2>Our Work Progress</h2>
            </div>
            <ol className="lp-steps">
              {STEPS.map((step, index) => (
                <li key={step.title} className="lp-step">
                  <span className="lp-step__num" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 6. Why Qualixe */}
        <section className="lp-section lp-section--alt">
          <div className="lp-container">
            <div className="lp-heading">
              <h2>কেন Qualixe বেছে নেবেন?</h2>
            </div>
            <ul className="lp-reasons">
              {REASONS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="lp-reason">
                  <span className="lp-icon" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7. Process */}

        {/* 8. Pricing hint */}
        

        {/* 9. Quote form */}
        <section className="lp-section" id="quote-form">
          <div className="lp-container">
            <div className="lp-heading">
              <h2>Get Your Project Quote</h2>
              <p>নিচের তথ্যগুলো দিন, ২৪ ঘণ্টার মধ্যে আমাদের team WhatsApp-এ যোগাযোগ করবে।</p>
            </div>
            <div className="lp-quote">
              <div className="lp-card lp-quote__form">
                <QuoteForm />
              </div>
              <aside className="lp-quote__aside">
                <span className="lp-quote__aside-icon" aria-hidden="true">
                  <WhatsAppIcon size={28} />
                </span>
                <h3>দ্রুত কথা বলতে চান?</h3>
                <WhatsAppButton location="form_side_panel" />
              </aside>
            </div>
          </div>
        </section>

        {/* 10. FAQ */}
        <section className="lp-section lp-section--alt">
          <div className="lp-container lp-container--narrow">
            <div className="lp-heading">
              <h2>FAQ</h2>
            </div>
            <div className="lp-faq">
              {FAQS.map((faq) => (
                <details key={faq.q} className="lp-faq__item">
                  <summary>
                    {faq.q}
                    <ChevronDown size={20} aria-hidden="true" />
                  </summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Final CTA */}
        <section className="lp-final">
          <div className="lp-container">
            <h2>আপনার Online Store শুরু করার এখনই সময়</h2>
            <p>Design থেকে launch, পুরোটাই আমরা handle করবো।</p>
            <div className="lp-cta-row lp-cta-row--center">
              <QuoteButton />
              <WhatsAppButton location="final_cta" />
            </div>
          </div>
        </section>
      </main>

      {/* 12. Footer */}
      <footer className="lp-footer">
        <div className="lp-container lp-footer__inner">
          <p>
            <strong>Qualixe:</strong> Build Smart. Scale Faster.
          </p>
          <ul>
            <li>
              <a href="https://www.qualixe.com">qualixe.com</a>
            </li>
            <li>
              WhatsApp:{' '}
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" data-wa="footer">
                {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a href={PRIVACY_POLICY_PATH}>Privacy Policy</a>
            </li>
          </ul>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        data-wa="floating"
        className="lp-wa-float"
        aria-label="WhatsApp করুন"
      >
        <WhatsAppIcon size={30} />
      </a>
    </>
  );
}

import type { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';

import TocScrollSpy from './TocScrollSpy';
import LandingFooter from '../_components/LandingFooter';
import LandingHeader from '../_components/LandingHeader';
import {
  LANDING_PATH,
  PRIVACY_ADDRESS,
  PRIVACY_EMAIL,
  PRIVACY_LAST_UPDATED,
  PRIVACY_POLICY_PATH,
  PRIVACY_WHATSAPP,
} from '../landing.config';

export const metadata: Metadata = {
  title: { absolute: 'Privacy Policy | Qualixe' },
  description: 'How Qualixe collects, uses and protects your information.',
  robots: { index: true, follow: true },
  alternates: { canonical: PRIVACY_POLICY_PATH },
  openGraph: {
    type: 'website',
    siteName: 'Qualixe',
    url: PRIVACY_POLICY_PATH,
    title: 'Privacy Policy | Qualixe',
    description: 'How Qualixe collects, uses and protects your information.',
  },
};

const SECTIONS = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'information-we-collect', title: 'Information We Collect' },
  { id: 'how-we-use-your-information', title: 'How We Use Your Information' },
  { id: 'how-we-share-your-information', title: 'How We Share Your Information' },
  { id: 'data-retention', title: 'Data Retention' },
  { id: 'cookies', title: 'Cookies and Tracking Technologies' },
  { id: 'data-security', title: 'Data Security' },
  { id: 'your-rights', title: 'Your Rights and Choices' },
  { id: 'third-party-links', title: 'Third-Party Links' },
  { id: 'childrens-privacy', title: "Children's Privacy" },
  { id: 'changes', title: 'Changes to This Privacy Policy' },
  { id: 'contact', title: 'Contact Us' },
];

// Config values still in [brackets] are unreplaced placeholders: print them
// as plain text instead of building a broken mailto:/wa.me link.
const isPlaceholder = (value: string) => value.startsWith('[');

function Email() {
  if (isPlaceholder(PRIVACY_EMAIL)) return <>{PRIVACY_EMAIL}</>;
  return <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>;
}

function WhatsApp() {
  if (isPlaceholder(PRIVACY_WHATSAPP)) return <>{PRIVACY_WHATSAPP}</>;
  return (
    <a
      href={`https://wa.me/${PRIVACY_WHATSAPP.replace(/\D/g, '')}`}
      target="_blank"
      rel="noopener noreferrer"
      data-wa="privacy"
    >
      {PRIVACY_WHATSAPP}
    </a>
  );
}

function Toc() {
  return (
    <ol>
      {SECTIONS.map((section, index) => (
        <li key={section.id}>
          <a href={`#${section.id}`}>
            {index + 1}. {section.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

function SectionHeading({ id }: { id: string }) {
  const index = SECTIONS.findIndex((section) => section.id === id);
  return (
    <h2>
      {index + 1}. {SECTIONS[index].title}
    </h2>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <LandingHeader homeHref={LANDING_PATH} quoteHref={`${LANDING_PATH}#quote-form`} />

      <main lang="en" className="lp-legal">
        <div className="lp-container lp-legal__grid">
          {/* Desktop: sticky sidebar */}
          <nav className="lp-legal__toc" aria-label="On this page">
            <p>On this page</p>
            <Toc />
            <TocScrollSpy />
          </nav>

          <article className="lp-legal__content">
            <header className="lp-legal__header">
              <h1>Privacy Policy</h1>
              <p>Last updated: {PRIVACY_LAST_UPDATED}</p>
            </header>

            {/* Mobile: collapsible contents */}
            <details className="lp-legal__contents">
              <summary>
                Contents
                <ChevronDown size={20} aria-hidden="true" />
              </summary>
              <nav aria-label="Contents">
                <Toc />
              </nav>
            </details>

            <p lang="bn" className="lp-legal__summary">
              <strong>সংক্ষেপে:</strong> আপনি আমাদের website-এর form, Facebook বা Google-এর ad form,
              অথবা WhatsApp-এর মাধ্যমে যে তথ্য দেন, তা আমরা শুধু আপনার সাথে যোগাযোগ করতে, quote ও
              service দিতে, এবং আমাদের service উন্নত করতে ব্যবহার করি। আমরা আপনার তথ্য বিক্রি করি না।
              যেকোনো সময় আপনার তথ্য দেখতে, ঠিক করতে বা মুছে ফেলতে বলতে পারেন: <Email />।
            </p>

            <section id="introduction">
              <SectionHeading id="introduction" />
              <p>
                Qualixe is
                an e-commerce design, development, and digital marketing agency based in Bangladesh.
                This Privacy Policy explains how we collect, use, share, and protect your personal
                information when you visit our website qualixe.com (the &quot;Website&quot;), submit
                a form, respond to our advertisements, or contact us through WhatsApp, Messenger,
                phone, or email.
              </p>
              <p>
                By using our Website or submitting your information to us, you agree to the
                practices described in this Privacy Policy.
              </p>
            </section>

            <section id="information-we-collect">
              <SectionHeading id="information-we-collect" />

              <h3>a) Information you provide to us</h3>
              <p>
                When you fill out a quote or contact form (on our Website or through Facebook,
                Instagram, or Google lead forms), we may collect:
              </p>
              <ul>
                <li>Your name</li>
                <li>Phone / WhatsApp number</li>
                <li>Email address (if provided)</li>
                <li>Business name</li>
                <li>Facebook page or website link</li>
                <li>Business type and the services you are interested in</li>
                <li>Preferred platform (e.g., WordPress, Shopify, Custom)</li>
                <li>Approximate budget and project timeline</li>
                <li>Any additional message or details you choose to share</li>
              </ul>

              <h3>b) Information from advertising platforms</h3>
              <p>
                If you submit a lead form on Facebook, Instagram, or Google, those platforms share
                the information you entered in that form with us. Your use of those platforms is
                also governed by their own privacy policies.
              </p>

              <h3>c) Information collected automatically</h3>
              <p>When you visit our Website, we and our partners may automatically collect:</p>
              <ul>
                <li>IP address, browser type, device type, and operating system</li>
                <li>Pages visited, time spent, and links clicked</li>
                <li>Referring website and campaign information (such as UTM parameters)</li>
                <li>
                  Cookie and similar tracking technology data (see <a href="#cookies">Section 6</a>)
                </li>
              </ul>

              <h3>d) Communications</h3>
              <p>
                If you contact us via WhatsApp, Messenger, phone, or email, we keep a record of that
                communication to respond to you and provide our services.
              </p>
            </section>

            <section id="how-we-use-your-information">
              <SectionHeading id="how-we-use-your-information" />
              <p>We use your information to:</p>
              <ul>
                <li>Respond to your inquiry and contact you about your project</li>
                <li>Prepare quotes, proposals, and service recommendations</li>
                <li>Provide, manage, and support the services you request</li>
                <li>
                  Send you service-related updates and, where you have agreed, information about our
                  services
                </li>
                <li>Measure and improve the performance of our Website and advertising campaigns</li>
                <li>Prevent fraud, spam, and misuse of our Website</li>
                <li>Comply with applicable legal obligations</li>
              </ul>
              <p>We do not sell your personal information.</p>
            </section>

            <section id="how-we-share-your-information">
              <SectionHeading id="how-we-share-your-information" />
              <p>We share your information only when necessary, with:</p>
              <ul>
                <li>
                  <strong>Service providers</strong> who help us operate our business, such as
                  website hosting, form and spreadsheet tools (e.g., Google Workspace), messaging
                  tools (e.g., WhatsApp Business), and analytics providers. They may use your
                  information only to provide services to us.
                </li>
                <li>
                  <strong>Advertising and analytics platforms</strong> such as Meta
                  (Facebook/Instagram) and Google, to measure and improve our ads (see{' '}
                  <a href="#cookies">Section 6</a>).
                </li>
                <li>
                  <strong>Legal authorities</strong>, when required by law or to protect our rights,
                  users, or the public.
                </li>
                <li>
                  <strong>Business transfers</strong>, if Qualixe is involved in a merger,
                  acquisition, or sale of assets, in which case your information may be transferred
                  as part of that transaction.
                </li>
              </ul>
            </section>

            <section id="data-retention">
              <SectionHeading id="data-retention" />
              <p>
                We keep your personal information only as long as needed for the purposes described
                in this policy, such as responding to your inquiry, providing our services,
                maintaining business records, or meeting legal requirements. Lead information that
                does not result in a project is reviewed periodically and deleted when no longer
                needed. You may ask us to delete your information at any time (see{' '}
                <a href="#your-rights">Section 8</a>).
              </p>
            </section>

            <section id="cookies">
              <SectionHeading id="cookies" />
              <p>Our Website uses cookies and similar technologies, including:</p>
              <ul>
                <li>
                  <strong>Google Analytics</strong> – to understand how visitors use our Website
                </li>
                <li>
                  <strong>Google Ads conversion tracking</strong> – to measure the results of our
                  Google and YouTube ads
                </li>
                <li>
                  <strong>Meta Pixel</strong> – to measure the results of our Facebook and Instagram
                  ads and to show relevant ads to people who have visited our Website
                </li>
              </ul>
              <p>
                These tools may collect information about your visit and use it according to their
                own privacy policies. You can control or delete cookies through your browser
                settings, and you can manage ad preferences through:
              </p>
              <ul>
                <li>
                  Google Ads Settings:{' '}
                  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
                    https://adssettings.google.com
                  </a>
                </li>
                <li>
                  Meta Ad Preferences:{' '}
                  <a
                    href="https://www.facebook.com/adpreferences"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.facebook.com/adpreferences
                  </a>
                </li>
              </ul>
              <p>Disabling cookies may affect how some parts of the Website work.</p>
            </section>

            <section id="data-security">
              <SectionHeading id="data-security" />
              <p>
                We take reasonable technical and organizational measures to protect your information
                from unauthorized access, loss, misuse, or alteration. Access to lead and client
                information is limited to team members who need it to do their work. However, no
                method of transmission over the internet or electronic storage is completely secure,
                and we cannot guarantee absolute security.
              </p>
            </section>

            <section id="your-rights">
              <SectionHeading id="your-rights" />
              <p>You can contact us at any time to:</p>
              <ul>
                <li>Ask what personal information we hold about you</li>
                <li>Correct or update your information</li>
                <li>Ask us to delete your information</li>
                <li>Opt out of receiving marketing messages from us</li>
              </ul>
              <p>
                To make a request, email us at <Email /> or message us on WhatsApp at <WhatsApp />.
                We will respond within a reasonable time.
              </p>
            </section>

            <section id="third-party-links">
              <SectionHeading id="third-party-links" />
              <p>
                Our Website may contain links to other websites, including demo and portfolio sites.
                We are not responsible for the privacy practices or content of those websites.
                Please review their privacy policies before providing any information.
              </p>
            </section>

            <section id="childrens-privacy">
              <SectionHeading id="childrens-privacy" />
              <p>
                Our services are intended for businesses and individuals aged 18 and above. We do
                not knowingly collect personal information from children. If you believe a child has
                provided us with personal information, please contact us and we will delete it.
              </p>
            </section>

            <section id="changes">
              <SectionHeading id="changes" />
              <p>
                We may update this Privacy Policy from time to time. When we do, we will change the
                &quot;Last updated&quot; date at the top of this page. We encourage you to review
                this page periodically.
              </p>
            </section>

            <section id="contact">
              <SectionHeading id="contact" />
              <p>
                If you have any questions about this Privacy Policy or how we handle your
                information, please contact us:
              </p>
              <address className="lp-card lp-legal__contact">
                <strong>Qualixe</strong>
                <dl>
                  <div>
                    <dt>Email</dt>
                    <dd>
                      <Email />
                    </dd>
                  </div>
                  <div>
                    <dt>WhatsApp</dt>
                    <dd>
                      <WhatsApp />
                    </dd>
                  </div>
                  <div>
                    <dt>Address</dt>
                    <dd>{PRIVACY_ADDRESS}</dd>
                  </div>
                  <div>
                    <dt>Website</dt>
                    <dd>
                      <a href="https://qualixe.com">https://qualixe.com</a>
                    </dd>
                  </div>
                </dl>
              </address>
            </section>
          </article>
        </div>
      </main>

      <LandingFooter />
    </>
  );
}

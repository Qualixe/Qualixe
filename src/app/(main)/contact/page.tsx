import CenteredHero from '../../../components/CenteredHero'
import './Contact.css'
import ContactForm from '../../../components/ContactForm';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us – Get in Touch with Qualixe',
  description: 'Have a project in mind? Contact Qualixe for Shopify development, Shopify apps, Laravel and Next.js web apps, SaaS products or digital marketing. We respond within 24 hours.',
  alternates: { canonical: 'https://www.qualixe.com/contact' },
  openGraph: {
    title: 'Contact Us – Get in Touch with Qualixe',
    description: 'Have a project in mind? Contact Qualixe — we respond within 24 hours.',
    url: 'https://www.qualixe.com/contact',
    images: [{ url: '/assets/img/web-logo.png', width: 1200, height: 630, alt: 'Contact Qualixe' }],
  },
}

const CHANNELS = [
  {
    icon: 'bi-whatsapp',
    label: 'WhatsApp',
    value: '+880 1318-552266',
    href: 'https://wa.me/8801318552266',
    external: true,
    tone: 'green',
  },
  {
    icon: 'bi-telephone',
    label: 'Phone',
    value: '+880 1318-552266',
    href: 'tel:+8801318552266',
    tone: 'blue',
  },
  {
    icon: 'bi-envelope',
    label: 'Email',
    value: 'qualixe.info@gmail.com',
    href: 'mailto:qualixe.info@gmail.com',
    tone: 'violet',
  },
  {
    icon: 'bi-geo-alt',
    label: 'Studio',
    value: 'House-06, Road-3, Mirpur-11, Dhaka, Bangladesh',
    href: 'https://www.google.com/maps/search/?api=1&query=House-06%2C+Road-3%2C+Mirpur-11%2C+Dhaka',
    external: true,
    tone: 'mint',
  },
];

const STEPS = [
  { title: 'We review your brief', text: 'We read your message and look at your business, store and goals.' },
  { title: 'Discovery call', text: 'A quick call to understand what you need and answer your questions.' },
  { title: 'Plan & quote', text: 'You get a clear plan, timeline and quote — no obligation.' },
];

function Contact() {
  return (
    <main className='page-contact'>
      <CenteredHero
        crumb="Contact"
        pill="Let's talk"
        title="Tell us about your project"
        accent="your project"
        subtitle="Share where your brand is headed and what you need — we'll come back with a plan, a timeline and a clear quote."
      >
        <div className='ct-quick'>
          <a href='https://wa.me/8801318552266' target='_blank' rel='noopener noreferrer' className='ct-quick__btn ct-quick__btn--wa'>
            <i className='bi bi-whatsapp' aria-hidden='true' /> Chat on WhatsApp
          </a>
          <a href='mailto:qualixe.info@gmail.com' className='ct-quick__btn'>
            <i className='bi bi-envelope' aria-hidden='true' /> qualixe.info@gmail.com
          </a>
          <a href='#ct-form' className='ct-quick__btn'>
            <i className='bi bi-arrow-down' aria-hidden='true' /> Fill in the form
          </a>
        </div>
      </CenteredHero>

      <section className='ct-section' aria-labelledby='ct-form-title'>
        <div className='container'>
          <div className='ct-layout'>
            {/* Info panel */}
            <aside className='ct-panel'>
              <div className='ct-panel__glow' aria-hidden='true' />
              <span className='ct-panel__eyebrow'>Get in touch</span>
              <h2 id='ct-form-title' className='ct-panel__title'>Let&apos;s build something that sells.</h2>
              <p className='ct-panel__text'>
                Fill in the form and we&apos;ll get back to you within 24 hours. Prefer to talk now? Reach us directly.
              </p>

              <ul className='ct-channels'>
                {CHANNELS.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      className='ct-channel'
                      {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <span className={`ct-channel__icon ct-channel__icon--${c.tone}`} aria-hidden='true'>
                        <i className={`bi ${c.icon}`} />
                      </span>
                      <span className='ct-channel__body'>
                        <span className='ct-channel__label'>{c.label}</span>
                        <span className='ct-channel__value'>{c.value}</span>
                      </span>
                      <i className='bi bi-arrow-up-right ct-channel__go' aria-hidden='true' />
                    </a>
                  </li>
                ))}
              </ul>

              <div className='ct-steps'>
                <span className='ct-steps__title'>What happens next</span>
                <ol>
                  {STEPS.map((s, i) => (
                    <li key={s.title}>
                      <span className='ct-steps__num' aria-hidden='true'>{i + 1}</span>
                      <div>
                        <strong>{s.title}</strong>
                        <p>{s.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            {/* Form */}
            <div className='ct-form' id='ct-form'>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact

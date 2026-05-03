import PageBanner from "@/components/PageBanner"
import Services from "../home/Service"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Services – Shopify, Digital Marketing & UI/UX Design | Qualixe',
  description: 'Explore Qualixe services — Shopify store development, digital marketing, UI/UX design, and e-commerce solutions tailored for growing brands.',
  alternates: { canonical: 'https://www.qualixe.com/services' },
  openGraph: {
    title: 'Our Services – Shopify, Digital Marketing & UI/UX Design | Qualixe',
    description: 'Shopify development, digital marketing, and UI/UX design for growing e-commerce brands.',
    url: 'https://www.qualixe.com/services',
    images: [{ url: '/assets/img/service-hero.jpg', width: 1200, height: 630, alt: 'Qualixe Services' }],
  },
}

function page() {
  return (
    <div className="page-services">
        <PageBanner heading="Services" />
        <div className="page-services-content">
            <Services />
        </div>
    </div>
  )
}

export default page
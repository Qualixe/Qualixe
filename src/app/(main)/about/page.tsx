import PageBanner from "@/components/PageBanner"
import About from "../home/About"
import ClientsGrid from "../home/Clients"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us – Qualixe | Shopify & E-Commerce Experts',
  description: 'Learn about Qualixe — a dedicated e-commerce development agency helping brands build high-converting Shopify stores and digital experiences.',
  alternates: { canonical: 'https://www.qualixe.com/about' },
  openGraph: {
    title: 'About Us – Qualixe | Shopify & E-Commerce Experts',
    description: 'Learn about Qualixe — a dedicated e-commerce development agency helping brands build high-converting Shopify stores.',
    url: 'https://www.qualixe.com/about',
    images: [{ url: '/assets/img/about.jpeg', width: 1200, height: 630, alt: 'About Qualixe' }],
  },
}

function page() {
  return (
    <div className="about-page">
      <PageBanner heading="About Us" />
      <div className="about-page-content">
       <About />
       <ClientsGrid />
      </div>
    </div>
  )
}

export default page
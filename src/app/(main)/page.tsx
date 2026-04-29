import Hero from './home/Hero'
import About from './home/About'
import Services from './home/Service'
import Portfolio from './home/Portfolio'
import ClientsGrid from './home/Clients'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Qualixe – Shopify Development & E-Commerce Solutions',
  description: 'Qualixe builds high-converting Shopify stores, custom e-commerce websites, free HTML templates, and digital marketing solutions for brands worldwide.',
  keywords: ['shopify development', 'ecommerce development', 'shopify store', 'digital marketing', 'ui ux design', 'qualixe bangladesh'],
  alternates: { canonical: 'https://www.qualixe.com' },
  openGraph: {
    title: 'Qualixe – Shopify Development & E-Commerce Solutions',
    description: 'High-converting Shopify stores, free HTML templates, and digital marketing for e-commerce brands.',
    url: 'https://www.qualixe.com',
    images: [{ url: '/assets/img/web-logo.png', width: 1200, height: 630, alt: 'Qualixe' }],
  },
}

function page() {
  return (
    <div>
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <ClientsGrid />
    </div>
  )
}

export default page
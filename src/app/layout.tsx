import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qualixe – Shopify Development & E-Commerce Solutions",
  description: "Qualixe builds high-converting Shopify stores, free HTML templates, and digital marketing solutions for e-commerce brands worldwide.",
  keywords: ["shopify development", "ecommerce development", "free html templates", "digital marketing", "ui ux design", "qualixe"],
  metadataBase: new URL("https://qualixe.com"),
  openGraph: {
    type: "website",
    siteName: "Qualixe",
    title: "Qualixe – Shopify Development & E-Commerce Solutions",
    description: "High-converting Shopify stores, free HTML templates, and digital marketing for e-commerce brands.",
    images: [{ url: "/assets/img/web-logo.png", width: 1200, height: 630, alt: "Qualixe" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qualixe – Shopify Development & E-Commerce Solutions",
    description: "High-converting Shopify stores, free HTML templates, and digital marketing for e-commerce brands.",
    images: ["/assets/img/web-logo.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

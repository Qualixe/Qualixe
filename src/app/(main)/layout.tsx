import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Ribon from "@/components/Ribon";
import WhatsAppChat from "@/components/WhatsAppChat";
import GoogleTagManager, { GoogleTagManagerNoScript } from "@/components/GoogleTagManager";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Qualixe',
    default: 'Qualixe – Shopify Development & E-Commerce Solutions',
  },
  description: 'Qualixe builds high-converting Shopify stores, free HTML templates, and digital marketing solutions for e-commerce brands worldwide.',
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX';

  return (
    <html lang="en">
      <head>
        <GoogleTagManager gtmId={gtmId} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <GoogleTagManagerNoScript gtmId={gtmId} />
        <AnalyticsTracker />
        <CartProvider>
          <Header />
          {children}
          <WhatsAppChat />
          <Ribon />
          <Footer />
        </CartProvider>

      </body>
    </html>
  );
}

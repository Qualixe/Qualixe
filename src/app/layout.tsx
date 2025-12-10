import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Ribon from "@/components/Ribon";
import WhatsAppChat from "@/components/WhatsAppChat";
import GoogleTagManager, { GoogleTagManagerNoScript } from "@/components/GoogleTagManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qualixe - IT Solutions & Services",
  description: "Qualixe is a leading IT solutions and services provider, offering innovative technology solutions to businesses worldwide.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleTagManagerNoScript gtmId={gtmId} />
        <Header />
        {children}
        <WhatsAppChat />
        <Ribon />
        <Footer />

      </body>
    </html>
  );
}

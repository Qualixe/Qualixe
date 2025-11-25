import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Ribon from "@/components/Ribon";
import WhatsAppChat from "@/components/WhatsAppChat";

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
  icons:{
    icon: '/favicon.ico',
  },
  description: "Qualixe is a leading IT solutions and services provider, offering innovative technology solutions to businesses worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <WhatsAppChat />
        <Ribon />
        <Footer />
        
      </body>
    </html>
  );
}

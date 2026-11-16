import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './auth.css';

export const metadata: Metadata = {
  title: "Admin Login | Qualixe",
  description: "Sign in to the Qualixe admin dashboard.",
  // Private admin entry point — keep it out of search results
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

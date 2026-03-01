import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './login.css';

export const metadata: Metadata = {
  title: "Login - Qualixe",
  description: "Login to Qualixe Dashboard",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

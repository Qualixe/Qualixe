import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../login/login.css';

export const metadata: Metadata = {
  title: "Sign Up - Qualixe",
  description: "Create your Qualixe account",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

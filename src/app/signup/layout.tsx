import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../login/auth.css';

export const metadata: Metadata = {
  title: "Create Account | Qualixe",
  description: "Create your Qualixe admin dashboard account.",
  // Private admin sign-up — keep it out of search results
  robots: { index: false, follow: false },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

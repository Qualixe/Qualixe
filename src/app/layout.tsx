import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qualixe",
  description: "Qualixe - IT Solutions & Services",
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

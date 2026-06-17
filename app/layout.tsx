import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Merkle Maturity Assessment",
  description:
    "Diagnostic workspace for Merkle's Modern CRM and Content Supply Chain maturity assessments.",
  openGraph: {
    title: "Merkle Maturity Assessment",
    description:
      "Diagnostic workspace for Merkle's Modern CRM and Content Supply Chain maturity assessments.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/*
          Work Sans – the Merkle Create default typeface (replaces Proxima
          Nova / Inter across all Merkle surfaces).
          Geist Mono – Merkle Create monospace, for code / technical text.
          Inter – retained only for the Dentsu DDS surface (.font-dentsu).
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Work+Sans:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

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
          Inter – Dentsu DDS body font + Merkle Proxima Nova fallback.
          Work Sans – Merkle M2 brand font (used on the tool shell).
          NOTE: Merkle's official artifact font is Proxima Nova (Adobe Fonts).
          Until an Adobe Typekit is configured the .font-merkle stack falls
          back to Inter via Tailwind theme.fontFamily.merkle.
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Work+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

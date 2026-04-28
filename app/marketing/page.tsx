"use client";

import { BrandedChatPage } from "@/components/chat/BrandedChatPage";
import type { BrandConfig } from "@/components/chat/BrandedChatPage";

const config: BrandConfig = {
  source: "marketing",
  // Marketing landing stays CRM-only by request; remove this line to
  // also offer CSC behind a picker.
  diagnostics: ["crm"],
  navBg: "#1a1a1a",
  navLogo: (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/dentsu-logo-white.png" alt="dentsu" className="h-7 w-auto" />
  ),
  navLabel: "CRM Maturity Diagnostic",
  introBg: "#1a1a1a",
  accentColor: "#8e24c6",
  ctaBg: "#1a1a1a",
  ctaText: "#ffffff",
  headline: (
    <>
      How Mature Is<br /><span className="font-semibold">Your CRM?</span>
    </>
  ),
  subheadline: "Have a conversation about your organization's CRM capabilities. In about 10 minutes, get a personalized maturity assessment with actionable insights and industry benchmarks.",
  steps: [
    { n: "01", text: "Describe your CRM environment" },
    { n: "02", text: "AI assesses 8 capability areas" },
    { n: "03", text: "Get benchmarked maturity scores" },
  ],
  footerLogo: (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/dentsu-logo.png" alt="dentsu" className="h-5 w-auto opacity-40" />
  ),
  footerText: `© ${new Date().getFullYear()} dentsu`,
  bodyBg: "#fafafa",
};

export default function MarketingPage() {
  return <BrandedChatPage config={config} />;
}

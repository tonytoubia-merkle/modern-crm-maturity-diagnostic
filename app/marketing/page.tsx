"use client";

import { BrandedChatPage } from "@/components/chat/BrandedChatPage";
import type { BrandConfig } from "@/components/chat/BrandedChatPage";

const config: BrandConfig = {
  source: "marketing",
  navBg: "#1a1a1a",
  navLogo: (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/dentsu-logo-white.png" alt="dentsu" className="h-7 w-auto" />
  ),
  navLabel: "Maturity Assessments",
  introBg: "#1a1a1a",
  accentColor: "#8e24c6",
  ctaBg: "#1a1a1a",
  ctaText: "#ffffff",
  headline: (
    <>
      How Mature Is<br />
      <span className="font-semibold">Your CX?</span>
    </>
  ),
  subheadline:
    "Pick a 10–15 minute diagnostic — an AI-led conversation about your CRM, or about your content supply chain. Either way you walk away with a maturity score, industry benchmarks, and the highest-impact opportunities.",
  steps: [
    { n: "01", text: "Pick your diagnostic — CRM or Content Supply Chain" },
    { n: "02", text: "AI assesses your capability areas in conversation" },
    { n: "03", text: "Get benchmarked maturity scores and opportunities" },
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

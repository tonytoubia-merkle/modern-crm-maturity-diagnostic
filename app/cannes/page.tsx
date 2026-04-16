"use client";

import { BrandedChatPage } from "@/components/chat/BrandedChatPage";
import type { BrandConfig } from "@/components/chat/BrandedChatPage";

// Cannes Lions gold: #C6992E / dentsu black
const config: BrandConfig = {
  source: "cannes",
  navBg: "#0a0a0a",
  navLogo: (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/dentsu-logo-white.png" alt="dentsu" className="h-5 w-auto" />
      <span className="text-white/30 text-xs">×</span>
      <span className="text-xs font-light tracking-widest uppercase" style={{ color: "#C6992E" }}>
        Cannes Lions
      </span>
    </div>
  ),
  navLabel: "",
  introBg: "#0a0a0a",
  accentColor: "#C6992E",
  ctaBg: "#0a0a0a",
  ctaText: "#ffffff",
  headline: (
    <>
      <span className="font-light" style={{ color: "#C6992E" }}>Cannes Lions 2025</span>
      <br />
      <span className="font-semibold" style={{ color: "#1a1a1a" }}>CRM Maturity Diagnostic</span>
    </>
  ),
  subheadline: "How mature is your CRM? Have a quick conversation with our AI consultant and discover where your organization stands across identity, engagement, decisioning, and more — powered by dentsu.",
  steps: [
    { n: "01", text: "Tell us about your CRM in your own words" },
    { n: "02", text: "AI maps your maturity across 8 dimensions" },
    { n: "03", text: "See how you compare to industry benchmarks" },
  ],
  footerLogo: (
    <div className="flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/dentsu-logo.png" alt="dentsu" className="h-4 w-auto opacity-40" />
      <span className="text-[10px] text-slate-400">at Cannes Lions 2025</span>
    </div>
  ),
  footerText: `© ${new Date().getFullYear()} dentsu`,
  bodyBg: "#fafafa",
  extraHero: (
    <div className="mb-8 flex items-center gap-2">
      <span className="text-2xl">🦁</span>
      <p className="text-xs text-slate-400 font-light">
        International Festival of Creativity · Cannes, France
      </p>
    </div>
  ),
};

export default function CannesPage() {
  return <BrandedChatPage config={config} />;
}

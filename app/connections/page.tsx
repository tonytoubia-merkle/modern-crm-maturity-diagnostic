"use client";

import { BrandedChatPage } from "@/components/chat/BrandedChatPage";
import type { BrandConfig } from "@/components/chat/BrandedChatPage";

// Merkle navy + Salesforce blue accent
const MERKLE_NAVY = "#00205B";
const SF_BLUE = "#00A1E0";

const config: BrandConfig = {
  source: "connections",
  navBg: MERKLE_NAVY,
  navLogo: (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/merkle-logo.webp" alt="Merkle" className="h-5 w-auto brightness-0 invert" />
      <span className="text-white/30 text-xs">+</span>
      {/* Salesforce cloud inline SVG */}
      <svg className="h-5 w-auto" viewBox="0 0 100 70" fill="none">
        <path d="M42.5 12C38.2 12 34.3 13.8 31.5 16.7C29.2 13.3 25.3 11 20.8 11C13.6 11 7.8 16.8 7.8 24C7.8 24.4 7.8 24.8 7.9 25.2C3.3 27 0 31.4 0 36.5C0 43.4 5.6 49 12.5 49H40.5C40.7 49 40.8 49 41 49C41.1 49 41.3 49 41.5 49H73C81.3 49 88 42.3 88 34C88 25.7 81.3 19 73 19C72.2 19 71.4 19.1 70.6 19.2C67.8 14.8 63 12 57.5 12C53.5 12 49.9 13.5 47.2 16C45.9 13.6 44.4 12 42.5 12Z" fill="white"/>
      </svg>
    </div>
  ),
  navLabel: "Connections 2025",
  introBg: MERKLE_NAVY,
  accentColor: SF_BLUE,
  ctaBg: MERKLE_NAVY,
  ctaText: "#ffffff",
  headline: (
    <>
      <span className="font-light" style={{ color: MERKLE_NAVY }}>Merkle at</span>
      <br />
      <span className="font-semibold" style={{ color: MERKLE_NAVY }}>Salesforce Connections</span>
    </>
  ),
  subheadline: "Discover your CRM maturity in a 10-minute conversation. Our AI consultant assesses your capabilities across identity, engagement, decisioning, and more — and shows you exactly where the biggest opportunities are.",
  steps: [
    { n: "01", text: "Have a conversation about your CRM" },
    { n: "02", text: "Get scored across 8 capability areas" },
    { n: "03", text: "See opportunities and benchmarks" },
  ],
  footerLogo: (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/merkle-logo.webp" alt="Merkle" className="h-4 w-auto" />
      <span className="text-[10px] text-slate-400">at Salesforce Connections 2025</span>
    </div>
  ),
  footerText: `© ${new Date().getFullYear()} Merkle, a dentsu company`,
  bodyBg: "#f0f7ff",
  extraHero: (
    <div className="mb-8 p-4 rounded-xl border" style={{ backgroundColor: "#f0f7ff", borderColor: "#bfdbfe" }}>
      <div className="flex items-center gap-4">
        {/* Astro-inspired character */}
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: SF_BLUE }}>
          🚀
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: MERKLE_NAVY }}>
            Powered by Merkle + Salesforce
          </p>
          <p className="text-xs text-slate-500 font-light">
            Connecting identity, engagement, and AI to drive the next era of CRM.
          </p>
        </div>
      </div>
    </div>
  ),
};

export default function ConnectionsPage() {
  return <BrandedChatPage config={config} />;
}

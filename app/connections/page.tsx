"use client";

import { BrandedChatPage } from "@/components/chat/BrandedChatPage";
import type { BrandConfig } from "@/components/chat/BrandedChatPage";

const MERKLE_NAVY = "#00205B";

const config: BrandConfig = {
  source: "connections",
  navBg: MERKLE_NAVY,
  navLogo: (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/merkle-logo.webp" alt="Merkle" className="h-5 w-auto brightness-0 invert" />
      <span className="text-white/20 text-xs">|</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Logo-Connections-2026.svg" alt="Salesforce Connections" className="h-3.5 w-auto" style={{ filter: "brightness(0) invert(1)" }} />
    </div>
  ),
  navLabel: "",
  introBg: MERKLE_NAVY,
  accentColor: "#00A1E0",
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
      <img src="/merkle-logo.webp" alt="Merkle" className="h-3.5 w-auto opacity-50" />
      <span className="text-slate-300 text-[10px]">+</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Salesforce-color-Logo-Vector.png" alt="Salesforce" className="h-4 w-auto opacity-50" />
    </div>
  ),
  footerText: `© ${new Date().getFullYear()} Merkle, a dentsu company`,
  bodyBg: "#f0f7ff",
  extraHero: (
    <div className="mb-8 p-5 rounded-xl border" style={{ backgroundColor: "#f0f7ff", borderColor: "#bfdbfe" }}>
      <div className="flex items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Salesforce-color-Logo-Vector.png" alt="Salesforce" className="h-10 w-auto" />
        <div>
          <p className="text-sm font-semibold" style={{ color: MERKLE_NAVY }}>
            Powered by Merkle + Salesforce
          </p>
          <p className="text-xs text-slate-500 font-light">
            Connecting identity, engagement, and AI to drive the next era of CRM.
          </p>
        </div>
      </div>
      {/* Connections logo below */}
      <div className="mt-4 pt-3 border-t border-blue-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Logo-Connections-2026.svg" alt="Salesforce Connections 2026" className="h-5 w-auto" />
      </div>
    </div>
  ),
};

export default function ConnectionsPage() {
  return <BrandedChatPage config={config} />;
}

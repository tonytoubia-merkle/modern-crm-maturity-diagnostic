"use client";

import { BrandedChatPage } from "@/components/chat/BrandedChatPage";
import type { BrandConfig } from "@/components/chat/BrandedChatPage";
import { MERKLE } from "@/lib/brand/tokens";

/**
 * /connections – Merkle's presence at Salesforce Connections.
 *
 * Brand blend: Salesforce Lightning Design System tokens for the
 * primary surfaces (CTAs, accents) co-branded with Merkle's ARC
 * deep-blue surface treatment. Type stack defaults to Inter, the
 * neutral substitute for both Salesforce Sans and Proxima Nova.
 *
 *   Salesforce Lightning Design System
 *     #032E61  brand dark         (header, hero ink)
 *     #0176D3  brand primary      (CTA, primary buttons)
 *     #1B96FF  brand accessible   (link / accent)
 *     #00A1E0  legacy "blue cloud" (decorative accent line)
 *
 *   Merkle ARC
 *     #141419  secondary-600       (Merkle co-brand mark color)
 *     #154734  brandGreen          (Merkle wordmark green, footer)
 */

// Salesforce Lightning palette
const SF_BRAND_DARK = "#032E61";
const SF_BRAND_PRIMARY = "#0176D3";
const SF_BLUE_CLOUD = "#00A1E0";

const config: BrandConfig = {
  source: "connections",
  navBg: SF_BRAND_DARK,
  navLogo: (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/merkle-logo.webp"
        alt="Merkle"
        className="h-7 w-auto brightness-0 invert"
      />
      <span className="text-white/20 text-xs">|</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Logo-Connections-2026.svg"
        alt="Salesforce Connections"
        className="h-5 w-auto"
        style={{ filter: "brightness(0) invert(1)" }}
      />
    </div>
  ),
  navLabel: "",
  introBg: SF_BRAND_DARK,
  accentColor: SF_BLUE_CLOUD,
  ctaBg: SF_BRAND_PRIMARY,
  ctaText: "#ffffff",
  headline: (
    <>
      <span className="font-light" style={{ color: SF_BRAND_DARK }}>
        Merkle at
      </span>
      <br />
      <span className="font-semibold" style={{ color: SF_BRAND_DARK }}>
        Salesforce Connections
      </span>
    </>
  ),
  subheadline:
    "Two ways to size up where you stand. Take an AI-led conversation about your CRM, or run our guided Content Supply Chain survey. Either way, you walk away with a maturity score, an opportunity map, and how you compare to industry benchmarks.",
  steps: [
    { n: "01", text: "Pick your diagnostic – CRM or Content Supply Chain" },
    { n: "02", text: "Get scored across the practice's capability areas" },
    { n: "03", text: "See opportunities and benchmarks" },
  ],
  footerLogo: (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/merkle-logo.webp"
        alt="Merkle"
        className="h-5 w-auto opacity-60"
      />
      <span className="text-slate-300 text-[10px]">+</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Salesforce-color-Logo-Vector.png"
        alt="Salesforce"
        className="h-6 w-auto opacity-60"
      />
    </div>
  ),
  footerText: `© ${new Date().getFullYear()} Merkle, a dentsu company`,
  bodyBg: "#ffffff",
  extraHero: (
    <div
      className="mb-8 p-5 rounded-xl border"
      style={{
        // soft Lightning blue tint
        backgroundColor: "#f3f9ff",
        borderColor: "#cfe5fb",
      }}
    >
      <div className="flex items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Salesforce-color-Logo-Vector.png"
          alt="Salesforce"
          className="h-10 w-auto"
        />
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: SF_BRAND_DARK }}
          >
            Powered by Merkle + Salesforce
          </p>
          <p className="text-xs text-slate-500 font-light">
            Connecting identity, engagement, and AI to drive the next era of CRM.
          </p>
        </div>
      </div>
      <div
        className="mt-4 pt-3 border-t"
        style={{ borderColor: "#cfe5fb" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Logo-Connections-2026.svg"
          alt="Salesforce Connections 2026"
          className="h-5 w-auto"
        />
        <p
          className="text-[10px] mt-2 font-medium uppercase tracking-wider"
          style={{ color: MERKLE.secondary600 }}
        >
          A Merkle co-presence
        </p>
      </div>
    </div>
  ),
};

export default function ConnectionsPage() {
  return <BrandedChatPage config={config} />;
}

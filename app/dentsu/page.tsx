"use client";

import { BrandedChatPage } from "@/components/chat/BrandedChatPage";
import type { BrandConfig } from "@/components/chat/BrandedChatPage";
import { DENTSU } from "@/lib/brand/tokens";

/**
 * /dentsu — dentsu Connect 3.0 / DDS Light theme.
 *
 * The "general dentsu" surface for events and inquiries that aren't
 * tied to a specific festival. Pure DDS Light treatment: Neutral
 * background, Neutral/1250 ink, DDS Blue for the accent line and
 * DDS Purple as the AI eyebrow tag (since this surface introduces an
 * AI conversation).
 */

const config: BrandConfig = {
  source: "dentsu",
  navBg: DENTSU.surfaceGlobalHeader, // #040406
  navLogo: (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/dentsu-logo-white.png"
        alt="dentsu"
        className="h-7 w-auto"
      />
    </div>
  ),
  navLabel: "",
  introBg: DENTSU.surfaceGlobalHeader,
  // DDS Blue for the thin accent line above the headline
  accentColor: DENTSU.fillAccent2, // #076cdf
  ctaBg: DENTSU.fillAccent1, // #0d0d11 — DDS primary brand mono
  ctaText: DENTSU.textOnDark,
  headline: (
    <>
      <span
        className="font-light"
        style={{ color: DENTSU.textSupportive }}
      >
        From dentsu
      </span>
      <br />
      <span
        className="font-semibold"
        style={{ color: DENTSU.textDefault }}
      >
        CRM Maturity Diagnostic
      </span>
    </>
  ),
  subheadline:
    "A 10-minute AI-led conversation that benchmarks your CRM across identity, engagement, decisioning, and more. Built by Merkle, the customer experience practice of dentsu — and grounded in real client engagements.",
  steps: [
    { n: "01", text: "Describe your CRM in your own words" },
    { n: "02", text: "AI maps maturity across 8 capability areas" },
    { n: "03", text: "Receive a benchmark and an opportunity map" },
  ],
  footerLogo: (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/dentsu-logo.png"
        alt="dentsu"
        className="h-5 w-auto opacity-50"
      />
      <span className="text-slate-300 text-[10px]">·</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/merkle-logo.webp"
        alt="Merkle"
        className="h-4 w-auto opacity-40"
      />
    </div>
  ),
  footerText: `© ${new Date().getFullYear()} dentsu · CRM by Merkle`,
  bodyBg: DENTSU.bgBase, // #f7f7f8
  extraHero: (
    <div
      className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{
        backgroundColor: "#f1eafd", // soft DDS Purple tint
        color: DENTSU.aiAccent,
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 2 L14 9 L21 11 L14 13 L12 20 L10 13 L3 11 L10 9 Z" />
      </svg>
      <span className="text-xs font-semibold uppercase tracking-wider">
        AI conversation
      </span>
    </div>
  ),
};

export default function DentsuPage() {
  return <BrandedChatPage config={config} />;
}

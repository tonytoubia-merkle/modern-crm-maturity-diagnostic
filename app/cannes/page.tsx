"use client";

import { BrandedChatPage } from "@/components/chat/BrandedChatPage";
import type { BrandConfig } from "@/components/chat/BrandedChatPage";
import { DENTSU } from "@/lib/brand/tokens";

/**
 * /cannes — dentsu's presence at Cannes Lions 2026.
 *
 * Brand: Dentsu Design System (DDS) Light theme. The navigation,
 * CTA, and hero ink default to DDS fillAccent1 (Neutral/1250 #0d0d11)
 * — the signature near-black mono. Cannes Lions gold (#C6992E)
 * remains as a festival accent on the eyebrow and decorative line.
 */

const CANNES_GOLD = "#C6992E";

const config: BrandConfig = {
  source: "cannes",
  navBg: DENTSU.surfaceGlobalHeader, // #040406 — DDS global header
  navLogo: (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/dentsu-logo-white.png"
        alt="dentsu"
        className="h-7 w-auto"
      />
      <span className="text-white/20 text-xs">|</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cannes-lions-icon-logo-transparent.png"
        alt="Cannes Lions"
        className="h-6 w-auto invert opacity-70"
      />
    </div>
  ),
  navLabel: "",
  introBg: DENTSU.surfaceGlobalHeader,
  accentColor: CANNES_GOLD,
  ctaBg: DENTSU.fillAccent1, // #0d0d11 — DDS primary brand mono
  ctaText: DENTSU.textOnDark,
  headline: (
    <>
      <span className="font-light" style={{ color: CANNES_GOLD }}>
        Cannes Lions 2026
      </span>
      <br />
      <span className="font-semibold" style={{ color: DENTSU.textDefault }}>
        How mature is your CX?
      </span>
    </>
  ),
  subheadline:
    "How mature is your customer experience? Pick a diagnostic — an AI-led CRM conversation, or a guided Content Supply Chain survey — and discover where your organization stands. Powered by dentsu.",
  steps: [
    { n: "01", text: "Pick your diagnostic — CRM or Content Supply Chain" },
    { n: "02", text: "Get scored across the practice's capability areas" },
    { n: "03", text: "See how you compare to industry benchmarks" },
  ],
  footerLogo: (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/dentsu-logo.png"
        alt="dentsu"
        className="h-5 w-auto opacity-40"
      />
      <span className="text-slate-300 text-[10px]">×</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cannes-lions-text-logo-transparent.png"
        alt="Cannes Lions"
        className="h-4 w-auto opacity-30"
      />
    </div>
  ),
  footerText: `© ${new Date().getFullYear()} dentsu`,
  bodyBg: DENTSU.bgBase, // #f7f7f8 — DDS Neutral/50
  extraHero: (
    <div className="mb-8 flex items-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cannes-lions-icon-logo-transparent.png"
        alt="Cannes Lions"
        className="h-8 w-auto opacity-10"
      />
      <p
        className="text-xs font-light"
        style={{ color: DENTSU.textSupportive }}
      >
        International Festival of Creativity · Cannes, France
      </p>
    </div>
  ),
};

export default function CannesPage() {
  return <BrandedChatPage config={config} />;
}

"use client";

import { useState } from "react";
import { VoiceChat } from "./VoiceChat";
import { CscVoiceChat } from "@/components/csc/chat/CscVoiceChat";
import { INDUSTRY_LABELS } from "@/lib/data/questions";
import { CSC_INDUSTRY_LABELS } from "@/lib/csc/data/questions";
import type { Industry } from "@/lib/types";
import type { CscIndustry } from "@/lib/csc/types";

/**
 * BrandedChatPage powers /connections, /dentsu, /cannes, /marketing.
 *
 * Each landing page passes a `BrandConfig` describing nav, hero, palette,
 * and source tag. The page itself runs a small state machine:
 *
 *   intro  → choose  → setup  →  chat (CRM)         (in-page voice)
 *                              \→  redirect (CSC)   (manual survey)
 *
 * If `diagnostics` lists both "crm" and "csc" (default), the user picks
 * one on the intro screen. If only one is listed, the picker is skipped
 * and the page goes straight from intro → setup. CRM today is the only
 * diagnostic with a conversational/voice flow; CSC routes the user to
 * the standard CSC manual assessment with the source tag preserved.
 */

type Diagnostic = "crm" | "csc";

export interface BrandConfig {
  source: string;
  navBg: string;
  navLogo: React.ReactNode;
  navLabel?: string;
  introBg: string;
  accentColor: string;
  ctaBg: string;
  ctaText: string;
  headline: React.ReactNode;
  subheadline: string;
  steps: Array<{ n: string; text: string }>;
  footerLogo: React.ReactNode;
  footerText: string;
  bodyBg: string;
  extraHero?: React.ReactNode;
  /** Which diagnostics this surface offers. Defaults to ["crm", "csc"]. */
  diagnostics?: Diagnostic[];
}

export function BrandedChatPage({ config }: { config: BrandConfig }) {
  const offered: Diagnostic[] = config.diagnostics ?? ["crm", "csc"];

  const [step, setStep] = useState<"intro" | "choose" | "setup" | "chat">(
    "intro"
  );
  const [diagnostic, setDiagnostic] = useState<Diagnostic>(offered[0] ?? "crm");
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState("");
  const [respondentName, setRespondentName] = useState("");
  const [crmIndustry, setCrmIndustry] = useState<Industry | "none" | "">("");
  const [cscIndustry, setCscIndustry] = useState<CscIndustry | "none" | "">("");
  const [loading, setLoading] = useState(false);

  const goToSetup = (d: Diagnostic) => {
    setDiagnostic(d);
    setStep("setup");
  };

  const handleStart = async () => {
    if (!orgName.trim()) return;
    setLoading(true);
    try {
      if (diagnostic === "crm") {
        const resolvedIndustry =
          crmIndustry === "none" || crmIndustry === "" ? null : crmIndustry;
        const res = await fetch("/api/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: orgName.trim(),
            clientCompany: resolvedIndustry
              ? INDUSTRY_LABELS[resolvedIndustry] || ""
              : "",
            respondentName: respondentName.trim() || "Participant",
            repEmail: "",
            isRepMode: false,
            industry: resolvedIndustry,
            source: config.source,
          }),
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setAssessmentId(data.id);
        setShareId(data.shareId);
        setStep("chat");
      } else {
        // CSC voice flow — create the assessment with the source tag,
        // then drop into the in-page CscVoiceChat (mirrors the CRM path).
        const resolvedIndustry =
          cscIndustry === "none" || cscIndustry === "" ? null : cscIndustry;
        const res = await fetch("/api/csc/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: orgName.trim(),
            clientCompany: resolvedIndustry
              ? CSC_INDUSTRY_LABELS[resolvedIndustry] || ""
              : "",
            respondentName: respondentName.trim() || "Participant",
            repEmail: "",
            isRepMode: false,
            industry: resolvedIndustry,
            source: config.source,
          }),
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setAssessmentId(data.id);
        setShareId(data.shareId);
        setStep("chat");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Chat (CRM voice or CSC voice) ────────────────────────────────
  if (step === "chat" && assessmentId && shareId) {
    return (
      <div className="h-screen flex flex-col">
        <div style={{ backgroundColor: config.navBg }}>
          <div className="max-w-full mx-auto px-4 py-2.5 flex items-center gap-3">
            {config.navLogo}
            {config.navLabel && (
              <span className="text-xs text-white/40 font-light">
                {config.navLabel}
              </span>
            )}
          </div>
        </div>
        {diagnostic === "crm" ? (
          <VoiceChat
            assessmentId={assessmentId}
            shareId={shareId}
            clientName={orgName}
            respondentName={respondentName || "Participant"}
            industry={
              crmIndustry === "none" || crmIndustry === ""
                ? null
                : (crmIndustry as Industry)
            }
            clientFacing
          />
        ) : (
          <CscVoiceChat
            assessmentId={assessmentId}
            shareId={shareId}
            clientName={orgName}
            respondentName={respondentName || "Participant"}
            industry={
              cscIndustry === "none" || cscIndustry === ""
                ? null
                : (cscIndustry as CscIndustry)
            }
            clientFacing
          />
        )}
      </div>
    );
  }

  // ── Intro ────────────────────────────────────────────────────────
  if (step === "intro") {
    const startCta = () => {
      if (offered.length === 1) goToSetup(offered[0]);
      else setStep("choose");
    };
    return (
      <PageShell config={config}>
        <div className="max-w-2xl mx-auto px-6 pt-20 pb-24">
          <div
            className="w-12 h-1 rounded-full mb-8"
            style={{ backgroundColor: config.accentColor }}
          />

          <h1
            className="text-5xl font-light tracking-tight leading-[1.1] mb-6"
            style={{ color: config.ctaBg }}
          >
            {config.headline}
          </h1>

          <p
            className="text-lg font-light leading-relaxed mb-10"
            style={{ color: "#555" }}
          >
            {config.subheadline}
          </p>

          {config.extraHero}

          <div className="grid grid-cols-3 gap-8 mb-12">
            {config.steps.map((s) => (
              <div key={s.n}>
                <p
                  className="text-xs font-semibold mb-1.5"
                  style={{ color: config.accentColor }}
                >
                  {s.n}
                </p>
                <p className="text-sm font-light" style={{ color: "#555" }}>
                  {s.text}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={startCta}
            className="px-8 py-3.5 text-sm font-medium rounded-lg transition-all hover:opacity-90"
            style={{ backgroundColor: config.ctaBg, color: config.ctaText }}
          >
            Get Started
          </button>

          <p className="text-xs mt-5 text-slate-400">
            No account required. Email only needed to view results.
          </p>
        </div>
      </PageShell>
    );
  }

  // ── Choose diagnostic ────────────────────────────────────────────
  if (step === "choose") {
    return (
      <PageShell config={config}>
        <div className="max-w-3xl mx-auto px-6 pt-16 pb-20">
          <div
            className="w-12 h-1 rounded-full mb-6"
            style={{ backgroundColor: config.accentColor }}
          />
          <h2
            className="text-3xl font-light tracking-tight mb-3"
            style={{ color: config.ctaBg }}
          >
            Which diagnostic would you like to take?
          </h2>
          <p
            className="text-base font-light leading-relaxed mb-10"
            style={{ color: "#555" }}
          >
            Two diagnostics live behind this surface. Pick the one that matches
            the conversation you came for — you can always come back for the
            other.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {offered.includes("crm") && (
              <DiagnosticCard
                eyebrow="Modern CRM Practice"
                title="Modern CRM Maturity"
                pace="~10 min · voice conversation"
                description="An AI consultant has a natural conversation with you across eight CRM capabilities — identity, signals, decisioning, engagement, and more. Scores are inferred from what you say."
                cta="Start CRM conversation"
                config={config}
                onClick={() => goToSetup("crm")}
                badge="Voice"
              />
            )}
            {offered.includes("csc") && (
              <DiagnosticCard
                eyebrow="Content Practice"
                title="Content Supply Chain"
                pace="~12 min · voice conversation"
                description="An AI consultant has a natural conversation with you about content strategy, production workflow, asset governance, distribution, measurement, and how AI is starting to fit in. Scores are inferred from what you say."
                cta="Start CSC conversation"
                config={config}
                onClick={() => goToSetup("csc")}
                badge="Voice"
              />
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  // ── Setup ─────────────────────────────────────────────────────
  const isCrm = diagnostic === "crm";
  const setupTitle = isCrm ? "Quick setup" : "Quick setup";
  const setupBlurb = isCrm
    ? "A couple of details before we begin the conversation."
    : "A couple of details before we begin the conversation.";
  const ctaLabel = isCrm ? "Start Conversation" : "Start Conversation";
  const industryEntries = isCrm
    ? (Object.entries(INDUSTRY_LABELS) as [string, string][])
    : (Object.entries(CSC_INDUSTRY_LABELS) as [string, string][]);
  const selectedIndustry: string = isCrm ? crmIndustry : cscIndustry;
  const setIndustry = (key: string) => {
    if (isCrm) {
      setCrmIndustry(
        crmIndustry === key ? "" : (key as Industry | "none" | "")
      );
    } else {
      setCscIndustry(
        cscIndustry === key ? "" : (key as CscIndustry | "none" | "")
      );
    }
  };

  return (
    <PageShell config={config}>
      <div className="max-w-md mx-auto px-6 pt-12 pb-20">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div
            className="w-8 h-0.5 rounded-full mb-4"
            style={{ backgroundColor: config.accentColor }}
          />
          {offered.length > 1 && (
            <button
              type="button"
              onClick={() => setStep("choose")}
              className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors mb-2"
            >
              ← Choose a different diagnostic
            </button>
          )}
          <h2
            className="text-xl font-semibold mb-1"
            style={{ color: config.ctaBg }}
          >
            {setupTitle}
          </h2>
          <p className="text-sm font-light mb-1 text-slate-500">{setupBlurb}</p>
          <p className="text-[11px] font-medium uppercase tracking-wider mb-4" style={{ color: config.accentColor }}>
            {isCrm ? "Modern CRM" : "Content Supply Chain"}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Organization
              </label>
              <input
                type="text"
                placeholder="Your company name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Your name{" "}
                <span className="font-light text-slate-400">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="First name is fine"
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
                className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Industry{" "}
                <span className="font-light text-slate-400">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {industryEntries.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIndustry(key)}
                    className="px-3 py-1.5 rounded-full border text-xs font-medium transition-all"
                    style={
                      selectedIndustry === key
                        ? {
                            borderColor: config.accentColor,
                            backgroundColor: `${config.accentColor}15`,
                            color: config.accentColor,
                          }
                        : { borderColor: "#e2e8f0", color: "#555" }
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleStart}
              disabled={!orgName.trim() || loading}
              className="w-full px-4 py-3 text-sm font-medium rounded-lg transition-all hover:opacity-90 disabled:opacity-30"
              style={{ backgroundColor: config.ctaBg, color: config.ctaText }}
            >
              {loading ? "Starting..." : ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// ── Helpers ────────────────────────────────────────────────────────

function PageShell({
  config,
  children,
}: {
  config: BrandConfig;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: config.bodyBg }}>
      <header style={{ backgroundColor: config.navBg }}>
        <div className="max-w-3xl mx-auto px-6 py-5">{config.navLogo}</div>
      </header>
      {children}
      <footer className="border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          {config.footerLogo}
          <p className="text-xs text-slate-400">{config.footerText}</p>
        </div>
      </footer>
    </div>
  );
}

function DiagnosticCard({
  eyebrow,
  title,
  pace,
  description,
  cta,
  badge,
  config,
  onClick,
}: {
  eyebrow: string;
  title: string;
  pace: string;
  description: string;
  cta: string;
  badge: string;
  config: BrandConfig;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-400 transition-colors group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <p
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: config.accentColor }}
        >
          {eyebrow}
        </p>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${config.accentColor}15`,
            color: config.accentColor,
          }}
        >
          {badge}
        </span>
      </div>
      <h3
        className="text-lg font-semibold mb-1"
        style={{ color: config.ctaBg }}
      >
        {title}
      </h3>
      <p className="text-xs text-slate-400 mb-3">{pace}</p>
      <p className="text-sm font-light text-slate-600 leading-relaxed mb-5">
        {description}
      </p>
      <span
        className="inline-flex items-center text-sm font-medium group-hover:gap-2 transition-all"
        style={{ color: config.ctaBg }}
      >
        {cta}
        <span className="ml-1.5 group-hover:translate-x-0.5 transition-transform">
          →
        </span>
      </span>
    </button>
  );
}

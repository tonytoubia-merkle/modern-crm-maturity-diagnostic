"use client";

import { useState } from "react";
import { VoiceChat } from "./VoiceChat";
import { CscVoiceChat } from "@/components/csc/chat/CscVoiceChat";
import { B2bVoiceChat } from "@/components/b2b/chat/B2bVoiceChat";
import { AicxVoiceChat } from "@/components/aicx/chat/AicxVoiceChat";
import { AientVoiceChat } from "@/components/aient/chat/AientVoiceChat";
import { INDUSTRY_LABELS } from "@/lib/data/questions";
import { CSC_INDUSTRY_LABELS } from "@/lib/csc/data/questions";
import { B2B_INDUSTRY_LABELS } from "@/lib/b2b/data/questions";
import { AICX_INDUSTRY_LABELS } from "@/lib/aicx/data/questions";
import { AIENT_INDUSTRY_LABELS } from "@/lib/aient/data/questions";
import type { Industry } from "@/lib/types";
import type { CscIndustry } from "@/lib/csc/types";
import type { B2bIndustry } from "@/lib/b2b/types";
import type { AicxIndustry } from "@/lib/aicx/types";
import type { AientIndustry } from "@/lib/aient/types";

/**
 * BrandedChatPage powers /connections, /dentsu, /cannes, /marketing.
 *
 * State machine: intro → choose → setup → chat (in-page voice for
 * whichever diagnostic the user selected).
 *
 * If `diagnostics` lists multiple, the picker shows on the intro
 * screen. If only one is listed, the picker is skipped.
 */

type Diagnostic = "crm" | "csc" | "b2b" | "aicx" | "aient";

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
  /** Which diagnostics this surface offers. Defaults to all five. */
  diagnostics?: Diagnostic[];
}

export function BrandedChatPage({ config }: { config: BrandConfig }) {
  const offered: Diagnostic[] =
    config.diagnostics ?? ["crm", "csc", "b2b", "aicx", "aient"];

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
  const [b2bIndustry, setB2bIndustry] = useState<B2bIndustry | "none" | "">("");
  const [aicxIndustry, setAicxIndustry] = useState<AicxIndustry | "none" | "">(
    ""
  );
  const [aientIndustry, setAientIndustry] = useState<
    AientIndustry | "none" | ""
  >("");
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
      } else if (diagnostic === "csc") {
        // CSC voice flow – create the assessment with the source tag,
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
      } else if (diagnostic === "b2b") {
        // B2B voice flow – same shape, against the B2B endpoint.
        const resolvedIndustry =
          b2bIndustry === "none" || b2bIndustry === "" ? null : b2bIndustry;
        const res = await fetch("/api/b2b/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: orgName.trim(),
            clientCompany: resolvedIndustry
              ? B2B_INDUSTRY_LABELS[resolvedIndustry] || ""
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
      } else if (diagnostic === "aicx") {
        const resolvedIndustry =
          aicxIndustry === "none" || aicxIndustry === ""
            ? null
            : aicxIndustry;
        const res = await fetch("/api/aicx/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: orgName.trim(),
            clientCompany: resolvedIndustry
              ? AICX_INDUSTRY_LABELS[resolvedIndustry] || ""
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
        const resolvedIndustry =
          aientIndustry === "none" || aientIndustry === ""
            ? null
            : aientIndustry;
        const res = await fetch("/api/aient/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: orgName.trim(),
            clientCompany: resolvedIndustry
              ? AIENT_INDUSTRY_LABELS[resolvedIndustry] || ""
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
        {diagnostic === "crm" && (
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
        )}
        {diagnostic === "csc" && (
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
        {diagnostic === "b2b" && (
          <B2bVoiceChat
            assessmentId={assessmentId}
            shareId={shareId}
            clientName={orgName}
            respondentName={respondentName || "Participant"}
            industry={
              b2bIndustry === "none" || b2bIndustry === ""
                ? null
                : (b2bIndustry as B2bIndustry)
            }
            clientFacing
          />
        )}
        {diagnostic === "aicx" && (
          <AicxVoiceChat
            assessmentId={assessmentId}
            shareId={shareId}
            clientName={orgName}
            respondentName={respondentName || "Participant"}
            industry={
              aicxIndustry === "none" || aicxIndustry === ""
                ? null
                : (aicxIndustry as AicxIndustry)
            }
            clientFacing
          />
        )}
        {diagnostic === "aient" && (
          <AientVoiceChat
            assessmentId={assessmentId}
            shareId={shareId}
            clientName={orgName}
            respondentName={respondentName || "Participant"}
            industry={
              aientIndustry === "none" || aientIndustry === ""
                ? null
                : (aientIndustry as AientIndustry)
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
            Five diagnostics live behind this surface. Pick the one that matches
            the conversation you came for – you can always come back for the
            others.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {offered.includes("crm") && (
              <DiagnosticCard
                eyebrow="Modern CRM Practice"
                title="Modern CRM Maturity"
                pace="~10 min · voice conversation"
                description="An AI consultant has a natural conversation with you across eight CRM capabilities – identity, signals, decisioning, engagement, and more. Scores are inferred from what you say."
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
                description="An AI consultant has a natural conversation with you about content strategy, production workflow, asset governance, distribution, measurement, and how AI is starting to fit in."
                cta="Start CSC conversation"
                config={config}
                onClick={() => goToSetup("csc")}
                badge="Voice"
              />
            )}
            {offered.includes("b2b") && (
              <DiagnosticCard
                eyebrow="B2B Transformation Practice"
                title="B2B Transformation"
                pace="~15 min · voice conversation"
                description="An AI consultant has a natural conversation with you about your account-based motion – vision, ABM, ABS, service & advocacy, operations & commerce, and the tech / data / AI foundation behind it."
                cta="Start B2B conversation"
                config={config}
                onClick={() => goToSetup("b2b")}
                badge="Voice"
              />
            )}
            {offered.includes("aicx") && (
              <DiagnosticCard
                eyebrow="AI for CX Practice"
                title="AI for CX"
                pace="~12 min · voice conversation"
                description="An AI consultant has a natural conversation with you about agentic discoverability, agentic experience, adaptive personalization, and how AI investment is measured today."
                cta="Start AI for CX conversation"
                config={config}
                onClick={() => goToSetup("aicx")}
                badge="Voice"
              />
            )}
            {offered.includes("aient") && (
              <DiagnosticCard
                eyebrow="AI for Enterprise Practice"
                title="AI for Enterprise"
                pace="~15 min · voice conversation"
                description="An AI consultant has a natural conversation with you about data foundations, work redesign, embedded intelligence, AI assurance, and how the enterprise is wiring AI into operations."
                cta="Start AI for Enterprise conversation"
                config={config}
                onClick={() => goToSetup("aient")}
                badge="Voice"
              />
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  // ── Setup ─────────────────────────────────────────────────────
  const setupTitle = "Quick setup";
  const setupBlurb = "A couple of details before we begin the conversation.";
  const ctaLabel = "Start Conversation";
  const industryEntries =
    diagnostic === "crm"
      ? (Object.entries(INDUSTRY_LABELS) as [string, string][])
      : diagnostic === "csc"
      ? (Object.entries(CSC_INDUSTRY_LABELS) as [string, string][])
      : diagnostic === "b2b"
      ? (Object.entries(B2B_INDUSTRY_LABELS) as [string, string][])
      : diagnostic === "aicx"
      ? (Object.entries(AICX_INDUSTRY_LABELS) as [string, string][])
      : (Object.entries(AIENT_INDUSTRY_LABELS) as [string, string][]);
  const selectedIndustry: string =
    diagnostic === "crm"
      ? crmIndustry
      : diagnostic === "csc"
      ? cscIndustry
      : diagnostic === "b2b"
      ? b2bIndustry
      : diagnostic === "aicx"
      ? aicxIndustry
      : aientIndustry;
  const setIndustry = (key: string) => {
    if (diagnostic === "crm") {
      setCrmIndustry(
        crmIndustry === key ? "" : (key as Industry | "none" | "")
      );
    } else if (diagnostic === "csc") {
      setCscIndustry(
        cscIndustry === key ? "" : (key as CscIndustry | "none" | "")
      );
    } else if (diagnostic === "b2b") {
      setB2bIndustry(
        b2bIndustry === key ? "" : (key as B2bIndustry | "none" | "")
      );
    } else if (diagnostic === "aicx") {
      setAicxIndustry(
        aicxIndustry === key ? "" : (key as AicxIndustry | "none" | "")
      );
    } else {
      setAientIndustry(
        aientIndustry === key ? "" : (key as AientIndustry | "none" | "")
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
            {diagnostic === "crm"
              ? "Modern CRM"
              : diagnostic === "csc"
              ? "Content Supply Chain"
              : diagnostic === "b2b"
              ? "B2B Transformation"
              : diagnostic === "aicx"
              ? "AI for CX"
              : "AI for Enterprise"}
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

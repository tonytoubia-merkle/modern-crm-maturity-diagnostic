"use client";

import { useState } from "react";
import { VoiceChat } from "./VoiceChat";
import { INDUSTRY_LABELS } from "@/lib/data/questions";
import type { Industry } from "@/lib/types";

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
}

export function BrandedChatPage({ config }: { config: BrandConfig }) {
  const [step, setStep] = useState<"intro" | "setup" | "chat">("intro");
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState("");
  const [respondentName, setRespondentName] = useState("");
  const [industry, setIndustry] = useState<Industry | "none" | "">("");
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!orgName.trim()) return;
    setLoading(true);
    try {
      const resolvedIndustry = industry === "none" || industry === "" ? null : industry;
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: orgName.trim(),
          clientCompany: resolvedIndustry ? INDUSTRY_LABELS[resolvedIndustry] || "" : "",
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
    } finally {
      setLoading(false);
    }
  };

  // Chat
  if (step === "chat" && assessmentId && shareId) {
    return (
      <div className="h-screen flex flex-col">
        <div style={{ backgroundColor: config.navBg }}>
          <div className="max-w-full mx-auto px-4 py-2.5 flex items-center gap-3">
            {config.navLogo}
            {config.navLabel && (
              <span className="text-xs text-white/40 font-light">{config.navLabel}</span>
            )}
          </div>
        </div>
        <VoiceChat
          assessmentId={assessmentId}
          shareId={shareId}
          clientName={orgName}
          respondentName={respondentName || "Participant"}
          industry={industry === "none" || industry === "" ? null : industry as Industry}
          clientFacing
        />
      </div>
    );
  }

  // Intro
  if (step === "intro") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: config.bodyBg }}>
        <header style={{ backgroundColor: config.navBg }}>
          <div className="max-w-3xl mx-auto px-6 py-5">
            {config.navLogo}
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 pt-20 pb-24">
          <div className="w-12 h-1 rounded-full mb-8" style={{ backgroundColor: config.accentColor }} />

          <h1 className="text-5xl font-light tracking-tight leading-[1.1] mb-6" style={{ color: config.ctaBg }}>
            {config.headline}
          </h1>

          <p className="text-lg font-light leading-relaxed mb-10" style={{ color: "#555" }}>
            {config.subheadline}
          </p>

          {config.extraHero}

          <div className="grid grid-cols-3 gap-8 mb-12">
            {config.steps.map((s) => (
              <div key={s.n}>
                <p className="text-xs font-semibold mb-1.5" style={{ color: config.accentColor }}>{s.n}</p>
                <p className="text-sm font-light" style={{ color: "#555" }}>{s.text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep("setup")}
            className="px-8 py-3.5 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90"
            style={{ backgroundColor: config.ctaBg, color: config.ctaText }}
          >
            Get Started
          </button>

          <p className="text-xs mt-5 text-slate-400">
            No account required. Email only needed to view results.
          </p>
        </div>

        <footer className="border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
            {config.footerLogo}
            <p className="text-xs text-slate-400">{config.footerText}</p>
          </div>
        </footer>
      </div>
    );
  }

  // Setup
  return (
    <div className="min-h-screen" style={{ backgroundColor: config.bodyBg }}>
      <header style={{ backgroundColor: config.navBg }}>
        <div className="max-w-3xl mx-auto px-6 py-5">
          {config.navLogo}
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 pt-12 pb-20">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="w-8 h-0.5 rounded-full mb-4" style={{ backgroundColor: config.accentColor }} />
          <h2 className="text-xl font-semibold mb-1" style={{ color: config.ctaBg }}>Quick setup</h2>
          <p className="text-sm font-light mb-5 text-slate-500">A couple of details before we begin.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Organization</label>
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
                Your name <span className="font-light text-slate-400">(optional)</span>
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
                Industry <span className="font-light text-slate-400">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.entries(INDUSTRY_LABELS) as [Industry, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIndustry(industry === key ? "" : key)}
                    className="px-3 py-1.5 rounded-full border text-xs font-medium transition-all"
                    style={
                      industry === key
                        ? { borderColor: config.accentColor, backgroundColor: `${config.accentColor}15`, color: config.accentColor }
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
              className="w-full px-4 py-3 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90 disabled:opacity-30"
              style={{ backgroundColor: config.ctaBg, color: config.ctaText }}
            >
              {loading ? "Starting..." : "Start Conversation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

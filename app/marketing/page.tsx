"use client";

import { useState } from "react";
import { VoiceChat } from "@/components/chat/VoiceChat";
import { INDUSTRY_LABELS } from "@/lib/data/questions";
import type { Industry } from "@/lib/types";

// dentsu brand palette
const BRAND = {
  black: "#1a1a1a",
  charcoal: "#38353b",
  purple: "#8e24c6",
  coral: "#f4a26a",
  teal: "#04687c",
  softPurple: "#a082bb",
  blush: "#e6d0de",
  white: "#ffffff",
  offWhite: "#fafafa",
  lightGrey: "#f4f4f5",
};

export default function MarketingPage() {
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

  // Chat view
  if (step === "chat" && assessmentId && shareId) {
    return (
      <div className="h-screen flex flex-col">
        <div style={{ backgroundColor: BRAND.black }}>
          <div className="max-w-full mx-auto px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/dentsu-logo-white.png" alt="dentsu" className="h-5 w-auto" />
              <span className="text-xs text-white/40 font-light">
                CRM Maturity Diagnostic
              </span>
            </div>
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

  // Intro / landing
  if (step === "intro") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: BRAND.offWhite }}>
        {/* Minimal header — black bar with white dentsu wordmark */}
        <header style={{ backgroundColor: BRAND.black }}>
          <div className="max-w-3xl mx-auto px-6 py-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/dentsu-logo-white.png" alt="dentsu" className="h-6 w-auto" />
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 pt-20 pb-24">
          {/* Purple accent line */}
          <div className="w-12 h-1 rounded-full mb-8" style={{ backgroundColor: BRAND.purple }} />

          <h1 className="text-5xl font-light tracking-tight leading-[1.1] mb-6" style={{ color: BRAND.black }}>
            How Mature Is
            <br />
            <span className="font-semibold">Your CRM?</span>
          </h1>

          <p className="text-lg font-light leading-relaxed mb-10" style={{ color: BRAND.charcoal }}>
            Have a conversation about your organization&apos;s CRM capabilities.
            In about 10 minutes, get a personalized maturity assessment with
            actionable insights and industry benchmarks.
          </p>

          {/* How it works — minimal */}
          <div className="grid grid-cols-3 gap-8 mb-12">
            {[
              { n: "01", text: "Describe your CRM environment" },
              { n: "02", text: "AI assesses 8 capability areas" },
              { n: "03", text: "Get benchmarked maturity scores" },
            ].map((s) => (
              <div key={s.n}>
                <p className="text-xs font-semibold mb-1.5" style={{ color: BRAND.purple }}>{s.n}</p>
                <p className="text-sm font-light" style={{ color: BRAND.charcoal }}>{s.text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep("setup")}
            className="px-8 py-3.5 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90"
            style={{ backgroundColor: BRAND.black }}
          >
            Get Started
          </button>

          <p className="text-xs mt-5" style={{ color: "#9ca3af" }}>
            No account required. Email only needed to view results.
          </p>
        </div>

        {/* Footer */}
        <footer className="border-t" style={{ borderColor: "#e5e7eb" }}>
          <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/dentsu-logo.png" alt="dentsu" className="h-4 w-auto opacity-40" />
            <p className="text-xs" style={{ color: "#9ca3af" }}>
              © {new Date().getFullYear()} dentsu
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Setup — minimal, black + white + purple accent
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.offWhite }}>
      <header style={{ backgroundColor: BRAND.black }}>
        <div className="max-w-3xl mx-auto px-6 py-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/dentsu-logo-white.png" alt="dentsu" className="h-6 w-auto" />
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 pt-12 pb-20">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          {/* Purple accent */}
          <div className="w-8 h-0.5 rounded-full mb-4" style={{ backgroundColor: BRAND.purple }} />

          <h2 className="text-xl font-semibold mb-1" style={{ color: BRAND.black }}>Quick setup</h2>
          <p className="text-sm font-light mb-5" style={{ color: BRAND.charcoal }}>
            A couple of details before we begin.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: BRAND.charcoal }}>
                Organization
              </label>
              <input
                type="text"
                placeholder="Your company name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none transition-colors"
                style={{ borderColor: orgName ? BRAND.purple : undefined }}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: BRAND.charcoal }}>
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
              <label className="block text-sm font-medium mb-1" style={{ color: BRAND.charcoal }}>
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
                        ? { borderColor: BRAND.purple, backgroundColor: `${BRAND.purple}10`, color: BRAND.purple }
                        : { borderColor: "#e2e8f0", color: BRAND.charcoal }
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
              style={{ backgroundColor: BRAND.black }}
            >
              {loading ? "Starting..." : "Start Conversation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

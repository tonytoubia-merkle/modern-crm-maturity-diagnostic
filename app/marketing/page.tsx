"use client";

import { useState } from "react";
import { VoiceChat } from "@/components/chat/VoiceChat";
import { INDUSTRY_LABELS } from "@/lib/data/questions";
import type { Industry } from "@/lib/types";

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
        <div style={{ backgroundColor: "#00205B" }}>
          <div className="max-w-full mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/merkle-logo.webp" alt="Merkle" className="h-4 w-auto brightness-0 invert" />
              <span className="text-xs text-white/50">
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
      <div className="min-h-screen" style={{ backgroundColor: "#f8f9fb" }}>
        <div style={{ backgroundColor: "#00205B" }}>
          <div className="max-w-3xl mx-auto px-6 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/merkle-logo.webp" alt="Merkle" className="h-6 w-auto brightness-0 invert" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 pt-16 pb-20">
          <h1 className="text-4xl font-bold tracking-tight leading-tight mb-4" style={{ color: "#00205B" }}>
            How Mature Is Your CRM?
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-6">
            Have a quick conversation about your organization&apos;s CRM capabilities.
            In about 10 minutes, you&apos;ll get a personalized maturity assessment
            with actionable insights — no forms, no surveys, just a conversation.
          </p>

          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
            <h3 className="text-sm font-bold text-slate-900 mb-3">How it works</h3>
            <div className="space-y-3">
              {[
                { n: "1", text: "Tell us about your CRM environment in your own words" },
                { n: "2", text: "Our AI consultant asks follow-up questions to understand your capabilities" },
                { n: "3", text: "Get a maturity score across 8 dimensions with benchmarks" },
              ].map((s) => (
                <div key={s.n} className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: "#00205B" }}>
                    {s.n}
                  </span>
                  <p className="text-sm text-slate-600">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep("setup")}
            className="px-8 py-3.5 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: "#00205B" }}
          >
            Get Started
          </button>

          <p className="text-xs text-slate-400 mt-4">
            No account required. Your email is only needed to view results.
          </p>
        </div>
      </div>
    );
  }

  // Setup — minimal, just org name + optional name + industry
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f9fb" }}>
      <div style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-3xl mx-auto px-6 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/merkle-logo.webp" alt="Merkle" className="h-6 w-auto brightness-0 invert" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 pt-12 pb-20">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Quick setup</h2>
          <p className="text-sm text-slate-500 mb-5">Just a couple of details before we start the conversation.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organization</label>
              <input
                type="text"
                placeholder="Your company name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your name <span className="text-slate-400 font-normal">(optional)</span></label>
              <input
                type="text"
                placeholder="First name is fine"
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
                className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Industry <span className="text-slate-400 font-normal">(optional)</span></label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.entries(INDUSTRY_LABELS) as [Industry, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIndustry(industry === key ? "" : key)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                      industry === key
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={!orgName.trim() || loading}
              className="w-full px-4 py-3 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: "#00205B" }}
            >
              {loading ? "Starting..." : "Start Conversation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

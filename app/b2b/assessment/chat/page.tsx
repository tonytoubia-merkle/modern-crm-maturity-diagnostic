"use client";

import { useState } from "react";
import { B2bVoiceChat } from "@/components/b2b/chat/B2bVoiceChat";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { B2B_INDUSTRY_LABELS } from "@/lib/b2b/data/questions";
import type { B2bIndustry } from "@/lib/b2b/types";

/**
 * /b2b/assessment/chat – internal-consultant conversational entry point
 * for the CSC diagnostic. Mirrors /crm/assessment/chat: setup form
 * collects basic context, then renders B2bChatView for a text-driven
 * conversation. Voice input is available externally through the branded
 * landing pages (/connections, /dentsu, /cannes).
 */
export default function B2bChatAssessmentPage() {
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [respondentName, setRespondentName] = useState("");
  const [industry, setIndustry] = useState<B2bIndustry | "none" | "">("");
  const [loading, setLoading] = useState(false);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !respondentName.trim()) return;
    setLoading(true);
    try {
      const resolvedIndustry =
        industry === "none" || industry === "" ? null : industry;
      const res = await fetch("/api/b2b/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientCompany: resolvedIndustry
            ? B2B_INDUSTRY_LABELS[resolvedIndustry] || ""
            : "",
          respondentName: respondentName.trim(),
          repEmail: "",
          isRepMode: false,
          industry: resolvedIndustry,
        }),
      });
      if (!res.ok) throw new Error("Failed to create CSC assessment");
      const data = await res.json();
      setAssessmentId(data.id);
      setShareId(data.shareId);
    } finally {
      setLoading(false);
    }
  };

  if (assessmentId && shareId) {
    return (
      <div className="h-screen flex flex-col font-merkle">
        <div className="bg-merkle-secondary-600">
          <div className="max-w-full mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/merkle-logo.webp"
                alt="Merkle"
                className="h-4 w-auto brightness-0 invert"
              />
              <span className="text-xs text-white/50">
                CSC Conversational Assessment · {clientName}
              </span>
            </div>
            <a
              href="/b2b/assessment/new"
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              Switch to Manual →
            </a>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <B2bVoiceChat
            assessmentId={assessmentId}
            shareId={shareId}
            clientName={clientName}
            respondentName={respondentName}
            industry={
              industry === "none" || industry === ""
                ? null
                : (industry as B2bIndustry)
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-merkle bg-merkle-grey-60">
      <div className="bg-merkle-secondary-600">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/merkle-logo.webp"
            alt="Merkle"
            className="h-4 w-auto brightness-0 invert"
          />
          <a
            href="/b2b"
            className="text-xs text-white/70 hover:text-white transition-colors"
          >
            ← B2B Transformation Assessment
          </a>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Conversational Assessment
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Instead of answering 45 individual questions, have a natural
            conversation about your content supply chain. The system will infer
            maturity scores across strategy, workflow, asset governance,
            distribution, measurement, and AI from your responses. You can
            review and adjust all scores before generating results.
          </p>

          <form onSubmit={handleStart} className="space-y-4">
            <Input
              id="clientName"
              label="Organization Name"
              placeholder="e.g. Acme Corporation"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
            <Input
              id="respondentName"
              label="Your Name"
              placeholder="e.g. Jane Smith"
              value={respondentName}
              onChange={(e) => setRespondentName(e.target.value)}
              required
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Industry
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIndustry("none")}
                  className={`px-3 py-1.5 rounded-full border-2 text-xs font-medium transition-all ${
                    industry === "none"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                  }`}
                >
                  No specific industry
                </button>
                {(Object.entries(B2B_INDUSTRY_LABELS) as [string, string][]).map(
                  ([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setIndustry(key as B2bIndustry)}
                      className={`px-3 py-1.5 rounded-full border-2 text-xs font-medium transition-all ${
                        industry === key
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="pt-2">
              <Button type="submit" size="lg" loading={loading}>
                Start Conversation →
              </Button>
            </div>
          </form>

          <p className="text-xs text-slate-400 mt-4">
            Prefer the traditional survey?{" "}
            <a
              href="/b2b/assessment/new"
              className="text-blue-600 hover:underline"
            >
              Use the manual assessment
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

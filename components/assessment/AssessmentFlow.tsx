"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SetupForm } from "./SetupForm";
import { CapabilitySection } from "./CapabilitySection";
import { IndustryModule } from "./IndustryModule";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/Button";
import {
  CAPABILITIES_ORDER,
  QUESTIONS_BY_CAPABILITY,
  CORE_QUESTIONS,
  INDUSTRY_QUESTIONS,
  SCORE_LABELS,
} from "@/lib/data/questions";
import { computeCapabilityScores, computeOverallScore, computeMaturityStage } from "@/lib/scoring";
import type { Capability, Industry, ResponseItem } from "@/lib/types";

// Steps: 0 = setup, 1-6 = capabilities, 7 = industry
const TOTAL_CORE_STEPS = 6;

interface AssessmentFlowProps {
  initialAssessmentId?: string | null;
  initialShareId?: string | null;
  initialResponses?: ResponseItem[];
  initialIndustry?: Industry | null;
  initialStep?: number;
}

export function AssessmentFlow({
  initialAssessmentId = null,
  initialShareId = null,
  initialResponses = [],
  initialIndustry = null,
  initialStep = 0,
}: AssessmentFlowProps = {}) {
  const router = useRouter();
  const [assessmentId, setAssessmentId] = useState<string | null>(initialAssessmentId);
  const [shareId, setShareId] = useState<string | null>(initialShareId);
  const [step, setStep] = useState(initialStep);
  const [responses, setResponses] = useState<ResponseItem[]>(initialResponses);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [preSelectedIndustry, setPreSelectedIndustry] = useState<Industry | null>(initialIndustry);
  const [sectionReady, setSectionReady] = useState(false);

  // Scroll to top whenever step changes
  useEffect(() => {
    if (step > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  const coreQuestionCount = CORE_QUESTIONS.length;
  const industryQuestionCount = preSelectedIndustry
    ? INDUSTRY_QUESTIONS.filter((q) => q.industry === preSelectedIndustry).length
    : 0;
  const totalQuestionCount = coreQuestionCount + industryQuestionCount;
  const answeredTotalCount = responses.length;

  // Create assessment
  const handleSetup = async (data: {
    clientName: string;
    clientCompany: string;
    respondentName: string;
    repEmail: string;
    isRepMode: boolean;
    industry: Industry | "none" | "";
  }) => {
    const resolvedIndustry = data.industry === "none" || data.industry === "" ? null : data.industry as Industry;
    const res = await fetch("/api/assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, industry: resolvedIndustry }),
    });
    if (!res.ok) throw new Error("Failed to create assessment");
    const { id, shareId: sid } = await res.json();
    setAssessmentId(id);
    setShareId(sid);
    if (resolvedIndustry) setPreSelectedIndustry(resolvedIndustry);
    setStep(1);
  };

  // Score a question
  const handleScore = useCallback(
    (
      questionId: number | string,
      score: number,
      capability: Capability | string,
      isIndustryQuestion = false
    ) => {
      setResponses((prev) => {
        const existing = prev.findIndex((r) => r.questionId === questionId);
        const item: ResponseItem = {
          questionId,
          score,
          capability: capability as Capability,
          isIndustryQuestion,
          notes: existing >= 0 ? prev[existing].notes : undefined,
        };
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = item;
          return updated;
        }
        return [...prev, item];
      });
    },
    []
  );

  // Update notes on an existing response
  const handleNotes = useCallback((questionId: number | string, notes: string) => {
    setResponses((prev) => {
      const idx = prev.findIndex((r) => r.questionId === questionId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], notes };
        return updated;
      }
      return prev;
    });
  }, []);

  // Remove a response (used when question is skipped)
  const handleRemoveResponse = useCallback((questionId: number | string) => {
    setResponses((prev) => prev.filter((r) => r.questionId !== questionId));
  }, []);

  // Auto-save responses
  const saveCurrentResponses = async () => {
    if (!assessmentId || responses.length === 0) return;
    setSaving(true);
    try {
      await fetch(`/api/assessments/${assessmentId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });
    } catch (e) {
      console.error("Failed to save responses:", e);
    } finally {
      setSaving(false);
    }
  };

  const currentCapability =
    step >= 1 && step <= 6 ? CAPABILITIES_ORDER[step - 1] : null;

  const handleNext = async () => {
    await saveCurrentResponses();
    if (step < TOTAL_CORE_STEPS) {
      setStep(step + 1);
    } else if (preSelectedIndustry) {
      setStep(7);
    } else {
      await handleComplete(null);
    }
  };

  const handlePrev = () => {
    setStep(Math.max(0, step - 1));
  };

  const handleComplete = async (selectedIndustry: Industry | null) => {
    if (!assessmentId || !shareId) return;
    setCompleting(true);
    try {
      await fetch(`/api/assessments/${assessmentId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });

      const capabilityScores = computeCapabilityScores(responses);
      const overallScore = computeOverallScore(capabilityScores);
      const maturityStage = computeMaturityStage(overallScore);

      await fetch(`/api/assessments/${assessmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          industry: selectedIndustry,
          overallScore,
          maturityStage,
          capabilityScores,
        }),
      });

      router.refresh();
      router.push(`/results/${shareId}`);
    } catch (e) {
      console.error("Failed to complete assessment:", e);
      setCompleting(false);
    }
  };

  const handleSkipIndustry = async () => {
    await handleComplete(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky header: breadcrumb + progress + scale legend */}
      <div className="sticky top-0 z-20 bg-slate-50 border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 pt-3 pb-3">
          <a
            href="/"
            className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-2"
          >
            ← Modern CRM Maturity Diagnostic
          </a>

          {step > 0 && (
            <>
              <ProgressBar
                currentStep={step}
                totalSteps={TOTAL_CORE_STEPS + 1 + (preSelectedIndustry ? 1 : 0)}
                answeredCount={answeredTotalCount}
                totalQuestions={totalQuestionCount}
                hasIndustry={!!preSelectedIndustry}
              />

              {(step >= 1 && step <= 7) && (
                <div className="mt-2 flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">Scale:</span>
                  {([1, 2, 3, 4, 5] as const).map((v) => (
                    <span key={v}>
                      <strong className="text-slate-700">{v}</strong>{" "}
                      {SCORE_LABELS[v]}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {step === 0 && <SetupForm onSubmit={handleSetup} />}

          {step >= 1 && step <= 6 && currentCapability && (
            <div className="space-y-8">
              <CapabilitySection
                capability={currentCapability}
                responses={responses}
                onScore={handleScore}
                onNotes={handleNotes}
                onRemoveResponse={handleRemoveResponse}
                onReadyChange={setSectionReady}
              />
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={handlePrev} disabled={step === 1}>
                  ← Back
                </Button>
                <div className="flex items-center gap-4">
                  {saving && (
                    <span className="text-xs text-slate-400">Saving…</span>
                  )}
                  <Button onClick={handleNext} disabled={!sectionReady}>
                    {step < TOTAL_CORE_STEPS
                      ? "Next →"
                      : preSelectedIndustry
                      ? "Next →"
                      : "Complete Assessment →"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <IndustryModule
              responses={responses}
              onScore={handleScore}
              onNotes={handleNotes}
              onRemoveResponse={handleRemoveResponse}
              onComplete={handleComplete}
              onSkip={handleSkipIndustry}
              preSelectedIndustry={preSelectedIndustry}
            />
          )}

          {completing && (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-700 font-medium">
                  Generating your results…
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

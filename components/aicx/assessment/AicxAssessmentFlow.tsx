"use client";

import { useState, useCallback } from "react";
import { AicxSetupForm, type AicxSetupData } from "./AicxSetupForm";
import { AicxCapabilitySection } from "./AicxCapabilitySection";
import { AicxIndustryModule } from "./AicxIndustryModule";
import { AicxProgressBar } from "./AicxProgressBar";
import { Button } from "@/components/ui/Button";
import {
  AICX_CAPABILITIES_ORDER,
  AICX_CORE_QUESTIONS,
  AICX_INDUSTRY_QUESTIONS,
  AICX_SCORE_LABELS,
} from "@/lib/aicx/data/questions";
import {
  computeAicxCapabilityScores,
  computeAicxOverallScore,
  computeAicxMaturityStage,
} from "@/lib/aicx/scoring";
import type { AicxCapability, AicxIndustry, AicxResponseItem } from "@/lib/aicx/types";

const TOTAL_CORE_STEPS = 6;

interface AicxAssessmentFlowProps {
  initialAssessmentId?: string | null;
  initialShareId?: string | null;
  initialResponses?: AicxResponseItem[];
  initialIndustry?: AicxIndustry | null;
  initialStep?: number;
  /** When set, the flow is running inside a stakeholder invite — completion
   *  posts to /api/aicx/stakeholders/:id/complete and calls onComplete instead
   *  of redirecting to the results page. */
  stakeholderId?: string | null;
  onComplete?: () => void;
}

export function AicxAssessmentFlow({
  initialAssessmentId = null,
  initialShareId = null,
  initialResponses = [],
  initialIndustry = null,
  initialStep = 0,
  stakeholderId = null,
  onComplete,
}: AicxAssessmentFlowProps = {}) {
  const [assessmentId, setAssessmentId] = useState<string | null>(initialAssessmentId);
  const [shareId, setShareId] = useState<string | null>(initialShareId);
  const [step, setStep] = useState(initialStep);
  const [responses, setResponses] = useState<AicxResponseItem[]>(initialResponses);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [preSelectedIndustry, setPreSelectedIndustry] =
    useState<AicxIndustry | null>(initialIndustry);
  const [sectionReady, setSectionReady] = useState(false);
  const [scaleExpanded, setScaleExpanded] = useState(false);

  const coreQuestionCount = AICX_CORE_QUESTIONS.length;
  const industryQuestionCount = preSelectedIndustry
    ? AICX_INDUSTRY_QUESTIONS.filter((q) => q.industry === preSelectedIndustry)
        .length
    : 0;
  const totalQuestionCount = coreQuestionCount + industryQuestionCount;
  const answeredTotalCount = responses.length;

  const handleSetup = async (data: AicxSetupData) => {
    const resolvedIndustry =
      data.industry === "none" || data.industry === ""
        ? null
        : (data.industry as AicxIndustry);
    const res = await fetch("/api/aicx/assessments", {
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
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const handleScore = useCallback(
    (
      questionId: number | string,
      score: number,
      capability: AicxCapability | string,
      isIndustryQuestion = false
    ) => {
      setResponses((prev) => {
        const existing = prev.findIndex((r) => r.questionId === questionId);
        const item: AicxResponseItem = {
          questionId,
          score,
          capability: capability as AicxCapability,
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

  const handleNotes = useCallback(
    (questionId: number | string, notes: string) => {
      setResponses((prev) => {
        const idx = prev.findIndex((r) => r.questionId === questionId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], notes };
          return updated;
        }
        return prev;
      });
    },
    []
  );

  const handleRemoveResponse = useCallback((questionId: number | string) => {
    setResponses((prev) => prev.filter((r) => r.questionId !== questionId));
  }, []);

  const saveCurrentResponses = async () => {
    if (!assessmentId || responses.length === 0) return;
    setSaving(true);
    try {
      await fetch(`/api/aicx/assessments/${assessmentId}/responses`, {
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
    step >= 1 && step <= TOTAL_CORE_STEPS
      ? AICX_CAPABILITIES_ORDER[step - 1]
      : null;

  const handleNext = async () => {
    await saveCurrentResponses();
    if (step < TOTAL_CORE_STEPS) {
      setStep(step + 1);
    } else if (preSelectedIndustry) {
      setStep(TOTAL_CORE_STEPS + 1);
    } else {
      await handleComplete(null);
      return;
    }
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const handlePrev = () => {
    setStep(Math.max(0, step - 1));
  };

  const handleComplete = async (selectedIndustry: AicxIndustry | null) => {
    if (!assessmentId || !shareId) return;
    setCompleting(true);
    try {
      await fetch(`/api/aicx/assessments/${assessmentId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });

      const capabilityScores = computeAicxCapabilityScores(responses);
      const overallScore = computeAicxOverallScore(capabilityScores);
      const maturityStage = computeAicxMaturityStage(overallScore);

      await fetch(`/api/aicx/assessments/${assessmentId}`, {
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

      // Stakeholder-invite flows: mark stakeholder complete and hand off to
      // the caller (which typically shows a thank-you screen).
      if (stakeholderId) {
        await fetch(`/api/aicx/stakeholders/${stakeholderId}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        });
        if (onComplete) {
          onComplete();
          return;
        }
      }

      window.location.href = `/aicx/results/${shareId}`;
    } catch (e) {
      console.error("Failed to complete assessment:", e);
      setCompleting(false);
    }
  };

  const handleSkipIndustry = async () => {
    await handleComplete(null);
  };

  return (
    <div className="min-h-screen font-merkle bg-merkle-grey-60">
      <div className="sticky top-0 z-20 bg-merkle-secondary-600">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/merkle-logo.webp"
            alt="Merkle"
            className="h-4 w-auto brightness-0 invert"
          />
          <a
            href="/aicx"
            className="text-xs text-white/70 hover:text-white flex items-center gap-1 transition-colors"
          >
            ← AI for CX Assessment
          </a>
        </div>
      </div>

      <div
        className="sticky z-10 bg-slate-50 border-b border-slate-100 shadow-sm"
        style={{ top: "36px" }}
      >
        <div className="max-w-3xl mx-auto px-4 pt-3 pb-2">
          {step > 0 && (
            <>
              <AicxProgressBar
                currentStep={step}
                totalSteps={TOTAL_CORE_STEPS + 1 + (preSelectedIndustry ? 1 : 0)}
                answeredCount={answeredTotalCount}
                totalQuestions={totalQuestionCount}
                hasIndustry={!!preSelectedIndustry}
              />

              {step >= 1 && step <= TOTAL_CORE_STEPS + 1 && (
                <div className="mt-1.5">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span className="text-slate-400 font-medium mr-0.5">
                      Scale:
                    </span>
                    {([1, 2, 3, 4, 5] as const).map((v, i) => (
                      <span key={v}>
                        <strong className="text-slate-700">{v}</strong>{" "}
                        {AICX_SCORE_LABELS[v]}
                        {i < 4 && (
                          <span className="text-slate-300 mx-1">·</span>
                        )}
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => setScaleExpanded(!scaleExpanded)}
                      className="ml-1 text-blue-500 hover:text-blue-700 font-medium"
                    >
                      {scaleExpanded ? "hide" : "details"}
                    </button>
                  </div>
                  {scaleExpanded && (
                    <div className="mt-1.5 bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] text-slate-500 space-y-0.5">
                      {([1, 2, 3, 4, 5] as const).map((v) => (
                        <div key={v}>
                          <strong className="text-slate-700">
                            {v} {AICX_SCORE_LABELS[v]}
                          </strong>
                          <span className="text-slate-400"> — </span>
                          {v === 1 &&
                            "Capability does not exist or is highly fragmented."}
                          {v === 2 &&
                            "Limited pilots or isolated capabilities exist."}
                          {v === 3 &&
                            "In use but not consistently integrated across teams."}
                          {v === 4 &&
                            "Operates across teams and channels with governance."}
                          {v === 5 &&
                            "Fully orchestrated, continuously improved, drives outcomes."}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {step === 0 && <AicxSetupForm onSubmit={handleSetup} />}

          {step >= 1 && step <= TOTAL_CORE_STEPS && currentCapability && (
            <div className="space-y-8">
              <AicxCapabilitySection
                capability={currentCapability}
                responses={responses}
                onScore={handleScore}
                onNotes={handleNotes}
                onRemoveResponse={handleRemoveResponse}
                onReadyChange={setSectionReady}
                industry={preSelectedIndustry}
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

          {step === TOTAL_CORE_STEPS + 1 && (
            <AicxIndustryModule
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

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SetupForm } from "./SetupForm";
import { CapabilitySection } from "./CapabilitySection";
import { IndustryModule } from "./IndustryModule";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/Button";
import { CAPABILITIES_ORDER, QUESTIONS_BY_CAPABILITY, CORE_QUESTIONS } from "@/lib/data/questions";
import type { Capability, Industry, ResponseItem } from "@/lib/types";

// Steps: 0 = setup, 1-6 = capabilities, 7 = industry
const TOTAL_CORE_STEPS = 6;

export function AssessmentFlow() {
  const router = useRouter();
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

  const coreQuestionCount = CORE_QUESTIONS.length;
  const answeredCoreCount = responses.filter((r) => !r.isIndustryQuestion).length;

  // Create assessment
  const handleSetup = async (data: {
    clientName: string;
    clientCompany: string;
    respondentName: string;
    repEmail: string;
    isRepMode: boolean;
  }) => {
    const res = await fetch("/api/assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create assessment");
    const { id, shareId: sid } = await res.json();
    setAssessmentId(id);
    setShareId(sid);
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

  // Auto-save responses for current capability section
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

  // Check if current capability section is fully answered
  const currentCapability =
    step >= 1 && step <= 6 ? CAPABILITIES_ORDER[step - 1] : null;

  const currentSectionAnswered = currentCapability
    ? QUESTIONS_BY_CAPABILITY[currentCapability].every(
        (q) => responses.find((r) => r.questionId === q.id) !== undefined
      )
    : false;

  const handleNext = async () => {
    await saveCurrentResponses();
    if (step < TOTAL_CORE_STEPS) {
      setStep(step + 1);
    } else {
      setStep(7); // industry module
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    setStep(Math.max(0, step - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Complete the assessment
  const handleComplete = async (selectedIndustry: Industry | null) => {
    if (!assessmentId || !shareId) return;
    setCompleting(true);
    try {
      // Save final responses
      await fetch(`/api/assessments/${assessmentId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });

      // Mark complete and save industry
      await fetch(`/api/assessments/${assessmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          industry: selectedIndustry,
        }),
      });

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
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
            ← Modern CRM Maturity Diagnostic
          </a>
        </div>

        {step > 0 && (
          <div className="mb-8">
            <ProgressBar
              currentStep={step}
              totalSteps={TOTAL_CORE_STEPS + 1}
              answeredCount={answeredCoreCount}
              totalQuestions={coreQuestionCount}
            />
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {step === 0 && <SetupForm onSubmit={handleSetup} />}

          {step >= 1 && step <= 6 && currentCapability && (
            <div className="space-y-8">
              <CapabilitySection
                capability={currentCapability}
                responses={responses}
                onScore={handleScore}
              />
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={handlePrev} disabled={step === 1}>
                  ← Back
                </Button>
                <div className="flex items-center gap-4">
                  {saving && (
                    <span className="text-xs text-slate-400">Saving…</span>
                  )}
                  <Button
                    onClick={handleNext}
                    disabled={!currentSectionAnswered}
                  >
                    {step < TOTAL_CORE_STEPS ? "Next →" : "Review & Finish →"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <IndustryModule
              responses={responses}
              onScore={handleScore}
              onComplete={handleComplete}
              onSkip={handleSkipIndustry}
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

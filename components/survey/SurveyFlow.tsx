"use client";

import { useState, useCallback } from "react";
import { CapabilitySection } from "@/components/assessment/CapabilitySection";
import { IndustryModule } from "@/components/assessment/IndustryModule";
import { ProgressBar } from "@/components/assessment/ProgressBar";
import { Button } from "@/components/ui/Button";
import {
  CAPABILITIES_ORDER,
  CORE_QUESTIONS,
  INDUSTRY_QUESTIONS,
  SCORE_LABELS,
} from "@/lib/data/questions";
import type { Capability, Industry, ResponseItem } from "@/lib/types";

const TOTAL_CORE_STEPS = 8;

interface SurveyFlowProps {
  assessmentId: string;
  stakeholderId: string;
  respondentName: string;
  clientName: string;
  industry?: Industry | null;
  initialResponses?: ResponseItem[];
}

export function SurveyFlow({
  assessmentId,
  stakeholderId,
  respondentName,
  clientName,
  industry = null,
  initialResponses = [],
}: SurveyFlowProps) {
  const [step, setStep] = useState(0); // 0 = intro, 1-6 = capabilities, 7 = industry
  const [responses, setResponses] = useState<ResponseItem[]>(initialResponses);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [sectionReady, setSectionReady] = useState(false);
  const [done, setDone] = useState(false);

  const coreQuestionCount = CORE_QUESTIONS.length;
  const industryQuestionCount = industry
    ? INDUSTRY_QUESTIONS.filter((q) => q.industry === industry).length
    : 0;
  const totalQuestionCount = coreQuestionCount + industryQuestionCount;

  const handleScore = useCallback(
    (questionId: number | string, score: number, capability: Capability | string, isIndustryQuestion = false) => {
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

  const handleRemoveResponse = useCallback((questionId: number | string) => {
    setResponses((prev) => prev.filter((r) => r.questionId !== questionId));
  }, []);

  const saveResponses = async () => {
    if (responses.length === 0) return;
    setSaving(true);
    try {
      await fetch(`/api/assessments/${assessmentId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });
    } finally {
      setSaving(false);
    }
  };

  const currentCapability = step >= 1 && step <= TOTAL_CORE_STEPS ? CAPABILITIES_ORDER[step - 1] : null;

  const handleNext = async () => {
    await saveResponses();
    if (step < TOTAL_CORE_STEPS) {
      setStep(step + 1);
    } else if (industry) {
      setStep(TOTAL_CORE_STEPS + 1);
    } else {
      await handleComplete(null);
      return;
    }
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const handleComplete = async (selectedIndustry: Industry | null) => {
    setCompleting(true);
    try {
      // Save responses
      await fetch(`/api/assessments/${assessmentId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });
      // Mark assessment completed
      await fetch(`/api/assessments/${assessmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed", industry: selectedIndustry }),
      });
      // Update stakeholder status so dashboard reflects completion
      await fetch(`/api/stakeholders/${stakeholderId}/complete`, {
        method: "POST",
      });
      setDone(true);
    } finally {
      setCompleting(false);
    }
  };

  // Completion screen
  if (done) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Survey Complete</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Thank you, {respondentName}! Your responses have been submitted.
          Your Merkle team will aggregate results from all participants and
          follow up with next steps.
        </p>
      </div>
    );
  }

  // Intro screen
  if (step === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome, {respondentName}
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            You&apos;ve been invited to complete a Modern CRM Maturity Assessment
            for <strong>{clientName}</strong>. This survey evaluates {industry ? "nine" : "eight"} capability
            areas and takes about {industry ? "20–25" : "15–20"} minutes.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-sm" style={{ color: "#040e4b" }}>Before You Start</h3>
          <ol className="text-sm text-slate-700 space-y-2 list-decimal list-inside">
            <li>
              Rate each question on a <strong>1–5 scale</strong>: {Object.entries(SCORE_LABELS).map(([k, v]) => `${k} = ${v}`).join(", ")}.
            </li>
            <li>
              <strong>It&apos;s OK to select &quot;Not sure&quot;</strong> for areas outside your expertise. We&apos;ll be averaging all responses across participants — your perspective on the areas you do cover is what matters.
            </li>
            <li>
              Use the <strong>notes field</strong> to add context, caveats, or concerns on any question. These are reviewed by the Merkle team and help inform the workshop.
            </li>
            <li>
              Your progress is <strong>saved automatically</strong> after each section. You can close and return to this link to continue.
            </li>
          </ol>
        </div>

        <Button size="lg" onClick={() => {
          // Mark stakeholder as in_progress
          fetch(`/api/stakeholders/${stakeholderId}/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "in_progress" }),
          }).catch(() => {});
          setStep(1);
          setTimeout(() => window.scrollTo(0, 0), 0);
        }}>
          Start Survey →
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Progress */}
      <div className="mb-6">
        <ProgressBar
          currentStep={step}
          totalSteps={TOTAL_CORE_STEPS + 1 + (industry ? 1 : 0)}
          answeredCount={responses.length}
          totalQuestions={totalQuestionCount}
          hasIndustry={!!industry}
        />
        {/* Compact scale reminder */}
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500">
          <span className="text-slate-400 font-medium mr-0.5">Scale:</span>
          {([1, 2, 3, 4, 5] as const).map((v, i) => (
            <span key={v}>
              <strong className="text-slate-700">{v}</strong> {SCORE_LABELS[v]}
              {i < 4 && <span className="text-slate-300 mx-1">·</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Capability sections */}
      {step >= 1 && step <= TOTAL_CORE_STEPS && currentCapability && (
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
            <Button variant="ghost" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
              ← Back
            </Button>
            <div className="flex items-center gap-4">
              {saving && <span className="text-xs text-slate-400">Saving...</span>}
              <Button onClick={handleNext} disabled={!sectionReady}>
                {step < TOTAL_CORE_STEPS
                  ? "Next →"
                  : industry
                  ? "Next →"
                  : "Complete Survey →"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Industry module */}
      {step === TOTAL_CORE_STEPS + 1 && (
        <IndustryModule
          responses={responses}
          onScore={handleScore}
          onNotes={handleNotes}
          onRemoveResponse={handleRemoveResponse}
          onComplete={handleComplete}
          onSkip={() => handleComplete(null)}
          preSelectedIndustry={industry}
        />
      )}

      {completing && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-700 font-medium">Submitting your responses...</p>
          </div>
        </div>
      )}
    </>
  );
}

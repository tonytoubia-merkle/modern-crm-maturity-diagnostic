"use client";

import { useState } from "react";
import { INDUSTRY_LABELS, INDUSTRY_QUESTIONS } from "@/lib/data/questions";
import { ScoreButton } from "./ScoreButton";
import { Button } from "@/components/ui/Button";
import type { Industry, ResponseItem } from "@/lib/types";

interface IndustryModuleProps {
  responses: ResponseItem[];
  onScore: (
    questionId: string,
    score: number,
    capability: string,
    isIndustry: boolean
  ) => void;
  onComplete: (selectedIndustry: Industry | null) => void;
  onSkip: () => void;
}

export function IndustryModule({
  responses,
  onScore,
  onComplete,
  onSkip,
}: IndustryModuleProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
    null
  );
  const [showQuestions, setShowQuestions] = useState(false);

  const industryQuestions = selectedIndustry
    ? INDUSTRY_QUESTIONS.filter((q) => q.industry === selectedIndustry)
    : [];

  const getScore = (qId: string) =>
    responses.find((r) => r.questionId === qId)?.score ?? null;

  const allAnswered =
    industryQuestions.length > 0 &&
    industryQuestions.every((q) => getScore(q.id) !== null);

  if (!showQuestions) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Add Industry Context
          </h2>
          <p className="mt-2 text-slate-600 text-sm leading-relaxed">
            Optionally add 5 industry-specific questions to provide additional
            context for your results. These do not affect your core maturity
            score but enrich the strategic opportunity analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(INDUSTRY_LABELS) as Industry[]).map((ind) => (
            <button
              key={ind}
              type="button"
              onClick={() => setSelectedIndustry(ind)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                selectedIndustry === ind
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <p
                className={`font-semibold text-sm ${
                  selectedIndustry === ind ? "text-blue-700" : "text-slate-800"
                }`}
              >
                {INDUSTRY_LABELS[ind]}
              </p>
            </button>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          {selectedIndustry ? (
            <Button onClick={() => setShowQuestions(true)}>
              Continue with {INDUSTRY_LABELS[selectedIndustry]}
            </Button>
          ) : null}
          <Button variant="ghost" onClick={onSkip}>
            Skip industry questions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Industry Module
        </span>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          {selectedIndustry ? INDUSTRY_LABELS[selectedIndustry] : ""}
        </h2>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed">
          These 5 questions provide industry-specific context to your
          assessment. They do not modify your core capability scores.
        </p>
      </div>

      <div className="space-y-8">
        {industryQuestions.map((question, idx) => {
          const selected = getScore(question.id);
          return (
            <div key={question.id} className="space-y-3">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-slate-800 text-sm leading-relaxed font-medium">
                  {question.text}
                </p>
              </div>
              <div className="ml-10 flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <ScoreButton
                    key={val}
                    value={val}
                    selected={selected === val}
                    onClick={() =>
                      onScore(question.id, val, question.capability, true)
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          disabled={!allAnswered}
          onClick={() => onComplete(selectedIndustry)}
        >
          Complete Assessment
        </Button>
        <Button variant="ghost" onClick={() => setShowQuestions(false)}>
          Back
        </Button>
      </div>
    </div>
  );
}

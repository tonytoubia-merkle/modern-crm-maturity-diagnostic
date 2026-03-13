"use client";

import { useState } from "react";
import { INDUSTRY_LABELS, INDUSTRY_QUESTIONS, SCORE_LABELS } from "@/lib/data/questions";
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
  onNotes?: (questionId: string | number, notes: string) => void;
  onRemoveResponse?: (questionId: string | number) => void;
  onComplete: (selectedIndustry: Industry | null) => void;
  onSkip: () => void;
  preSelectedIndustry?: Industry | null;
}

export function IndustryModule({
  responses,
  onScore,
  onNotes,
  onRemoveResponse,
  onComplete,
  onSkip,
  preSelectedIndustry = null,
}: IndustryModuleProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
    preSelectedIndustry
  );
  const [showQuestions, setShowQuestions] = useState(preSelectedIndustry !== null);
  const [skipped, setSkipped] = useState<Set<string>>(new Set());
  const [showNotesFor, setShowNotesFor] = useState<Set<string>>(new Set());

  const industryQuestions = selectedIndustry
    ? INDUSTRY_QUESTIONS.filter((q) => q.industry === selectedIndustry)
    : [];

  const getScore = (qId: string) =>
    responses.find((r) => r.questionId === qId)?.score ?? null;

  const getNotes = (qId: string) =>
    responses.find((r) => r.questionId === qId)?.notes ?? "";

  const allAnswered =
    industryQuestions.length > 0 &&
    industryQuestions.every((q) => skipped.has(q.id) || getScore(q.id) !== null);

  const handleSkipToggle = (questionId: string) => {
    setSkipped((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
        onRemoveResponse?.(questionId);
      }
      return next;
    });
  };

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

      <div className="space-y-3">
        {industryQuestions.map((question, idx) => {
          const selected = getScore(question.id);
          const isSkipped = skipped.has(question.id);
          const noteVisible = showNotesFor.has(question.id);
          const noteVal = getNotes(question.id);

          return (
            <div
              key={question.id}
              className={`rounded-xl border p-4 transition-all ${
                isSkipped
                  ? "border-dashed border-slate-200 bg-slate-50"
                  : selected !== null
                  ? "border-slate-200 bg-white"
                  : "border-dashed border-slate-200 bg-white"
              }`}
            >
              <div className="flex gap-3 mb-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <p
                  className={`text-sm font-medium leading-relaxed ${
                    isSkipped ? "line-through text-slate-400" : "text-slate-900"
                  }`}
                >
                  {question.text}
                </p>
              </div>

              {isSkipped ? (
                <div className="ml-9 flex items-center gap-2">
                  <span className="text-xs text-slate-400 italic">Skipped</span>
                  <button
                    type="button"
                    onClick={() => handleSkipToggle(question.id)}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Undo
                  </button>
                </div>
              ) : (
                <div className="ml-9 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-4 flex-shrink-0 text-center">1</span>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={selected ?? 3}
                      onChange={(e) =>
                        onScore(question.id, Number(e.target.value), question.capability, true)
                      }
                      className="flex-1 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-xs text-slate-400 w-4 flex-shrink-0 text-center">5</span>
                  </div>

                  {selected !== null ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-blue-600">{selected}</span>
                      <span className="text-sm text-slate-700">— {SCORE_LABELS[selected]}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Drag to set your rating</p>
                  )}

                  {selected !== null && (
                    noteVisible ? (
                      <textarea
                        placeholder="Add context, concerns, or notes (optional)..."
                        value={noteVal}
                        onChange={(e) => onNotes?.(question.id, e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 resize-none text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
                        rows={2}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setShowNotesFor((prev) => {
                            const next = new Set(prev);
                            next.add(question.id);
                            return next;
                          })
                        }
                        className="text-xs text-slate-400 hover:text-blue-500 transition-colors"
                      >
                        + Add a note
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => handleSkipToggle(question.id)}
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors block"
                  >
                    Skip this question
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={() => setShowQuestions(false)}>
          ← Back
        </Button>
        <Button
          disabled={!allAnswered}
          onClick={() => onComplete(selectedIndustry)}
        >
          Complete Assessment →
        </Button>
      </div>
    </div>
  );
}

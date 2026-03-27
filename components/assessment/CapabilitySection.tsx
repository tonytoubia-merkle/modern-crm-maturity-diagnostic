"use client";

import { useState, useEffect } from "react";
import {
  CAPABILITY_LABELS,
  CAPABILITY_SUBTITLES,
  CAPABILITY_DESCRIPTIONS,
  CAPABILITY_SCOPE_HINTS,
  QUESTIONS_BY_CAPABILITY,
  SCORE_LABELS,
} from "@/lib/data/questions";
import type { Capability, ResponseItem } from "@/lib/types";
import type { QuestionAverages } from "./AssessmentFlow";

interface CapabilitySectionProps {
  capability: Capability;
  responses: ResponseItem[];
  onScore: (questionId: number, score: number, capability: Capability) => void;
  onNotes?: (questionId: number | string, notes: string) => void;
  onRemoveResponse?: (questionId: number | string) => void;
  onReadyChange?: (isReady: boolean) => void;
  averages?: QuestionAverages;
}

export function CapabilitySection({
  capability,
  responses,
  onScore,
  onNotes,
  onRemoveResponse,
  onReadyChange,
  averages,
}: CapabilitySectionProps) {
  const questions = QUESTIONS_BY_CAPABILITY[capability];
  const [skipped, setSkipped] = useState<Set<number>>(new Set());
  const [showNotesFor, setShowNotesFor] = useState<Set<number>>(new Set());

  const getScore = (questionId: number) =>
    responses.find((r) => r.questionId === questionId)?.score ?? null;

  const getNotes = (questionId: number) =>
    responses.find((r) => r.questionId === questionId)?.notes ?? "";

  useEffect(() => {
    const ready = questions.every(
      (q) => skipped.has(q.id) || responses.find((r) => r.questionId === q.id) !== undefined
    );
    onReadyChange?.(ready);
  }, [responses, skipped, questions, onReadyChange]);

  const handleSkipToggle = (questionId: number) => {
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

  return (
    <div className="space-y-6">
      {/* Capability header */}
      <div>
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          {CAPABILITY_SUBTITLES[capability]}
        </span>
        <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
          {CAPABILITY_LABELS[capability]}
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
          {CAPABILITY_DESCRIPTIONS[capability]}
        </p>
        {/* Scope hint */}
        <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 leading-relaxed">
          {CAPABILITY_SCOPE_HINTS[capability]}
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((question, idx) => {
          const selected = getScore(question.id);
          const isSkipped = skipped.has(question.id);
          const noteVisible = showNotesFor.has(question.id);
          const noteVal = getNotes(question.id);
          const overallAvg = averages?.overall?.[String(question.id)];
          const industryAvg = averages?.industry?.[String(question.id)];

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
              {/* Question text */}
              <div className="flex gap-3 mb-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium leading-relaxed ${
                      isSkipped ? "line-through text-slate-400" : "text-slate-900"
                    }`}
                  >
                    {question.text}
                  </p>
                  {question.tooltip && !isSkipped && (
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed italic">
                      {question.tooltip}
                    </p>
                  )}
                </div>
              </div>

              {isSkipped ? (
                <div className="ml-9 flex items-center gap-2">
                  <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg font-medium">
                    Not sure / Requires validation
                  </span>
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
                  {/* Score pips + Not sure button on same row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* 1-5 pips with average markers */}
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((v) => {
                        const isOverallAvg = overallAvg === v;
                        const isIndustryAvg = industryAvg === v && industryAvg !== overallAvg;
                        const hasBothAvg = overallAvg === v && industryAvg === v;
                        return (
                          <div key={v} className="flex flex-col items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => onScore(question.id, v, capability)}
                              className={`w-9 h-9 rounded-full text-sm font-bold border-2 transition-all flex-shrink-0 ${
                                selected === v
                                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                  : "border-slate-200 bg-white text-slate-400 hover:border-blue-400 hover:text-blue-600"
                              }`}
                            >
                              {v}
                            </button>
                            {/* Average indicators — small dots below the pip */}
                            <div className="flex items-center gap-0.5 h-2">
                              {hasBothAvg ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" title="Overall avg" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Industry avg" />
                                </>
                              ) : (
                                <>
                                  {isOverallAvg && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" title="Overall avg" />
                                  )}
                                  {isIndustryAvg && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Industry avg" />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {selected !== null && (
                      <span className="text-xs text-slate-500 ml-0.5">
                        {SCORE_LABELS[selected]}
                      </span>
                    )}
                    {/* Divider */}
                    <span className="text-slate-200 mx-0.5">|</span>
                    {/* Not sure button — prominent, same row */}
                    <button
                      type="button"
                      onClick={() => handleSkipToggle(question.id)}
                      className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                    >
                      Not sure
                    </button>
                  </div>

                  {/* Average legend — only show if there are averages */}
                  {(overallAvg || industryAvg) && !selected && (
                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      {overallAvg && (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                          Avg across all assessments
                        </span>
                      )}
                      {industryAvg && industryAvg !== overallAvg && (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                          Industry avg
                        </span>
                      )}
                    </div>
                  )}

                  {/* Notes (only after scoring) */}
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
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion hint */}
      {questions.some((q) => !skipped.has(q.id) && getScore(q.id) === null) && (
        <p className="text-xs text-amber-600 font-medium">
          Please rate or mark all questions before continuing.
        </p>
      )}
    </div>
  );
}

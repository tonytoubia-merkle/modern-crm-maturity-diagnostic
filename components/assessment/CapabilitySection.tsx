"use client";

import { useState, useEffect } from "react";
import {
  CAPABILITY_LABELS,
  CAPABILITY_SUBTITLES,
  CAPABILITY_DESCRIPTIONS,
  QUESTIONS_BY_CAPABILITY,
  SCORE_LABELS,
} from "@/lib/data/questions";
import type { Capability, ResponseItem } from "@/lib/types";

interface CapabilitySectionProps {
  capability: Capability;
  responses: ResponseItem[];
  onScore: (questionId: number, score: number, capability: Capability) => void;
  onNotes?: (questionId: number | string, notes: string) => void;
  onRemoveResponse?: (questionId: number | string) => void;
  onReadyChange?: (isReady: boolean) => void;
}

export function CapabilitySection({
  capability,
  responses,
  onScore,
  onNotes,
  onRemoveResponse,
  onReadyChange,
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
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((question, idx) => {
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
              {/* Question text */}
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
                  {/* Slider */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-4 flex-shrink-0 text-center">1</span>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={selected ?? 3}
                      onChange={(e) =>
                        onScore(question.id, Number(e.target.value), capability)
                      }
                      className="flex-1 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-xs text-slate-400 w-4 flex-shrink-0 text-center">5</span>
                  </div>

                  {/* Score display */}
                  {selected !== null ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-blue-600">{selected}</span>
                      <span className="text-sm text-slate-700">— {SCORE_LABELS[selected]}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Drag to set your rating</p>
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

                  {/* Skip */}
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

      {/* Completion hint */}
      {questions.some((q) => !skipped.has(q.id) && getScore(q.id) === null) && (
        <p className="text-xs text-amber-600 font-medium">
          Please rate or skip all questions before continuing.
        </p>
      )}
    </div>
  );
}

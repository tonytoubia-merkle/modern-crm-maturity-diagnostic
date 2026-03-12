"use client";

import { cn } from "@/lib/utils";
import {
  CAPABILITY_LABELS,
  CAPABILITY_SUBTITLES,
  CAPABILITY_DESCRIPTIONS,
  QUESTIONS_BY_CAPABILITY,
  SCORE_LABELS,
} from "@/lib/data/questions";
import { ScoreButton } from "./ScoreButton";
import type { Capability, ResponseItem } from "@/lib/types";

interface CapabilitySectionProps {
  capability: Capability;
  responses: ResponseItem[];
  onScore: (questionId: number, score: number, capability: Capability) => void;
}

export function CapabilitySection({
  capability,
  responses,
  onScore,
}: CapabilitySectionProps) {
  const questions = QUESTIONS_BY_CAPABILITY[capability];
  const capabilityLabel = CAPABILITY_LABELS[capability];
  const subtitle = CAPABILITY_SUBTITLES[capability];
  const description = CAPABILITY_DESCRIPTIONS[capability];

  const getScore = (questionId: number) => {
    return responses.find((r) => r.questionId === questionId)?.score ?? null;
  };

  const allAnswered = questions.every((q) => getScore(q.id) !== null);

  return (
    <div className="space-y-6">
      {/* Capability header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            {subtitle}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{capabilityLabel}</h2>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {questions.map((question, idx) => {
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

              {/* Score scale */}
              <div className="ml-10 flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <ScoreButton
                    key={val}
                    value={val}
                    selected={selected === val}
                    onClick={() => onScore(question.id, val, capability)}
                  />
                ))}
              </div>

              {selected && (
                <div className="ml-10">
                  <p className="text-xs text-blue-600 font-medium">
                    Selected: {selected} — {SCORE_LABELS[selected]}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status */}
      {!allAnswered && (
        <p className="text-xs text-amber-600 font-medium">
          Please answer all {questions.length} questions before continuing.
        </p>
      )}
    </div>
  );
}

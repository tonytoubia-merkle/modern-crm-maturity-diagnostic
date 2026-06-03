"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { getAientScoreBgColor } from "@/lib/aient/scoring";
import {
  AIENT_CAPABILITIES_ORDER,
  AIENT_CAPABILITY_LABELS,
  AIENT_QUESTIONS_BY_CAPABILITY,
  AIENT_SCORE_LABELS,
  resolveAientQuestionText,
} from "@/lib/aient/data/questions";
import type {
  AientIndustry,
  AientResponseItem,
} from "@/lib/aient/types";

interface AientResponseDetailProps {
  responses: AientResponseItem[];
  industry?: AientIndustry | null;
}

/**
 * Per-question maturity detail for the results view: for each answered
 * core question, shows the chosen score and the matching level from the
 * question's 1-5 maturity ladder, so a reader understands what each
 * score actually means rather than just the capability average.
 */
export function AientResponseDetail({
  responses,
  industry,
}: AientResponseDetailProps) {
  const [expanded, setExpanded] = useState(false);

  const scoreById = new Map(
    responses.map((r) => [String(r.questionId), r.score])
  );

  const groups = AIENT_CAPABILITIES_ORDER.map((cap) => {
    const items = AIENT_QUESTIONS_BY_CAPABILITY[cap]
      .map((q) => ({ q, score: scoreById.get(String(q.id)) }))
      .filter((x): x is { q: (typeof x)["q"]; score: number } =>
        typeof x.score === "number"
      );
    return { cap, items };
  }).filter((g) => g.items.length > 0);

  const answered = groups.reduce((n, g) => n + g.items.length, 0);
  if (answered === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        {expanded
          ? "Hide question-level maturity detail"
          : `Show question-level maturity detail (${answered} answered)`}
      </button>

      {expanded && (
        <div className="mt-4 space-y-6">
          {groups.map(({ cap, items }) => (
            <div key={cap}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {AIENT_CAPABILITY_LABELS[cap]}
              </p>
              <div className="space-y-3">
                {items.map(({ q, score }) => (
                  <div
                    key={q.id}
                    className="rounded-xl border border-slate-200 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-slate-900 leading-relaxed">
                        {resolveAientQuestionText(q, industry)}
                      </p>
                      <span
                        className={cn(
                          "flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap",
                          getAientScoreBgColor(score)
                        )}
                      >
                        {score} · {AIENT_SCORE_LABELS[score]}
                      </span>
                    </div>
                    {q.maturityLevels && (
                      <p className="mt-2 text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 leading-relaxed">
                        {q.maturityLevels[score as 1 | 2 | 3 | 4 | 5]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

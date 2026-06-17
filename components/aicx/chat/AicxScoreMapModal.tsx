"use client";

import {
  AICX_CORE_QUESTIONS,
  AICX_INDUSTRY_QUESTIONS,
  AICX_CAPABILITIES_ORDER,
  AICX_CAPABILITY_LABELS,
  AICX_SCORE_LABELS,
  resolveAicxQuestionText,
} from "@/lib/aicx/data/questions";
import type { AicxInferredScore } from "@/lib/aicx/chat/types";
import type { AicxIndustry } from "@/lib/aicx/types";

interface AicxScoreMapModalProps {
  scores: Map<string, AicxInferredScore>;
  skipped: Set<string>;
  industry: AicxIndustry | null;
  onClose: () => void;
  onUpdateScore: (questionId: string, score: number) => void;
  onConfirm: () => void;
  confirming: boolean;
  allCovered: boolean;
  clientFacing?: boolean;
}

function ScoreRow({
  qId,
  text,
  score,
  isSkipped,
  onUpdateScore,
  clientFacing,
}: {
  qId: string;
  text: string;
  score: AicxInferredScore | undefined;
  isSkipped: boolean;
  onUpdateScore: (id: string, s: number) => void;
  clientFacing: boolean;
}) {
  return (
    <div className="py-2.5 border-b border-slate-50 last:border-b-0">
      <p
        className={`text-xs leading-relaxed mb-1.5 ${
          isSkipped ? "text-slate-400 line-through" : "text-slate-700"
        }`}
      >
        {text}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {isSkipped ? (
          <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-medium">
            Skipped
          </span>
        ) : (
          <>
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onClick={() => onUpdateScore(qId, v)}
                className={`w-6 h-6 rounded-full text-[10px] font-bold border transition-all ${
                  score?.score === v
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 text-slate-400 hover:border-blue-400"
                }`}
              >
                {v}
              </button>
            ))}
            {score && (
              <span className="text-[10px] text-slate-500 ml-0.5">
                {AICX_SCORE_LABELS[Math.round(score.score)]}
              </span>
            )}
          </>
        )}
      </div>
      {score?.evidence && !clientFacing && (
        <p className="text-[10px] text-slate-400 italic mt-1">
          {score.evidence}
        </p>
      )}
    </div>
  );
}

export function AicxScoreMapModal({
  scores,
  skipped,
  industry,
  onClose,
  onUpdateScore,
  onConfirm,
  confirming,
  allCovered,
  clientFacing = false,
}: AicxScoreMapModalProps) {
  const industryQuestions = industry
    ? AICX_INDUSTRY_QUESTIONS.filter((q) => q.industry === industry)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 pb-6 overflow-y-auto">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl mx-4 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900">
            {clientFacing ? "Your Results" : "Score Map"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
          {AICX_CAPABILITIES_ORDER.map((cap) => {
            const qs = AICX_CORE_QUESTIONS.filter((q) => q.capability === cap);
            return (
              <div key={cap}>
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: "#141419" }}
                >
                  {AICX_CAPABILITY_LABELS[cap]}
                </p>
                {qs.map((q) => (
                  <ScoreRow
                    key={q.id}
                    qId={String(q.id)}
                    text={resolveAicxQuestionText(q, industry)}
                    score={scores.get(String(q.id))}
                    isSkipped={skipped.has(String(q.id))}
                    onUpdateScore={onUpdateScore}
                    clientFacing={clientFacing}
                  />
                ))}
              </div>
            );
          })}

          {industryQuestions.length > 0 && (
            <div>
              <p
                className="text-xs font-bold uppercase tracking-wider mb-1.5"
                style={{ color: "#141419" }}
              >
                Industry Context
              </p>
              {industryQuestions.map((q) => (
                <ScoreRow
                  key={q.id}
                  qId={String(q.id)}
                  text={q.text}
                  score={scores.get(String(q.id))}
                  isSkipped={skipped.has(String(q.id))}
                  onUpdateScore={onUpdateScore}
                  clientFacing={clientFacing}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {scores.size} scored · {skipped.size} skipped
          </p>
          {allCovered && (
            <button
              onClick={onConfirm}
              disabled={confirming}
              className="px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#141419" }}
            >
              {confirming
                ? "Saving..."
                : clientFacing
                ? "See Full Results →"
                : "Confirm & Generate Results"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

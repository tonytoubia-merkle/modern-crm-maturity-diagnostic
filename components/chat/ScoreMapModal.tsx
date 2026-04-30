"use client";

import { CORE_QUESTIONS, INDUSTRY_QUESTIONS, CAPABILITIES_ORDER, CAPABILITY_LABELS, SCORE_LABELS, resolveQuestionText } from "@/lib/data/questions";
import type { InferredScore } from "@/lib/chat/types";
import type { Industry } from "@/lib/types";

interface ScoreMapModalProps {
  scores: Map<string, InferredScore>;
  skipped: Set<string>;
  industry: Industry | null;
  onClose: () => void;
  onUpdateScore: (questionId: string, score: number) => void;
  onConfirm: () => void;
  confirming: boolean;
  allCovered: boolean;
  averages?: { overall: Record<string, number>; industry: Record<string, number> | null } | null;
  clientFacing?: boolean;
}

function ScoreRow({
  qId,
  text,
  score,
  isSkipped,
  overallAvg,
  industryAvg,
  onUpdateScore,
  clientFacing,
}: {
  qId: string;
  text: string;
  score: InferredScore | undefined;
  isSkipped: boolean;
  overallAvg: number | undefined;
  industryAvg: number | undefined;
  onUpdateScore: (id: string, s: number) => void;
  clientFacing: boolean;
}) {
  return (
    <div className="py-2.5 border-b border-slate-50 last:border-b-0">
      <p className={`text-xs leading-relaxed mb-1.5 ${isSkipped ? "text-slate-400 line-through" : "text-slate-700"}`}>
        {text}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {isSkipped ? (
          <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-medium">Skipped</span>
        ) : (
          <>
            {/* Score pips */}
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
                {SCORE_LABELS[Math.round(score.score)]}
              </span>
            )}
          </>
        )}

        {/* Averages comparison */}
        {score && !isSkipped && (overallAvg || industryAvg) && (
          <span className="text-[10px] text-slate-400 ml-auto flex gap-2">
            {overallAvg && (
              <span>
                Avg <span className={`font-bold px-1 py-0.5 rounded ${
                  score.score > overallAvg ? "text-green-600 bg-green-50" :
                  score.score < overallAvg ? "text-red-500 bg-red-50" :
                  "text-slate-600 bg-slate-100"
                }`}>{overallAvg}</span>
              </span>
            )}
            {industryAvg && industryAvg !== overallAvg && (
              <span>
                Ind <span className={`font-bold px-1 py-0.5 rounded ${
                  score.score > industryAvg ? "text-green-600 bg-green-50" :
                  score.score < industryAvg ? "text-red-500 bg-red-50" :
                  "text-blue-600 bg-blue-50"
                }`}>{industryAvg}</span>
              </span>
            )}
          </span>
        )}
      </div>
      {score?.evidence && !clientFacing && (
        <p className="text-[10px] text-slate-400 italic mt-1">{score.evidence}</p>
      )}
    </div>
  );
}

export function ScoreMapModal({
  scores,
  skipped,
  industry,
  onClose,
  onUpdateScore,
  onConfirm,
  confirming,
  allCovered,
  averages,
  clientFacing = false,
}: ScoreMapModalProps) {
  const industryQuestions = industry ? INDUSTRY_QUESTIONS.filter((q) => q.industry === industry) : [];
  const allCapabilities = [...CAPABILITIES_ORDER];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 pb-6 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl mx-4 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-900">
            {clientFacing ? "Your Results" : "Score Map"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Legend for averages */}
        {averages && (
          <div className="flex items-center gap-4 text-[10px] text-slate-400 mb-3">
            <span>Your score shown on pips</span>
            <span>
              <span className="font-bold text-slate-600 bg-slate-100 px-1 py-0.5 rounded">Avg</span> = overall benchmark
            </span>
            {averages.industry && (
              <span>
                <span className="font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded">Ind</span> = industry benchmark
              </span>
            )}
            <span className="text-green-600">Green = above avg</span>
            <span className="text-red-500">Red = below avg</span>
          </div>
        )}

        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
          {/* Core questions by capability */}
          {allCapabilities.map((cap) => {
            const qs = CORE_QUESTIONS.filter((q) => q.capability === cap);
            return (
              <div key={cap}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#040e4b" }}>
                  {CAPABILITY_LABELS[cap]}
                </p>
                {qs.map((q) => (
                  <ScoreRow
                    key={q.id}
                    qId={String(q.id)}
                    text={resolveQuestionText(q, industry)}
                    score={scores.get(String(q.id))}
                    isSkipped={skipped.has(String(q.id))}
                    overallAvg={averages?.overall?.[String(q.id)]}
                    industryAvg={averages?.industry?.[String(q.id)]}
                    onUpdateScore={onUpdateScore}
                    clientFacing={clientFacing}
                  />
                ))}
              </div>
            );
          })}

          {/* Industry questions — same treatment as core */}
          {industryQuestions.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#040e4b" }}>
                {CAPABILITY_LABELS[industry!] || industry} — Industry Context
              </p>
              {industryQuestions.map((q) => (
                <ScoreRow
                  key={q.id}
                  qId={String(q.id)}
                  text={q.text}
                  score={scores.get(String(q.id))}
                  isSkipped={skipped.has(String(q.id))}
                  overallAvg={averages?.overall?.[String(q.id)]}
                  industryAvg={averages?.industry?.[String(q.id)]}
                  onUpdateScore={onUpdateScore}
                  clientFacing={clientFacing}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {scores.size} scored · {skipped.size} skipped
          </p>
          {allCovered && (
            <button
              onClick={onConfirm}
              disabled={confirming}
              className="px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#040e4b" }}
            >
              {confirming ? "Saving..." : clientFacing ? "See Full Results →" : "Confirm & Generate Results"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { CORE_QUESTIONS, INDUSTRY_QUESTIONS, CAPABILITIES_ORDER, CAPABILITY_LABELS, SCORE_LABELS } from "@/lib/data/questions";
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
}: ScoreMapModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Score Map</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
          {CAPABILITIES_ORDER.map((cap) => {
            const qs = CORE_QUESTIONS.filter((q) => q.capability === cap);
            return (
              <div key={cap}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {CAPABILITY_LABELS[cap]}
                </p>
                <div className="space-y-1.5">
                  {qs.map((q) => {
                    const s = scores.get(String(q.id));
                    const isSkipped = skipped.has(String(q.id));
                    const shortText = q.text.replace(/^To what extent (does |are |is |can )?the organization('s)? /i, "").replace(/\?$/, "");

                    return (
                      <div key={q.id} className="flex items-start gap-3 py-1.5">
                        <span className="text-[10px] text-slate-400 font-mono w-6 flex-shrink-0 mt-0.5">Q{q.id}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${isSkipped ? "text-slate-400 line-through" : "text-slate-700"}`}>
                            {shortText}
                          </p>
                          {s && (
                            <p className="text-[10px] text-slate-400 italic mt-0.5">{s.evidence}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {isSkipped ? (
                            <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-medium">Skipped</span>
                          ) : (
                            [1, 2, 3, 4, 5].map((v) => (
                              <button
                                key={v}
                                onClick={() => onUpdateScore(String(q.id), v)}
                                className={`w-6 h-6 rounded-full text-[10px] font-bold border transition-all ${
                                  s?.score === v
                                    ? "border-blue-600 bg-blue-600 text-white"
                                    : "border-slate-200 text-slate-400 hover:border-blue-400"
                                }`}
                              >
                                {v}
                              </button>
                            ))
                          )}
                          {!s && !isSkipped && (
                            <span className="text-[10px] text-slate-300">—</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Industry questions */}
          {industry && (() => {
            const indQs = INDUSTRY_QUESTIONS.filter((q) => q.industry === industry);
            if (indQs.length === 0) return null;
            return (
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Industry ({industry})
                </p>
                <div className="space-y-1.5">
                  {indQs.map((q) => {
                    const s = scores.get(String(q.id));
                    const isSkipped = skipped.has(String(q.id));
                    return (
                      <div key={q.id} className="flex items-start gap-3 py-1.5">
                        <span className="text-[10px] text-slate-400 font-mono w-6 flex-shrink-0 mt-0.5">{q.id}</span>
                        <p className={`flex-1 text-xs ${isSkipped ? "text-slate-400 line-through" : "text-slate-700"}`}>
                          {q.text}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {isSkipped ? (
                            <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-medium">Skipped</span>
                          ) : s ? (
                            <span className="text-xs font-bold" style={{ color: "#00205B" }}>{s.score}</span>
                          ) : (
                            <span className="text-[10px] text-slate-300">—</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
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
              style={{ backgroundColor: "#00205B" }}
            >
              {confirming ? "Saving..." : "Confirm & Generate Results"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

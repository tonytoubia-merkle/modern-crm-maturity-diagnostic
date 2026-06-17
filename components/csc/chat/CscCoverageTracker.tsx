"use client";

import {
  CSC_CAPABILITY_LABELS,
  CSC_CAPABILITIES_ORDER,
  CSC_QUESTIONS_BY_CAPABILITY,
} from "@/lib/csc/data/questions";
import type { CscInferredScore, CscChatPhase } from "@/lib/csc/chat/types";

interface CscCoverageTrackerProps {
  scores: Map<string, CscInferredScore>;
  skipped: Set<string>;
  totalQuestions: number;
  phase: CscChatPhase;
  onViewScoreMap: () => void;
}

const PHASE_LABELS: Record<CscChatPhase, string> = {
  opening: "Getting started",
  exploration: "Exploring capabilities",
  gap_filling: "Filling gaps",
  confirmation: "Review scores",
  complete: "Complete",
};

export function CscCoverageTracker({
  scores,
  skipped,
  totalQuestions,
  phase,
  onViewScoreMap,
}: CscCoverageTrackerProps) {
  const covered = scores.size + skipped.size;
  const pct =
    totalQuestions > 0 ? Math.round((covered / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Phase
        </p>
        <p className="text-xs font-medium text-slate-700">
          {PHASE_LABELS[phase]}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Coverage
          </p>
          <p className="text-xs font-bold" style={{ color: "#141419" }}>
            {covered}/{totalQuestions}
          </p>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: "#141419" }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {CSC_CAPABILITIES_ORDER.map((cap) => {
          const qs = CSC_QUESTIONS_BY_CAPABILITY[cap];
          const answered = qs.filter(
            (q) => scores.has(String(q.id)) || skipped.has(String(q.id))
          ).length;
          const capPct = qs.length > 0 ? (answered / qs.length) * 100 : 0;

          return (
            <div key={cap}>
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-slate-600 font-medium">
                  {CSC_CAPABILITY_LABELS[cap]}
                </p>
                <p className="text-[10px] text-slate-400">
                  {answered}/{qs.length}
                </p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1 mt-0.5">
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: `${capPct}%`,
                    backgroundColor: capPct === 100 ? "#16a34a" : "#141419",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100">
        {covered > 0 && (
          <button
            onClick={onViewScoreMap}
            className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            View Score Map
          </button>
        )}
      </div>
    </div>
  );
}

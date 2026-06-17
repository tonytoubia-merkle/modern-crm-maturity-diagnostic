"use client";

import {
  B2B_CAPABILITY_LABELS,
  B2B_CAPABILITIES_ORDER,
  B2B_QUESTIONS_BY_CAPABILITY,
} from "@/lib/b2b/data/questions";
import type { B2bInferredScore, B2bChatPhase } from "@/lib/b2b/chat/types";

interface B2bCoverageTrackerProps {
  scores: Map<string, B2bInferredScore>;
  skipped: Set<string>;
  totalQuestions: number;
  phase: B2bChatPhase;
  onViewScoreMap: () => void;
}

const PHASE_LABELS: Record<B2bChatPhase, string> = {
  opening: "Getting started",
  exploration: "Exploring capabilities",
  gap_filling: "Filling gaps",
  confirmation: "Review scores",
  complete: "Complete",
};

export function B2bCoverageTracker({
  scores,
  skipped,
  totalQuestions,
  phase,
  onViewScoreMap,
}: B2bCoverageTrackerProps) {
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
        {B2B_CAPABILITIES_ORDER.map((cap) => {
          const qs = B2B_QUESTIONS_BY_CAPABILITY[cap];
          const answered = qs.filter(
            (q) => scores.has(String(q.id)) || skipped.has(String(q.id))
          ).length;
          const capPct = qs.length > 0 ? (answered / qs.length) * 100 : 0;

          return (
            <div key={cap}>
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-slate-600 font-medium">
                  {B2B_CAPABILITY_LABELS[cap]}
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

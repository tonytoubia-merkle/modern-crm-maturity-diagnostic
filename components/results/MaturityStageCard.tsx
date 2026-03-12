"use client";

import { cn } from "@/lib/utils";
import { MATURITY_STAGES } from "@/lib/scoring";
import type { MaturityStage } from "@/lib/types";

interface MaturityStageCardProps {
  stage: MaturityStage;
  overallScore: number;
}

const STAGE_COLORS: Record<
  MaturityStage,
  { bg: string; border: string; badge: string; text: string; bar: string }
> = {
  1: {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
    text: "text-red-900",
    bar: "bg-red-500",
  },
  2: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    text: "text-orange-900",
    bar: "bg-orange-500",
  },
  3: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    text: "text-blue-900",
    bar: "bg-blue-500",
  },
  4: {
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
    text: "text-green-900",
    bar: "bg-green-500",
  },
};

export function MaturityStageCard({
  stage,
  overallScore,
}: MaturityStageCardProps) {
  const info = MATURITY_STAGES[stage];
  const colors = STAGE_COLORS[stage];
  const pct = ((overallScore - 1) / 4) * 100;

  return (
    <div className={cn("rounded-xl border p-6", colors.bg, colors.border)}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Current Maturity Stage
          </p>
          <h3 className={cn("text-xl font-bold", colors.text)}>
            {info.label}
          </h3>
        </div>
        <div className={cn("px-3 py-1.5 rounded-lg text-sm font-bold flex-shrink-0", colors.badge)}>
          {overallScore.toFixed(1)} / 5.0
        </div>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed mb-4">
        {info.description}
      </p>

      {/* Score bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Stage 1</span>
          <span>Stage 2</span>
          <span>Stage 3</span>
          <span>Stage 4</span>
        </div>
        <div className="relative w-full bg-slate-200 rounded-full h-2.5">
          {/* Stage markers */}
          {[25, 50, 75].map((p) => (
            <div
              key={p}
              className="absolute top-0 w-0.5 h-2.5 bg-white z-10"
              style={{ left: `${p}%` }}
            />
          ))}
          <div
            className={cn("h-2.5 rounded-full transition-all", colors.bar)}
            style={{ width: `${Math.max(2, pct)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

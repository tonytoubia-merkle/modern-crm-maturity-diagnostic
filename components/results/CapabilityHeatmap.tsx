"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  getScoreBarColor,
  getScoreBgColor,
  formatScore,
} from "@/lib/scoring";
import { SCORE_LABELS } from "@/lib/data/questions";
import type { CapabilityScore } from "@/lib/types";

interface CapabilityHeatmapProps {
  scores: CapabilityScore[];
}

const CAPABILITY_SHORT: Record<string, string> = {
  identity: "Identity",
  signals: "Signals",
  decisioning: "Decisioning",
  engagement: "Engagement",
  media_activation: "Media",
  learning_optimization: "Learning",
};

export function CapabilityHeatmap({ scores }: CapabilityHeatmapProps) {
  const radarData = scores.map((s) => ({
    capability: CAPABILITY_SHORT[s.capability] ?? s.label,
    score: s.score,
    fullMark: 5,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar chart */}
        <div className="flex flex-col">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Capability Radar
          </p>
          <div className="flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="capability"
                  tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 5]}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickCount={6}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${formatScore(value)} — ${SCORE_LABELS[Math.round(value)] ?? ""}`,
                    "Score",
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score table */}
        <div className="flex flex-col">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Capability Scores
          </p>
          <div className="space-y-3">
            {scores.map((s) => {
              const pct = (s.score / 5) * 100;
              const roundedScore = Math.round(s.score);
              const scoreLabel =
                SCORE_LABELS[roundedScore] ?? SCORE_LABELS[Math.ceil(s.score)];
              return (
                <div key={s.capability}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-sm font-semibold text-slate-800">
                        {s.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full border",
                          getScoreBgColor(s.score)
                        )}
                      >
                        {scoreLabel}
                      </span>
                      <span className="text-sm font-bold text-slate-900 w-8 text-right">
                        {formatScore(s.score)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all",
                        getScoreBarColor(s.score)
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Score legend */}
      <div className="border-t border-slate-100 pt-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Maturity Scale
        </p>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((v) => (
            <div
              key={v}
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border",
                getScoreBgColor(v)
              )}
            >
              <span className="font-bold">{v}</span>
              <span>—</span>
              <span>{SCORE_LABELS[v]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

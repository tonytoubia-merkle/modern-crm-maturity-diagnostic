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
  getB2bScoreBarColor,
  getB2bScoreBgColor,
  formatB2bScore,
} from "@/lib/b2b/scoring";
import { B2B_SCORE_LABELS } from "@/lib/b2b/data/questions";
import type { B2bCapabilityScore } from "@/lib/b2b/types";

const CAPABILITY_SHORT: Record<string, string> = {
  strategy_planning: "Strategy",
  workflow_production: "Workflow",
  asset_governance: "Assets",
  distribution_activation: "Activation",
  measurement_insights: "Measurement",
  intelligence_automation: "AI & Search",
};

interface B2bCapabilityHeatmapProps {
  scores: B2bCapabilityScore[];
}

const PRIMARY = "#0328d1";

export function B2bCapabilityHeatmap({ scores }: B2bCapabilityHeatmapProps) {
  const radarData = scores.map((s) => ({
    capability: CAPABILITY_SHORT[s.capability] ?? s.label,
    score: s.score,
    fullMark: 5,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Capability Radar
          </p>
          <div className="flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart
                data={radarData}
                margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
              >
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
                  name="This result"
                  dataKey="score"
                  stroke={PRIMARY}
                  fill={PRIMARY}
                  fillOpacity={0.18}
                  strokeWidth={2}
                  dot={{ r: 4, fill: PRIMARY, strokeWidth: 0 }}
                  isAnimationActive={false}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (typeof value !== "number") return ["–", name];
                    const rounded = Math.round(value);
                    const label = B2B_SCORE_LABELS[rounded] ?? "";
                    return [
                      `${formatB2bScore(value)}${
                        label ? ` – ${label}` : ""
                      }`,
                      name,
                    ];
                  }}
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

        <div className="flex flex-col">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Capability Scores
          </p>
          <div className="space-y-3">
            {scores.map((s) => {
              const pct = (s.score / 5) * 100;
              const roundedScore = Math.round(s.score);
              const scoreLabel =
                B2B_SCORE_LABELS[roundedScore] ??
                B2B_SCORE_LABELS[Math.ceil(s.score)];
              return (
                <div key={s.capability}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-sm font-semibold text-slate-800">
                        {s.label}
                      </span>
                      {s.subtitle && (
                        <span className="ml-2 text-xs text-slate-500">
                          {s.subtitle}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full border",
                          getB2bScoreBgColor(s.score)
                        )}
                      >
                        {scoreLabel}
                      </span>
                      <span className="text-sm font-bold text-slate-900 w-8 text-right">
                        {formatB2bScore(s.score)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all",
                        getB2bScoreBarColor(s.score)
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
                getB2bScoreBgColor(v)
              )}
            >
              <span className="font-bold">{v}</span>
              <span>–</span>
              <span>{B2B_SCORE_LABELS[v]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  getScoreBarColor,
  getScoreBgColor,
  formatScore,
} from "@/lib/scoring";
import { SCORE_LABELS } from "@/lib/data/questions";
import type { Capability, CapabilityScore } from "@/lib/types";

const CAPABILITY_SHORT: Record<string, string> = {
  identity: "Identity",
  signals: "Signals",
  decisioning: "Decisioning",
  engagement: "Engagement",
  media_activation: "Media",
  learning_optimization: "Learning",
  technology: "Technology",
  organization: "Org & Process",
};

export interface HeatmapBenchmarks {
  overall?: Partial<Record<Capability, number>>;
  industry?: Partial<Record<Capability, number>>;
  industryLabel?: string;
  sampleSize?: { overall?: number; industry?: number | null };
}

interface CapabilityHeatmapProps {
  scores: CapabilityScore[];
  benchmarks?: HeatmapBenchmarks | null;
  /** Minimum completed assessments required to show a benchmark series. */
  minSample?: number;
}

type BenchmarkMode = "both" | "overall" | "industry" | "off";

const PRIMARY = "#2563eb";
const OVERALL_BM = "#64748b";
const INDUSTRY_BM = "#f59e0b";

export function CapabilityHeatmap({
  scores,
  benchmarks,
  minSample = 3,
}: CapabilityHeatmapProps) {
  const overallN = benchmarks?.sampleSize?.overall ?? 0;
  const industryN = benchmarks?.sampleSize?.industry ?? 0;
  const hasOverall =
    !!benchmarks?.overall &&
    Object.keys(benchmarks.overall).length > 0 &&
    overallN >= minSample;
  const hasIndustry =
    !!benchmarks?.industry &&
    Object.keys(benchmarks.industry).length > 0 &&
    industryN >= minSample;
  const hasAnyBenchmark = hasOverall || hasIndustry;

  // Default to "both" when benchmarks exist so the comparison is the headline.
  const [mode, setMode] = useState<BenchmarkMode>(hasAnyBenchmark ? "both" : "off");

  const showOverall = hasOverall && (mode === "both" || mode === "overall");
  const showIndustry = hasIndustry && (mode === "both" || mode === "industry");

  const radarData = scores.map((s) => ({
    capability: CAPABILITY_SHORT[s.capability] ?? s.label,
    score: s.score,
    overallAvg: benchmarks?.overall?.[s.capability],
    industryAvg: benchmarks?.industry?.[s.capability],
    fullMark: 5,
  }));

  const toggleBtnClass = (active: boolean, disabled?: boolean) =>
    cn(
      "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors",
      active
        ? "bg-white text-slate-900 shadow-sm"
        : "text-slate-500 hover:text-slate-700",
      disabled && "opacity-40 cursor-not-allowed hover:text-slate-500"
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar chart */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Capability Radar
            </p>
            {hasAnyBenchmark && (
              <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5">
                <button
                  type="button"
                  onClick={() => setMode("both")}
                  className={toggleBtnClass(mode === "both")}
                  disabled={!hasOverall && !hasIndustry}
                >
                  Both
                </button>
                <button
                  type="button"
                  onClick={() => setMode("overall")}
                  className={toggleBtnClass(mode === "overall", !hasOverall)}
                  disabled={!hasOverall}
                  title={hasOverall ? undefined : "Not enough completed assessments"}
                >
                  Overall
                </button>
                <button
                  type="button"
                  onClick={() => setMode("industry")}
                  className={toggleBtnClass(mode === "industry", !hasIndustry)}
                  disabled={!hasIndustry}
                  title={
                    hasIndustry
                      ? undefined
                      : industryN > 0
                      ? `Only ${industryN} completed – need ≥ ${minSample}`
                      : "No industry benchmark available"
                  }
                >
                  {benchmarks?.industryLabel ?? "Industry"}
                </button>
                <button
                  type="button"
                  onClick={() => setMode("off")}
                  className={toggleBtnClass(mode === "off")}
                >
                  Off
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height={300}>
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
                {/* Benchmark layers render underneath the primary series. */}
                {showOverall && (
                  <Radar
                    name={`All completed (n=${overallN})`}
                    dataKey="overallAvg"
                    stroke={OVERALL_BM}
                    fill={OVERALL_BM}
                    fillOpacity={0.05}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    dot={{ r: 2.5, fill: OVERALL_BM, strokeWidth: 0 }}
                    isAnimationActive={false}
                  />
                )}
                {showIndustry && (
                  <Radar
                    name={`${benchmarks?.industryLabel ?? "Industry"} avg (n=${industryN})`}
                    dataKey="industryAvg"
                    stroke={INDUSTRY_BM}
                    fill={INDUSTRY_BM}
                    fillOpacity={0.08}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    dot={{ r: 2.5, fill: INDUSTRY_BM, strokeWidth: 0 }}
                    isAnimationActive={false}
                  />
                )}
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
                    const label = SCORE_LABELS[rounded] ?? "";
                    return [`${formatScore(value)}${label ? ` – ${label}` : ""}`, name];
                  }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                {(showOverall || showIndustry) && (
                  <Legend
                    wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                    iconSize={10}
                  />
                )}
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {benchmarks && !hasAnyBenchmark && (
            <p className="text-[11px] text-slate-400 mt-2">
              Benchmarks available once at least {minSample} diagnostics are
              completed{benchmarks.industryLabel ? ` for ${benchmarks.industryLabel}` : ""}.
            </p>
          )}
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
              const overallAvg = benchmarks?.overall?.[s.capability];
              const industryAvg = benchmarks?.industry?.[s.capability];
              const showOverallChip = hasOverall && typeof overallAvg === "number";
              const showIndustryChip = hasIndustry && typeof industryAvg === "number";
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
                  {(showOverallChip || showIndustryChip) && (
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                      {showOverallChip && (
                        <span className="inline-flex items-center gap-1">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: OVERALL_BM }}
                          />
                          Avg {formatScore(overallAvg!)}
                        </span>
                      )}
                      {showIndustryChip && (
                        <span className="inline-flex items-center gap-1">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: INDUSTRY_BM }}
                          />
                          {benchmarks?.industryLabel ?? "Industry"}{" "}
                          {formatScore(industryAvg!)}
                        </span>
                      )}
                    </div>
                  )}
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
              <span>–</span>
              <span>{SCORE_LABELS[v]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

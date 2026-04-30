import type {
  AientCapability,
  AientMaturityStage,
  AientCapabilityScore,
  AientResponseItem,
  AientDiagnosticResults,
  AientAssessment,
} from "@/lib/aient/types";
import {
  AIENT_CAPABILITIES_ORDER,
  AIENT_CAPABILITY_LABELS,
  AIENT_CAPABILITY_SUBTITLES,
  AIENT_QUESTIONS_BY_CAPABILITY,
} from "@/lib/aient/data/questions";
import { getAientTriggeredOpportunities } from "@/lib/aient/data/opportunities";

/**
 * Per-capability average. Mirrors B2B/CSC/AI for CX scoring exactly so the
 * same dashboard components can render any of the diagnostics.
 */
export function computeAientCapabilityScores(
  responses: AientResponseItem[]
): Record<AientCapability, number> {
  const scores: Record<string, number> = {};

  for (const cap of AIENT_CAPABILITIES_ORDER) {
    const coreQs = AIENT_QUESTIONS_BY_CAPABILITY[cap];
    const coreResponses = responses.filter(
      (r) => !r.isIndustryQuestion && r.capability === cap
    );

    if (coreResponses.length === 0) {
      scores[cap] = 0;
      continue;
    }

    const total = coreResponses.reduce((sum, r) => sum + r.score, 0);
    scores[cap] = Math.round((total / coreQs.length) * 100) / 100;
  }

  return scores as Record<AientCapability, number>;
}

export function computeAientOverallScore(
  capabilityScores: Record<AientCapability, number>
): number {
  const values = AIENT_CAPABILITIES_ORDER.map((c) => capabilityScores[c]).filter(
    (v) => v > 0
  );
  if (values.length === 0) return 0;
  const total = values.reduce((sum, v) => sum + v, 0);
  return Math.round((total / values.length) * 100) / 100;
}

export function computeAientMaturityStage(overallScore: number): AientMaturityStage {
  if (overallScore < 1.75) return 1;
  if (overallScore < 2.75) return 2;
  if (overallScore < 3.75) return 3;
  return 4;
}

// Stage labels and narratives sourced from the Merkle 2026 "AI for
// Enterprise: Powering Intelligence" research and the McKinsey Nov 2025
// "State of AI" findings — the maturity arc tracks the gap between the
// 12% of organisations capturing meaningful EBIT impact ("AI high
// performers") and the long tail still running disconnected pilots.
export const AIENT_MATURITY_STAGES: Record<
  AientMaturityStage,
  { label: string; description: string; color: string }
> = {
  1: {
    label: "Stage 1 — Disconnected Pilots",
    description:
      "AI investment is happening — but as scattered pilots that don't share data, governance, or measurement. Data foundations are fragmented, use cases are picked by enthusiasm rather than rigor, and there's no coherent operating model for AI work. Workforce impact is unmanaged and adoption is uneven. This is the cohort the McKinsey 2025 research describes as 'investing without realised EBIT impact.' Stage 1 organizations typically benefit most from a North Star AI Diagnostic + a Data Foundations Audit before any further platform investment.",
    color: "red",
  },
  2: {
    label: "Stage 2 — Coordinated AI",
    description:
      "AI use cases are being prioritised through a portfolio view, the data and ML platform is partially modernised, and a governance group exists on paper. Generative pilots have moved beyond experiments in one or two functions. But work hasn't been redesigned around AI, intelligence delivery is still reporting-led rather than embedded in workflows, and assurance frameworks lag behind regulator expectations. Stage 2 organizations are ready to anchor their next investment in an Agile Operating Model engagement or an Analytics Advisory roadmap on a single, high-value value stream.",
    color: "orange",
  },
  3: {
    label: "Stage 3 — Embedded Intelligence",
    description:
      "AI is embedded inside the workflows that matter — the data foundation is governed and trustworthy, work has been redesigned around human + AI teaming, and intelligence (copilots, agentic workflows, embedded ML) is delivered where decisions get made rather than in standalone dashboards. AI assurance, model risk, and explainability are run as a managed practice. Adoption metrics are tracked at the workflow level. Stage 3 organizations are positioned for full Enterprise Intelligence Transformation engagements that scale agentic capabilities across multiple value streams.",
    color: "blue",
  },
  4: {
    label: "Stage 4 — AI High Performer",
    description:
      "The enterprise operates as the McKinsey/Merkle research describes the 'AI high performer' cohort — fundamentally redesigned workflows, multi-agent orchestration in production, EBIT impact attributed to AI, and a continuously improving data + assurance platform. AI is woven through strategy, operations, and customer experience; talent, culture, and governance keep pace with technology. Stage 4 organizations engage Merkle for Continuous Value Accelerator programs that keep the intelligence engine ahead of regulatory shifts and emerging model architectures.",
    color: "green",
  },
};

export function buildAientCapabilityScoresList(
  scores: Record<AientCapability, number>
): AientCapabilityScore[] {
  return AIENT_CAPABILITIES_ORDER.map((cap) => ({
    capability: cap,
    label: AIENT_CAPABILITY_LABELS[cap],
    subtitle: AIENT_CAPABILITY_SUBTITLES[cap],
    score: scores[cap],
    questionCount: AIENT_QUESTIONS_BY_CAPABILITY[cap].length,
  })) as AientCapabilityScore[];
}

export function buildAientDiagnosticResults(
  assessment: AientAssessment,
  responses: AientResponseItem[]
): AientDiagnosticResults {
  const capScoresRaw = computeAientCapabilityScores(responses);
  const overallScore = computeAientOverallScore(capScoresRaw);
  const maturityStage = computeAientMaturityStage(overallScore);
  const stageInfo = AIENT_MATURITY_STAGES[maturityStage];
  const capabilityScores = buildAientCapabilityScoresList(capScoresRaw);
  const opportunities = getAientTriggeredOpportunities(capScoresRaw);

  return {
    assessment: {
      ...assessment,
      capabilityScores: capScoresRaw,
      overallScore,
      maturityStage,
    },
    capabilityScores,
    overallScore,
    maturityStage,
    maturityLabel: stageInfo.label,
    maturityDescription: stageInfo.description,
    opportunities,
  };
}

export function getAientScoreColor(score: number): string {
  if (score < 1.75) return "text-red-600";
  if (score < 2.75) return "text-orange-500";
  if (score < 3.5) return "text-amber-500";
  if (score < 4.5) return "text-blue-600";
  return "text-green-600";
}

export function getAientScoreBgColor(score: number): string {
  if (score < 1.75) return "bg-red-100 text-red-700 border-red-200";
  if (score < 2.75) return "bg-orange-100 text-orange-700 border-orange-200";
  if (score < 3.5) return "bg-amber-100 text-amber-700 border-amber-200";
  if (score < 4.5) return "bg-blue-100 text-blue-700 border-blue-200";
  return "bg-green-100 text-green-700 border-green-200";
}

export function getAientScoreBarColor(score: number): string {
  if (score < 1.75) return "bg-red-500";
  if (score < 2.75) return "bg-orange-500";
  if (score < 3.5) return "bg-amber-500";
  if (score < 4.5) return "bg-blue-500";
  return "bg-green-500";
}

export function formatAientScore(score: number): string {
  return score.toFixed(1);
}

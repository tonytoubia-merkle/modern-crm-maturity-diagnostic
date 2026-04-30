import type {
  AicxCapability,
  AicxMaturityStage,
  AicxCapabilityScore,
  AicxResponseItem,
  AicxDiagnosticResults,
  AicxAssessment,
} from "@/lib/aicx/types";
import {
  AICX_CAPABILITIES_ORDER,
  AICX_CAPABILITY_LABELS,
  AICX_CAPABILITY_SUBTITLES,
  AICX_QUESTIONS_BY_CAPABILITY,
} from "@/lib/aicx/data/questions";
import { getAicxTriggeredOpportunities } from "@/lib/aicx/data/opportunities";

/**
 * Per-capability average. Mirrors B2B/CSC scoring exactly so the same
 * dashboard components can render any of the diagnostics.
 */
export function computeAicxCapabilityScores(
  responses: AicxResponseItem[]
): Record<AicxCapability, number> {
  const scores: Record<string, number> = {};

  for (const cap of AICX_CAPABILITIES_ORDER) {
    const coreQs = AICX_QUESTIONS_BY_CAPABILITY[cap];
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

  return scores as Record<AicxCapability, number>;
}

export function computeAicxOverallScore(
  capabilityScores: Record<AicxCapability, number>
): number {
  const values = AICX_CAPABILITIES_ORDER.map((c) => capabilityScores[c]).filter(
    (v) => v > 0
  );
  if (values.length === 0) return 0;
  const total = values.reduce((sum, v) => sum + v, 0);
  return Math.round((total / values.length) * 100) / 100;
}

export function computeAicxMaturityStage(overallScore: number): AicxMaturityStage {
  if (overallScore < 1.75) return 1;
  if (overallScore < 2.75) return 2;
  if (overallScore < 3.75) return 3;
  return 4;
}

// Stage labels and narratives sourced from the Merkle 2026 "AI for CX"
// deep dive – the maturity arc spans from "AI-invisible" (excluded by
// agents and LLMs) through to an "Adaptive AI Experience" where agentic
// discoverability, agentic experience, adaptive personalization, and
// continuous experimentation operate as a single, measurable engine.
export const AICX_MATURITY_STAGES: Record<
  AicxMaturityStage,
  { label: string; description: string; color: string }
> = {
  1: {
    label: "Stage 1 – AI-Invisible",
    description:
      "The brand is not represented in agentic answers – content is unstructured for AI extraction, the digital experience is built for human-only browsing, and AI investments are unmeasured. Personalization is rule-based or batched, identity is fragmented, and there is no experimentation infrastructure to prove what works. Stage 1 organizations typically benefit most from an AI for CX Diagnostic + Discoverability Audit to establish a baseline before any platform investment lands.",
    color: "red",
  },
  2: {
    label: "Stage 2 – AI-Aware",
    description:
      "The brand has begun structuring content for AI agents, has piloted generative or conversational experiences in one or two surfaces, and is running early personalization use cases on a unified identity layer. But these efforts are isolated – discoverability, experience, personalization, and measurement aren't yet stitched together. Experimentation is inconsistent. Stage 2 organizations are ready to anchor their next investment in an AI for CX Workshop on a single high-value journey or an EXO Optimization Strategy engagement.",
    color: "orange",
  },
  3: {
    label: "Stage 3 – AI-Native",
    description:
      "Agentic discoverability, agentic experience, and adaptive personalization run together on a unified identity and data foundation, with measurement scorecards proving incremental value. AI is embedded in customer-facing journeys (chat, search, conversational commerce) and continuously tested through structured experimentation. Trust signals – confidence scoring, trigger logic, brand-safety guardrails – are consistently applied. Stage 3 organizations are positioned for full AI for CX Transformation engagements that scale agentic capabilities across the experience.",
    color: "blue",
  },
  4: {
    label: "Stage 4 – Adaptive AI Experience",
    description:
      "The brand operates as an adaptive AI experience – discoverability, agentic interfaces, real-time personalization, and continuous experimentation form a single closed-loop engine. AI agents handle high-volume customer interactions while humans focus on relationship and complexity. Every AI investment is validated through factorial experimentation, holdouts, and outcome scorecards. Trust, brand safety, and confidence thresholds are governed continuously. Stage 4 organizations engage Merkle for Continuous Value Accelerator programs that keep their AI-for-CX engine ahead of platform shifts and emerging agent ecosystems.",
    color: "green",
  },
};

export function buildAicxCapabilityScoresList(
  scores: Record<AicxCapability, number>
): AicxCapabilityScore[] {
  return AICX_CAPABILITIES_ORDER.map((cap) => ({
    capability: cap,
    label: AICX_CAPABILITY_LABELS[cap],
    subtitle: AICX_CAPABILITY_SUBTITLES[cap],
    score: scores[cap],
    questionCount: AICX_QUESTIONS_BY_CAPABILITY[cap].length,
  })) as AicxCapabilityScore[];
}

export function buildAicxDiagnosticResults(
  assessment: AicxAssessment,
  responses: AicxResponseItem[]
): AicxDiagnosticResults {
  const capScoresRaw = computeAicxCapabilityScores(responses);
  const overallScore = computeAicxOverallScore(capScoresRaw);
  const maturityStage = computeAicxMaturityStage(overallScore);
  const stageInfo = AICX_MATURITY_STAGES[maturityStage];
  const capabilityScores = buildAicxCapabilityScoresList(capScoresRaw);
  const opportunities = getAicxTriggeredOpportunities(capScoresRaw);

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

export function getAicxScoreColor(score: number): string {
  if (score < 1.75) return "text-red-600";
  if (score < 2.75) return "text-orange-500";
  if (score < 3.5) return "text-amber-500";
  if (score < 4.5) return "text-blue-600";
  return "text-green-600";
}

export function getAicxScoreBgColor(score: number): string {
  if (score < 1.75) return "bg-red-100 text-red-700 border-red-200";
  if (score < 2.75) return "bg-orange-100 text-orange-700 border-orange-200";
  if (score < 3.5) return "bg-amber-100 text-amber-700 border-amber-200";
  if (score < 4.5) return "bg-blue-100 text-blue-700 border-blue-200";
  return "bg-green-100 text-green-700 border-green-200";
}

export function getAicxScoreBarColor(score: number): string {
  if (score < 1.75) return "bg-red-500";
  if (score < 2.75) return "bg-orange-500";
  if (score < 3.5) return "bg-amber-500";
  if (score < 4.5) return "bg-blue-500";
  return "bg-green-500";
}

export function formatAicxScore(score: number): string {
  return score.toFixed(1);
}

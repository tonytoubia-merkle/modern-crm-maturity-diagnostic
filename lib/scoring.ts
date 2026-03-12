import type {
  Capability,
  MaturityStage,
  CapabilityScore,
  ResponseItem,
  DiagnosticResults,
  Assessment,
} from "@/lib/types";
import {
  CAPABILITIES_ORDER,
  CAPABILITY_LABELS,
  CAPABILITY_SUBTITLES,
  QUESTIONS_BY_CAPABILITY,
} from "@/lib/data/questions";
import { getTriggeredOpportunities } from "@/lib/data/opportunities";

export function computeCapabilityScores(
  responses: ResponseItem[]
): Record<Capability, number> {
  const scores: Record<string, number> = {};

  for (const cap of CAPABILITIES_ORDER) {
    const coreQs = QUESTIONS_BY_CAPABILITY[cap];
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

  return scores as Record<Capability, number>;
}

export function computeOverallScore(
  capabilityScores: Record<Capability, number>
): number {
  const values = CAPABILITIES_ORDER.map((c) => capabilityScores[c]).filter(
    (v) => v > 0
  );
  if (values.length === 0) return 0;
  const total = values.reduce((sum, v) => sum + v, 0);
  return Math.round((total / values.length) * 100) / 100;
}

export function computeMaturityStage(overallScore: number): MaturityStage {
  if (overallScore < 1.75) return 1;
  if (overallScore < 2.75) return 2;
  if (overallScore < 3.75) return 3;
  return 4;
}

export const MATURITY_STAGES: Record<
  MaturityStage,
  { label: string; description: string; color: string }
> = {
  1: {
    label: "Stage 1 — Campaign-Centric CRM",
    description:
      "Channels operate independently with limited customer recognition. CRM activity is largely campaign-driven with minimal use of behavioral signals or personalization.",
    color: "red",
  },
  2: {
    label: "Stage 2 — Segmented Engagement",
    description:
      "Basic segmentation and lifecycle messaging exist. The organization has begun connecting customer data across some channels but lacks consistent orchestration or real-time responsiveness.",
    color: "amber",
  },
  3: {
    label: "Stage 3 — Orchestrated Engagement",
    description:
      "Customer signals drive engagement across channels. The organization operates an increasingly connected CRM engine with predictive decisioning, loyalty integration, and first-party media activation.",
    color: "blue",
  },
  4: {
    label: "Stage 4 — Relationship Growth Engine",
    description:
      "Signals continuously power engagement, loyalty, and media growth. The organization operates a fully orchestrated, data-driven CRM system that compounds performance through continuous experimentation and optimization.",
    color: "green",
  },
};

export function buildCapabilityScoresList(
  scores: Record<Capability, number>
): CapabilityScore[] {
  return CAPABILITIES_ORDER.map((cap) => ({
    capability: cap,
    label: CAPABILITY_LABELS[cap],
    subtitle: CAPABILITY_SUBTITLES[cap],
    score: scores[cap],
    questionCount: QUESTIONS_BY_CAPABILITY[cap].length,
  })) as CapabilityScore[];
}

export function buildDiagnosticResults(
  assessment: Assessment,
  responses: ResponseItem[]
): DiagnosticResults {
  const capScoresRaw = computeCapabilityScores(responses);
  const overallScore = computeOverallScore(capScoresRaw);
  const maturityStage = computeMaturityStage(overallScore);
  const stageInfo = MATURITY_STAGES[maturityStage];
  const capabilityScores = buildCapabilityScoresList(capScoresRaw);
  const opportunities = getTriggeredOpportunities(capScoresRaw);

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

export function getScoreColor(score: number): string {
  if (score < 1.75) return "text-red-600";
  if (score < 2.75) return "text-orange-500";
  if (score < 3.5) return "text-amber-500";
  if (score < 4.5) return "text-blue-600";
  return "text-green-600";
}

export function getScoreBgColor(score: number): string {
  if (score < 1.75) return "bg-red-100 text-red-700 border-red-200";
  if (score < 2.75) return "bg-orange-100 text-orange-700 border-orange-200";
  if (score < 3.5) return "bg-amber-100 text-amber-700 border-amber-200";
  if (score < 4.5) return "bg-blue-100 text-blue-700 border-blue-200";
  return "bg-green-100 text-green-700 border-green-200";
}

export function getScoreBarColor(score: number): string {
  if (score < 1.75) return "bg-red-500";
  if (score < 2.75) return "bg-orange-500";
  if (score < 3.5) return "bg-amber-500";
  if (score < 4.5) return "bg-blue-500";
  return "bg-green-500";
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

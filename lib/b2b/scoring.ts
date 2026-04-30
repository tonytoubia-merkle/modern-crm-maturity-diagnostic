import type {
  B2bCapability,
  B2bMaturityStage,
  B2bCapabilityScore,
  B2bResponseItem,
  B2bDiagnosticResults,
  B2bAssessment,
} from "@/lib/b2b/types";
import {
  B2B_CAPABILITIES_ORDER,
  B2B_CAPABILITY_LABELS,
  B2B_CAPABILITY_SUBTITLES,
  B2B_QUESTIONS_BY_CAPABILITY,
} from "@/lib/b2b/data/questions";
import { getB2bTriggeredOpportunities } from "@/lib/b2b/data/opportunities";

/**
 * Computes per-capability average scores. Mirrors CSC scoring logic so
 * the same dashboard / chart components can render either diagnostic
 * with no special-casing – only the capability set differs.
 */
export function computeB2bCapabilityScores(
  responses: B2bResponseItem[]
): Record<B2bCapability, number> {
  const scores: Record<string, number> = {};

  for (const cap of B2B_CAPABILITIES_ORDER) {
    const coreQs = B2B_QUESTIONS_BY_CAPABILITY[cap];
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

  return scores as Record<B2bCapability, number>;
}

export function computeB2bOverallScore(
  capabilityScores: Record<B2bCapability, number>
): number {
  const values = B2B_CAPABILITIES_ORDER.map((c) => capabilityScores[c]).filter(
    (v) => v > 0
  );
  if (values.length === 0) return 0;
  const total = values.reduce((sum, v) => sum + v, 0);
  return Math.round((total / values.length) * 100) / 100;
}

export function computeB2bMaturityStage(overallScore: number): B2bMaturityStage {
  if (overallScore < 1.75) return 1;
  if (overallScore < 2.75) return 2;
  if (overallScore < 3.75) return 3;
  return 4;
}

// Stage labels and narratives sourced from the 2025 B2B Transformation
// GTM narrative – the "Account-Based Everything" maturity arc from
// functional silos to an AI-orchestrated revenue platform.
export const B2B_MATURITY_STAGES: Record<
  B2bMaturityStage,
  { label: string; description: string; color: string }
> = {
  1: {
    label: "Stage 1 – Functional Silos",
    description:
      "Marketing, sales, service, and operations run as siloed functions with disconnected tools, separate KPIs, and limited visibility into account-level performance. Buying groups aren't identified or coordinated. The customer experience is product- or function-led, not account-led, and growth depends on individual heroics. Stage 1 organizations typically benefit most from a North Star Digital Visioning engagement to align leadership before any platform investment lands.",
    color: "red",
  },
  2: {
    label: "Stage 2 – Coordinated",
    description:
      "Some account-based pilots exist (a tiered ABM list, a select set of strategic accounts) but the operating model still defaults to function-specific KPIs and reactive plays. Tech investment has begun – CRM is in place, data is partially unified – but legacy systems persist alongside modern ones. Sellers, marketers, and service teams know each other but aren't yet running shared playbooks. Stage 2 organizations are ready to anchor their next investment in a B2B Customer Experience Assessment or an Innovation Accelerator on one high-value account journey.",
    color: "orange",
  },
  3: {
    label: "Stage 3 – Orchestrated",
    description:
      "Account-based execution is the default – across marketing, sales, service, and operations. Tier-1 accounts have shared plans, shared KPIs, and visible journey orchestration across paid, owned, sales, and service touch. The revenue platform (modern CRM, CPQ, billing) runs on connected technology with a unified customer data foundation. AI has moved from pilot to embedded – copilots inside seller and service workflows, AI lead scoring and account intelligence in production. Stage 3 organizations are positioned for Tech & Data Modernization or full Enterprise Transformation engagements that lock in the operating model and scale agentic capabilities.",
    color: "blue",
  },
  4: {
    label: "Stage 4 – Adaptive Engine",
    description:
      "The business runs as a unified, AI-orchestrated revenue platform. Account-based plays execute autonomously through agentic workflows; sellers, marketers, and service agents focus on relationship and complexity while AI handles repetitive work. Self-service commerce, marketplace, and recurring revenue carry a meaningful share of the top line; cost-to-serve drops as task completion and deflection rise. Tech, data, and AI investments are continuously optimized through value-realization scorecards. Stage 4 organizations engage Merkle for Continuous Value Accelerator programs that keep the engine ahead of emerging technologies.",
    color: "green",
  },
};

export function buildB2bCapabilityScoresList(
  scores: Record<B2bCapability, number>
): B2bCapabilityScore[] {
  return B2B_CAPABILITIES_ORDER.map((cap) => ({
    capability: cap,
    label: B2B_CAPABILITY_LABELS[cap],
    subtitle: B2B_CAPABILITY_SUBTITLES[cap],
    score: scores[cap],
    questionCount: B2B_QUESTIONS_BY_CAPABILITY[cap].length,
  })) as B2bCapabilityScore[];
}

export function buildB2bDiagnosticResults(
  assessment: B2bAssessment,
  responses: B2bResponseItem[]
): B2bDiagnosticResults {
  const capScoresRaw = computeB2bCapabilityScores(responses);
  const overallScore = computeB2bOverallScore(capScoresRaw);
  const maturityStage = computeB2bMaturityStage(overallScore);
  const stageInfo = B2B_MATURITY_STAGES[maturityStage];
  const capabilityScores = buildB2bCapabilityScoresList(capScoresRaw);
  const opportunities = getB2bTriggeredOpportunities(capScoresRaw);

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

export function getB2bScoreColor(score: number): string {
  if (score < 1.75) return "text-red-600";
  if (score < 2.75) return "text-orange-500";
  if (score < 3.5) return "text-amber-500";
  if (score < 4.5) return "text-blue-600";
  return "text-green-600";
}

export function getB2bScoreBgColor(score: number): string {
  if (score < 1.75) return "bg-red-100 text-red-700 border-red-200";
  if (score < 2.75) return "bg-orange-100 text-orange-700 border-orange-200";
  if (score < 3.5) return "bg-amber-100 text-amber-700 border-amber-200";
  if (score < 4.5) return "bg-blue-100 text-blue-700 border-blue-200";
  return "bg-green-100 text-green-700 border-green-200";
}

export function getB2bScoreBarColor(score: number): string {
  if (score < 1.75) return "bg-red-500";
  if (score < 2.75) return "bg-orange-500";
  if (score < 3.5) return "bg-amber-500";
  if (score < 4.5) return "bg-blue-500";
  return "bg-green-500";
}

export function formatB2bScore(score: number): string {
  return score.toFixed(1);
}

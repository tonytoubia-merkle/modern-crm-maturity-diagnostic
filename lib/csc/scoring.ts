import type {
  CscCapability,
  CscMaturityStage,
  CscCapabilityScore,
  CscResponseItem,
  CscDiagnosticResults,
  CscAssessment,
} from "@/lib/csc/types";
import {
  CSC_CAPABILITIES_ORDER,
  CSC_CAPABILITY_LABELS,
  CSC_CAPABILITY_SUBTITLES,
  CSC_QUESTIONS_BY_CAPABILITY,
} from "@/lib/csc/data/questions";
import { getCscTriggeredOpportunities } from "@/lib/csc/data/opportunities";

export function computeCscCapabilityScores(
  responses: CscResponseItem[]
): Record<CscCapability, number> {
  const scores: Record<string, number> = {};

  for (const cap of CSC_CAPABILITIES_ORDER) {
    const coreQs = CSC_QUESTIONS_BY_CAPABILITY[cap];
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

  return scores as Record<CscCapability, number>;
}

export function computeCscOverallScore(
  capabilityScores: Record<CscCapability, number>
): number {
  const values = CSC_CAPABILITIES_ORDER.map((c) => capabilityScores[c]).filter(
    (v) => v > 0
  );
  if (values.length === 0) return 0;
  const total = values.reduce((sum, v) => sum + v, 0);
  return Math.round((total / values.length) * 100) / 100;
}

export function computeCscMaturityStage(overallScore: number): CscMaturityStage {
  if (overallScore < 1.75) return 1;
  if (overallScore < 2.75) return 2;
  if (overallScore < 3.75) return 3;
  return 4;
}

export const CSC_MATURITY_STAGES: Record<
  CscMaturityStage,
  { label: string; description: string; color: string }
> = {
  1: {
    label: "Stage 1 — Campaign-Driven Content",
    description:
      "Content is produced campaign-by-campaign — bespoke, siloed, and largely bespoke per launch. There is no shared portfolio view, modular design, or content intelligence. Teams rebuild assets that already exist, struggle to find approved content, and cannot produce personalization variants without linear cost growth. This is the starting point of a content supply chain focused on output rather than outcomes — removing friction on individual deliverables while leaving significant trapped value across the portfolio.",
    color: "red",
  },
  2: {
    label: "Stage 2 — Process-Based Content",
    description:
      "Production workflows have begun to standardize, some asset reuse is happening, and a DAM exists — but modular design, asset-level intelligence, and dynamic activation are still limited. AI use is inconsistent and governance is applied after the fact. Content remains largely channel-shaped rather than audience-shaped, and personalization variants are produced manually. Stage 2 organizations have removed the most obvious inefficiency but have not yet reorganized the supply chain around modular, data-driven content.",
    color: "orange",
  },
  3: {
    label: "Stage 3 — Connected Content Supply Chain",
    description:
      "Content is designed as modular components, the DAM is the trusted source of truth, and asset-level performance feeds back into briefing and production. GenAI is in day-to-day use within brand and legal guardrails, and content is assembled dynamically in CRM, commerce, and media activation. Brand, creative, MarTech, and agency partners operate from a shared operating model. This is the stage where the content supply chain stops being a factory and starts being a connected engine for personalized engagement.",
    color: "blue",
  },
  4: {
    label: "Stage 4 — Intelligent Content Engine",
    description:
      "The content supply chain is AI-augmented and self-optimizing. Modular content, asset intelligence, and dynamic activation are fully integrated; agentic workflows and generative AI produce personalized content at a scale humans cannot. A Content Center of Excellence institutionalizes governance, measurement, and continuous improvement. Content is produced against audience outcomes, variants are automated, and every asset learns from the last. The organization has made the full shift from campaigns to conversations — with content as a compounding growth asset.",
    color: "green",
  },
};

export function buildCscCapabilityScoresList(
  scores: Record<CscCapability, number>
): CscCapabilityScore[] {
  return CSC_CAPABILITIES_ORDER.map((cap) => ({
    capability: cap,
    label: CSC_CAPABILITY_LABELS[cap],
    subtitle: CSC_CAPABILITY_SUBTITLES[cap],
    score: scores[cap],
    questionCount: CSC_QUESTIONS_BY_CAPABILITY[cap].length,
  })) as CscCapabilityScore[];
}

export function buildCscDiagnosticResults(
  assessment: CscAssessment,
  responses: CscResponseItem[]
): CscDiagnosticResults {
  const capScoresRaw = computeCscCapabilityScores(responses);
  const overallScore = computeCscOverallScore(capScoresRaw);
  const maturityStage = computeCscMaturityStage(overallScore);
  const stageInfo = CSC_MATURITY_STAGES[maturityStage];
  const capabilityScores = buildCscCapabilityScoresList(capScoresRaw);
  const opportunities = getCscTriggeredOpportunities(capScoresRaw);

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

export function getCscScoreColor(score: number): string {
  if (score < 1.75) return "text-red-600";
  if (score < 2.75) return "text-orange-500";
  if (score < 3.5) return "text-amber-500";
  if (score < 4.5) return "text-blue-600";
  return "text-green-600";
}

export function getCscScoreBgColor(score: number): string {
  if (score < 1.75) return "bg-red-100 text-red-700 border-red-200";
  if (score < 2.75) return "bg-orange-100 text-orange-700 border-orange-200";
  if (score < 3.5) return "bg-amber-100 text-amber-700 border-amber-200";
  if (score < 4.5) return "bg-blue-100 text-blue-700 border-blue-200";
  return "bg-green-100 text-green-700 border-green-200";
}

export function getCscScoreBarColor(score: number): string {
  if (score < 1.75) return "bg-red-500";
  if (score < 2.75) return "bg-orange-500";
  if (score < 3.5) return "bg-amber-500";
  if (score < 4.5) return "bg-blue-500";
  return "bg-green-500";
}

export function formatCscScore(score: number): string {
  return score.toFixed(1);
}

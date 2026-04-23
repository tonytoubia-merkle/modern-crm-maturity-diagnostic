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

// Stage labels and narratives aligned to the Merkle CSC practice POV
// (2026 POV Narrative, "CSC Diagnostic" maturity scale, page 33).
export const CSC_MATURITY_STAGES: Record<
  CscMaturityStage,
  { label: string; description: string; color: string }
> = {
  1: {
    label: "Stage 1 — Defined",
    description:
      "Siloed teams, manual work, and a reactive or chaotic approach to content. Organizations at this stage rely on Excel, email, and file-transfer tools to manage content, with no shared portfolio view, modular design, or content intelligence. Teams rebuild assets that already exist and cannot produce personalization variants without linear cost growth. Stage 1 organizations are typically ready for a CSC Strategy Blueprint — aligning current state, target state, and priority efforts before platform investment.",
    color: "red",
  },
  2: {
    label: "Stage 2 — Integrated",
    description:
      "Tools like DAMs and project management systems may be in place, but other workflows are still manual and connections between content, experience, and media teams are limited. AI use is inconsistent, governance is applied after the fact, and content remains largely channel-shaped rather than audience-shaped. Stage 2 organizations have removed the most obvious inefficiency but not yet reorganized the supply chain around modular, data-driven content. Ready to prove value through an Innovation Accelerator on a single high-impact use case.",
    color: "orange",
  },
  3: {
    label: "Stage 3 — Optimized",
    description:
      "Connected teams with integrated technology, working to common objectives and measuring against standardized KPIs. Content is designed as modular components, the DAM is the trusted source of truth, and asset-level performance feeds back into briefing and production. GenAI is in day-to-day use within brand and legal guardrails, and content is assembled dynamically in CRM, commerce, and media activation. This is where the content supply chain stops being a factory and starts being a connected engine for personalized engagement.",
    color: "blue",
  },
  4: {
    label: "Stage 4 — Innovative",
    description:
      "Fully connected and integrated teams across markets, powered by data, technology, and intelligence — with a growing proportion of work executed by AI agents. Modular content, asset intelligence, and dynamic activation are fully integrated; agentic workflows and generative AI produce personalized content at a scale humans cannot. A Content Center of Excellence institutionalizes governance, measurement, and continuous improvement. Content has become a compounding growth asset, and the focus shifts to Continuous Value Accelerator programs that keep the engine ahead of emerging technologies.",
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

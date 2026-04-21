// ── Content Supply Chain Diagnostic — Types ───────────────────────────
// Parallel type system to the Modern CRM diagnostic, kept independent so
// changes here cannot affect CRM typing.

// The 6 capability dimensions mirror the grouping of the Content Supply
// Chain Diagnostic source questionnaire (Microsoft Forms export).
export type CscCapability =
  | "strategy_planning"
  | "workflow_production"
  | "asset_governance"
  | "distribution_activation"
  | "measurement_insights"
  | "intelligence_automation";

export type CscIndustry =
  | "retail"
  | "qsr"
  | "financial_services"
  | "travel_hospitality"
  | "automotive";

export type CscMaturityStage = 1 | 2 | 3 | 4;

export interface CscQuestion {
  id: number;
  text: string;
  capability: CscCapability;
  tooltip?: string;
}

export interface CscIndustryQuestion {
  id: string;
  text: string;
  industry: CscIndustry;
  capability: CscCapability;
  tooltip?: string;
}

export type CscViewMode = "internal" | "client";

export interface CscResponseItem {
  questionId: string | number;
  score: number;
  capability: CscCapability;
  isIndustryQuestion: boolean;
  notes?: string;
}

export interface CscAssessment {
  id: string;
  shareId: string;
  clientName: string;
  clientCompany: string;
  respondentName: string;
  repEmail?: string;
  isRepMode: boolean;
  industry?: CscIndustry;
  status: "in_progress" | "completed";
  responses?: CscResponseItem[];
  capabilityScores?: Record<CscCapability, number>;
  overallScore?: number;
  maturityStage?: CscMaturityStage;
  createdAt: string;
  updatedAt: string;
}

export interface CscCapabilityScore {
  capability: CscCapability;
  label: string;
  subtitle?: string;
  score: number;
  questionCount: number;
}

export interface CscOpportunity {
  id: string;
  title: string;
  tagline: string;
  description: string;
  capabilities: CscCapability[];
  triggerThreshold: number;
  minTriggerScore?: number;
  scope: string;
  methods: string[];
  valueNarrative: string;
  sfType: string;
  engagementSize: string;
  priority: "critical" | "high" | "medium" | "innovation";
}

export interface CscDiagnosticResults {
  assessment: CscAssessment;
  capabilityScores: CscCapabilityScore[];
  overallScore: number;
  maturityStage: CscMaturityStage;
  maturityLabel: string;
  maturityDescription: string;
  opportunities: CscOpportunity[];
}

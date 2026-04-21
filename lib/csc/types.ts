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

// ── Workshop / Project types ───────────────────────────────────────────
// Parallel to the CRM project types in lib/types.ts. Database tables are
// csc_projects and csc_stakeholders (migration 009).

export type CscProjectMode = "lite" | "workshop";
export type CscProjectStatus = "collecting" | "aggregating" | "completed";

export interface CscProject {
  id: string;
  shareId: string;
  clientName: string;
  clientCompany: string;
  industry?: CscIndustry | null;
  createdByName: string;
  createdByEmail?: string | null;
  mode: CscProjectMode;
  maxStakeholders: number;
  status: CscProjectStatus;
  aggregatedScores?: Record<CscCapability, number> | null;
  aggregatedOverall?: number | null;
  aggregatedMaturity?: CscMaturityStage | null;
  triggeredOpportunityIds?: string[] | null;
  workshopAgenda?: CscWorkshopAgenda | null;
  createdAt: string;
  updatedAt: string;
}

export interface CscStakeholder {
  id: string;
  projectId: string;
  name: string;
  email?: string | null;
  role?: string | null;
  inviteToken: string;
  assessmentId?: string | null;
  status: "invited" | "in_progress" | "completed";
  invitedAt: string;
  completedAt?: string | null;
}

// ── Workshop agenda shape ──────────────────────────────────────────────
// Deliberately left loose at the scaffold stage. The generator will fill
// this once vignette content is grounded. Follow the CRM workshop_agenda
// shape in lib/types.ts when authoring.

export interface CscWorkshopAgendaSection {
  title: string;
  duration: string;
  description: string;
  facilitationGuide?: string;
  vignetteIds?: string[];
}

export interface CscWorkshopAgenda {
  format: "half_day" | "full_day" | "two_day";
  sections: CscWorkshopAgendaSection[];
  smeRaci?: Array<{ area: string; responsible: string; accountable: string; consulted?: string[]; informed?: string[] }>;
}

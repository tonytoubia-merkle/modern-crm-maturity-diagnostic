// ── AI for CX Diagnostic – Types ───────────────────────────────────
// Parallel type system to the Modern CRM, CSC, and B2B diagnostics.
//
// Sourced from the Merkle 2026 "AI for CX" deep dive (March 2026)
// and the Customer Experience Optimization (EXO) offering toolkit
// (v2.0, January 2026). Six capabilities span the four AI for CX
// offering pillars (Discoverability, Agentic Experience, Adaptive
// Personalization, Customer Experience Optimization) plus the data
// foundation and trust/measurement layers that underpin them.

export type AicxCapability =
  | "agentic_discoverability"
  | "agentic_experience"
  | "adaptive_personalization"
  | "experimentation"
  | "identity_data"
  | "measurement_trust";

export type AicxIndustry =
  | "retail"
  | "qsr"
  | "financial_services"
  | "travel_hospitality"
  | "technology_saas";

export type AicxMaturityStage = 1 | 2 | 3 | 4;

export interface AicxQuestion {
  id: number;
  text: string;
  capability: AicxCapability;
  tooltip?: string;
  byIndustry?: Partial<Record<AicxIndustry, string>>;
}

export interface AicxIndustryQuestion {
  id: string;
  text: string;
  industry: AicxIndustry;
  capability: AicxCapability;
  tooltip?: string;
}

export type AicxViewMode = "internal" | "client";

export interface AicxResponseItem {
  questionId: string | number;
  score: number;
  capability: AicxCapability;
  isIndustryQuestion: boolean;
  notes?: string;
}

export interface AicxAssessment {
  id: string;
  shareId: string;
  clientName: string;
  clientCompany: string;
  respondentName: string;
  repEmail?: string;
  isRepMode: boolean;
  industry?: AicxIndustry;
  status: "in_progress" | "completed";
  responses?: AicxResponseItem[];
  capabilityScores?: Record<AicxCapability, number>;
  overallScore?: number;
  maturityStage?: AicxMaturityStage;
  createdAt: string;
  updatedAt: string;
}

export interface AicxCapabilityScore {
  capability: AicxCapability;
  label: string;
  subtitle?: string;
  score: number;
  questionCount: number;
}

export interface AicxOpportunity {
  id: string;
  title: string;
  tagline: string;
  description: string;
  capabilities: AicxCapability[];
  triggerThreshold: number;
  minTriggerScore?: number;
  scope: string;
  methods: string[];
  valueNarrative: string;
  sfType: string;
  engagementSize: string;
  priority: "critical" | "high" | "medium" | "innovation";
}

export interface AicxDiagnosticResults {
  assessment: AicxAssessment;
  capabilityScores: AicxCapabilityScore[];
  overallScore: number;
  maturityStage: AicxMaturityStage;
  maturityLabel: string;
  maturityDescription: string;
  opportunities: AicxOpportunity[];
}

export type AicxProjectMode = "lite" | "workshop";
export type AicxProjectStatus = "collecting" | "aggregating" | "completed";

export interface AicxProject {
  id: string;
  shareId: string;
  clientName: string;
  clientCompany: string;
  industry?: AicxIndustry | null;
  createdByName: string;
  createdByEmail?: string | null;
  mode: AicxProjectMode;
  maxStakeholders: number;
  status: AicxProjectStatus;
  aggregatedScores?: Record<AicxCapability, number> | null;
  aggregatedOverall?: number | null;
  aggregatedMaturity?: AicxMaturityStage | null;
  triggeredOpportunityIds?: string[] | null;
  workshopAgenda?: AicxWorkshopAgenda | null;
  createdAt: string;
  updatedAt: string;
}

export interface AicxStakeholder {
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

export interface AicxWorkshopVignette {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: string;
  requiredInputs: string[];
  facilitationGuide: string;
  expectedOutputs: string[];
  relatedOpportunityIds: string[];
  triggerCapabilities: AicxCapability[];
  sortOrder: number;
}

export interface AicxClientStory {
  id: string;
  title: string;
  tagline: string;
  capabilities: AicxCapability[];
  narrative: string;
  outcomes?: string[];
  industries?: string[];
  prompts?: string[];
}

export interface AicxWorkshopAgendaSection {
  title: string;
  duration: string;
  description: string;
  facilitationGuide?: string;
  vignetteIds?: string[];
}

export interface AicxWorkshopAgenda {
  format: "half_day" | "full_day" | "two_day";
  sections: AicxWorkshopAgendaSection[];
  smeRaci?: Array<{
    area: string;
    responsible: string;
    accountable: string;
    consulted?: string[];
    informed?: string[];
  }>;
}

// ── AI for Enterprise Diagnostic – Types ─────────────────────────
// Parallel type system to the Modern CRM, CSC, B2B, and AI for CX
// diagnostics.
//
// Sourced from the Merkle 2026 "AI for Enterprise: Powering
// Intelligence" narrative (March 2026), the Agile Operating Model
// Transformation offering (v1.2), the Analytics Advisory offering
// toolkit (v1.0, 2026), and the Digital Shelf and Commerce
// Intelligence offering (v1.0). Six capabilities span the four AI
// for Enterprise pillars (Data Foundations, Work Design, Enterprise
// Intelligence Systems, AI Assurance & Trust) plus the use-case
// rigor and adoption-governance layers that the success patterns
// identified in the research call out.

export type AientCapability =
  | "data_foundations"
  | "use_case_design"
  | "work_design"
  | "intelligence_delivery"
  | "ai_assurance"
  | "adoption_governance";

export type AientIndustry =
  | "retail"
  | "manufacturing"
  | "financial_services"
  | "healthcare_lifesciences"
  | "technology_saas"
  | "professional_services";

export type AientMaturityStage = 1 | 2 | 3 | 4;

export interface AientQuestion {
  id: number;
  text: string;
  capability: AientCapability;
  tooltip?: string;
  byIndustry?: Partial<Record<AientIndustry, string>>;
}

export interface AientIndustryQuestion {
  id: string;
  text: string;
  industry: AientIndustry;
  capability: AientCapability;
  tooltip?: string;
}

export type AientViewMode = "internal" | "client";

export interface AientResponseItem {
  questionId: string | number;
  score: number;
  capability: AientCapability;
  isIndustryQuestion: boolean;
  notes?: string;
}

export interface AientAssessment {
  id: string;
  shareId: string;
  clientName: string;
  clientCompany: string;
  respondentName: string;
  repEmail?: string;
  isRepMode: boolean;
  industry?: AientIndustry;
  status: "in_progress" | "completed";
  responses?: AientResponseItem[];
  capabilityScores?: Record<AientCapability, number>;
  overallScore?: number;
  maturityStage?: AientMaturityStage;
  createdAt: string;
  updatedAt: string;
}

export interface AientCapabilityScore {
  capability: AientCapability;
  label: string;
  subtitle?: string;
  score: number;
  questionCount: number;
}

export interface AientOpportunity {
  id: string;
  title: string;
  tagline: string;
  description: string;
  capabilities: AientCapability[];
  triggerThreshold: number;
  minTriggerScore?: number;
  scope: string;
  methods: string[];
  valueNarrative: string;
  sfType: string;
  engagementSize: string;
  priority: "critical" | "high" | "medium" | "innovation";
}

export interface AientDiagnosticResults {
  assessment: AientAssessment;
  capabilityScores: AientCapabilityScore[];
  overallScore: number;
  maturityStage: AientMaturityStage;
  maturityLabel: string;
  maturityDescription: string;
  opportunities: AientOpportunity[];
}

export type AientProjectMode = "lite" | "workshop";
export type AientProjectStatus = "collecting" | "aggregating" | "completed";

export interface AientProject {
  id: string;
  shareId: string;
  clientName: string;
  clientCompany: string;
  industry?: AientIndustry | null;
  createdByName: string;
  createdByEmail?: string | null;
  mode: AientProjectMode;
  maxStakeholders: number;
  status: AientProjectStatus;
  aggregatedScores?: Record<AientCapability, number> | null;
  aggregatedOverall?: number | null;
  aggregatedMaturity?: AientMaturityStage | null;
  triggeredOpportunityIds?: string[] | null;
  workshopAgenda?: AientWorkshopAgenda | null;
  createdAt: string;
  updatedAt: string;
}

export interface AientStakeholder {
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

export interface AientWorkshopVignette {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: string;
  requiredInputs: string[];
  facilitationGuide: string;
  expectedOutputs: string[];
  relatedOpportunityIds: string[];
  triggerCapabilities: AientCapability[];
  sortOrder: number;
}

export interface AientClientStory {
  id: string;
  title: string;
  tagline: string;
  capabilities: AientCapability[];
  narrative: string;
  outcomes?: string[];
  industries?: string[];
  prompts?: string[];
}

export interface AientWorkshopAgendaSection {
  title: string;
  duration: string;
  description: string;
  facilitationGuide?: string;
  vignetteIds?: string[];
}

export interface AientWorkshopAgenda {
  format: "half_day" | "full_day" | "two_day";
  sections: AientWorkshopAgendaSection[];
  smeRaci?: Array<{
    area: string;
    responsible: string;
    accountable: string;
    consulted?: string[];
    informed?: string[];
  }>;
}

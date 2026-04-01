export type Capability =
  | "identity"
  | "signals"
  | "decisioning"
  | "engagement"
  | "media_activation"
  | "learning_optimization";

export type Industry =
  | "retail"
  | "qsr"
  | "financial_services"
  | "travel_hospitality"
  | "automotive";

export type MaturityStage = 1 | 2 | 3 | 4;

export interface Question {
  id: number;
  text: string;
  capability: Capability;
  tooltip?: string;
}

export interface IndustryQuestion {
  id: string;
  text: string;
  industry: Industry;
  capability: Capability;
  tooltip?: string;
}

export type ViewMode = "internal" | "client";

export interface ResponseItem {
  questionId: string | number;
  score: number;
  capability: Capability;
  isIndustryQuestion: boolean;
  notes?: string;
}

export interface Assessment {
  id: string;
  shareId: string;
  clientName: string;
  clientCompany: string;
  respondentName: string;
  repEmail?: string;
  isRepMode: boolean;
  industry?: Industry;
  status: "in_progress" | "completed";
  responses?: ResponseItem[];
  capabilityScores?: Record<Capability, number>;
  overallScore?: number;
  maturityStage?: MaturityStage;
  createdAt: string;
  updatedAt: string;
}

export interface CapabilityScore {
  capability: Capability;
  label: string;
  score: number;
  questionCount: number;
}

export interface Opportunity {
  id: string;
  title: string;
  tagline: string;
  description: string;
  capabilities: Capability[];
  triggerThreshold: number;
  minTriggerScore?: number; // if set, fires when score >= this value (advanced/innovation opps)
  scope: string;
  methods: string[];
  valueNarrative: string;
  sfType: string;
  engagementSize: string;
  priority: "critical" | "high" | "medium" | "innovation";
}

export interface DiagnosticResults {
  assessment: Assessment;
  capabilityScores: CapabilityScore[];
  overallScore: number;
  maturityStage: MaturityStage;
  maturityLabel: string;
  maturityDescription: string;
  opportunities: Opportunity[];
}

// ── Workshop / Project types ────────────────────────────────

export type ProjectMode = "lite" | "workshop";
export type ProjectStatus = "collecting" | "aggregating" | "completed";
export type StakeholderStatus = "invited" | "in_progress" | "completed";

export interface Project {
  id: string;
  shareId: string;
  clientName: string;
  clientCompany: string;
  industry?: Industry;
  createdByName: string;
  createdByEmail?: string;
  mode: ProjectMode;
  hasPassword: boolean;
  maxStakeholders: number;
  status: ProjectStatus;
  aggregatedScores?: Record<Capability, number>;
  aggregatedOverall?: number;
  aggregatedMaturity?: MaturityStage;
  triggeredOpportunityIds?: string[];
  workshopAgenda?: WorkshopAgenda;
  createdAt: string;
  updatedAt: string;
}

export interface Stakeholder {
  id: string;
  projectId: string;
  name: string;
  email?: string;
  role?: string;
  inviteToken: string;
  assessmentId?: string;
  status: StakeholderStatus;
  invitedAt: string;
  completedAt?: string;
}

export interface Vignette {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: string;
  requiredInputs: string[];
  facilitationGuide: string;
  expectedOutputs: string[];
  relatedOpportunityIds: string[];
  triggerCapabilities: Capability[];
  industries?: Industry[];
  sortOrder: number;
}

export interface AgendaBlock {
  type: "vignette" | "break" | "intro" | "closing" | "discussion";
  vignetteId?: string;
  title: string;
  description: string;
  durationMinutes: number;
  relatedOpportunities: string[];
  relatedCapabilities: Capability[];
}

export interface WorkshopAgenda {
  format: "half_day" | "full_day" | "two_day";
  totalMinutes: number;
  days: {
    dayNumber: number;
    title: string;
    blocks: AgendaBlock[];
  }[];
  generatedAt: string;
}

export type Capability =
  | "identity"
  | "signals"
  | "decisioning"
  | "engagement"
  | "media_activation"
  | "learning_optimization"
  | "technology"
  | "organization";

export type Industry =
  | "retail"
  | "qsr"
  | "financial_services"
  | "travel_hospitality"
  | "automotive";

export type MaturityStage = 1 | 2 | 3 | 4;

export interface Question {
  id: number;
  /**
   * Default question text. Used when no industry is selected, or when
   * the selected industry has no entry in `byIndustry`. The default is
   * always the broadest, all-industry-friendly wording.
   */
  text: string;
  capability: Capability;
  tooltip?: string;
  /**
   * Optional per-industry overrides. When present and the assessment
   * has an industry selected, the matching string is rendered in place
   * of `text` everywhere — chat prompt, score map, capability section,
   * voice agent. Keys not listed fall back to `text`.
   */
  byIndustry?: Partial<Record<Industry, string>>;
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

export interface ClientStory {
  id: string;
  title: string;
  tagline: string;
  capabilities: Capability[];
  narrative: string;
  outcomes?: string[];
  industries?: string[];
  prompts?: string[];
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

// ── Guide & SME types ─────────────────────────────────────────

export type EmailTemplateId =
  | "survey_distribution"
  | "survey_reminder"
  | "workshop_invite"
  | "post_workshop_followup";

export interface EmailTemplate {
  id: EmailTemplateId;
  name: string;
  subject: string;
  body: string;
  placeholders: string[];
  usage: string;
}

export type MerklePractice =
  | "CRM Strategy"
  | "Loyalty"
  | "Identity & Data"
  | "Analytics & Decisioning"
  | "Media"
  | "Technology & Platforms"
  | "Promotions & Gamification"
  | "Innovation & AI";

export interface SmeMapping {
  opportunityId: string;
  leadSmeRole: string;
  leadPractice: MerklePractice;
  supportingRoles: string[];
  supportingPractice: MerklePractice;
  workshopRole: "R" | "A" | "C" | "I";
  notes?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  category: "logistics" | "materials" | "technology" | "facilitation" | "follow_up";
  onsite: boolean;
  virtual: boolean;
  details?: string;
}

export interface GuideStep {
  stepNumber: number;
  title: string;
  description: string;
  timing: string;
  substeps: string[];
  tips?: string[];
  emailTemplateId?: EmailTemplateId;
}

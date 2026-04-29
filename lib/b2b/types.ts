// ── B2B Transformation Diagnostic — Types ─────────────────────────────
// Parallel type system to the Modern CRM and CSC diagnostics, kept
// independent so changes here cannot affect either.
//
// The framing comes straight from the Merkle "B2B Transformation"
// 2025 GTM narrative — Account-Based Everything Transformation
// reshaping strategy, organizational structure, and cultural mindset
// around high-value account success. The capability set spans the
// four account-based pillars (Marketing, Selling, Service & Advocacy,
// Operations & Commerce) plus the cross-cutting Vision/Strategy and
// Tech/Data/Intelligence layers that the wedge offerings address.

export type B2bCapability =
  | "vision_strategy"
  | "abm"
  | "abs"
  | "service_advocacy"
  | "operations_commerce"
  | "tech_data_intelligence";

export type B2bIndustry =
  | "technology_saas"
  | "manufacturing"
  | "financial_services"
  | "healthcare_lifesciences"
  | "industrial_b2b"
  | "professional_services";

export type B2bMaturityStage = 1 | 2 | 3 | 4;

export interface B2bQuestion {
  id: number;
  text: string;
  capability: B2bCapability;
  tooltip?: string;
}

export interface B2bIndustryQuestion {
  id: string;
  text: string;
  industry: B2bIndustry;
  capability: B2bCapability;
  tooltip?: string;
}

export type B2bViewMode = "internal" | "client";

export interface B2bResponseItem {
  questionId: string | number;
  score: number;
  capability: B2bCapability;
  isIndustryQuestion: boolean;
  notes?: string;
}

export interface B2bAssessment {
  id: string;
  shareId: string;
  clientName: string;
  clientCompany: string;
  respondentName: string;
  repEmail?: string;
  isRepMode: boolean;
  industry?: B2bIndustry;
  status: "in_progress" | "completed";
  responses?: B2bResponseItem[];
  capabilityScores?: Record<B2bCapability, number>;
  overallScore?: number;
  maturityStage?: B2bMaturityStage;
  createdAt: string;
  updatedAt: string;
}

export interface B2bCapabilityScore {
  capability: B2bCapability;
  label: string;
  subtitle?: string;
  score: number;
  questionCount: number;
}

export interface B2bOpportunity {
  id: string;
  title: string;
  tagline: string;
  description: string;
  capabilities: B2bCapability[];
  triggerThreshold: number;
  minTriggerScore?: number;
  scope: string;
  methods: string[];
  valueNarrative: string;
  sfType: string;
  engagementSize: string;
  priority: "critical" | "high" | "medium" | "innovation";
}

export interface B2bDiagnosticResults {
  assessment: B2bAssessment;
  capabilityScores: B2bCapabilityScore[];
  overallScore: number;
  maturityStage: B2bMaturityStage;
  maturityLabel: string;
  maturityDescription: string;
  opportunities: B2bOpportunity[];
}

// ── Workshop / Project types ───────────────────────────────────────────
// Parallel to the CRM/CSC project types. Database tables are
// b2b_projects and b2b_stakeholders (migration 010).

export type B2bProjectMode = "lite" | "workshop";
export type B2bProjectStatus = "collecting" | "aggregating" | "completed";

export interface B2bProject {
  id: string;
  shareId: string;
  clientName: string;
  clientCompany: string;
  industry?: B2bIndustry | null;
  createdByName: string;
  createdByEmail?: string | null;
  mode: B2bProjectMode;
  maxStakeholders: number;
  status: B2bProjectStatus;
  aggregatedScores?: Record<B2bCapability, number> | null;
  aggregatedOverall?: number | null;
  aggregatedMaturity?: B2bMaturityStage | null;
  triggeredOpportunityIds?: string[] | null;
  workshopAgenda?: B2bWorkshopAgenda | null;
  createdAt: string;
  updatedAt: string;
}

export interface B2bStakeholder {
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

// ── Workshop vignettes (facilitation exercises) ───────────────────────
export interface B2bWorkshopVignette {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: string;
  requiredInputs: string[];
  /** Markdown-flavored facilitation guide. Use **bold** for section
   * headers (e.g. **Setup (10 min):**) — the library renderer parses
   * `**…**` runs as bold. */
  facilitationGuide: string;
  expectedOutputs: string[];
  /** IDs from B2B_OPPORTUNITIES this exercise commonly anchors. */
  relatedOpportunityIds: string[];
  /** B2B capabilities this exercise primarily develops. */
  triggerCapabilities: B2bCapability[];
  sortOrder: number;
}

// ── Anonymized client stories (proof points / pitch anchors) ──────────
export interface B2bClientStory {
  id: string;
  title: string;
  tagline: string;
  capabilities: B2bCapability[];
  narrative: string;
  outcomes?: string[];
  industries?: string[];
  prompts?: string[];
}

// ── Workshop agenda shape ──────────────────────────────────────────────
export interface B2bWorkshopAgendaSection {
  title: string;
  duration: string;
  description: string;
  facilitationGuide?: string;
  vignetteIds?: string[];
}

export interface B2bWorkshopAgenda {
  format: "half_day" | "full_day" | "two_day";
  sections: B2bWorkshopAgendaSection[];
  smeRaci?: Array<{
    area: string;
    responsible: string;
    accountable: string;
    consulted?: string[];
    informed?: string[];
  }>;
}

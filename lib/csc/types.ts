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
  /** Default question text — used when no industry is selected or when
   *  the selected industry has no override in `byIndustry`. */
  text: string;
  capability: CscCapability;
  tooltip?: string;
  /** Optional per-industry overrides. See lib/types.ts:Question for
   *  full notes. CSC currently has no dynamic questions but the field
   *  is wired up so it can grow without further infrastructure work. */
  byIndustry?: Partial<Record<CscIndustry, string>>;
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

// ── Workshop vignettes (facilitation exercises) ───────────────────────
// CSC parallel to the CRM Vignette type — a workshop exercise the
// consultant runs against the client team to develop one or more
// capability areas. Distinct from CscClientStory below, which is the
// anchor narrative used as a credibility/proof point during pitch.
export interface CscWorkshopVignette {
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
  /** IDs from CSC_OPPORTUNITIES this exercise commonly anchors. */
  relatedOpportunityIds: string[];
  /** CSC capabilities this exercise primarily develops. */
  triggerCapabilities: CscCapability[];
  sortOrder: number;
}

// ── Anonymized client stories (proof points / pitch anchors) ──────────
// What used to live in CSC_VIGNETTES — kept as a separate dataset so
// workshop exercises and proof stories don't get conflated.
export interface CscClientStory {
  id: string;
  title: string;
  tagline: string;
  /** Capabilities this story illustrates — drives matching to opportunities. */
  capabilities: CscCapability[];
  /** 1–2 paragraph anonymized (or Merkle-public) client story. */
  narrative: string;
  /** Outcomes or measured impact claimed in the story. */
  outcomes?: string[];
  /** Industry codes (matching CscIndustry) where the story is most relevant. */
  industries?: string[];
  /** Suggested facilitation prompts / discussion questions. */
  prompts?: string[];
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

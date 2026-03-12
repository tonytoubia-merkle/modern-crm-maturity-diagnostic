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
}

export interface IndustryQuestion {
  id: string;
  text: string;
  industry: Industry;
  capability: Capability;
}

export interface ResponseItem {
  questionId: string | number;
  score: number;
  capability: Capability;
  isIndustryQuestion: boolean;
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

import type { B2bCapability } from "@/lib/b2b/types";

export type B2bChatPhase =
  | "opening"
  | "exploration"
  | "gap_filling"
  | "confirmation"
  | "complete";

export interface B2bInferredScore {
  questionId: number | string;
  score: number;
  confidence: "low" | "medium" | "high";
  evidence: string;
  capability: B2bCapability;
  isIndustryQuestion: boolean;
}

export interface B2bScoreUpdate {
  updates: Array<{
    questionId: number | string;
    score: number;
    confidence: "low" | "medium" | "high";
    evidence: string;
  }>;
  skipped: (number | string)[];
}

export interface B2bChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

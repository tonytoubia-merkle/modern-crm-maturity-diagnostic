import type { CscCapability } from "@/lib/csc/types";

export type CscChatPhase =
  | "opening"
  | "exploration"
  | "gap_filling"
  | "confirmation"
  | "complete";

export interface CscInferredScore {
  questionId: number | string;
  score: number;
  confidence: "low" | "medium" | "high";
  evidence: string;
  capability: CscCapability;
  isIndustryQuestion: boolean;
}

export interface CscScoreUpdate {
  updates: Array<{
    questionId: number | string;
    score: number;
    confidence: "low" | "medium" | "high";
    evidence: string;
  }>;
  skipped: (number | string)[];
}

export interface CscChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

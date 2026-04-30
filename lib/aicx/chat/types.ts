import type { AicxCapability } from "@/lib/aicx/types";

export type AicxChatPhase =
  | "opening"
  | "exploration"
  | "gap_filling"
  | "confirmation"
  | "complete";

export interface AicxInferredScore {
  questionId: number | string;
  score: number;
  confidence: "low" | "medium" | "high";
  evidence: string;
  capability: AicxCapability;
  isIndustryQuestion: boolean;
}

export interface AicxScoreUpdate {
  updates: Array<{
    questionId: number | string;
    score: number;
    confidence: "low" | "medium" | "high";
    evidence: string;
  }>;
  skipped: (number | string)[];
}

export interface AicxChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

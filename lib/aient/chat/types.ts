import type { AientCapability } from "@/lib/aient/types";

export type AientChatPhase =
  | "opening"
  | "exploration"
  | "gap_filling"
  | "confirmation"
  | "complete";

export interface AientInferredScore {
  questionId: number | string;
  score: number;
  confidence: "low" | "medium" | "high";
  evidence: string;
  capability: AientCapability;
  isIndustryQuestion: boolean;
}

export interface AientScoreUpdate {
  updates: Array<{
    questionId: number | string;
    score: number;
    confidence: "low" | "medium" | "high";
    evidence: string;
  }>;
  skipped: (number | string)[];
}

export interface AientChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

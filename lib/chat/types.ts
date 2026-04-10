import type { Capability } from "@/lib/types";

export type ChatPhase = "opening" | "exploration" | "gap_filling" | "confirmation" | "complete";

export interface InferredScore {
  questionId: number | string;
  score: number;
  confidence: "low" | "medium" | "high";
  evidence: string;
  capability: Capability;
  isIndustryQuestion: boolean;
}

export interface ScoreUpdate {
  updates: Array<{
    questionId: number | string;
    score: number;
    confidence: "low" | "medium" | "high";
    evidence: string;
  }>;
  skipped: (number | string)[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

import {
  CORE_QUESTIONS,
  INDUSTRY_QUESTIONS,
  CAPABILITIES_ORDER,
  CAPABILITY_LABELS,
  QUESTIONS_BY_CAPABILITY,
} from "@/lib/data/questions";
import type { ChatPhase, InferredScore } from "./types";
import type { Industry } from "@/lib/types";

export function calculatePhase(
  scores: Map<string, InferredScore>,
  skipped: Set<string>,
  totalQuestions: number
): ChatPhase {
  const covered = scores.size + skipped.size;
  if (covered < 5) return "opening";
  if (covered < 20) return "exploration";
  if (covered < totalQuestions) return "gap_filling";
  return "confirmation";
}

export function getCoverageByCapability(
  scores: Map<string, InferredScore>,
  skipped: Set<string>,
  industry: Industry | null
): Array<{
  capability: string;
  label: string;
  answered: number;
  total: number;
  remaining: (number | string)[];
}> {
  return CAPABILITIES_ORDER.map((cap) => {
    const questions = QUESTIONS_BY_CAPABILITY[cap];
    const answered = questions.filter(
      (q) => scores.has(String(q.id)) || skipped.has(String(q.id))
    ).length;
    const remaining = questions
      .filter((q) => !scores.has(String(q.id)) && !skipped.has(String(q.id)))
      .map((q) => q.id);

    return {
      capability: cap,
      label: CAPABILITY_LABELS[cap],
      answered,
      total: questions.length,
      remaining,
    };
  });
}

export function getTotalQuestionCount(industry: Industry | null): number {
  const industryCount = industry
    ? INDUSTRY_QUESTIONS.filter((q) => q.industry === industry).length
    : 0;
  return CORE_QUESTIONS.length + industryCount;
}

export function getRemainingQuestionDescriptors(
  scores: Map<string, InferredScore>,
  skipped: Set<string>
): string {
  const remaining: string[] = [];
  for (const cap of CAPABILITIES_ORDER) {
    const qs = QUESTIONS_BY_CAPABILITY[cap];
    const unanswered = qs.filter(
      (q) => !scores.has(String(q.id)) && !skipped.has(String(q.id))
    );
    if (unanswered.length > 0) {
      remaining.push(
        `${CAPABILITY_LABELS[cap]}: ${unanswered.map((q) => `Q${q.id}`).join(", ")}`
      );
    }
  }
  return remaining.join("; ");
}

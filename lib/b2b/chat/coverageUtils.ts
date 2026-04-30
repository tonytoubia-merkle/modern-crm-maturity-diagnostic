import {
  B2B_CORE_QUESTIONS,
  B2B_INDUSTRY_QUESTIONS,
  B2B_CAPABILITIES_ORDER,
  B2B_CAPABILITY_LABELS,
  B2B_QUESTIONS_BY_CAPABILITY,
} from "@/lib/b2b/data/questions";
import type { B2bChatPhase, B2bInferredScore } from "./types";
import type { B2bIndustry } from "@/lib/b2b/types";

/**
 * Phase thresholds – proportional to CRM (5 / 20 over 30 questions).
 * B2B has 36 core questions, so the bands are scaled to roughly the
 * same coverage percentages.
 */
export function calculateB2bPhase(
  scores: Map<string, B2bInferredScore>,
  skipped: Set<string>,
  totalQuestions: number
): B2bChatPhase {
  const covered = scores.size + skipped.size;
  if (covered < 6) return "opening";
  if (covered < 24) return "exploration";
  if (covered < totalQuestions) return "gap_filling";
  return "confirmation";
}

export function getB2bCoverageByCapability(
  scores: Map<string, B2bInferredScore>,
  skipped: Set<string>
): Array<{
  capability: string;
  label: string;
  answered: number;
  total: number;
  remaining: (number | string)[];
}> {
  return B2B_CAPABILITIES_ORDER.map((cap) => {
    const questions = B2B_QUESTIONS_BY_CAPABILITY[cap];
    const answered = questions.filter(
      (q) => scores.has(String(q.id)) || skipped.has(String(q.id))
    ).length;
    const remaining = questions
      .filter(
        (q) => !scores.has(String(q.id)) && !skipped.has(String(q.id))
      )
      .map((q) => q.id);

    return {
      capability: cap,
      label: B2B_CAPABILITY_LABELS[cap],
      answered,
      total: questions.length,
      remaining,
    };
  });
}

export function getB2bTotalQuestionCount(
  industry: B2bIndustry | null
): number {
  const industryCount = industry
    ? B2B_INDUSTRY_QUESTIONS.filter((q) => q.industry === industry).length
    : 0;
  return B2B_CORE_QUESTIONS.length + industryCount;
}

export function getB2bRemainingQuestionDescriptors(
  scores: Map<string, B2bInferredScore>,
  skipped: Set<string>
): string {
  const remaining: string[] = [];
  for (const cap of B2B_CAPABILITIES_ORDER) {
    const qs = B2B_QUESTIONS_BY_CAPABILITY[cap];
    const unanswered = qs.filter(
      (q) => !scores.has(String(q.id)) && !skipped.has(String(q.id))
    );
    if (unanswered.length > 0) {
      remaining.push(
        `${B2B_CAPABILITY_LABELS[cap]}: ${unanswered
          .map((q) => `Q${q.id}`)
          .join(", ")}`
      );
    }
  }
  return remaining.join("; ");
}

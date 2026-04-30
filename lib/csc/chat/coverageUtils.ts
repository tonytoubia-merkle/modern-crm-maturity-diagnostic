import {
  CSC_CORE_QUESTIONS,
  CSC_INDUSTRY_QUESTIONS,
  CSC_CAPABILITIES_ORDER,
  CSC_CAPABILITY_LABELS,
  CSC_QUESTIONS_BY_CAPABILITY,
} from "@/lib/csc/data/questions";
import type { CscChatPhase, CscInferredScore } from "./types";
import type { CscIndustry } from "@/lib/csc/types";

/**
 * Phase thresholds – proportionally aligned with the CRM phasing
 * (CRM: 30 questions → opening<5, exploration<20). CSC has 45 core
 * questions, so the bands are scaled to roughly the same coverage
 * percentages (≤17%, ≤67%, then gap-filling, then confirmation).
 */
export function calculateCscPhase(
  scores: Map<string, CscInferredScore>,
  skipped: Set<string>,
  totalQuestions: number
): CscChatPhase {
  const covered = scores.size + skipped.size;
  if (covered < 8) return "opening";
  if (covered < 30) return "exploration";
  if (covered < totalQuestions) return "gap_filling";
  return "confirmation";
}

export function getCscCoverageByCapability(
  scores: Map<string, CscInferredScore>,
  skipped: Set<string>
): Array<{
  capability: string;
  label: string;
  answered: number;
  total: number;
  remaining: (number | string)[];
}> {
  return CSC_CAPABILITIES_ORDER.map((cap) => {
    const questions = CSC_QUESTIONS_BY_CAPABILITY[cap];
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
      label: CSC_CAPABILITY_LABELS[cap],
      answered,
      total: questions.length,
      remaining,
    };
  });
}

export function getCscTotalQuestionCount(
  industry: CscIndustry | null
): number {
  const industryCount = industry
    ? CSC_INDUSTRY_QUESTIONS.filter((q) => q.industry === industry).length
    : 0;
  return CSC_CORE_QUESTIONS.length + industryCount;
}

export function getCscRemainingQuestionDescriptors(
  scores: Map<string, CscInferredScore>,
  skipped: Set<string>
): string {
  const remaining: string[] = [];
  for (const cap of CSC_CAPABILITIES_ORDER) {
    const qs = CSC_QUESTIONS_BY_CAPABILITY[cap];
    const unanswered = qs.filter(
      (q) => !scores.has(String(q.id)) && !skipped.has(String(q.id))
    );
    if (unanswered.length > 0) {
      remaining.push(
        `${CSC_CAPABILITY_LABELS[cap]}: ${unanswered
          .map((q) => `Q${q.id}`)
          .join(", ")}`
      );
    }
  }
  return remaining.join("; ");
}

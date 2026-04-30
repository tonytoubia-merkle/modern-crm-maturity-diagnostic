import {
  AICX_CORE_QUESTIONS,
  AICX_INDUSTRY_QUESTIONS,
  AICX_CAPABILITIES_ORDER,
  AICX_CAPABILITY_LABELS,
  AICX_QUESTIONS_BY_CAPABILITY,
} from "@/lib/aicx/data/questions";
import type { AicxChatPhase, AicxInferredScore } from "./types";
import type { AicxIndustry } from "@/lib/aicx/types";

/**
 * Phase thresholds for AI for CX. 36 core questions × six capabilities,
 * matching the B2B/CSC sizing.
 */
export function calculateAicxPhase(
  scores: Map<string, AicxInferredScore>,
  skipped: Set<string>,
  totalQuestions: number
): AicxChatPhase {
  const covered = scores.size + skipped.size;
  if (covered < 6) return "opening";
  if (covered < 24) return "exploration";
  if (covered < totalQuestions) return "gap_filling";
  return "confirmation";
}

export function getAicxCoverageByCapability(
  scores: Map<string, AicxInferredScore>,
  skipped: Set<string>
): Array<{
  capability: string;
  label: string;
  answered: number;
  total: number;
  remaining: (number | string)[];
}> {
  return AICX_CAPABILITIES_ORDER.map((cap) => {
    const questions = AICX_QUESTIONS_BY_CAPABILITY[cap];
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
      label: AICX_CAPABILITY_LABELS[cap],
      answered,
      total: questions.length,
      remaining,
    };
  });
}

export function getAicxTotalQuestionCount(
  industry: AicxIndustry | null
): number {
  const industryCount = industry
    ? AICX_INDUSTRY_QUESTIONS.filter((q) => q.industry === industry).length
    : 0;
  return AICX_CORE_QUESTIONS.length + industryCount;
}

export function getAicxRemainingQuestionDescriptors(
  scores: Map<string, AicxInferredScore>,
  skipped: Set<string>
): string {
  const remaining: string[] = [];
  for (const cap of AICX_CAPABILITIES_ORDER) {
    const qs = AICX_QUESTIONS_BY_CAPABILITY[cap];
    const unanswered = qs.filter(
      (q) => !scores.has(String(q.id)) && !skipped.has(String(q.id))
    );
    if (unanswered.length > 0) {
      remaining.push(
        `${AICX_CAPABILITY_LABELS[cap]}: ${unanswered
          .map((q) => `Q${q.id}`)
          .join(", ")}`
      );
    }
  }
  return remaining.join("; ");
}

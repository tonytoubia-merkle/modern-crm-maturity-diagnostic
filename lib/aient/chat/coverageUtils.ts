import {
  AIENT_CORE_QUESTIONS,
  AIENT_INDUSTRY_QUESTIONS,
  AIENT_CAPABILITIES_ORDER,
  AIENT_CAPABILITY_LABELS,
  AIENT_QUESTIONS_BY_CAPABILITY,
} from "@/lib/aient/data/questions";
import type { AientChatPhase, AientInferredScore } from "./types";
import type { AientIndustry } from "@/lib/aient/types";

export function calculateAientPhase(
  scores: Map<string, AientInferredScore>,
  skipped: Set<string>,
  totalQuestions: number
): AientChatPhase {
  const covered = scores.size + skipped.size;
  if (covered < 6) return "opening";
  if (covered < 24) return "exploration";
  if (covered < totalQuestions) return "gap_filling";
  return "confirmation";
}

export function getAientCoverageByCapability(
  scores: Map<string, AientInferredScore>,
  skipped: Set<string>
): Array<{
  capability: string;
  label: string;
  answered: number;
  total: number;
  remaining: (number | string)[];
}> {
  return AIENT_CAPABILITIES_ORDER.map((cap) => {
    const questions = AIENT_QUESTIONS_BY_CAPABILITY[cap];
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
      label: AIENT_CAPABILITY_LABELS[cap],
      answered,
      total: questions.length,
      remaining,
    };
  });
}

export function getAientTotalQuestionCount(
  industry: AientIndustry | null
): number {
  const industryCount = industry
    ? AIENT_INDUSTRY_QUESTIONS.filter((q) => q.industry === industry).length
    : 0;
  return AIENT_CORE_QUESTIONS.length + industryCount;
}

export function getAientRemainingQuestionDescriptors(
  scores: Map<string, AientInferredScore>,
  skipped: Set<string>
): string {
  const remaining: string[] = [];
  for (const cap of AIENT_CAPABILITIES_ORDER) {
    const qs = AIENT_QUESTIONS_BY_CAPABILITY[cap];
    const unanswered = qs.filter(
      (q) => !scores.has(String(q.id)) && !skipped.has(String(q.id))
    );
    if (unanswered.length > 0) {
      remaining.push(
        `${AIENT_CAPABILITY_LABELS[cap]}: ${unanswered
          .map((q) => `Q${q.id}`)
          .join(", ")}`
      );
    }
  }
  return remaining.join("; ");
}

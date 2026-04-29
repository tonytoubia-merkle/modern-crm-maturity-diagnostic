import type { B2bCapability, B2bResponseItem } from "@/lib/b2b/types";

export interface CscAggregationResult {
  averagedResponses: B2bResponseItem[];
  varianceByQuestion: Record<string, number>;
  responseCountByQuestion: Record<string, number>;
}

/**
 * Averages responses from multiple CSC stakeholder assessments into a
 * single synthetic response set that can be fed into the standard CSC
 * scoring pipeline (computeB2bCapabilityScores, etc).
 *
 * Parallel to lib/workshop/aggregation.ts for CRM — kept as a separate
 * file so CSC types don't leak into the CRM aggregator.
 */
export function aggregateB2bStakeholderResponses(
  allResponses: B2bResponseItem[][]
): CscAggregationResult {
  const byQuestion: Record<
    string,
    { scores: number[]; capability: B2bCapability; isIndustry: boolean }
  > = {};

  for (const responses of allResponses) {
    for (const r of responses) {
      const key = String(r.questionId);
      if (!byQuestion[key]) {
        byQuestion[key] = {
          scores: [],
          capability: r.capability,
          isIndustry: r.isIndustryQuestion,
        };
      }
      byQuestion[key].scores.push(r.score);
    }
  }

  const averagedResponses: B2bResponseItem[] = [];
  const varianceByQuestion: Record<string, number> = {};
  const responseCountByQuestion: Record<string, number> = {};

  for (const [qId, data] of Object.entries(byQuestion)) {
    const n = data.scores.length;
    const mean = data.scores.reduce((a, b) => a + b, 0) / n;
    const roundedMean = Math.round(mean * 100) / 100;

    const variance =
      n > 1
        ? data.scores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / (n - 1)
        : 0;

    averagedResponses.push({
      questionId: /^\d+$/.test(qId) ? Number(qId) : qId,
      score: roundedMean,
      capability: data.capability,
      isIndustryQuestion: data.isIndustry,
    });

    varianceByQuestion[qId] = Math.round(variance * 100) / 100;
    responseCountByQuestion[qId] = n;
  }

  return { averagedResponses, varianceByQuestion, responseCountByQuestion };
}

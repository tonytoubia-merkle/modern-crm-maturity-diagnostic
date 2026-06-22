import {
  EXEC_DIMENSIONS,
  EXEC_QUESTIONS,
  EXEC_QUESTIONS_BY_DIMENSION,
  type ExecDimension,
} from "@/lib/data/execQuestions";
import { computeMaturityStage } from "@/lib/scoring";
import type { Capability, MaturityStage } from "@/lib/types";

/**
 * Shared, pure scoring for the Modern CRM kiosk snapshot. Used by the kiosk
 * itself (client) AND the public QR results page (server) so both render the
 * exact same numbers. Keep this in sync with no one — it IS the single source.
 */

export interface DimensionResult {
  dimension: ExecDimension;
  average: number;
}

export interface ExecResults {
  high: DimensionResult;
  low: DimensionResult;
  overallScore: number;
  maturityStage: MaturityStage;
  capabilityScores: Record<Capability, number>;
}

/** answers: key = exec question id ("exec_1"), value = 1-5 score. */
export function computeExecResults(answers: Record<string, number>): ExecResults {
  const dimensionResults: DimensionResult[] = EXEC_DIMENSIONS.map((d) => {
    const qs = EXEC_QUESTIONS_BY_DIMENSION[d.key];
    const total = qs.reduce((s, q) => s + (answers[q.id] ?? 0), 0);
    const avg = qs.length ? total / qs.length : 0;
    return { dimension: d, average: Math.round(avg * 100) / 100 };
  });

  const capabilityBuckets: Partial<Record<Capability, number[]>> = {};
  for (const q of EXEC_QUESTIONS) {
    const score = answers[q.id];
    if (!score) continue;
    const bucket = capabilityBuckets[q.capability] ?? [];
    bucket.push(score);
    capabilityBuckets[q.capability] = bucket;
  }
  const capabilityScores: Record<Capability, number> = {} as Record<Capability, number>;
  for (const cap of Object.keys(capabilityBuckets) as Capability[]) {
    const arr = capabilityBuckets[cap]!;
    capabilityScores[cap] =
      Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) / 100;
  }

  const capValues = Object.values(capabilityScores).filter((v) => v > 0);
  const overallScore = capValues.length
    ? Math.round((capValues.reduce((a, b) => a + b, 0) / capValues.length) * 100) / 100
    : 0;
  const maturityStage = computeMaturityStage(overallScore);

  const sorted = [...dimensionResults].sort((a, b) => b.average - a.average);
  return {
    high: sorted[0],
    low: sorted[sorted.length - 1],
    overallScore,
    maturityStage,
    capabilityScores,
  };
}

/**
 * Compact, URL-safe encoding of the answers for the QR link: one digit per
 * question in EXEC_QUESTIONS order (0 = unanswered). e.g. "12345345".
 * No PII — just scores — so it's safe to put in a public URL.
 */
export function encodeExecAnswers(answers: Record<string, number>): string {
  return EXEC_QUESTIONS.map((q) => {
    const s = answers[q.id];
    return s && s >= 1 && s <= 5 ? String(s) : "0";
  }).join("");
}

export function decodeExecAnswers(code: string | null | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  if (!code) return out;
  const digits = code.replace(/[^0-5]/g, "");
  EXEC_QUESTIONS.forEach((q, i) => {
    const d = Number(digits[i] ?? "0");
    if (d >= 1 && d <= 5) out[q.id] = d;
  });
  return out;
}

/** True if the code carries at least one real answer (guards the public page). */
export function hasAnyAnswer(answers: Record<string, number>): boolean {
  return Object.values(answers).some((v) => v >= 1 && v <= 5);
}

import type { Capability } from "@/lib/types";

/**
 * Modern CRM Executive Self-Assessment — the shortened, touchscreen-friendly
 * variation of the full Modern CRM Diagnostic. Designed for the Cannes
 * kiosk activation: 5 dimensions, 13 questions, under 5 minutes.
 *
 * Each exec question carries a `capability` tag that maps it back to one of
 * the eight underlying Modern CRM capabilities, so the responses feed into
 * the same scoring pipeline as the full diagnostic.
 */

export interface ExecQuestion {
  /** Stable string ID stored on the response row (e.g. "exec_1"). */
  id: string;
  /** Display number within the assessment (1–13). */
  number: number;
  /** Short prompt the kiosk renders on screen. */
  text: string;
  /** Which executive dimension this question belongs to. */
  dimension: ExecDimensionKey;
  /** Underlying Modern CRM capability — drives scoring + opportunities. */
  capability: Capability;
}

export type ExecDimensionKey =
  | "customer_recognition"
  | "signal_activation"
  | "decisioning_personalization"
  | "orchestration_experience"
  | "growth_optimization";

export interface ExecDimension {
  key: ExecDimensionKey;
  label: string;
  blurb: string;
}

export const EXEC_DIMENSIONS: ExecDimension[] = [
  {
    key: "customer_recognition",
    label: "Customer Recognition",
    blurb:
      "How well your organization sees the same customer across channels, devices, and teams.",
  },
  {
    key: "signal_activation",
    label: "Signal Activation",
    blurb:
      "How fast you capture and act on the behavioral signals customers are sending.",
  },
  {
    key: "decisioning_personalization",
    label: "Decisioning & Personalization",
    blurb:
      "How intelligently you decide who gets what, when, and on which channel.",
  },
  {
    key: "orchestration_experience",
    label: "Orchestration & Experience",
    blurb:
      "How seamlessly you orchestrate journeys across CRM, loyalty, media, and digital.",
  },
  {
    key: "growth_optimization",
    label: "Growth & Optimization",
    blurb:
      "How rigorously you compound learnings into revenue and align teams to outcomes.",
  },
];

export const EXEC_QUESTIONS: ExecQuestion[] = [
  // ── Customer Recognition ─────────────────────────────────────────
  {
    id: "exec_1",
    number: 1,
    text: "Recognizing and connecting customer interactions across channels, devices, and business units?",
    dimension: "customer_recognition",
    capability: "identity",
  },
  {
    id: "exec_2",
    number: 2,
    text: "Sharing customer loyalty and engagement data across teams?",
    dimension: "customer_recognition",
    capability: "identity",
  },

  // ── Signal Activation ────────────────────────────────────────────
  {
    id: "exec_3",
    number: 3,
    text: "Capturing and activating behavioral and intent signals?",
    dimension: "signal_activation",
    capability: "signals",
  },
  {
    id: "exec_4",
    number: 4,
    text: "Using customer lifecycle moments to guide engagement strategies?",
    dimension: "signal_activation",
    capability: "signals",
  },

  // ── Decisioning & Personalization ────────────────────────────────
  {
    id: "exec_5",
    number: 5,
    text: "Personalizing experiences based on customer behavior and context?",
    dimension: "decisioning_personalization",
    capability: "decisioning",
  },
  {
    id: "exec_6",
    number: 6,
    text: "Using predictive models to guide engagement decisions?",
    dimension: "decisioning_personalization",
    capability: "decisioning",
  },
  {
    id: "exec_7",
    number: 7,
    text: "How ready are your data, governance, and AI infrastructure to scale AI-driven decisioning?",
    dimension: "decisioning_personalization",
    capability: "technology",
  },

  // ── Orchestration & Experience ───────────────────────────────────
  {
    id: "exec_8",
    number: 8,
    text: "Coordinating journeys across CRM, loyalty, media, and digital channels?",
    dimension: "orchestration_experience",
    capability: "engagement",
  },
  {
    id: "exec_9",
    number: 9,
    text: "Integrating loyalty and promotions into customer experience strategies?",
    dimension: "orchestration_experience",
    capability: "engagement",
  },
  {
    id: "exec_10",
    number: 10,
    text: "Launching or adapting new customer experiences quickly?",
    dimension: "orchestration_experience",
    capability: "engagement",
  },

  // ── Growth & Optimization ────────────────────────────────────────
  {
    id: "exec_11",
    number: 11,
    text: "Using first-party signals to improve media targeting and relationship growth?",
    dimension: "growth_optimization",
    capability: "media_activation",
  },
  {
    id: "exec_12",
    number: 12,
    text: "Using experimentation and measurement to improve engagement strategies?",
    dimension: "growth_optimization",
    capability: "learning_optimization",
  },
  {
    id: "exec_13",
    number: 13,
    text: "Aligning teams, processes, and tech around shared outcomes?",
    dimension: "growth_optimization",
    capability: "organization",
  },
];

export const EXEC_QUESTIONS_BY_DIMENSION: Record<
  ExecDimensionKey,
  ExecQuestion[]
> = EXEC_DIMENSIONS.reduce((acc, d) => {
  acc[d.key] = EXEC_QUESTIONS.filter((q) => q.dimension === d.key);
  return acc;
}, {} as Record<ExecDimensionKey, ExecQuestion[]>);

export const EXEC_SCORE_LABELS: Record<number, string> = {
  1: "Not yet",
  2: "Early efforts",
  3: "In progress",
  4: "Solid",
  5: "Best in class",
};

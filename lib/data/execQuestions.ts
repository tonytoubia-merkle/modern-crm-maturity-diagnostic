import type { Capability, MaturityStage } from "@/lib/types";

/**
 * Modern CRM Self-Assessment — the kiosk activation variant of the full
 * Modern CRM Diagnostic, written for the Cannes Lions activation.
 * 5 dimensions, 8 questions, ~90 seconds.
 *
 * Each exec question carries a `capability` tag that maps it back to one of
 * the underlying Modern CRM capabilities, so the responses feed into the
 * same scoring pipeline as the full diagnostic.
 */

export interface ExecQuestion {
  /** Stable string ID stored on the response row (e.g. "exec_1"). */
  id: string;
  /** Display number within the assessment (1–8). */
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
  /** One-line framing shown on the dimension page. */
  blurb: string;
  /** Results copy when this is the respondent's strongest dimension. */
  standout: string;
  /** Results copy when this is the respondent's lowest dimension. */
  opportunity: string;
}

export const EXEC_DIMENSIONS: ExecDimension[] = [
  {
    key: "customer_recognition",
    label: "Customer Recognition",
    blurb:
      "How well your organization sees the same customer across channels, devices, and teams.",
    standout:
      "You know who your customer is across channels, devices, and teams. That single source of truth is rarer than it sounds, and it gives everything else you do a stronger foundation.",
    opportunity:
      "Right now, you're likely seeing the same customer differently depending on where you look. Connecting those views is the first move. It unlocks every dimension that follows.",
  },
  {
    key: "signal_activation",
    label: "Signal Activation",
    blurb:
      "How fast you capture and act on the behavioral signals customers are sending.",
    standout:
      "You're capturing intent and acting on it faster than most. That's a genuine competitive edge and a strong foundation to build on.",
    opportunity:
      "Your customers are sending signals (browse behavior, lifecycle moments, purchase intent) but they're not being fully captured or acted on fast enough. The gap between signal and response is where revenue slips.",
  },
  {
    key: "decisioning_personalization",
    label: "Decisioning & Personalization",
    blurb:
      "How intelligently you decide who gets what, when, and on what channel.",
    standout:
      "You're making smart, context-aware decisions about who gets what and when. Personalization at your level isn't just a feature; it's a growth driver.",
    opportunity:
      "Personalization is happening, but it's not yet systematic. You're making good decisions in some channels but guessing in others. Your customers can feel the difference.",
  },
  {
    key: "orchestration_experience",
    label: "Orchestration & Experience",
    blurb:
      "How seamlessly you orchestrate journeys across CRM, loyalty, media, and digital.",
    standout:
      "Your channels are telling one story. Customers move across touchpoints, and the experience holds. That kind of coherence is hard to build and harder to replicate.",
    opportunity:
      "Your channels are working; they're just not working together. Customers who cross from email to media to loyalty feel the friction.",
  },
  {
    key: "growth_optimization",
    label: "Growth & Optimization",
    blurb:
      "How rigorously you compound learnings into revenue and align teams to outcomes.",
    standout:
      "You are compounding your programs brilliantly. First-party signals are feeding smarter targeting, and your teams are aligned around outcomes that really matter.",
    opportunity:
      "There's real signal in your first-party data that isn't making it back to your media or measurement. The learnings are there but aren't flowing into the right places yet.",
  },
];

export const EXEC_QUESTIONS: ExecQuestion[] = [
  // ── Customer Recognition ─────────────────────────────────────────
  {
    id: "exec_1",
    number: 1,
    text: "Recognizing the same customer across channels, devices, and teams?",
    dimension: "customer_recognition",
    capability: "identity",
  },

  // ── Signal Activation ────────────────────────────────────────────
  {
    id: "exec_2",
    number: 2,
    text: "Capturing and acting on behavioral and intent signals in real time?",
    dimension: "signal_activation",
    capability: "signals",
  },
  {
    id: "exec_3",
    number: 3,
    text: "Using customer lifecycle moments to guide when and how you engage?",
    dimension: "signal_activation",
    capability: "signals",
  },

  // ── Decisioning & Personalization ────────────────────────────────
  {
    id: "exec_4",
    number: 4,
    text: "Personalizing experiences based on customer behavior and context?",
    dimension: "decisioning_personalization",
    capability: "decisioning",
  },
  {
    id: "exec_5",
    number: 5,
    text: "Scaling AI-driven decisioning across your data and governance infrastructure?",
    dimension: "decisioning_personalization",
    capability: "technology",
  },

  // ── Orchestration & Experience ───────────────────────────────────
  {
    id: "exec_6",
    number: 6,
    text: "Coordinating journeys across messaging, loyalty, promotions, media, and digital channels?",
    dimension: "orchestration_experience",
    capability: "engagement",
  },

  // ── Growth & Optimization ────────────────────────────────────────
  {
    id: "exec_7",
    number: 7,
    text: "Using first-party signals to sharpen media targeting and deepen customer relationships?",
    dimension: "growth_optimization",
    capability: "media_activation",
  },
  {
    id: "exec_8",
    number: 8,
    text: "Aligning teams and technology around shared, measurable outcomes?",
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

/**
 * Kiosk-friendly maturity stages. Keyed by the same 1–4 MaturityStage the
 * scoring pipeline produces, but with the activation-specific naming and
 * encouraging, opportunity-forward copy from the Cannes brief.
 */
export const EXEC_STAGES: Record<
  MaturityStage,
  { label: string; description: string }
> = {
  4: {
    label: "Leading",
    description:
      "You're operating at the front of the field. The work now is about compounding what's working and staying ahead of what's next.",
  },
  3: {
    label: "Advanced",
    description:
      "You're ahead of most. Your foundation is strong, your signals are flowing, and your teams are largely aligned. The gap between where you are and the leading edge isn't wide, but it's meaningful.",
  },
  2: {
    label: "Developing",
    description:
      "You're making real progress. The infrastructure is taking shape, and your teams are starting to move in the same direction. The next stage is closer than you think.",
  },
  1: {
    label: "Emerging",
    description:
      "The building blocks are in place, but they're not yet connected. There's a significant upside ahead, and the roadmap is clearer than it may seem.",
  },
};

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
      "How well your organization sees the same customer throughout your brand ecosystem.",
    standout:
      "You know who your customer is across channels, devices, and teams. Keep pressure on closing any remaining gaps to stay on top of ever-changing consumer behavior.",
    opportunity:
      "Right now, you're likely seeing the same customer differently depending on where you look. Connecting those views is the first move.",
  },
  {
    key: "signal_activation",
    label: "Signal Activation",
    blurb:
      "How quickly you identify customer signals and turn them into meaningful action.",
    standout:
      "You're picking up on intent and acting fast. Look for ways to tighten the loop even more so fewer signals go unused.",
    opportunity:
      "Your customers are sending signals but they're not fully captured or acted on fast enough. The gap between signal and response is where revenue slips.",
  },
  {
    key: "decisioning_personalization",
    label: "Decisioning & Personalization",
    blurb:
      "How intelligently you decide who gets what, when, and on what channel.",
    standout:
      "You're making smart calls about who gets what and when. Keep refining so those decisions get sharper and more consistent at scale.",
    opportunity:
      "Personalization is happening, but it's not yet systematic. You're making good choices in some channels but guessing in others. Your customers feel the difference.",
  },
  {
    key: "orchestration_experience",
    label: "Orchestration & Experience",
    blurb:
      "How smoothly you connect experiences across channels.",
    standout:
      "Your channels work together to tell one cohesive story. Keep smoothing the edges so every brand touchpoint feels personal.",
    opportunity:
      "Your channels are working; they're just not working together. Customers who cross from email to media to loyalty feel the friction.",
  },
  {
    key: "growth_optimization",
    label: "Growth & Optimization",
    blurb:
      "How effectively you turn insights into results and align teams around them.",
    standout:
      "Your organization is acting on insights well. What other data and dimensions can you connect to optimize the consumer experience?",
    opportunity:
      "There's signal in your owned data that isn't making it back to your media or measurement teams. Your job is to aggregate those signals and act on them.",
  },
];

export const EXEC_QUESTIONS: ExecQuestion[] = [
  // ── Customer Recognition ─────────────────────────────────────────
  {
    id: "exec_1",
    number: 1,
    text: "How well do you recognize the same customer across channels, devices, and teams?",
    dimension: "customer_recognition",
    capability: "identity",
  },

  // ── Signal Activation ────────────────────────────────────────────
  {
    id: "exec_2",
    number: 2,
    text: "How well do you spot and respond to signals in the moment?",
    dimension: "signal_activation",
    capability: "signals",
  },
  {
    id: "exec_3",
    number: 3,
    text: "How well do you time and tailor outreach based on where customers are in their journey?",
    dimension: "signal_activation",
    capability: "signals",
  },

  // ── Decisioning & Personalization ────────────────────────────────
  {
    id: "exec_4",
    number: 4,
    text: "How well do you personalize experiences based on customer behavior and context?",
    dimension: "decisioning_personalization",
    capability: "decisioning",
  },
  {
    id: "exec_5",
    number: 5,
    text: "How well do you use AI to make decisions at scale across your data and systems?",
    dimension: "decisioning_personalization",
    capability: "technology",
  },

  // ── Orchestration & Experience ───────────────────────────────────
  {
    id: "exec_6",
    number: 6,
    text: "How well do you coordinate journeys across messaging, loyalty, promotions, media, and digital channels?",
    dimension: "orchestration_experience",
    capability: "engagement",
  },

  // ── Growth & Optimization ────────────────────────────────────────
  {
    id: "exec_7",
    number: 7,
    text: "How well do you use your own data to improve targeting and build stronger relationships?",
    dimension: "growth_optimization",
    capability: "media_activation",
  },
  {
    id: "exec_8",
    number: 8,
    text: "How well do your teams and tools stay aligned around shared, measurable outcomes?",
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
      "You're leading the field. Now it's about sharpening efficiency and maximizing ROI. Keep pushing forward by testing new ideas and refining what works.",
  },
  3: {
    label: "Advanced",
    description:
      "You're ahead of most, with a strong foundation and aligned teams. Focus on closing data gaps and speeding up how quickly you act on signals.",
  },
  2: {
    label: "Developing",
    description:
      "You're making real progress and building momentum. Keep connecting your data, signals, and teams so everything works together better.",
  },
  1: {
    label: "Emerging",
    description:
      "The building blocks are in place, but they're not yet connected. Focus on linking them so data, signals, and teams start working together more effectively.",
  },
};

import type { Capability, MaturityStage } from "@/lib/types";

/**
 * Modern CRM Short Assessment — the "executive snapshot" variation of the
 * full Modern CRM Diagnostic. Designed for high-friction-free distribution
 * across Cannes activations, Salesforce Connections, executive dinners,
 * QR-driven landing pages, partner co-sell, and outbound marketing.
 *
 * Goal: create curiosity, executive alignment, urgency, and a recognized
 * gap that demands a deeper workshop conversation — without delivering a
 * full roadmap, sequencing, or platform architecture. The sophistication
 * lives in the scoring logic and outputs, not in questionnaire complexity.
 *
 * Each short question carries the underlying Modern CRM capability so
 * responses feed into the same scoring pipeline as the full diagnostic.
 */

export type ShortDimensionKey =
  | "customer_recognition"
  | "signal_activation"
  | "decisioning_personalization"
  | "orchestration_experience"
  | "growth_optimization";

export interface ShortQuestion {
  id: string;
  number: number;
  text: string;
  dimension: ShortDimensionKey;
  capability: Capability;
}

export interface ShortDimension {
  key: ShortDimensionKey;
  label: string;
  blurb: string;
}

export const SHORT_DIMENSIONS: ShortDimension[] = [
  {
    key: "customer_recognition",
    label: "Customer Recognition",
    blurb:
      "How well your organization sees the same customer across channels, devices, and business units.",
  },
  {
    key: "signal_activation",
    label: "Signal Activation",
    blurb:
      "How fast behavioral and lifecycle signals are captured and turned into engagement.",
  },
  {
    key: "decisioning_personalization",
    label: "Decisioning & Personalization",
    blurb:
      "How intelligently you decide who gets what message, offer, or experience next.",
  },
  {
    key: "orchestration_experience",
    label: "Orchestration & Experience",
    blurb:
      "How seamlessly journeys flow across CRM, loyalty, media, service, and digital.",
  },
  {
    key: "growth_optimization",
    label: "Growth & Optimization",
    blurb:
      "How rigorously you compound learnings into revenue and align teams around outcomes.",
  },
];

export const SHORT_QUESTIONS: ShortQuestion[] = [
  // ── Customer Recognition ─────────────────────────────────────────
  {
    id: "short_1",
    number: 1,
    text: "How effectively can your organization recognize and connect customer interactions across channels, devices, and business units?",
    dimension: "customer_recognition",
    capability: "identity",
  },
  {
    id: "short_2",
    number: 2,
    text: "How consistently is customer, loyalty, and engagement data shared across teams to support a unified customer view?",
    dimension: "customer_recognition",
    capability: "identity",
  },

  // ── Signal Activation ────────────────────────────────────────────
  {
    id: "short_3",
    number: 3,
    text: "How effectively does your organization capture and activate behavioral and intent signals in near real time?",
    dimension: "signal_activation",
    capability: "signals",
  },
  {
    id: "short_4",
    number: 4,
    text: "How effectively are customer lifecycle moments, milestones, or risks used to guide engagement strategies?",
    dimension: "signal_activation",
    capability: "signals",
  },

  // ── Decisioning & Personalization ────────────────────────────────
  {
    id: "short_5",
    number: 5,
    text: "How effectively does your organization personalize messaging, offers, and experiences based on customer behavior and context?",
    dimension: "decisioning_personalization",
    capability: "decisioning",
  },
  {
    id: "short_6",
    number: 6,
    text: "To what extent are predictive models, prioritization logic, or next-best-action strategies used to guide engagement decisions?",
    dimension: "decisioning_personalization",
    capability: "decisioning",
  },

  // ── Orchestration & Experience ───────────────────────────────────
  {
    id: "short_7",
    number: 7,
    text: "How effectively are journeys coordinated across CRM, loyalty, media, service, and digital channels?",
    dimension: "orchestration_experience",
    capability: "engagement",
  },
  {
    id: "short_8",
    number: 8,
    text: "To what extent are loyalty and promotions integrated into broader customer experience and engagement strategies?",
    dimension: "orchestration_experience",
    capability: "engagement",
  },
  {
    id: "short_9",
    number: 9,
    text: "How quickly can your organization launch or adapt new customer experiences, journeys, or use cases?",
    dimension: "orchestration_experience",
    capability: "technology",
  },

  // ── Growth & Optimization ────────────────────────────────────────
  {
    id: "short_10",
    number: 10,
    text: "How effectively are first-party customer signals used to improve paid media targeting, acquisition, and owned relationship growth?",
    dimension: "growth_optimization",
    capability: "media_activation",
  },
  {
    id: "short_11",
    number: 11,
    text: "How consistently does your organization use experimentation, measurement, and performance insights to improve engagement strategies?",
    dimension: "growth_optimization",
    capability: "learning_optimization",
  },
  {
    id: "short_12",
    number: 12,
    text: "How aligned are teams, processes, and technology around shared customer and business outcomes rather than channel-specific execution?",
    dimension: "growth_optimization",
    capability: "organization",
  },
];

export const SHORT_QUESTIONS_BY_DIMENSION: Record<
  ShortDimensionKey,
  ShortQuestion[]
> = SHORT_DIMENSIONS.reduce((acc, d) => {
  acc[d.key] = SHORT_QUESTIONS.filter((q) => q.dimension === d.key);
  return acc;
}, {} as Record<ShortDimensionKey, ShortQuestion[]>);

// ── User-visible response scale ──────────────────────────────────────
// Intentionally moves from "Fragmented" → "Adaptive" so the scale itself
// reinforces the Modern CRM narrative (siloed campaigns → connected,
// adaptive relationship orchestration).

export const SHORT_SCORE_LABELS: Record<number, string> = {
  1: "Fragmented",
  2: "Developing",
  3: "Operational",
  4: "Connected",
  5: "Adaptive",
};

export const SHORT_SCORE_DESCRIPTIONS: Record<number, string> = {
  1: "Capability is siloed, ad hoc, or absent. Campaigns run channel-by-channel.",
  2: "Pilots and pockets exist. Some segments and lifecycle touches in play.",
  3: "In use across core teams but not orchestrated end-to-end.",
  4: "Connected across functions with shared KPIs and continuous signal flow.",
  5: "Adaptive — AI-augmented, continuously optimised, and operationalised at scale.",
};

// ── Organizational archetypes ────────────────────────────────────────
// Five named patterns prospects can recognise themselves in. Assignment
// considers overall maturity *and* the strongest dimension, so two
// organisations at the same overall stage can still receive different
// archetypes that reflect *where* they've leaned in their CRM build.

export type ArchetypeKey =
  | "campaign_operator"
  | "loyalty_led_marketer"
  | "media_optimizer"
  | "connected_relationship_engine"
  | "adaptive_growth_organization";

export interface Archetype {
  key: ArchetypeKey;
  label: string;
  /** Short identity sentence shown next to the name. */
  oneLiner: string;
  /** 2–3 sentence narrative shown in the executive summary block. */
  narrative: string;
}

export const ARCHETYPES: Record<ArchetypeKey, Archetype> = {
  campaign_operator: {
    key: "campaign_operator",
    label: "Campaign Operator",
    oneLiner:
      "Channels are running — but they're running independently of each other.",
    narrative:
      "Marketing and CRM are organised around campaigns and channel calendars, not customers. Signals exist in pockets, segmentation is broad, and personalisation is rule-based when it shows up at all. There's clear opportunity to move from broadcast execution to a coordinated, customer-centric operating model — and most of the trapped value sits in the gaps between channels.",
  },
  loyalty_led_marketer: {
    key: "loyalty_led_marketer",
    label: "Loyalty-Led Marketer",
    oneLiner:
      "Loyalty and engagement are strong — they just need an engine behind them.",
    narrative:
      "The loyalty programme and core engagement channels are mature and recognisable to customers, but the underlying identity, signal, and decisioning layer hasn't caught up. The next gain comes from connecting loyalty data, behavioural signal, and decisioning so the same customer view drives every owned moment — not just the loyalty surface.",
  },
  media_optimizer: {
    key: "media_optimizer",
    label: "Media Optimizer",
    oneLiner:
      "Paid media is doing the heavy lifting — owned relationship growth is the next unlock.",
    narrative:
      "Paid acquisition, audience targeting, and performance optimisation are strong, with first-party signals showing up in media. What's still emerging is the connected orchestration that turns those acquired customers into long-term, owned-channel value — closing the gap between media performance and relationship economics.",
  },
  connected_relationship_engine: {
    key: "connected_relationship_engine",
    label: "Connected Relationship Engine",
    oneLiner:
      "Identity, signals, and orchestration are wired together — adaptation is the next horizon.",
    narrative:
      "The CRM engine runs as a connected system: identity is unified, signals flow in near real time, decisioning informs engagement, and journeys cross CRM, loyalty, media, and service. The next move is adaptive — embedding continuous experimentation, AI-driven decisioning, and shared outcome accountability so the engine compounds learnings into revenue.",
  },
  adaptive_growth_organization: {
    key: "adaptive_growth_organization",
    label: "Adaptive Growth Organization",
    oneLiner:
      "The engine is adaptive — the work now is staying ahead of the next horizon.",
    narrative:
      "CRM, loyalty, media, service, and data operate as one adaptive growth engine. Decisioning is AI-augmented, experimentation is continuous, and teams, processes, and tech are aligned around shared outcomes. The competitive edge is no longer the platform — it's the speed at which the organisation can absorb the next wave of agentic and AI-native capabilities.",
  },
};

/**
 * Map an organisation to one of the five archetypes given the overall
 * average and per-dimension averages.
 */
export function resolveArchetype(
  overall: number,
  dimensionAverages: Record<ShortDimensionKey, number>
): Archetype {
  // Identify the strongest dimension (used as a tiebreaker / personality).
  const strongest = (Object.entries(dimensionAverages) as [
    ShortDimensionKey,
    number
  ][]).sort((a, b) => b[1] - a[1])[0]?.[0];

  if (overall >= 4.25) return ARCHETYPES.adaptive_growth_organization;

  if (overall >= 3.5) {
    if (strongest === "growth_optimization")
      return ARCHETYPES.adaptive_growth_organization;
    return ARCHETYPES.connected_relationship_engine;
  }

  if (overall >= 2.75) {
    if (strongest === "growth_optimization")
      return ARCHETYPES.media_optimizer;
    if (strongest === "orchestration_experience")
      return ARCHETYPES.connected_relationship_engine;
    return ARCHETYPES.media_optimizer;
  }

  if (overall >= 1.75) {
    if (strongest === "orchestration_experience")
      return ARCHETYPES.loyalty_led_marketer;
    if (strongest === "growth_optimization")
      return ARCHETYPES.media_optimizer;
    return ARCHETYPES.campaign_operator;
  }

  return ARCHETYPES.campaign_operator;
}

// ── Opportunity narratives (per dimension) ───────────────────────────
// Used to generate the 2–3 "key opportunity areas" callouts on the
// results page. Intentionally directional, not prescriptive — the brief
// is "valuable but incomplete" so the workshop is the next step.

export const DIMENSION_OPPORTUNITY: Record<
  ShortDimensionKey,
  { headline: string; narrative: string }
> = {
  customer_recognition: {
    headline: "Unify the customer view across channels and teams",
    narrative:
      "Organisations at your stage often struggle to operationalise identity across CRM, loyalty, media, and service. A connected customer view is the precondition for everything downstream — and most of the trapped value sits in the seams between systems.",
  },
  signal_activation: {
    headline: "Turn behavioral signals into real-time engagement",
    narrative:
      "Behavioral and lifecycle signals are likely being captured today, but the gap between capture and activation is where value leaks. Closing that loop reframes CRM from calendar-driven to moment-driven.",
  },
  decisioning_personalization: {
    headline: "Move from rules-based to model-driven decisioning",
    narrative:
      "Rules and segments only take personalisation so far. The next phase typically requires aligning decisioning, predictive models, and next-best-action logic so the right offer reaches the right customer in the right channel without manual orchestration.",
  },
  orchestration_experience: {
    headline: "Coordinate journeys across CRM, loyalty, media, and service",
    narrative:
      "The next phase typically requires alignment across CRM, loyalty, media, service, and data strategy — moving from channel-led plans to orchestrated journeys that flex with the customer.",
  },
  growth_optimization: {
    headline: "Align teams and tech around shared outcomes, not channels",
    narrative:
      "Most organisations discover significant trapped value during deeper journey and use-case mapping exercises — particularly where measurement, experimentation, and operating-model alignment have not yet caught up with the underlying engine.",
  },
};

// ── Executive summary narratives by maturity stage ───────────────────
// Used for the "Executive summary" block on the results page. Directional
// per stage — credible, but reserves prescriptive work for the workshop.

export const STAGE_NARRATIVE: Record<MaturityStage, string> = {
  1: "Your results indicate a campaign-led operating model with strong opportunities to build the identity, signal, and decisioning layer that turns marketing from broadcast execution into connected, customer-centric engagement.",
  2: "Your results indicate strong foundational capabilities in places, with the biggest opportunities sitting in connecting them — moving from segmented engagement to coordinated, signal-driven journeys across CRM, loyalty, media, and service.",
  3: "Your results indicate an orchestrated CRM engine with momentum, and opportunities to scale decisioning and adaptive optimisation across more of the customer base — turning operational maturity into compounding business growth.",
  4: "Your results indicate an adaptive, learning-led CRM engine. The opportunity now is less about platform and more about staying ahead — embedding agentic capabilities, sharper measurement, and continuous operating-model improvement.",
};

export const WORKSHOP_TRANSITIONS: string[] = [
  "Organisations at your stage often struggle to operationalise signals across teams and channels.",
  "The next phase typically requires alignment across CRM, loyalty, media, service, and data strategy.",
  "Most organisations discover significant trapped value during deeper journey and use-case mapping exercises.",
];

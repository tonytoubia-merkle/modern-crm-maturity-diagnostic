import type { Opportunity, Capability } from "@/lib/types";

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "identity_resolution",
    title: "Identity Resolution & Unified Customer Profile",
    tagline: "Unify fragmented customer data into a single, actionable view",
    description:
      "Implement a persistent customer identity layer that connects known and unknown interactions across channels. Establish a unified customer profile (UCP) that serves as the foundation for all engagement and decisioning.",
    capabilities: ["identity"],
    triggerThreshold: 3.0,
    scope:
      "Identity graph implementation, data source mapping, profile stitching, and persistent ID strategy across digital and offline channels.",
    methods: [
      "Identity graph design and vendor evaluation",
      "Data source audit and integration mapping",
      "First-party ID strategy (email, phone, loyalty ID)",
      "Cross-device and cross-channel resolution",
      "Profile completeness scorecard",
    ],
    valueNarrative:
      "Organizations with unified identity see 20-35% improvement in campaign match rates and enable the foundational layer required for all personalization and media activation capabilities.",
    sfType: "Identity & Data Foundation",
    engagementSize: "Large (16–24 weeks)",
    priority: "critical",
  },
  {
    id: "householding",
    title: "Householding & Relationship Graph",
    tagline: "Connect customers within households to drive smarter engagement",
    description:
      "Build household and relationship-level intelligence to identify shared accounts, family members, and secondary purchasers. Enable engagement strategies that account for household dynamics and lifecycle stage.",
    capabilities: ["identity"],
    triggerThreshold: 2.5,
    scope:
      "Household clustering methodology, relationship attribution, gift buyer identification, and lifecycle stage modeling.",
    methods: [
      "Household clustering and probabilistic matching",
      "Gift buyer and secondary purchaser identification",
      "Life-stage and relationship modeling",
      "Household-level offer coordination",
    ],
    valueNarrative:
      "Household-aware engagement reduces redundant outreach, improves offer relevance, and unlocks multi-buyer lifecycle strategies that single-profile approaches miss.",
    sfType: "Identity & Data Foundation",
    engagementSize: "Medium (10–14 weeks)",
    priority: "high",
  },
  {
    id: "cdp_signals",
    title: "Real-Time Signal Capture & CDP Implementation",
    tagline: "Capture behavioral signals and activate them in real time",
    description:
      "Implement a Customer Data Platform (CDP) or equivalent architecture to capture, unify, and activate behavioral signals in real or near-real time. Connect web, app, in-store, and service interactions to the customer profile.",
    capabilities: ["signals"],
    triggerThreshold: 3.0,
    scope:
      "CDP evaluation, tag and event taxonomy design, real-time event streaming, and profile enrichment pipeline.",
    methods: [
      "CDP platform selection and implementation",
      "Event taxonomy and tagging strategy",
      "Real-time streaming pipeline (Kafka/Segment)",
      "Signal-to-profile attribution",
      "Near-real-time trigger framework",
    ],
    valueNarrative:
      "Real-time signal capture enables triggered messaging at moments of intent, reducing time-to-engagement from days to minutes and driving significant lift in conversion rates.",
    sfType: "Data & Technology",
    engagementSize: "Large (20–28 weeks)",
    priority: "critical",
  },
  {
    id: "lifecycle_triggers",
    title: "Lifecycle & Milestone Trigger Program",
    tagline: "Engage customers at the moments that matter most",
    description:
      "Design and activate a comprehensive lifecycle trigger program that responds to key customer milestones — onboarding, anniversary, lapse risk, reactivation, and upgrade signals. Move from calendar-based campaigns to event-driven engagement.",
    capabilities: ["signals", "engagement"],
    triggerThreshold: 2.75,
    scope:
      "Lifecycle stage modeling, milestone signal definition, trigger journey design, and multi-channel activation across email, mobile push, and in-app.",
    methods: [
      "Customer lifecycle stage modeling",
      "Milestone signal identification and mapping",
      "Trigger journey design and sequencing",
      "Lapse prediction and re-engagement programs",
      "Win-back and upgrade trigger series",
    ],
    valueNarrative:
      "Lifecycle-triggered programs consistently outperform batch campaigns by 3–5x on engagement and conversion metrics, while reducing overall promotional spend.",
    sfType: "CRM Strategy & Activation",
    engagementSize: "Medium (12–16 weeks)",
    priority: "high",
  },
  {
    id: "predictive_segmentation",
    title: "Predictive Segmentation & Audience Modeling",
    tagline:
      "Replace static segments with dynamic, predictive audience intelligence",
    description:
      "Build a suite of predictive models that power dynamic segmentation — including propensity to purchase, churn risk, CLV tiers, and product affinity. Deploy models into the engagement stack for always-on audience activation.",
    capabilities: ["decisioning"],
    triggerThreshold: 3.0,
    scope:
      "Model development (propensity, CLV, churn), model operationalization, segment taxonomy redesign, and integration with CRM/ESP platform.",
    methods: [
      "Propensity and churn model development",
      "Customer Lifetime Value (CLV) segmentation",
      "Product affinity and next-category modeling",
      "Audience taxonomy simplification",
      "ML ops pipeline and model refresh cadence",
    ],
    valueNarrative:
      "Predictive segmentation improves targeting precision by 30–50%, enabling the right message to reach the right customer and reducing wasteful outreach to low-propensity audiences.",
    sfType: "Analytics & Decisioning",
    engagementSize: "Large (16–20 weeks)",
    priority: "high",
  },
  {
    id: "nba_engine",
    title: "Next Best Action (NBA) Decisioning Engine",
    tagline: "Determine the most relevant action for every customer, every time",
    description:
      "Implement a centralized decisioning layer that dynamically determines the next best action for each customer based on real-time context, behavioral signals, and business rules. Enable coordinated offer, message, and experience prioritization.",
    capabilities: ["decisioning"],
    triggerThreshold: 2.5,
    scope:
      "Decisioning engine architecture, business rules design, offer catalog integration, priority logic framework, and channel arbitration.",
    methods: [
      "NBA decisioning platform selection (Pega, Adobe, custom)",
      "Business rules and offer priority framework",
      "Real-time context signal integration",
      "Channel arbitration and fatigue management",
      "A/B testing and champion/challenger framework",
    ],
    valueNarrative:
      "NBA decisioning moves organizations from rule-based campaigns to intelligent, context-aware engagement — increasing offer acceptance rates by 25–40% and reducing promotional dilution.",
    sfType: "Analytics & Decisioning",
    engagementSize: "Large (20–26 weeks)",
    priority: "critical",
  },
  {
    id: "journey_orchestration",
    title: "Cross-Channel Journey Orchestration",
    tagline:
      "Deliver coordinated experiences across every customer touchpoint",
    description:
      "Design and implement a journey orchestration layer that coordinates customer engagement across email, mobile, app, web, in-store, and service. Replace siloed channel execution with a unified journey strategy.",
    capabilities: ["engagement"],
    triggerThreshold: 3.0,
    scope:
      "Journey architecture design, channel integration mapping, orchestration platform implementation, and journey analytics framework.",
    methods: [
      "Journey architecture and channel mapping",
      "Orchestration platform evaluation and configuration",
      "Cross-channel suppression and frequency management",
      "Service and in-store integration touchpoints",
      "Journey performance measurement framework",
    ],
    valueNarrative:
      "Orchestrated journeys drive 2–4x higher engagement vs. isolated channel programs and create consistent customer experiences that strengthen brand perception and loyalty.",
    sfType: "CRM Strategy & Activation",
    engagementSize: "Large (18–24 weeks)",
    priority: "high",
  },
  {
    id: "loyalty_crm_integration",
    title: "Loyalty–CRM Integration Strategy",
    tagline: "Connect loyalty mechanics to everyday CRM engagement",
    description:
      "Integrate loyalty program data, tier status, and redemption behavior into CRM engagement strategies. Ensure loyalty signals power personalization across all channels — not just the loyalty platform.",
    capabilities: ["engagement"],
    triggerThreshold: 2.75,
    scope:
      "Loyalty data integration, tier-based personalization strategy, CRM–loyalty signal sharing, and program optimization roadmap.",
    methods: [
      "Loyalty data and CRM integration architecture",
      "Tier-based journey and offer design",
      "Loyalty signal activation in paid media",
      "Program economics and discount reduction strategy",
      "Loyalty enrollment and engagement journeys",
    ],
    valueNarrative:
      "Organizations that connect loyalty and CRM see 15–30% improvement in loyalty program ROI and can meaningfully reduce blanket discounting through signal-based offer precision.",
    sfType: "Loyalty & Engagement",
    engagementSize: "Medium (12–18 weeks)",
    priority: "high",
  },
  {
    id: "precision_promotions",
    title: "Precision Promotions & Offer Optimization",
    tagline: "Replace blanket discounting with signal-driven offer strategies",
    description:
      "Design and activate a promotions framework that uses behavioral signals, purchase history, and predictive models to deliver the right offer to the right customer. Reduce promotional dilution while improving conversion rates.",
    capabilities: ["engagement", "decisioning"],
    triggerThreshold: 2.75,
    scope:
      "Offer taxonomy redesign, signal-based eligibility logic, offer optimization testing framework, and promotion P&L measurement.",
    methods: [
      "Offer taxonomy and eligibility framework",
      "Signal-based targeting for promotions",
      "Incrementality testing for offer programs",
      "Discount elasticity modeling",
      "Loyalty-integrated offer delivery",
    ],
    valueNarrative:
      "Precision promotions programs typically achieve 20–35% reduction in promotional spend while maintaining or improving conversion — recovering significant margin that blanket discounting erodes.",
    sfType: "Loyalty & Engagement",
    engagementSize: "Medium (12–16 weeks)",
    priority: "high",
  },
  {
    id: "first_party_media",
    title: "First-Party Data Media Activation",
    tagline: "Turn your customer relationships into media performance advantage",
    description:
      "Build the infrastructure and strategy to activate first-party CRM and loyalty data in paid media channels. Enable lookalike modeling, customer suppression, and high-value audience targeting using owned data assets.",
    capabilities: ["media_activation"],
    triggerThreshold: 3.0,
    scope:
      "Clean room strategy, media audience architecture, first-party data onboarding (LiveRamp/etc.), lookalike and suppression programs, and paid media–CRM feedback loop.",
    methods: [
      "Data clean room implementation (AWS/Google ADH)",
      "First-party audience taxonomy for media",
      "CRM-to-media onboarding via LiveRamp or clean room",
      "Lookalike and suppression audience programs",
      "CRM enrollment campaigns in paid media",
    ],
    valueNarrative:
      "First-party data media activation improves ROAS by 25–50% on targeted campaigns while reducing wasted spend on existing customers. It also future-proofs media strategy in a cookieless environment.",
    sfType: "Media & Acquisition",
    engagementSize: "Large (16–22 weeks)",
    priority: "critical",
  },
  {
    id: "owned_channel_growth",
    title: "Owned Channel Growth Program",
    tagline: "Drive app adoption, loyalty enrollment, and profile completion",
    description:
      "Design paid media campaigns specifically engineered to grow owned relationship assets — app downloads, loyalty enrollment, email opt-ins, and profile completion. Build the first-party data foundation through media investment.",
    capabilities: ["media_activation"],
    triggerThreshold: 2.75,
    scope:
      "Owned channel growth strategy, media-to-CRM conversion measurement, enrollment journey design, and app/loyalty acquisition campaign framework.",
    methods: [
      "Owned channel growth strategy and KPI framework",
      "App acquisition and loyalty enrollment campaigns",
      "Post-acquisition onboarding journey design",
      "Profile completion incentive programs",
      "Media-to-CRM attribution measurement",
    ],
    valueNarrative:
      "Every owned relationship asset acquired through media lowers future CPM costs and builds the first-party data foundation for long-term media efficiency.",
    sfType: "Media & Acquisition",
    engagementSize: "Medium (10–14 weeks)",
    priority: "medium",
  },
  {
    id: "test_learn_framework",
    title: "Test & Learn Framework",
    tagline: "Build an always-on experimentation engine for CRM growth",
    description:
      "Design and implement a structured test-and-learn program for CRM, loyalty, and messaging. Establish a testing roadmap, statistical rigor standards, and a mechanism to scale winning strategies across the engagement portfolio.",
    capabilities: ["learning_optimization"],
    triggerThreshold: 3.0,
    scope:
      "Experimentation framework design, test prioritization methodology, statistical standards, holdout group strategy, and insight-to-action process.",
    methods: [
      "Experimentation framework and governance model",
      "Test prioritization and hypothesis backlog",
      "Holdout and control group strategy",
      "Statistical significance standards and tooling",
      "Insight socialization and action process",
    ],
    valueNarrative:
      "Organizations with structured test-and-learn programs generate 10–20% annual improvement in CRM KPIs through compounding incremental gains across the engagement portfolio.",
    sfType: "Analytics & Decisioning",
    engagementSize: "Medium (10–14 weeks)",
    priority: "high",
  },
  {
    id: "incrementality_measurement",
    title: "Incrementality & Lift Measurement",
    tagline:
      "Prove the true value of loyalty, promotions, and CRM programs",
    description:
      "Implement an incrementality measurement framework to determine the true causal impact of CRM, loyalty, and messaging programs. Move from correlation-based reporting to causal lift measurement that validates investment.",
    capabilities: ["learning_optimization"],
    triggerThreshold: 2.75,
    scope:
      "Incrementality framework design, holdout group architecture, geo-testing approach, and program ROI measurement methodology.",
    methods: [
      "Incrementality framework and methodology design",
      "Holdout group and geo-test architecture",
      "Program-level lift measurement models",
      "Loyalty and promotion ROI framework",
      "Executive reporting and investment case development",
    ],
    valueNarrative:
      "Incrementality measurement enables confident investment decisions and identifies programs that drive real growth vs. those that simply reward customers who would have purchased anyway.",
    sfType: "Analytics & Decisioning",
    engagementSize: "Medium (10–16 weeks)",
    priority: "high",
  },
  {
    id: "crm_intelligence_loop",
    title: "CRM Intelligence Loop",
    tagline: "Close the loop between insights, strategy, and activation",
    description:
      "Build a systematic process for feeding media performance data, engagement analytics, and customer insights back into CRM strategy refinement. Create a closed-loop system where every campaign improves the next.",
    capabilities: ["learning_optimization", "media_activation"],
    triggerThreshold: 2.75,
    scope:
      "Analytics infrastructure, insight-to-strategy process design, segment refresh cadence, and cross-functional insight sharing model.",
    methods: [
      "Media-to-CRM performance feedback pipeline",
      "Segment and audience refresh process",
      "Customer insight repository and governance",
      "Cross-functional insight sharing cadence",
      "CRM strategy review and optimization cycle",
    ],
    valueNarrative:
      "Organizations with closed-loop CRM intelligence reduce time from insight to activation from weeks to days, enabling continuous strategy improvement at scale.",
    sfType: "CRM Strategy & Activation",
    engagementSize: "Medium (8–12 weeks)",
    priority: "medium",
  },
];

export function getTriggeredOpportunities(
  capabilityScores: Record<string, number>,
  limit: number = 6
): Opportunity[] {
  const triggered = OPPORTUNITIES.filter((opp) => {
    return opp.capabilities.some(
      (cap) =>
        capabilityScores[cap] !== undefined &&
        capabilityScores[cap] < opp.triggerThreshold
    );
  });

  // Sort by: priority (critical first), then by lowest capability score gap
  const priorityOrder = { critical: 0, high: 1, medium: 2 };

  triggered.sort((a, b) => {
    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];
    if (aPriority !== bPriority) return aPriority - bPriority;

    // Secondary sort: bigger gap = higher priority
    const aMinScore = Math.min(
      ...a.capabilities.map((c) => capabilityScores[c] ?? 5)
    );
    const bMinScore = Math.min(
      ...b.capabilities.map((c) => capabilityScores[c] ?? 5)
    );
    return aMinScore - bMinScore;
  });

  return triggered.slice(0, limit);
}

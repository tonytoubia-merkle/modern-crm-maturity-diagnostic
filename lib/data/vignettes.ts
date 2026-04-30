import type { ClientStory, Vignette } from "@/lib/types";

export const VIGNETTES: Vignette[] = [
  {
    id: "identity_data_value_mapping",
    title: "Identity & Data Value Mapping",
    description:
      "Map all current customer data sources, identify gaps in identity resolution, and quantify the business value trapped in disconnected data. Participants collaboratively build a data landscape diagram and prioritize integration opportunities.",
    durationMinutes: 90,
    category: "Identity",
    requiredInputs: [
      "Current data source inventory (CRM, ESP, CDP, POS, loyalty platform, etc.)",
      "Known data quality issues or gaps",
      "Current identity resolution approach (if any)",
    ],
    facilitationGuide:
      "**Setup (10 min):** Present the identity maturity model and the client's current score. Explain that the goal is to map what exists and find trapped value.\n\n**Exercise 1 – Data Source Mapping (25 min):** Using a whiteboard or Miro, map all customer data sources. For each source, note: what data it holds, how it connects to other sources, and what customer ID(s) it uses. Identify islands – sources with no connection to the customer graph.\n\n**Exercise 2 – Value Identification (25 min):** For each disconnected data island, brainstorm what use cases would be unlocked if it were connected. Score each by business impact (H/M/L) and integration complexity (H/M/L). Prioritize the high-impact, low-complexity connections.\n\n**Exercise 3 – Identity Strategy (20 min):** Define the target state: what does a unified customer profile look like? What persistent ID strategy would connect these sources? Discuss Merkury Identity as the resolution layer.\n\n**Wrap-up (10 min):** Summarize findings, prioritized integration roadmap, and recommended next steps.",
    expectedOutputs: [
      "Customer data landscape diagram",
      "Prioritized data integration roadmap",
      "Identity resolution strategy recommendation",
    ],
    relatedOpportunityIds: ["merkury_consumer_360", "identity_resolution"],
    triggerCapabilities: ["identity"],
    sortOrder: 1,
  },
  {
    id: "consumer_lifecycle_touchpoint",
    title: "Consumer Lifecycle Touchpoint Mapping",
    description:
      "Map the full customer lifecycle – from awareness through advocacy – and identify the touchpoints, signals, and engagement opportunities at each stage. Industry-specific templates guide the mapping exercise.",
    durationMinutes: 120,
    category: "Lifecycle & Signals",
    requiredInputs: [
      "Current customer journey documentation (if available)",
      "Channel inventory (email, SMS, app, in-store, etc.)",
      "Key lifecycle milestones relevant to the industry",
    ],
    facilitationGuide:
      "**Setup (15 min):** Present the lifecycle framework appropriate to the client's industry. Show the client's signals score and where gaps exist.\n\n**Exercise 1 – Lifecycle Stage Definition (20 min):** As a group, define the key lifecycle stages for this business. Typical stages: Awareness → Acquisition → Onboarding → Engagement → Retention → Win-back → Advocacy. Customize for their context.\n\n**Exercise 2 – Touchpoint Mapping (30 min):** For each lifecycle stage, map: current touchpoints (what happens today), signals available (what data do we capture), and gaps (what should happen but doesn't). Use a large grid with stages as columns and channels as rows.\n\n**Exercise 3 – Trigger Identification (25 min):** Identify the top 10 lifecycle triggers that should exist but don't. For each, define: the signal, the desired action, the channel, and the expected business impact. Prioritize by impact and feasibility.\n\n**Exercise 4 – Orchestration Gaps (20 min):** Review the touchpoint map for cross-channel orchestration gaps – moments where the customer experience breaks because channels don't talk to each other. Mark these as orchestration opportunities.\n\n**Wrap-up (10 min):** Summarize the lifecycle map, top trigger opportunities, and orchestration gaps.",
    expectedOutputs: [
      "Industry-specific lifecycle touchpoint map",
      "Prioritized trigger program roadmap (top 10)",
      "Cross-channel orchestration gap analysis",
    ],
    relatedOpportunityIds: ["lifecycle_triggers", "real_time_signals"],
    triggerCapabilities: ["signals"],
    sortOrder: 2,
  },
  {
    id: "signal_capture_discovery",
    title: "Signal Capture & Tech Discovery",
    description:
      "Audit the current signal capture infrastructure – what behavioral data is collected, where it flows, what's real-time vs. batch, and where connections are broken. This is a technical discovery session.",
    durationMinutes: 60,
    category: "Signals & Technology",
    requiredInputs: [
      "Current martech stack diagram or list",
      "Data pipeline documentation",
      "Tag management and event tracking setup",
    ],
    facilitationGuide:
      "**Setup (5 min):** Present the signals capability score and explain what real-time signal capture means in the Modern CRM context.\n\n**Exercise 1 – Signal Inventory (20 min):** List all behavioral signals currently captured: web events, app events, email engagement, SMS responses, POS transactions, call center interactions, etc. For each, note: capture mechanism, latency (real-time/near-real-time/batch), and where it lands (CDP, data warehouse, ESP, etc.).\n\n**Exercise 2 – Connection Audit (20 min):** Map which signals flow to which activation platforms. Identify broken connections – signals captured but not actionable. Flag the highest-value signals that are stuck in batch or disconnected systems.\n\n**Exercise 3 – Gap Prioritization (15 min):** Identify the top 5 signal gaps: behavioral data that should be captured but isn't, or signals that exist but can't be activated in real-time. Score by business impact.\n\n**Summary:** Document the signal landscape, broken connections, and a prioritized roadmap for signal infrastructure improvement.",
    expectedOutputs: [
      "Signal capture inventory",
      "Tech connection audit (connected vs. disconnected)",
      "Top 5 signal infrastructure gaps",
    ],
    relatedOpportunityIds: ["real_time_signals"],
    triggerCapabilities: ["signals"],
    sortOrder: 3,
  },
  {
    id: "human_loyalty_assessment",
    title: "Human Loyalty Program Assessment",
    description:
      "Evaluate the current loyalty program (or lack thereof) against Merkle's Human Loyalty framework. Identify opportunities to deepen emotional connection, expand value exchange, and drive program differentiation.",
    durationMinutes: 90,
    category: "Loyalty & Engagement",
    requiredInputs: [
      "Current loyalty program details (mechanics, tiers, earn/burn rules)",
      "Program performance data (enrollment, active rate, redemption rate)",
      "Competitive loyalty landscape overview",
    ],
    facilitationGuide:
      "**Setup (10 min):** Introduce the Human Loyalty framework – loyalty that earns emotional connection, not just transactions. Present the client's engagement capability score.\n\n**Exercise 1 – Program Health Check (25 min):** Score the current program against Merkle's proprietary loyalty benchmarks across: value proposition, earn mechanics, redemption experience, personalization, emotional connection, and program differentiation. Identify the weakest dimensions.\n\n**Exercise 2 – Value Exchange Redesign (25 min):** Brainstorm what a reimagined value exchange could look like. Go beyond transactional earn/burn – consider experiential rewards, surprise-and-delight moments, recognition without points, community, and status mechanics.\n\n**Exercise 3 – Integration Opportunities (20 min):** Map how loyalty data could feed CRM engagement strategies, media targeting, and personalization. Identify the integration gaps between the loyalty platform and the broader engagement stack.\n\n**Wrap-up (10 min):** Summarize assessment, redesign ideas, and recommended next steps (Loyalty Blueprint engagement).",
    expectedOutputs: [
      "Loyalty program health scorecard",
      "Value exchange redesign concepts",
      "Loyalty-CRM integration opportunity map",
    ],
    relatedOpportunityIds: ["human_loyalty"],
    triggerCapabilities: ["engagement"],
    sortOrder: 4,
  },
  {
    id: "nba_design_workshop",
    title: "Next Best Action Design Workshop",
    description:
      "Design the framework for an intelligent decisioning layer that determines the most relevant action for each customer. Define the rules, models, and arbitration logic that would replace batch campaign planning.",
    durationMinutes: 120,
    category: "Decisioning & AI",
    requiredInputs: [
      "Current segmentation approach and targeting rules",
      "Offer/promotion catalog and prioritization logic",
      "Existing models (propensity, churn, CLV) if any",
    ],
    facilitationGuide:
      "**Setup (15 min):** Explain the shift from campaign-centric to customer-centric decisioning. Present the NBA concept and the client's decisioning score.\n\n**Exercise 1 – Decision Framework (30 min):** Define the key decisions the NBA engine should make: What message? What offer? What channel? What timing? For each decision type, map: current approach (rules-based, model-driven, or ad hoc) and desired future state.\n\n**Exercise 2 – Arbitration Logic (30 min):** Design the priority framework. When multiple offers or messages compete for the same customer at the same moment, what wins? Define business rules, model scores, and customer preferences that should factor in. Address communication fatigue and frequency capping.\n\n**Exercise 3 – Model Roadmap (30 min):** Identify the predictive models needed: propensity to purchase, churn risk, CLV, product affinity, channel preference. Prioritize by: business impact, data readiness, and model complexity.\n\n**Wrap-up (15 min):** Summarize the NBA framework, arbitration logic, and model development roadmap.",
    expectedOutputs: [
      "NBA decision framework design",
      "Offer arbitration and priority logic",
      "Predictive model development roadmap",
    ],
    relatedOpportunityIds: ["nba_engine", "predictive_segmentation"],
    triggerCapabilities: ["decisioning"],
    sortOrder: 5,
  },
  {
    id: "journey_orchestration_mapping",
    title: "Cross-Channel Journey Mapping",
    description:
      "Map the target-state customer journey across all channels, identifying orchestration opportunities where coordinated experiences would replace siloed channel execution.",
    durationMinutes: 90,
    category: "Engagement & Orchestration",
    requiredInputs: [
      "Current channel execution overview",
      "Customer feedback or satisfaction data",
      "Known pain points in the customer experience",
    ],
    facilitationGuide:
      "**Setup (10 min):** Present the concept of orchestration vs. channel execution. Show the client's engagement score and identify the gap.\n\n**Exercise 1 – Journey Selection (15 min):** Select 2-3 critical customer journeys to map in detail (e.g., new customer onboarding, lapse re-engagement, high-value customer nurture).\n\n**Exercise 2 – Current-State Mapping (25 min):** For each journey, map what happens today across all channels. Identify moments where the experience breaks – channel handoff failures, repeated messages, missed opportunities, inconsistent content.\n\n**Exercise 3 – Target-State Design (30 min):** For each journey, design the orchestrated experience. Define: trigger signals, channel sequence, content strategy, timing rules, and exit criteria. Ensure each touchpoint builds on the previous one.\n\n**Wrap-up (10 min):** Prioritize journeys by business impact and implementation complexity. Define the orchestration platform requirements.",
    expectedOutputs: [
      "2-3 detailed journey maps (current vs. target state)",
      "Orchestration gap analysis",
      "Journey prioritization matrix",
    ],
    relatedOpportunityIds: ["journey_orchestration", "crm_messaging"],
    triggerCapabilities: ["engagement"],
    sortOrder: 6,
  },
  {
    id: "first_party_media_blueprint",
    title: "First-Party Media Activation Blueprint",
    description:
      "Design the strategy for activating CRM and loyalty data in paid media channels. Define audience architecture, suppression logic, and the CRM-to-media feedback loop.",
    durationMinutes: 60,
    category: "Media Activation",
    requiredInputs: [
      "Current media targeting approach",
      "Available first-party data assets",
      "Clean room / data onboarding capabilities",
    ],
    facilitationGuide:
      "**Setup (5 min):** Present the media activation score and explain the CRM-media connection opportunity.\n\n**Exercise 1 – Audience Architecture (20 min):** Define the first-party audience segments that should be available for media activation: high-value customer lookalikes, lapsed customer suppression, loyalty tier targeting, purchase-based affinity audiences. Map which data sources feed each.\n\n**Exercise 2 – Activation Pathways (20 min):** For each audience, define the activation pathway: how does the data get from CRM/loyalty to the media platform? Evaluate: direct integration, clean room, identity partner (Merkury), or data onboarding service.\n\n**Exercise 3 – Feedback Loop (15 min):** Design the CRM-media feedback loop: how do media outcomes (conversions, sign-ups, enrollments) flow back into CRM for attribution and optimization?\n\n**Summary:** Document audience architecture, activation pathways, and feedback loop design.",
    expectedOutputs: [
      "First-party audience taxonomy for media",
      "Activation pathway map",
      "CRM-media feedback loop design",
    ],
    relatedOpportunityIds: ["first_party_media", "owned_channel_growth"],
    triggerCapabilities: ["media_activation"],
    sortOrder: 7,
  },
  {
    id: "test_learn_framework_build",
    title: "Test & Learn Framework Design",
    description:
      "Design an experimentation framework for CRM, loyalty, and engagement programs. Establish testing methodology, governance, and the insight-to-action process.",
    durationMinutes: 60,
    category: "Learning & Optimization",
    requiredInputs: [
      "Current testing/experimentation practices",
      "Available tools for A/B testing and measurement",
      "Key business questions that testing should answer",
    ],
    facilitationGuide:
      "**Setup (5 min):** Present the learning & optimization score. Explain the role of experimentation in Modern CRM's Adaptive Intelligence stage.\n\n**Exercise 1 – Test Prioritization (20 min):** Brainstorm the top 10 questions the business needs to answer through experimentation. Prioritize using an impact/effort matrix. Examples: Does personalized subject lines lift open rates? Does loyalty tier messaging reduce churn?\n\n**Exercise 2 – Methodology Design (20 min):** For the top 3-5 tests, define: hypothesis, test design (A/B, holdout, geo-test), success metric, sample size requirements, and test duration. Establish statistical significance standards.\n\n**Exercise 3 – Governance & Cadence (15 min):** Define the testing governance model: who prioritizes tests, who reviews results, how insights get socialized, and how winning strategies scale. Establish a testing cadence (e.g., always have 3-5 tests in market).\n\n**Summary:** Document prioritized test backlog, methodology standards, and governance model.",
    expectedOutputs: [
      "Prioritized experimentation backlog",
      "Testing methodology standards",
      "Experimentation governance model",
    ],
    relatedOpportunityIds: ["test_learn_framework", "incrementality_measurement"],
    triggerCapabilities: ["learning_optimization"],
    sortOrder: 8,
  },
  {
    id: "gamification_mechanics_design",
    title: "Gamification & Engagement Mechanics",
    description:
      "Explore gamification mechanics that can drive behavioral change and emotional engagement beyond traditional loyalty. Design engagement experiences using motivational science principles.",
    durationMinutes: 90,
    category: "Engagement & Gamification",
    requiredInputs: [
      "Current engagement/gamification programs (if any)",
      "Target customer behaviors to drive",
      "Competitive engagement landscape",
    ],
    facilitationGuide:
      "**Setup (10 min):** Introduce Merkle's gamification framework – 50+ proven mechanics, motivational science (dopamine loops, habit formation), and 25 years of experience. Present examples from Starbucks for Life and other programs.\n\n**Exercise 1 – Behavior Goals (20 min):** Define the top 5 customer behaviors the business wants to drive: purchase frequency, profile completion, app adoption, referral, content engagement, etc. For each, identify current incentive approach and its effectiveness.\n\n**Exercise 2 – Mechanic Selection (30 min):** For each behavior goal, explore potential gamification mechanics: sweepstakes, instant win, badges, streaks, missions, leaderboards, challenges, unlockables. Score each by: motivational fit, implementation complexity, and expected lift.\n\n**Exercise 3 – Experience Design (20 min):** For the top 2-3 mechanics, sketch the customer experience: entry point, game flow, reward structure, and integration with existing loyalty/CRM programs.\n\n**Wrap-up (10 min):** Prioritize mechanics, estimate engagement and business impact, and define next steps.",
    expectedOutputs: [
      "Behavior-to-mechanic mapping",
      "Top 2-3 gamification experience concepts",
      "Expected impact and implementation roadmap",
    ],
    relatedOpportunityIds: ["gamification", "experiential_promotions"],
    triggerCapabilities: ["engagement"],
    sortOrder: 9,
  },
  {
    id: "householding_relationship",
    title: "Household & Relationship Intelligence",
    description:
      "Explore household-level marketing opportunities – identifying families, gift buyers, shared accounts, and multi-buyer dynamics that single-profile approaches miss.",
    durationMinutes: 60,
    category: "Identity",
    requiredInputs: [
      "Current household/family marketing approaches",
      "Gift purchase data (if available)",
      "Multi-account or shared account indicators",
    ],
    facilitationGuide:
      "**Setup (5 min):** Explain household intelligence and why single-profile CRM misses significant revenue opportunities.\n\n**Exercise 1 – Relationship Mapping (20 min):** Identify the types of customer relationships relevant to this business: family members, gift buyers, account sharers, household decision-makers, influencers. For each, discuss: how are they identified today? What data would reveal them?\n\n**Exercise 2 – Use Case Design (20 min):** For each relationship type, design 2-3 engagement use cases. Example: gift buyer identification → gift reminder program → household cross-sell. Estimate incremental revenue opportunity for each.\n\n**Exercise 3 – Data Requirements (15 min):** Define the data and identity requirements to operationalize household intelligence. What matching logic is needed? What role does Merkury Identity play?\n\n**Summary:** Document relationship types, use cases, and data requirements.",
    expectedOutputs: [
      "Household relationship type inventory",
      "Engagement use cases per relationship type",
      "Data and identity requirements",
    ],
    relatedOpportunityIds: ["householding"],
    triggerCapabilities: ["identity"],
    sortOrder: 10,
  },
  {
    id: "tech_stack_integration_audit",
    title: "Tech Stack Integration Audit",
    description:
      "Conduct a hands-on audit of the client's marketing technology stack. Identify what's connected, what's siloed, and where integration gaps create customer experience breakdowns.",
    durationMinutes: 90,
    category: "Technology & Data",
    requiredInputs: [
      "Complete martech stack inventory",
      "Integration documentation or architecture diagrams",
      "Known integration pain points",
    ],
    facilitationGuide:
      "**Setup (10 min):** Present the tech audit framework. Explain that the goal is to understand the real state of integration – not the intended architecture, but what actually works today.\n\n**Exercise 1 – Stack Inventory (20 min):** List every platform in the martech stack: CDP, ESP, CRM, loyalty platform, analytics, DMP, commerce platform, service platform, etc. For each, note: vendor, primary use case, and who owns it.\n\n**Exercise 2 – Connection Mapping (30 min):** On a whiteboard, draw the actual data flows between systems. For each connection, note: data type, direction, frequency (real-time/batch/manual), and reliability. Use red lines for broken or unreliable connections.\n\n**Exercise 3 – Gap Prioritization (20 min):** Identify the top integration gaps that cause customer experience breakdowns or prevent key CRM use cases. Prioritize by business impact and integration complexity.\n\n**Wrap-up (10 min):** Summarize the tech stack landscape, integration health, and prioritized modernization roadmap.",
    expectedOutputs: [
      "Martech stack inventory with ownership",
      "Integration connection map (with health status)",
      "Prioritized integration modernization roadmap",
    ],
    relatedOpportunityIds: ["merkury_consumer_360", "real_time_signals"],
    triggerCapabilities: ["identity", "signals"],
    sortOrder: 11,
  },
  {
    id: "crm_intelligence_loop_design",
    title: "CRM Intelligence Loop Design",
    description:
      "Design the systematic process for feeding performance data, engagement analytics, and customer insights back into CRM strategy refinement. Build the closed-loop system.",
    durationMinutes: 60,
    category: "Learning & Optimization",
    requiredInputs: [
      "Current reporting and analytics cadence",
      "Available data sources for performance measurement",
      "Decision-making process for CRM strategy changes",
    ],
    facilitationGuide:
      "**Setup (5 min):** Explain the Intelligence Loop concept – where every campaign improves the next. Present the learning & optimization score.\n\n**Exercise 1 – Current Loop Assessment (20 min):** Map the current insight-to-action process. How do campaign results inform the next campaign? How long does it take from insight to strategy change? Identify the bottlenecks.\n\n**Exercise 2 – Target Loop Design (20 min):** Design the closed-loop system: what data flows in (media performance, engagement metrics, customer signals), what process operates on it (regular reviews, automated triggers, model retraining), and what actions result (segment refresh, journey optimization, offer adjustment).\n\n**Exercise 3 – Governance (15 min):** Define who owns the loop: cross-functional team composition, meeting cadence, decision rights, and escalation path for underperforming programs.\n\n**Summary:** Document current vs. target loop, governance model, and implementation plan.",
    expectedOutputs: [
      "Current vs. target intelligence loop diagram",
      "Cross-functional governance model",
      "Implementation roadmap",
    ],
    relatedOpportunityIds: ["crm_intelligence_loop"],
    triggerCapabilities: ["learning_optimization"],
    sortOrder: 12,
  },
  {
    id: "innovation_horizon_sprint",
    title: "Innovation Horizon Sprint",
    description:
      "A half-day innovation session exploring the frontier of Modern CRM: generative AI personalization, agentic CRM, autonomous engagement, and next-generation customer intelligence.",
    durationMinutes: 180,
    category: "Innovation & AI",
    requiredInputs: [
      "Current AI/ML initiatives and capabilities",
      "Innovation priorities and appetite for experimentation",
      "Competitive landscape and industry disruption signals",
    ],
    facilitationGuide:
      "**Setup (15 min):** Present the Modern CRM maturity model's Adaptive Intelligence stage. Show where the client sits and what the frontier looks like. Frame this as an exploration session – not commitment, but possibility.\n\n**Exercise 1 – GenAI Personalization (40 min):** Explore how generative AI could transform content creation, offer personalization, and customer experience at scale. Demo examples. Brainstorm 5-10 use cases specific to this client's context. Evaluate feasibility and expected impact.\n\n**Exercise 2 – Agentic CRM (40 min):** Introduce the concept of AI agents operating within the CRM stack – autonomous engagement, intelligent routing, proactive customer service. Explore what tasks could be delegated to agents today and what the 2-year horizon looks like.\n\n**Exercise 3 – Innovation Roadmap (40 min):** Combine the best ideas into a phased innovation roadmap. Phase 1: quick wins with existing AI capabilities. Phase 2: structured pilots for new capabilities. Phase 3: transformative bets. Assign owners and timeline.\n\n**Break (15 min)**\n\n**Exercise 4 – CRM Center of Excellence (20 min):** Discuss the organizational model needed to sustain innovation. What does a CRM CoE look like? Who's in it? How does it govern experimentation?\n\n**Wrap-up (10 min):** Summarize innovation roadmap, pilot proposals, and CoE recommendation.",
    expectedOutputs: [
      "Innovation use case backlog (GenAI + Agentic)",
      "Phased innovation roadmap",
      "CRM Center of Excellence recommendation",
    ],
    relatedOpportunityIds: [
      "modern_crm_innovation_sprint",
      "genai_personalization",
      "agentic_crm_pilot",
      "crm_center_of_excellence",
    ],
    triggerCapabilities: ["decisioning", "learning_optimization", "engagement"],
    sortOrder: 13,
  },
];

export function getVignettesForOpportunities(
  opportunityIds: string[],
  industry?: string
): Vignette[] {
  const idSet = new Set(opportunityIds);
  const matched = VIGNETTES.filter((v) =>
    v.relatedOpportunityIds.some((oid) => idSet.has(oid))
  );

  // Filter by industry if applicable
  const filtered = industry
    ? matched.filter(
        (v) => !v.industries || v.industries.length === 0 || v.industries.includes(industry as never)
      )
    : matched;

  // Sort by coverage (how many triggered opps this vignette serves) then sortOrder
  filtered.sort((a, b) => {
    const aCoverage = a.relatedOpportunityIds.filter((id) => idSet.has(id)).length;
    const bCoverage = b.relatedOpportunityIds.filter((id) => idSet.has(id)).length;
    if (bCoverage !== aCoverage) return bCoverage - aCoverage;
    return a.sortOrder - b.sortOrder;
  });

  return filtered;
}

// ══════════════════════════════════════════════════════════════════
// CLIENT_STORIES – anonymized Modern CRM proof points
// Sourced from the Modern CRM POV (Pre Jan 2026 v3), the Merkury
// Consumer 360 toolkit, the Human Loyalty Offering (v1.3), the CRM
// Messaging Offering (v1.4), the Experiential Promotions toolkit
// (v2.1), and the Gamification / Branded Games toolkit (v2.1).
// ══════════════════════════════════════════════════════════════════

export const CLIENT_STORIES: ClientStory[] = [
  {
    id: "merkury_identity_foundation",
    title: "Merkury Identity Foundation Unlocks Stalled CRM Use Cases",
    tagline:
      "Unified identity graph rolled three high-value AI use cases out of pilot inside a quarter",
    capabilities: ["identity", "signals", "technology"],
    narrative:
      "A retail client had invested in a CDP, marketing automation, and an ambitious personalisation roadmap – but every AI use case stalled because identity was fragmented across CRM, ecommerce, app, and loyalty. Merkle deployed Merkury as the unified identity layer, integrated deterministic and probabilistic resolution, instrumented signal pipelines, and stood up the consent and segmentation framework. With the foundation in place, three stalled AI use cases (next-best-action on web, anonymous-shopper personalisation, app re-engagement) shipped within 90 days of foundation go-live.",
    outcomes: [
      "Single source of truth across CRM, ecommerce, app, and loyalty",
      "Identity resolution coverage on 78% of high-value customers",
      "Three stalled AI use cases shipped within 90 days of foundation go-live",
      "Quarterly value-realisation scorecard now governs all downstream investment",
    ],
    industries: ["retail", "travel_hospitality"],
    prompts: [
      "How many systems hold a 'customer record' today, and which one is canonical?",
      "Which CRM use case has been stuck longest, and what data gap is the real blocker?",
      "Who owns customer-data quality at the enterprise level, and what's their KPI?",
    ],
  },
  {
    id: "human_loyalty_reframe",
    title: "Human Loyalty: From Points Programme to Relationship Engine",
    tagline:
      "Reframing loyalty as relationship lifted active-member spend 14% and cut churn 6 points",
    capabilities: ["engagement", "decisioning", "learning_optimization"],
    narrative:
      "A travel-and-hospitality client's loyalty programme had high enrollment and falling engagement – points-economy mechanics had stopped moving the needle on spend or retention. Merkle ran the Human Loyalty engagement: redesigned the programme around emotional loyalty drivers, added experiential and recognition mechanics on top of the points layer, and instrumented a behavioural-segment scoring model that triggered relationship moments (anniversary, milestone, comeback) in real time. Inside one year: active-member spend +14%, churn -6 points, and member NPS lifted into the top quartile of the segment.",
    outcomes: [
      "Active-member spend +14%",
      "Churn -6 points across the loyalty base",
      "Member NPS lifted into the segment's top quartile",
      "Behavioural-segment scoring model adopted as the program's operating standard",
    ],
    industries: ["travel_hospitality", "retail"],
    prompts: [
      "Where has your loyalty programme stopped moving spend or retention?",
      "What share of programme value comes from points vs. emotional or experiential moments?",
      "Which relationship moments (anniversary, milestone, comeback) does your programme miss today?",
    ],
  },
  {
    id: "crm_messaging_modernization",
    title: "Modernised CRM Messaging Across Owned Channels",
    tagline:
      "AI-driven decisioning across email, SMS, push and in-app lifted owned-channel revenue 22%",
    capabilities: ["decisioning", "engagement", "media_activation"],
    narrative:
      "A financial-services client's CRM messaging programme ran on rules and weekly batch – high-value segments received generic content and best-time-to-send was set by the same calendar for everyone. Merkle modernised the program: real-time decisioning engine, NBA model, channel-of-preference and send-time-optimisation models, content factory, and an experimentation harness with holdouts on every campaign. Inside two quarters: owned-channel revenue +22%, unsubscribe rate -18%, and the messaging team shifted from campaign-execution mode to programme-design mode.",
    outcomes: [
      "Owned-channel revenue +22%",
      "Unsubscribe rate -18% with no engagement regression",
      "Real-time decisioning replaced rules and batch across email, SMS, push, in-app",
      "Holdout discipline gave the CFO an attributable view of CRM lift",
    ],
    industries: ["financial_services", "retail"],
    prompts: [
      "Which CRM channel is still running on rules that should be running on models?",
      "Where are your highest-value segments getting generic content today?",
      "How is your current messaging programme attributing lift – holdout or fingers-crossed?",
    ],
  },
  {
    id: "experiential_promotion_at_scale",
    title: "Experiential Promotion at Scale",
    tagline:
      "Multi-touch experiential promo lifted promotional ROI 31% and grew first-party data 4×",
    capabilities: ["engagement", "media_activation", "signals"],
    narrative:
      "A QSR client's promotional calendar leaned heavily on price discounts – short-term lift, no first-party data, no compounding effect. Merkle designed an experiential promotion programme: gamified mobile mechanics, tiered rewards, real-world activation moments, and a signal-capture layer that fed back into segmentation. Across two flagship promotions, ROI lifted 31% over the price-discount baseline, first-party data acquired through promo participation grew 4×, and the segmented audience powered downstream personalisation across email and app.",
    outcomes: [
      "Promotional ROI +31% over the price-discount baseline",
      "First-party data captured through promo participation grew 4×",
      "Segmented audience powered downstream personalisation across email + app",
      "Promotion design shifted from discount-led to experience-led across the calendar",
    ],
    industries: ["qsr", "retail"],
    prompts: [
      "What share of your promotional calendar is still price-discount led?",
      "How much first-party data does a typical promotion produce – and where does it land?",
      "Which experiential mechanic could replace a discount on your next flagship promo?",
    ],
  },
  {
    id: "branded_game_acquisition",
    title: "Branded Game as the Acquisition + Engagement Surface",
    tagline:
      "Branded mobile game acquired 1.4M opted-in customers and lifted in-store visit frequency 9%",
    capabilities: ["engagement", "media_activation", "signals"],
    narrative:
      "A QSR brand wanted to grow its loyalty programme without leaning on aggressive discounting. Merkle designed and shipped a branded mobile game – daily mechanic, episodic seasonal content, real-world reward redemption, and tight integration with the loyalty programme. Inside 12 months the game acquired 1.4M opted-in customers, lifted in-store visit frequency for active players by 9%, and produced a steady stream of behavioural and preference signal that fed the personalisation engine.",
    outcomes: [
      "1.4M opted-in customers acquired through the branded game",
      "Active-player visit frequency +9% in-store",
      "Behavioural + preference signal stream fed the personalisation engine",
      "Reduced reliance on discount-led acquisition across the marketing calendar",
    ],
    industries: ["qsr", "retail", "automotive"],
    prompts: [
      "Where could a branded game replace a campaign-led acquisition push?",
      "What signal would a daily-mechanic surface produce that you don't have today?",
      "How would you tie a game's engagement back into the loyalty programme economics?",
    ],
  },
  {
    id: "modern_crm_north_star",
    title: "Modern CRM North Star Unlocks Multi-Year Roadmap",
    tagline:
      "Leadership visioning + capability radar funded a $40M three-year CRM transformation",
    capabilities: ["organization", "technology"],
    narrative:
      "A B2C client had every modern CRM capability somewhere in the business – and almost none of them connected. Merkle ran a North Star engagement: leadership visioning, a Modern CRM maturity radar across all eight capabilities, and a sequenced roadmap that paired each capability with the business outcome it unlocked. The output became the funding artifact that secured a $40M three-year transformation programme, with quarterly value-realisation reviews tying spend to outcome lift.",
    outcomes: [
      "$40M three-year CRM transformation programme funded",
      "Capability radar adopted as the leadership operating dashboard",
      "Sequenced roadmap pairs every investment with a business-outcome unlock",
      "Quarterly value-realisation reviews keep the programme funded and on plan",
    ],
    industries: ["financial_services", "retail", "automotive"],
    prompts: [
      "Does your leadership team share a single Modern CRM North Star today?",
      "Which CRM capability would unlock the most business outcome if invested in next?",
      "How is your CRM programme tied back to value realisation in the CFO's view?",
    ],
  },
];

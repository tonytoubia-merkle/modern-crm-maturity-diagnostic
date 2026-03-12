import type { Opportunity, Capability } from "@/lib/types";

export const OPPORTUNITIES: Opportunity[] = [
  // ── IDENTITY ────────────────────────────────────────────────────────────────

  {
    id: "merkury_consumer_360",
    title: "Merkury Consumer 360",
    tagline: "Build the unified data foundation that powers modern CRM",
    description:
      "Implement a future-ready, composable customer data environment powered by Merkury Identity — Merkle's industry-leading identity resolution and graph. Connect disparate data sources into a unified consumer view that enables AI-ready personalization, advanced analytics, and omni-channel activation. This is the foundational investment that unlocks downstream CRM capability.",
    capabilities: ["identity", "signals"],
    triggerThreshold: 3.0,
    scope:
      "Cloud-native data environment build (Snowflake-based), Merkury Identity integration, automated data ingestion and profiling, audience publishing, and martech connectivity.",
    methods: [
      "Current-state data audit and gap analysis (AI Data Readiness Audit, $100K–$175K)",
      "Merkury Identity graph integration for a single, persistent consumer ID",
      "Automated data pipeline build (ingestion, cleansing, transformation)",
      "Real-time profile creation, enrichment, and compliance governance",
      "Audience publishing to activation channels (media, email, SMS, commerce)",
    ],
    valueNarrative:
      "To be AI-ready and drive true personalization, brands must have the right data environment. Merkury Consumer 360 connects data, identity, and technology to remove silos — enabling intelligent, always-on engagement. 'Data is siloed. Customers are not.' Merkle has deployed 160 marketing databases and processes 160B CDI records annually. Clients see faster time-to-market on CX outcomes and the foundational capability for all downstream personalization and media activation.",
    sfType: "Data & Technology",
    engagementSize: "Large (20–32 weeks)",
    priority: "critical",
  },

  {
    id: "identity_resolution",
    title: "Identity Resolution & Unified Customer Profile",
    tagline: "Recognize every customer — known and unknown — across every touchpoint",
    description:
      "Implement a persistent customer identity layer that connects known and anonymous data into a single record that travels with the customer across channels, devices, and business units. Identity is the foundation of Modern CRM — enabling real-time intent recognition, extending CRM beyond owned channels into paid and earned media, and unlocking 1:1 engagement at scale.",
    capabilities: ["identity"],
    triggerThreshold: 3.0,
    scope:
      "Identity graph design and implementation, data source mapping, persistent ID strategy, cross-device and cross-channel resolution, and profile completeness scoring.",
    methods: [
      "Identity graph design and vendor evaluation",
      "First-party ID strategy (email, phone, loyalty ID, device ID)",
      "Cross-device and cross-channel resolution via Merkury Identity",
      "Anonymous-to-known resolution pipeline",
      "Profile completeness scorecard and enrichment roadmap",
    ],
    valueNarrative:
      "Identity connects known and anonymous data into a single, persistent record that travels with the customer across channels, devices, and business units. 1 in 3 marketing dollars is wasted due to incomplete, duplicated, or poorly integrated customer data — identity resolution reclaims that value. Organizations with unified identity see 20–35% improvement in campaign match rates and enable the foundational layer required for all personalization and media activation.",
    sfType: "Identity & Data Foundation",
    engagementSize: "Large (16–24 weeks)",
    priority: "critical",
  },

  {
    id: "householding",
    title: "Householding & Relationship Graph",
    tagline: "Connect customers within households to drive smarter engagement",
    description:
      "Build household and relationship-level intelligence to identify shared accounts, family members, gift buyers, and secondary purchasers. Enable engagement strategies that account for household dynamics and lifecycle stage — unlocking multi-buyer strategies that single-profile approaches miss.",
    capabilities: ["identity"],
    triggerThreshold: 2.5,
    scope:
      "Household clustering methodology, relationship attribution, gift buyer identification, lifecycle stage modeling, and household-level offer coordination.",
    methods: [
      "Household clustering and probabilistic matching via Merkury Identity",
      "Gift buyer and secondary purchaser identification",
      "Life-stage and relationship modeling",
      "Household-level offer coordination and suppression",
      "Relationship graph integration into CRM and loyalty platforms",
    ],
    valueNarrative:
      "Household-aware engagement reduces redundant outreach, improves offer relevance, and unlocks multi-buyer lifecycle strategies that single-profile approaches miss. Gift buyers identified through relationship intelligence drive incremental purchase behavior invisible to individual-level profiles — a significant and under-tapped source of CRM-driven revenue.",
    sfType: "Identity & Data Foundation",
    engagementSize: "Medium (10–14 weeks)",
    priority: "high",
  },

  // ── SIGNALS ─────────────────────────────────────────────────────────────────

  {
    id: "real_time_signals",
    title: "Real-Time Signal Capture & Activation",
    tagline: "Capture behavioral intent and activate it in the moment it matters",
    description:
      "Implement the data infrastructure and integration architecture to capture, unify, and activate behavioral signals in real or near-real time. Connect web, app, in-store, and service interactions to the customer profile — moving from batch-based campaign triggers to event-driven, intent-responsive engagement. Real-time signal capability is the engine behind Modern CRM's shift from campaigns to conversations.",
    capabilities: ["signals"],
    triggerThreshold: 3.0,
    scope:
      "CDP evaluation and implementation, event taxonomy and tagging strategy, real-time event streaming, signal-to-profile attribution, and near-real-time trigger framework design.",
    methods: [
      "CDP platform selection and implementation",
      "Event taxonomy and behavioral tagging strategy",
      "Real-time streaming pipeline and trigger framework",
      "Signal-to-profile attribution and enrichment",
      "Lifecycle milestone signal identification and mapping",
    ],
    valueNarrative:
      "Real-time signal capture enables triggered messaging at moments of intent — reducing time-to-engagement from days to minutes. 70% of consumers say brands don't understand them; real-time signals close the experience gap by making every interaction context-aware and relevant. Lifecycle-triggered programs consistently outperform batch campaigns by 3–5x on engagement and conversion metrics.",
    sfType: "Data & Technology",
    engagementSize: "Large (18–26 weeks)",
    priority: "critical",
  },

  {
    id: "lifecycle_triggers",
    title: "Lifecycle & Milestone Trigger Program",
    tagline: "Engage customers at the moments that matter most",
    description:
      "Design and activate a comprehensive lifecycle trigger program that responds to key customer milestones — onboarding, anniversary, lapse risk, reactivation, and upgrade signals. Move from calendar-based campaigns to event-driven engagement that meets customers at the right moment with the right message.",
    capabilities: ["signals", "engagement"],
    triggerThreshold: 2.75,
    scope:
      "Lifecycle stage modeling, milestone signal definition, trigger journey design, and multi-channel activation across email, mobile, app, in-store, and service.",
    methods: [
      "Customer lifecycle stage modeling and milestone signal mapping",
      "Trigger journey design and sequencing across owned channels",
      "Lapse prediction and re-engagement program design",
      "Win-back and upgrade trigger series",
      "Deliverability and frequency management across trigger programs",
    ],
    valueNarrative:
      "Lifecycle-triggered programs consistently outperform batch campaigns by 3–5x on engagement and conversion metrics, while reducing overall promotional spend. 'Messaging — through email, SMS, chat, and other touchpoints — is one of the most effective growth levers many brands operate.' Getting the right message in front of the right customer at the right moment is the difference between retained revenue and missed opportunity.",
    sfType: "CRM Strategy & Activation",
    engagementSize: "Medium (12–16 weeks)",
    priority: "high",
  },

  // ── DECISIONING ──────────────────────────────────────────────────────────────

  {
    id: "predictive_segmentation",
    title: "Predictive Segmentation & Audience Modeling",
    tagline: "Replace static segments with dynamic, predictive audience intelligence",
    description:
      "Build a suite of predictive models that power dynamic segmentation — including propensity to purchase, churn risk, CLV tiers, and product affinity. Deploy models into the engagement stack for always-on audience activation. Predictive AI is at the heart of Modern CRM's shift from product-driven planning to proactive, moment-driven decisions.",
    capabilities: ["decisioning"],
    triggerThreshold: 3.0,
    scope:
      "Propensity, CLV, and churn model development, model operationalization, segment taxonomy redesign, and integration with CRM and ESP platforms.",
    methods: [
      "Propensity and churn model development",
      "Customer Lifetime Value (CLV) segmentation",
      "Product affinity and next-category modeling",
      "Audience taxonomy simplification and dynamic segment refresh",
      "ML ops pipeline and model deployment cadence",
    ],
    valueNarrative:
      "Predictive segmentation improves targeting precision by 30–50%, enabling the right message to reach the right customer and reducing wasteful outreach to low-propensity audiences. NBX models enable brands to act on customer need before they ask — shifting from reactive, product-driven planning to proactive, moment-driven engagement. 72% of consumers expect personalized recognition; predictive models are what make that expectation achievable at scale.",
    sfType: "Analytics & Decisioning",
    engagementSize: "Large (16–20 weeks)",
    priority: "high",
  },

  {
    id: "nba_engine",
    title: "Next Best Action (NBA) Decisioning Engine",
    tagline: "Determine the most relevant action for every customer, every time",
    description:
      "Implement a centralized decisioning layer that dynamically determines the next best action for each customer based on real-time context, behavioral signals, and business rules. Enable coordinated offer, message, and experience prioritization across channels — replacing rule-based campaigns with intelligent, context-aware engagement.",
    capabilities: ["decisioning"],
    triggerThreshold: 2.5,
    scope:
      "Decisioning engine architecture, business rules design, offer catalog integration, priority logic framework, and channel arbitration.",
    methods: [
      "NBA decisioning platform selection and architecture design",
      "Business rules and offer priority framework",
      "Real-time context signal integration",
      "Channel arbitration and communication fatigue management",
      "A/B testing and champion/challenger decisioning framework",
    ],
    valueNarrative:
      "NBA decisioning moves organizations from rule-based campaigns to intelligent, context-aware engagement — increasing offer acceptance rates by 25–40% and reducing promotional dilution. The Modern CRM model is clear: start with behavioral insights about the audience, then determine the right product, guidance, or experience. NBA makes that operating model real, replacing the legacy approach of starting with the product and broadcasting to the largest likely set.",
    sfType: "Analytics & Decisioning",
    engagementSize: "Large (20–26 weeks)",
    priority: "critical",
  },

  // ── ENGAGEMENT ───────────────────────────────────────────────────────────────

  {
    id: "human_loyalty",
    title: "Human Loyalty® Program Design & Activation",
    tagline: "Build a loyalty program that earns emotional connection, not just transactions",
    description:
      "Design and activate a loyalty program that drives deep, personalized engagement and emotional connections between your brand and customers. Human Loyalty® is Merkle's full-service loyalty offering — from strategy and blueprint through platform implementation and ongoing optimization. Whether rebuilding a legacy program or launching net new, it delivers measurable increases in lifetime value, owned data growth, and program differentiation.",
    capabilities: ["engagement"],
    triggerThreshold: 3.0,
    scope:
      "Loyalty Program Assessment ($50K–$75K), Loyalty Blueprint ($350K–$500K), platform implementation on Salesforce Loyalty Management or LoyaltyPlus, partnership strategy, and ongoing managed services.",
    methods: [
      "Loyalty Program Assessment against proprietary benchmarks (wedge entry point)",
      "Loyalty Blueprint: strategy, vision, mechanics design, and business case",
      "Platform implementation on Salesforce Loyalty Management or LoyaltyPlus",
      "Loyalty partnership strategy: partner discovery, selection, and go-to-market",
      "Ongoing program management, analytics, and performance optimization",
    ],
    valueNarrative:
      "Loyalty programs built on emotional connection drive 2–4x increase in customer lifetime value and provide acquisition costs lower than paid media. Merkle's Human Loyalty® clients have achieved 2.5M loyalty enrollments in two months (3x projections), 148% higher visitation rates with loyalty lookalike audiences, and 41% increased media cost efficiency. With 880+ SMEs worldwide and 123M+ active members across client programs, Merkle brings unmatched loyalty depth — from strategy to execution to platform.",
    sfType: "Loyalty & Engagement",
    engagementSize: "Large (16–26 weeks)",
    priority: "critical",
  },

  {
    id: "crm_messaging",
    title: "CRM & Intelligent Messaging Strategy",
    tagline: "Turn messaging into your most effective and measurable growth lever",
    description:
      "Take a holistic look at CRM and messaging strategy, technology, and operations to ensure great customer experience and strong business outcomes across email, SMS, chat, and other owned touchpoints. Intelligent Messaging is one of the most effective growth levers brands operate — and consistently one of the most underoptimized. Merkle's offering puts CRM at the heart of commercial operations.",
    capabilities: ["engagement", "signals"],
    triggerThreshold: 3.0,
    scope:
      "Messaging Tech Assessment ($80K–$100K), CRM Strategy Blueprint ($100K–$350K), Intelligent Messaging program build, cross-channel orchestration, deliverability optimization, and CRM–media integration.",
    methods: [
      "Messaging Tech Assessment: current-state evaluation and industry benchmarking",
      "CRM Strategy Blueprint: data architecture, segmentation, and orchestration roadmap",
      "Intelligent Messaging: multi-channel trigger and lifecycle program build",
      "Cross-channel suppression, frequency management, and deliverability optimization",
      "Integration of CRM and paid media through connected, personalized experiences",
    ],
    valueNarrative:
      "Messaging — through email, SMS, chat, and other touchpoints — is one of the most effective growth levers many brands operate. Getting the right message in front of the right customer at the right time drives increased conversion, faster acquisition, and zero-party data collection. 'dentsu is uniquely positioned to harmonize paid media and CRM strategy' — Intelligent Messaging is how that integration becomes a commercial advantage.",
    sfType: "CRM Strategy & Activation",
    engagementSize: "Medium to Large (12–24 weeks)",
    priority: "critical",
  },

  {
    id: "journey_orchestration",
    title: "Cross-Channel Journey Orchestration",
    tagline: "Deliver coordinated, contextual experiences across every customer touchpoint",
    description:
      "Design and implement a journey orchestration layer that coordinates customer engagement across email, mobile, app, web, in-store, and service. Replace siloed channel execution with a unified journey strategy where every touchpoint builds on the last — creating the seamless, contextual experience that earns trust and drives lifetime value.",
    capabilities: ["engagement"],
    triggerThreshold: 2.75,
    scope:
      "Journey architecture design, channel integration mapping, orchestration platform implementation, cross-functional operating model alignment, and journey performance framework.",
    methods: [
      "Journey architecture and channel integration mapping",
      "Orchestration platform evaluation and configuration",
      "Cross-channel suppression and communication frequency management",
      "Service and in-store touchpoint integration",
      "Journey performance measurement framework and optimization cadence",
    ],
    valueNarrative:
      "Orchestrated journeys drive 2–4x higher engagement vs. isolated channel programs and create consistent customer experiences that strengthen brand perception and loyalty. 'Campaigns live in channels. Conversations live across them.' Journey orchestration is what makes the shift from campaign thinking to conversation thinking operational — and it's the architectural foundation that enables loyalty, promotions, and messaging to function as a unified growth engine.",
    sfType: "CRM Strategy & Activation",
    engagementSize: "Large (18–24 weeks)",
    priority: "high",
  },

  {
    id: "gamification",
    title: "Gamification & Branded Games",
    tagline: "Drive behavior change through emotional motivation, not just rewards",
    description:
      "Apply gamification and game mechanics to drive engagement and business results in the short and long term by tapping into emotional motivations. Merkle is the original player in gamification with 25 years of experience — combining motivational science, behavioral economics, and 50+ proven mechanics to design experiences that create habits and emotional connection that discounts alone cannot sustain.",
    capabilities: ["engagement"],
    triggerThreshold: 2.75,
    scope:
      "Gamification Assessment ($25K–$40K), Gamification Blueprint ($250K–$500K), full-service delivery including strategy, motivational science, UX, legal, development, analytics, and customer care.",
    methods: [
      "Gamification Assessment using proprietary Heuristics Scoring Model",
      "Behavior goal definition and motivational science analysis (dopamine, habit loops)",
      "Game mechanic design from 50+ proven mechanics (sweepstakes, instant win, badges, streaks, missions, leaderboards)",
      "Loyalty program overlay and engagement hub integration",
      "Analytics, performance benchmarking, and ongoing optimization",
    ],
    valueNarrative:
      "Gamification drives 500% database growth in under 8 months, 19.5% increases in purchase frequency in one month, and 3x incremental revenue for seasonal programs. Starbucks for Life — a decades-long Merkle partnership — generated billions of game plays. 'Gamification puts customers in the driver's seat by using emotional motivation to make them want to engage with your brand. It's the ultimate form of a customer-driven experience.' Merkle is the only provider offering gamification as a full-service specialty with in-house motivational science expertise.",
    sfType: "Loyalty & Engagement",
    engagementSize: "Medium (10–18 weeks)",
    priority: "high",
  },

  {
    id: "experiential_promotions",
    title: "Experiential Promotions & Data Capture",
    tagline: "Incentive-based experiences that acquire customers and enrich your data",
    description:
      "Design and activate experiential promotions — chance-to-win, instant win, contests, and gamified experiences — that engage customers, capture first and zero-party data, and drive incremental business results. Merkle is the only full-service promotion partner with 25 years of experience, in-house legal compliance, fraud prevention, prize procurement, and customer care across 44 countries.",
    capabilities: ["engagement", "identity"],
    triggerThreshold: 2.75,
    scope:
      "Promotions Blueprint, promotion administration, 50+ proven mechanics, full-service delivery (strategy, legal compliance, UX, creative, development, winner management, fraud prevention, analytics, customer care).",
    methods: [
      "Promotion strategy, audience insights, and mechanic selection (50+ proven types)",
      "Full legal compliance and winner management across 44 countries",
      "Fraud prevention via Akamai, IP checks, and PromoSAFE",
      "Zero-party and first-party data capture with CRM/loyalty integration",
      "Loyalty program overlay and ongoing engagement hub management",
    ],
    valueNarrative:
      "Experiential promotions capture 51–66% opt-ins for future communications, drive 4–7 logins per registrant, and have grown client databases by 500% in less than 8 months. Merkle has distributed $100M+ in prizes and awarded 50M prizes in 2023 alone. Promotions that 'get permission to have ongoing dialog' and 'give customers an extra reason to connect with a brand' are the most efficient first-party data acquisition vehicle when integrated with CRM and loyalty strategies.",
    sfType: "Loyalty & Engagement",
    engagementSize: "Medium (8–16 weeks)",
    priority: "high",
  },

  // ── MEDIA ACTIVATION ─────────────────────────────────────────────────────────

  {
    id: "first_party_media",
    title: "First-Party Data Media Activation",
    tagline: "Turn your customer relationships into a paid media performance advantage",
    description:
      "Build the infrastructure and strategy to activate first-party CRM, loyalty, and Merkury Identity data in paid media channels. Enable lookalike modeling, customer suppression, and high-value audience targeting using owned data assets — extending CRM beyond traditional owned channels into paid and earned media environments.",
    capabilities: ["media_activation"],
    triggerThreshold: 3.0,
    scope:
      "Clean room strategy, media audience architecture, first-party data onboarding via Merkury Identity or LiveRamp, loyalty lookalike and suppression programs, and CRM–media performance feedback loop.",
    methods: [
      "Data clean room implementation and media audience architecture design",
      "First-party audience taxonomy for paid media activation",
      "CRM-to-media onboarding via Merkury Identity, LiveRamp, or clean room",
      "Loyalty lookalike and high-value customer suppression programs",
      "CRM enrollment and owned channel growth campaigns in paid media",
    ],
    valueNarrative:
      "First-party data media activation improves ROAS by 25–50% on targeted campaigns while reducing wasted spend on existing customers. 'Identity extends CRM beyond traditional owned channels and into new addressable paid and earned environments.' Cracker Barrel achieved 41% increased display media cost efficiency and a 148% higher visitation rate with loyalty lookalike audiences. With 20–30% media efficiency improvement achievable, this is the bridge between CRM investment and measurable acquisition economics.",
    sfType: "Media & Acquisition",
    engagementSize: "Large (16–22 weeks)",
    priority: "critical",
  },

  {
    id: "owned_channel_growth",
    title: "Owned Channel & Loyalty Growth Program",
    tagline: "Use media to build the first-party data asset that compounds over time",
    description:
      "Design paid media campaigns specifically engineered to grow owned relationship assets — app downloads, loyalty enrollment, email opt-ins, and profile completion. Every owned relationship acquired through media lowers future CPM costs and builds the first-party data foundation for long-term CRM capability and media efficiency.",
    capabilities: ["media_activation"],
    triggerThreshold: 2.75,
    scope:
      "Owned channel growth strategy, media-to-CRM conversion measurement, loyalty and app acquisition campaign design, post-acquisition onboarding journeys, and profile completion incentive programs.",
    methods: [
      "Owned channel growth strategy and KPI framework",
      "Loyalty enrollment and app acquisition campaigns in paid media",
      "Post-acquisition onboarding journey design and trigger activation",
      "Profile completion and zero-party data collection incentive programs",
      "Media-to-CRM attribution measurement and feedback loop",
    ],
    valueNarrative:
      "Acquiring new customers costs 3–5x more than growing existing ones. Owned channel growth programs reduce long-term acquisition costs by building the first-party data foundation that enables CRM and media efficiency to compound over time. Merkle's Cracker Barrel work drove 2.5M loyalty enrollments in two months — 3x projections — through integrated media and loyalty strategy.",
    sfType: "Media & Acquisition",
    engagementSize: "Medium (10–14 weeks)",
    priority: "medium",
  },

  // ── LEARNING & OPTIMIZATION ───────────────────────────────────────────────────

  {
    id: "test_learn_framework",
    title: "Test & Learn Framework",
    tagline: "Build an always-on experimentation engine for compounding CRM improvement",
    description:
      "Design and implement a structured test-and-learn program for CRM, loyalty, messaging, and promotions. Establish a testing roadmap, statistical rigor standards, and a mechanism to scale winning strategies across the engagement portfolio. Modern CRM's 'Adaptive Intelligence' stage is built on continuous experimentation — where every interaction builds on the last.",
    capabilities: ["learning_optimization"],
    triggerThreshold: 3.0,
    scope:
      "Experimentation framework design, test prioritization methodology, statistical standards, holdout group strategy, and insight-to-action process.",
    methods: [
      "Experimentation framework and governance model design",
      "Test prioritization and hypothesis backlog management",
      "Holdout and control group strategy",
      "Statistical significance standards and tooling",
      "Insight socialization and action process across CRM, loyalty, and media",
    ],
    valueNarrative:
      "Organizations with structured test-and-learn programs generate 10–20% annual improvement in CRM KPIs through compounding incremental gains. The Modern CRM transformation model requires Adaptive Intelligence — where insights continuously refine engagement strategy. A rigorous test-and-learn framework is the operating mechanism that makes intelligence adaptive rather than episodic, and that turns Merkle's measurement heritage into ongoing competitive advantage.",
    sfType: "Analytics & Decisioning",
    engagementSize: "Medium (10–14 weeks)",
    priority: "high",
  },

  {
    id: "incrementality_measurement",
    title: "Incrementality & Lift Measurement",
    tagline: "Prove the true revenue value of loyalty, promotions, and CRM",
    description:
      "Implement an incrementality measurement framework to determine the true causal impact of CRM, loyalty, messaging, and promotions programs. Move from correlation-based reporting to causal lift measurement that validates investment and identifies which programs drive real growth vs. simply rewarding customers who would have purchased anyway.",
    capabilities: ["learning_optimization"],
    triggerThreshold: 2.75,
    scope:
      "Incrementality framework design, holdout group architecture, geo-testing approach, program ROI measurement methodology, and executive reporting and investment case.",
    methods: [
      "Incrementality framework and causal measurement methodology design",
      "Holdout group and geo-test architecture",
      "Program-level lift measurement across loyalty, promotions, and messaging",
      "Discount elasticity and offer optimization modeling",
      "Executive reporting and CRM investment case development",
    ],
    valueNarrative:
      "Incrementality measurement enables confident investment decisions and identifies programs that drive real growth vs. those that simply reward customers who would have purchased anyway. 5–15% lift in key customer journeys is achievable when programs are designed with measurement built in from the start. Merkle's performance heritage and analytic depth — 10K+ analytic models built annually — provide the rigor to turn measurement from a reporting exercise into a strategic growth lever.",
    sfType: "Analytics & Decisioning",
    engagementSize: "Medium (10–16 weeks)",
    priority: "high",
  },

  // ── ADVANCED / INNOVATION (fire for high-scoring mature orgs) ─────────────────

  {
    id: "modern_crm_innovation_sprint",
    title: "Modern CRM Innovation Sprint",
    tagline: "Chart the frontier of what your CRM engine can become",
    description:
      "A structured bluesky workshop series for mature CRM organizations ready to explore the next horizon. Examine emerging use cases in generative AI personalization, agentic engagement, real-time identity, and autonomous decisioning — and build a prioritized innovation roadmap grounded in your existing capability strengths. This is for organizations that have crossed the operational threshold and are asking 'what's next?'",
    capabilities: ["decisioning", "learning_optimization", "engagement"],
    triggerThreshold: 5,
    minTriggerScore: 3.5,
    scope:
      "Two-day facilitated innovation workshop, GenAI and agentic CRM use case mapping, innovation backlog development, POC scoping for two to three priority opportunities, and executive alignment session.",
    methods: [
      "Current-state capability assessment and frontier benchmarking",
      "GenAI and agentic CRM use case ideation and prioritization",
      "POC or pilot scoping for two to three high-value innovation areas",
      "Innovation roadmap development with phased investment framework",
      "Executive alignment and internal stakeholder activation session",
    ],
    valueNarrative:
      "Mature CRM organizations that fail to invest in innovation risk capability plateau as competitors accelerate. Organizations at Stage 3–4 are uniquely positioned to pilot frontier use cases — generative personalization, AI-driven decisioning, autonomous engagement — because they have the data, identity, and orchestration foundations required. This sprint converts existing strengths into a defined innovation agenda with clear next steps and executive sponsorship.",
    sfType: "CRM Strategy & Activation",
    engagementSize: "Small (4–6 weeks)",
    priority: "high",
  },

  {
    id: "genai_personalization",
    title: "Generative AI Personalization at Scale",
    tagline: "Produce 1:1 content and experiences at a scale humans cannot",
    description:
      "Deploy generative AI to produce dynamic, personalized content across email, SMS, push, and web — moving beyond segment-level messaging to true 1:1 communication at scale. Combine LLMs with your first-party data, behavioral signals, and decisioning layer to generate contextually relevant subject lines, body copy, product narratives, and offers for each individual. The next frontier of CRM is content that writes itself based on who the customer is and what they're doing right now.",
    capabilities: ["engagement", "decisioning", "signals"],
    triggerThreshold: 5,
    minTriggerScore: 3.5,
    scope:
      "GenAI content strategy and guardrail framework, LLM integration with CRM and ESP platforms, dynamic content template architecture, brand voice governance model, and measurement framework for personalization lift.",
    methods: [
      "GenAI content strategy and brand voice governance framework",
      "LLM integration with existing CRM, CDP, and ESP stack",
      "Dynamic template architecture for email, SMS, push, and web",
      "Prompt engineering and content generation workflow design",
      "A/B testing framework for GenAI versus human-authored content",
    ],
    valueNarrative:
      "Generative AI personalization enables brands to produce hundreds of content variations per send — matching each customer's context, preference, and lifecycle stage with messaging that no human content team could produce at scale. Early adopters are seeing 15–25% improvement in engagement metrics from AI-generated subject lines and body copy alone. The organizations that build GenAI personalization now will establish a compounding advantage as their models learn from millions of interactions.",
    sfType: "CRM Strategy & Activation",
    engagementSize: "Medium (12–16 weeks)",
    priority: "high",
  },

  {
    id: "crm_center_of_excellence",
    title: "CRM Center of Excellence",
    tagline: "Institutionalize Modern CRM as a core organizational capability",
    description:
      "Build the operating model, governance structures, talent frameworks, and technology standards that make Modern CRM a permanent, self-reinforcing organizational capability — not a project. A CRM Center of Excellence (CoE) codifies best practices, accelerates cross-functional alignment, governs data and decisioning standards, and ensures that capability gains compound rather than decay. For organizations at Stage 4, this is the structural investment that protects and extends the competitive advantage already earned.",
    capabilities: ["learning_optimization", "decisioning", "identity"],
    triggerThreshold: 5,
    minTriggerScore: 4.0,
    scope:
      "CoE charter and operating model design, capability maturity roadmap, cross-functional governance framework, talent and skills assessment, technology and vendor standards documentation, and executive sponsorship activation.",
    methods: [
      "CRM CoE charter, scope, and operating model design",
      "Cross-functional governance framework and decision rights mapping",
      "Capability maturity roadmap and investment prioritization model",
      "Talent and skills gap assessment with hiring and upskilling recommendations",
      "Technology standards and vendor evaluation framework",
    ],
    valueNarrative:
      "Organizations with a dedicated CRM CoE sustain 20–40% higher capability maturity scores over three years compared to those without formal governance — because CoEs prevent regression, accelerate adoption of new capabilities, and create the internal expertise to reduce dependency on external partners over time. Building a CoE is the difference between CRM as a one-time transformation and CRM as a permanent competitive advantage.",
    sfType: "CRM Strategy & Activation",
    engagementSize: "Medium (10–16 weeks)",
    priority: "medium",
  },

  {
    id: "agentic_crm_pilot",
    title: "Agentic CRM & Autonomous Engagement Pilot",
    tagline: "Put AI agents to work in your CRM stack",
    description:
      "Design and pilot the use of AI agents — autonomous, goal-directed systems capable of taking action across CRM workflows without constant human instruction. Explore use cases in autonomous lifecycle management, AI-driven offer negotiation, predictive service intervention, and real-time journey adaptation. Agentic CRM represents the leading edge of the Adaptive Intelligence stage — where the engagement engine doesn't just respond to signals, it acts on them proactively.",
    capabilities: ["decisioning", "learning_optimization"],
    triggerThreshold: 5,
    minTriggerScore: 4.0,
    scope:
      "Agentic use case discovery workshop, pilot scope definition for one to two autonomous workflows, agent architecture design, integration and guardrail framework, and POC delivery with measurement plan.",
    methods: [
      "Agentic CRM use case discovery and prioritization workshop",
      "Pilot workflow design for one to two autonomous CRM use cases",
      "Agent architecture: tools, memory, context, and action frameworks",
      "Guardrail and escalation framework for autonomous action governance",
      "POC delivery with performance measurement and scale-readiness assessment",
    ],
    valueNarrative:
      "Agentic AI represents the next paradigm shift in CRM — moving from AI-assisted decisions to AI-driven action. Organizations piloting agentic workflows today are building the operational experience and institutional knowledge to scale autonomous engagement before it becomes a market standard. For mature CRM organizations with strong data, identity, and decisioning foundations, an agentic pilot is the highest-leverage next investment on the innovation frontier.",
    sfType: "Analytics & Decisioning",
    engagementSize: "Small to Medium (6–12 weeks)",
    priority: "medium",
  },

  {
    id: "crm_intelligence_loop",
    title: "CRM Intelligence Loop",
    tagline: "Close the loop between insights, strategy, and activation",
    description:
      "Build a systematic process for feeding media performance data, engagement analytics, and customer insights back into CRM strategy refinement. Create a closed-loop system where every campaign improves the next — operationalizing the 'Adaptive Intelligence' stage of Modern CRM transformation.",
    capabilities: ["learning_optimization", "media_activation"],
    triggerThreshold: 2.75,
    scope:
      "Analytics infrastructure, insight-to-strategy process design, segment refresh cadence, and cross-functional insight sharing model.",
    methods: [
      "Media-to-CRM performance feedback pipeline design",
      "Segment and audience refresh process and governance",
      "Customer insight repository and cross-functional sharing cadence",
      "CRM strategy review and optimization cycle",
      "Real-time signal integration into ongoing strategy refinement",
    ],
    valueNarrative:
      "Organizations with closed-loop CRM intelligence reduce time from insight to activation from weeks to days, enabling continuous strategy improvement at scale. 'Generative AI: every interaction builds on the last, creating seamless journeys across touchpoints.' The Intelligence Loop is the process architecture that makes this possible — connecting media signals, engagement analytics, and customer data into a continuously improving CRM operating model.",
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
    return opp.capabilities.some((cap) => {
      const score = capabilityScores[cap];
      if (score === undefined) return false;
      if (opp.minTriggerScore !== undefined) {
        // Advanced opportunity: fires when capability is already strong
        return score >= opp.minTriggerScore;
      }
      // Standard gap opportunity: fires when capability is below threshold
      return score < opp.triggerThreshold;
    });
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

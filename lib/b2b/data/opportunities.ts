import type { B2bOpportunity } from "@/lib/b2b/types";

/**
 * Merkle B2B Transformation offerings.
 *
 * Sourced from the 2025 B2B Transformation GTM narrative, the
 * Account-Based Marketing / Selling / Service & Advocacy offering
 * toolkits (v1.0, November 2025), and the AMER Summit working session
 * (March 2026).
 *
 * Organized in two layers:
 *   1. Five named "wedge" engagements — North Star Visioning, Agile Op
 *      Model Assessment, B2B Customer Experience Assessment, Tech &
 *      Data Modernization, Value Realization & Growth Optimization.
 *      These set up the bigger transformation programs.
 *   2. Eleven capability- or platform-level engagements — ABM, ABS,
 *      Service & Advocacy, Operations & Commerce, plus the Salesforce
 *      Revenue platform, Data Cloud + Identity, Agentforce/agentic
 *      operations, marketplace strategy, and the operating-model
 *      enablement layer.
 */
export const B2B_OPPORTUNITIES: B2bOpportunity[] = [
  // ══════════════════════════════════════════════════════════════════
  // WEDGE ENGAGEMENTS — set up the bigger transformation
  // ══════════════════════════════════════════════════════════════════
  {
    id: "north_star_digital_visioning",
    title: "North Star Digital Visioning",
    tagline:
      "Reimagine the business in a digital-first, account-based world before any platform decision",
    description:
      "Leadership visioning engagement that defines a future-state vision for the customer experience, the strategic focus areas needed to get there, and the investment themes that will fund it. The deliverable is a shared, compelling North Star aligned to business ambition — the foundation every downstream B2B transformation engagement is anchored against.",
    capabilities: ["vision_strategy"],
    triggerThreshold: 3.0,
    scope:
      "Leadership visioning workshops, market trend and competitor analysis, ideation and value-proposition design, definition of digital North Star and investment themes, high-level roadmap.",
    methods: [
      "Leadership visioning workshops",
      "Market trend and competitor analysis",
      "Ideation and value proposition design",
      "Definition of a digital North Star and investment themes",
      "High-level roadmap with sequenced investment themes",
    ],
    valueNarrative:
      "The digital landscape is changing rapidly, with companies struggling to meet customers' increasing expectations. Without a North Star, platform decisions default to vendor preferences rather than business architecture. Every B2B Transformation engagement Merkle anchors begins here — a shared vision is the prerequisite for $250K+ wedges and $1M+ transformation programs that follow.",
    sfType: "Strategy & Vision",
    engagementSize: "8–12 weeks · $250K–$500K",
    priority: "critical",
  },

  {
    id: "agile_op_model_assessment",
    title: "Agile Operating Model Assessment",
    tagline:
      "Shift from siloed, IT-led initiatives to a modern, value-stream-funded operating model",
    description:
      "Becoming a digital-first, account-based organization requires a fundamental shift in how teams are organized, funded, and held to outcomes. This assessment maps current value streams, identifies where value is created (and lost), redesigns governance, funding, and team structures, and pilots the new operating model on a high-impact value stream.",
    capabilities: ["vision_strategy"],
    triggerThreshold: 3.0,
    scope:
      "Current state assessment of operating model, value stream mapping and prioritisation, redesign of governance, funding, and team structures, pilot implementation and change enablement.",
    methods: [
      "Current state assessment of operating model",
      "Value stream mapping and prioritisation",
      "Redesign of governance, funding, and team structures",
      "Pilot implementation and change enablement",
    ],
    valueNarrative:
      "Many companies are stuck in outdated project delivery models that can't keep up with business needs. This isn't process change — it's a new way of working that aligns strategy, funding, and execution. Cross-functional, persistent product teams aligned to value streams routinely deliver 25%+ faster time-to-value than project-funded initiatives.",
    sfType: "Operating Model",
    engagementSize: "8–14 weeks · $150K–$300K",
    priority: "critical",
  },

  {
    id: "b2b_cx_assessment",
    title: "B2B Customer Experience Assessment",
    tagline:
      "Benchmark the full account experience from first touch through fulfillment to find growth levers",
    description:
      "Companies have invested in ABM, but few deliver a true end-to-end account experience. This assessment maps the experience for key accounts across research, sales, fulfillment, and service; benchmarks against best-in-class and competitors; identifies experience gaps and value leakage; and produces a prioritised roadmap of improvements.",
    capabilities: ["vision_strategy", "abm", "abs", "service_advocacy"],
    triggerThreshold: 3.5,
    scope:
      "Experience mapping for tier-1 accounts across research, sales, fulfillment, and service, maturity assessment and benchmarking against best-in-class and competitors, identification of experience gaps and value leakage, prioritised roadmap of improvements.",
    methods: [
      "Experience mapping for key accounts across the full lifecycle",
      "Maturity assessment and benchmarking vs. best-in-class and competitors",
      "Identification of experience gaps and value-leakage points",
      "Prioritised roadmap of improvements",
    ],
    valueNarrative:
      "B2B has never been more competitive — the average B2B purchase now considers 62% more brands and runs 4.5 weeks longer than in 2022. 71% of B2B buyers want suppliers to spend more time understanding their problems. The gap between marketing investment and account experience is where value leaks. A clear view of the full account journey — across functions and touchpoints — is the data set every B2B leadership team is missing.",
    sfType: "CX Strategy",
    engagementSize: "10–16 weeks · $250K–$750K",
    priority: "critical",
  },

  {
    id: "tech_data_modernization",
    title: "Tech & Data Modernization",
    tagline:
      "Identify where modernization can unlock real business value across CRM, CPQ, billing, and data",
    description:
      "The B2B technology landscape is in a state of constant flux — outdated tech stacks limit scalability, redundant systems create inefficiency, and many investments lack clear ROI. This engagement audits the current technology landscape, aligns it to business capabilities, and produces a modernization roadmap with a clear consolidation, automation, or innovation case for every system in scope.",
    capabilities: ["tech_data_intelligence", "operations_commerce"],
    triggerThreshold: 3.0,
    scope:
      "Technology audit and assessment, alignment mapping between tech and business capabilities, opportunity identification for consolidation, automation, or innovation, modernization roadmap with investment plan.",
    methods: [
      "Technology audit and assessment",
      "Alignment mapping between tech and business capabilities",
      "Opportunity identification for consolidation, automation, or innovation",
      "Modernization roadmap with investment plan",
    ],
    valueNarrative:
      "The market signal is unambiguous: 4,100 legacy CPQ installs are up for renewal in 2026, and Merkle built ~50 of them. Customers paying for 2010-era CPQ alongside 2025-era Data Cloud, AI, and self-service ambitions need a modernization roadmap that doesn't ignore what's already in place. Average enterprise tech-stack consolidation programs pay back inside 24 months.",
    sfType: "Tech & Data",
    engagementSize: "10–14 weeks · $250K–$500K",
    priority: "critical",
  },

  {
    id: "value_realization_growth_optimization",
    title: "Value Realization & Growth Optimization",
    tagline:
      "Reduce complexity, improve operational efficiency, and reinvest in growth",
    description:
      "Transformation isn't just about change — it's about results. This engagement is for clients who need to justify further investment or who are struggling to turn past change into measurable performance. It identifies where value is leaking, models reinvestment scenarios, and produces a clear plan to unlock profitable growth from what's already been bought.",
    capabilities: [
      "vision_strategy",
      "operations_commerce",
      "tech_data_intelligence",
    ],
    triggerThreshold: 3.5,
    scope:
      "Current cost and investment mapping, identification of under-leveraged or duplicative capabilities, reinvestment modelling and scenario planning, value-realization scorecard and quarterly governance.",
    methods: [
      "Current cost and investment mapping",
      "Identification of under-leveraged or duplicative capabilities",
      "Reinvestment modelling and scenario planning",
      "Value-realization scorecard with quarterly governance",
    ],
    valueNarrative:
      "55% of B2B leaders report a gap between expected and realized transformation value, with only 49% of purchased capabilities actually in production use. The upside is already paid for; it's waiting for the organization to capture it. Clients see 20%+ ROI improvement on existing investments inside the first 90 days of structured value realization work.",
    sfType: "Value Realization",
    engagementSize: "8–14 weeks · $150K–$500K",
    priority: "high",
  },

  // ══════════════════════════════════════════════════════════════════
  // ACCOUNT-BASED MARKETING (ABM) ENGAGEMENTS
  // ══════════════════════════════════════════════════════════════════
  {
    id: "abm_audit_visioning",
    title: "ABM Audit & Strategic Visioning",
    tagline:
      "Audit the current state of ABM and produce the GTM-aligned strategy for what comes next",
    description:
      "Wedge engagement that audits current account-based execution — list strategy, content, orchestration, measurement — against best practice, and produces a strategic blueprint for an ABM motion that earns alignment from sales and leadership. The deliverable is a GTM-aligned ABM strategy with sequenced priorities and a measurable case for investment.",
    capabilities: ["abm", "vision_strategy"],
    triggerThreshold: 3.0,
    scope:
      "ABM maturity audit (strategy / data / orchestration / measurement), GTM alignment workshop, target account list and ICP refinement, ABM strategy and roadmap.",
    methods: [
      "ABM maturity audit against the Merkle ABM framework",
      "GTM alignment workshop with sales and marketing leadership",
      "ICP refinement and target account list (TAL) sizing",
      "ABM strategy with measurable outcome targets",
      "Sequenced quick wins, build-up, and scale phases",
    ],
    valueNarrative:
      "ABM is no longer optional — but most programs stall at audience targeting and never reach orchestration or measurement maturity. Brands expecting significantly higher profits in 5 years are 2.5× more likely to pursue ABM than those expecting decline. An audit and strategic visioning engagement is how the conversation moves from 'we have a target list' to 'we have a measurable revenue motion.'",
    sfType: "ABM Strategy",
    engagementSize: "6–10 weeks · $100K–$300K",
    priority: "high",
  },

  {
    id: "abm_pilot_program",
    title: "ABM Pilot Program",
    tagline:
      "Prove the ABM model on a tightly scoped account set with measurable pipeline outcomes",
    description:
      "A focused pilot that operationalises the ABM motion on a tier-1 account set — buying-group identification, role-based content, paid + owned + sales orchestration, account-level reporting. Designed to land measurable pipeline outcomes inside two quarters and create a repeatable template for scale.",
    capabilities: ["abm", "tech_data_intelligence"],
    triggerThreshold: 3.0,
    scope:
      "Pilot account selection (typically 25–50 accounts), buying-group mapping, role-based content development, paid/owned/sales orchestration, ABM measurement framework, scale playbook.",
    methods: [
      "Pilot account selection and buying-group mapping",
      "Role-based content and messaging development",
      "Multi-channel orchestration (paid + owned + sales)",
      "ABM measurement framework (engagement, pipeline, velocity)",
      "Scale playbook and team enablement",
    ],
    valueNarrative:
      "A 25% increase in MQL→SQL conversion and 27% shorter sales cycles are typical outcomes once an ABM pilot moves from theory to executed plays. The pilot is also where the operating model gets tested — it surfaces the ownership, KPI, and tooling questions a Blueprint can later answer.",
    sfType: "ABM Activation",
    engagementSize: "12–16 weeks · $200K–$425K",
    priority: "high",
  },

  {
    id: "abm_blueprint",
    title: "ABM Blueprint",
    tagline:
      "Design the enterprise ABM operating model — strategy, data, orchestration, measurement, talent",
    description:
      "Following pilot or audit, the Blueprint codifies the enterprise ABM operating model. Defines the segmentation strategy, data architecture, orchestration platform stack, measurement framework, governance, and the team and skill model that will run the program at scale. The deliverable is a 12–24 month ABM transformation roadmap with sequenced investment.",
    capabilities: ["abm", "vision_strategy", "tech_data_intelligence"],
    triggerThreshold: 3.5,
    scope:
      "Account segmentation strategy, data and tech architecture, orchestration playbook design, measurement framework, governance and operating model, team and skill design, transformation roadmap.",
    methods: [
      "Account segmentation and tiering model",
      "Data and tech architecture design",
      "Orchestration playbook and channel mix",
      "Measurement framework and reporting model",
      "Governance, team structure, and skill plan",
      "12–24 month transformation roadmap",
    ],
    valueNarrative:
      "The Blueprint is what turns a successful pilot into an enterprise revenue engine. Without it, ABM stays trapped in one team, one region, or one product line. Forrester notes 20%+ higher ROI for 'account-based' investments — but only when the operating model and measurement framework are formal.",
    sfType: "ABM Strategy",
    engagementSize: "12–18 weeks · $300K–$600K",
    priority: "high",
  },

  {
    id: "abm_activation_program_management",
    title: "ABM Activation & Program Management",
    tagline:
      "Run the ABM program at scale — orchestration, content velocity, measurement, optimization",
    description:
      "Ongoing managed program that operationalises the Blueprint. Merkle teams own (or co-own) ABM strategy, account-level orchestration, content production, sales-marketing alignment, and quarterly optimization. Designed for clients who want a partner running the engine, not just delivering a strategy deck.",
    capabilities: ["abm", "service_advocacy", "tech_data_intelligence"],
    triggerThreshold: 4.0,
    scope:
      "Account-tier orchestration, content production at velocity, sales enablement and joint plays, measurement and optimization cadence, quarterly business reviews.",
    methods: [
      "Account-tier orchestration across paid, owned, and sales motions",
      "Modular, role-aware content production at velocity",
      "Sales enablement, joint plays, and weekly account reviews",
      "Account-level engagement and pipeline measurement",
      "Quarterly business reviews and continuous optimization",
    ],
    valueNarrative:
      "Brands that move from 'we run ABM' to 'ABM runs us' see 2× higher rates of expansion and 28% faster revenue growth. The Activation program turns ABM from a marketing initiative into a revenue operating system.",
    sfType: "ABM Managed Service",
    engagementSize: "12-month commitment · $500K–$1M",
    priority: "medium",
  },

  // ══════════════════════════════════════════════════════════════════
  // ACCOUNT-BASED SELLING & REVENUE PLATFORM
  // ══════════════════════════════════════════════════════════════════
  {
    id: "account_based_selling_implementation",
    title: "Account-Based Selling Implementation",
    tagline:
      "Modernize the seller workflow — AI lead scoring, account intelligence, AI-assisted CPQ and outreach",
    description:
      "End-to-end implementation of an AI-augmented sales motion. Combines Sales Cloud / Revenue Cloud configuration with AI lead scoring, account intelligence dashboards, AI-assisted outreach and proposal generation, and modern CPQ. Designed to compress sales cycle time, lift win rates, and free sellers to focus on relationship and complexity.",
    capabilities: ["abs", "tech_data_intelligence"],
    triggerThreshold: 3.0,
    scope:
      "Sales Cloud / Revenue Cloud platform configuration, AI lead scoring, account intelligence layer, AI-assisted outreach and proposal generation, CPQ modernization, sales enablement and adoption.",
    methods: [
      "Sales Cloud / Revenue Cloud platform configuration",
      "AI lead scoring and routing tied to account fit + intent",
      "Account intelligence dashboards (buying group, history, signals)",
      "AI-assisted outreach, summarization, and proposal generation",
      "Modern CPQ (Revenue Cloud) replacing legacy CPQ",
      "Sales enablement, adoption, and quarterly value reviews",
    ],
    valueNarrative:
      "Salesforce reports a 38% higher sales win rate and 28% faster revenue growth for organizations operating an account-based selling motion. With Agentforce and Revenue Cloud, the cycle compression that used to require headcount now requires configuration.",
    sfType: "Sales Modernization",
    engagementSize: "16–24 weeks · $400K–$1.2M",
    priority: "critical",
  },

  {
    id: "salesforce_revenue_cloud_modernization",
    title: "Salesforce Revenue Cloud Modernization",
    tagline:
      "Replace legacy CPQ + billing with a unified, AI-ready revenue platform",
    description:
      "Wedge engagement targeted at the 4,100 legacy CPQ installs reaching renewal in 2026. Migrates clients from legacy CPQ + bolted-on billing to a unified Revenue Cloud deployment — with AI-assisted configuration, native subscription/usage pricing, and connected billing and revenue recognition. Anchored on Merkle's 50+ legacy CPQ deployments and Rocket 2.0 / AI Order Orchestration accelerators.",
    capabilities: ["abs", "operations_commerce", "tech_data_intelligence"],
    triggerThreshold: 3.0,
    scope:
      "Revenue Cloud platform deployment, legacy CPQ migration, AI-assisted configuration, subscription / usage / consumption pricing, integrated billing and rev-rec, Agentforce-native logic.",
    methods: [
      "Revenue Cloud platform deployment",
      "Legacy CPQ migration with Rocket 2.0 accelerators",
      "AI-assisted configuration and self-service quoting",
      "Subscription, usage, and consumption pricing models",
      "Integrated billing and revenue recognition",
      "Agentforce-native logic for deal review, quoting, and approvals",
    ],
    valueNarrative:
      "Salesforce attaches 5× ACV when Revenue Cloud lands with 4 clouds — and Merkle built the legacy CPQ environments now up for renewal. This is the single highest-leverage wedge in the 2026 B2B Transformation pipeline.",
    sfType: "Revenue Platform",
    engagementSize: "20–32 weeks · $500K–$1.5M",
    priority: "critical",
  },

  // ══════════════════════════════════════════════════════════════════
  // ACCOUNT-BASED SERVICE & ADVOCACY
  // ══════════════════════════════════════════════════════════════════
  {
    id: "account_based_service_advocacy",
    title: "Account-Based Service & Advocacy",
    tagline:
      "Turn the post-sale motion into a revenue and advocacy engine through AI service and proactive expansion",
    description:
      "Implementation of an AI-powered service operations program — combining Service Cloud / Agentforce service agents, customer health scoring, structured renewal plays, and a service-to-revenue motion. Designed to lift NRR by 5–10 points, deflect 30%+ of routine cases, and convert service interactions into expansion opportunities.",
    capabilities: ["service_advocacy", "tech_data_intelligence"],
    triggerThreshold: 3.0,
    scope:
      "Service Cloud / Agentforce deployment, customer health scoring model, renewal and expansion plays, AI service agents, advocacy program, KPI scorecard and quarterly cadence.",
    methods: [
      "Service Cloud / Agentforce service agent deployment",
      "Customer health scoring (churn risk + expansion fit)",
      "Renewal play design with multi-quarter coverage",
      "Service-to-revenue motion (in-flow upsell / cross-sell)",
      "Advocacy program (references, NPS-driven outreach)",
      "Service KPI scorecard tied to NRR / GRR / expansion",
    ],
    valueNarrative:
      "Account-based service organizations are nearly 3× as likely to see increased customer spend in the future and receive much higher NPS (+83 vs +23 for non-ABM peers). AI service agents deflect 30%+ of routine cases — letting human agents become a relationship and revenue motion.",
    sfType: "Service Modernization",
    engagementSize: "16–24 weeks · $400K–$900K",
    priority: "critical",
  },

  // ══════════════════════════════════════════════════════════════════
  // OPERATIONS, COMMERCE & ORCHESTRATION
  // ══════════════════════════════════════════════════════════════════
  {
    id: "ai_order_orchestration",
    title: "AI Order Orchestration & Process Automation",
    tagline:
      "Replace email, tickets, and tribal knowledge with a process-orchestration platform powered by AI agents",
    description:
      "Implementation of a process-orchestration layer (Regrello + Agentforce or equivalent) across the order-to-cash, fulfillment, and exception-handling flows. Routes orders, surfaces exceptions, automates approvals, and lets AI agents handle high-volume tasks with full auditability. Reduces cost-to-serve while improving customer-visible delivery performance.",
    capabilities: ["operations_commerce", "tech_data_intelligence"],
    triggerThreshold: 3.0,
    scope:
      "Process orchestration platform deployment, order-to-cash workflow design, AI agent role definition (within governance), exception handling, integration with OMS / ERP / billing, KPI tracking.",
    methods: [
      "Process orchestration platform deployment",
      "Order-to-cash workflow design and AI agent roles",
      "Exception handling and approval automation",
      "Integration with OMS, ERP, and billing systems",
      "Cost-to-serve and cycle-time KPI tracking",
    ],
    valueNarrative:
      "Brands deploying AI order orchestration see 20%+ ROI improvement, 28% faster task completion, and meaningful reductions in customer-visible delivery exceptions. The orchestration layer is also where AI agents earn organizational trust before being deployed in customer-facing roles.",
    sfType: "Operations Platform",
    engagementSize: "12–20 weeks · $300K–$700K",
    priority: "high",
  },

  {
    id: "b2b_self_service_commerce",
    title: "B2B Self-Service Commerce & Marketplace",
    tagline:
      "Move 50%+ of B2B revenue to self-service, marketplace, and API channels",
    description:
      "Implementation of a B2B self-service commerce experience (Commerce Cloud + Rocket 2.0 / Mirakl marketplace) for repeat orders, account pricing, configurations, subscriptions, and channel partner enablement. Designed to lift digital revenue share, reduce cost-to-serve, and free seller capacity for strategic deals.",
    capabilities: ["operations_commerce", "abs"],
    triggerThreshold: 3.0,
    scope:
      "B2B Commerce Cloud deployment, Rocket 2.0 accelerators, marketplace strategy (Mirakl), account-pricing and configurations, channel partner enablement, KPI and incentive alignment.",
    methods: [
      "B2B Commerce Cloud deployment with Rocket 2.0",
      "Marketplace strategy (Mirakl) for adjacencies and channel",
      "Account-pricing, configurations, and repeat-order flows",
      "Channel partner enablement and dealer portals",
      "Seller KPI and incentive alignment with self-service",
    ],
    valueNarrative:
      "73% of B2B buyers now prefer self-service — and the seller economics flip when 50%+ of revenue moves digital. Cost-to-sell drops 20%+, and reps redirect their time to consultative and strategic deals.",
    sfType: "Commerce",
    engagementSize: "20–28 weeks · $500K–$1.5M",
    priority: "high",
  },

  // ══════════════════════════════════════════════════════════════════
  // FOUNDATION — DATA, IDENTITY, AGENTIC
  // ══════════════════════════════════════════════════════════════════
  {
    id: "customer_data_foundation",
    title: "Customer Data Foundation (Data Cloud + Identity)",
    tagline:
      "Unify account, buying-group, and contact data across the revenue stack — the prerequisite for AI",
    description:
      "Implementation of a unified customer data foundation — Data Cloud (or equivalent) plus an identity graph (Merkury / equivalent) — as the system of record across marketing, sales, service, and commerce. Cleans, consolidates, and resolves account and buying-group identity; enables every downstream AI use case.",
    capabilities: ["tech_data_intelligence", "abm", "abs"],
    triggerThreshold: 3.0,
    scope:
      "Data Cloud deployment, Merkury identity graph integration, account / buying-group / contact resolution, data quality and governance, downstream activation feeds.",
    methods: [
      "Data Cloud platform deployment",
      "Merkury identity graph integration",
      "Account, buying-group, and contact resolution",
      "Data quality, lineage, and governance",
      "Activation feeds to marketing, sales, service, commerce",
    ],
    valueNarrative:
      "1 in 3 marketing dollars is wasted due to incomplete or duplicated customer data. Without a unified foundation, AI is decorative — copilots can't see the full account, agents can't act on real signals, and personalisation collapses to firmographic targeting. Every Stage 3 / 4 organization Merkle has helped land has built this foundation first.",
    sfType: "Data & Identity",
    engagementSize: "16–24 weeks · $400K–$900K",
    priority: "critical",
  },

  {
    id: "agentforce_revenue_operations",
    title: "Agentic Revenue Operations (Agentforce)",
    tagline:
      "Embed AI agents inside seller, marketer, service, and ops workflows — with measurable role-level KPIs",
    description:
      "Strategic Agentforce (or equivalent) program that defines agent roles across the revenue lifecycle, deploys them inside CRM workflows with explicit guardrails, and operates a measurement layer for agent contribution. Replaces ad-hoc 'AI tools' with a structured, governed agentic capability tied to revenue, retention, and cost-to-serve.",
    capabilities: ["tech_data_intelligence", "abs", "service_advocacy"],
    triggerThreshold: 3.0,
    scope:
      "Agent role and use-case design, Agentforce platform deployment, agent guardrails and governance, KPI measurement per agent, change management and adoption.",
    methods: [
      "Agent role and use-case design across the revenue lifecycle",
      "Agentforce platform deployment with guardrails",
      "AI governance, audit, and access controls",
      "Per-agent KPI measurement (deflection, conversion, NRR)",
      "Change management and adoption planning",
    ],
    valueNarrative:
      "Most enterprises buy AI tools without an agentic operating model — adoption stalls and value is lost. A structured Agentforce program ties agent activity to specific revenue, retention, and cost outcomes, with governance the CFO and CISO can sign.",
    sfType: "AI / Agentic",
    engagementSize: "12–20 weeks · $300K–$700K",
    priority: "high",
  },

  // ══════════════════════════════════════════════════════════════════
  // OPERATING MODEL & ADOPTION
  // ══════════════════════════════════════════════════════════════════
  {
    id: "operating_model_adoption",
    title: "Operating Model Design & Adoption",
    tagline:
      "Make the new operating model real — roles, KPIs, governance, embedded enablement",
    description:
      "Translates the Vision and Blueprint into a working operating model — defines new and evolved roles, decision rights, KPIs, governance cadence, and an embedded enablement plan. Most B2B transformations underperform because the human operating model lags the technology stack — this engagement closes that gap.",
    capabilities: ["vision_strategy", "abm", "abs", "service_advocacy"],
    triggerThreshold: 3.5,
    scope:
      "Current operating model diagnosis, target operating model design, role definition and decision rights, KPI and incentive alignment, governance and cadence, embedded enablement plan.",
    methods: [
      "Current operating model diagnosis",
      "Target operating model design (roles, decisions, KPIs)",
      "Role transition plan with named champions",
      "Embedded enablement (in-team coaches and rituals)",
      "Governance cadence and quarterly value reviews",
    ],
    valueNarrative:
      "Tools without new roles default to old behavior. The single biggest predictor of transformation ROI is whether the operating model and incentive system change alongside the platform. Embedded enablement — coaches inside the team, not classroom training — is what makes the new model stick.",
    sfType: "Operating Model",
    engagementSize: "10–18 weeks · $300K–$700K",
    priority: "high",
  },
];

export function getB2bTriggeredOpportunities(
  capabilityScores: Record<string, number>,
  limit: number = 6
): B2bOpportunity[] {
  const triggered = B2B_OPPORTUNITIES.filter((opp) => {
    return opp.capabilities.some((cap) => {
      const score = capabilityScores[cap];
      if (score === undefined) return false;
      if (opp.minTriggerScore !== undefined) {
        return score >= opp.minTriggerScore;
      }
      return score < opp.triggerThreshold;
    });
  });

  const priorityOrder = { critical: 0, high: 1, medium: 2, innovation: 3 };

  triggered.sort((a, b) => {
    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];
    if (aPriority !== bPriority) return aPriority - bPriority;
    const aMinScore = Math.min(
      ...a.capabilities.map((c) => capabilityScores[c] ?? 5)
    );
    const bMinScore = Math.min(
      ...b.capabilities.map((c) => capabilityScores[c] ?? 5)
    );
    return aMinScore - bMinScore;
  });

  const sliced = triggered.slice(0, limit);

  return sliced.map((opp, idx) => {
    if (opp.priority === "innovation") return opp;
    const displayPriority: B2bOpportunity["priority"] =
      idx < 2 ? "critical" : idx < 4 ? "high" : "medium";
    return { ...opp, priority: displayPriority };
  });
}

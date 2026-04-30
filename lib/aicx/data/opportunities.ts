import type { AicxOpportunity } from "@/lib/aicx/types";

/**
 * Merkle AI for CX offerings.
 *
 * Sourced from the Merkle 2026 "AI for CX" deep dive (March 2026) and the
 * Customer Experience Optimization (EXO) Offering Toolkit (v2.0, January
 * 2026). Organized in two layers:
 *
 *   1. Four "wedge" engagements – AI for CX Diagnostic, Agentic
 *      Discoverability Audit, EXO Optimization Strategy, Adaptive
 *      Personalization Workshop. These are the small, fast entry points
 *      that set up the larger AI-for-CX transformation programs.
 *   2. Ten capability- and platform-level engagements – agentic SEO/AEO,
 *      agentic experience design, conversational commerce, real-time
 *      personalization, identity foundations, experimentation
 *      infrastructure, AI trust/guardrails, measurement scorecard,
 *      agentic service workflows, and an innovation lab for emerging
 *      agentic CX patterns.
 */
export const AICX_OPPORTUNITIES: AicxOpportunity[] = [
  // ══════════════════════════════════════════════════════════════════
  // WEDGE ENGAGEMENTS – set up the bigger AI-for-CX transformation
  // ══════════════════════════════════════════════════════════════════
  {
    id: "ai_for_cx_diagnostic",
    title: "AI for CX Diagnostic & North Star",
    tagline:
      "Establish a baseline, an AI-for-CX vision, and the investment themes that will fund it",
    description:
      "Leadership engagement that benchmarks the brand's AI-for-CX maturity across discoverability, experience, personalization, and measurement; identifies where the brand is invisible to AI agents today; and aligns leadership on a North Star vision and the investment themes (data, experience, trust) needed to get there.",
    capabilities: [
      "agentic_discoverability",
      "agentic_experience",
      "adaptive_personalization",
      "measurement_trust",
    ],
    triggerThreshold: 3.0,
    scope:
      "Maturity assessment across the six AI-for-CX capabilities, leadership visioning workshops, agentic discoverability spot-check on top brand and category terms, definition of an AI-for-CX North Star, high-level roadmap.",
    methods: [
      "Maturity assessment across six AI-for-CX capabilities",
      "Leadership visioning workshops",
      "Agentic discoverability spot-check on top brand & category terms",
      "Definition of a North Star vision and investment themes",
      "High-level roadmap with sequenced investment themes",
    ],
    valueNarrative:
      "AI agents are now the front door to the brand for a growing share of customers – and most brands are invisible. A clear, leadership-aligned North Star is the prerequisite for every AI-for-CX investment that follows.",
    sfType: "Strategy & Vision",
    engagementSize: "6–10 weeks · $150K–$350K",
    priority: "critical",
  },
  {
    id: "agentic_discoverability_audit",
    title: "Agentic Discoverability Audit",
    tagline:
      "Find out exactly where the brand is included or excluded by AI agents – and what to fix first",
    description:
      "A focused audit that probes how the brand, its products, and its expertise show up across the leading LLMs, AI search experiences, and agent ecosystems. We look at content structure, schema, brand-mention patterns, and competitor coverage, then deliver a prioritised remediation roadmap.",
    capabilities: ["agentic_discoverability"],
    triggerThreshold: 3.0,
    scope:
      "Cross-LLM probe set on top brand / category / authority queries, content & schema audit, competitor benchmarking, prioritised remediation roadmap.",
    methods: [
      "Cross-LLM and AI-search probe set on brand and category queries",
      "Content, schema, and knowledge-graph audit",
      "Competitor benchmarking – who AI agents are recommending instead",
      "Prioritised remediation roadmap with quick wins and structural fixes",
    ],
    valueNarrative:
      "When an AI agent decides what to surface, content that isn't structured for extraction is silently filtered out. Most brands have never measured this. The audit is the fastest, lowest-risk way to make AI invisibility visible.",
    sfType: "Discoverability",
    engagementSize: "4–6 weeks · $75K–$150K",
    priority: "high",
  },
  {
    id: "exo_optimization_strategy",
    title: "EXO Optimization Strategy",
    tagline:
      "Maturity assessment of the experimentation engine – A/B, bandits, holdouts, factorial design",
    description:
      "The Customer Experience Optimization (EXO) maturity assessment looks at how the brand validates AI investments today: experimentation cadence, statistical rigor, holdout discipline, and how learnings flow back into personalization and AI models. The output is a 12-month plan to mature the engine.",
    capabilities: ["experimentation", "measurement_trust"],
    triggerThreshold: 3.0,
    scope:
      "Current-state experimentation audit, capability and tooling assessment, sample factorial / multi-arm bandit design, 12-month maturation plan with team structure and tooling recommendations.",
    methods: [
      "Current-state experimentation cadence and rigor audit",
      "Capability and tooling assessment (LaunchDarkly / Optimizely / GrowthBook etc.)",
      "Sample factorial or multi-arm bandit design on a real use case",
      "12-month maturation plan with team structure and tooling recommendations",
    ],
    valueNarrative:
      "AI investments without rigorous experimentation are bets on faith. The EXO Optimization Strategy is the fastest way to convert AI spend into measurable, attributable value.",
    sfType: "EXO Strategy",
    engagementSize: "6–8 weeks · $125K–$250K",
    priority: "high",
  },
  {
    id: "adaptive_personalization_workshop",
    title: "Adaptive Personalization Workshop",
    tagline:
      "One high-value journey, redesigned around real-time AI decisioning",
    description:
      "A focused, time-boxed workshop that takes a single high-value journey (acquisition, onboarding, cross-sell, retention) and redesigns it around real-time AI decisioning – moving from rules and batch personalization to model-driven, multi-armed adaptive delivery on a unified identity layer.",
    capabilities: ["adaptive_personalization", "identity_data"],
    triggerThreshold: 3.0,
    scope:
      "Journey selection and current-state mapping, identity and signal inventory, real-time decisioning architecture, model and trigger design, MVP build plan.",
    methods: [
      "Journey selection and current-state behavioural mapping",
      "Identity, signal, and feature inventory",
      "Real-time decisioning architecture – engine, models, trigger logic",
      "MVP build plan with measurable targets",
    ],
    valueNarrative:
      "Adaptive personalization on one journey, done right, is the proof point that funds the rest. It's the wedge that turns scattered personalization into a real-time, measurable engine.",
    sfType: "Personalization Strategy",
    engagementSize: "4–6 weeks · $100K–$200K",
    priority: "high",
  },

  // ══════════════════════════════════════════════════════════════════
  // CAPABILITY ENGAGEMENTS – agentic discoverability + experience
  // ══════════════════════════════════════════════════════════════════
  {
    id: "agentic_seo_aeo_modernization",
    title: "Agentic SEO / AEO Modernization",
    tagline:
      "Re-platform the content engine so brand and product show up across LLMs, AI search, and agent answers",
    description:
      "Modernise the brand's discoverability stack – content structure, schema, knowledge graph, brand-mention strategy, and authority content – so AI agents and answer engines extract, cite, and recommend the brand consistently. Includes content-system tooling and editorial-workflow changes.",
    capabilities: ["agentic_discoverability"],
    triggerThreshold: 3.5,
    scope:
      "Schema and structured-data buildout, knowledge graph design, content gap analysis, authority content production framework, AI-search monitoring instrumentation.",
    methods: [
      "Schema, structured data, and knowledge graph design",
      "Content gap analysis vs. AI-agent intent coverage",
      "Authority content production framework",
      "AI-search and LLM monitoring instrumentation",
    ],
    valueNarrative:
      "Search behaviour is shifting fast – Gartner forecasts 25%+ of search queries will be handled by AI agents and answer engines by 2026. Brands that don't modernise the discoverability stack lose share invisibly.",
    sfType: "Content & SEO",
    engagementSize: "12–20 weeks · $300K–$750K",
    priority: "high",
  },
  {
    id: "agentic_experience_design",
    title: "Agentic Experience Design",
    tagline:
      "Redesign the digital experience for AI-native users – conversational, video-led, agent-aware",
    description:
      "Design and build AI-native experience patterns: conversational interfaces, video-led discovery, AI-summarised product pages, agent-friendly navigation, and Gen-Alpha-ready research patterns. Includes design-system updates, content patterns, and AI-experience guidelines.",
    capabilities: ["agentic_experience"],
    triggerThreshold: 3.5,
    scope:
      "AI-native experience pattern library, conversational and video-led discovery design, design-system and content-pattern updates, AI-experience guidelines, prototype and measurement plan.",
    methods: [
      "AI-native experience research and pattern library",
      "Conversational and video-led discovery design",
      "Design-system and content-pattern updates",
      "AI-experience guidelines, prototype, and measurement plan",
    ],
    valueNarrative:
      "Gen-Alpha and Gen-Z research the way they research TikTok – visually, conversationally, with AI agents as collaborators. Experiences designed for human-only browsing feel obsolete to them within seconds.",
    sfType: "Experience Design",
    engagementSize: "12–20 weeks · $350K–$800K",
    priority: "high",
  },
  {
    id: "ai_search_conversational_commerce",
    title: "AI Search & Conversational Commerce",
    tagline:
      "Embed conversational AI into discovery, search, and transaction journeys",
    description:
      "Design, build, and integrate conversational AI surfaces into discovery, search, configuration, and transaction journeys – including the model selection, retrieval architecture, brand-voice tuning, and guardrails needed to operate them in production.",
    capabilities: ["agentic_experience", "agentic_discoverability"],
    triggerThreshold: 3.5,
    scope:
      "Conversational use-case design, retrieval architecture (RAG / vector / hybrid), model selection and prompt design, brand-voice and safety tuning, integration with commerce / cart / fulfillment.",
    methods: [
      "Conversational use-case design and journey mapping",
      "Retrieval architecture (RAG, vector, hybrid)",
      "Model selection, prompt design, brand-voice tuning",
      "Integration with commerce, cart, and fulfillment",
    ],
    valueNarrative:
      "Conversational commerce isn't a chatbot – it's a re-architected discovery experience. Done right, it shifts assisted-conversion economics and creates a defensible position before agent ecosystems mature.",
    sfType: "Conversational Commerce",
    engagementSize: "16–28 weeks · $500K–$1.5M",
    priority: "high",
  },

  // ══════════════════════════════════════════════════════════════════
  // CAPABILITY ENGAGEMENTS – adaptive personalization + identity
  // ══════════════════════════════════════════════════════════════════
  {
    id: "real_time_personalization_platform",
    title: "Real-Time Personalization Platform",
    tagline:
      "Move from batch / rules to AI-driven decisioning across every paid, owned, and assisted touch",
    description:
      "Architect, build, and operationalise a real-time decisioning platform – feature store, models, decisioning engine, content factory, and orchestration – that delivers AI-driven personalization across web, app, email, ads, and assisted channels.",
    capabilities: ["adaptive_personalization", "identity_data"],
    triggerThreshold: 3.5,
    scope:
      "Decisioning architecture, feature store design, model build (propensity, NBA, value), content factory, orchestration across channels, operating model.",
    methods: [
      "Decisioning architecture and platform selection",
      "Feature store and signal pipeline design",
      "Model build – propensity, NBA, value, churn",
      "Content factory and orchestration across channels",
      "Personalization operating model",
    ],
    valueNarrative:
      "Brands stuck in rules-based personalization plateau quickly. AI-driven, real-time decisioning routinely lifts conversion 15–35% on owned channels and unlocks dynamic value-based bidding on paid.",
    sfType: "Personalization Platform",
    engagementSize: "20–36 weeks · $750K–$2M",
    priority: "high",
  },
  {
    id: "identity_data_foundation",
    title: "Identity & Customer Data Foundation",
    tagline:
      "Unified customer identity, segmentation, and predictive layer that every AI use case can rely on",
    description:
      "Architect and implement the unified customer identity and data foundation – identity resolution, segmentation, predictive models (propensity, churn, LTV), and consent – that every downstream AI use case depends on.",
    capabilities: ["identity_data"],
    triggerThreshold: 3.5,
    scope:
      "Identity resolution architecture, customer data platform implementation, segmentation framework, predictive model library, consent and preference management, governance.",
    methods: [
      "Identity resolution architecture",
      "CDP / customer data platform implementation",
      "Segmentation framework and predictive model library",
      "Consent and preference management",
      "Governance and data-quality operating model",
    ],
    valueNarrative:
      "AI is only as good as the customer signal it has access to. Without unified identity, every AI use case operates with a partial view – and the personalization, decisioning, and measurement that depend on it never deliver.",
    sfType: "Data Platform",
    engagementSize: "20–36 weeks · $750K–$2M",
    priority: "high",
  },

  // ══════════════════════════════════════════════════════════════════
  // CAPABILITY ENGAGEMENTS – experimentation, trust, measurement
  // ══════════════════════════════════════════════════════════════════
  {
    id: "experimentation_infrastructure",
    title: "Experimentation Infrastructure",
    tagline:
      "Stand up A/B, multi-arm bandit, holdout, and factorial design at scale",
    description:
      "Implement experimentation infrastructure – tooling, statistical methodology, governance, and team capability – that lets the organisation validate every AI investment with rigorous A/B, multi-arm bandit, holdout, and factorial design at scale.",
    capabilities: ["experimentation"],
    triggerThreshold: 3.5,
    scope:
      "Tooling implementation, statistical methodology playbooks, governance and review cadence, capability uplift, integration with personalization and AI surfaces.",
    methods: [
      "Tooling implementation (LaunchDarkly / Optimizely / GrowthBook)",
      "Statistical methodology playbooks",
      "Governance and experiment review cadence",
      "Capability uplift across analytics and product teams",
      "Integration with personalization and AI surfaces",
    ],
    valueNarrative:
      "Without experimentation rigor, AI ROI claims are unfalsifiable. The experimentation infrastructure is the truth-telling layer that compounds learning over time.",
    sfType: "EXO Infrastructure",
    engagementSize: "12–20 weeks · $300K–$700K",
    priority: "high",
  },
  {
    id: "ai_trust_brand_safety",
    title: "AI Trust & Brand-Safety Guardrails",
    tagline:
      "Confidence scoring, trigger logic, and brand-safety guardrails that let AI act only where it should",
    description:
      "Design the AI-confidence and brand-safety framework – confidence scoring, trigger thresholds, content moderation, escalation paths, and human-in-the-loop checkpoints – that lets AI operate at scale without putting the brand at risk.",
    capabilities: ["measurement_trust", "agentic_experience"],
    triggerThreshold: 3.5,
    scope:
      "Confidence-scoring framework, trigger and threshold design, content moderation, escalation paths, human-in-the-loop checkpoints, monitoring and incident response.",
    methods: [
      "Confidence-scoring framework",
      "Trigger and threshold design",
      "Content moderation and brand-safety guardrails",
      "Escalation paths and human-in-the-loop checkpoints",
      "Monitoring, incident response, and audit trails",
    ],
    valueNarrative:
      "AI failures in customer-facing surfaces erode brand trust faster than they are caught. The trust framework is what makes scaling AI safely possible – not optional.",
    sfType: "AI Governance",
    engagementSize: "8–14 weeks · $200K–$500K",
    priority: "high",
  },
  {
    id: "ai_measurement_scorecard",
    title: "AI Measurement Scorecard",
    tagline:
      "A measurement framework that ties every AI investment to incremental business outcomes",
    description:
      "Build the AI measurement scorecard – KPIs, attribution methodology, holdout discipline, model-level performance metrics, and an executive dashboard – that ties every AI investment to incremental business outcomes (revenue, retention, cost-to-serve).",
    capabilities: ["measurement_trust", "experimentation"],
    triggerThreshold: 3.5,
    scope:
      "KPI framework, attribution methodology, holdout discipline, model-level performance metrics, executive dashboard, value-realisation governance.",
    methods: [
      "KPI framework and attribution methodology",
      "Holdout discipline and incrementality measurement",
      "Model-level performance metrics",
      "Executive dashboard and value-realisation governance",
    ],
    valueNarrative:
      "AI investments without an executive scorecard quietly fade. A clear, attributable measurement framework is what keeps the budget intact and the program funded for the next horizon.",
    sfType: "Measurement",
    engagementSize: "8–14 weeks · $200K–$450K",
    priority: "high",
  },

  // ══════════════════════════════════════════════════════════════════
  // INNOVATION
  // ══════════════════════════════════════════════════════════════════
  {
    id: "agentic_service_workflow",
    title: "Agentic Service Workflow Activation",
    tagline:
      "Multi-agent customer service flows – deflection, resolution, escalation",
    description:
      "Design and deploy multi-agent customer-service workflows – deflection, summarisation, resolution, escalation – across chat, voice, and asynchronous channels, with the supervisor and trust frameworks needed to run them in production.",
    capabilities: ["agentic_experience", "measurement_trust"],
    triggerThreshold: 4.0,
    scope:
      "Service-flow redesign, multi-agent architecture, supervisor design, integration with case / CRM / knowledge, deflection and resolution measurement.",
    methods: [
      "Service-flow redesign for human + AI teaming",
      "Multi-agent architecture and supervisor design",
      "Integration with case, CRM, and knowledge",
      "Deflection, resolution, and CSAT measurement",
    ],
    valueNarrative:
      "Agentic service is the highest-volume, highest-ROI surface for AI in CX – and the one most exposed to brand-safety risk. Done right, deflection and case-time savings pay for the rest of the AI program.",
    sfType: "Agentic Service",
    engagementSize: "16–28 weeks · $500K–$1.2M",
    priority: "innovation",
  },
  {
    id: "agentic_cx_innovation_lab",
    title: "Agentic CX Innovation Lab",
    tagline:
      "Time-boxed prototype lab for emerging agentic patterns – multi-agent commerce, AI concierge, generative video",
    description:
      "Time-boxed innovation lab that prototypes 2–3 emerging agentic CX patterns (multi-agent commerce, AI concierge, generative video product pages, browse-by-conversation, etc.) with real customer telemetry, then writes the case for which to scale.",
    capabilities: [
      "agentic_experience",
      "agentic_discoverability",
      "adaptive_personalization",
    ],
    triggerThreshold: 4.0,
    scope:
      "Use-case shortlisting, rapid prototyping (2–3 patterns in parallel), customer telemetry and qualitative testing, scale-decision recommendation.",
    methods: [
      "Use-case shortlisting against business and brand context",
      "Rapid prototyping of 2–3 agentic CX patterns in parallel",
      "Customer telemetry and qualitative testing",
      "Scale-decision recommendation and roadmap",
    ],
    valueNarrative:
      "The agent ecosystem is moving fast. An innovation lab is the only way to learn at the pace of the market without committing the wrong bet at scale.",
    sfType: "Innovation",
    engagementSize: "10–14 weeks · $250K–$500K",
    priority: "innovation",
  },
];

export function getAicxTriggeredOpportunities(
  capabilityScores: Record<string, number>,
  limit: number = 6
): AicxOpportunity[] {
  const triggered = AICX_OPPORTUNITIES.filter((opp) => {
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
    const displayPriority: AicxOpportunity["priority"] =
      idx < 2 ? "critical" : idx < 4 ? "high" : "medium";
    return { ...opp, priority: displayPriority };
  });
}

import type {
  CscQuestion,
  CscIndustryQuestion,
  CscCapability,
} from "@/lib/csc/types";

// ── Content Supply Chain Maturity Questions ─────────────────────────
// Sourced from the revised CSC Diagnostic (Comprehensive Assisted Version).
// 27 core questions across 6 natural capability sections, designed for
// conversational, live-session assessment with facilitator notes. Each question
// maps to the 5-point maturity scale (1 = Not in Place → 5 = Optimized).
// Tooltips anchor each question against the Level 5 ("Optimized") descriptor
// so respondents can calibrate consistently.

export const CSC_CAPABILITY_LABELS: Record<CscCapability, string> = {
  strategy_planning: "Strategy & Planning",
  workflow_production: "Workflow & Production",
  asset_governance: "Asset Management & Governance",
  distribution_activation: "Distribution & Activation",
  measurement_insights: "Measurement & Insights",
  intelligence_automation: "Intelligence & Automation",
};

export const CSC_CAPABILITY_SUBTITLES: Record<CscCapability, string> = {
  strategy_planning: "Strategic Foundation",
  workflow_production: "Build Engine",
  asset_governance: "Asset Foundation",
  distribution_activation: "Delivery at Scale",
  measurement_insights: "Feedback Loop",
  intelligence_automation: "AI Engine",
};

export const CSC_CAPABILITY_DESCRIPTIONS: Record<CscCapability, string> = {
  strategy_planning:
    "Assess the extent to which content strategy, ideation, portfolio planning, editorial calendars, and content policies are designed to deliver audience-led, outcomes-driven content at scale.",
  workflow_production:
    "Assess the extent to which content is produced through integrated, scalable, and increasingly AI-augmented workflows — from project management through approvals, costs, resources, and localization.",
  asset_governance:
    "Assess the extent to which content assets are stored, accessed, versioned, reused, rights-cleared, archived, compliant, tagged, and secured through a trusted DAM foundation.",
  distribution_activation:
    "Assess the extent to which content is distributed, adapted, personalized, tested, scheduled, and audience-targeted across channels through connected, AI-powered activation.",
  measurement_insights:
    "Assess the extent to which content performance is tracked, aligned to business goals, reported, quality-assured, and fed back into the content lifecycle.",
  intelligence_automation:
    "Assess the extent to which metadata, search, and AI-driven automation power content discovery, dynamic assembly, and production at scale.",
};

export const CSC_CAPABILITY_SCOPE_HINTS: Record<CscCapability, string> = {
  strategy_planning:
    "These questions assess enterprise content strategy, ideation, portfolio planning, calendars, and policy. Input from brand, marketing strategy, or content leadership may be helpful.",
  workflow_production:
    "These questions assess content production operations end-to-end. Input from studio leads, production ops, project management, and localization may be helpful.",
  asset_governance:
    "These questions assess DAM, rights, compliance, and security. Input from MarTech, DAM admins, legal/compliance, and content ops may be helpful.",
  distribution_activation:
    "These questions assess cross-channel distribution and activation. Input from channel owners, CRM, commerce, personalization, and media activation may be helpful.",
  measurement_insights:
    "These questions assess measurement, reporting, and insight loops. Input from marketing science, analytics, and content effectiveness teams may be helpful.",
  intelligence_automation:
    "These questions assess metadata, search, and AI automation. Input from content technology, data, and AI enablement teams may be helpful.",
};

export const CSC_SCORE_LABELS: Record<number, string> = {
  1: "Not in Place",
  2: "Emerging",
  3: "Operational",
  4: "Integrated",
  5: "Optimized",
};

export const CSC_SCORE_DESCRIPTIONS: Record<number, string> = {
  1: "Capability does not exist or is highly fragmented with no formal process.",
  2: "Limited pilots or isolated capabilities exist but are not consistently applied.",
  3: "Capability is in use and operational but not consistently integrated across teams, brands, or channels.",
  4: "Capability operates across teams, brands, and channels with clear governance and coordination.",
  5: "Capability is fully orchestrated, continuously improved through data and AI, and drives measurable content outcomes.",
};

// ── 27 Core Questions (Comprehensive Assisted Version) ──────────────
// Revised for conversational, live-session assessment with facilitator notes.
// Optional questions (marked in original) are included in core for unified scoring.
export const CSC_CORE_QUESTIONS: CscQuestion[] = [
  // ── Strategy & Planning (5) ───────────────────────────────────────
  {
    id: 1,
    text: "How is your content strategy developed, and how tightly is it tied to business objectives, audience insights, and measurable outcomes?",
    capability: "strategy_planning",
    tooltip:
      "Optimized: planning is dynamic and continuously optimized from audience insight, performance analytics, and real-time data — not built around product launches or calendar cadence.",
  },
  {
    id: 2,
    text: "How do you generate and vet new content ideas before you commit to production?",
    capability: "strategy_planning",
    tooltip:
      "Optimized: ideas are generated systematically across channels (including AI-assisted ideation from brand-aligned sources) and validated with predictive/AI analytics before production.",
  },
  {
    id: 3,
    text: "How do teams plan and collaborate around the content portfolio and calendar?",
    capability: "strategy_planning",
    tooltip:
      "Optimized: a shared, dynamic portfolio plan tied to goals, with a centralized calendar and AI-driven scheduling.",
  },
  {
    id: 4,
    text: "What governs consistency and content standards — look and feel, quality, and production policies?",
    capability: "strategy_planning",
    tooltip:
      "Optimized: enforced governance with automation and monitoring; policies continuously updated from performance and regulatory change.",
  },
  {
    id: 5,
    text: "What is your approach to updating and refreshing existing content?",
    capability: "strategy_planning",
    tooltip:
      "Optimized: data-driven and increasingly automated; systems predict refresh needs and auto-prioritize.",
  },

  // ── Workflow & Production (5) ─────────────────────────────────────
  {
    id: 6,
    text: "How do you use technology — including AI and integrated creative tools — to accelerate content creation at scale?",
    capability: "workflow_production",
    tooltip:
      "Optimized: reuse and orchestration at the component level; APIs and AI scale content across channels.",
  },
  {
    id: 7,
    text: "How do you manage cross-channel content projects and track their progress?",
    capability: "workflow_production",
    tooltip:
      "Optimized: unified workflows scale across channels without duplicated effort; enterprise-grade project management integrated with CMS and DAM.",
  },
  {
    id: 8,
    text: "How are approvals, feedback, and revisions handled?",
    capability: "workflow_production",
    tooltip:
      "Optimized: predictive, dynamic approvals adapting to content type/risk/region; real-time collaboration with automated conflict resolution.",
  },
  {
    id: 9,
    text: "How do you track and manage the cost and resourcing of content projects?",
    capability: "workflow_production",
    tooltip:
      "Optimized: enterprise financial systems integrated with content tools; metrics drive resource planning across the supply chain.",
  },
  {
    id: 10,
    text: "How is content localization or market/audience-variant production managed?",
    capability: "workflow_production",
    tooltip:
      "Optimized: AI predicts localization/variant needs and auto-generates resonant content across markets, regions, or audience segments (applies to single-market businesses with multiple audience variants too).",
  },

  // ── Asset Management & Governance (5) ──────────────────────────────
  {
    id: 11,
    text: "How do you store, organize, and control access to your digital assets? Is there a central DAM?",
    capability: "asset_governance",
    tooltip:
      "Optimized: a fully integrated DAM acts as the backbone of the content supply chain, with enforced role-based access tied to identity and content systems.",
  },
  {
    id: 12,
    text: "How do you manage version control and the reuse of content components?",
    capability: "asset_governance",
    tooltip:
      "Optimized: a formalized version-control framework integrated with workflows and audit trails; predictive analytics surface high-value reuse opportunities.",
  },
  {
    id: 13,
    text: "How do you manage rights, usage, compliance, and legal requirements?",
    capability: "asset_governance",
    tooltip:
      "Optimized: rights management scales with growth and new tech; compliance is automated and embedded directly into workflows.",
  },
  {
    id: 14,
    text: "How is content security and archiving managed?",
    capability: "asset_governance",
    tooltip:
      "Optimized: an optimized security framework integrated with tools; archives retain full historical versions and audit trails for transparency and compliance.",
  },
  {
    id: 15,
    text: "How is content tagged and made searchable?",
    capability: "asset_governance",
    tooltip:
      "Optimized: AI/ML auto-categorizes content based on taxonomy rules.",
  },

  // ── Distribution & Activation (5) ──────────────────────────────────
  {
    id: 16,
    text: "How do you manage content distribution and adapt content across channels?",
    capability: "distribution_activation",
    tooltip:
      "Optimized: real-time cross-channel optimization across all surfaces; AI predicts optimal channel mix and timing.",
  },
  {
    id: 17,
    text: "How do you manage personalization and audience segmentation?",
    capability: "distribution_activation",
    tooltip:
      "Optimized: AI-driven personalization delivers hyper-relevant experiences; segmentation is dynamic and based on real-time data.",
  },
  {
    id: 18,
    text: "How do you schedule content and orchestrate campaign workflows across channels?",
    capability: "distribution_activation",
    tooltip:
      "Optimized: AI-driven orchestration predicts bottlenecks and auto-allocates resources; AI predicts optimal publishing times and channels.",
  },
  {
    id: 19,
    text: "How do you test content and feed audience insights back into distribution?",
    capability: "distribution_activation",
    tooltip:
      "Optimized: AI predicts optimal test variations; continuous feedback loops refine delivery with predictive modeling.",
  },
  {
    id: 20,
    text: "How connected are your creative/content tools to your distribution tools?",
    capability: "distribution_activation",
    tooltip:
      "Optimized: end-to-end AI-powered integration adapts content for channel-specific requirements automatically.",
  },

  // ── Measurement & Insights (4) ────────────────────────────────────
  {
    id: 21,
    text: "How do you visualize content performance across channels? Are dashboards used?",
    capability: "measurement_insights",
    tooltip:
      "Optimized: AI/ML dashboards auto-generate cross-channel, role-based customizable views and surface emerging trends.",
  },
  {
    id: 22,
    text: "How are content metrics aligned to business goals?",
    capability: "measurement_insights",
    tooltip:
      "Optimized: an enterprise-wide framework for objectives and goals, integrated with advanced AI-powered tools.",
  },
  {
    id: 23,
    text: "How do you report on performance, and do you benchmark it?",
    capability: "measurement_insights",
    tooltip:
      "Optimized: enterprise-wide, AI-driven analytics with formal performance benchmarking practices.",
  },
  {
    id: 24,
    text: "How do you ensure data quality, and how are insights fed back into the content process?",
    capability: "measurement_insights",
    tooltip:
      "Optimized: immutable audit trails log models, training data, and predictions for transparency and bias mitigation; AI autonomously generates insights and prescribes actions.",
  },

  // ── Intelligence & Automation (3) ──────────────────────────────────
  {
    id: 25,
    text: "What is your approach to metadata? Does it power personalized delivery and predictive analytics?",
    capability: "intelligence_automation",
    tooltip:
      "Optimized: metadata supports advanced capabilities such as personalized content delivery and predictive analytics.",
  },
  {
    id: 26,
    text: "What content search capabilities exist, and do results adapt to user behavior and preferences?",
    capability: "intelligence_automation",
    tooltip:
      "Optimized: dynamic personalization tailors search results based on user behavior and preferences.",
  },
  {
    id: 27,
    text: "How is automation, including AI-driven component combination, used to produce content at scale?",
    capability: "intelligence_automation",
    tooltip:
      "Optimized: AI predicts optimal component combinations from real-time analytics to produce content at scale.",
  },
];

export const CSC_CAPABILITIES_ORDER: CscCapability[] = [
  "strategy_planning",
  "workflow_production",
  "asset_governance",
  "distribution_activation",
  "measurement_insights",
  "intelligence_automation",
];

export const CSC_QUESTIONS_BY_CAPABILITY: Record<CscCapability, CscQuestion[]> =
  CSC_CAPABILITIES_ORDER.reduce(
    (acc, cap) => {
      acc[cap] = CSC_CORE_QUESTIONS.filter((q) => q.capability === cap);
      return acc;
    },
    {} as Record<CscCapability, CscQuestion[]>
  );

export const CSC_INDUSTRY_LABELS: Record<string, string> = {
  retail: "Retail / Commerce",
  qsr: "Quick Service / Fast Casual",
  financial_services: "Financial Services",
  travel_hospitality: "Travel & Hospitality",
  automotive: "Automotive / Mobility",
};

// Optional industry supplement (not in xlsx source — carried forward from
// the CRM diagnostic's shape). Capabilities re-mapped to the CSC 6-set.
export const CSC_INDUSTRY_QUESTIONS: CscIndustryQuestion[] = [
  // Retail
  {
    id: "retail_1",
    text: "To what extent is product content (PDP copy, imagery, attributes) generated, localized, and optimized at SKU scale?",
    industry: "retail",
    capability: "workflow_production",
  },
  {
    id: "retail_2",
    text: "To what extent is content varied by life stage, household signal, or purchase pattern rather than treated as one audience?",
    industry: "retail",
    capability: "distribution_activation",
  },
  {
    id: "retail_3",
    text: "To what extent is seasonal and promotional content re-used and remixed across brand, retail media, and commerce surfaces?",
    industry: "retail",
    capability: "asset_governance",
  },
  {
    id: "retail_4",
    text: "To what extent are category and occasion patterns used to shape always-on content rather than campaign bursts?",
    industry: "retail",
    capability: "strategy_planning",
  },
  {
    id: "retail_5",
    text: "To what extent is retail media creative personalized, tested, and refreshed based on in-flight performance signals?",
    industry: "retail",
    capability: "measurement_insights",
  },

  // QSR
  {
    id: "qsr_1",
    text: "To what extent is content tailored by daypart, occasion, and visit frequency rather than treated as a single audience?",
    industry: "qsr",
    capability: "distribution_activation",
  },
  {
    id: "qsr_2",
    text: "To what extent are local menu, offer, and market variants produced and kept in-sync at the store or region level?",
    industry: "qsr",
    capability: "workflow_production",
  },
  {
    id: "qsr_3",
    text: "To what extent is app, loyalty, and in-store content managed as one content portfolio rather than separate channel streams?",
    industry: "qsr",
    capability: "strategy_planning",
  },
  {
    id: "qsr_4",
    text: "To what extent are LTO and promotional assets versioned, rights-tracked, and retired cleanly across markets?",
    industry: "qsr",
    capability: "asset_governance",
  },
  {
    id: "qsr_5",
    text: "To what extent is user-generated and creator content integrated into the brand content supply chain?",
    industry: "qsr",
    capability: "strategy_planning",
  },

  // Financial Services
  {
    id: "fs_1",
    text: "To what extent is regulated content (disclosures, legal, rates) versioned, approved, and kept in-sync across every surface it appears on?",
    industry: "financial_services",
    capability: "asset_governance",
  },
  {
    id: "fs_2",
    text: "To what extent is content differentiated by product set, life stage, and customer tenure rather than treated as one mass audience?",
    industry: "financial_services",
    capability: "distribution_activation",
  },
  {
    id: "fs_3",
    text: "To what extent is AI-assisted production used with compliance, legal, and risk guardrails built into the workflow?",
    industry: "financial_services",
    capability: "workflow_production",
  },
  {
    id: "fs_4",
    text: "To what extent is onboarding and cross-sell content driven by transaction and lifecycle signals rather than calendar cadence?",
    industry: "financial_services",
    capability: "measurement_insights",
  },
  {
    id: "fs_5",
    text: "To what extent are content assets tied to advice, education, and guidance journeys rather than only promotional messaging?",
    industry: "financial_services",
    capability: "strategy_planning",
  },

  // Travel & Hospitality
  {
    id: "th_1",
    text: "To what extent is content personalized across the trip lifecycle — dream, plan, book, stay, share — rather than treated as a single moment?",
    industry: "travel_hospitality",
    capability: "distribution_activation",
  },
  {
    id: "th_2",
    text: "To what extent are local property, destination, and partner assets managed through one consistent content supply chain?",
    industry: "travel_hospitality",
    capability: "asset_governance",
  },
  {
    id: "th_3",
    text: "To what extent are guest, creator, and review-generated assets integrated into owned brand content?",
    industry: "travel_hospitality",
    capability: "strategy_planning",
  },
  {
    id: "th_4",
    text: "To what extent are loyalty, tier, and recognition signals used to personalize content moments before, during, and after travel?",
    industry: "travel_hospitality",
    capability: "distribution_activation",
  },
  {
    id: "th_5",
    text: "To what extent is content performance tracked at the property, market, and experience level rather than aggregated to brand?",
    industry: "travel_hospitality",
    capability: "measurement_insights",
  },

  // Automotive
  {
    id: "auto_1",
    text: "To what extent is vehicle content (configurator, launch, comparison) generated once and adapted at scale across markets and dealers?",
    industry: "automotive",
    capability: "workflow_production",
  },
  {
    id: "auto_2",
    text: "To what extent are OEM, dealer, and aftermarket content programs aligned on a shared supply chain and governance model?",
    industry: "automotive",
    capability: "workflow_production",
  },
  {
    id: "auto_3",
    text: "To what extent is content aligned to the full vehicle lifecycle — research, purchase, service, loyalty, re-purchase?",
    industry: "automotive",
    capability: "strategy_planning",
  },
  {
    id: "auto_4",
    text: "To what extent are connected-vehicle signals used to trigger personalized content (service, upgrades, engagement)?",
    industry: "automotive",
    capability: "measurement_insights",
  },
  {
    id: "auto_5",
    text: "To what extent are creator, community, and owner-generated assets integrated into the brand content ecosystem?",
    industry: "automotive",
    capability: "strategy_planning",
  },
];

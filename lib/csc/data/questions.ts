import type {
  CscQuestion,
  CscIndustryQuestion,
  CscCapability,
  CscIndustry,
} from "@/lib/csc/types";

/**
 * Resolves a question's display text given the assessment's industry.
 * Mirrors lib/data/questions.ts:resolveQuestionText — see notes there.
 */
export function resolveCscQuestionText(
  q: Pick<CscQuestion, "text" | "byIndustry">,
  industry: CscIndustry | null | undefined
): string {
  if (industry && q.byIndustry?.[industry]) {
    return q.byIndustry[industry] as string;
  }
  return q.text;
}

// ── Content Supply Chain Maturity Questions ─────────────────────────
// Sourced from the Content Supply Chain Diagnostic.xlsx (Microsoft Forms
// export, 45 maturity questions across 6 natural sections). Each question
// has been reformatted into the Modern CRM diagnostic's "To what extent…"
// altitude and mapped to the 5-point maturity scale (1 = Not in Place
// → 5 = Optimized). Tooltips anchor each question against the Level 5
// ("Optimized") descriptor from the source xlsx so respondents can
// calibrate consistently.

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

// ── 45 Core Questions (from xlsx columns S–BK) ──────────────────────
export const CSC_CORE_QUESTIONS: CscQuestion[] = [
  // ── Strategy & Planning (8) ───────────────────────────────────────
  {
    id: 1,
    text: "To what extent is content strategy developed with clear integration to business objectives, audience insights, and measurable outcomes — rather than planned around product launches or calendar cadence?",
    capability: "strategy_planning",
    tooltip:
      "Optimized: content planning is dynamic and continuously optimized based on audience insights, performance analytics, and real-time data.",
  },
  {
    id: 2,
    text: "To what extent is the approach to updating existing content structured, data-driven, and increasingly automated — rather than reactive or manual?",
    capability: "strategy_planning",
    tooltip:
      "Optimized: AI-powered systems predict refresh needs and auto-prioritize updates based on performance signals.",
  },
  {
    id: 3,
    text: "To what extent is a consistent look and feel maintained across content types through enforced governance, automation, and monitoring tools?",
    capability: "strategy_planning",
    tooltip:
      "Optimized: enterprise-wide adoption of a robust governance framework with advanced tools for automation and monitoring.",
  },
  {
    id: 4,
    text: "To what extent are new content ideas generated systematically across channels — including through AI-powered ideation from brand-aligned sources?",
    capability: "strategy_planning",
    tooltip:
      "Optimized: a unified AI-powered platform generates a vast number of on-brand content ideas from a single prompt.",
  },
  {
    id: 5,
    text: "To what extent are content ideas assessed for potential performance before production — using predictive analytics and AI content analytics?",
    capability: "strategy_planning",
    tooltip:
      "Optimized: predictive campaign and AI content analytics validate ideas and assess potential effectiveness across audiences.",
  },
  {
    id: 6,
    text: "To what extent do teams collaborate around a shared, dynamic content portfolio plan aligned to business goals, audience insights, and campaign priorities?",
    capability: "strategy_planning",
    tooltip:
      "Optimized: enterprise-wide adoption of a dynamic content portfolio planning framework.",
  },
  {
    id: 7,
    text: "To what extent is the content calendar centralized in content management platforms and dynamically optimized — ideally with AI-driven scheduling?",
    capability: "strategy_planning",
    tooltip:
      "Optimized: enterprise-wide adoption of a sophisticated editorial calendar integrated with AI-driven scheduling tools.",
  },
  {
    id: 8,
    text: "To what extent are content production policies and standards documented, enforced, and continuously updated based on performance and regulatory changes?",
    capability: "strategy_planning",
    tooltip:
      "Optimized: policies and standards are continuously updated based on performance analytics and regulatory changes across the full content lifecycle.",
  },

  // ── Workflow & Production (10) ────────────────────────────────────
  {
    id: 9,
    text: "To what extent is technology — including AI and integrated creative tools — used to accelerate content creation at scale?",
    capability: "workflow_production",
    tooltip:
      "Optimized: micro-content orchestration enables atom-level reuse; APIs and AI scale content across channels.",
  },
  {
    id: 10,
    text: "To what extent are cross-channel content projects managed through unified workflows that scale rapidly without duplicated effort?",
    capability: "workflow_production",
    tooltip:
      "Optimized: API-driven workflows enable rapid scaling across channels rather than campaign-by-campaign rebuilds.",
  },
  {
    id: 11,
    text: "To what extent are responsibilities and tasks for content projects assigned through a shared governed structure with continuous improvement mechanisms?",
    capability: "workflow_production",
    tooltip:
      "Optimized: teams operate under a unified governed structure with strict adherence, checks, balances, and continuous improvement mechanisms.",
  },
  {
    id: 12,
    text: "To what extent is project progress tracked through enterprise-grade project management systems integrated with CMS, DAM, and other content platforms?",
    capability: "workflow_production",
    tooltip:
      "Optimized: enterprise-grade project management systems fully integrated with CMS, DAM, and other content systems.",
  },
  {
    id: 13,
    text: "To what extent are approval workflows predictive and dynamic — adapting to content type, risk level, and region?",
    capability: "workflow_production",
    tooltip:
      "Optimized: AI-powered workflows predict bottlenecks and dynamically reassign approvals based on workload or expertise.",
  },
  {
    id: 14,
    text: "To what extent are feedback and revisions handled through real-time collaboration tools with predictive prioritization and automated conflict resolution?",
    capability: "workflow_production",
    tooltip:
      "Optimized: AI-powered tools facilitate real-time collaboration, predictive feedback prioritization, and automated conflict resolution.",
  },
  {
    id: 15,
    text: "To what extent are content deadlines consistently met through governance structures, regular audits, and continuous improvement initiatives?",
    capability: "workflow_production",
    tooltip:
      "Optimized: governance ensures adherence to workflows with regular audits and continuous improvement initiatives in place.",
  },
  {
    id: 16,
    text: "To what extent are content creation costs tracked through enterprise-grade financial systems fully integrated with content tools?",
    capability: "workflow_production",
    tooltip:
      "Optimized: enterprise-grade financial systems are fully integrated with content, project, and asset platforms for seamless financial tracking.",
  },
  {
    id: 17,
    text: "To what extent are resources allocated and tracked for content projects using comprehensive metrics that drive strategic planning?",
    capability: "workflow_production",
    tooltip:
      "Optimized: comprehensive metrics drive strategic decisions for resource planning and allocation across the content supply chain.",
  },
  {
    id: 18,
    text: "To what extent is content localization or market/audience variant production managed dynamically — with AI predicting needs and generating culturally and contextually resonant content (or, for single-market businesses, audience- and segment-specific variants)?",
    capability: "workflow_production",
    tooltip:
      "Optimized: AI predicts localization or audience-variant needs and auto-generates resonant content across markets, regions, or audience segments. Applies whether the business operates internationally or in a single market with multiple audience or regional variants.",
  },

  // ── Asset Management & Governance (9) ─────────────────────────────
  {
    id: 19,
    text: "To what extent is digital asset storage and organization backed by a fully integrated DAM that serves as the backbone of the content supply chain?",
    capability: "asset_governance",
    tooltip:
      "Optimized: a fully integrated DAM connects all systems for seamless asset management and delivery.",
  },
  {
    id: 20,
    text: "To what extent is access to digital assets controlled through enforced, role-based permissions?",
    capability: "asset_governance",
    tooltip:
      "Optimized: enforced role-based access control integrated with identity and content systems.",
  },
  {
    id: 21,
    text: "To what extent is version control a formalized, optimized framework that integrates seamlessly with workflows and tools?",
    capability: "asset_governance",
    tooltip:
      "Optimized: fully optimized version control framework integrated with workflows, audit trails, and approval mechanisms.",
  },
  {
    id: 22,
    text: "To what extent are content components reused systematically — with predictive analytics identifying high-value reuse opportunities?",
    capability: "asset_governance",
    tooltip:
      "Optimized: predictive analytics identify high-value components for reuse across campaigns and channels.",
  },
  {
    id: 23,
    text: "To what extent are rights and usage for external assets managed through systems that scale with growth, emerging tech, and evolving needs?",
    capability: "asset_governance",
    tooltip:
      "Optimized: rights management adapts to future growth, emerging technologies, and evolving business needs.",
  },
  {
    id: 24,
    text: "To what extent are content archives accessible, with full historical versions and audit trails ensuring transparency and compliance?",
    capability: "asset_governance",
    tooltip:
      "Optimized: historical versions and audit trails are fully accessible, ensuring transparency and compliance.",
  },
  {
    id: 25,
    text: "To what extent are content compliance and legal requirements automated and embedded directly into workflows?",
    capability: "asset_governance",
    tooltip:
      "Optimized: compliance processes are automated and embedded into content workflows.",
  },
  {
    id: 26,
    text: "To what extent do content tagging and searchability leverage AI/ML to auto-categorize content based on taxonomy rules?",
    capability: "asset_governance",
    tooltip:
      "Optimized: AI/ML assists in auto-categorizing content based on taxonomy rules.",
  },
  {
    id: 27,
    text: "To what extent is content security governed through a fully optimized framework that integrates seamlessly with workflows and tools?",
    capability: "asset_governance",
    tooltip:
      "Optimized: fully optimized security and compliance framework integrated with workflows and tools.",
  },

  // ── Distribution & Activation (9) ─────────────────────────────────
  {
    id: 28,
    text: "To what extent is content distribution managed through real-time, cross-channel optimization?",
    capability: "distribution_activation",
    tooltip:
      "Optimized: real-time cross-channel optimization is in place across all distribution surfaces.",
  },
  {
    id: 29,
    text: "To what extent is content adapted for different channels through AI that predicts optimal channel mix and timing?",
    capability: "distribution_activation",
    tooltip:
      "Optimized: AI predicts optimal channel mix and delivery timing based on audience behavior and platform algorithms.",
  },
  {
    id: 30,
    text: "To what extent are campaign workflows managed through AI-driven orchestration that predicts bottlenecks and auto-allocates resources?",
    capability: "distribution_activation",
    tooltip:
      "Optimized: AI-driven campaign orchestration predicts bottlenecks and auto-allocates resources across channels.",
  },
  {
    id: 31,
    text: "To what extent does personalization deliver hyper-relevant experiences by proactively predicting user needs and preferences?",
    capability: "distribution_activation",
    tooltip:
      "Optimized: AI-driven personalization delivers hyper-relevant experiences by proactively predicting user needs and preferences.",
  },
  {
    id: 32,
    text: "To what extent is content testing informed by AI that predicts optimal variations and testing strategies?",
    capability: "distribution_activation",
    tooltip:
      "Optimized: AI predicts optimal variations and testing strategies using predictive analytics across channels.",
  },
  {
    id: 33,
    text: "To what extent are audiences mapped and segmented dynamically based on real-time data for content delivery?",
    capability: "distribution_activation",
    tooltip:
      "Optimized: enterprise-wide adoption of advanced audience mapping practices with dynamic segmentation based on real-time data.",
  },
  {
    id: 34,
    text: "To what extent does content scheduling use AI to predict optimal publishing times and channels?",
    capability: "distribution_activation",
    tooltip:
      "Optimized: AI predicts optimal publishing times and channels using audience digital patterns and competitor activity.",
  },
  {
    id: 35,
    text: "To what extent are audience insights used in distribution through continuous feedback loops and predictive modeling?",
    capability: "distribution_activation",
    tooltip:
      "Optimized: continuous feedback loops provide granular cross-channel performance data and refine delivery strategies using predictive modeling.",
  },
  {
    id: 36,
    text: "To what extent are creative and content tools connected to distribution tools through end-to-end AI-powered integration?",
    capability: "distribution_activation",
    tooltip:
      "Optimized: end-to-end AI-powered tools dynamically adapt content for channel-specific requirements across multiple markets.",
  },

  // ── Measurement & Insights (6) ────────────────────────────────────
  {
    id: 37,
    text: "To what extent is cross-channel content performance visualized through AI/ML dashboards that auto-generate customizable views?",
    capability: "measurement_insights",
    tooltip:
      "Optimized: AI/ML predicts emerging trends and auto-configures cross-channel dashboards by user role and preferences.",
  },
  {
    id: 38,
    text: "To what extent are content metrics aligned to business goals through an AI-integrated framework for objectives and goals?",
    capability: "measurement_insights",
    tooltip:
      "Optimized: enterprise-wide framework for objective and goal development integrated with advanced AI-powered tools.",
  },
  {
    id: 39,
    text: "To what extent is content performance reporting supported by AI-driven analytics and formal performance benchmarking practices?",
    capability: "measurement_insights",
    tooltip:
      "Optimized: enterprise-wide advanced performance benchmarking practices integrated with sophisticated, AI-driven analytics tools.",
  },
  {
    id: 40,
    text: "To what extent is content data quality assured through immutable audit trails that log models, training data, and predictions?",
    capability: "measurement_insights",
    tooltip:
      "Optimized: immutable audit trails log all models, training data, and predictions for transparency and bias mitigation.",
  },
  {
    id: 41,
    text: "To what extent are insights fed back into the content process through AI systems that autonomously generate actions?",
    capability: "measurement_insights",
    tooltip:
      "Optimized: AI-powered systems autonomously generate granular insights and prescribe actions.",
  },
  {
    id: 42,
    text: "To what extent are dashboards used to visualize content performance — ideally with AI-generated, role-based customization?",
    capability: "measurement_insights",
    tooltip:
      "Optimized: AI/ML dashboards auto-generate cross-channel customizable views based on user roles and preferences.",
  },

  // ── Intelligence & Automation (3) ─────────────────────────────────
  {
    id: 43,
    text: "To what extent does metadata support advanced capabilities such as personalized content delivery and predictive analytics?",
    capability: "intelligence_automation",
    tooltip:
      "Optimized: metadata supports capabilities such as personalized content delivery and predictive analytics.",
  },
  {
    id: 44,
    text: "To what extent does content search dynamically tailor results based on user behavior and preferences?",
    capability: "intelligence_automation",
    tooltip:
      "Optimized: dynamic personalization tailors content search results based on user behavior and preferences.",
  },
  {
    id: 45,
    text: "To what extent is automation — including AI-driven component combination — used to produce content at scale?",
    capability: "intelligence_automation",
    tooltip:
      "Optimized: AI predicts optimal component combinations based on real-time analytics to produce content at scale.",
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

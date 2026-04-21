import type {
  CscQuestion,
  CscIndustryQuestion,
  CscCapability,
} from "@/lib/csc/types";

export const CSC_CAPABILITY_LABELS: Record<CscCapability, string> = {
  strategy: "Strategy & Planning",
  creative: "Creative Development",
  production: "Production & Operations",
  intelligence: "Content Intelligence",
  asset_management: "Asset Management",
  activation: "Personalization & Activation",
  measurement: "Measurement & Optimization",
  operating_model: "Operating Model & AI",
};

export const CSC_CAPABILITY_SUBTITLES: Record<CscCapability, string> = {
  strategy: "Strategic Foundation",
  creative: "Ideation & Briefing",
  production: "Build Engine",
  intelligence: "Performance Signals",
  asset_management: "Asset Foundation",
  activation: "Delivery at Scale",
  measurement: "Feedback Loop",
  operating_model: "Organization & Enablement",
};

export const CSC_CAPABILITY_DESCRIPTIONS: Record<CscCapability, string> = {
  strategy:
    "Assess the extent to which content strategy is audience-led, portfolio-managed, and tightly connected to brand, media, and business goals.",
  creative:
    "Assess the extent to which creative ideation and briefing are designed for modular reuse, personalization, and cross-channel delivery.",
  production:
    "Assess the extent to which content production is automated, AI-augmented, and capable of generating variants at scale.",
  intelligence:
    "Assess the extent to which asset-level performance data, tagging, and audience signals are captured and used to guide decisions.",
  asset_management:
    "Assess the extent to which assets are discoverable, well-governed, rights-cleared, and easy to reuse, remix, and version.",
  activation:
    "Assess the extent to which content is dynamically assembled and activated in the moment across owned, earned, and paid channels.",
  measurement:
    "Assess whether the organization continuously improves content performance through attribution, experimentation, and feedback loops.",
  operating_model:
    "Assess whether teams, partners, AI tooling, and governance are aligned around a shared, always-on content supply chain.",
};

export const CSC_CAPABILITY_SCOPE_HINTS: Record<CscCapability, string> = {
  strategy:
    "These questions assess enterprise content strategy. Input from brand, marketing strategy, or content leadership may be helpful.",
  creative:
    "These questions assess how creative is briefed and ideated. Input from creative directors, strategy, or agency leads may be helpful.",
  production:
    "These questions assess content production operations. Input from studio leads, production operations, or MarTech/creative ops teams may be helpful.",
  intelligence:
    "These questions assess how content performance data flows. Input from analytics, measurement, or content intelligence teams may be helpful.",
  asset_management:
    "These questions assess DAM and content governance. Input from MarTech, DAM admins, or content operations may be helpful.",
  activation:
    "These questions assess cross-channel content activation. Consider input from CRM, channel owners, commerce, and media activation teams.",
  measurement:
    "These questions assess measurement and experimentation maturity. Input from marketing science, analytics, or effectiveness teams may be helpful.",
  operating_model:
    "These questions assess how content teams, partners, and AI are organized. Consider input from content operations, procurement, and capability leadership.",
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

// 30 core questions, ~4 per capability — mirrors the CRM altitude and "to what extent" framing.
export const CSC_CORE_QUESTIONS: CscQuestion[] = [
  // ── Strategy & Planning ───────────────────────────────────────────
  {
    id: 1,
    text: "To what extent is content strategy grounded in a shared understanding of audiences, jobs-to-be-done, and business outcomes?",
    capability: "strategy",
    tooltip:
      "Audience-led content strategy starts from what consumers need, not from a product launch calendar — and connects each content investment to a specific business outcome.",
  },
  {
    id: 2,
    text: "To what extent is content planned as a portfolio of always-on, lifecycle, and campaign content rather than one-off campaign bursts?",
    capability: "strategy",
    tooltip:
      "A portfolio view balances brand-building, lifecycle/nurture, and conversion content rather than defaulting to product-launch pushes.",
  },
  {
    id: 3,
    text: "To what extent are content briefs structured to capture audience, channel, variant, and personalization requirements up front?",
    capability: "strategy",
  },
  {
    id: 4,
    text: "To what extent are brand, media, CRM, and commerce priorities aligned on a single content plan rather than managed in parallel silos?",
    capability: "strategy",
  },

  // ── Creative Development ───────────────────────────────────────────
  {
    id: 5,
    text: "To what extent is content designed as modular, atomic components that can be reassembled across channels and variants?",
    capability: "creative",
    tooltip:
      "Modular content is built from reusable atoms — headlines, images, product blocks, calls-to-action — rather than monolithic channel-specific executions.",
  },
  {
    id: 6,
    text: "To what extent does the creative ideation process incorporate audience insight, performance learnings, and search/social intent data?",
    capability: "creative",
  },
  {
    id: 7,
    text: "To what extent do briefs intentionally plan for the number of variants, localizations, and channels the asset will need to support?",
    capability: "creative",
  },
  {
    id: 8,
    text: "To what extent do creative, strategy, media, and technology teams collaborate early enough in ideation to shape production-ready concepts?",
    capability: "creative",
  },

  // ── Production & Operations ────────────────────────────────────────
  {
    id: 9,
    text: "To what extent are production workflows standardized and templated so that similar asset types move through predictable, repeatable steps?",
    capability: "production",
  },
  {
    id: 10,
    text: "To what extent is generative AI used to accelerate copy, image, video, or layout production within brand and legal guardrails?",
    capability: "production",
    tooltip:
      "GenAI assistance spans first-draft copy, image variants, video cuts, layout automation, translations, and resizing — inside brand tone and legal compliance rails.",
  },
  {
    id: 11,
    text: "To what extent can the organization produce dozens or hundreds of compliant variants of a core asset without linear cost growth?",
    capability: "production",
  },
  {
    id: 12,
    text: "To what extent are review, approval, and legal sign-off steps integrated into the production workflow rather than bolted on after the fact?",
    capability: "production",
  },

  // ── Content Intelligence ───────────────────────────────────────────
  {
    id: 13,
    text: "To what extent is asset-level performance (impressions, engagement, conversion) captured and linked back to the source asset and brief?",
    capability: "intelligence",
    tooltip:
      "Asset-level intelligence connects a specific piece of content to its outcomes across channels — so reuse, retirement, and refresh decisions are data-driven.",
  },
  {
    id: 14,
    text: "To what extent are creative attributes (subject, tone, format, message, CTA) tagged consistently to enable pattern learning across assets?",
    capability: "intelligence",
  },
  {
    id: 15,
    text: "To what extent are real-time or near-real-time content signals used to trigger adjustments in delivery, spend, or creative rotation?",
    capability: "intelligence",
  },
  {
    id: 16,
    text: "To what extent are audience sentiment, search, and social signals fed into the content pipeline to shape what gets produced next?",
    capability: "intelligence",
  },

  // ── Asset Management ───────────────────────────────────────────────
  {
    id: 17,
    text: "To what extent is a digital asset management (DAM) system the single source of truth for approved assets across the organization?",
    capability: "asset_management",
    tooltip:
      "A DAM is the system of record for approved content — when fragmented, teams re-create, re-license, or ship off-brand assets because they cannot find what exists.",
  },
  {
    id: 18,
    text: "To what extent do assets carry consistent, enforced metadata (rights, usage, audience, channel, performance) that makes them discoverable and activatable?",
    capability: "asset_management",
  },
  {
    id: 19,
    text: "To what extent are rights, talent, and licensing terms tracked at the asset level so usage and expiration are automated rather than manual?",
    capability: "asset_management",
  },
  {
    id: 20,
    text: "To what extent are approved assets reused, remixed, and repurposed rather than rebuilt from scratch for each new channel or market?",
    capability: "asset_management",
  },

  // ── Personalization & Activation ───────────────────────────────────
  {
    id: 21,
    text: "To what extent is content assembled dynamically at the moment of delivery based on customer signals, segment, or context?",
    capability: "activation",
    tooltip:
      "Dynamic assembly composes an experience from modular atoms at send/render time — rather than pre-building every fixed variant in advance.",
  },
  {
    id: 22,
    text: "To what extent is the content supply chain integrated with CRM, CDP, and decisioning platforms so personalization logic can pull from a live content library?",
    capability: "activation",
  },
  {
    id: 23,
    text: "To what extent is channel-specific adaptation (format, aspect ratio, length, localization) automated rather than handled as manual rework?",
    capability: "activation",
  },

  // ── Measurement & Optimization ─────────────────────────────────────
  {
    id: 24,
    text: "To what extent is content performance attributed to business outcomes (revenue, retention, acquisition cost) rather than vanity engagement metrics?",
    capability: "measurement",
  },
  {
    id: 25,
    text: "To what extent do performance insights flow back into briefing, ideation, and production to improve the next wave of content?",
    capability: "measurement",
    tooltip:
      "The feedback loop turns measurement from a reporting exercise into a creative input — every wave of content starts from what the last wave learned.",
  },
  {
    id: 26,
    text: "To what extent are creative variants deliberately A/B tested and rotated based on lift rather than left to hit rates or opinion?",
    capability: "measurement",
  },

  // ── Operating Model & AI ───────────────────────────────────────────
  {
    id: 27,
    text: "To what extent are brand, creative, MarTech, data, and agency partners aligned around a shared content supply chain operating model?",
    capability: "operating_model",
  },
  {
    id: 28,
    text: "To what extent are content teams trained, tooled, and incentivized to use AI responsibly as part of their day-to-day workflow?",
    capability: "operating_model",
    tooltip:
      "Day-to-day AI adoption requires enablement, approved tooling, prompt libraries, and a working model that rewards — rather than penalizes — AI-accelerated output.",
  },
  {
    id: 29,
    text: "To what extent does the in-house + agency + technology partner model function as one integrated engine rather than as disconnected vendors?",
    capability: "operating_model",
  },
  {
    id: 30,
    text: "To what extent are governance, guardrails, and brand consistency maintained as content volume and AI usage scale up?",
    capability: "operating_model",
  },
];

export const CSC_CAPABILITIES_ORDER: CscCapability[] = [
  "strategy",
  "creative",
  "production",
  "intelligence",
  "asset_management",
  "activation",
  "measurement",
  "operating_model",
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

export const CSC_INDUSTRY_QUESTIONS: CscIndustryQuestion[] = [
  // Retail
  {
    id: "retail_1",
    text: "To what extent is product content (PDP copy, imagery, attributes) generated, localized, and optimized at SKU scale?",
    industry: "retail",
    capability: "production",
  },
  {
    id: "retail_2",
    text: "To what extent is content varied by life stage, household signal, or purchase pattern rather than treated as one audience?",
    industry: "retail",
    capability: "activation",
  },
  {
    id: "retail_3",
    text: "To what extent is seasonal and promotional content re-used and remixed across brand, retail media, and commerce surfaces?",
    industry: "retail",
    capability: "asset_management",
  },
  {
    id: "retail_4",
    text: "To what extent are category and occasion patterns used to shape always-on content rather than campaign bursts?",
    industry: "retail",
    capability: "strategy",
  },
  {
    id: "retail_5",
    text: "To what extent is retail media creative personalized, tested, and refreshed based on in-flight performance signals?",
    industry: "retail",
    capability: "measurement",
  },

  // QSR
  {
    id: "qsr_1",
    text: "To what extent is content tailored by daypart, occasion, and visit frequency rather than treated as a single audience?",
    industry: "qsr",
    capability: "activation",
  },
  {
    id: "qsr_2",
    text: "To what extent are local menu, offer, and market variants produced and kept in-sync at the store or region level?",
    industry: "qsr",
    capability: "production",
  },
  {
    id: "qsr_3",
    text: "To what extent is app, loyalty, and in-store content managed as one content portfolio rather than separate channel streams?",
    industry: "qsr",
    capability: "strategy",
  },
  {
    id: "qsr_4",
    text: "To what extent are LTO and promotional assets versioned, rights-tracked, and retired cleanly across markets?",
    industry: "qsr",
    capability: "asset_management",
  },
  {
    id: "qsr_5",
    text: "To what extent is user-generated and creator content integrated into the brand content supply chain?",
    industry: "qsr",
    capability: "creative",
  },

  // Financial Services
  {
    id: "fs_1",
    text: "To what extent is regulated content (disclosures, legal, rates) versioned, approved, and kept in-sync across every surface it appears on?",
    industry: "financial_services",
    capability: "asset_management",
  },
  {
    id: "fs_2",
    text: "To what extent is content differentiated by product set, life stage, and customer tenure rather than treated as one mass audience?",
    industry: "financial_services",
    capability: "activation",
  },
  {
    id: "fs_3",
    text: "To what extent is AI-assisted production used with compliance, legal, and risk guardrails built into the workflow?",
    industry: "financial_services",
    capability: "production",
  },
  {
    id: "fs_4",
    text: "To what extent is onboarding and cross-sell content driven by transaction and lifecycle signals rather than calendar cadence?",
    industry: "financial_services",
    capability: "intelligence",
  },
  {
    id: "fs_5",
    text: "To what extent are content assets tied to advice, education, and guidance journeys rather than only promotional messaging?",
    industry: "financial_services",
    capability: "strategy",
  },

  // Travel & Hospitality
  {
    id: "th_1",
    text: "To what extent is content personalized across the trip lifecycle — dream, plan, book, stay, share — rather than treated as a single moment?",
    industry: "travel_hospitality",
    capability: "activation",
  },
  {
    id: "th_2",
    text: "To what extent are local property, destination, and partner assets managed through one consistent content supply chain?",
    industry: "travel_hospitality",
    capability: "asset_management",
  },
  {
    id: "th_3",
    text: "To what extent are guest, creator, and review-generated assets integrated into owned brand content?",
    industry: "travel_hospitality",
    capability: "creative",
  },
  {
    id: "th_4",
    text: "To what extent are loyalty, tier, and recognition signals used to personalize content moments before, during, and after travel?",
    industry: "travel_hospitality",
    capability: "activation",
  },
  {
    id: "th_5",
    text: "To what extent is content performance tracked at the property, market, and experience level rather than aggregated to brand?",
    industry: "travel_hospitality",
    capability: "measurement",
  },

  // Automotive
  {
    id: "auto_1",
    text: "To what extent is vehicle content (configurator, launch, comparison) generated once and adapted at scale across markets and dealers?",
    industry: "automotive",
    capability: "production",
  },
  {
    id: "auto_2",
    text: "To what extent are OEM, dealer, and aftermarket content programs aligned on a shared supply chain and governance model?",
    industry: "automotive",
    capability: "operating_model",
  },
  {
    id: "auto_3",
    text: "To what extent is content aligned to the full vehicle lifecycle — research, purchase, service, loyalty, re-purchase?",
    industry: "automotive",
    capability: "strategy",
  },
  {
    id: "auto_4",
    text: "To what extent are connected-vehicle signals used to trigger personalized content (service, upgrades, engagement)?",
    industry: "automotive",
    capability: "intelligence",
  },
  {
    id: "auto_5",
    text: "To what extent are creator, community, and owner-generated assets integrated into the brand content ecosystem?",
    industry: "automotive",
    capability: "creative",
  },
];

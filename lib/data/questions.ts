import type {
  Question,
  IndustryQuestion,
  Capability,
  Industry,
  BusinessModel,
} from "@/lib/types";

export const BUSINESS_MODEL_LABELS: Record<BusinessModel, string> = {
  b2c: "B2C / Consumer",
  b2b: "B2B / Account-Based",
  b2b2c: "B2B2C",
  hybrid: "Hybrid (B2B + B2C)",
};

/**
 * Core question ids that also receive the B2B / account framing when the
 * business model is b2b2c or hybrid – the identity, decisioning,
 * technology, and organization questions, where account thinking applies
 * to any org with B2B motions. Pure b2b applies the framing to all 30.
 */
export const HYBRID_B2B_QUESTION_IDS: ReadonlySet<number> = new Set([
  1, 2, 3, 4, 8, 9, 10, 23, 24, 25, 26, 27, 28, 29, 30,
]);

/**
 * Resolves a question's display text for the assessment's business model
 * and industry. Resolution order: B2B/ABM model override → industry
 * override → default `text`. Every surface that renders question text –
 * chat prompt builder, score map, capability section, voice agent –
 * should route through this helper so the dynamic-text feature works
 * end-to-end.
 *
 * - b2b: uses byModel.b2b wherever present.
 * - b2b2c / hybrid: uses byModel.b2b only for the curated account-relevant
 *   subset (HYBRID_B2B_QUESTION_IDS); other questions keep consumer wording.
 * - b2c / unset: never uses the model override.
 */
export function resolveQuestionText(
  q: {
    id?: number | string;
    text: string;
    byIndustry?: Partial<Record<Industry, string>>;
    byModel?: Partial<Record<BusinessModel, string>>;
  },
  industry: Industry | null | undefined,
  businessModel?: BusinessModel | null
): string {
  const wantsB2b =
    businessModel === "b2b" ||
    ((businessModel === "b2b2c" || businessModel === "hybrid") &&
      typeof q.id === "number" &&
      HYBRID_B2B_QUESTION_IDS.has(q.id));
  if (wantsB2b && q.byModel?.b2b) {
    return q.byModel.b2b;
  }
  if (industry && q.byIndustry?.[industry]) {
    return q.byIndustry[industry] as string;
  }
  return q.text;
}

export const CAPABILITY_LABELS: Record<string, string> = {
  identity: "Identity",
  signals: "Signals",
  decisioning: "Decisioning",
  engagement: "Engagement",
  media_activation: "Media Activation",
  learning_optimization: "Learning & Optimization",
  technology: "Technology",
  organization: "Organization & Process",
};

export const CAPABILITY_SUBTITLES: Record<string, string> = {
  identity: "Customer Recognition",
  signals: "Customer Understanding",
  decisioning: "Next Best Action",
  engagement: "Experience Delivery",
  media_activation: "Growth Engine",
  learning_optimization: "Feedback Loop",
  technology: "Value Realization",
  organization: "Operating Model",
};

export const CAPABILITY_DESCRIPTIONS: Record<string, string> = {
  identity:
    "Assess the extent to which the organization can recognize and connect customers across interactions.",
  signals:
    "Assess the extent to which the organization can capture behavioral signals and connect them to customer profiles.",
  decisioning:
    "Assess the extent to which the organization can determine the most relevant interaction for each customer.",
  engagement:
    "Understand the extent to which the organization can activate personalized engagement across channels.",
  media_activation:
    "Assess the extent to which first-party customer signals are used to improve media performance and acquisition.",
  learning_optimization:
    "Assess whether the organization continuously improves engagement and media strategies through data and experimentation.",
  technology:
    "Assess the extent to which the technology stack enables seamless data flow, modular integration, and rapid deployment of new CRM capabilities.",
  organization:
    "Assess whether teams, processes, and governance are aligned around shared customer outcomes and cross-functional collaboration.",
};

export const CAPABILITY_SCOPE_HINTS: Record<string, string> = {
  identity:
    "These questions assess enterprise-wide identity capabilities. You may need input from your data engineering or customer data platform (CDP) team.",
  signals:
    "These questions assess how behavioral data flows into customer profiles. Input from data engineering or marketing technology teams may be helpful.",
  decisioning:
    "These questions assess analytical and AI-driven capabilities. Input from analytics, data science, or marketing operations teams may be helpful.",
  engagement:
    "These questions assess cross-channel execution capabilities. Consider the full scope of owned channel operations across teams.",
  media_activation:
    "These questions assess how CRM data informs media strategy. Input from media planning or performance marketing teams may be helpful.",
  learning_optimization:
    "These questions assess experimentation and measurement maturity. Input from analytics or marketing science teams may be helpful.",
  technology:
    "These questions assess the technology foundation. Input from IT, engineering, or platform operations teams may be needed.",
  organization:
    "These questions assess organizational alignment and operating model. Consider how teams collaborate across CRM, loyalty, media, and service functions.",
};

export const SCORE_LABELS: Record<number, string> = {
  1: "Not in Place",
  2: "Emerging",
  3: "Operational",
  4: "Integrated",
  5: "Optimized",
};

export const SCORE_DESCRIPTIONS: Record<number, string> = {
  1: "Capability does not exist or is highly fragmented with no formal process.",
  2: "Limited pilots or isolated capabilities exist but are not consistently applied.",
  3: "Capability is in use and operational but not consistently integrated across teams or channels.",
  4: "Capability operates across teams and channels with clear governance and coordination.",
  5: "Capability is fully orchestrated, continuously improved through data and experimentation, and drives measurable outcomes.",
};

export const CORE_QUESTIONS: Question[] = [
  // Identity
  {
    id: 1,
    text: "To what extent does the organization maintain a unified customer profile across channels and touchpoints?",
    capability: "identity",
    byModel: {
      b2b: "To what extent does the organization maintain a unified account record – combining firmographic, technographic, relationship, and engagement data with individual buyer data – accessible across marketing, sales, and customer success?",
    },
    tooltip: "A unified customer profile is a single, persistent record that connects all known data about a customer – purchases, interactions, preferences, and identifiers – across every channel and touchpoint.",
  },
  {
    id: 2,
    text: "To what extent can the organization recognize the same customer across digital, mobile, in-store, and service interactions?",
    capability: "identity",
    byModel: {
      b2b: "To what extent can the organization identify and connect contacts across digital, event, sales outreach, partner, and service interactions to build a complete account-level view?",
    },
  },
  {
    id: 3,
    text: "To what extent are households, joint accounts, related parties, or other customer relationships (family members, gift buyers, account beneficiaries, fleet relationships) identified and connected?",
    capability: "identity",
    byModel: {
      b2b: "To what extent are buying groups (economic buyers, champions, technical evaluators, and end-user influencers) identified and tracked at the account level?",
    },
    byIndustry: {
      retail:
        "To what extent are households, family members, and gift buyers identified and connected – so a single member's purchase, return, or loyalty activity links cleanly to the rest of the household?",
      qsr:
        "To what extent are households and family or group dining patterns identified and connected – so app, loyalty, and order activity rolls up to a household view rather than treating each member as a separate guest?",
      financial_services:
        "To what extent are joint accounts, household balances, account beneficiaries, and authorised users identified and connected – so the whole financial relationship is visible across products and channels?",
      travel_hospitality:
        "To what extent are households, travelling parties, and group bookings identified and connected – so loyalty status, preferences, and history span every guest in the relationship rather than the booker alone?",
      automotive:
        "To what extent are households, multi-vehicle owners, fleet relationships, and authorised drivers identified and connected – so the full vehicle relationship is visible across sales, service, and engagement?",
    },
  },
  {
    id: 4,
    text: "To what extent is customer identity and data shared consistently across organizational divisions and business units?",
    capability: "identity",
    byModel: {
      b2b: "To what extent is a common view of account readiness, risk, and opportunity shared across the organization, including different divisions or business units?",
    },
  },
  // Signals
  {
    id: 5,
    text: "To what extent are behavioral intent signals such as purchase, browsing, engagement, or usage captured and connected to customer profiles?",
    capability: "signals",
    byModel: {
      b2b: "To what extent are behavioral intent signals (web engagement, content consumption, product usage, event attendance, and sales activity) captured and connected to account records?",
    },
    tooltip: "Behavioral intent signals are actions a customer takes – page views, cart activity, email opens, app sessions, store visits – that indicate interest or readiness to engage.",
  },
  {
    id: 6,
    text: "To what extent are real-time or near-real-time signals used to trigger engagement or messaging?",
    capability: "signals",
    byModel: {
      b2b: "To what extent are real-time or near-real-time signals used to trigger marketing engagement or coordinated sales outreach?",
    },
    tooltip: "Real-time signals are captured and available for activation within minutes, rather than in batch processes that run daily or weekly.",
  },
  {
    id: 7,
    text: "To what extent are customer lifecycle or milestone signals identified and used to guide engagement strategies?",
    capability: "signals",
    byModel: {
      b2b: "To what extent are pipeline-stage progression, contract milestones, and renewal or expansion signals identified and used to trigger engagement strategies?",
    },
    tooltip: "Lifecycle signals include events like onboarding completion, anniversary dates, lapse risk indicators, tier changes, or renewal windows.",
  },
  // Decisioning
  {
    id: 8,
    text: "To what extent are segmentation or predictive models used to guide engagement strategies?",
    capability: "decisioning",
    byModel: {
      b2b: "To what extent are segmentation and account-scoring models (combining ICP fit, intent signals, and engagement depth) used to prioritize accounts and guide resource allocation across marketing and sales?",
    },
    tooltip: "Predictive models are statistical or machine learning models that estimate the likelihood of future customer behavior – such as purchase propensity, churn risk, or lifetime value.",
  },
  {
    id: 9,
    text: "To what extent are next-best-actions determined dynamically based on customer behavior or context?",
    capability: "decisioning",
    byModel: {
      b2b: "To what extent are next-best-actions determined based on account stage, buyer behaviors, buying-group coverage, and intent signals – and coordinated across marketing, SDR, and sales?",
    },
    tooltip: "Next-best-action (NBA) is a decisioning approach where the system determines the most relevant message, offer, or experience for each customer based on their current context, history, and behavior.",
  },
  {
    id: 10,
    text: "To what extent are decisioning rules or prioritization logic used to coordinate offers, messages, and experiences?",
    capability: "decisioning",
    byModel: {
      b2b: "To what extent are decisioning rules used to assign ABM tiers (1:1, 1:few, 1:many) and coordinate the right play, content, and coverage model across functions?",
    },
  },
  // Engagement / Orchestration
  {
    id: 11,
    text: "To what extent are customer journeys orchestrated across channels such as email, mobile, app, web, physical locations (store, branch, property, dealership), and service?",
    capability: "engagement",
    byModel: {
      b2b: "To what extent are buyer and account journeys orchestrated across email, web personalization, events, direct mail, SDR outreach, and partner channels?",
    },
    tooltip: "Orchestration means channels are coordinated so each interaction builds on the last – rather than operating independently in silos with separate strategies. Physical channels include whatever in-person environment the industry uses: stores for retail, branches for financial services, properties for hospitality, dealerships for automotive.",
    byIndustry: {
      retail:
        "To what extent are customer journeys orchestrated across channels such as email, mobile, app, web, store, and service?",
      qsr:
        "To what extent are customer journeys orchestrated across channels such as email, mobile, app, web, in-restaurant, drive-thru, and service?",
      financial_services:
        "To what extent are customer journeys orchestrated across channels such as email, mobile, app, web, branch, contact center, and service?",
      travel_hospitality:
        "To what extent are guest journeys orchestrated across channels such as email, mobile, app, web, on-property, and service – covering pre-trip, on-trip, and post-trip moments?",
      automotive:
        "To what extent are customer journeys orchestrated across channels such as email, mobile, app, web, dealership, and service – across sales, ownership, and re-purchase?",
    },
  },
  {
    id: 12,
    text: "To what extent are loyalty or recognition programs integrated with CRM engagement strategies?",
    capability: "engagement",
    byModel: {
      b2b: "To what extent are retention and expansion programs integrated with CRM engagement strategies to drive renewal, upsell, and cross-sell motions?",
    },
    tooltip: "This includes traditional loyalty tiers as well as modern recognition models – value exchange, experiential rewards, personalized benefits, and non-transactional engagement mechanics.",
  },
  {
    id: 13,
    text: "To what extent are promotions or offers personalized using behavioral signals rather than broadly distributed?",
    capability: "engagement",
    byModel: {
      b2b: "To what extent are content, proposals, and outreach personalized by buying stage, persona, and account context – rather than generic messaging across the book of business?",
    },
  },
  {
    id: 14,
    text: "To what extent are customer service interactions connected to loyalty or CRM engagement strategies?",
    capability: "engagement",
    byModel: {
      b2b: "To what extent are customer success interactions connected to account engagement strategies – surfacing expansion signals and informing renewal plays?",
    },
  },
  {
    id: 15,
    text: "To what extent are dynamic content or personalized experiences assembled in real time based on customer signals and context?",
    capability: "engagement",
    byModel: {
      b2b: "To what extent are dynamic content or personalized experiences assembled based on account fit, intent stage, and buyer persona – across web, email, and sales-facing materials?",
    },
  },
  // Media Activation
  {
    id: 16,
    text: "To what extent is first-party customer data used to inform paid media targeting?",
    capability: "media_activation",
    byModel: {
      b2b: "To what extent is first-party account and contact data used to inform ABM media targeting – prioritizing accounts by ICP fit and intent stage across programmatic, LinkedIn, and display?",
    },
  },
  {
    id: 17,
    text: "To what extent do CRM or loyalty signals create high-value audiences for media activation?",
    capability: "media_activation",
    byModel: {
      b2b: "To what extent are target-account lists and buying-group personas activated as audiences across paid media (display, social, CTV) and personalized site experiences?",
    },
  },
  {
    id: 18,
    text: "To what extent are paid media campaigns designed to drive owned relationship growth such as app adoption, loyalty enrollment, or profile completion?",
    capability: "media_activation",
    byModel: {
      b2b: "To what extent are paid media campaigns designed to accelerate pipeline – driving event registrations, content engagement, and meeting bookings with target accounts?",
    },
  },
  // Learning & Optimization
  {
    id: 19,
    text: "To what extent are experiments or test-and-learn programs used to improve engagement strategies?",
    capability: "learning_optimization",
    byModel: {
      b2b: "To what extent are experiments or test-and-learn programs used to improve account engagement strategies?",
    },
  },
  {
    id: 20,
    text: "To what extent are media performance insights fed back into CRM engagement strategies?",
    capability: "learning_optimization",
    byModel: {
      b2b: "To what extent are media performance insights fed back into CRM and account engagement strategies?",
    },
  },
  {
    id: 21,
    text: "To what extent does the organization measure incremental lift from loyalty, promotions, offers, incentives, and messaging programs?",
    capability: "learning_optimization",
    byModel: {
      b2b: "To what extent does the organization measure pipeline influence, revenue attribution, and incremental lift from ABM programs – including multi-touch attribution across marketing and sales?",
    },
    tooltip: "Incremental lift measures the true causal impact of a program – the additional revenue or engagement that would not have occurred without the intervention, beyond what customers would have done anyway. Programs include traditional loyalty and promotions for retail / QSR / travel, as well as rate offers and fee incentives for financial services, and trade-in / lease incentives for automotive.",
    byIndustry: {
      retail:
        "To what extent does the organization measure incremental lift from loyalty, promotions, and messaging programs?",
      qsr:
        "To what extent does the organization measure incremental lift from loyalty, LTOs, promotions, and messaging programs?",
      financial_services:
        "To what extent does the organization measure incremental lift from rate offers, fee incentives, account-opening offers, and engagement messaging?",
      travel_hospitality:
        "To what extent does the organization measure incremental lift from loyalty, status benefits, package offers, and messaging programs?",
      automotive:
        "To what extent does the organization measure incremental lift from trade-in offers, lease incentives, service offers, and engagement messaging?",
    },
  },
  {
    id: 22,
    text: "To what extent are customer insights used to refine segmentation, journeys, and targeting strategies?",
    capability: "learning_optimization",
    byModel: {
      b2b: "To what extent are account and buyer insights used to refine ICP definitions, account-tier models, and targeting strategies – incorporating win/loss patterns and sales feedback?",
    },
  },
  // Technology Value Realization
  {
    id: 23,
    text: "To what extent is the organization's technology stack architected to enable seamless data flow across CRM, loyalty, media, service, and commerce systems?",
    capability: "technology",
    byModel: {
      b2b: "To what extent is the technology stack architected to enable seamless data flow across CRM, marketing automation, ABM platform, intent data, sales intelligence, and customer success systems?",
    },
  },
  {
    id: 24,
    text: "To what extent can the organization deploy new use cases (e.g., journeys, loyalty experiences, triggers, integrations) without significant engineering effort or delays?",
    capability: "technology",
    byModel: {
      b2b: "To what extent can the organization deploy new use cases (account journeys, sales-play triggers, intent-based campaigns, ABM tier logic) without significant engineering effort or delays?",
    },
  },
  {
    id: 25,
    text: "To what extent does the current technology stack support modular integration with external platforms, including loyalty, decisioning, and media ecosystems?",
    capability: "technology",
    byModel: {
      b2b: "To what extent does the technology stack support modular integration with ABM platforms (6sense, Demandbase), intent data providers (Bombora), sales intelligence tools (ZoomInfo, LinkedIn Sales Navigator), decisioning, and media ecosystems?",
    },
  },
  {
    id: 26,
    text: "To what extent does the organization maintain data quality, governance, and consistency across customer, loyalty, and engagement systems?",
    capability: "technology",
    byModel: {
      b2b: "To what extent does the organization maintain data quality and governance across account records – including deduplication, account-hierarchy management, contact-to-account association, and firmographic enrichment?",
    },
  },
  // Organization & Process
  {
    id: 27,
    text: "To what extent are teams aligned around shared customer and business outcomes (e.g., lifetime value, loyalty engagement, retention) rather than channel-specific goals?",
    capability: "organization",
    byModel: {
      b2b: "To what extent are teams aligned around shared account and revenue outcomes (pipeline contribution, win rate, net revenue retention, expansion ARR) rather than channel- or function-specific goals?",
    },
  },
  {
    id: 28,
    text: "To what extent are ownership and accountability clearly defined for end-to-end customer experience, including loyalty, across marketing, media, and service functions?",
    capability: "organization",
    byModel: {
      b2b: "To what extent are ownership and accountability clearly defined for the end-to-end account experience – including who owns ABM strategy, account planning, and the cross-sell and expansion motion across marketing, sales, and customer success?",
    },
  },
  {
    id: 29,
    text: "To what extent does the organization operate with cross-functional collaboration models (e.g., pods or squads) that integrate CRM, loyalty, media, and service teams?",
    capability: "organization",
    byModel: {
      b2b: "To what extent does the organization operate with ABM pods or revenue squads that integrate marketing, SDR/BDR, sales, and customer success around named accounts and shared account plans?",
    },
  },
  {
    id: 30,
    text: "To what extent are data, analytics, and marketing teams integrated to support decisioning, loyalty strategy, and ongoing optimization?",
    capability: "organization",
    byModel: {
      b2b: "To what extent are revenue operations, data/analytics, and marketing teams integrated to support account intelligence, pipeline management, and ongoing ICP and segmentation optimization?",
    },
  },
];

export const CAPABILITIES_ORDER: Capability[] = [
  "identity",
  "signals",
  "decisioning",
  "engagement",
  "media_activation",
  "learning_optimization",
  "technology",
  "organization",
];

export const QUESTIONS_BY_CAPABILITY: Record<Capability, Question[]> =
  CAPABILITIES_ORDER.reduce(
    (acc, cap) => {
      acc[cap] = CORE_QUESTIONS.filter((q) => q.capability === cap);
      return acc;
    },
    {} as Record<Capability, Question[]>
  );

export const INDUSTRY_LABELS: Record<string, string> = {
  retail: "Retail / Commerce",
  qsr: "Quick Service / Fast Casual",
  financial_services: "Financial Services",
  travel_hospitality: "Travel & Hospitality",
  automotive: "Automotive / Mobility",
};

export const INDUSTRY_QUESTIONS: IndustryQuestion[] = [
  // Retail
  {
    id: "retail_1",
    text: "To what extent are households or family relationships identified and activated in marketing?",
    industry: "retail",
    capability: "identity",
  },
  {
    id: "retail_2",
    text: "To what extent are life-stage signals used to personalize messaging and offers?",
    industry: "retail",
    capability: "signals",
  },
  {
    id: "retail_3",
    text: "To what extent are category purchase patterns used to anticipate next purchase needs?",
    industry: "retail",
    capability: "decisioning",
  },
  {
    id: "retail_4",
    text: "To what extent are loyalty signals used to reduce blanket discounting?",
    industry: "retail",
    capability: "engagement",
  },
  {
    id: "retail_5",
    text: "To what extent are gift buyers or secondary purchasers identified and engaged?",
    industry: "retail",
    capability: "identity",
  },
  // QSR
  {
    id: "qsr_1",
    text: "To what extent are visit frequency patterns used to trigger personalized engagement?",
    industry: "qsr",
    capability: "signals",
  },
  {
    id: "qsr_2",
    text: "To what extent are daypart behaviors used to drive cross-occasion growth?",
    industry: "qsr",
    capability: "signals",
  },
  {
    id: "qsr_3",
    text: "To what extent are loyalty signals used to optimize offers instead of blanket promotions?",
    industry: "qsr",
    capability: "engagement",
  },
  {
    id: "qsr_4",
    text: "To what extent does CRM support migration from third-party delivery platforms to first-party ordering?",
    industry: "qsr",
    capability: "engagement",
  },
  {
    id: "qsr_5",
    text: "To what extent are location and proximity signals used to trigger engagement?",
    industry: "qsr",
    capability: "signals",
  },
  // Financial Services
  {
    id: "fs_1",
    text: "To what extent are onboarding journeys designed to drive early product activation?",
    industry: "financial_services",
    capability: "engagement",
  },
  {
    id: "fs_2",
    text: "To what extent are transaction signals used to identify cross-sell opportunities?",
    industry: "financial_services",
    capability: "signals",
  },
  {
    id: "fs_3",
    text: "To what extent are CRM and loyalty strategies used to increase product utilization?",
    industry: "financial_services",
    capability: "engagement",
  },
  {
    id: "fs_4",
    text: "To what extent are customer service interactions integrated into relationship engagement strategies?",
    industry: "financial_services",
    capability: "engagement",
  },
  {
    id: "fs_5",
    text: "To what extent are lifecycle events used to trigger financial guidance or engagement?",
    industry: "financial_services",
    capability: "signals",
  },
  // Travel & Hospitality
  {
    id: "th_1",
    text: "To what extent are travel intent signals used to trigger engagement or offers?",
    industry: "travel_hospitality",
    capability: "signals",
  },
  {
    id: "th_2",
    text: "To what extent are recognition and value exchange programs used to personalize guest experiences beyond transactional rewards?",
    industry: "travel_hospitality",
    capability: "engagement",
    tooltip: "This includes traditional loyalty tiers as well as modern recognition models – experiential rewards, personalized service, status-based perks, and non-transactional engagement.",
  },
  {
    id: "th_3",
    text: "To what extent are service recovery moments integrated with loyalty gestures?",
    industry: "travel_hospitality",
    capability: "engagement",
  },
  {
    id: "th_4",
    text: "To what extent are trip milestones used to drive engagement before, during, and after travel?",
    industry: "travel_hospitality",
    capability: "signals",
  },
  {
    id: "th_5",
    text: "To what extent are ancillary revenue opportunities personalized using customer signals?",
    industry: "travel_hospitality",
    capability: "decisioning",
    tooltip: "Ancillary revenue refers to revenue from additional products and services beyond the core offering – such as upgrades, add-ons, experiences, and partner offers.",
  },
  // Automotive
  {
    id: "auto_1",
    text: "To what extent are vehicle lifecycle milestones used to trigger engagement?",
    industry: "automotive",
    capability: "signals",
  },
  {
    id: "auto_2",
    text: "To what extent are connected vehicle signals integrated into CRM engagement strategies?",
    industry: "automotive",
    capability: "signals",
  },
  {
    id: "auto_3",
    text: "To what extent are service interactions used to strengthen the customer relationship?",
    industry: "automotive",
    capability: "engagement",
  },
  {
    id: "auto_4",
    text: "To what extent are loyalty or engagement programs used to drive participation in the broader brand ecosystem?",
    industry: "automotive",
    capability: "engagement",
  },
  {
    id: "auto_5",
    text: "To what extent does CRM extend beyond purchase to support ongoing brand engagement?",
    industry: "automotive",
    capability: "engagement",
  },
];

import type { Question, IndustryQuestion, Capability } from "@/lib/types";

export const CAPABILITY_LABELS: Record<string, string> = {
  identity: "Identity",
  signals: "Signals",
  decisioning: "Decisioning",
  engagement: "Engagement",
  media_activation: "Media Activation",
  learning_optimization: "Learning & Optimization",
};

export const CAPABILITY_SUBTITLES: Record<string, string> = {
  identity: "Customer Recognition",
  signals: "Customer Understanding",
  decisioning: "Next Best Action",
  engagement: "Experience Delivery",
  media_activation: "Growth Engine",
  learning_optimization: "Feedback Loop",
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
    tooltip: "A unified customer profile is a single, persistent record that connects all known data about a customer — purchases, interactions, preferences, and identifiers — across every channel and touchpoint.",
  },
  {
    id: 2,
    text: "To what extent can the organization recognize the same customer across digital, mobile, in-store, and service interactions?",
    capability: "identity",
  },
  {
    id: 3,
    text: "To what extent are households or customer relationships (family members, shared accounts, gift buyers) identified and connected?",
    capability: "identity",
  },
  {
    id: 4,
    text: "To what extent is customer identity and data shared consistently across organizational divisions and business units?",
    capability: "identity",
  },
  // Signals
  {
    id: 5,
    text: "To what extent are behavioral intent signals such as purchase, browsing, engagement, or usage captured and connected to customer profiles?",
    capability: "signals",
    tooltip: "Behavioral intent signals are actions a customer takes — page views, cart activity, email opens, app sessions, store visits — that indicate interest or readiness to engage.",
  },
  {
    id: 6,
    text: "To what extent are real-time or near-real-time signals used to trigger engagement or messaging?",
    capability: "signals",
    tooltip: "Real-time signals are captured and available for activation within minutes, rather than in batch processes that run daily or weekly.",
  },
  {
    id: 7,
    text: "To what extent are customer lifecycle or milestone signals identified and used to guide engagement strategies?",
    capability: "signals",
    tooltip: "Lifecycle signals include events like onboarding completion, anniversary dates, lapse risk indicators, tier changes, or renewal windows.",
  },
  // Decisioning
  {
    id: 8,
    text: "To what extent are segmentation or predictive models used to guide engagement strategies?",
    capability: "decisioning",
    tooltip: "Predictive models are statistical or machine learning models that estimate the likelihood of future customer behavior — such as purchase propensity, churn risk, or lifetime value.",
  },
  {
    id: 9,
    text: "To what extent are next-best-actions determined dynamically based on customer behavior or context?",
    capability: "decisioning",
    tooltip: "Next-best-action (NBA) is a decisioning approach where the system determines the most relevant message, offer, or experience for each customer based on their current context, history, and behavior.",
  },
  {
    id: 10,
    text: "To what extent are decisioning rules or prioritization logic used to coordinate offers, messages, and experiences?",
    capability: "decisioning",
  },
  // Engagement / Orchestration
  {
    id: 11,
    text: "To what extent are customer journeys orchestrated across channels such as email, mobile, app, web, store, and service?",
    capability: "engagement",
    tooltip: "Orchestration means channels are coordinated so each interaction builds on the last — rather than operating independently in silos with separate strategies.",
  },
  {
    id: 12,
    text: "To what extent are loyalty or recognition programs integrated with CRM engagement strategies?",
    capability: "engagement",
    tooltip: "This includes traditional loyalty tiers as well as modern recognition models — value exchange, experiential rewards, personalized benefits, and non-transactional engagement mechanics.",
  },
  {
    id: 13,
    text: "To what extent are promotions or offers personalized using behavioral signals rather than broadly distributed?",
    capability: "engagement",
  },
  {
    id: 14,
    text: "To what extent are customer service interactions connected to loyalty or CRM engagement strategies?",
    capability: "engagement",
  },
  {
    id: 15,
    text: "To what extent are dynamic content or personalized experiences assembled in real time based on customer signals and context?",
    capability: "engagement",
  },
  // Media Activation
  {
    id: 16,
    text: "To what extent is first-party customer data used to inform paid media targeting?",
    capability: "media_activation",
  },
  {
    id: 17,
    text: "To what extent do CRM or loyalty signals create high-value audiences for media activation?",
    capability: "media_activation",
  },
  {
    id: 18,
    text: "To what extent are paid media campaigns designed to drive owned relationship growth such as app adoption, loyalty enrollment, or profile completion?",
    capability: "media_activation",
  },
  // Learning & Optimization
  {
    id: 19,
    text: "To what extent are experiments or test-and-learn programs used to improve engagement strategies?",
    capability: "learning_optimization",
  },
  {
    id: 20,
    text: "To what extent are media performance insights fed back into CRM engagement strategies?",
    capability: "learning_optimization",
  },
  {
    id: 21,
    text: "To what extent does the organization measure incremental lift from loyalty, promotions, and messaging programs?",
    capability: "learning_optimization",
    tooltip: "Incremental lift measures the true causal impact of a program — the additional revenue or engagement that would not have occurred without the intervention, beyond what customers would have done anyway.",
  },
  {
    id: 22,
    text: "To what extent are customer insights used to refine segmentation, journeys, and targeting strategies?",
    capability: "learning_optimization",
  },
];

export const CAPABILITIES_ORDER: Capability[] = [
  "identity",
  "signals",
  "decisioning",
  "engagement",
  "media_activation",
  "learning_optimization",
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
    tooltip: "This includes traditional loyalty tiers as well as modern recognition models — experiential rewards, personalized service, status-based perks, and non-transactional engagement.",
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
    tooltip: "Ancillary revenue refers to revenue from additional products and services beyond the core offering — such as upgrades, add-ons, experiences, and partner offers.",
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

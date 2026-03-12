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

export const SCORE_LABELS: Record<number, string> = {
  1: "Not in Place",
  2: "Emerging",
  3: "Operational",
  4: "Integrated",
  5: "Optimized",
};

export const SCORE_DESCRIPTIONS: Record<number, string> = {
  1: "Capability does not exist or is highly fragmented.",
  2: "Limited pilots or isolated capabilities exist.",
  3: "Capability is in use but not consistently integrated.",
  4: "Capability operates across teams and channels.",
  5: "Capability is orchestrated and continuously improved through data and experimentation.",
};

export const CORE_QUESTIONS: Question[] = [
  // Identity
  {
    id: 1,
    text: "To what extent does the organization maintain a unified customer profile across channels and touchpoints?",
    capability: "identity",
  },
  {
    id: 2,
    text: "How effectively can the organization recognize the same customer across digital, mobile, in-store, and service interactions?",
    capability: "identity",
  },
  {
    id: 3,
    text: "To what extent are households or customer relationships (family members, shared accounts, gift buyers) identified and connected?",
    capability: "identity",
  },
  {
    id: 4,
    text: "Is a common view of readiness, risk, and opportunity shared across the organization, including different divisions or business units?",
    capability: "identity",
  },
  // Signals
  {
    id: 5,
    text: "How effectively are behavioral intent signals such as purchase, browsing, engagement, or usage captured and connected to customer profiles?",
    capability: "signals",
  },
  {
    id: 6,
    text: "To what extent are real-time or near-real-time signals used to trigger engagement or messaging?",
    capability: "signals",
  },
  {
    id: 7,
    text: "How effectively are customer lifecycle or milestone signals identified and used to guide engagement strategies?",
    capability: "signals",
  },
  // Decisioning
  {
    id: 8,
    text: "To what extent are segmentation or predictive models used to guide engagement strategies?",
    capability: "decisioning",
  },
  {
    id: 9,
    text: "How effectively are next-best-actions determined dynamically based on customer behavior or context?",
    capability: "decisioning",
  },
  {
    id: 10,
    text: "To what extent are decisioning rules or prioritization logic used to coordinate offers, messages, and experiences?",
    capability: "decisioning",
  },
  // Engagement / Orchestration
  {
    id: 11,
    text: "How effectively are customer journeys orchestrated across channels such as email, mobile, app, web, store, and service?",
    capability: "engagement",
  },
  {
    id: 12,
    text: "To what extent are loyalty programs integrated with CRM engagement strategies?",
    capability: "engagement",
  },
  {
    id: 13,
    text: "How effectively are promotions or offers personalized using behavioral signals rather than broadly distributed?",
    capability: "engagement",
  },
  {
    id: 14,
    text: "To what extent are customer service interactions connected to loyalty or CRM engagement strategies?",
    capability: "engagement",
  },
  {
    id: 15,
    text: "How effectively are dynamic content or personalized experiences assembled in real time based on customer signals and context?",
    capability: "engagement",
  },
  // Media Activation
  {
    id: 16,
    text: "How effectively is first-party customer data used to inform paid media targeting?",
    capability: "media_activation",
  },
  {
    id: 17,
    text: "To what extent do CRM or loyalty signals create high-value audiences for media activation?",
    capability: "media_activation",
  },
  {
    id: 18,
    text: "How effectively are paid media campaigns designed to drive owned relationship growth such as app adoption, loyalty enrollment, or profile completion?",
    capability: "media_activation",
  },
  // Learning & Optimization
  {
    id: 19,
    text: "How consistently are experiments or test-and-learn programs used to improve engagement strategies?",
    capability: "learning_optimization",
  },
  {
    id: 20,
    text: "To what extent are media performance insights fed back into CRM engagement strategies?",
    capability: "learning_optimization",
  },
  {
    id: 21,
    text: "How effectively does the organization measure incremental lift from loyalty, promotions, and messaging programs?",
    capability: "learning_optimization",
  },
  {
    id: 22,
    text: "How consistently are customer insights used to refine segmentation, journeys, and targeting strategies?",
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
    text: "How effectively are households or family relationships identified and activated in marketing?",
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
    text: "How effectively are category purchase patterns used to anticipate next purchase needs?",
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
    text: "How effectively are gift buyers or secondary purchasers identified and engaged?",
    industry: "retail",
    capability: "identity",
  },
  // QSR
  {
    id: "qsr_1",
    text: "How effectively are visit frequency patterns used to trigger personalized engagement?",
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
    text: "How effectively are loyalty signals used to optimize offers instead of blanket promotions?",
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
    text: "How effectively are location and proximity signals used to trigger engagement?",
    industry: "qsr",
    capability: "signals",
  },
  // Financial Services
  {
    id: "fs_1",
    text: "How effectively are onboarding journeys designed to drive early product activation?",
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
    text: "How effectively are CRM and loyalty strategies used to increase product utilization?",
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
    text: "How effectively are lifecycle events used to trigger financial guidance or engagement?",
    industry: "financial_services",
    capability: "signals",
  },
  // Travel & Hospitality
  {
    id: "th_1",
    text: "How effectively are travel intent signals used to trigger engagement or offers?",
    industry: "travel_hospitality",
    capability: "signals",
  },
  {
    id: "th_2",
    text: "To what extent are loyalty tiers used to personalize experiences beyond rewards?",
    industry: "travel_hospitality",
    capability: "engagement",
  },
  {
    id: "th_3",
    text: "How effectively are service recovery moments integrated with loyalty gestures?",
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
    text: "How effectively are ancillary revenue opportunities personalized using customer signals?",
    industry: "travel_hospitality",
    capability: "decisioning",
  },
  // Automotive
  {
    id: "auto_1",
    text: "How effectively are vehicle lifecycle milestones used to trigger engagement?",
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
    text: "How effectively are service interactions used to strengthen the customer relationship?",
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
    text: "How effectively does CRM extend beyond purchase to support ongoing brand engagement?",
    industry: "automotive",
    capability: "engagement",
  },
];

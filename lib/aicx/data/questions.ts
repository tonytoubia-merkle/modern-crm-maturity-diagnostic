import type {
  AicxQuestion,
  AicxIndustryQuestion,
  AicxCapability,
  AicxIndustry,
} from "@/lib/aicx/types";

/**
 * Resolves a question's display text given the assessment's industry.
 * Mirrors lib/data/questions.ts:resolveQuestionText.
 */
export function resolveAicxQuestionText(
  q: Pick<AicxQuestion, "text" | "byIndustry">,
  industry: AicxIndustry | null | undefined
): string {
  if (industry && q.byIndustry?.[industry]) {
    return q.byIndustry[industry] as string;
  }
  return q.text;
}

// ── AI for CX Diagnostic – Questions ──────────────────────────────
// Sourced from the Merkle 2026 "AI for CX" deep dive (March 2026)
// and the Customer Experience Optimization (EXO) offering toolkit
// (v2.0, January 2026). Six capabilities × six questions = 36 core
// questions, ground-truthed against the four AI for CX offering
// pillars and the EXO measurement framework.

export const AICX_CAPABILITY_LABELS: Record<AicxCapability, string> = {
  agentic_discoverability: "Agentic Discoverability",
  agentic_experience: "Agentic Experience",
  adaptive_personalization: "Adaptive Personalization",
  experimentation: "Testing & Experimentation",
  identity_data: "Identity & Data Foundation",
  measurement_trust: "Measurement & AI Trust",
};

export const AICX_CAPABILITY_SUBTITLES: Record<AicxCapability, string> = {
  agentic_discoverability: "AI Trust Layer",
  agentic_experience: "AI-Native Experience",
  adaptive_personalization: "Real-Time Engine",
  experimentation: "Optimization Engine",
  identity_data: "Foundation",
  measurement_trust: "Confidence Layer",
};

export const AICX_CAPABILITY_DESCRIPTIONS: Record<AicxCapability, string> = {
  agentic_discoverability:
    "Assess the extent to which the brand's content is structured, trustworthy, and consistently representable to AI agents and LLMs – so the brand is included rather than excluded when an AI decides what to surface.",
  agentic_experience:
    "Assess the extent to which the digital experience is designed for AI-native users – conversational interfaces, video-led discovery, AI-safe interactions, and Gen-Alpha-ready research patterns.",
  adaptive_personalization:
    "Assess the extent to which AI agents personalise the experience in real time based on user behaviour, data, and context – rather than static rules or scheduled batch decisioning.",
  experimentation:
    "Assess the extent to which testing and experimentation infrastructure (A/B, multi-arm bandits, holdout groups, factorial design) is in place to validate AI investments at scale.",
  identity_data:
    "Assess the extent to which a unified identity, segmentation, predictive model, and lifetime-value foundation gives every AI use case the customer signal it needs to act intelligently.",
  measurement_trust:
    "Assess the extent to which AI confidence, trigger logic, model-level optimization, and brand-safety guardrails ensure AI acts only where it should – and is measured against business outcomes, not faith.",
};

export const AICX_CAPABILITY_SCOPE_HINTS: Record<AicxCapability, string> = {
  agentic_discoverability:
    "These questions assess SEO/AEO, content structure, and brand representation in AI answers. Input from search, content, and brand teams may be helpful.",
  agentic_experience:
    "These questions assess the brand's digital experience for AI-native users. Input from digital experience, design, and product teams may be helpful.",
  adaptive_personalization:
    "These questions assess the real-time personalization engine. Input from MarTech, personalization, and decisioning teams may be helpful.",
  experimentation:
    "These questions assess the testing and experimentation infrastructure. Input from analytics, marketing science, and CRO teams may be helpful.",
  identity_data:
    "These questions assess the identity, segmentation, and customer-data foundation. Input from data, identity, and analytics teams may be helpful.",
  measurement_trust:
    "These questions assess the AI confidence, trigger, and measurement framework. Input from data science, AI governance, and measurement teams may be helpful.",
};

export const AICX_SCORE_LABELS: Record<number, string> = {
  1: "Not in Place",
  2: "Emerging",
  3: "Operational",
  4: "Integrated",
  5: "Optimized",
};

export const AICX_SCORE_DESCRIPTIONS: Record<number, string> = {
  1: "Capability does not exist or AI investments are unmeasured and on faith.",
  2: "Pilots or isolated efforts exist but are not consistently applied or measured.",
  3: "Capability is operational and used by core teams, but not orchestrated end-to-end across the experience.",
  4: "Capability runs across digital, content, personalization, and measurement with shared governance and KPIs.",
  5: "Capability is AI-augmented, agent-orchestrated, continuously optimised, and validated by rigorous experimentation against business outcomes.",
};

// ── 36 Core Questions (6 per capability) ──────────────────────────
export const AICX_CORE_QUESTIONS: AicxQuestion[] = [
  // ── Agentic Discoverability (6) ─────────────────────────────────
  {
    id: 1,
    text: "To what extent is the brand's product, service, and authority content structured (schema, semantic markup, knowledge graph) so AI agents and LLMs can confidently extract and cite it?",
    capability: "agentic_discoverability",
    tooltip:
      "Optimized: every key page carries machine-readable structure (Schema.org, JSON-LD, knowledge-graph entities) and the brand is regularly cited by name in AI-generated answers.",
  },
  {
    id: 2,
    text: "To what extent does the organization actively monitor how the brand is represented in AI-generated answers (ChatGPT, Perplexity, Google AI Overviews, Copilot) and surface gaps where the brand is excluded?",
    capability: "agentic_discoverability",
    tooltip:
      "Optimized: brand visibility, sentiment, and inclusion across the major AI surfaces is tracked weekly with the same rigor as traditional SEO ranking, with named owners closing exclusion gaps.",
  },
  {
    id: 3,
    text: "To what extent are pricing, product specs, support information, and policies kept consistent across owned surfaces (web, app, knowledge base, support docs) so AI doesn't fill gaps with whatever it can verify elsewhere?",
    capability: "agentic_discoverability",
    tooltip:
      "Optimized: a single source of truth feeds every owned surface; AI-discoverable content is freshness-monitored and outdated content is auto-flagged.",
  },
  {
    id: 4,
    text: "To what extent does the brand publish original, expert content (PoVs, original research, technical depth) that AI ranking systems weight as authoritative?",
    capability: "agentic_discoverability",
    tooltip:
      "Optimized: a content ops capability publishes expert thought leadership at a regular cadence; brand authority signals are measured and improving.",
  },
  {
    id: 5,
    text: "To what extent are AI agents and LLMs given direct, well-documented access (e.g. an MCP server, API, agent-friendly developer portal) to the brand's official information rather than scraping the public web?",
    capability: "agentic_discoverability",
    tooltip:
      "Optimized: a developer / agent surface lets AI consume official, current, governed brand data with explicit access controls and rate limits.",
  },
  {
    id: 6,
    text: "To what extent is the brand narrative (positioning, value proposition, differentiators) consistently represented across owned, earned, and partner surfaces so AI synthesises it accurately rather than drifting silently?",
    capability: "agentic_discoverability",
    tooltip:
      "Optimized: brand-narrative governance ensures every external surface carries consistent positioning; brand-drift in AI outputs is detected and corrected.",
  },

  // ── Agentic Experience (6) ──────────────────────────────────────
  {
    id: 7,
    text: "To what extent does the digital experience support conversational and natural-language interaction patterns – rather than relying purely on traditional menus, search, and forms?",
    capability: "agentic_experience",
    tooltip:
      "Optimized: conversational interfaces are first-class citizens of the experience; users can ask natural-language questions and complete tasks without learning the navigation.",
  },
  {
    id: 8,
    text: "To what extent is video and rich media used as a default content format – recognising that AI bandwidth and production capability have shifted user expectations toward video-first discovery?",
    capability: "agentic_experience",
    tooltip:
      "Optimized: high-quality video is generated, distributed, and personalised at scale; product, support, and brand content are video-first by default.",
  },
  {
    id: 9,
    text: "To what extent is the experience explicitly designed to handle AI-native deep research – surfacing comparison data, evidence, and structured answers that an AI-equipped buyer expects?",
    capability: "agentic_experience",
    tooltip:
      "Optimized: comparison content, evidence repositories, and structured answers are designed for users arriving with AI-prepared questions; the brand wins the moment of validation.",
  },
  {
    id: 10,
    text: "To what extent does the experience guard against \"AI oops\" moments – guardrails, fallbacks, and human escalation paths that prevent AI-driven mistakes from becoming brand damage?",
    capability: "agentic_experience",
    tooltip:
      "Optimized: AI surfaces have explicit guardrails, escalation paths, and brand-safe fallback content; failure modes are catalogued and mitigated before launch.",
  },
  {
    id: 11,
    text: "To what extent is the experience designed for Gen Alpha and AI-native users – who default to voice, image, and conversational input, and who research differently than prior generations?",
    capability: "agentic_experience",
    tooltip:
      "Optimized: voice, image search, and AI-mediated discovery patterns are core surfaces; experience research includes Gen-Alpha cohorts, not just legacy segments.",
  },
  {
    id: 12,
    text: "To what extent does the digital experience adapt across devices, modalities, and entry points (web, app, voice assistant, AI agent, chat surface) – so the brand presence is consistent wherever the user shows up?",
    capability: "agentic_experience",
    tooltip:
      "Optimized: a single experience system serves every modality; brand presence in voice / agent / chat surfaces is governed alongside web and app.",
  },

  // ── Adaptive Personalization (6) ────────────────────────────────
  {
    id: 13,
    text: "To what extent are personalised experiences assembled by AI agents in real time based on individual user behaviour, data, and context – rather than rule-based segmentation or batch-scheduled variants?",
    capability: "adaptive_personalization",
    tooltip:
      "Optimized: AI agents assemble experiences per user in real time, drawing on first-party data, intent signals, and context; static rules are the exception, not the rule.",
  },
  {
    id: 14,
    text: "To what extent is the personalization stack capable of rapid prototyping – testing new AI-driven personalization patterns against the live experience in days, not quarters?",
    capability: "adaptive_personalization",
    tooltip:
      "Optimized: a sandbox + agent + test framework lets product teams ship and validate new personalization patterns inside a single sprint.",
  },
  {
    id: 15,
    text: "To what extent does personalization span paid, owned, and service surfaces – so the experience is consistent whether a user arrives from media, search, the app, or the contact center?",
    capability: "adaptive_personalization",
    tooltip:
      "Optimized: an orchestration layer carries the same personalization context across paid media, owned channels, and service interactions.",
  },
  {
    id: 16,
    text: "To what extent are recommendations and next-best-actions powered by collaborative filtering and AI models that learn from real behaviour – rather than rules-based product affinity or merchandising calendars?",
    capability: "adaptive_personalization",
    tooltip:
      "Optimized: collaborative-filtering and reinforcement-learning models drive recommendations; merchandising calendars are inputs, not outputs.",
  },
  {
    id: 17,
    text: "To what extent is the brand actively building agentic delivery – AI agents that take action on behalf of the user (bookings, reorders, configurations, support resolution) – rather than only providing information?",
    capability: "adaptive_personalization",
    tooltip:
      "Optimized: branded AI agents complete real transactions and tasks within user-granted authority; the experience moves from informational to action-oriented.",
  },
  {
    id: 18,
    text: "To what extent are personalization signals refreshed in real time – new behaviour reflected in the next interaction within seconds, not the next campaign cycle?",
    capability: "adaptive_personalization",
    tooltip:
      "Optimized: signal capture, profile update, and personalization activation are sub-second; the experience adapts within the same session.",
  },

  // ── Testing & Experimentation (6) ───────────────────────────────
  {
    id: 19,
    text: "To what extent is the organization running structured A/B and multivariate testing across layouts, CTAs, and copy to eliminate friction across the funnel?",
    capability: "experimentation",
    tooltip:
      "Optimized: every meaningful surface is under structured A/B / MVT discipline with statistical rigour; conversion lift is measured as a continuous program.",
  },
  {
    id: 20,
    text: "To what extent are multi-arm bandits or contextual-bandit experiments routing real-time traffic to winning combinations – rather than waiting for fixed-window A/B tests to conclude?",
    capability: "experimentation",
    tooltip:
      "Optimized: multi-arm bandits route live traffic to winning variants in real time; experiments balance exploration and exploitation against business KPIs.",
  },
  {
    id: 21,
    text: "To what extent are AI models tested upstream of the user experience – evaluating model assumptions, training data, and prompt logic – not just the outputs?",
    capability: "experimentation",
    tooltip:
      "Optimized: model-level testing (data drift, prompt regression, eval suites) runs alongside experience-level A/B testing; both flow into a unified signal.",
  },
  {
    id: 22,
    text: "To what extent does the organization maintain persistent holdout groups that reveal the true cumulative impact of AI on lifetime value over months – not just per-campaign lift?",
    capability: "experimentation",
    tooltip:
      "Optimized: persistent global / segment-level holdouts measure cumulative AI impact on LTV across multiple quarters, not just per-test lift.",
  },
  {
    id: 23,
    text: "To what extent does experimentation use factorial design to evaluate content, personalization logic, and channel simultaneously – rather than testing one variable at a time?",
    capability: "experimentation",
    tooltip:
      "Optimized: factorial designs evaluate multiple variables (content × audience × channel) simultaneously, generating statistically meaningful signal without testing every combination.",
  },
  {
    id: 24,
    text: "To what extent is the agentic layer (chat triggers, AI offer placements, adaptive flows) explicitly tested against static or rule-based controls – proving where AI truly outperforms?",
    capability: "experimentation",
    tooltip:
      "Optimized: every agentic intervention is tested against a control; AI is scaled where it wins on validated KPIs and retired where it doesn't.",
  },

  // ── Identity & Data Foundation (6) ──────────────────────────────
  {
    id: 25,
    text: "To what extent is there a unified customer identity foundation (resolved across known and unknown, devices, and channels) that powers every downstream AI use case?",
    capability: "identity_data",
    tooltip:
      "Optimized: a Merkury-style identity graph (or equivalent) resolves known and anonymous customers across surfaces and feeds AI personalization, media, and service in real time.",
  },
  {
    id: 26,
    text: "To what extent are customer segments dynamic and AI-generated – refreshed continuously based on behaviour and intent – rather than static rules-based segments refreshed annually?",
    capability: "identity_data",
    tooltip:
      "Optimized: AI-generated segments refresh continuously based on real behaviour and intent; static rule-based segments are deprecated.",
  },
  {
    id: 27,
    text: "To what extent are predictive models in production for customer behaviour (response, churn, lifetime value, retention) – and are they retrained as the data and business shift?",
    capability: "identity_data",
    tooltip:
      "Optimized: response, churn, LTV, and retention models run in production with monitored accuracy and structured retraining cadence.",
  },
  {
    id: 28,
    text: "To what extent is content metadata, taxonomy, and tagging structured well enough for AI agents to assemble personalised experiences – rather than treating content as opaque assets?",
    capability: "identity_data",
    tooltip:
      "Optimized: every content asset carries machine-usable metadata (audience, intent, lifecycle stage); AI agents can compose experiences from atomic content components.",
  },
  {
    id: 29,
    text: "To what extent is data privacy, consent, and AI governance baked into the foundation – so the data layer is AI-ready and audit-ready by default?",
    capability: "identity_data",
    tooltip:
      "Optimized: a single privacy + AI governance layer enforces consent, model access, and PII handling across every AI use case; usage is auditable.",
  },
  {
    id: 30,
    text: "To what extent are content supply chain analytics – what content was made, what performed, what cost – connected back into the customer-data foundation so AI personalization learns from full-funnel signal?",
    capability: "identity_data",
    tooltip:
      "Optimized: content production, performance, and cost data flows into the same foundation as customer behaviour; AI personalization optimises across both axes.",
  },

  // ── Measurement & AI Trust (6) ──────────────────────────────────
  {
    id: 31,
    text: "To what extent does the brand have explicit AI-confidence and trigger-logic rules – clear definitions of when AI should act, when it should defer to a human, and how decisions are audited?",
    capability: "measurement_trust",
    tooltip:
      "Optimized: every AI surface has documented confidence thresholds, escalation logic, and audit trails; confidence is a primary KPI alongside accuracy.",
  },
  {
    id: 32,
    text: "To what extent are model-level optimization decisions (prompt tuning, retrieval improvements, model swaps) made on data and persistent holdout signal – not stakeholder anecdote?",
    capability: "measurement_trust",
    tooltip:
      "Optimized: model improvements are gated by structured eval suites and holdout-validated lift; subjective stakeholder feedback informs but does not drive model changes.",
  },
  {
    id: 33,
    text: "To what extent are brand-safety guardrails (PII handling, factual claim guardrails, brand voice, regulated-content review) embedded in every AI surface from day one – not retrofitted after a public miss?",
    capability: "measurement_trust",
    tooltip:
      "Optimized: brand-safety guardrails are first-class platform requirements; failure modes are catalogued, monitored, and reviewed quarterly.",
  },
  {
    id: 34,
    text: "To what extent are AI investments evaluated against revenue and engagement KPIs – conversion lift, traffic optimised, LTV lift, brand-safe action rate, ROI validated before scaling?",
    capability: "measurement_trust",
    tooltip:
      "Optimized: every AI investment carries a value-realization scorecard tied to revenue / engagement / risk KPIs; under-performing investments are sunset or refactored.",
  },
  {
    id: 35,
    text: "To what extent does the organization measure the cumulative impact of AI on customer experience metrics (NPS, satisfaction, frustration signals) – not just immediate conversion?",
    capability: "measurement_trust",
    tooltip:
      "Optimized: NPS, satisfaction, and frustration signals are tracked alongside conversion; AI surfaces are monitored for long-term experience impact.",
  },
  {
    id: 36,
    text: "To what extent are AI failures, drift, and degradation surfaced and addressed continuously – rather than discovered after the fact through customer complaints?",
    capability: "measurement_trust",
    tooltip:
      "Optimized: AI monitoring detects drift and degradation in near-real-time; closed-loop remediation runs as a structured engineering practice.",
  },
];

export const AICX_CAPABILITIES_ORDER: AicxCapability[] = [
  "agentic_discoverability",
  "agentic_experience",
  "adaptive_personalization",
  "experimentation",
  "identity_data",
  "measurement_trust",
];

export const AICX_QUESTIONS_BY_CAPABILITY: Record<
  AicxCapability,
  AicxQuestion[]
> = AICX_CAPABILITIES_ORDER.reduce(
  (acc, cap) => {
    acc[cap] = AICX_CORE_QUESTIONS.filter((q) => q.capability === cap);
    return acc;
  },
  {} as Record<AicxCapability, AicxQuestion[]>
);

export const AICX_INDUSTRY_LABELS: Record<AicxIndustry, string> = {
  retail: "Retail / Commerce",
  qsr: "Quick Service / Fast Casual",
  financial_services: "Financial Services",
  travel_hospitality: "Travel & Hospitality",
  technology_saas: "Technology / SaaS",
};

export const AICX_INDUSTRY_QUESTIONS: AicxIndustryQuestion[] = [
  // Retail
  {
    id: "retail_1",
    text: "To what extent is product content (PDP, attributes, reviews, comparison) structured so AI shopping agents can confidently recommend SKUs to their users?",
    industry: "retail",
    capability: "agentic_discoverability",
  },
  {
    id: "retail_2",
    text: "To what extent are AI-driven personalised commerce experiences (recommendations, dynamic merchandising, conversational shopping) live and measured against control?",
    industry: "retail",
    capability: "adaptive_personalization",
  },
  {
    id: "retail_3",
    text: "To what extent is the brand visible – and accurately represented – when shoppers ask AI assistants for product, price, or comparison answers?",
    industry: "retail",
    capability: "agentic_discoverability",
  },
  // QSR
  {
    id: "qsr_1",
    text: "To what extent is menu, location, and offer content structured so AI assistants can answer customer questions and place orders accurately?",
    industry: "qsr",
    capability: "agentic_discoverability",
  },
  {
    id: "qsr_2",
    text: "To what extent are mobile and app experiences personalised in real time by AI based on visit frequency, daypart, and ordering history – not static segments?",
    industry: "qsr",
    capability: "adaptive_personalization",
  },
  {
    id: "qsr_3",
    text: "To what extent are AI agents handling customer-service interactions (order issues, loyalty questions, dietary queries) with a clear human-escalation path?",
    industry: "qsr",
    capability: "measurement_trust",
  },
  // Financial Services
  {
    id: "fs_1",
    text: "To what extent is regulated and disclosure content represented to AI surfaces in a way that meets compliance – and is monitored for misrepresentation in AI-generated answers?",
    industry: "financial_services",
    capability: "agentic_discoverability",
  },
  {
    id: "fs_2",
    text: "To what extent are AI personalization decisions auditable – explaining why a given offer, rate, or experience was surfaced to a given customer?",
    industry: "financial_services",
    capability: "measurement_trust",
  },
  {
    id: "fs_3",
    text: "To what extent is identity, life-stage, and product-tenure data used to drive AI-personalised experiences across digital, branch, and contact-center surfaces?",
    industry: "financial_services",
    capability: "identity_data",
  },
  // Travel & Hospitality
  {
    id: "th_1",
    text: "To what extent is property, destination, and partner content structured so AI travel assistants can plan, compare, and book on behalf of travellers?",
    industry: "travel_hospitality",
    capability: "agentic_discoverability",
  },
  {
    id: "th_2",
    text: "To what extent are AI agents adapting the trip experience in real time – pre-trip planning, on-property concierge, post-trip follow-up – based on guest signals?",
    industry: "travel_hospitality",
    capability: "adaptive_personalization",
  },
  {
    id: "th_3",
    text: "To what extent is loyalty / tier / status signal connected to the AI personalization layer – so recognised guests get experiences that reflect their value?",
    industry: "travel_hospitality",
    capability: "identity_data",
  },
  // Technology / SaaS
  {
    id: "tech_1",
    text: "To what extent are product documentation, pricing, and integration content structured for AI agents (e.g. via MCP, well-formed knowledge base) so technical buyers' AI assistants can give accurate answers?",
    industry: "technology_saas",
    capability: "agentic_discoverability",
  },
  {
    id: "tech_2",
    text: "To what extent is the product itself adopting AI agents that act on the user's behalf – bookings, configurations, optimisations, support resolution – within governed authority?",
    industry: "technology_saas",
    capability: "adaptive_personalization",
  },
  {
    id: "tech_3",
    text: "To what extent are AI features in the product evaluated through structured experimentation against control – proving lift on conversion, retention, and expansion KPIs?",
    industry: "technology_saas",
    capability: "experimentation",
  },
];

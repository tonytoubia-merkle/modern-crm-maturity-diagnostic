import type {
  AientQuestion,
  AientIndustryQuestion,
  AientCapability,
  AientIndustry,
} from "@/lib/aient/types";

/**
 * Resolves a question's display text given the assessment's industry.
 * Mirrors lib/data/questions.ts:resolveQuestionText.
 */
export function resolveAientQuestionText(
  q: Pick<AientQuestion, "text" | "byIndustry">,
  industry: AientIndustry | null | undefined
): string {
  if (industry && q.byIndustry?.[industry]) {
    return q.byIndustry[industry] as string;
  }
  return q.text;
}

// ── AI for Enterprise Diagnostic – Questions ───────────────────────
// Sourced from the Merkle 2026 "AI for Enterprise: Powering
// Intelligence" intro (March 2026), the Agile Operating Model
// Transformation offering (v1.2), the Analytics Advisory offering
// toolkit (v1.0, 2026), and Merkle's own "Re-wiring the Enterprise"
// research (n=100 US C-suite, Dec 2025). Six capabilities × six
// questions = 36 core questions, ground-truthed against the five
// success patterns identified in the research:
//   1. Follow the data gravity
//   2. Start with the decision, not the technology
//   3. Redesign the work, not just the tools
//   4. Earn trust through measurement
//   5. Intelligence at every altitude

export const AIENT_CAPABILITY_LABELS: Record<AientCapability, string> = {
  data_foundations: "Data Foundations",
  use_case_design: "Use Case Design & Prioritization",
  work_design: "Work & Operating Model Design",
  intelligence_delivery: "Intelligence Delivery",
  ai_assurance: "AI Assurance & Trust",
  adoption_governance: "Adoption & Governance",
};

export const AIENT_CAPABILITY_SUBTITLES: Record<AientCapability, string> = {
  data_foundations: "AI-Ready Data Layer",
  use_case_design: "Decision-Led Selection",
  work_design: "Operating Model",
  intelligence_delivery: "Push + Pull Intelligence",
  ai_assurance: "Evaluation & Trust",
  adoption_governance: "Value Realization",
};

export const AIENT_CAPABILITY_DESCRIPTIONS: Record<AientCapability, string> = {
  data_foundations:
    "Assess the extent to which the enterprise has AI-ready data foundations – purpose-built datasets, semantic layer, structured + unstructured integration – rather than wide-aperture data designed for human analysis.",
  use_case_design:
    "Assess the extent to which AI use cases are selected with decision-led rigor (decision enabled, delay eliminated, success measurable in 6 months) rather than chasing technology trends or running 47 disconnected pilots.",
  work_design:
    "Assess the extent to which workflows, roles, and operating models are redesigned around AI – not just adding AI tools to existing processes.",
  intelligence_delivery:
    "Assess the extent to which intelligence is delivered to every altitude (strategic, operational, execution) and in both modes – push (proactive alerts, automated digests) and pull (dashboards, conversational interfaces).",
  ai_assurance:
    "Assess the extent to which AI systems are continuously evaluated, monitored for drift and accuracy, and trusted because performance is engineered – not assumed.",
  adoption_governance:
    "Assess the extent to which AI investment outcomes are tied to business value, change management is formal (not a side project), and cross-functional governance keeps marketing, tech, and data on a unified vision.",
};

export const AIENT_CAPABILITY_SCOPE_HINTS: Record<AientCapability, string> = {
  data_foundations:
    "These questions assess the data layer. Input from CDO, data architecture, semantic-layer, and AI-readiness teams may be helpful.",
  use_case_design:
    "These questions assess use-case selection rigor. Input from transformation lead, strategy, and AI program owners may be helpful.",
  work_design:
    "These questions assess operating-model and workflow redesign. Input from COO, transformation, HR, and change-management leadership may be helpful.",
  intelligence_delivery:
    "These questions assess insight delivery and intelligence systems. Input from analytics, BI, and intelligence-platform owners may be helpful.",
  ai_assurance:
    "These questions assess evaluation, monitoring, and AI trust. Input from data science, ML engineering, AI governance, and risk teams may be helpful.",
  adoption_governance:
    "These questions assess change management, governance, and value realization. Input from CIO, CFO, transformation lead, and cross-functional sponsors may be helpful.",
};

export const AIENT_SCORE_LABELS: Record<number, string> = {
  1: "Not in Place",
  2: "Emerging",
  3: "Operational",
  4: "Integrated",
  5: "Optimized",
};

export const AIENT_SCORE_DESCRIPTIONS: Record<number, string> = {
  1: "Capability does not exist; AI work is paralysis (waiting) or scatter (uncoordinated tactical pilots).",
  2: "Pilots or isolated efforts exist but value is unmeasured and the operating model has not changed.",
  3: "Capability is operational and used by core teams, but not yet driving enterprise-level EBIT impact.",
  4: "Capability runs across functions with shared governance, structured measurement, and tied-to-value KPIs.",
  5: "Capability is AI-augmented, continuously improved through evaluation, and delivers compounding business value – the organization is an AI high-performer (5%+ EBIT impact from AI).",
};

// ── 36 Core Questions (6 per capability) ───────────────────────────
export const AIENT_CORE_QUESTIONS: AientQuestion[] = [
  // ── Data Foundations (6) ───────────────────────────────────────
  {
    id: 1,
    text: "To what extent are AI use cases supported by purpose-built, scoped datasets – combining structured, unstructured, and document data into a unified, queryable layer – rather than left to scrape from a wide-aperture data lake?",
    capability: "data_foundations",
    tooltip:
      "Optimized: every priority AI use case sits on a curated dataset with documented business logic; AI doesn't have to discover its own context.",
  },
  {
    id: 2,
    text: "To what extent does the enterprise have a semantic layer – that encodes what the data means, how it relates, and how the business uses it – translating raw data into something AI can reason about?",
    capability: "data_foundations",
    tooltip:
      "Optimized: a governed semantic layer is the canonical translation between raw enterprise data and AI reasoning, with documented metric definitions, entity relationships, and business logic.",
  },
  {
    id: 3,
    text: "To what extent are structured (database) and unstructured (document, audio, image) data integrated for AI use – rather than siloed and treated as separate stacks?",
    capability: "data_foundations",
    tooltip:
      "Optimized: a unified retrieval and reasoning layer treats structured and unstructured data as one fabric; AI agents can pull context across both.",
  },
  {
    id: 4,
    text: "To what extent does AI investment follow the data gravity – built where data is most complete, governed, and trusted – rather than where the technology hype is loudest?",
    capability: "data_foundations",
    tooltip:
      "Optimized: AI investment is anchored in the systems that already hold the highest-value, best-governed data; new platforms are added only where data gravity calls for it.",
  },
  {
    id: 5,
    text: "To what extent is data quality, lineage, and freshness continuously monitored at the level AI requires – not just human-analyst tolerable?",
    capability: "data_foundations",
    tooltip:
      "Optimized: automated data-quality monitoring, lineage, and freshness alerts run at the granularity AI needs; data drift triggers structured remediation.",
  },
  {
    id: 6,
    text: "To what extent are data privacy, consent, regulatory constraints, and AI access controls enforced at the data-foundation layer – so every downstream use case inherits compliant behaviour?",
    capability: "data_foundations",
    tooltip:
      "Optimized: privacy, consent, and AI access controls are enforced once at the data layer; every downstream model, agent, and report inherits the governance automatically.",
  },

  // ── Use Case Design & Prioritization (6) ───────────────────────
  {
    id: 7,
    text: "To what extent are AI use cases selected with explicit answers to: what decision does this enable, what delay does it eliminate, and how will we know in 6 months – rather than \"AI maturity\" framing?",
    capability: "use_case_design",
    tooltip:
      "Optimized: every funded AI use case has documented answers to all three questions, plus a CFO-recognisable success measure on a 6-month horizon.",
  },
  {
    id: 8,
    text: "To what extent does the organization say no to the long tail of AI ideas – defending a focused use-case portfolio rather than running 47 disconnected pilots?",
    capability: "use_case_design",
    tooltip:
      "Optimized: a use-case portfolio is governed quarterly; new ideas compete for finite capacity and the bar to enter is real.",
  },
  {
    id: 9,
    text: "To what extent are use cases scoped to specific decisions, journeys, or operating workflows – rather than enterprise-wide \"AI transformation\" programs that promise everything and deliver nothing?",
    capability: "use_case_design",
    tooltip:
      "Optimized: use cases are anchored in named decisions and journeys with named decision-makers; transformation is the cumulative result, not the starting frame.",
  },
  {
    id: 10,
    text: "To what extent is success defined across the four dimensions Merkle's research identifies – efficiency (time, throughput), quality (accuracy, trust), capability (questions you couldn't answer before), adoption (who uses it, satisfaction) – rather than vanity metrics?",
    capability: "use_case_design",
    tooltip:
      "Optimized: every use case carries 1–2 metrics per dimension (efficiency / quality / capability / adoption); leadership reviews them on a defined cadence.",
  },
  {
    id: 11,
    text: "To what extent is each use case anchored on a named business sponsor and a named technical owner – rather than orphaned in a centralised AI team or run as a side project?",
    capability: "use_case_design",
    tooltip:
      "Optimized: every funded AI use case has a named business sponsor, named technical owner, and explicit roles for data, change, and risk; un-sponsored use cases don't get funded.",
  },
  {
    id: 12,
    text: "To what extent does the organization treat use cases as compounding investments – feeding shared infrastructure (data, evaluation, governance) – rather than disposable pilots?",
    capability: "use_case_design",
    tooltip:
      "Optimized: each use case extends shared data, evaluation, and governance infrastructure; the third use case launches faster and cheaper than the first because the platform compounds.",
  },

  // ── Work & Operating Model Design (6) ──────────────────────────
  {
    id: 13,
    text: "To what extent has the organization fundamentally redesigned workflows around AI – rather than dropping AI tools into existing processes that were optimised for human-only execution?",
    capability: "work_design",
    tooltip:
      "Optimized: priority workflows have been redesigned with explicit human-AI collaboration; AI high-performers are nearly 3× as likely to have done this and see EBIT impact as a result.",
  },
  {
    id: 14,
    text: "To what extent are roles redefined to codify the human-AI split – what humans do versus what the system does – rather than left ambiguous and renegotiated case-by-case?",
    capability: "work_design",
    tooltip:
      "Optimized: roles include explicit AI-collaboration responsibilities; the human-AI split is documented per role, with clear authority and escalation rules.",
  },
  {
    id: 15,
    text: "To what extent does the organization formalise change management – with named owners, structured cadence, and measured adoption – rather than treating it as informal or a side project?",
    capability: "work_design",
    tooltip:
      "Optimized: change management runs as a structured program with named owners, defined cadence, and adoption KPIs measured at the team level.",
  },
  {
    id: 16,
    text: "To what extent are competing transformation initiatives prioritised and sequenced – rather than overlapping and starving each other of leadership attention and budget?",
    capability: "work_design",
    tooltip:
      "Optimized: a single transformation portfolio is governed at the executive level; AI work sequences alongside other transformations rather than competing for sponsorship.",
  },
  {
    id: 17,
    text: "To what extent is the operating model itself agile – funded by value streams or persistent product teams rather than rigid annual project plans – so AI iterations can land continuously?",
    capability: "work_design",
    tooltip:
      "Optimized: persistent product / value-stream teams own AI outcomes; funding flows to value, not projects, with quarterly OKRs.",
  },
  {
    id: 18,
    text: "To what extent are skills addressed through both training AND workflow redesign – recognising that education alone doesn't change how work actually gets done?",
    capability: "work_design",
    tooltip:
      "Optimized: training and workflow redesign run together; AI fluency is built through doing real work in redesigned flows, not classroom-only education.",
  },

  // ── Intelligence Delivery (6) ──────────────────────────────────
  {
    id: 19,
    text: "To what extent does the enterprise deliver intelligence at every altitude – strategic (C-suite portfolio direction), operational (VPs, directors, managers), execution (analysts, specialists) – with the right depth and frequency for each?",
    capability: "intelligence_delivery",
    tooltip:
      "Optimized: intelligence is tiered to the altitude – synthesised quarterly insight for execs, weekly performance for ops, daily / triggered signal for execution.",
  },
  {
    id: 20,
    text: "To what extent does intelligence operate in both modes – pull (dashboards, conversational interfaces, ad-hoc queries) AND push (scheduled briefings, triggered alerts, automated digests) – rather than only the pull side?",
    capability: "intelligence_delivery",
    tooltip:
      "Optimized: pull intelligence (conversational, exploratory) and push intelligence (proactive alerts, digests) coexist; the user doesn't have to remember to look at a dashboard.",
  },
  {
    id: 21,
    text: "To what extent are conversational insights systems live – letting decision-makers ask natural-language questions of governed data and get accurate, cited answers?",
    capability: "intelligence_delivery",
    tooltip:
      "Optimized: a conversational analytics surface is in production; decision-makers ask questions and receive accurate, cited, governed answers within seconds.",
  },
  {
    id: 22,
    text: "To what extent has the organization eliminated the \"two-week wait for a basic question\" pattern – through automated reporting, self-service intelligence, and conversational query – rather than queueing every request through analysts?",
    capability: "intelligence_delivery",
    tooltip:
      "Optimized: most basic business questions are answered in seconds via self-service and conversational intelligence; analyst queues handle only true investigation work.",
  },
  {
    id: 23,
    text: "To what extent are anomalies, threshold-based alerts, and proactive risk / opportunity signals delivered automatically – rather than discovered by manually scanning dashboards?",
    capability: "intelligence_delivery",
    tooltip:
      "Optimized: a proactive intelligence layer monitors KPIs and signals; alerts surface in the user's preferred channel with explanation and recommended next action.",
  },
  {
    id: 24,
    text: "To what extent do reports and intelligence outputs evolve as the business changes – refreshed automatically – rather than requiring quarterly manual rebuilding?",
    capability: "intelligence_delivery",
    tooltip:
      "Optimized: reporting is built on the semantic layer and adapts to business changes automatically; manual rebuilding is the exception.",
  },

  // ── AI Assurance & Trust (6) ───────────────────────────────────
  {
    id: 25,
    text: "To what extent is each AI system evaluated against a defined framework – accuracy, consistency, trust, failure patterns – with results visible to leadership rather than buried in engineering Jira?",
    capability: "ai_assurance",
    tooltip:
      "Optimized: every production AI system has a defined evaluation framework; accuracy, consistency, and failure patterns are tracked publicly with leadership-visible scorecards.",
  },
  {
    id: 26,
    text: "To what extent are AI systems monitored from day one – accuracy, usage, failure patterns – so degradation is detected before users complain?",
    capability: "ai_assurance",
    tooltip:
      "Optimized: monitoring is part of the deployment definition; AI systems can't go to production without dashboards, alerts, and a defined response runbook.",
  },
  {
    id: 27,
    text: "To what extent is continuous improvement budgeted for as part of TCO – not treated as an afterthought once the project closes?",
    capability: "ai_assurance",
    tooltip:
      "Optimized: every AI system has a continuous-improvement budget line and a named owner; improvement isn't \"if there's time\" – it's part of the operating cost.",
  },
  {
    id: 28,
    text: "To what extent are user feedback loops engineered into AI systems – so the system gets better with use and users see their feedback close the loop?",
    capability: "ai_assurance",
    tooltip:
      "Optimized: thumbs-up/down, structured feedback, and edit signals feed model retraining and prompt-improvement processes; users see the system improve.",
  },
  {
    id: 29,
    text: "To what extent is client-owned AI infrastructure preferred where it matters – so the client can evolve and govern the system rather than being locked into a vendor's release cadence?",
    capability: "ai_assurance",
    tooltip:
      "Optimized: critical AI infrastructure is client-owned, governed, and extensible; vendor systems are used where they win on capability but the client retains the ability to evolve.",
  },
  {
    id: 30,
    text: "To what extent does the organization accept that \"done\" doesn't exist – and budget for ongoing watch / refinement – rather than declaring victory at launch?",
    capability: "ai_assurance",
    tooltip:
      "Optimized: AI systems are treated as living products with permanent owners and a defined cadence of refinement; \"launched\" is the start, not the end.",
  },

  // ── Adoption & Governance (6) ──────────────────────────────────
  {
    id: 31,
    text: "To what extent do AI investments tie to revenue, EBIT, or measurable business value – rather than vanity metrics like \"AI maturity\" or \"models in production\"?",
    capability: "adoption_governance",
    tooltip:
      "Optimized: every major AI program has a value scorecard reviewed quarterly; under-performing investments are sunset or reinvested. Top performers measure 5%+ EBIT impact from AI.",
  },
  {
    id: 32,
    text: "To what extent is there cross-functional alignment – marketing, tech, data, and operations – on a unified AI vision, rather than each function pursuing its own roadmap?",
    capability: "adoption_governance",
    tooltip:
      "Optimized: leading orgs are 2.5× more likely to maintain a unified AI vision across marketing / tech / data; cross-functional governance keeps the roadmap coherent.",
  },
  {
    id: 33,
    text: "To what extent has the organization escaped \"pilot purgatory\" – moving past pilots to scaled, value-generating production AI?",
    capability: "adoption_governance",
    tooltip:
      "Optimized: a defined path from pilot → production exists; pilots that don't earn promotion are retired; production AI is the majority of the portfolio.",
  },
  {
    id: 34,
    text: "To what extent are vanity metrics actively retired – \"AI maturity\", \"models deployed\", \"agents launched\" – in favour of business KPIs the CFO recognises?",
    capability: "adoption_governance",
    tooltip:
      "Optimized: dashboards and exec decks lead with revenue / EBIT / forecasting accuracy; vanity metrics are deprecated.",
  },
  {
    id: 35,
    text: "To what extent are reinvestment decisions structured – under-performing investments redirected, over-performing investments doubled down on – rather than budgeted once and reviewed annually?",
    capability: "adoption_governance",
    tooltip:
      "Optimized: a quarterly value-realization review drives reinvestment; capital flows toward what's working and away from what isn't.",
  },
  {
    id: 36,
    text: "To what extent is the organization building \"AI fluency\" as a leadership skill – not just an analyst skill – so executives can ask the right questions and lead through ambiguity?",
    capability: "adoption_governance",
    tooltip:
      "Optimized: AI fluency is a documented leadership competency; executives can sponsor, challenge, and govern AI work – not just funded it from a distance.",
  },
];

export const AIENT_CAPABILITIES_ORDER: AientCapability[] = [
  "data_foundations",
  "use_case_design",
  "work_design",
  "intelligence_delivery",
  "ai_assurance",
  "adoption_governance",
];

export const AIENT_QUESTIONS_BY_CAPABILITY: Record<
  AientCapability,
  AientQuestion[]
> = AIENT_CAPABILITIES_ORDER.reduce(
  (acc, cap) => {
    acc[cap] = AIENT_CORE_QUESTIONS.filter((q) => q.capability === cap);
    return acc;
  },
  {} as Record<AientCapability, AientQuestion[]>
);

export const AIENT_INDUSTRY_LABELS: Record<AientIndustry, string> = {
  retail: "Retail / Commerce",
  manufacturing: "Manufacturing / Industrial",
  financial_services: "Financial Services",
  healthcare_lifesciences: "Healthcare / Life Sciences",
  technology_saas: "Technology / SaaS",
  professional_services: "Professional Services",
};

export const AIENT_INDUSTRY_QUESTIONS: AientIndustryQuestion[] = [
  // Retail
  {
    id: "retail_1",
    text: "To what extent is product, pricing, inventory, and customer-behaviour data unified into a foundation that AI use cases (merchandising, demand, personalization, fraud) all draw from?",
    industry: "retail",
    capability: "data_foundations",
  },
  {
    id: "retail_2",
    text: "To what extent are AI use cases tied to commercial KPIs – basket size, conversion, retention, gross margin – rather than \"models in production\" counts?",
    industry: "retail",
    capability: "adoption_governance",
  },
  {
    id: "retail_3",
    text: "To what extent does AI deliver intelligence to store operators, category managers, and merchandisers in the cadence each role needs – not just to the central analytics team?",
    industry: "retail",
    capability: "intelligence_delivery",
  },
  // Manufacturing / Industrial
  {
    id: "mfg_1",
    text: "To what extent are operational data sources – production line, IoT / sensor, supply chain, ERP – unified into an AI-ready foundation rather than siloed by plant or function?",
    industry: "manufacturing",
    capability: "data_foundations",
  },
  {
    id: "mfg_2",
    text: "To what extent are AI use cases anchored in operational decisions (predictive maintenance, quality control, supply-chain optimisation) with named decision-makers and 6-month success measures?",
    industry: "manufacturing",
    capability: "use_case_design",
  },
  {
    id: "mfg_3",
    text: "To what extent are workflow redesigns reaching the plant floor – equipping operators with AI-augmented decisions – rather than only redesigning HQ analytics workflows?",
    industry: "manufacturing",
    capability: "work_design",
  },
  // Financial Services
  {
    id: "fs_1",
    text: "To what extent are AI systems evaluated against regulatory and audit requirements – model risk, explainability, fair-lending, model-validation – as part of standard deployment?",
    industry: "financial_services",
    capability: "ai_assurance",
  },
  {
    id: "fs_2",
    text: "To what extent is the data foundation governed for both AI utility and regulatory compliance – consent, PII handling, data residency, model access – at scale?",
    industry: "financial_services",
    capability: "data_foundations",
  },
  {
    id: "fs_3",
    text: "To what extent is intelligence delivered to relationship managers, advisors, and front-line bankers in the cadence and depth they need – moving beyond IT's static dashboards?",
    industry: "financial_services",
    capability: "intelligence_delivery",
  },
  // Healthcare / Life Sciences
  {
    id: "hls_1",
    text: "To what extent are AI use cases anchored in clinical, operational, or commercial decisions with named sponsors, regulatory clearance pathways, and measured outcomes?",
    industry: "healthcare_lifesciences",
    capability: "use_case_design",
  },
  {
    id: "hls_2",
    text: "To what extent are AI systems evaluated against accuracy, bias, explainability, and patient-safety requirements – with documented evidence and monitoring?",
    industry: "healthcare_lifesciences",
    capability: "ai_assurance",
  },
  {
    id: "hls_3",
    text: "To what extent are clinical, operational, and commercial data integrated under governance suitable for AI use – without compromising patient privacy or regulatory standing?",
    industry: "healthcare_lifesciences",
    capability: "data_foundations",
  },
  // Technology / SaaS
  {
    id: "tech_1",
    text: "To what extent does the company embed AI into its own product workflows (engineering, support, GTM, customer success) – not just sell AI to customers?",
    industry: "technology_saas",
    capability: "work_design",
  },
  {
    id: "tech_2",
    text: "To what extent is AI ROI measured against revenue, retention, NRR, and engineering throughput – rather than \"AI features shipped\"?",
    industry: "technology_saas",
    capability: "adoption_governance",
  },
  {
    id: "tech_3",
    text: "To what extent are agentic systems (AI agents acting on behalf of the company / its customers) deployed within governed authority, with monitoring, eval, and escalation paths?",
    industry: "technology_saas",
    capability: "ai_assurance",
  },
  // Professional Services
  {
    id: "prosvc_1",
    text: "To what extent is the firm's IP – methodologies, case studies, deliverables, training – structured into a repository that AI agents can use to support practitioners and clients?",
    industry: "professional_services",
    capability: "data_foundations",
  },
  {
    id: "prosvc_2",
    text: "To what extent are AI use cases tied to billable productivity, win rate, and engagement margin – rather than \"AI maturity\" framing?",
    industry: "professional_services",
    capability: "adoption_governance",
  },
  {
    id: "prosvc_3",
    text: "To what extent are practitioner workflows redesigned around AI – research, deliverable production, client communication – rather than adding AI on top of legacy ways of working?",
    industry: "professional_services",
    capability: "work_design",
  },
];

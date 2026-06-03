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

// ── AI for Enterprise Diagnostic – Questions ───────────────────
// Question bank revised against the "Inventory of Questions for
// Workshops" sheet (AI for Enterprise). The sheet reorganised the
// instrument into five workshop sections – Data Readiness, Decisions
// and Use Cases, Organizational Alignment, AI Systems and Trust, and
// Intelligence and Insights.
//
// We retain the diagnostic's six-capability model: the five sheet
// sections map onto five capabilities, and the value-realization /
// governance questions the sheet folded into Decisions and
// Organizational Alignment are pulled back into the sixth capability,
// Adoption & Governance. Net: 50 core questions (10/8/8/8/9/7 across
// the six capabilities).
//
// To stay consistent with the other diagnostics (CRM, CSC, B2B, AI for
// CX), questions are phrased as scale-ratable "To what extent…"
// maturity statements answered on the shared 1–5 scale below; the
// sheet's open, workshop-style prompts were reworded accordingly. The
// per-question maturity rubrics from the sheet are not carried in the
// app (they live in the source sheet); scoring uses the global scale
// like every other diagnostic.

export const AIENT_CAPABILITY_LABELS: Record<AientCapability, string> = {
  data_foundations: "Data Readiness",
  use_case_design: "Decisions and Use Cases",
  work_design: "Organizational Alignment",
  intelligence_delivery: "Intelligence and Insights",
  ai_assurance: "AI Systems and Trust",
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
    "Assess the extent to which the enterprise has AI-ready data foundations – purpose-built datasets, semantic layer, structured + unstructured integration, master data, and AI-grade governance – rather than wide-aperture data designed for human analysis.",
  use_case_design:
    "Assess the extent to which AI use cases are selected with decision-led rigor (decision enabled, delay eliminated, success measurable in 6 months) rather than chasing technology trends or running 47 disconnected pilots.",
  work_design:
    "Assess the extent to which workflows, roles, operating models, and cross-functional ways of working are redesigned around AI – not just adding AI tools to existing processes.",
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

// ── 50 Core Questions (revised from the Workshop Inventory sheet) ──
export const AIENT_CORE_QUESTIONS: AientQuestion[] = [
  // ── Data Readiness (10) ───────────────
  {
    id: 1, // sheet row 2 (section 1 Q1)
    text: "To what extent are AI use cases supported by purpose-built, scoped datasets that combine structured, unstructured, and document data into a unified queryable layer – rather than left to scrape from a wide-aperture data lake?",
    capability: "data_foundations",
  },
  {
    id: 2, // sheet row 3 (section 1 Q2)
    text: "To what extent does your organization have a semantic layer that encodes what data means, how it relates, and how the business uses it – translating raw data into something AI can reason about – rather than every use case starting from raw fields?",
    capability: "data_foundations",
  },
  {
    id: 3, // sheet row 4 (section 1 Q3)
    text: "How well understood is the completeness, coverage, and structural integrity of your enterprise data assets – and do you have a measurable baseline of what proportion of those assets meet the quality threshold required for AI consumption?",
    capability: "data_foundations",
  },
  {
    id: 4, // sheet row 5 (section 1 Q4)
    text: "To what extent is your data fresh and deep enough for AI – synced across systems at the cadence use cases require, with sufficient historical depth – rather than stale, inconsistently synced, or shallow?",
    capability: "data_foundations",
  },
  {
    id: 5, // sheet row 6 (section 1 Q5)
    text: "To what extent are known data quality problems – duplicates, missing fields, conflicting records, bad addresses – being actively remediated through a managed program, rather than accumulating as an ever-growing list?",
    capability: "data_foundations",
  },
  {
    id: 6, // sheet row 7 (section 1 Q6)
    text: "To what extent are enterprise data privacy obligations, regulatory access controls, and AI-specific usage restrictions enforced at the data infrastructure layer – so every downstream workload inherits compliant behaviour rather than implementing compliance independently?",
    capability: "data_foundations",
  },
  {
    id: 7, // sheet row 8 (section 1 Q7)
    text: "To what extent is there a clearly accountable owner for the enterprise data strategy – with the mandate, resources, and cross-functional authority to govern data as a shared asset, reflected in documented standards, maintained data contracts, and enforceable policies across business domains?",
    capability: "data_foundations",
  },
  {
    id: 8, // sheet row 9 (section 1 Q8)
    text: "To what extent does the enterprise have a coherent, governed approach to master data management – covering the entities (people, organizations, products, locations, accounts) that anchor its most important business processes – rather than each system maintaining its own conflicting version with no authoritative source of record?",
    capability: "data_foundations",
  },
  {
    id: 9, // sheet row 10 (section 1 Q9)
    text: "To what extent does the enterprise have a reliable, auditable inventory of its significant data assets – what exists, where it lives, how old it is, who produced it, and how it has been used – rather than operating without a clear picture of the data it holds?",
    capability: "data_foundations",
  },
  {
    id: 10, // sheet row 11 (section 1 Q10)
    text: "To what extent is data quality, lineage, freshness, privacy controls, and AI access governance continuously monitored at the level AI requires – not just human-analyst tolerable – and do downstream use cases inherit compliant, trustworthy data?",
    capability: "data_foundations",
  },
  // ── Decisions and Use Cases (8) ───────────────
  {
    id: 11, // sheet row 12 (section 2 Q1)
    text: "When your organization identifies an AI initiative, how consistently can the team articulate the specific business decision it is designed to improve?",
    capability: "use_case_design",
  },
  {
    id: 12, // sheet row 13 (section 2 Q2)
    text: "To what extent does your organization prioritize AI use cases through a consistent, transparent framework tied to business value – rather than executive enthusiasm or vendor relationships?",
    capability: "use_case_design",
  },
  {
    id: 13, // sheet row 14 (section 2 Q3)
    text: "To what extent can your organization state with confidence how it will know within six months whether its most important AI initiative has worked – with defined success metrics and a named owner?",
    capability: "use_case_design",
  },
  {
    id: 14, // sheet row 15 (section 2 Q4)
    text: "To what extent do your AI initiatives have a clearly defined decision owner – a specific person whose job it is to make a particular decision better or faster?",
    capability: "use_case_design",
  },
  {
    id: 15, // sheet row 16 (section 2 Q5)
    text: "To what extent does your organization run a consistent intake and evaluation process for new AI ideas – assessing business value, data readiness, and appetite before committing resources – rather than championing ideas ad hoc or losing them in a backlog?",
    capability: "use_case_design",
  },
  {
    id: 16, // sheet row 17 (section 2 Q6)
    text: "To what extent does your organization systematically assess whether the data a use case needs is available, governed, and sufficient before the use case is approved?",
    capability: "use_case_design",
  },
  {
    id: 17, // sheet row 18 (section 2 Q7)
    text: "How clearly does your organization distinguish between AI use cases that are Quick Wins (high value, low transformation effort) versus Strategic Bets (high value, high effort)?",
    capability: "use_case_design",
  },
  {
    id: 18, // sheet row 21 (section 2 Q10)
    text: "How effectively does your organization say no to AI ideas that do not meet the readiness bar – use cases that cannot answer what decision they enable, what delay they eliminate, or how success will be measured?",
    capability: "use_case_design",
  },
  // ── Organizational Alignment (8) ───────────────
  {
    id: 19, // sheet row 22 (section 3 Q1)
    text: "When your organization deploys an AI tool into a team's workflow, how often is the underlying workflow itself redesigned – not just the addition of an AI step to an existing process?",
    capability: "work_design",
  },
  {
    id: 20, // sheet row 23 (section 3 Q2)
    text: "How clearly has your organization defined which tasks AI will handle versus which tasks require human judgment at each step of your key workflows?",
    capability: "work_design",
  },
  {
    id: 21, // sheet row 24 (section 3 Q3)
    text: "To what extent does your organization address the AI skills gap through both training and deliberate work redesign – rather than assuming training on AI tools alone will deliver transformation?",
    capability: "work_design",
  },
  {
    id: 22, // sheet row 26 (section 3 Q5)
    text: "How formally does your organization manage the change required when AI is introduced into a team's workflow – communication, role transition, adoption tracking?",
    capability: "work_design",
  },
  {
    id: 23, // sheet row 27 (section 3 Q6)
    text: "When AI is introduced into a workflow, how deliberately does your organization redefine the roles of the people in that workflow – their responsibilities, their performance metrics, and their career development?",
    capability: "work_design",
  },
  {
    id: 24, // sheet row 28 (section 3 Q7)
    text: "How well does your organization understand which of its current workflows are fragmented – operating across functions or systems in ways that prevent AI from delivering end-to-end value?",
    capability: "work_design",
  },
  {
    id: 25, // sheet row 29 (section 3 Q8)
    text: "How effectively does your organization use AI performance data – adoption rates, output quality, time savings – to continuously improve both the AI system and the workflow it operates within?",
    capability: "work_design",
  },
  {
    id: 26, // sheet row 31 (section 3 Q10)
    text: "How prepared is your organization to sustain AI-driven workflow changes over time – as the AI system evolves, as the business changes, and as the people in the workflow turn over?",
    capability: "work_design",
  },
  // ── AI Systems and Trust (8) ───────────────
  {
    id: 27, // sheet row 32 (section 4 Q1)
    text: "To what extent is each AI system evaluated against a defined framework – accuracy, consistency, trust, failure patterns – with results visible to leadership rather than buried in engineering Jira?",
    capability: "ai_assurance",
  },
  {
    id: 28, // sheet row 33 (section 4 Q2)
    text: "To what extent has your organization defined and standardized how AI quality is measured – with agreed criteria for what good output looks like – rather than leaving quality to individual judgment after the fact?",
    capability: "ai_assurance",
  },
  {
    id: 29, // sheet row 34 (section 4 Q3)
    text: "To what extent does your organization deliberately design the relationship between AI systems and the people who rely on them – trust, transparency, and when to rely on or override the system – rather than expecting adoption to happen naturally?",
    capability: "ai_assurance",
  },
  {
    id: 30, // sheet row 35 (section 4 Q4)
    text: "To what extent are user feedback loops engineered into AI systems – so the system gets better with use and users see their feedback close the loop?",
    capability: "ai_assurance",
  },
  {
    id: 31, // sheet row 36 (section 4 Q5)
    text: "To what extent is client-owned AI infrastructure preferred where it matters – so the client can evolve and govern the system rather than being locked into a vendor's release cadence?",
    capability: "ai_assurance",
  },
  {
    id: 32, // sheet row 37 (section 4 Q6)
    text: "To what extent does the organization accept that \"done\" doesn't exist – and budget for ongoing watch / refinement – rather than declaring victory at launch?",
    capability: "ai_assurance",
  },
  {
    id: 33, // sheet row 38 (section 4 Q7)
    text: "To what extent does your organization apply a shared, formal definition of AI trustworthiness – accuracy, explainability, fairness, and human oversight – across its AI systems, rather than \"trust\" meaning different things to different people?",
    capability: "ai_assurance",
  },
  {
    id: 34, // sheet row 41 (section 4 Q10)
    text: "When your AI system produces a recommendation or decision, how easy is it for the person relying on it to override it – and does the organization track how often that happens and why?",
    capability: "ai_assurance",
  },
  // ── Intelligence and Insights (9) ───────────────
  {
    id: 35, // sheet row 42 (section 5 Q1)
    text: "To what extent does the enterprise deliver intelligence at every altitude – strategic (C-suite portfolio direction), operational (VPs, directors, managers), execution (analysts, specialists) – with the right depth and frequency for each?",
    capability: "intelligence_delivery",
  },
  {
    id: 36, // sheet row 43 (section 5 Q2)
    text: "To what extent does intelligence operate in both modes – pull (dashboards, conversational interfaces, ad-hoc queries) AND push (scheduled briefings, triggered alerts, automated digests) – rather than only the pull side?",
    capability: "intelligence_delivery",
  },
  {
    id: 37, // sheet row 44 (section 5 Q3)
    text: "To what extent are conversational insights systems live – letting decision-makers ask natural-language questions of governed data and get accurate, cited answers?",
    capability: "intelligence_delivery",
  },
  {
    id: 38, // sheet row 45 (section 5 Q4)
    text: "To what extent has the organization eliminated the \"two-week wait for a basic question\" pattern – through automated reporting, self-service intelligence, and conversational query – rather than queueing every request through analysts?",
    capability: "intelligence_delivery",
  },
  {
    id: 39, // sheet row 46 (section 5 Q5)
    text: "To what extent are anomalies, threshold-based alerts, and proactive risk / opportunity signals delivered automatically – rather than discovered by manually scanning dashboards?",
    capability: "intelligence_delivery",
  },
  {
    id: 40, // sheet row 47 (section 5 Q6)
    text: "To what extent do reports and intelligence outputs evolve as the business changes – refreshed automatically – rather than requiring quarterly manual rebuilding?",
    capability: "intelligence_delivery",
  },
  {
    id: 41, // sheet row 48 (section 5 Q7)
    text: "To what extent does your organization have a clear, documented view of where its intelligence is strongest versus most strained – by domain – and an active program to close the most critical gaps?",
    capability: "intelligence_delivery",
  },
  {
    id: 42, // sheet row 50 (section 5 Q9)
    text: "To what extent does your organization formally review AI efforts that did not go as hoped – capturing root causes and lessons that shape future initiatives – rather than moving on without examination?",
    capability: "intelligence_delivery",
  },
  {
    id: 43, // sheet row 51 (section 5 Q10)
    text: "To what extent can your organization produce the intelligence it needs – observations, reports, models, insights – quickly and on demand, rather than through long analyst queues?",
    capability: "intelligence_delivery",
  },
  // ── Adoption & Governance (value realization, pulled across sections) (7) ───────────────
  {
    id: 44, // sheet row 19 (section 2 Q8)
    text: "When your organization defines a success metric for an AI initiative, how often does that metric survive to the point where it is actually measured?",
    capability: "adoption_governance",
  },
  {
    id: 45, // sheet row 20 (section 2 Q9)
    text: "How well does your organization connect AI use case performance back to business outcomes that matter to the CFO – revenue impact, cost reduction, margin improvement?",
    capability: "adoption_governance",
  },
  {
    id: 46, // sheet row 25 (section 3 Q4)
    text: "How consistent is the understanding of AI's role and potential across your marketing, technology, and data teams?",
    capability: "adoption_governance",
  },
  {
    id: 47, // sheet row 30 (section 3 Q9)
    text: "How aligned are your AI metrics to business value outcomes rather than operational or technical measures?",
    capability: "adoption_governance",
  },
  {
    id: 48, // sheet row 39 (section 4 Q8)
    text: "How well does your organization prioritize gaps in insights or optimizations that inform a roadmap for improvements?",
    capability: "adoption_governance",
  },
  {
    id: 49, // sheet row 40 (section 4 Q9)
    text: "To what extent is scaling AI from pilot to production a repeatable, managed capability – with a documented methodology that resolves the systemic barriers – rather than a struggle that recurs with each initiative?",
    capability: "adoption_governance",
  },
  {
    id: 50, // sheet row 49 (section 5 Q8)
    text: "To what extent does your organization have a concrete, socialized vision and roadmap for AI's role in decision-making – with defined use cases, dependencies, and measurable outcomes – rather than a vague aspiration?",
    capability: "adoption_governance",
  },
];

export const AIENT_CAPABILITIES_ORDER: AientCapability[] = [
  "data_foundations",
  "use_case_design",
  "work_design",
  "ai_assurance",
  "intelligence_delivery",
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

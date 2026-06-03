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
// Intelligence and Insights – and supplied a full 1–5 maturity rubric
// per question.
//
// We retain the diagnostic's six-capability model: the five sheet
// sections map onto five capabilities, and the value-realization /
// governance questions the sheet folded into Decisions and
// Organizational Alignment are pulled back into the sixth capability,
// Adoption & Governance. Net: 50 core questions (10/8/8/8/9/7 across
// the six capabilities), each carrying its per-question maturity
// ladder in `maturityLevels`. Q42 keeps its original "every altitude"
// wording per the sheet's "CF says replace with left question" note.

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
// Each question carries its own 1–5 maturity ladder in maturityLevels;
// tooltip mirrors the level-5 ("Optimized") descriptor for compact UI.
export const AIENT_CORE_QUESTIONS: AientQuestion[] = [
  // ── Data Readiness (10) ───────────────
  {
    id: 1, // sheet row 2 (section 1 Q1)
    text: "To what extent are AI use cases supported by purpose-built, scoped datasets that combine structured, unstructured, and document data into a unified queryable layer – rather than left to scrape from a wide-aperture data lake?",
    capability: "data_foundations",
    tooltip: "AI dataset design is a core engineering discipline. Every significant AI use case is supported by a purpose-built, documented, governed dataset that is scoped to the decision it serves. Structured, unstructured, and document data are routinely integrated. Datasets are treated as reusable assets, versioned, monitored for drift, and refreshed automatically.",
    maturityLevels: {
      1: "No purpose-built AI datasets exist. AI use cases are expected to work against raw data lakes or operational system exports. Structured and unstructured data are treated as entirely separate stacks with no integration. Data preparation for each use case starts from scratch.",
      2: "Some data preparation work exists for the most visible AI use cases but it is done ad hoc by engineers at the start of each project. There is no reusable dataset layer. Structured data is used but unstructured data (documents, call transcripts, images) is rarely integrated. Each project redoes work the previous project already did.",
      3: "A data preparation practice exists for AI initiatives. Reusable datasets have been built for some use cases and are scoped to specific decisions or workflows. Structured and unstructured data are beginning to be integrated for select use cases. However, coverage is inconsistent and the concept of a purpose-built data product is not yet standard.",
      4: "Purpose-built, scoped datasets are the standard approach for significant AI use cases. Each dataset combines the data types the use case requires – structured records, unstructured text, document data – into a unified, queryable layer. Datasets are reusable across related use cases and maintained as governed data products.",
      5: "AI dataset design is a core engineering discipline. Every significant AI use case is supported by a purpose-built, documented, governed dataset that is scoped to the decision it serves. Structured, unstructured, and document data are routinely integrated. Datasets are treated as reusable assets, versioned, monitored for drift, and refreshed automatically.",
    },
  },
  {
    id: 2, // sheet row 3 (section 1 Q2)
    text: "Does your organization have a semantic layer that encodes what data means, how it relates, and how the business uses it – translating raw data into something AI can reason about – or does every use case start from raw fields?",
    capability: "data_foundations",
    tooltip: "The semantic layer is a strategic AI enabler. It encodes not just definitions and relationships but the business context, usage norms, and reasoning logic that AI systems need to produce accurate, trustworthy outputs. It is continuously maintained, versioned, and extended as new data domains are onboarded. Every AI use case inherits from it rather than defining its own business logic.",
    maturityLevels: {
      1: "No semantic layer exists. Every AI use case starts from raw database fields with no shared definition of what those fields mean, how they relate, or how the business uses them. Business logic is reinvented in each project. Terms like 'customer,' 'transaction,' and 'active' mean different things to different teams.",
      2: "Some shared definitions exist informally – a wiki page, a glossary document, a README in a data repo – but they are incomplete, not enforced, and frequently out of date. Business logic is partially encoded in BI tools or analytics models but is not accessible to AI workloads. Inconsistencies between how teams define core metrics are a recurring source of project delay.",
      3: "A semantic layer or business logic layer exists for the most critical data domains (typically customer and transaction data). Key metrics are defined, documented, and enforced in a BI or analytics platform. However, the semantic layer does not cover all AI-relevant data and is not designed to be consumed by AI systems – it serves human analysts rather than machine reasoning.",
      4: "A semantic layer covers all significant data domains and is designed to be consumed by both human analysts and AI systems. Core business entities – customer, product, transaction, event – are formally defined with relationships, business rules, and usage context. The semantic layer is maintained as a governed asset and used in AI use case development.",
      5: "The semantic layer is a strategic AI enabler. It encodes not just definitions and relationships but the business context, usage norms, and reasoning logic that AI systems need to produce accurate, trustworthy outputs. It is continuously maintained, versioned, and extended as new data domains are onboarded. Every AI use case inherits from it rather than defining its own business logic.",
    },
  },
  {
    id: 3, // sheet row 4 (section 1 Q3)
    text: "How well understood is the completeness, coverage, and structural integrity of your enterprise data assets – and do you have a measurable baseline of what proportion of those assets meet the quality threshold required for AI consumption?",
    capability: "data_foundations",
    tooltip: "Data asset quality is continuously monitored at machine speed. AI-readiness scores are computed per asset, updated in near-real-time, and surfaced to data product owners. AI use case teams can self-serve a quality gate before consuming any asset. Completeness improvement is a measurable, tracked engineering objective with defined SLAs.",
    maturityLevels: {
      1: "No systematic measurement of data completeness exists. Teams assess quality informally, project by project. There is no enterprise-wide view of which data assets are fit-for-purpose. AI pilots fail or produce poor outputs due to undetected gaps that were never quantified before use.",
      2: "Completeness is measured for a handful of high-visibility domains (usually the ones that recently caused an incident). Measurement is inconsistent in method and cadence. A patchwork of manual quality checks exists but produces results that are not comparable across domains or systems.",
      3: "A completeness assessment methodology exists and has been applied across primary enterprise data domains. The organization knows which asset classes have significant gaps, and a remediation backlog is maintained. However, quality thresholds specific to AI consumption have not yet been defined – the baseline exists for human-analyst tolerability, not machine reasoning.",
      4: "AI-specific data quality thresholds are defined for each significant asset class. Completeness, coverage, and structural integrity are tracked on a defined cadence against those thresholds. The organization can report what proportion of each enterprise data asset is AI-ready. Gaps are prioritized and resourced through a formal quality improvement program.",
      5: "Data asset quality is continuously monitored at machine speed. AI-readiness scores are computed per asset, updated in near-real-time, and surfaced to data product owners. AI use case teams can self-serve a quality gate before consuming any asset. Completeness improvement is a measurable, tracked engineering objective with defined SLAs.",
    },
  },
  {
    id: 4, // sheet row 5 (section 1 Q4)
    text: "How fresh is your data – how frequently does it sync across systems – and how far back does your transaction history go?",
    capability: "data_foundations",
    tooltip: "Data freshness is a managed operational capability. Sync latency is monitored by system and use case, SLAs are defined and enforced, and deviations trigger alerts. Historical data depth is treated as a strategic asset – retention decisions are made with explicit reference to AI modeling requirements rather than purely operational or compliance considerations.",
    maturityLevels: {
      1: "Data sync frequency is unknown or highly inconsistent across systems. Some platforms update in real time while others run weekly or monthly batch processes. Historical transaction data is limited – typically less than 12 months – due to purge policies or system migrations that were never reconciled.",
      2: "Data sync cadences are known for primary systems but are not optimized for AI use cases. Latency is measured in days for most systems. Historical data extends 1–2 years for some systems but gaps exist due to platform migrations, inconsistent retention policies, or data that was never extracted from legacy systems.",
      3: "Most significant systems sync on a defined cadence (typically daily batch) that is documented and monitored. Historical transaction data extends at least 2–3 years for the primary systems. Retention policies are defined but vary by platform and have not been aligned to AI modeling requirements.",
      4: "Data sync frequency is designed around use case requirements – near-real-time for high-velocity use cases, daily batch for others. Historical data extends at least 3 years across primary customer and transaction systems. Retention policies are aligned to AI modeling needs and reviewed periodically.",
      5: "Data freshness is a managed operational capability. Sync latency is monitored by system and use case, SLAs are defined and enforced, and deviations trigger alerts. Historical data depth is treated as a strategic asset – retention decisions are made with explicit reference to AI modeling requirements rather than purely operational or compliance considerations.",
    },
  },
  {
    id: 5, // sheet row 6 (section 1 Q5)
    text: "Where are your known data quality problems – duplicates, missing fields, conflicting records, bad addresses – and is there an active program to address them, or a list that keeps growing?",
    capability: "data_foundations",
    tooltip: "Data quality is a managed organizational capability with automated monitoring, defined thresholds, named owners, and a continuous improvement cycle. Quality metrics are benchmarked over time and tied to AI initiative readiness. The organization does not launch AI use cases against data domains with unresolved quality issues above defined thresholds.",
    maturityLevels: {
      1: "Data quality issues are discovered reactively when processes break or outputs look wrong. There is no formal quality assessment, no backlog of known issues, and no ownership of data quality as a function. Problems accumulate silently.",
      2: "Known quality issues exist and have been informally documented – typically by an analyst who discovered them during a project. Duplicates, bad addresses, and missing fields are recognized problems but no remediation program is active. The list of known issues grows faster than it shrinks.",
      3: "Data quality has been formally assessed for the most critical systems and a documented backlog of issues exists. Some remediation has occurred for the highest-impact problems. However, quality monitoring is not automated, new issues are not systematically detected, and the backlog is not resourced for full resolution.",
      4: "Data quality is monitored on a defined cadence for all significant systems. Automated checks flag new issues, a named owner manages the remediation backlog, and quality metrics are reported to leadership. Most high-impact issues have been addressed and recurrence rates are tracked.",
      5: "Data quality is a managed organizational capability with automated monitoring, defined thresholds, named owners, and a continuous improvement cycle. Quality metrics are benchmarked over time and tied to AI initiative readiness. The organization does not launch AI use cases against data domains with unresolved quality issues above defined thresholds.",
    },
  },
  {
    id: 6, // sheet row 7 (section 1 Q6)
    text: "To what extent are enterprise data privacy obligations, regulatory access controls, and AI-specific usage restrictions enforced at the data infrastructure layer – so every downstream workload inherits compliant behaviour rather than implementing compliance independently?",
    capability: "data_foundations",
    tooltip: "Privacy and regulatory compliance is a fully automated capability at the data infrastructure layer. Sensitivity classifications, access policies, retention rules, and AI usage permissions are applied at ingestion and travel with the data through all transformations. AI workloads cannot consume data outside their permitted scope – policy is enforced by the platform, not by convention. Compliance posture is continuously monitored, auditable end-to-end, and updated automatically as regulations change.",
    maturityLevels: {
      1: "Privacy and regulatory controls are enforced, if at all, at the application layer in individual systems. There is no enterprise data layer that carries access restrictions, sensitivity classifications, or usage permissions. AI workloads have no mechanism to discover what regulations apply to the data they consume. Compliance is assumed, not enforced.",
      2: "Some data assets are tagged with sensitivity classifications, typically following an audit or regulatory event. Access controls exist in some platforms but are inconsistently applied and not enforced in the data layer itself. AI projects check for regulatory constraints informally. Compliance is largely dependent on individual engineers knowing the rules.",
      3: "A data classification policy exists and has been applied to primary enterprise data domains. Regulatory constraints (GDPR, HIPAA, CCPA, sector-specific rules) have been mapped to specific asset classes. Access controls are enforced at the storage or catalog layer for sensitive domains. AI use case teams are required to document the regulatory posture of the data they consume, but this is still a manual step.",
      4: "Privacy obligations and AI-specific usage restrictions are encoded in the data catalog and enforced through platform-level controls – role-based access, column-level masking, purpose-of-use tagging. AI workloads automatically inherit the compliance posture of the underlying data assets. Regulatory mapping is maintained centrally and reviewed on a defined cadence. New AI use cases go through a data-compliance gate before deployment.",
      5: "Privacy and regulatory compliance is a fully automated capability at the data infrastructure layer. Sensitivity classifications, access policies, retention rules, and AI usage permissions are applied at ingestion and travel with the data through all transformations. AI workloads cannot consume data outside their permitted scope – policy is enforced by the platform, not by convention. Compliance posture is continuously monitored, auditable end-to-end, and updated automatically as regulations change.",
    },
  },
  {
    id: 7, // sheet row 8 (section 1 Q7)
    text: "Is there a clearly accountable owner for the enterprise data strategy with the mandate, resources, and cross-functional authority to govern data as a shared asset – and is that ownership reflected in documented standards, maintained data contracts, and enforceable policies across business domains?",
    capability: "data_foundations",
    tooltip: "Data ownership is embedded in the organizational operating model with clear incentives, performance metrics, and accountability mechanisms for data quality outcomes. The data strategy is a published, board-visible asset reviewed on an annual cycle. Data contracts are universal across all significant producer-consumer relationships and are machine-readable. Policy enforcement is automated. The organization can demonstrate, at any point, who owns each data asset, what its current quality is, and what downstream systems depend on it.",
    maturityLevels: {
      1: "Enterprise data has no named strategic owner. Accountability is fragmented across IT, individual business units, and vendors. Data standards and policies do not exist or exist only as unenforced documents. Each domain operates its own data practices with no enterprise coordination. Governance conversations happen only when a problem forces them.",
      2: "A data governance function exists in name – typically a working group or committee – but lacks a mandate, budget, or enforcement authority. Some documentation of key data assets has been attempted but is incomplete and out of date. Ownership of specific domains is informally understood within teams but not formally assigned or publicly accountable. Governance is advisory at best.",
      3: "A Chief Data Officer or equivalent role exists with a defined mandate. Data ownership is formally assigned for primary domains through a data stewardship model. Data dictionaries, field definitions, and lineage documentation cover significant systems. Data contracts – agreed interfaces between producers and consumers – are beginning to be adopted for high-priority data products. Policies exist but enforcement is inconsistent.",
      4: "Enterprise data strategy is owned at the executive level with cross-functional accountability enforced through domain data owners and stewards. Data contracts are the standard mechanism for data-product relationships. Policies are enforced through platform-level controls, not convention. Documentation is maintained as a living asset – versioned, reviewed on a cadence, and tied to actual system configurations rather than aspirational diagrams.",
      5: "Data ownership is embedded in the organizational operating model with clear incentives, performance metrics, and accountability mechanisms for data quality outcomes. The data strategy is a published, board-visible asset reviewed on an annual cycle. Data contracts are universal across all significant producer-consumer relationships and are machine-readable. Policy enforcement is automated. The organization can demonstrate, at any point, who owns each data asset, what its current quality is, and what downstream systems depend on it.",
    },
  },
  {
    id: 8, // sheet row 9 (section 1 Q8)
    text: "Does the enterprise have a coherent, governed approach to master data management – covering the entities (people, organizations, products, locations, accounts) that anchor your most important business processes – or does each system maintain its own version of these entities with no authoritative source of record?",
    capability: "data_foundations",
    tooltip: "Master data is a strategic, continuously maintained enterprise asset. MDM coverage is universal across all entity domains. Matching and survivorship logic is machine-learning-assisted, continuously validated, and tuned based on downstream quality signals. All AI workloads consume master data by default – no use case builds its own entity representation. MDM quality is monitored in real time, and deviations trigger automated stewardship workflows rather than requiring manual intervention.",
    maturityLevels: {
      1: "No master data management practice exists. Each system creates and maintains its own representation of core business entities. The same organization, product, or location may have dozens of conflicting records across systems with no reconciliation mechanism. Data integration is done by ad hoc field matching, producing inconsistencies that compound with every downstream use.",
      2: "MDM has been attempted for one or two high-pain entities (usually customer or product) following a specific business failure – a bad merge, a regulatory finding, a failed analytics project. The attempt produced a partial golden record for a subset of the data but is not maintained. Matching logic is undocumented. The resulting golden record is used by some systems but not authoritative across the enterprise.",
      3: "MDM is an active practice for the highest-priority entity domains. Authoritative sources of record are formally designated for key entities, and matching and survivorship rules are documented and maintained. Golden records are produced on a defined cadence and consumed by primary business systems. Coverage across all significant entity types is incomplete – typically strong on customer or product, weak on location, account hierarchy, or partner.",
      4: "MDM covers all significant entity domains with documented matching logic, survivorship rules, and stewardship workflows. Golden records are the authoritative source consumed by all enterprise systems and AI workloads. Data quality metrics for master data are tracked and owned. Exception workflows exist to handle conflicts and escalate ambiguous matches. New system onboarding includes a mandatory MDM integration step.",
      5: "Master data is a strategic, continuously maintained enterprise asset. MDM coverage is universal across all entity domains. Matching and survivorship logic is machine-learning-assisted, continuously validated, and tuned based on downstream quality signals. All AI workloads consume master data by default – no use case builds its own entity representation. MDM quality is monitored in real time, and deviations trigger automated stewardship workflows rather than requiring manual intervention.",
    },
  },
  {
    id: 9, // sheet row 10 (section 1 Q9)
    text: "Does the enterprise have a reliable, auditable inventory of its significant data assets – including what exists, where it lives, how old it is, who produced it, and how it has been used – or is the organization operating without a clear picture of what data it actually holds?",
    capability: "data_foundations",
    tooltip: "The data inventory is a fully automated, continuously updated capability. Metadata is harvested at ingestion and kept current across the full data lifecycle – from raw source through all transformation layers to consumption. The catalog includes AI-readiness signals, quality scores, lineage graphs, and impact analysis for every registered asset. Any team can discover, evaluate, and qualify data for a new use case without manual investigation. The organization can demonstrate complete data lineage and asset visibility to regulators, auditors, or executive stakeholders at any time.",
    maturityLevels: {
      1: "No enterprise data inventory exists. Knowledge of what data assets exist, where they live, and how current they are resides informally in individual teams. When a new AI use case begins, data discovery starts from scratch through interviews and exploratory queries. Redundant, stale, and undocumented datasets are routinely discovered mid-project.",
      2: "A partial inventory exists – typically a spreadsheet produced for a compliance audit or a migration project – covering the most visible systems. It is not maintained after the triggering event. Metadata (owner, lineage, freshness, usage) is missing for most entries. Data teams know the major assets but cannot reliably tell a use case team what historical depth is available or how a dataset was constructed.",
      3: "A data catalog is in place for primary enterprise data domains. Key assets are registered with owner, lineage, schema, and a freshness indicator. The catalog is maintained on a defined cadence, though coverage is incomplete for secondary systems and unstructured data. AI teams can use the catalog as a starting point for data discovery, but gaps require supplementary investigation and the catalog is not yet the single source of truth.",
      4: "The data catalog covers all significant enterprise data assets with reliable metadata – lineage, ownership, sensitivity classification, freshness, historical depth, and documented usage patterns. AI teams use the catalog as the mandatory first step for data discovery. Catalog entries are kept current through automated metadata harvesting and producer-owned data contracts. The organization can answer, on demand, what data it holds, how old it is, and who uses it.",
      5: "The data inventory is a fully automated, continuously updated capability. Metadata is harvested at ingestion and kept current across the full data lifecycle – from raw source through all transformation layers to consumption. The catalog includes AI-readiness signals, quality scores, lineage graphs, and impact analysis for every registered asset. Any team can discover, evaluate, and qualify data for a new use case without manual investigation. The organization can demonstrate complete data lineage and asset visibility to regulators, auditors, or executive stakeholders at any time.",
    },
  },
  {
    id: 10, // sheet row 11 (section 1 Q10)
    text: "To what extent is data quality, lineage, freshness, privacy controls, and AI access governance continuously monitored at the level AI requires – not just human-analyst tolerable – and do downstream use cases inherit compliant, trustworthy data?",
    capability: "data_foundations",
    tooltip: "AI-grade data governance is a managed organizational capability. Quality, lineage, freshness, and compliance are monitored continuously at the granularity AI systems require. Every significant data asset has a documented governance profile. Downstream AI use cases inherit compliant, trustworthy data by default – governance is not a project-level checklist but a foundation-layer property that every AI initiative builds on.",
    maturityLevels: {
      1: "Data governance is designed for human analysts, not AI systems. Quality, lineage, and freshness are not continuously monitored. Privacy controls are managed at the platform level rather than the data layer. Each AI use case is responsible for its own compliance and quality assessment, which means both are frequently skipped under delivery pressure.",
      2: "Basic data governance exists – some quality checks, some lineage documentation, some privacy controls – but it is not continuous, not comprehensive, and not calibrated to AI requirements. The standard for 'good enough' data is set by analyst tolerance rather than AI model requirements. Compliance is checked at deployment rather than enforced at the data layer.",
      3: "Data governance covers the most critical domains and includes quality monitoring, documented lineage for primary data flows, and privacy controls for regulated data categories. However, governance is not continuous, does not cover all AI-relevant data, and downstream use cases do not automatically inherit governance status – each team must assess compliance independently.",
      4: "Data governance is designed and operated to meet AI requirements. Quality, lineage, and freshness are continuously monitored for all production data assets used by AI systems. Privacy and access controls are enforced at the data layer. Most downstream AI use cases inherit governance status rather than managing it independently.",
      5: "AI-grade data governance is a managed organizational capability. Quality, lineage, freshness, and compliance are monitored continuously at the granularity AI systems require. Every significant data asset has a documented governance profile. Downstream AI use cases inherit compliant, trustworthy data by default – governance is not a project-level checklist but a foundation-layer property that every AI initiative builds on.",
    },
  },
  // ── Decisions and Use Cases (8) ───────────────
  {
    id: 11, // sheet row 12 (section 2 Q1)
    text: "When your organization identifies an AI initiative, how consistently can the team articulate the specific business decision it is designed to improve?",
    capability: "use_case_design",
    tooltip: "Every active AI initiative has a named decision owner, a defined decision it enables, and a documented rationale for why AI improves that decision.",
    maturityLevels: {
      1: "Initiatives are described in terms of technology or capability with no connection to a specific decision.",
      2: "Some initiatives have a decision framing but most are defined by the technology or function they serve.",
      3: "The team can articulate a decision for most initiatives when pushed, but it is not a standard part of how initiatives are scoped.",
      4: "Decision framing is a standard part of how most AI initiatives are proposed and approved.",
      5: "Every active AI initiative has a named decision owner, a defined decision it enables, and a documented rationale for why AI improves that decision.",
    },
  },
  {
    id: 12, // sheet row 13 (section 2 Q2)
    text: "How would you describe the way your organization currently decides which AI use cases to prioritize?",
    capability: "use_case_design",
    tooltip: "Prioritization is systematic, transparent, and ties directly to business value metrics the CFO would recognize; the process includes a formal mechanism to say no to lower-priority ideas.",
    maturityLevels: {
      1: "No formal process – initiatives are prioritized based on executive enthusiasm, vendor relationships, or what is technically available.",
      2: "Informal prioritization exists but criteria are inconsistent and not transparent across the organization.",
      3: "A prioritization framework exists but is applied inconsistently or only for large investments.",
      4: "A consistent framework is applied to most AI initiatives, incorporating impact, effort, and organizational readiness.",
      5: "Prioritization is systematic, transparent, and ties directly to business value metrics the CFO would recognize; the process includes a formal mechanism to say no to lower-priority ideas.",
    },
  },
  {
    id: 13, // sheet row 14 (section 2 Q3)
    text: "If a senior leader asked today how you will know in six months whether your most important AI initiative has worked, how confident are you in your answer?",
    capability: "use_case_design",
    tooltip: "A full measurement plan exists covering efficiency, quality, capability, and adoption metrics; results are reviewed on a defined cadence by leadership.",
    maturityLevels: {
      1: "No answer – success has not been defined in measurable terms.",
      2: "A general answer exists but no specific metrics or measurement plan.",
      3: "Metrics exist but they measure AI activity rather than business outcomes.",
      4: "Business outcome metrics are defined with a baseline and a target, and there is a named owner for tracking them.",
      5: "A full measurement plan exists covering efficiency, quality, capability, and adoption metrics; results are reviewed on a defined cadence by leadership.",
    },
  },
  {
    id: 14, // sheet row 15 (section 2 Q4)
    text: "What proportion of your current AI initiatives have a clearly defined decision owner – a specific person whose job it is to make a particular decision better or faster?",
    capability: "use_case_design",
    tooltip: "All significant initiatives have a named decision owner; this is a standard governance requirement before an initiative is approved.",
    maturityLevels: {
      1: "No initiatives have a named decision owner; ownership is either diffuse or assigned to the technology team.",
      2: "A minority of initiatives (fewer than 25%) have a named decision owner.",
      3: "Some initiatives (25–50%) have a named decision owner, typically the larger or more visible ones.",
      4: "Most initiatives (50–75%) have a named decision owner with clear accountability.",
      5: "All significant initiatives have a named decision owner; this is a standard governance requirement before an initiative is approved.",
    },
  },
  {
    id: 15, // sheet row 16 (section 2 Q5)
    text: "When a new AI idea surfaces in your organization, what typically happens to it?",
    capability: "use_case_design",
    tooltip: "A formal intake and evaluation process exists that is transparent, consistently applied, and includes a structured mechanism for saying no – the organization actively manages its AI backlog.",
    maturityLevels: {
      1: "Ideas either get immediate executive sponsorship and bypass evaluation, or they disappear into a backlog that is rarely revisited.",
      2: "Ideas are collected informally but there is no consistent process for evaluating or moving them forward.",
      3: "There is a review process but it focuses primarily on technical feasibility rather than business value or decision impact.",
      4: "Ideas are evaluated against a defined set of criteria including business value, data readiness, and organizational appetite before resources are committed.",
      5: "A formal intake and evaluation process exists that is transparent, consistently applied, and includes a structured mechanism for saying no – the organization actively manages its AI backlog.",
    },
  },
  {
    id: 16, // sheet row 17 (section 2 Q6)
    text: "How does your organization currently assess whether the data needed for a specific AI use case is available, governed, and sufficient?",
    capability: "use_case_design",
    tooltip: "Data readiness is assessed systematically before any use case is approved; the organization maintains a live view of data readiness by domain and uses it to inform prioritization.",
    maturityLevels: {
      1: "Data readiness is not assessed before use cases are approved – data gaps are typically discovered during or after development.",
      2: "Data readiness is informally assessed by the technical team but findings are rarely surfaced to decision-makers before commitment.",
      3: "A basic data readiness check is performed for major initiatives but it focuses on availability rather than quality, governance, or AI-readiness.",
      4: "Data readiness assessment is a standard part of the use case evaluation process, covering availability, quality, governance, and semantic context.",
      5: "Data readiness is assessed systematically before any use case is approved; the organization maintains a live view of data readiness by domain and uses it to inform prioritization.",
    },
  },
  {
    id: 17, // sheet row 18 (section 2 Q7)
    text: "How clearly does your organization distinguish between AI use cases that are Quick Wins (high value, low transformation effort) versus Strategic Bets (high value, high effort)?",
    capability: "use_case_design",
    tooltip: "The organization actively manages a portfolio of Quick Wins and Strategic Bets in parallel, with clear criteria for each and a defined mechanism for Quick Win learnings to inform Strategic Bet design.",
    maturityLevels: {
      1: "No distinction is made – all initiatives are treated with similar urgency and resource allocation regardless of complexity.",
      2: "The distinction is understood conceptually but not applied systematically in planning or resource allocation.",
      3: "The distinction is made informally and influences some resource decisions but is not embedded in the prioritization process.",
      4: "Quick Wins and Strategic Bets are explicitly identified in the initiative portfolio and resourced differently, with Quick Wins used to build organizational confidence and fund longer bets.",
      5: "The organization actively manages a portfolio of Quick Wins and Strategic Bets in parallel, with clear criteria for each and a defined mechanism for Quick Win learnings to inform Strategic Bet design.",
    },
  },
  {
    id: 18, // sheet row 21 (section 2 Q10)
    text: "How effectively does your organization say no to AI ideas that do not meet the readiness bar – use cases that cannot answer what decision they enable, what delay they eliminate, or how success will be measured?",
    capability: "use_case_design",
    tooltip: "Saying no is seen as a mark of AI maturity – the organization is proud of its discipline and uses declined ideas as a teaching tool to improve future use case quality.",
    maturityLevels: {
      1: "The organization rarely says no to AI ideas – there is significant pressure to be seen as innovative and doing something with AI.",
      2: "No is said occasionally but the criteria are inconsistent and the decision is often reversed under executive pressure.",
      3: "A readiness bar exists but it is applied selectively – major initiatives face scrutiny but smaller ones often bypass the process.",
      4: "The readiness bar is applied consistently and there is organizational support for declining or deferring ideas that do not meet it.",
      5: "Saying no is seen as a mark of AI maturity – the organization is proud of its discipline and uses declined ideas as a teaching tool to improve future use case quality.",
    },
  },
  // ── Organizational Alignment (8) ───────────────
  {
    id: 19, // sheet row 22 (section 3 Q1)
    text: "When your organization deploys an AI tool into a team's workflow, how often is the underlying workflow itself redesigned – not just the addition of an AI step to an existing process?",
    capability: "work_design",
    tooltip: "Workflow redesign precedes every significant AI deployment; the organization treats process design as a prerequisite for AI value, not an afterthought.",
    maturityLevels: {
      1: "Workflows are never formally redesigned – AI is inserted as an additional step into processes that otherwise remain unchanged.",
      2: "Workflow redesign happens occasionally but only for major, highly visible implementations; most AI deployments are additive rather than transformative.",
      3: "Workflow redesign is discussed as part of most AI deployments but the actual redesign is superficial – steps are relabeled rather than restructured.",
      4: "Workflow redesign is a standard part of most significant AI deployments; processes are redrawn before the AI system is built, not after.",
      5: "Workflow redesign precedes every significant AI deployment; the organization treats process design as a prerequisite for AI value, not an afterthought.",
    },
  },
  {
    id: 20, // sheet row 23 (section 3 Q2)
    text: "How clearly has your organization defined which tasks AI will handle versus which tasks require human judgment at each step of your key workflows?",
    capability: "work_design",
    tooltip: "Every significant AI-enabled workflow has a current, documented human-AI task map that is reviewed regularly and updated as the AI system matures; the map drives role design and performance management.",
    maturityLevels: {
      1: "No explicit mapping exists – the division of labor between AI and humans is assumed or left to individual discretion.",
      2: "A rough division of labor exists in the minds of the implementation team but has not been documented or communicated to the people doing the work.",
      3: "Human-AI task mapping has been done for some workflows but is inconsistent across the organization and often becomes outdated quickly.",
      4: "Human-AI task mapping is documented for most significant workflows and is used to design roles, training, and accountability structures.",
      5: "Every significant AI-enabled workflow has a current, documented human-AI task map that is reviewed regularly and updated as the AI system matures; the map drives role design and performance management.",
    },
  },
  {
    id: 21, // sheet row 24 (section 3 Q3)
    text: "How would you characterize your organization's primary response to the AI skills gap – training people on AI tools, or redesigning work so that AI handles more of what people currently do manually?",
    capability: "work_design",
    tooltip: "The organization explicitly manages training and workflow redesign as complementary interventions; training addresses skills, redesign addresses structure, and both are sequenced deliberately.",
    maturityLevels: {
      1: "The response is exclusively training-focused – the assumption is that if people learn to use AI tools, transformation will follow.",
      2: "Training dominates the response with occasional workflow redesign for high-visibility use cases; redesign is not systematic.",
      3: "The organization recognizes that training alone is insufficient but workflow redesign has not been formalized as a parallel workstream.",
      4: "Training and workflow redesign are treated as parallel workstreams with defined owners and coordinated delivery.",
      5: "The organization explicitly manages training and workflow redesign as complementary interventions; training addresses skills, redesign addresses structure, and both are sequenced deliberately.",
    },
  },
  {
    id: 22, // sheet row 26 (section 3 Q5)
    text: "How formally does your organization manage the change required when AI is introduced into a team's workflow – communication, role transition, adoption tracking?",
    capability: "work_design",
    tooltip: "Change management is treated as equally important as technical delivery; the organization has a repeatable methodology for AI deployments and tracks adoption as rigorously as technical performance.",
    maturityLevels: {
      1: "Change management is not a formal part of AI deployments – tools are deployed and people are expected to adapt.",
      2: "Change management is informal – a few communications are sent and some training is offered but there is no structured adoption plan.",
      3: "A change management plan exists for major deployments but it focuses primarily on technical onboarding rather than behavioral and role change.",
      4: "Change management is a formal workstream for most significant AI deployments, covering communication, training, role transition, and adoption measurement.",
      5: "Change management is treated as equally important as technical delivery; the organization has a repeatable methodology for AI deployments and tracks adoption as rigorously as technical performance.",
    },
  },
  {
    id: 23, // sheet row 27 (section 3 Q6)
    text: "When AI is introduced into a workflow, how deliberately does your organization redefine the roles of the people in that workflow – their responsibilities, their performance metrics, and their career development?",
    capability: "work_design",
    tooltip: "Role redesign is a leading indicator of AI deployment maturity – the organization proactively redefines roles, codifies human-AI collaboration expectations, and updates career frameworks before deployment.",
    maturityLevels: {
      1: "Roles are not formally redefined – people are expected to figure out how their job changes on their own.",
      2: "Informal guidance is provided but job descriptions, performance metrics, and career paths are not updated to reflect the new human-AI collaboration model.",
      3: "Some roles are formally redefined for major deployments but the practice is inconsistent and often lags the technical implementation significantly.",
      4: "Role redesign is a standard part of significant AI deployments; job descriptions and performance metrics are updated before or alongside the technical rollout.",
      5: "Role redesign is a leading indicator of AI deployment maturity – the organization proactively redefines roles, codifies human-AI collaboration expectations, and updates career frameworks before deployment.",
    },
  },
  {
    id: 24, // sheet row 28 (section 3 Q7)
    text: "How well does your organization understand which of its current workflows are fragmented – operating across functions or systems in ways that prevent AI from delivering end-to-end value?",
    capability: "work_design",
    tooltip: "Workflow mapping is a systematic capability – the organization regularly maps and updates its key workflows, uses fragmentation analysis to prioritize AI investment, and has a clear view of which processes are AI-ready versus which need redesign first.",
    maturityLevels: {
      1: "Workflow fragmentation is not systematically understood – the organization operates in functional silos with no cross-functional view of end-to-end processes.",
      2: "Fragmentation is recognized as a problem but has not been mapped or quantified; the impact on AI value realization is not well understood.",
      3: "Key workflows have been mapped at a high level but the analysis has not gone deep enough to identify the specific handoffs and data gaps that prevent AI from operating end-to-end.",
      4: "Most significant workflows have been mapped in sufficient detail to identify fragmentation points and prioritize redesign; this analysis informs AI use case selection.",
      5: "Workflow mapping is a systematic capability – the organization regularly maps and updates its key workflows, uses fragmentation analysis to prioritize AI investment, and has a clear view of which processes are AI-ready versus which need redesign first.",
    },
  },
  {
    id: 25, // sheet row 29 (section 3 Q8)
    text: "How effectively does your organization use AI performance data – adoption rates, output quality, time savings – to continuously improve both the AI system and the workflow it operates within?",
    capability: "work_design",
    tooltip: "Continuous improvement is a core operating principle – the organization has a formal feedback loop from AI performance data to workflow redesign, and improvement velocity is tracked as a measure of organizational AI maturity.",
    maturityLevels: {
      1: "AI performance data is not collected or reviewed systematically after deployment; the system is treated as done once it goes live.",
      2: "Some performance data is collected but it is reviewed informally and rarely leads to structured improvements to the system or the workflow.",
      3: "Performance data is reviewed periodically but improvement cycles are slow and often require significant effort to translate data into workflow changes.",
      4: "A structured improvement cycle exists – performance data is reviewed on a defined cadence, findings are prioritized, and both the AI system and the workflow are updated regularly.",
      5: "Continuous improvement is a core operating principle – the organization has a formal feedback loop from AI performance data to workflow redesign, and improvement velocity is tracked as a measure of organizational AI maturity.",
    },
  },
  {
    id: 26, // sheet row 31 (section 3 Q10)
    text: "How prepared is your organization to sustain AI-driven workflow changes over time – as the AI system evolves, as the business changes, and as the people in the workflow turn over?",
    capability: "work_design",
    tooltip: "AI sustainability is a first-class capability – the organization treats AI-enabled workflows as living systems that require ongoing investment, with dedicated roles, processes, and budgets to sustain them.",
    maturityLevels: {
      1: "No sustainability plan exists – AI deployments are treated as projects with an end date rather than as ongoing capabilities that require stewardship.",
      2: "Sustainability is discussed but not planned – there is an implicit assumption that the system will keep working and people will figure out how to adapt.",
      3: "Some sustainability mechanisms exist (documentation, training materials) but they are not sufficient to maintain capability through significant system or personnel changes.",
      4: "A sustainability plan exists for most significant AI deployments, covering system maintenance, workflow updates, training refreshes, and ownership transitions.",
      5: "AI sustainability is a first-class capability – the organization treats AI-enabled workflows as living systems that require ongoing investment, with dedicated roles, processes, and budgets to sustain them.",
    },
  },
  // ── AI Systems and Trust (8) ───────────────
  {
    id: 27, // sheet row 32 (section 4 Q1)
    text: "To what extent is each AI system evaluated against a defined framework – accuracy, consistency, trust, failure patterns – with results visible to leadership rather than buried in engineering Jira?",
    capability: "ai_assurance",
    tooltip: "AI system evaluation is a managed operational capability. The framework covers accuracy, consistency, trust, and failure patterns across all production systems. Results are visible to leadership in real time, benchmarked over time, and used actively to drive reinvestment and retirement decisions.",
    maturityLevels: {
      1: "No evaluation framework exists. AI system performance is assessed informally by the engineering team when issues surface. Leadership has no visibility into how AI systems are performing.",
      2: "Some technical metrics are tracked (accuracy, error rates) but they live in engineering tools and are never surfaced to business leadership. No standard framework is applied across initiatives.",
      3: "An evaluation framework exists covering accuracy, consistency, and failure patterns, but it is applied inconsistently and results are reported in technical terms that business leaders cannot act on.",
      4: "Every significant AI system is evaluated against a standard framework with results translated into business-readable metrics and reviewed by leadership on a defined cadence. Failure patterns are tracked and addressed systematically.",
      5: "AI system evaluation is a managed operational capability. The framework covers accuracy, consistency, trust, and failure patterns across all production systems. Results are visible to leadership in real time, benchmarked over time, and used actively to drive reinvestment and retirement decisions.",
    },
  },
  {
    id: 28, // sheet row 33 (section 4 Q2)
    text: "What is your team's view on how AI quality should be measured? What feels settled, and what feels unresolved?",
    capability: "ai_assurance",
    tooltip: "Quality measurement is a mature operational capability – the organization has defined standards for each AI system type, applies them at launch and in ongoing monitoring, and uses quality data to drive continuous improvement.",
    maturityLevels: {
      1: "AI quality is not formally defined – there are no agreed criteria for what good output looks like, and evaluation is left to individual judgment after the fact.",
      2: "Quality is discussed informally and there is loose consensus on a few dimensions but no documented standards or measurement methodology.",
      3: "Quality criteria are defined for some use cases but coverage is inconsistent; the organization has not resolved how to measure quality for generative or probabilistic AI outputs.",
      4: "Quality measurement is standardized for most significant use cases, covering technical accuracy, output relevance, business impact, and user satisfaction; results are tracked over time.",
      5: "Quality measurement is a mature operational capability – the organization has defined standards for each AI system type, applies them at launch and in ongoing monitoring, and uses quality data to drive continuous improvement.",
    },
  },
  {
    id: 29, // sheet row 34 (section 4 Q3)
    text: "How do you think about the relationship between AI systems and the people who rely on them in your business?",
    capability: "ai_assurance",
    tooltip: "Human-AI relationship design is a systematic capability – every AI deployment includes a defined trust model for end users, regular calibration of reliance behaviors, and a feedback loop from users to system improvement.",
    maturityLevels: {
      1: "The relationship between AI systems and users is not a design consideration – AI is deployed as a tool and adoption is expected to happen naturally.",
      2: "The organization recognizes that AI-user relationships matter but has not formally designed for trust, transparency, or appropriate reliance; issues are addressed reactively.",
      3: "Human-AI relationship design is discussed for major deployments – explainability, override mechanisms, and user feedback channels are considered, if not always implemented.",
      4: "Most significant AI systems are designed with explicit human-AI relationship principles: users understand what the AI does, when to trust it, and how to escalate or override its outputs.",
      5: "Human-AI relationship design is a systematic capability – every AI deployment includes a defined trust model for end users, regular calibration of reliance behaviors, and a feedback loop from users to system improvement.",
    },
  },
  {
    id: 30, // sheet row 35 (section 4 Q4)
    text: "To what extent are user feedback loops engineered into AI systems – so the system gets better with use and users see their feedback close the loop?",
    capability: "ai_assurance",
    tooltip: "Feedback loops are a first-class engineering requirement. Every AI system has a defined feedback architecture, improvement cycle, and user communication model. The organization tracks feedback-to-improvement velocity as a measure of AI system maturity.",
    maturityLevels: {
      1: "No feedback mechanisms exist. Users have no way to flag poor AI outputs. The system does not improve with use and there is no channel between the people using the AI and the teams building it.",
      2: "Ad hoc feedback exists – users can email or Slack the AI team – but it is not systematized, not tracked, and rarely leads to visible model improvements. Users have no confirmation their input was received or acted on.",
      3: "A feedback mechanism is built into most significant AI systems (thumbs up/down, flagging), but feedback data is inconsistently reviewed, improvement cycles are slow, and users rarely see evidence that their input changed anything.",
      4: "Feedback loops are engineered into AI systems by design. Input is captured, reviewed on a defined cadence, and used to improve model performance. Users receive visible signals – updated outputs, release notes, in-product acknowledgment – that their feedback influenced the system.",
      5: "Feedback loops are a first-class engineering requirement. Every AI system has a defined feedback architecture, improvement cycle, and user communication model. The organization tracks feedback-to-improvement velocity as a measure of AI system maturity.",
    },
  },
  {
    id: 31, // sheet row 36 (section 4 Q5)
    text: "To what extent is client-owned AI infrastructure preferred where it matters – so the client can evolve and govern the system rather than being locked into a vendor's release cadence?",
    capability: "ai_assurance",
    tooltip: "Client-owned infrastructure is a defined strategic position. The organization actively manages a portfolio of owned and vendored AI capabilities, with clear criteria for each category and a roadmap for migrating strategic capabilities out of vendor lock-in. Governance, evolution, and release decisions for owned systems sit with the client, not the vendor.",
    maturityLevels: {
      1: "No infrastructure ownership strategy exists. Vendors are selected based on feature availability and sales relationships. The organization has no view of where vendor lock-in creates strategic risk and has made no deliberate choices about what to own versus what to outsource.",
      2: "Vendor lock-in is recognized as a risk in principle but has not influenced procurement decisions. The organization is aware it depends heavily on a small number of vendors but has no framework for evaluating when ownership matters and no plan to address existing dependencies.",
      3: "An infrastructure ownership framework exists that distinguishes between commodity AI capabilities (accept vendor dependency) and strategic capabilities (prefer client ownership). The framework is applied to new investments but legacy dependencies have not been addressed and enforcement is inconsistent.",
      4: "Infrastructure ownership decisions are made deliberately and consistently. Strategic AI capabilities – models, data pipelines, evaluation frameworks – are owned and governed by the client. Vendor relationships are structured to preserve portability. Build-versus-buy decisions are reviewed by leadership and documented",
      5: "Client-owned infrastructure is a defined strategic position. The organization actively manages a portfolio of owned and vendored AI capabilities, with clear criteria for each category and a roadmap for migrating strategic capabilities out of vendor lock-in. Governance, evolution, and release decisions for owned systems sit with the client, not the vendor.",
    },
  },
  {
    id: 32, // sheet row 37 (section 4 Q6)
    text: "To what extent does the organization accept that \"done\" doesn't exist – and budget for ongoing watch / refinement – rather than declaring victory at launch?",
    capability: "ai_assurance",
    tooltip: "The organization has fully internalized that AI systems are living capabilities, not delivered products. Ongoing refinement is a standing budget line, not a negotiated exception. Improvement velocity – how quickly the system gets better post-launch – is tracked as a measure of AI program maturity alongside initial deployment metrics.",
    maturityLevels: {
      1: "AI deployments are treated as projects with a hard end date. Budget, team, and attention evaporate at launch. There is no post-launch monitoring, no refinement cycle, and no ownership model for what happens when the system degrades or the business context shifts.",
      2: "Post-launch monitoring exists informally – someone checks in occasionally – but there is no dedicated budget, no defined cadence, and no clear owner. When performance degrades, it is treated as a new project rather than expected ongoing maintenance.",
      3: "The need for ongoing refinement is acknowledged and some AI systems have a named owner and a loose monitoring cadence post-launch. However, refinement budgets are negotiated initiative by initiative and are frequently cut in planning cycles that treat launch as the finish line.",
      4: "Ongoing watch and refinement are built into the operating model for all production AI systems. Each system has a named owner, a monitoring cadence, a defined refinement budget, and a trigger framework that specifies when intervention is required. Leadership reviews post-launch performance on a defined schedule.",
      5: "The organization has fully internalized that AI systems are living capabilities, not delivered products. Ongoing refinement is a standing budget line, not a negotiated exception. Improvement velocity – how quickly the system gets better post-launch – is tracked as a measure of AI program maturity alongside initial deployment metrics.",
    },
  },
  {
    id: 33, // sheet row 38 (section 4 Q7)
    text: "How do you and your team think about trust when it comes to AI? What does the word mean to you in this context?",
    capability: "ai_assurance",
    tooltip: "Trust is a first-class design requirement for every AI system – the organization applies a formal trustworthiness framework at the use case level, reviews it regularly, and communicates standards to all stakeholders.",
    maturityLevels: {
      1: "Trust is not a framed concept in the organization – AI is evaluated on technical performance only, and questions of trust, fairness, or accountability have not been raised.",
      2: "Trust comes up informally but means different things to different people; there is no shared definition or criteria for what trustworthy AI looks like in this organization.",
      3: "The organization has begun to discuss trust in structured terms – reliability, transparency, and bias are recognized as relevant dimensions, but no formal framework or policy exists.",
      4: "A shared definition of AI trustworthiness exists and is applied to most significant deployments; criteria include accuracy, explainability, fairness, and human oversight, with named accountability.",
      5: "Trust is a first-class design requirement for every AI system – the organization applies a formal trustworthiness framework at the use case level, reviews it regularly, and communicates standards to all stakeholders.",
    },
  },
  {
    id: 34, // sheet row 41 (section 4 Q10)
    text: "When your AI system produces a recommendation or decision, how easy is it for the person relying on it to override it – and does the organization track how often that happens and why?",
    capability: "ai_assurance",
    tooltip: "Override rate is a strategic diagnostic. The organization monitors override frequency and reasons across all production AI systems and uses the data to assess whether users are appropriately calibrated – neither blindly accepting nor reflexively rejecting AI outputs. Sustained high override rates trigger a use case review. Sustained low override rates in high-stakes systems trigger an over-reliance audit. Both are treated as maturity signals, not just performance metrics.",
    maturityLevels: {
      1: "No override mechanism exists. Users either accept AI outputs without recourse or route exceptions through informal workarounds. Override is not a design consideration – the system was built assuming acceptance. No data on how users actually interact with AI outputs is collected.",
      2: "An override mechanism exists in some systems but it is clunky, undocumented, or discouraged. Users who override feel they are working against the system rather than with it. Override events are not logged and no one reviews why overrides happen.",
      3: "Override capability is built into most significant AI systems and is accessible without friction. However, override data is captured inconsistently, reviewed infrequently, and not connected to model improvement cycles. The organization does not yet treat override rate as a meaningful signal about system trust or performance.",
      4: "Override is a first-class design requirement. Every AI system has a clearly surfaced, friction-free override mechanism. Override events are logged with reason codes, reviewed on a defined cadence, and used to identify calibration gaps between AI confidence and human judgment. Patterns inform model refinement and retraining decisions.",
      5: "Override rate is a strategic diagnostic. The organization monitors override frequency and reasons across all production AI systems and uses the data to assess whether users are appropriately calibrated – neither blindly accepting nor reflexively rejecting AI outputs. Sustained high override rates trigger a use case review. Sustained low override rates in high-stakes systems trigger an over-reliance audit. Both are treated as maturity signals, not just performance metrics.",
    },
  },
  // ── Intelligence and Insights (9) ───────────────
  {
    id: 35, // sheet row 42 (section 5 Q1)
    text: "To what extent does the enterprise deliver intelligence at every altitude – strategic (C-suite portfolio direction), operational (VPs, directors, managers), execution (analysts, specialists) – with the right depth and frequency for each?",
    capability: "intelligence_delivery",
    tooltip: "Insight delivery is a managed capability – role-based insight requirements are regularly reviewed, updated as roles evolve with AI, and used to drive the analytics and AI product roadmap.",
    maturityLevels: {
      1: "Insight delivery is not differentiated by role – everyone receives the same reports or has access to the same tools, regardless of whether those outputs match their decision-making needs.",
      2: "There is informal awareness that different roles need different insights but no systematic design; some teams have built their own workarounds and others go without.",
      3: "Insight delivery is differentiated for a few key roles but most of the organization operates on generic reporting that does not map to specific decisions or workflows.",
      4: "Insight delivery is designed around defined role archetypes – what each role needs to decide, how often, and in what format; most significant roles have purpose-built analytics or AI-assisted views.",
      5: "Insight delivery is a managed capability – role-based insight requirements are regularly reviewed, updated as roles evolve with AI, and used to drive the analytics and AI product roadmap.",
    },
  },
  {
    id: 36, // sheet row 43 (section 5 Q2)
    text: "To what extent does intelligence operate in both modes – pull (dashboards, conversational interfaces, ad-hoc queries) AND push (scheduled briefings, triggered alerts, automated digests) – rather than only the pull side?",
    capability: "intelligence_delivery",
    tooltip: "Intelligence delivery is a managed capability operating in both modes by design. Push outputs are triggered by business logic, not just schedules – alerts fire when conditions warrant, briefings adapt to what has changed. Pull tools support natural-language queries. The organization continuously reviews whether the right signals are reaching the right people at the right time.",
    maturityLevels: {
      1: "Intelligence is pull-only and passive. Users must seek out dashboards or request reports. Nothing is proactively delivered. Decision-makers only access data when they remember to look for it, which means time-sensitive signals are routinely missed.",
      2: "Pull infrastructure exists (dashboards, static reports) and some push mechanisms have been built ad hoc – typically a scheduled email report or a basic alert. Push outputs are not governed, frequently go stale, and are rarely connected to the decisions they are meant to inform.",
      3: "Both pull and push modes exist for the most critical use cases. Dashboards are maintained, and a defined set of scheduled briefings and threshold alerts is in operation. However, coverage is uneven – some functions have mature delivery, others rely entirely on pull, and push outputs are not consistently reviewed for relevance or accuracy.",
      4: "Pull and push intelligence are both designed and governed across the most significant decision domains. Decision-makers receive proactive briefings and alerts calibrated to their role. Self-service pull tools are available for ad-hoc needs. The two modes are treated as complementary, not competing, and ownership is clear for each.",
      5: "Intelligence delivery is a managed capability operating in both modes by design. Push outputs are triggered by business logic, not just schedules – alerts fire when conditions warrant, briefings adapt to what has changed. Pull tools support natural-language queries. The organization continuously reviews whether the right signals are reaching the right people at the right time.",
    },
  },
  {
    id: 37, // sheet row 44 (section 5 Q3)
    text: "To what extent are conversational insights systems live – letting decision-makers ask natural-language questions of governed data and get accurate, cited answers?",
    capability: "intelligence_delivery",
    tooltip: "Conversational intelligence is a core part of the decision-making operating model. Decision-makers at multiple levels query governed data in natural language as a standard practice. Accuracy, citation quality, and query coverage are measured and reported. The system evolves as new data domains are onboarded and as decision-maker needs change.",
    maturityLevels: {
      1: "No conversational intelligence exists. All data access requires knowing which report or dashboard to find, or submitting a request to an analyst. Natural-language querying of business data is not available in any form.",
      2: "Conversational or natural-language query tools have been explored or piloted, but no production system is live. Proofs-of-concept exist, but accuracy, data governance, and trust concerns have prevented deployment. Decision-makers still route all ad-hoc questions through analysts.",
      3: "A conversational intelligence tool is live for at least one function or data domain. Users can ask natural-language questions and receive answers, but coverage is narrow, cited sources are inconsistent, and confidence in accuracy is not high enough for the tool to be used for consequential decisions without analyst validation.",
      4: "Conversational intelligence is available across most significant data domains and is used by decision-makers for routine ad-hoc queries without requiring analyst involvement. Answers are cited to governed data sources. Accuracy is monitored and the system is maintained to reflect current data definitions and business logic.",
      5: "Conversational intelligence is a core part of the decision-making operating model. Decision-makers at multiple levels query governed data in natural language as a standard practice. Accuracy, citation quality, and query coverage are measured and reported. The system evolves as new data domains are onboarded and as decision-maker needs change.",
    },
  },
  {
    id: 38, // sheet row 45 (section 5 Q4)
    text: "To what extent has the organization eliminated the \"two-week wait for a basic question\" pattern – through automated reporting, self-service intelligence, and conversational query – rather than queueing every request through analysts?",
    capability: "intelligence_delivery",
    tooltip: "The analytics team does not produce routine reports. That work is fully automated or self-served. Analyst capacity is allocated entirely to work that requires judgment – scenario modeling, causal analysis, strategic framing. The organization tracks what proportion of data questions are answered without analyst involvement and uses that metric to measure the maturity of its intelligence infrastructure.",
    maturityLevels: {
      1: "All data requests – from simple counts to complex analyses – are routed through a centralized analytics team or data engineering queue. Wait times for basic questions routinely exceed a week. Decision-makers have no self-service alternative and have adapted by either waiting or making decisions without data.",
      2: "Some self-service capability exists (basic dashboards, Excel exports) that addresses the most common recurring questions. However, any non-standard request still requires analyst involvement, the queue is a persistent bottleneck, and the self-service tools do not cover enough use cases to materially reduce demand on the analytics team.",
      3: "Self-service intelligence covers a meaningful portion of recurring analytical needs. Automated reports and dashboards have reduced routine analyst requests. However, ad-hoc or exploratory questions still require analyst involvement, and the organization has not yet built the conversational or natural-language query capability needed to close the remaining gap.",
      4: "The two-week wait pattern has been largely eliminated for routine and moderately complex questions. Automated reporting covers recurring needs, self-service tools handle exploration, and conversational query handles ad-hoc questions. Analyst time is redirected from report generation to interpretation, modeling, and strategic analysis.",
      5: "The analytics team does not produce routine reports. That work is fully automated or self-served. Analyst capacity is allocated entirely to work that requires judgment – scenario modeling, causal analysis, strategic framing. The organization tracks what proportion of data questions are answered without analyst involvement and uses that metric to measure the maturity of its intelligence infrastructure.",
    },
  },
  {
    id: 39, // sheet row 46 (section 5 Q5)
    text: "To what extent are anomalies, threshold-based alerts, and proactive risk / opportunity signals delivered automatically – rather than discovered by manually scanning dashboards?",
    capability: "intelligence_delivery",
    tooltip: "Proactive signal delivery is a strategic intelligence capability. Anomaly detection is dynamic, adjusting thresholds as business context evolves. Risk and opportunity signals are automatically prioritized by potential impact and delivered with contextual framing – not just a number out of range, but an explanation of what it means and what actions are available. The organization measures how often automated signals drive decisions versus how often decisions are made without them.",
    maturityLevels: {
      1: "No automated alerting exists. Anomalies and risks are discovered by analysts or decision-makers who happen to look at the right dashboard at the right time. The organization has no systematic mechanism for surfacing signals that fall outside normal parameters without human inspection.",
      2: "Basic threshold alerts exist for a small number of critical metrics – typically revenue, system uptime, or fraud – but coverage is narrow and the alerts are technically functional rather than business-contextual. Most anomalies are still discovered manually. Alert fatigue from poorly calibrated thresholds is a recurring complaint.",
      3: "A defined set of business-relevant alerts and anomaly detections is in operation across the most critical data domains. Thresholds are reviewed periodically and alerts are routed to named owners. However, coverage gaps remain and the system relies on static thresholds rather than dynamic or ML-driven anomaly detection that adapts to changing baselines.",
      4: "Automated anomaly detection and alerting covers all significant business metrics. Alerts are calibrated to reduce noise and routed to the decision-maker best positioned to act. The system distinguishes between risk signals and opportunity signals. Alert accuracy and response rates are tracked.",
      5: "Proactive signal delivery is a strategic intelligence capability. Anomaly detection is dynamic, adjusting thresholds as business context evolves. Risk and opportunity signals are automatically prioritized by potential impact and delivered with contextual framing – not just a number out of range, but an explanation of what it means and what actions are available. The organization measures how often automated signals drive decisions versus how often decisions are made without them.",
    },
  },
  {
    id: 40, // sheet row 47 (section 5 Q6)
    text: "To what extent do reports and intelligence outputs evolve as the business changes – refreshed automatically – rather than requiring quarterly manual rebuilding?",
    capability: "intelligence_delivery",
    tooltip: "Intelligence outputs are treated as living products, not delivered artifacts. Automated pipelines keep data current, governance processes keep logic current, and a defined ownership model ensures someone is accountable for every significant output. The organization tracks report freshness as an operational metric and has eliminated the quarterly manual rebuild cycle entirely.",
    maturityLevels: {
      1: "Reports and intelligence outputs are built manually and rebuilt manually when the business changes. There is no automated refresh mechanism. Report maintenance is a significant recurring cost for the analytics team and outputs frequently go stale between rebuild cycles, eroding trust in the numbers.",
      2: "Some reports refresh automatically on a schedule (daily, weekly data pulls) but the report structure, metrics, and logic are static. When business definitions, KPIs, or organizational structures change, reports require manual intervention to update. Stale logic in live reports is a persistent problem that is frequently discovered by users rather than the team.",
      3: "A governance process exists for keeping reports current when significant business changes occur. Most high-priority reports are automatically refreshed for data. Metric definitions are documented and versioned. However, the refresh process still requires manual effort when business logic changes and coverage of lower-priority outputs is inconsistent.",
      4: "Intelligence outputs are automatically refreshed for both data and logic changes for all significant reports. A defined change management process ensures that metric redefinitions, org restructures, and product changes propagate into reports within a governed timeframe. Users are notified when definitions change and can access version history.",
      5: "Intelligence outputs are treated as living products, not delivered artifacts. Automated pipelines keep data current, governance processes keep logic current, and a defined ownership model ensures someone is accountable for every significant output. The organization tracks report freshness as an operational metric and has eliminated the quarterly manual rebuild cycle entirely.",
    },
  },
  {
    id: 41, // sheet row 48 (section 5 Q7)
    text: "Where do you feel your organization's relationship with its intelligence is strongest? Where is it most strained?",
    capability: "intelligence_delivery",
    tooltip: "Data intelligence and insights are continuously monitored – the organization maintains a live data health view, uses it to guide AI investment, and has a systematic program for improving coverage, quality, and governance across its data estate.",
    maturityLevels: {
      1: "The organization does not have a clear view of its intelligence strengths and gaps – data is used functionally within teams but has not been assessed or mapped at an organizational level.",
      2: "There is informal awareness of where intelligence is reliable and where it breaks down but no formal assessment or remediation plan.",
      3: "A partial intelligence landscape assessment exists; the organization understands its primary intelligence domains but has not fully mapped quality, coverage, or AI-readiness across all decision-relevant data.",
      4: "The organization has a clear, documented view of its intelligence strengths and gaps by domain; this assessment informs AI use case prioritization and there is an active program to close the most critical gaps.",
      5: "Data intelligence and insights are continuously monitored – the organization maintains a live data health view, uses it to guide AI investment, and has a systematic program for improving coverage, quality, and governance across its data estate.",
    },
  },
  {
    id: 42, // sheet row 50 (section 5 Q9)
    text: "What is something you have tried in this space that did not go the way you hoped, and what did you take from it?",
    capability: "intelligence_delivery",
    tooltip: "The organization treats AI failures as a strategic learning resource – post-mortems are standard practice, lessons are catalogued, failure patterns are tracked over time, and insights actively shape the AI roadmap and investment criteria.",
    maturityLevels: {
      1: "The organization has not yet tried enough in this space to have meaningful failures – AI efforts are too early or too limited to have produced instructive disappointments.",
      2: "Failures have occurred but they have not been formally examined – the organization moved on without documenting what went wrong or changing how future efforts are designed.",
      3: "Some failures have been informally discussed and produced practical adjustments, but lessons are not systematically captured or shared across teams; the same mistakes tend to recur.",
      4: "Significant failures have been formally reviewed; root causes were documented, lessons were shared across the AI program, and specific process or governance changes were made as a result.",
      5: "The organization treats AI failures as a strategic learning resource – post-mortems are standard practice, lessons are catalogued, failure patterns are tracked over time, and insights actively shape the AI roadmap and investment criteria.",
    },
  },
  {
    id: 43, // sheet row 51 (section 5 Q10)
    text: "Typically, when you need an intelligent observation, report, model, or any insight, how long does it take your organization to produce the output.",
    capability: "intelligence_delivery",
    tooltip: "Simple questions resolve in minutes. Complex models have a defined SLA – typically 24–48 hours. The organization knows its insight latency by question type and treats reduction in that latency as a strategic investment.",
    maturityLevels: {
      1: "Everything requires a ticket and a queue. Most requests take weeks; basic questions take days. No self-service exists. Decision-makers have learned to decide without data rather than wait.",
      2: "Recurring questions are answered in days via standing reports. Ad-hoc requests still require analyst involvement measured in days to weeks. Self-service covers a narrow slice. Anything new restarts the queue.",
      3: "Routine questions are answered within 24–48 hours through automated reporting and dashboards. Complex or novel requests still take one to two weeks. The queue is smaller but not gone.",
      4: "Most ad-hoc questions are answered within hours through self-service or conversational query. Analyst time is reserved for judgment-intensive work. Time-to-insight is tracked as an operational metric.",
      5: "Simple questions resolve in minutes. Complex models have a defined SLA – typically 24–48 hours. The organization knows its insight latency by question type and treats reduction in that latency as a strategic investment.",
    },
  },
  // ── Adoption & Governance (value realization, pulled across sections) (7) ───────────────
  {
    id: 44, // sheet row 19 (section 2 Q8)
    text: "When your organization defines a success metric for an AI initiative, how often does that metric survive to the point where it is actually measured?",
    capability: "adoption_governance",
    tooltip: "Every significant AI initiative has a measurement plan defined before build began; results feed directly into reinvestment and prioritization decisions.",
    maturityLevels: {
      1: "Success metrics are rarely defined upfront and almost never measured in a way that is reported to leadership.",
      2: "Metrics are sometimes defined but tracking rarely happens beyond the immediate project team; leadership reviews are qualitative.",
      3: "Metrics are defined and tracked for major initiatives but reporting is inconsistent and often lags significantly behind implementation.",
      4: "Metrics are defined, baselined, and tracked consistently for most initiatives; results are reported to leadership on a defined cadence.",
      5: "Every significant AI initiative has a measurement plan defined before build began; results feed directly into reinvestment and prioritization decisions.",
    },
  },
  {
    id: 45, // sheet row 20 (section 2 Q9)
    text: "How well does your organization connect AI use case performance back to business outcomes that matter to the CFO – revenue impact, cost reduction, margin improvement?",
    capability: "adoption_governance",
    tooltip: "Every significant AI initiative has a CFO-credible financial impact model defined before build began; realized value is tracked and reported as a standard part of the business review process.",
    maturityLevels: {
      1: "AI performance is tracked in technical or operational terms only with no connection to financial outcomes.",
      2: "Occasional attempts are made to connect AI performance to financial outcomes but the methodology is inconsistent and rarely credible to the CFO.",
      3: "Some use cases have a defined financial impact model but it was built after the fact rather than as part of the original use case definition.",
      4: "Financial impact is modeled as part of use case definition for most significant initiatives, and actual results are tracked against the model.",
      5: "Every significant AI initiative has a CFO-credible financial impact model defined before build began; realized value is tracked and reported as a standard part of the business review process.",
    },
  },
  {
    id: 46, // sheet row 25 (section 3 Q4)
    text: "How consistent is the understanding of AI's role and potential across your marketing, technology, and data teams?",
    capability: "adoption_governance",
    tooltip: "Cross-functional alignment is a distinctive strength – marketing, technology, and data operate from a shared AI vision with unified metrics, integrated planning, and joint accountability for outcomes.",
    maturityLevels: {
      1: "Each function has a fundamentally different view of what AI is for and who owns it – there is active tension or competition rather than collaboration.",
      2: "Alignment exists at the executive level in principle but breaks down at the working level; different functions are pursuing different AI agendas.",
      3: "A shared vision exists but governance for cross-functional AI work is informal and decisions frequently get stuck at functional boundaries.",
      4: "A cross-functional operating model for AI exists with defined decision rights; most significant AI initiatives have representation from marketing, technology, and data from the outset.",
      5: "Cross-functional alignment is a distinctive strength – marketing, technology, and data operate from a shared AI vision with unified metrics, integrated planning, and joint accountability for outcomes.",
    },
  },
  {
    id: 47, // sheet row 30 (section 3 Q9)
    text: "How aligned are your AI metrics to business value outcomes rather than operational or technical measures?",
    capability: "adoption_governance",
    tooltip: "AI value is measured in the same terms as any other business investment – with a clear financial model, a baseline, a target, and a realized value tracking mechanism reviewed at the leadership level.",
    maturityLevels: {
      1: "AI is measured exclusively on technical performance (uptime, query volume, model accuracy) with no connection to business outcomes.",
      2: "Operational metrics exist (time saved, tasks completed) but they are not connected to the business value outcomes that matter to senior leadership.",
      3: "Business value metrics are defined for some initiatives but the methodology is inconsistent and the connection to financial outcomes is difficult to demonstrate credibly.",
      4: "Most significant AI initiatives have a defined business value metric – revenue impact, cost reduction, or quality improvement – that is tracked and reported to senior leadership.",
      5: "AI value is measured in the same terms as any other business investment – with a clear financial model, a baseline, a target, and a realized value tracking mechanism reviewed at the leadership level.",
    },
  },
  {
    id: 48, // sheet row 39 (section 4 Q8)
    text: "How well does your organization prioritize gaps in insights or optimizations that inform a roadmap for improvements?",
    capability: "adoption_governance",
    tooltip: "Open questions are actively managed as a strategic asset – the organization tracks its AI knowledge gaps, prioritizes which to close, and uses external partnerships and research to accelerate resolution.",
    maturityLevels: {
      1: "Leadership cannot readily surface a specific unanswered question – either because AI engagement is too early or because questions are not being asked at the right level.",
      2: "Unanswered questions exist but they are tactical or technical in nature rather than strategic – the organization has not yet surfaced the harder governance and value questions.",
      3: "The organization can articulate meaningful open questions but they tend to cluster around one domain rather than spanning the full picture of AI readiness.",
      4: "Leadership can articulate a clear set of open strategic questions across multiple domains – value measurement, governance, talent, and technology – and there is a plan to answer most of them.",
      5: "Open questions are actively managed as a strategic asset – the organization tracks its AI knowledge gaps, prioritizes which to close, and uses external partnerships and research to accelerate resolution.",
    },
  },
  {
    id: 49, // sheet row 40 (section 4 Q9)
    text: "What is the biggest systematic challenge when scaling from pilot to productional AI?",
    capability: "adoption_governance",
    tooltip: "Scaling from pilot to production is a repeatable, managed capability. The organization has resolved its systemic barriers, maintains a live view of what is in the scaling pipeline, and continuously improves the methodology based on each deployment. Time-to-production is measured and actively reduced.",
    maturityLevels: {
      1: "The organization has not attempted to scale any AI pilot to production. Scaling challenges are theoretical. There is no institutional knowledge of what breaks when moving from controlled experiment to live environment.",
      2: "One or more pilots have stalled at the production gate but the organization has not formally diagnosed why. Scaling challenges are attributed to technology or data without examining governance, change management, or operating model gaps.",
      3: "The organization has identified its primary scaling barriers – typically data quality, workflow redesign, or stakeholder alignment – and has a partial playbook for addressing them, but the same blockers recur across initiatives because root causes have not been fully resolved.",
      4: "Scaling barriers are well-understood and systematically managed. The organization has a documented pilot-to-production methodology that addresses data readiness, infrastructure, workflow integration, change management, and governance before a pilot is promoted. Success rate from pilot to production is tracked.",
      5: "Scaling from pilot to production is a repeatable, managed capability. The organization has resolved its systemic barriers, maintains a live view of what is in the scaling pipeline, and continuously improves the methodology based on each deployment. Time-to-production is measured and actively reduced.",
    },
  },
  {
    id: 50, // sheet row 49 (section 5 Q8)
    text: "When you picture AI playing a meaningful role in how your business makes decisions a year or two from now, what does that picture look like for your organization?",
    capability: "adoption_governance",
    tooltip: "The AI decision-making vision is a living strategic asset – it is reviewed and updated regularly, used to align investment priorities, and tied to specific, measurable outcomes that leadership tracks.",
    maturityLevels: {
      1: "Leadership does not have a clear picture of AI's role in future decision-making – the vision is vague without specificity about which decisions, which roles, or what changes.",
      2: "A general vision exists but it is aspirational rather than grounded – there is no roadmap, no identified use cases, and no connection between the vision and current AI investments.",
      3: "A directional vision exists with some specificity – a few high-value use cases are identified and there is early thinking about what the organization needs to build, but the path is unclear.",
      4: "A concrete AI decision-making vision exists with defined use cases, an 18-month roadmap, and identified dependencies across data, technology, and talent; the vision is socialized across leadership.",
      5: "The AI decision-making vision is a living strategic asset – it is reviewed and updated regularly, used to align investment priorities, and tied to specific, measurable outcomes that leadership tracks.",
    },
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

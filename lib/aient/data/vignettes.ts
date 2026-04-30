import type {
  AientClientStory,
  AientWorkshopVignette,
} from "@/lib/aient/types";

/**
 * AI for Enterprise workshop content — two parallel datasets:
 *
 *   1. AIENT_VIGNETTES        — facilitation exercises consultants run
 *                               with client teams to develop one or more
 *                               capability areas.
 *   2. AIENT_CLIENT_STORIES   — anonymized proof points used as anchors
 *                               during pitch and capability conversations.
 *                               Sourced from AI for Enterprise Intro
 *                               (March 2026), the Agile Operating Model
 *                               offering, the Analytics Advisory toolkit,
 *                               and the "Re-wiring the Enterprise"
 *                               research (December 2025).
 */

// ══════════════════════════════════════════════════════════════════
// AIENT_VIGNETTES — workshop facilitation exercises
// ══════════════════════════════════════════════════════════════════

export const AIENT_VIGNETTES: AientWorkshopVignette[] = [
  {
    id: "aient_north_star_visioning",
    title: "AI for Enterprise North Star Visioning",
    description:
      "Align leadership on a future-state, AI-native enterprise and the investment themes that fund the next 24 months. Output: draft North Star, three to five investment themes, and a stop-doing list.",
    durationMinutes: 90,
    category: "Vision & Strategy",
    requiredInputs: [
      "Executive sponsor list (CEO/COO/CDO/CIO/CHRO at minimum) and pre-read interview notes",
      "Top three enterprise threats and growth bets heard in the last 90 days",
      "Most recent enterprise strategy and AI portfolio inventory",
      "Current AI-attributable EBIT impact (or honest 'unknown')",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the moment with the McKinsey/Merkle data — only ~12% of organisations are seeing meaningful EBIT impact from AI. The gap isn't models; it's the operating model around them.\n\n**Exercise 1 — Future-State Story (25 min):** In pairs, leaders write a one-paragraph story of how the enterprise runs three years from now. Constraint: the story must reference at least three of the six AI-for-Enterprise capabilities. Cluster on a board.\n\n**Exercise 2 — Investment Themes (25 min):** Distill three to five investment themes that, if funded, would make the future-state real. For each: what changes, who owns it, rough cost, what becomes possible after.\n\n**Exercise 3 — Stop-doing list (20 min):** What does the enterprise stop doing? Five legacy programs, KPIs, or operating rituals that no longer serve an AI-native enterprise (project funding, vendor-locked dashboards, faith-based AI investment, etc.).\n\n**Wrap-up (10 min):** Capture the North Star, themes, and stop-doing list. Sponsor commitment on publication date.",
    expectedOutputs: [
      "Draft North Star statement crossing 3+ AI-for-Enterprise capabilities",
      "Three to five funded investment themes with rough cost",
      "Stop-doing list with named retirement dates",
      "Sponsor commitment on publication of the North Star",
    ],
    relatedOpportunityIds: [
      "ai_enterprise_diagnostic",
      "agile_operating_model_assessment",
    ],
    triggerCapabilities: [
      "data_foundations",
      "use_case_design",
      "work_design",
      "intelligence_delivery",
    ],
    sortOrder: 1,
  },
  {
    id: "ai_use_case_portfolio_sprint",
    title: "AI Use Case Portfolio Sprint",
    description:
      "Take the existing list of AI ideas and shadow pilots and convert it into a prioritised, value-led portfolio. Output: scored portfolio, top 3–5 use cases redesigned for production, and a portfolio-governance recommendation.",
    durationMinutes: 120,
    category: "Use Case Design",
    requiredInputs: [
      "Inventory of all known AI ideas, pilots, and shadow-IT efforts",
      "Strategic priorities and growth bets from the executive team",
      "Risk and compliance constraints relevant to AI",
      "Available platforms, partners, and skill availability",
    ],
    facilitationGuide:
      "**Setup (15 min):** Frame the gap — most enterprises have dozens of AI ideas and few in production. Walk through the McKinsey 'value at stake' patterns and the Merkle 'success patterns' from the AI for Enterprise narrative.\n\n**Exercise 1 — Inventory & Consolidation (25 min):** Surface every AI idea in the room and in flight. Cluster duplicates. Capture: what business outcome, who's sponsoring, what stage (idea / pilot / production), what's blocking.\n\n**Exercise 2 — Value / Feasibility / Risk Scoring (40 min):** Score each on (a) value at stake, (b) feasibility (data, skills, platforms), (c) risk (compliance, brand, model, change). Plot on a 2×2 — high value / feasible go to the top.\n\n**Exercise 3 — Top-3-5 Redesign (30 min):** For the top three to five, redesign for production-readiness — what's the workflow being changed, what does the human + AI teaming look like, what's the measurement, what's the assurance?\n\n**Wrap-up (10 min):** Capture the scored portfolio, the redesigned top three to five, and a recommendation for portfolio governance going forward.",
    expectedOutputs: [
      "Consolidated AI portfolio inventory",
      "Scored portfolio (value / feasibility / risk) on a 2×2",
      "Top 3–5 use cases redesigned for production-readiness",
      "Portfolio-governance recommendation",
    ],
    relatedOpportunityIds: [
      "ai_use_case_portfolio_sprint",
      "ai_enterprise_diagnostic",
    ],
    triggerCapabilities: ["use_case_design"],
    sortOrder: 2,
  },
  {
    id: "workflow_redesign_lab",
    title: "Workflow Redesign Lab — Human + AI Teaming",
    description:
      "Take one high-volume, high-friction workflow and redesign it from scratch around human + AI teaming — not bolting AI onto today's process. Output: a redesigned workflow, role-and-decision-rights map, and 90-day pilot plan.",
    durationMinutes: 150,
    category: "Work Design",
    requiredInputs: [
      "One high-volume, high-friction enterprise workflow (claims, KYC, contracts, onboarding, support escalation, marketing production)",
      "Volume, cycle-time, and quality data on the workflow",
      "Role inventory and current decision-rights",
      "Top three AI capabilities the team has confidence in",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the McKinsey Nov 2025 finding — AI high performers are nearly 3× as likely to have fundamentally redesigned workflows. Bolting AI onto unchanged processes is the most common reason AI investment doesn't show up in EBIT.\n\n**Exercise 1 — Current-State Friction Map (40 min):** Walk the workflow stage by stage. Annotate volume, cycle time, hand-offs, exception rate, and the worst-friction moments. Quantify where time and value leak today.\n\n**Exercise 2 — Redesign From Scratch (60 min):** Restart from a blank canvas. What does the workflow look like with AI as a first-class participant? What changes for humans, what changes for AI, what disappears entirely? Capture the role-and-decision-rights map and the supervisor / assurance role.\n\n**Exercise 3 — 90-Day Pilot (30 min):** Define a 90-day pilot — scope, owner, measurement, assurance gates. Identify the data, integration, and skills required.\n\n**Wrap-up (10 min):** Capture the redesigned workflow, decision-rights map, and pilot plan with named owner.",
    expectedOutputs: [
      "Current-state friction map with quantified leakage",
      "Redesigned workflow with human + AI roles and decision rights",
      "Supervisor / assurance role defined",
      "90-day pilot plan with named owner and assurance gates",
    ],
    relatedOpportunityIds: [
      "workflow_redesign_human_ai",
      "copilot_agentic_activation",
      "agile_operating_model_assessment",
    ],
    triggerCapabilities: ["work_design"],
    sortOrder: 3,
  },
  {
    id: "data_foundations_architecture_sprint",
    title: "Data Foundations Architecture Sprint",
    description:
      "Stress-test the data foundations against the AI portfolio. Output: gap map, reference architecture decisions, and a sequenced roadmap that pairs each foundation stage with the AI use cases it unlocks.",
    durationMinutes: 120,
    category: "Data Foundations",
    requiredInputs: [
      "Inventory of data sources, freshness, lineage, and quality",
      "Current data platform reference architecture (if any)",
      "Top 5–8 AI use cases in the portfolio",
      "Data governance, stewardship, and access-control policies",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the boring truth — AI workloads built on ungoverned data drift fast and erode trust. Modern data foundations are the precondition that quietly determines whether the AI program succeeds or stalls.\n\n**Exercise 1 — Use-Case-to-Data Map (35 min):** For each top AI use case, identify the specific data, identity, lineage, or governance gap blocking it. Be brutally honest about freshness and quality.\n\n**Exercise 2 — Reference Architecture Decisions (45 min):** Walk the lakehouse / semantic-layer / metadata / governance / vector layers. For each, decide: keep, replace, augment. Capture build-vs-buy and platform decisions.\n\n**Exercise 3 — Sequenced Roadmap (20 min):** Sequence the foundation in stages. Pair each stage with the AI use cases it unlocks — so foundation work has measurable downstream value.\n\n**Wrap-up (10 min):** Capture the gap map, architecture decisions, and roadmap.",
    expectedOutputs: [
      "Use-case-to-data gap map",
      "Reference architecture decisions across lakehouse / semantic / metadata / vector",
      "Sequenced roadmap with AI use cases unlocked per stage",
      "Build-vs-buy and platform decisions",
    ],
    relatedOpportunityIds: [
      "data_foundations_modernization",
      "enterprise_knowledge_graph_vectors",
      "embedded_intelligence_platform",
    ],
    triggerCapabilities: ["data_foundations", "intelligence_delivery"],
    sortOrder: 4,
  },
  {
    id: "ai_assurance_framework_workshop",
    title: "AI Assurance & Model-Risk Framework Workshop",
    description:
      "Stand up the AI assurance framework — model-risk policy, explainability, audit trail, and regulatory mapping. Output: tiered assurance policy, governance forum design, and an EU AI Act / NIST AI RMF readiness map.",
    durationMinutes: 120,
    category: "AI Assurance",
    requiredInputs: [
      "Inventory of AI models in development, pilot, and production",
      "Existing model-risk and data-governance policies (if any)",
      "Regulatory exposure (EU AI Act, NIST AI RMF, sector regulators)",
      "Compliance, legal, and risk contacts",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the stakes — AI without assurance ships, breaks, and blocks the next deployment. A managed assurance practice keeps the program moving and is non-negotiable in regulated sectors.\n\n**Exercise 1 — Model Tiering (35 min):** Tier each model by impact and risk. Tier 1 — board-attention, customer-facing, regulated. Tier 2 — operational, contained risk. Tier 3 — internal, low risk. For each tier, define the assurance bar.\n\n**Exercise 2 — Policy & Audit Trail (40 min):** Design the model-risk policy for each tier — explainability, evaluation, monitoring, audit trail, incident response. Reference the EU AI Act and NIST AI RMF requirements where relevant.\n\n**Exercise 3 — Governance Forum (25 min):** Design the AI governance forum — who's on it, what cadence, what decisions does it make, what does it review. Capture the relationship to the existing model-risk and data-governance forums.\n\n**Wrap-up (10 min):** Capture the tiered policy, audit trail design, and governance forum.",
    expectedOutputs: [
      "Model tiering policy with assurance bar per tier",
      "Model-risk and audit-trail framework",
      "AI governance forum design",
      "EU AI Act / NIST AI RMF readiness map",
    ],
    relatedOpportunityIds: ["ai_assurance_framework"],
    triggerCapabilities: ["ai_assurance"],
    sortOrder: 5,
  },
  {
    id: "copilot_role_activation",
    title: "Copilot Activation Workshop",
    description:
      "Pick one high-leverage role and design the copilot stack that lifts its productivity 20–40%. Output: copilot scope, evaluation harness, supervisor framework, and a 90-day deployment plan.",
    durationMinutes: 120,
    category: "Intelligence Delivery",
    requiredInputs: [
      "Candidate roles (sellers, service agents, knowledge workers, analysts, underwriters)",
      "Top three workflows each role spends time on today",
      "Available data, content, and system integrations per role",
      "Existing AI tooling and platform commitments",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the upside — copilots in the right roles, deployed with proper evaluation and supervision, lift productivity 20–40% on knowledge work. Without the guardrails, they get adopted, abandoned, and unplugged.\n\n**Exercise 1 — Role Selection (20 min):** Score the candidate roles on (a) volume, (b) AI-addressability, (c) measurement clean-ness, (d) sponsor strength. Pick one.\n\n**Exercise 2 — Copilot Scope (45 min):** For the chosen role, design the copilot — what tasks it owns, what it suggests, what it never does. Define the data and tool calls, the prompt and skill design, and the brand / safety guardrails.\n\n**Exercise 3 — Evaluation & Supervision (35 min):** Design the evaluation harness (golden set, ground truth, regression test) and the supervisor framework (human-in-the-loop checkpoints, confidence-based handoffs).\n\n**Wrap-up (10 min):** Capture the copilot scope, evaluation harness, supervisor framework, and 90-day deployment plan.",
    expectedOutputs: [
      "Selected role with measured leverage",
      "Copilot scope — owns / suggests / never",
      "Evaluation harness and ground-truth set",
      "Supervisor framework and 90-day deployment plan",
    ],
    relatedOpportunityIds: [
      "copilot_agentic_activation",
      "multi_agent_orchestration",
      "embedded_intelligence_platform",
    ],
    triggerCapabilities: ["intelligence_delivery", "work_design"],
    sortOrder: 6,
  },
  {
    id: "ai_operating_model_workshop",
    title: "AI Operating Model & Talent Workshop",
    description:
      "Design the AI operating model — central vs. embedded, role definitions, sourcing strategy, and the cadence that keeps the program moving. Output: target operating model, role catalogue, and a sourcing plan.",
    durationMinutes: 90,
    category: "Adoption & Governance",
    requiredInputs: [
      "Current AI talent and capability map across the enterprise",
      "Existing data, analytics, and engineering operating models",
      "Strategic priorities for the AI program",
      "Available partner / vendor / managed-service options",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the truth — AI work doesn't happen in the platforms; it happens in the people. The operating-model decisions made in the first 12 months quietly determine the program's ceiling.\n\n**Exercise 1 — Central vs. Embedded (25 min):** Walk the four common patterns — central AI office, hub-and-spoke, federated, fully embedded. Discuss which fits the enterprise's existing operating model and where the trade-offs land.\n\n**Exercise 2 — Role Catalogue (35 min):** Define the roles — ML engineer, AI product manager, prompt engineer, AI assurance lead, data steward, copilot product owner. For each: where it sits, what it owns, what it doesn't, career path, sourcing.\n\n**Exercise 3 — Sourcing Plan (15 min):** Build / buy / partner across the catalogue. Identify the 12-month sourcing plan and the partnerships needed.\n\n**Wrap-up (5 min):** Capture the operating model, role catalogue, and sourcing plan.",
    expectedOutputs: [
      "Target operating model (central / hub-spoke / federated / embedded)",
      "Role catalogue with placement, ownership, career path",
      "12-month sourcing plan (build / buy / partner)",
      "Partnership and ecosystem strategy",
    ],
    relatedOpportunityIds: [
      "ai_talent_operating_model",
      "ai_adoption_change",
      "agile_operating_model_assessment",
    ],
    triggerCapabilities: ["adoption_governance"],
    sortOrder: 7,
  },
];

// ══════════════════════════════════════════════════════════════════
// AIENT_CLIENT_STORIES — anonymized proof points / pitch anchors
// ══════════════════════════════════════════════════════════════════

export const AIENT_CLIENT_STORIES: AientClientStory[] = [
  {
    id: "claims_workflow_redesign",
    title: "Claims Workflow Redesigned Around AI",
    tagline:
      "Redesigning the workflow — not bolting AI onto it — cut cycle time 38% and lifted CSAT 14 points",
    capabilities: ["work_design", "intelligence_delivery"],
    narrative:
      "An insurance carrier had piloted AI for image triage and document extraction but EBIT impact was invisible — the rest of the claims workflow was unchanged. Merkle ran a workflow-redesign engagement: redesigned First Notice of Loss → triage → adjudication → payout from scratch around human + AI teaming. AI agents owned routine triage and document understanding; humans owned exceptions and complex adjudication; supervisors owned brand-sensitive decisions. Inside two quarters: cycle time cut 38%, CSAT lifted 14 points, and AI-attributable EBIT impact became visible in the executive scorecard for the first time.",
    outcomes: [
      "Cycle time reduced 38% on routine claims",
      "CSAT lifted 14 points across the segment",
      "AI-attributable EBIT impact made visible for the first time",
      "Adjuster workforce redirected to high-complexity, high-value claims",
    ],
    industries: ["financial_services"],
    prompts: [
      "Which workflow has had AI bolted onto it but is otherwise unchanged?",
      "What share of your AI investment is showing up in EBIT today?",
      "Where would redesigning the workflow itself unlock the most value?",
    ],
  },
  {
    id: "knowledge_graph_rag_support",
    title: "Knowledge Graph + RAG for Enterprise Support",
    tagline:
      "Enterprise knowledge graph and RAG platform replaced Tier-1 case decks for 11 product lines",
    capabilities: ["data_foundations", "intelligence_delivery"],
    narrative:
      "A technology-SaaS client supported 11 product lines with thousands of pages of fragmented documentation — agents spent 35% of case time hunting for the right answer. Merkle stood up the enterprise knowledge graph and RAG platform: content normalisation, hybrid retrieval, evaluation harness, and a copilot embedded in the agent workspace. Confidence-scored answers cited their sources; low-confidence cases routed to humans with the retrieved context attached. Inside one year: agent productivity +28%, average handle time down 22%, and the knowledge base became the single source of truth for both customer-facing and internal AI surfaces.",
    outcomes: [
      "Agent productivity +28% across the supported product lines",
      "Average handle time -22% with no quality regression",
      "Single knowledge base now powers customer-facing and internal AI",
      "Retrieval evaluation harness keeps quality measurable on every release",
    ],
    industries: ["technology_saas", "professional_services"],
    prompts: [
      "How fragmented is your enterprise knowledge today, and what does that cost?",
      "Where would grounded, attributable answers replace tribal knowledge?",
      "How would you evaluate retrieval quality before shipping a copilot to thousands of users?",
    ],
  },
  {
    id: "embedded_forecasting_sop",
    title: "Embedded Forecasting in S&OP",
    tagline:
      "Embedded AI forecasting in the S&OP rhythm cut working capital 9% and lifted service level 3 points",
    capabilities: ["intelligence_delivery", "data_foundations"],
    narrative:
      "A manufacturing client's S&OP process ran on monthly Excel forecasts; AI forecasting models existed but lived in the analytics team's Jupyter notebooks. Merkle moved the forecasting models into the S&OP workflow itself — embedded in the planning tools, with feature pipelines, model registry, drift monitoring, and a measurement loop into the executive scorecard. Within nine months: working capital reduced 9%, service level lifted 3 points, and the S&OP team trusted the forecast enough to commit decisions to it for the first time.",
    outcomes: [
      "Working capital reduced 9% through tighter forecast-driven plans",
      "Service level lifted 3 points",
      "Forecast trust score (decision-commit rate) lifted from 41% to 78%",
      "Embedded model registry and drift monitoring became the operating standard",
    ],
    industries: ["manufacturing", "retail"],
    prompts: [
      "Which decisions in your enterprise rely on stale, manually-built forecasts today?",
      "What would it take for the S&OP team to commit to an AI-generated forecast?",
      "Where does an analytics model exist but never make it into the workflow it belongs in?",
    ],
  },
  {
    id: "multi_agent_kyc_orchestration",
    title: "Multi-Agent KYC Orchestration",
    tagline:
      "Multi-agent KYC pipeline cut onboarding time 67% with full audit trail and regulator confidence",
    capabilities: [
      "intelligence_delivery",
      "work_design",
      "ai_assurance",
    ],
    narrative:
      "A bank's KYC onboarding process took 11 days on average and ran on email, ticket queues, and tribal knowledge — every exception hit the analyst desk. Merkle designed a multi-agent orchestration: document-extraction agent, sanctions-screening agent, beneficial-ownership agent, supervisor agent. Confidence-scored handoffs to humans at each gate; full audit trail; explainability and assurance baked in. Inside 12 months: onboarding cut from 11 days to 3.6 days, exception-handling effort dropped 54%, and the regulator review explicitly cited the assurance framework as best-in-class.",
    outcomes: [
      "Onboarding cut from 11 days to 3.6 days",
      "Exception-handling effort -54%",
      "Full audit trail and explainability per agent decision",
      "Regulator review cited the assurance framework as best-in-class",
    ],
    industries: ["financial_services"],
    prompts: [
      "Where in your enterprise does a multi-agent flow exist on email and tickets today?",
      "What assurance bar would your regulator need before you ran agents in this workflow?",
      "Which workflow's exception rate is high enough to fund a multi-agent redesign?",
    ],
  },
  {
    id: "ai_assurance_in_regulated_sector",
    title: "AI Assurance Program in a Regulated Sector",
    tagline:
      "Standing up tiered model-risk and EU AI Act mapping unblocked 8 stalled use cases in 90 days",
    capabilities: ["ai_assurance", "adoption_governance"],
    narrative:
      "A healthcare client had eight high-value AI use cases stuck in legal review — no assurance framework, no clear policy on who could deploy what under EU AI Act, no audit trail design. Merkle stood up the assurance practice: tiered model-risk policy, evaluation framework, audit-trail architecture, EU AI Act mapping, and the governance forum that runs it. Within 90 days, six of the eight stalled use cases were unblocked and shipped; the remaining two were re-scoped for a higher-tier assurance bar.",
    outcomes: [
      "Six of eight stalled AI use cases unblocked and shipped within 90 days",
      "Tiered model-risk policy and audit-trail architecture published",
      "EU AI Act readiness map adopted as the enterprise standard",
      "Quarterly AI governance forum became the program's operating cadence",
    ],
    industries: ["healthcare_lifesciences", "financial_services"],
    prompts: [
      "How many of your high-value AI use cases are stuck in legal or compliance review?",
      "What would your CRO need to see before approving deployment in a Tier-1 surface?",
      "Where does your enterprise sit on EU AI Act readiness today?",
    ],
  },
  {
    id: "seller_copilot_at_scale",
    title: "Seller Copilot Deployed at Scale",
    tagline:
      "Seller copilot lifted productive selling time 22% and made measurement attributable",
    capabilities: ["intelligence_delivery", "work_design"],
    narrative:
      "A B2B technology client deployed a copilot to 4,200 sellers — but the first version was adopted-then-abandoned within six months. Merkle re-grounded the program: rebuilt the evaluation harness (golden set, regression tests), redesigned the seller workflows around copilot collaboration, instrumented adoption and behaviour-change measurement, and stood up a feedback loop into the prompt and tool design. Within nine months: productive selling time +22%, copilot DAU lifted from 19% to 64%, and the program's EBIT impact landed in the CFO's scorecard for the first time.",
    outcomes: [
      "Productive selling time +22% across the seller base",
      "Copilot DAU lifted from 19% to 64%",
      "EBIT impact attributed to copilot deployment in the CFO scorecard",
      "Evaluation harness and feedback loop became the program's operating standard",
    ],
    industries: ["technology_saas", "professional_services"],
    prompts: [
      "Which copilot deployment in your enterprise has been adopted-then-abandoned?",
      "How would you make the EBIT impact of a copilot attributable to the CFO?",
      "What feedback loop would keep prompts and tools sharp over time?",
    ],
  },
];

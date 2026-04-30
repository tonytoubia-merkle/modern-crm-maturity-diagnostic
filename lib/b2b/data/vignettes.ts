import type {
  B2bClientStory,
  B2bWorkshopVignette,
} from "@/lib/b2b/types";

/**
 * B2B Transformation workshop content – two parallel datasets:
 *
 *   1. B2B_VIGNETTES         – workshop facilitation exercises that
 *                              consultants run with client teams to
 *                              develop one or more capability areas.
 *                              Mirrors the CRM/CSC Vignette shape.
 *
 *   2. B2B_CLIENT_STORIES    – anonymized (or Merkle-public) client
 *                              proof points used as anchors during
 *                              pitch and capability conversations.
 *                              Sourced from the 2025 GTM narrative,
 *                              the AMER Summit working session, and
 *                              the offering toolkits.
 */

// ══════════════════════════════════════════════════════════════════
// B2B_VIGNETTES – workshop facilitation exercises
// ══════════════════════════════════════════════════════════════════

export const B2B_VIGNETTES: B2bWorkshopVignette[] = [
  {
    id: "north_star_visioning_workshop",
    title: "North Star Visioning Workshop",
    description:
      "Align leadership on a future-state, account-led customer experience and the strategic focus areas needed to get there. The output is a published North Star statement plus the three to five investment themes that fund the next 24 months of transformation.",
    durationMinutes: 90,
    category: "Vision & Strategy",
    requiredInputs: [
      "Executive sponsor list (CEO/COO/CRO/CMO at minimum) and pre-read interview notes",
      "Top three client / market threats heard in the last 90 days",
      "Most recent strategic plan and its primary growth assumptions",
      "Current investment portfolio (if available)",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the session: this is about agreeing on a North Star, not yet on roadmap. Walk through the four macro pressures from the GTM narrative – profitability pressure, AI uncertainty, workforce fatigue, geopolitical instability – and ground in the data: 62% increase in B2B brands considered, 4.5-week longer purchase cycles, 71% of buyers wanting deeper supplier understanding.\n\n**Exercise 1 – Future-State Story (25 min):** In pairs, leaders write a one-paragraph story describing the customer experience three years from now. Constraint: the story must reference both Account-Based Marketing and Account-Based Service (or Operations) – i.e. it must cross at least two of the four account-based pillars. Share, cluster common themes on a board.\n\n**Exercise 2 – Investment Themes (25 min):** From the clusters, distill three to five investment themes that, if funded, would make the future-state story real. For each theme, capture: what it changes, who owns it, what it costs (rough order of magnitude), and what becomes possible after.\n\n**Exercise 3 – Stop-doing list (20 min):** Equally important – what does the organization stop doing? List five legacy programs, KPIs, or rituals that no longer serve the North Star. Discuss which ones leadership is willing to publicly retire.\n\n**Wrap-up (10 min):** Capture a draft North Star statement, the investment themes, and the stop-doing list. Get verbal sponsor commitment on which leader publishes the North Star and on what date.",
    expectedOutputs: [
      "Draft North Star statement crossing 2+ account-based pillars",
      "Three to five funded investment themes with rough cost",
      "Stop-doing list with named retirement dates",
      "Sponsor commitment on publication of the North Star",
    ],
    relatedOpportunityIds: [
      "north_star_digital_visioning",
      "agile_op_model_assessment",
    ],
    triggerCapabilities: ["vision_strategy"],
    sortOrder: 1,
  },

  {
    id: "account_tiering_icp_workshop",
    title: "Account Tiering & ICP Definition",
    description:
      "Build the tiered ideal customer profile (ICP) and target account list (TAL) that anchors every account-based motion. Outputs a tiered list with sized opportunity, fit/intent scoring criteria, and the data feeds that will keep the list fresh.",
    durationMinutes: 120,
    category: "Account-Based Marketing",
    requiredInputs: [
      "Last four quarters of closed-won and closed-lost data",
      "Existing target account list (if any) and how it was constructed",
      "Win-rate and ACV by segment / industry / size",
      "Available intent and engagement data sources (6sense, Bombora, internal first-party signals)",
    ],
    facilitationGuide:
      "**Setup (15 min):** Frame ICP as the most important and least respected artifact in B2B. Walk the room through the gap: most companies have a TAL but few can articulate the fit + intent + readiness dimensions that should govern it. Reference the Salesforce data: 5× ACV multiplier when Revenue Cloud lands with 4 clouds – that's only achievable if accounts are properly tiered.\n\n**Exercise 1 – Win Pattern Analysis (30 min):** Inspect the last four quarters of closed-won deals. Cluster by industry, size, geo, tech stack, buyer persona, and time-to-close. Find the top three win patterns. Then do the same for closed-lost – and look for the patterns that should have been disqualified earlier.\n\n**Exercise 2 – Three-Tier ICP (35 min):** Define three tiers of ICP – Tier 1 (highest fit + intent, named accounts), Tier 2 (high fit, opportunistic), Tier 3 (acceptable fit, scale via marketing). For each tier, define: criteria (firmographic, technographic, intent), expected ACV range, sales motion, marketing motion, and number of accounts. Be honest about how many tier-1 the team can actually run with high-touch.\n\n**Exercise 3 – Data Refresh Plan (25 min):** A list that doesn't refresh becomes stale in 6 months. Map the data feeds that will keep tier 1 fresh – intent (6sense / Bombora), engagement (CRM activity, web), expansion signals (employees, funding, leadership change), and the cadence each is reviewed.\n\n**Wrap-up (15 min):** Capture the three-tier ICP, named tier-1 accounts, and the refresh cadence. Identify the data + tooling gaps to close in the next 60 days.",
    expectedOutputs: [
      "Three-tier ICP with sized opportunity and named accounts",
      "Win pattern analysis with top three patterns and disqualifiers",
      "Data refresh plan with sources, owners, and cadence",
      "60-day data and tooling gap list",
    ],
    relatedOpportunityIds: [
      "abm_audit_visioning",
      "abm_pilot_program",
      "customer_data_foundation",
    ],
    triggerCapabilities: ["abm", "vision_strategy"],
    sortOrder: 2,
  },

  {
    id: "abm_pilot_design",
    title: "ABM Pilot Selection & Design",
    description:
      "Pick the single highest-leverage account set for an ABM pilot and design the orchestrated motion across paid, owned, sales, and service. Outputs a 90-day pilot plan with measurable pipeline outcomes and a path to scale.",
    durationMinutes: 90,
    category: "Account-Based Marketing",
    requiredInputs: [
      "Tier-1 target account list (output of the Account Tiering workshop or equivalent)",
      "Existing content inventory and channel mix",
      "Sales-marketing operating cadence (or its absence)",
      "Pipeline and revenue targets for the next two quarters",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the pilot's job: prove the ABM motion works on a contained account set within 90 days, with measurable pipeline outcomes that earn the right to scale. Reference the typical 25% MQL→SQL conversion lift and 27% sales-cycle compression as outcome anchors.\n\n**Exercise 1 – Account Set Selection (20 min):** From the tier-1 list, pick 25–50 accounts where: (a) named buying-group members are identifiable, (b) the deal cycle is short enough to land outcomes in 90 days, and (c) sales is willing to commit to weekly account reviews. Score and rank.\n\n**Exercise 2 – Play Design (35 min):** For each account, design a play that orchestrates paid (display, LinkedIn, content syndication), owned (email, web, executive content), and sales (cadenced outreach, executive engagement, event invitations) in a 12-week sequence. Tailor by buying-group role. Reference the Merkle ABM lifecycle framework.\n\n**Exercise 3 – Measurement & Cadence (15 min):** Define the pilot's measurement framework: account engagement score, sales velocity, pipeline created, deals influenced. Set up a weekly review cadence between sales and marketing leaders – same dashboard, same questions, same time every week.\n\n**Wrap-up (10 min):** Capture the pilot account set, the play design, the measurement framework, and the named pilot lead from each function. Set a kickoff date in the next 14 days.",
    expectedOutputs: [
      "Selected pilot account set (25–50 accounts)",
      "Orchestrated 12-week play design across paid / owned / sales",
      "Pilot measurement framework and weekly review cadence",
      "Named pilot leads with kickoff date inside 14 days",
    ],
    relatedOpportunityIds: [
      "abm_pilot_program",
      "abm_audit_visioning",
      "abm_blueprint",
    ],
    triggerCapabilities: ["abm", "abs"],
    sortOrder: 3,
  },

  {
    id: "sales_cycle_forensics",
    title: "Sales Cycle Forensics",
    description:
      "Deconstruct one real recent deal end-to-end to find where time, value, and information leak. Outputs a quantified deal-cycle map, the top three friction points, and a 30-day fix list – typically the kickoff for an account-based selling implementation.",
    durationMinutes: 120,
    category: "Account-Based Selling",
    requiredInputs: [
      "One real recent deal – won or lost – that the team is willing to open up",
      "Calendar invites, emails, CRM stage history (anonymized as needed)",
      "Quote / contract / approval timeline",
      "List of every internal handoff and approval gate",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the exercise: walk one deal through, end to end, and quantify where the time actually goes. Use the Merkle 2024 Superpowers benchmark – 379-day average B2B purchase cycle, +4.5 weeks longer than 2022 – as the comparison anchor.\n\n**Exercise 1 – Linear Walkthrough (30 min):** On a board, draw the deal stages left-to-right: prospecting → discovery → demo → proposal → contract → close. Annotate each stage with calendar time, who touched it, the tool used, and where it queued. Use real numbers – if you don't know, guess and verify after.\n\n**Exercise 2 – Friction Map (35 min):** Mark every friction point in red – moments when the deal stalled, slipped, or lost momentum. For each, capture: what triggered it (legal review, pricing approval, stakeholder change, no decision), how often this type of friction happens across other deals, and whether it's a structural fix (CPQ, CLM, approval workflow) or a behavioral one (rep skill, manager intervention).\n\n**Exercise 3 – AI / Agentic Opportunity (25 min):** For each top friction point, ask: is this AI-addressable? Concrete examples – AI proposal drafting, AI deal-risk scoring, AI quote configuration, agentic approval routing. Identify the top three where AI deployment in the next 90 days would compress cycle time meaningfully. Set rough ROI math.\n\n**Wrap-up (20 min):** Capture the deal-cycle map, the top three friction points, the AI/agentic interventions, and a named owner for each 30-day fix.",
    expectedOutputs: [
      "End-to-end deal-cycle map with calendar time per stage",
      "Top three friction points classified as structural vs. behavioral",
      "Three AI / agentic interventions with rough ROI math",
      "30-day fix list with named owners",
    ],
    relatedOpportunityIds: [
      "account_based_selling_implementation",
      "salesforce_revenue_cloud_modernization",
      "agentforce_revenue_operations",
    ],
    triggerCapabilities: ["abs", "tech_data_intelligence"],
    sortOrder: 4,
  },

  {
    id: "service_to_revenue_mapping",
    title: "Service-to-Revenue Mapping",
    description:
      "Reframe service operations as a revenue motion – surface the upsell, cross-sell, and renewal moments hidden inside today's service interactions, and design how AI service agents and humans split the work going forward.",
    durationMinutes: 90,
    category: "Account-Based Service & Advocacy",
    requiredInputs: [
      "Last 90 days of service / case data (anonymized or aggregate)",
      "Current customer health scoring approach (or its absence)",
      "Renewal and expansion process documentation",
      "List of AI service tools currently licensed (Agentforce, Service Cloud, Intercom, etc.)",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the shift: service is no longer a cost center – it's the highest-frequency contact the company has with its accounts. Use the +83 vs +23 NPS benchmark for account-based vs. non-ABM peers, and the 25-40% account value lift typical of service-to-revenue motions.\n\n**Exercise 1 – Service Interaction Inventory (20 min):** List the top ten service interaction types by volume – cases, calls, in-app questions, success check-ins. For each, mark whether it's a routine deflection candidate (Tier-1 AI), a relationship-building moment (human), or a revenue moment (offer-eligibility).\n\n**Exercise 2 – Revenue Moment Identification (30 min):** For each interaction type marked as a revenue moment, define: the offer-eligibility check, the upsell / cross-sell / renewal play, the system that surfaces it, and the agent role (human or AI) that delivers it. Be specific about where this fires in the workflow – point of contact, post-resolution, follow-up.\n\n**Exercise 3 – Agent Operating Model (25 min):** Define how AI agents and humans split the work going forward. For Tier-1 deflection (high volume, low complexity), what's the AI deflection target? For relationship cases, what's the human's job? For revenue moments, who acts on each? Reference the Agentforce-style operating model: agents have explicit roles, KPIs, and guardrails.\n\n**Wrap-up (5 min):** Capture the revenue moments, the agent operating model, and the AI / Agentforce pilot use case to fund next.",
    expectedOutputs: [
      "Top-ten service interaction inventory classified by type",
      "Revenue moments with offer-eligibility checks and play design",
      "Agent operating model (AI vs. human) with deflection targets",
      "AI / Agentforce pilot use case sized for funding",
    ],
    relatedOpportunityIds: [
      "account_based_service_advocacy",
      "agentforce_revenue_operations",
    ],
    triggerCapabilities: ["service_advocacy", "tech_data_intelligence"],
    sortOrder: 5,
  },

  {
    id: "tech_stack_modernization_roadmap",
    title: "Tech Stack Audit & Modernization Roadmap",
    description:
      "Audit the revenue tech stack – CRM, CPQ, billing, OMS, commerce, data – and produce a sequenced modernization roadmap. Specifically targets the legacy CPQ renewal window and the Revenue Cloud / Data Cloud migration narrative.",
    durationMinutes: 90,
    category: "Tech, Data & Intelligence",
    requiredInputs: [
      "Inventory of CRM, CPQ, billing, OMS, commerce, marketing automation systems",
      "Approximate annual spend per system",
      "Renewal dates for the top five revenue platforms",
      "Known integration pain points and exception flows",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the modernization conversation through the 2026 reality: 4,100 legacy CPQ installs renewing, 73% of B2B buyers preferring self-service, and the 5× ACV multiplier when Revenue Cloud lands with four clouds. The job today is to find the wedge that earns the right to a multi-cloud platform conversation.\n\n**Exercise 1 – Stack Inventory (20 min):** On a board, map every system in the revenue stack. For each: function, vendor, annual spend, renewal date, owner. Color-code: modern (post-2020 SaaS, AI-ready), legacy (pre-2015, retrofit-heavy), at-risk (renewal in next 12 months).\n\n**Exercise 2 – Capability vs. Stack Heatmap (30 min):** Cross-reference the six B2B capability areas against the stack. For each capability, rate whether the stack supports it well, partially, or not at all. Highlight the cells where capability ambition exceeds platform reality – those are modernization candidates.\n\n**Exercise 3 – Wedge Identification (25 min):** Pick the single wedge that, if executed in the next 12 months, would unlock the most downstream value. Typical wedges: legacy CPQ → Revenue Cloud, fragmented data → Data Cloud + identity, manual orchestration → Agentforce + Regrello. Size the wedge with rough order-of-magnitude investment and realised value.\n\n**Wrap-up (5 min):** Capture the stack inventory, the capability heatmap, the chosen wedge, and the executive sponsor for the 90-day business case.",
    expectedOutputs: [
      "Stack inventory color-coded modern / legacy / at-risk",
      "Capability vs. stack heatmap highlighting modernization candidates",
      "Selected wedge engagement with rough investment + value math",
      "Executive sponsor commitment for 90-day business case",
    ],
    relatedOpportunityIds: [
      "tech_data_modernization",
      "salesforce_revenue_cloud_modernization",
      "customer_data_foundation",
    ],
    triggerCapabilities: ["tech_data_intelligence", "operations_commerce"],
    sortOrder: 6,
  },

  {
    id: "customer_data_foundation_design",
    title: "Customer Data Foundation Design",
    description:
      "Design the unified customer data foundation that resolves account, buying-group, and contact identity across the revenue stack. The prerequisite for every downstream AI use case – without it, copilots and agents act on partial data.",
    durationMinutes: 120,
    category: "Tech, Data & Intelligence",
    requiredInputs: [
      "List of customer data sources (CRM, marketing automation, CPQ, billing, support, commerce)",
      "Current identity resolution approach (or its absence)",
      "Top five active downstream use cases that need unified data (ABM, AI service, pricing, etc.)",
      "Existing data governance and consent framework",
    ],
    facilitationGuide:
      "**Setup (15 min):** Frame the foundation as the single biggest predictor of AI ROI. Without it, AI is decorative – copilots can't see the full account, agents can't act on real signals, personalization collapses. Reference the Salesforce + Merkury + Informatica narrative: Data Cloud + identity graph + governance is the foundation of every Stage 3 / Stage 4 organization.\n\n**Exercise 1 – Data Source Mapping (30 min):** On a board, map every customer-bearing system. For each source, capture: account / buying-group / contact identifiers it holds, the system of record question (which one is canonical), data quality signal (1-5), and refresh latency. Identify orphan sources – data that should flow into the foundation but doesn't.\n\n**Exercise 2 – Identity Graph Design (35 min):** Define how account, buying-group, and contact identity will resolve. For each entity: source of truth, persistent ID strategy, matching rules (deterministic vs. probabilistic), and conflict-resolution approach. Reference Merkury identity graph as the activation layer for net-new buying-group resolution.\n\n**Exercise 3 – AI Use-Case Activation (25 min):** For each of the top five downstream AI use cases, map: which entities they read, which they write, the latency they need, and the governance the data foundation must enforce (consent, PII handling, model access). Identify the use case to ship in the first 60 days as the foundation lands.\n\n**Wrap-up (15 min):** Capture the data source map, the identity graph design, the prioritised AI use case, and the data foundation roadmap with named owners.",
    expectedOutputs: [
      "Customer data source map with quality and latency signals",
      "Identity graph design (account, buying group, contact)",
      "Top AI use case prioritised to ship in 60 days",
      "Data foundation roadmap with named owners",
    ],
    relatedOpportunityIds: [
      "customer_data_foundation",
      "agentforce_revenue_operations",
      "tech_data_modernization",
    ],
    triggerCapabilities: ["tech_data_intelligence", "abm"],
    sortOrder: 7,
  },

  {
    id: "operating_model_adoption_design",
    title: "Operating Model & Adoption Design",
    description:
      "Translate the North Star and Blueprint into a working operating model – roles, decision rights, KPIs, and an embedded enablement plan. Most B2B transformations underperform because the human operating model lags the platform; this is where that gap closes.",
    durationMinutes: 120,
    category: "Vision & Strategy",
    requiredInputs: [
      "Current org chart for marketing, sales, service, customer success, ops",
      "FTE count and role mix (in-house vs. agency vs. partner)",
      "Prior change initiatives in this space and what stalled them",
      "Executive sponsorship structure for transformation",
    ],
    facilitationGuide:
      "**Setup (15 min):** Frame the truth: tools without new roles default to old behavior. Most B2B transformations don't fail at platform – they fail at operating model. The single biggest predictor of transformation ROI is whether incentive systems and decision rights move alongside the platform.\n\n**Exercise 1 – Current Operating Model Diagnosis (30 min):** Map the current model – not the org chart, the actual flow. Who owns what decisions? Where do hand-offs slip? Which roles are doing two jobs poorly? Mark the friction points with red dots: hand-offs that always slip, decisions with no clear owner, role overloads.\n\n**Exercise 2 – Target Operating Model Design (40 min):** Design the target operating model around the account-based future state. Define new or evolved roles: account architect (cross-functional account leader), AI agent steward (governance + KPIs), revenue ops integrator, customer success expansion lead. For each role: mandate, decision rights, success metric, reporting line. Be honest about which existing roles consolidate, evolve, or retire.\n\n**Exercise 3 – Adoption Sequencing (25 min):** Map the path from current to target. Sequence by: which roles change first, which capabilities they unlock, which legacy processes retire and when, where embedded enablement (in-team coaches) accelerates adoption. Reference the Microsoft AI-adoption recovery pattern from the CSC deck – campaign-tied champions drive measurable adoption faster than centralised training.\n\n**Wrap-up (10 min):** Capture the current and target operating models, the role transition plan with named champions, and the 90-day embedded enablement plan.",
    expectedOutputs: [
      "Current operating model map with friction points",
      "Target operating model with new / evolved roles, decisions, metrics",
      "Role transition plan with named champions",
      "90-day embedded enablement plan",
    ],
    relatedOpportunityIds: [
      "operating_model_adoption",
      "agile_op_model_assessment",
      "value_realization_growth_optimization",
    ],
    triggerCapabilities: [
      "vision_strategy",
      "abm",
      "abs",
      "service_advocacy",
    ],
    sortOrder: 8,
  },
];

// ══════════════════════════════════════════════════════════════════
// B2B_CLIENT_STORIES – anonymized proof points / pitch anchors
// ══════════════════════════════════════════════════════════════════

export const B2B_CLIENT_STORIES: B2bClientStory[] = [
  {
    id: "amer_cpq_renewal_play",
    title: "Legacy CPQ Renewal as the B2B Wedge",
    tagline:
      "$3.28B in addressable pipeline across 4,100 legacy CPQ installs renewing in 2026",
    capabilities: [
      "abs",
      "operations_commerce",
      "tech_data_intelligence",
    ],
    narrative:
      "Across 2026, ~4,100 legacy CPQ environments come up for renewal – many built by Merkle in 2010–2015 – representing a $3.28B total addressable B2B pipeline. The Merkle + Salesforce play replaces the legacy CPQ with Revenue Cloud and Sales Cloud, attaches Data Cloud + Informatica for unified data, layers Agentforce-native logic for deal review and quoting, and adds Regrello for process orchestration. The result: a single Salesforce-native revenue platform that compresses sales cycle time, lifts win rates, and unlocks a 5× ACV multiplier when Revenue Cloud lands with four clouds.",
    outcomes: [
      "$3.28B total addressable pipeline across 4,100 legacy CPQ installs",
      "5× ACV multiplier when Revenue Cloud attaches 4 clouds",
      "73% of B2B buyers prefer self-service – supported by Commerce Cloud + Rocket 2.0",
      "50+ legacy CPQ deployments in Merkle's portfolio – built by us, modernizable by us",
    ],
    industries: [
      "manufacturing",
      "industrial_energy",
      "technology_saas",
      "financial_services",
    ],
    prompts: [
      "When does your current CPQ renew, and what's the current cost?",
      "If you could redesign the quote-to-cash motion from scratch, what would change?",
      "Where today is sales waiting on a system that should be self-service?",
    ],
  },
  {
    id: "abm_pilot_to_blueprint",
    title: "ABM Pilot to Blueprint: 25% MQL→SQL Lift in Two Quarters",
    tagline:
      "Tier-1 account orchestration that turned ABM theory into a measurable revenue motion",
    capabilities: ["abm", "abs", "tech_data_intelligence"],
    narrative:
      "A B2B technology client had an ABM strategy on paper but stalled execution – list strategy without orchestration, content without buying-group tailoring, measurement still tied to MQL volume. Merkle ran a 12-week ABM pilot on 30 tier-1 accounts: rebuilt the buying-group map, rewrote core content for role + stage + account context, orchestrated paid + owned + sales touch in a coordinated 12-week sequence, and stood up an account-engagement scorecard shared in a weekly sales-marketing review. The pilot's success unlocked an enterprise ABM Blueprint engagement that codified the operating model.",
    outcomes: [
      "25% lift in MQL → SQL conversion across pilot accounts",
      "27% sales-cycle compression on pilot deals vs. baseline",
      "Pilot scaled into a $600K Blueprint engagement covering enterprise ABM operating model",
      "Marketing and sales now operate on a shared weekly account scorecard",
    ],
    industries: ["technology_saas"],
    prompts: [
      "Which tier-1 accounts could you cleanly run a 12-week pilot against?",
      "Where does marketing measurement still default to lead volume rather than account engagement?",
      "When did sales and marketing last meet weekly with a shared account scorecard?",
    ],
  },
  {
    id: "service_revenue_motion",
    title: "Turning Service Into a Revenue Motion",
    tagline:
      "AI service agents lifted NRR 7 points and freed humans for revenue moments",
    capabilities: ["service_advocacy", "tech_data_intelligence"],
    narrative:
      "A B2B client carried a service operation that ran as a cost center – high case volume, slow resolution, no expansion role. Merkle deployed Agentforce service agents against Tier-1 case patterns, stood up a customer-health scoring model that fired churn-risk and expansion alerts to CSMs, and reframed every routine interaction with an offer-eligibility check. Within six months, AI deflected 40% of routine cases, NRR lifted 7 points, and the human team – once a queue manager – became the revenue motion for tier-1 accounts.",
    outcomes: [
      "AI service agents deflecting 40% of Tier-1 cases",
      "NRR lifted 7 points in two quarters",
      "Service-driven expansion pipeline grew 3× as offer-eligibility checks fired in-flow",
      "Human team redirected from queue management to relationship and revenue work",
    ],
    industries: ["technology_saas", "financial_services"],
    prompts: [
      "What's the highest-volume service interaction your team handles today, and is it the right work for humans?",
      "Where does an AI service agent get measured – what KPI proves it's working?",
      "When was the last time service surfaced an expansion opportunity to sales without being asked?",
    ],
  },
  {
    id: "data_cloud_foundation",
    title: "Data Cloud + Identity as the AI Prerequisite",
    tagline:
      "Unified account / buying-group / contact identity unlocked every downstream AI use case",
    capabilities: ["tech_data_intelligence", "abm", "abs"],
    narrative:
      "A B2B manufacturing client had invested in Sales Cloud, marketing automation, and an ambitious AI roadmap – but every AI use case stalled because the customer record was fragmented across CRM, ERP, support, and commerce. Merkle deployed Data Cloud as the unified system of record, integrated Merkury identity graph for buying-group resolution, instrumented data quality and consent governance, and re-pointed downstream activation flows. With the foundation in place, the client landed three AI use cases (lead scoring, deal risk, service deflection) inside the next 90 days that had previously sat in pilot for over a year.",
    outcomes: [
      "Single source of truth across CRM, ERP, support, and commerce",
      "Buying-group resolution covering 85%+ of tier-1 accounts via Merkury",
      "Three downstream AI use cases shipped within 90 days of foundation go-live",
      "Quarterly value-realization scorecard now governs all AI investment decisions",
    ],
    industries: ["manufacturing", "industrial_energy"],
    prompts: [
      "How many systems hold a 'customer record' today, and which one is canonical?",
      "Which AI use case has been stuck in pilot longest – and what data gap is the real blocker?",
      "Who owns customer data quality at the enterprise level, and what's their KPI?",
    ],
  },
  {
    id: "self_service_commerce_shift",
    title: "Moving 50% of Revenue to Self-Service",
    tagline:
      "B2B commerce + marketplace strategy freed seller capacity and dropped cost-to-serve 22%",
    capabilities: ["operations_commerce", "abs"],
    narrative:
      "A B2B distributor with deep dealer and direct-customer relationships saw seller capacity capped – every routine reorder still required quoting, and channel partners had no live inventory visibility. Merkle deployed B2B Commerce Cloud with Rocket 2.0 accelerators, stood up a Mirakl-powered marketplace for adjacent SKUs, and re-engineered the seller incentive plan around digital-attached revenue. Within 18 months, 50% of revenue had moved to self-service or marketplace channels, sellers redirected to consultative deals, and cost-to-serve dropped 22%.",
    outcomes: [
      "50%+ of revenue running through self-service / marketplace",
      "22% reduction in cost-to-serve across the customer base",
      "Seller capacity freed for consultative and strategic deals",
      "Channel partner satisfaction (NPS) lifted 18 points with live inventory visibility",
    ],
    industries: ["manufacturing", "industrial_energy"],
    prompts: [
      "What share of your B2B revenue runs through digital channels today, and what's the trajectory?",
      "Which products would customers cheerfully buy without a rep involved?",
      "What incentive change would make sellers actively want digital-attached revenue?",
    ],
  },
  {
    id: "process_orchestration_agentic",
    title: "Process Orchestration with Agentforce + Regrello",
    tagline:
      "AI agents replaced email, tickets, and tribal knowledge across the order-to-cash flow",
    capabilities: ["operations_commerce", "tech_data_intelligence"],
    narrative:
      "A B2B client's order-to-cash process ran on email, spreadsheets, and tickets – exception handling consumed 30% of the ops team's time and customer-visible delivery exceptions averaged 12 per week. Merkle stood up a process orchestration layer (Regrello + Agentforce), defined explicit roles and guardrails for AI agents in the order-routing, exception-handling, and approval flows, and instrumented a per-agent KPI scorecard. Inside two quarters: exception handling dropped 60%, customer-visible delivery exceptions fell to under 3 per week, and the ops team redirected to higher-value work.",
    outcomes: [
      "60% reduction in manual exception handling time",
      "Customer-visible delivery exceptions cut from 12/week to <3/week",
      "AI agents handling order-routing and approval workflows with full auditability",
      "Per-agent KPI scorecard governing AI investment and expansion decisions",
    ],
    industries: ["manufacturing", "industrial_energy", "professional_services"],
    prompts: [
      "What share of your ops team's time is spent on exception handling rather than process improvement?",
      "Which workflows still run on email, tickets, or spreadsheets that could be orchestrated?",
      "What governance would make your CISO comfortable with AI agents in revenue workflows?",
    ],
  },
];

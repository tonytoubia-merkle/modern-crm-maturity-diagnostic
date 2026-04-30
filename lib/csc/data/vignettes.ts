import type {
  CscClientStory,
  CscWorkshopVignette,
} from "@/lib/csc/types";

/**
 * CSC workshop content – two parallel datasets:
 *
 *   1. CSC_VIGNETTES         – workshop facilitation exercises that
 *                              consultants run with client teams to
 *                              develop one or more capability areas.
 *                              Mirrors the CRM Vignettes shape.
 *
 *   2. CSC_CLIENT_STORIES    – anonymized (or Merkle-public) client
 *                              proof points used as anchors during
 *                              pitch and capability conversations.
 *                              Sourced from the 2026 CSC POV Narrative
 *                              and the Build / Activate Offering
 *                              Toolkits (v1.0, March 2026).
 *
 * Both surface in the /library page under the Content Supply Chain tab.
 */

// ══════════════════════════════════════════════════════════════════
// CSC_VIGNETTES – workshop facilitation exercises
// ══════════════════════════════════════════════════════════════════

export const CSC_VIGNETTES: CscWorkshopVignette[] = [
  {
    id: "csc_blueprint_kickoff",
    title: "Content Supply Chain Blueprint Kickoff",
    description:
      "Align stakeholders on the current state of the content supply chain, the target operating model, and the priority initiatives that need to happen before any platform investment. This is the canonical opening session for a CSC engagement.",
    durationMinutes: 90,
    category: "Strategy & Planning",
    requiredInputs: [
      "Diagnostic capability scores (current state)",
      "List of current content production tools (DAM, project mgmt, creative, distribution)",
      "Top 3 stakeholder pain points (from pre-work interviews)",
      "Approximate annual content volume and FTE count",
    ],
    facilitationGuide:
      "**Setup (10 min):** Walk through the diagnostic capability radar. Highlight the two lowest-scoring capabilities and the highest-leverage one. Frame the session as Build before Buy – we map workflows and design governance before naming platforms.\n\n**Exercise 1 – Pain Point Cluster (20 min):** On a board, capture every pain point voiced in pre-work and during the room. Cluster them under the six CSC capabilities (Strategy, Workflow, Asset Governance, Distribution, Measurement, Intelligence). Vote with dots on the three clusters that hurt the most this quarter.\n\n**Exercise 2 – Current vs. Target State (25 min):** For each of the top three pain clusters, write one sentence that describes the current state and one sentence that describes the desired target state in 12 months. Be specific: cycle times, FTE involvement, manual steps, asset reuse rates. Avoid vague language.\n\n**Exercise 3 – Wedge Identification (25 min):** Based on the gaps, identify the right wedge engagement: Blueprint (foundation missing), Innovation Accelerator (single high-value use case to prove value), Turnaround (stalled platform investment), Enterprise Transformation (cross-portfolio change), or Platform Value Realization (deployed but underused). One wedge per cluster – discuss the case for each.\n\n**Wrap-up (10 min):** Capture the chosen wedge(s), the executive sponsor, and the next two-week plan to formalize the engagement.",
    expectedOutputs: [
      "Pain-point heatmap clustered against the six CSC capabilities",
      "Current-state vs. target-state sentence pairs for top three gaps",
      "Recommended wedge engagement(s) with sponsor and next steps",
    ],
    relatedOpportunityIds: [
      "csc_strategy_blueprint",
      "innovation_accelerator",
    ],
    triggerCapabilities: ["strategy_planning"],
    sortOrder: 1,
  },

  {
    id: "cycle_time_workflow_mapping",
    title: "Content Cycle Time & Workflow Mapping",
    description:
      "Walk a real recent piece of content through every workflow stage to expose where time is actually lost. The output is a quantified workflow diagram that locates the cycle-time hotspots and the rework loops worth fixing first.",
    durationMinutes: 120,
    category: "Workflow & Production",
    requiredInputs: [
      "One real recent campaign or asset (anonymized) the team is willing to dissect",
      "Estimated calendar days at each stage (brief → concept → review → ship)",
      "List of every reviewer touch and approval gate",
      "Sample of the briefing document used",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the exercise as 'walk one piece of content through, end to end, and measure where the time actually goes.' Reference the Princess Cruises 25-day average and the Lumen 25→9-day acceleration as benchmarks.\n\n**Exercise 1 – Linear Walkthrough (30 min):** As a group, draw the workflow stages left-to-right on a board: brief → concept → draft → first review → revisions → legal/brand → final review → trafficking → ship. Annotate each stage with calendar time, who touches it, the tool used, and where it queues. Use real numbers – guess if you have to, then verify.\n\n**Exercise 2 – Rework Loop Audit (35 min):** Mark every rework loop in red – moments when content goes back upstream. For each loop, capture: what triggered it, how often it happens, and whether the trigger is structural (no shared brief) or behavioral (one person's preference). Distinguish necessary rework from avoidable rework.\n\n**Exercise 3 – Cycle-Time Hotspots (25 min):** Identify the three stages eating the most calendar time. For each, brainstorm whether the lever is people (skills/role clarity), process (briefing/intake/governance), tooling (Workfront/AEM), or AI (production/automation). Write a one-line hypothesis per hotspot.\n\n**Wrap-up (20 min):** Pick the top hotspot. Sketch a 30-day quick-win experiment with a measurable cycle-time target and a single owner.",
    expectedOutputs: [
      "End-to-end workflow diagram annotated with calendar time per stage",
      "Rework loop log distinguishing structural vs. behavioral triggers",
      "Top three cycle-time hotspots with hypothesis and 30-day experiment",
    ],
    relatedOpportunityIds: [
      "workflow_orchestration",
      "ai_accelerated_production",
    ],
    triggerCapabilities: ["workflow_production"],
    sortOrder: 2,
  },

  {
    id: "dam_governance_audit",
    title: "DAM & Asset Governance Audit",
    description:
      "Audit how assets actually live, get found, and get reused in the current DAM (or DAM-substitute). Surfaces the governance and taxonomy gaps that block trustable reuse – the prerequisite for modular content and AI-driven production.",
    durationMinutes: 90,
    category: "Asset Governance",
    requiredInputs: [
      "Read access to the primary DAM(s) and any shared drives still in use",
      "Current taxonomy / metadata schema (if documented)",
      "Latest utilization metrics – uploads, downloads, search hits",
      "List of teams with admin / publishing rights",
    ],
    facilitationGuide:
      "**Setup (10 min):** Define the DAM's intended job (single source of truth, governed reuse, downstream activation feed). Reference the CPG client benchmark: 35% utilization is broken; 72% in 60 days is what good adoption looks like.\n\n**Exercise 1 – Adoption Forensics (20 min):** Pull live numbers: how many assets, who uploaded them, who is searching, and what searches return zero results. Look at the actual usage tail – are 80% of downloads coming from 10% of assets? Surface the dead inventory.\n\n**Exercise 2 – Taxonomy Stress Test (25 min):** Pick five common briefs from the last quarter. For each, try to find the right approved asset in the DAM in under five minutes – live, in the room. Score each search: found / found wrong version / not found / found but rebuilt anyway. Capture why each failed.\n\n**Exercise 3 – Governance Map (25 min):** Draw the current rights and roles: who approves an upload, who deprecates, who tags, who decides naming, who owns rights and expiry. Mark the gaps where decisions have no owner. Mark the bottlenecks where one person owns too much.\n\n**Wrap-up (10 min):** Capture three governance fixes that need to happen in the next 60 days before any asset-intelligence or AI-production work goes live.",
    expectedOutputs: [
      "Adoption forensics – utilization, search-zero-results, dead-inventory rate",
      "Five-search stress test scorecard with failure reasons",
      "Current governance roles map with ownership gaps and bottlenecks",
      "60-day governance fix list",
    ],
    relatedOpportunityIds: [
      "content_data_fabric",
      "platform_value_realization",
    ],
    triggerCapabilities: ["asset_governance"],
    sortOrder: 3,
  },

  {
    id: "modular_content_design_sprint",
    title: "Modular Content Design Sprint",
    description:
      "Take one campaign that today gets rebuilt per channel and design it as modular components instead. Outputs a working component map and assembly rules – the design pattern that lets one team feed CRM, commerce, and media without a linear cost curve.",
    durationMinutes: 120,
    category: "Workflow & Production",
    requiredInputs: [
      "One real campaign that ran in the last 90 days across 3+ channels",
      "All deliverables that shipped (emails, landing pages, social, paid)",
      "The original creative brief and any subsequent variant briefs",
      "Channel-by-channel performance summary if available",
    ],
    facilitationGuide:
      "**Setup (15 min):** Frame the modular shift: from channel-shaped content to audience-shaped components. Show the Vanguard structured-fragments example and the Adobe atomic-design pattern. The deliverable is a component map you could rebuild this campaign from tomorrow.\n\n**Exercise 1 – Asset Decomposition (25 min):** On a wall, lay out every shipped asset from the campaign. Decompose each into its components: headline, subhead, body, CTA, hero image, supporting image, proof point, legal disclosure. Where multiple variants existed, line them up so the team can see what actually changed.\n\n**Exercise 2 – Component Library Sketch (35 min):** Cluster repeated components across the campaign. For each cluster, define: a stable name, the structural fields, the variants captured, and the rules for when each variant fires (audience, channel, lifecycle). The output is a 10–15 component list with structural fields named.\n\n**Exercise 3 – Assembly Rules (25 min):** For three audiences × three channels = nine combinations, write the assembly rule that selects which component variants go where. Discover the rules that don't yet exist (e.g. 'we don't actually have a logged-in vs. logged-out hero variant – we just used the same one').\n\n**Wrap-up (20 min):** Capture the component map, the assembly rule template, and the next campaign that will be built modular-first as the proof.",
    expectedOutputs: [
      "Decomposed component inventory for the source campaign",
      "Modular component library sketch (10–15 components, named, with fields)",
      "Assembly rules table for three audiences × three channels",
      "Identified next campaign for modular-first build",
    ],
    relatedOpportunityIds: [
      "modular_content_framework",
      "dynamic_content_activation",
    ],
    triggerCapabilities: ["workflow_production", "asset_governance"],
    sortOrder: 4,
  },

  {
    id: "distribution_activation_audit",
    title: "Distribution & Activation Audit",
    description:
      "Trace how an approved asset travels from the DAM into CRM, commerce, paid media, and any other surfaces – and where it gets re-versioned, re-uploaded, or recreated entirely. Surfaces the activation breaks that prevent personalization at scale.",
    durationMinutes: 90,
    category: "Distribution & Activation",
    requiredInputs: [
      "Map of distribution channels (CRM platform, ESP, commerce, AdTech, social schedulers)",
      "Sample asset that recently went to 3+ surfaces",
      "Localization process documentation if applicable",
      "Personalization or dynamic-content rules currently in production",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the question: 'when an approved asset leaves the DAM, what really happens?' Reference Lumen's 3× faster social time-to-market and the AEM dynamic-content fragment pattern as anchors.\n\n**Exercise 1 – Trace the Asset (25 min):** Pick the sample asset. Walk it from approval → publication → into each surface it landed on. For each hop, capture: who moved it, what tool moved it, what got re-versioned, what got re-uploaded, what changed about the metadata, and how long the hop took. The trace usually exposes 3–5 invisible re-creation points.\n\n**Exercise 2 – Personalization & Localization Reality Check (30 min):** List every dynamic content variant that currently fires in production (audience, journey stage, market, language). For each, mark whether it's a true component-driven variant or a manually-built copy. Calculate the ratio. Discuss which true variants would actually move business outcomes if added.\n\n**Exercise 3 – Activation Break Map (15 min):** On a board, mark every break in the chain – every place where the asset gets disconnected from its source, manually re-uploaded, re-localized by a vendor, or where a downstream system can't subscribe to updates. Mark severity: blocks personalization, creates legal/brand risk, eats FTE time, slows speed-to-market.\n\n**Wrap-up (10 min):** Capture the top three activation breaks worth fixing first. Define what 'fixed' would look like – measurable, time-bound.",
    expectedOutputs: [
      "Asset journey trace with re-creation points marked",
      "Production dynamic-variant inventory with component vs. manual ratio",
      "Activation break map ranked by severity",
      "Top three activation breaks with definition-of-done",
    ],
    relatedOpportunityIds: [
      "dynamic_content_activation",
      "modular_content_framework",
    ],
    triggerCapabilities: ["distribution_activation"],
    sortOrder: 5,
  },

  {
    id: "measurement_loop_workshop",
    title: "Measurement Feedback Loop Workshop",
    description:
      "Most CSC operations measure spend and output but not asset-level performance feeding back into briefing. This session designs the closed measurement loop that turns content from a cost center into a learning system.",
    durationMinutes: 90,
    category: "Measurement & Insights",
    requiredInputs: [
      "Current content KPIs and reporting cadence",
      "Sample of the most recent post-campaign report",
      "Brief template currently used (to assess whether it captures hypotheses)",
      "Access to whatever asset-level performance data exists today",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the measurement loop: brief → asset → activation → measurement → next brief. The Stage 4 maturity test isn't reporting volume – it's whether last quarter's asset performance changed this quarter's briefs.\n\n**Exercise 1 – KPI Audit (20 min):** List every content KPI in active use today. For each, mark whether it measures volume (e.g. assets shipped), quality (review rounds, brand compliance), business outcome (conversion, AOV, retention), or asset-level performance (which specific creative drove what). Most teams over-index on volume; surface the imbalance.\n\n**Exercise 2 – Asset-to-Outcome Trace (30 min):** Pick the last campaign with measurable business impact. Try to trace which specific assets / variants / components contributed how much. Score the team's ability to do this on a 1–5 scale. If it's lower than 3, surface the data and tooling gaps that prevent it.\n\n**Exercise 3 – Closing the Loop (25 min):** Look at the brief template. Does it ask for hypotheses? Does it reference prior asset performance? Redesign the brief template to require: the hypothesis, the prior asset learnings being applied, the success metric and its baseline. Pilot the new template against one upcoming campaign.\n\n**Wrap-up (5 min):** Identify the data and tooling gaps that block consistent asset-to-outcome attribution. Capture as a 90-day measurement-loop fix plan.",
    expectedOutputs: [
      "Audited KPI inventory categorized as volume / quality / outcome / asset-level",
      "Asset-to-outcome traceability self-score and gap list",
      "Redesigned brief template that closes the learning loop",
      "90-day measurement-loop fix plan",
    ],
    relatedOpportunityIds: [
      "content_performance_intelligence",
      "continuous_value_accelerator",
    ],
    triggerCapabilities: ["measurement_insights"],
    sortOrder: 6,
  },

  {
    id: "ai_pilot_identification",
    title: "AI Content Pilot Identification",
    description:
      "Identify the single highest-value, lowest-risk AI content pilot for the next 90 days. Pulls from where AI tools are already licensed but underused (Firefly, Express, GenStudio, Workfront automation) and matches them to a real workflow that hurts.",
    durationMinutes: 90,
    category: "Intelligence & Automation",
    requiredInputs: [
      "List of AI content / automation tools currently licensed",
      "Adoption metrics for each (active users, monthly use)",
      "Top three workflows the team already wishes were faster",
      "Brand and legal guardrails that would apply to any AI output",
    ],
    facilitationGuide:
      "**Setup (10 min):** Use the Microsoft AI-adoption recovery story as the anti-pattern: license without governance and enablement → stalled adoption → eroded trust. The goal of this session is to pick one pilot that doesn't repeat that pattern.\n\n**Exercise 1 – Tool Adoption Reality (15 min):** For each licensed AI tool, plot it on a 2x2: capability potential (low/high) × current adoption (low/high). The high-potential / low-adoption quadrant is where pilots should come from. Don't pitch tools that aren't yet licensed.\n\n**Exercise 2 – Pilot Use Case Scoring (35 min):** Brainstorm 8–12 candidate pilots – concrete workflow + tool + measurable outcome. For each, score on a 1–5 scale across: business impact, brand/legal risk, time-to-value, adoption-readiness of the team, and proximity to an existing campaign. Eliminate anything with risk ≥ 4 or adoption-readiness ≤ 2.\n\n**Exercise 3 – Guardrails & Enablement Plan (20 min):** For the top-ranked pilot, design the guardrails (brand kit configured, custom-trained model on approved assets, review gate, KPIs). Identify the champion who will run it, the executive sponsor, and the 30/60/90-day adoption metrics that prove it's working.\n\n**Wrap-up (10 min):** Get a verbal commitment from the executive sponsor on funding the pilot. Capture risks and mitigation plan.",
    expectedOutputs: [
      "AI tool adoption 2x2 with high-potential/low-adoption quadrant identified",
      "Scored pilot candidate list (8–12) with eliminated and shortlisted use cases",
      "Top pilot with guardrails, champion, sponsor, and 30/60/90 adoption metrics",
      "Verbal sponsor commitment on funding",
    ],
    relatedOpportunityIds: [
      "ai_accelerated_production",
      "innovation_accelerator",
      "platform_value_realization",
    ],
    triggerCapabilities: ["intelligence_automation", "workflow_production"],
    sortOrder: 7,
  },

  {
    id: "operating_model_design",
    title: "CSC Operating Model & Adoption Design",
    description:
      "Design the role-based operating model that supports modular, governed, AI-augmented content at scale – and the adoption path that gets the org from today's model to the new one without stalling. This is the human-systems half of every transformation.",
    durationMinutes: 120,
    category: "Strategy & Planning",
    requiredInputs: [
      "Current org chart for content / creative / studio / marketing ops teams",
      "FTE count and role mix (in-house vs. agency vs. contractor)",
      "List of any prior change initiatives in this space (and what stalled them)",
      "Executive sponsorship structure for transformation",
    ],
    facilitationGuide:
      "**Setup (15 min):** Frame the operating model as 'who does what, where decisions live, and how teams hand off.' Use the Highmark example: 97+ FTE adoption isn't a tool problem – it's a role clarity, governance, and enablement problem. New tools without new roles default back to old behaviors.\n\n**Exercise 1 – Current Operating Model Diagnosis (30 min):** Map the current model: content strategists, creative producers, studio, brand, legal, channel owners, agencies, vendors. Draw the actual handoffs and decision rights – not the org chart. Mark the friction points: handoffs that always slip, decisions with no clear owner, roles that are doing two jobs poorly.\n\n**Exercise 2 – Target Operating Model Design (40 min):** Design the target model around the modular + AI-augmented future state. Define new or evolved roles: content architect, modular component owner, AI content steward, asset governance lead, performance analyst feeding briefs. For each, define mandate, decision rights, success metric, and reporting line. Be honest about which existing roles consolidate or change.\n\n**Exercise 3 – Adoption Sequencing (25 min):** Map the path from current to target. Sequence by: (a) which roles change first, (b) which capabilities they enable, (c) which legacy processes get retired and when, (d) where embedded enablement (in-team coaches) accelerates adoption. Reference the Microsoft pattern: champions tied to real campaigns drive measurable adoption faster than centralized training.\n\n**Wrap-up (10 min):** Capture the target operating model, the role transition plan (who changes role and when), and the 90-day enablement plan.",
    expectedOutputs: [
      "Current operating model map with friction points",
      "Target operating model with new/evolved roles, decision rights, metrics",
      "Role transition plan (who changes, when, supported how)",
      "90-day embedded enablement plan with named champions",
    ],
    relatedOpportunityIds: [
      "operating_model_adoption",
      "enterprise_transformation",
    ],
    triggerCapabilities: ["strategy_planning", "workflow_production"],
    sortOrder: 8,
  },
];

// ══════════════════════════════════════════════════════════════════
// CSC_CLIENT_STORIES – anonymized proof points / pitch anchors
// (formerly CSC_VIGNETTES; renamed for semantic clarity now that we
// have a separate workshop-exercise dataset above.)
// ══════════════════════════════════════════════════════════════════

export const CSC_CLIENT_STORIES: CscClientStory[] = [
  {
    id: "highmark_enterprise_transformation",
    title: "Enterprise Content Transformation in a Regulated Industry",
    tagline:
      "From 45–60 day content cycles toward a 15-day target with governed AI",
    capabilities: [
      "strategy_planning",
      "workflow_production",
      "asset_governance",
      "intelligence_automation",
    ],
    narrative:
      "A regulated healthcare enterprise ran 200,000+ content-influenced hours annually across ~98 monthly contributors, with content moving through 12+ reviewer workflows in cycles averaging 45–60 days. Five DAMs coexisted. Tooling fragmented across Excel, Jira, and Trello. Review cycles were so long that by the time content shipped, the strategy had moved on. Merkle anchored the work in an Enterprise Transformation – unifying the operating system around Workfront + AEM + integrated AI, with a 15-day cycle target, role clarity for 97+ FTE adoption, and an AI enablement model that moved isolated pilots to governed, scalable automation.",
    outcomes: [
      "$21.7M net benefit over 5 years",
      "149% ROI with 28-month payback",
      "5 DAMs consolidated to a single hub (Tenovos)",
      "~15% asset reuse → 60–75% governed reuse target",
      "Cycle time: 45–60 days → target <15 days",
    ],
    prompts: [
      "Where are your longest review cycles today, and who actually owns each decision?",
      "Which platforms are live but getting bypassed – and why?",
      "If AI automation could eliminate one category of manual work this quarter, which would it be?",
    ],
  },
  {
    id: "princess_csc_blueprint",
    title: "From CSC Blueprint to $5.7M Transformation Vision",
    tagline: "Phase 1 strategy engagement becomes an enterprise Phase 2 plan",
    capabilities: [
      "strategy_planning",
      "asset_governance",
      "workflow_production",
    ],
    narrative:
      "Princess Cruise Lines had fragmented tools, redundant asset creation, and no clear migration path. The engagement started as a 12-week CSC Strategy Blueprint and expanded into a full transformation vision. Merkle delivered 15 use cases with crawl-walk-run phasing, ran technology evaluations (AEM vs. Widen, Express vs. Canva, Content Hub vs. Frontify), remediated enterprise governance and taxonomy, and designed the end-to-end CSC using Workfront, AEM Assets, Creative Cloud, and Adobe Express – complete with a change management framework and stakeholder alignment approach.",
    outcomes: [
      "$5.7M annual operational value identified in Phase 2",
      "$486K year-one quick wins scaling to $2.2M at full adoption",
      "$134K CX opportunity unlocked",
      "15 use cases defined with crawl-walk-run phasing & dependency mapping",
    ],
    industries: ["travel_hospitality"],
    prompts: [
      "What fragmentation exists in your asset and creative tools stack today?",
      "If you had a prioritized 15-use-case roadmap, which would you attack first?",
      "Where are you currently defaulting to 'buy' without a blueprint?",
    ],
  },
  {
    id: "lumen_genstudio_acceleration",
    title: "B2B Content Acceleration with GenStudio",
    tagline: "From 25-day content cycles to 9 days through AI-powered production",
    capabilities: [
      "workflow_production",
      "intelligence_automation",
      "distribution_activation",
    ],
    narrative:
      "Lumen was evolving from a traditional network service provider to a modern B2B tech solutions partner. A disconnected marketing and CX technology stack, manual workflows, and siloed data architecture prevented delivery of personalized customer experiences at scale. Merkle led a comprehensive digital transformation spanning data modernization, content supply chain optimization, and technology architecture alignment. Adobe GenStudio became the acceleration engine, with enterprise data strategy optimizing Adobe and Salesforce integration, governance frameworks, and customer journey development enabling real-time, personalized engagement.",
    outcomes: [
      "Content creation accelerated from 25 days to 9 days",
      "3× faster time-to-market for social campaigns",
      "64% reduction in content creation time",
    ],
    prompts: [
      "How long does it currently take from brief to live campaign?",
      "Which channels are waiting the longest for content today?",
      "If GenAI could cut 50% from one workflow this year, where would you use it?",
    ],
  },
  {
    id: "vanguard_aem_cloud_migration",
    title: "AEM Cloud Migration with Governance-First Design",
    tagline:
      "Structured intake, workflow, and governance in a regulated environment",
    capabilities: [
      "asset_governance",
      "workflow_production",
      "distribution_activation",
    ],
    narrative:
      "Vanguard wanted to migrate to AEM cloud from on-premise but had no governance model, fragmented ownership across teams, and an unclear migration path. Merkle designed AEM Cloud + Workfront for structured intake, workflow, and content governance. Follow-on work introduced Adobe Experience Platform + AJO for real-time decisioning and AEM for structured content fragments – unlocking 1:1 personalization at scale, improved conversion, and reduced production burden inside the constraints of a regulated financial services environment.",
    outcomes: [
      "Governance model established for regulated content",
      "Migration path defined with risk mitigation",
      "1:1 personalization at scale enabled",
      "Production burden reduced through structured content fragments",
    ],
    industries: ["financial_services"],
    prompts: [
      "Who owns which content decisions across your teams today?",
      "What's preventing your next platform migration from starting?",
      "Where are regulated disclosures still getting recreated manually across surfaces?",
    ],
  },
  {
    id: "microsoft_ai_adoption_recovery",
    title: "Rescuing Stalled AI Tool Adoption",
    tagline:
      "From \"no one is using it\" to measurable adoption lift tied to real campaigns",
    capabilities: ["workflow_production", "intelligence_automation"],
    narrative:
      "Microsoft had purchased Firefly, Express, and GenStudio, but adoption stalled post-launch. There was no governance or enablement plan; teams defaulted back to legacy tools; early outputs felt generic and off-brand, eroding stakeholder trust. Merkle led an activation program that configured the brand kit in Express, trained a custom Firefly model on approved brand assets, and integrated a GenStudio workflow into the existing campaign intake. Tools now work within brand guardrails from day one, and confidence was restored through quick wins tied to real campaigns.",
    outcomes: [
      "Tools working within brand guardrails from day 1",
      "Measurable adoption lift across content teams",
      "Restored stakeholder confidence through campaign-tied quick wins",
    ],
    prompts: [
      "Which AI tools have you bought that aren't being used today?",
      "What brand guardrails do your teams worry would get broken by AI?",
      "Where do you have champions who could become AI catalysts?",
    ],
  },
  {
    id: "cpg_dam_value_realization",
    title: "Recovering Stranded DAM ROI Through Adoption",
    tagline: "From 35% utilization to 72% in 60 days",
    capabilities: ["asset_governance", "workflow_production"],
    narrative:
      "A global CPG client saw their $2M DAM investment sitting at 35% utilization six months post-launch. Creative teams were still using shared drives, brand managers couldn't find approved assets, and regional offices operated in silos. Merkle's Platform Value Realization engagement diagnosed adoption barriers, reconfigured workflows, and delivered embedded enablement inside delivery teams. Within 60 days of intervention, the platform finally started delivering the ROI originally projected two years earlier.",
    outcomes: [
      "DAM utilization: 35% → 72% in 60 days",
      "Asset search time: 45 minutes → under 5 minutes",
      "60% reduction in duplicate content creation",
    ],
    industries: ["retail"],
    prompts: [
      "What's the utilization of your largest content platform today?",
      "How long does it take your team to find an approved asset?",
      "Where is manual rework silently taxing every campaign?",
    ],
  },
];

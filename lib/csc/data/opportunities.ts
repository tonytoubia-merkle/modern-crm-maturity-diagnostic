import type { CscOpportunity } from "@/lib/csc/types";

/**
 * Merkle Content Supply Chain offerings, grounded in the 2026 CSC POV,
 * Build Offering Toolkit v1.0, and Activate Offering Toolkit v1.0.
 *
 * Organized in two layers:
 *   1. Seven named Merkle engagements ("what we sell") — Blueprint, Innovation
 *      Accelerator, Turnaround & Recovery, Enterprise Transformation,
 *      Platform Value Realization, Continuous Value Accelerator, Managed
 *      Content Production. These map directly to the investment bands,
 *      timings, and outcomes documented in the offering toolkits.
 *   2. Seven capability-level initiatives ("what sits inside") — the data
 *      fabric, modular design, AI production, workflow, activation,
 *      intelligence, and operating-model work that the named engagements
 *      pull together. Useful when a client only needs a targeted scope.
 */
export const CSC_OPPORTUNITIES: CscOpportunity[] = [
  // ══════════════════════════════════════════════════════════════════
  // NAMED MERKLE ENGAGEMENTS — Build stream
  // ══════════════════════════════════════════════════════════════════
  {
    id: "csc_strategy_blueprint",
    title: "CSC Strategy Blueprint",
    tagline:
      "Align current state, target state, and priority efforts before platform investment",
    description:
      "The foundational wedge engagement. Assesses current content supply chain workflows, technology, and organizational readiness; defines a clear target state; aligns stakeholders on priority initiatives and sequencing; delivers a business case that enables confident investment decisions.",
    capabilities: ["strategy_planning", "workflow_production"],
    triggerThreshold: 3.0,
    scope:
      "Current/target state assessment, operating model design, prioritized implementation roadmap, business case for transformation investment.",
    methods: [
      "Stakeholder alignment sessions and discovery interviews",
      "Current state workflow, technology, and organizational maturity assessment",
      "Target operating model and process map design",
      "Prioritized implementation roadmap with crawl-walk-run phasing",
      "Business case with ROI model and investment prioritization",
    ],
    valueNarrative:
      "Build before Buy. Blueprint content supply chain processes before touching technology — map workflows, design governance, architect role-based operations, and establish marketing data fabric. Princess Cruises started here and unlocked $5.7M in identified operational value with $486K in year-one quick wins. Without a blueprint, platform decisions default to vendor preferences rather than your architecture.",
    sfType: "CSC Strategy",
    engagementSize: "8–16 weeks · $350K–$500K",
    priority: "critical",
  },

  {
    id: "innovation_accelerator",
    title: "Innovation Accelerator",
    tagline:
      "Rapidly validate a high-value use case before committing to enterprise scale",
    description:
      "A focused program that anchors in a single use case, channel, market, or portion of the supply chain — typically AI content production, modular design, or intelligent workflow orchestration. Proves business value, configures a pilot platform environment, and establishes a clear path from experimentation to scalable transformation.",
    capabilities: ["workflow_production", "intelligence_automation"],
    triggerThreshold: 3.0,
    scope:
      "Pilot use case definition, platform configuration, workflow design, AI production proof, scale readiness assessment.",
    methods: [
      "Define pilot scope criteria and success metrics",
      "Configure pilot platform environment (Workfront, AEM, GenStudio, Firefly)",
      "Implement targeted workflow design and taxonomy deployment",
      "Execute AI production proof with brand and legal guardrails",
      "Performance measurement framework and enterprise scale readiness assessment",
    ],
    valueNarrative:
      "Innovation is slow, risky, and hard to operationalize when teams try to transform everything at once. The Innovation Accelerator lets you prove the economics of one high-value use case — typically AI-accelerated production or modular personalization — before committing enterprise-scale investment. Adobe saw 82% efficiency gained per campaign via this exact pattern.",
    sfType: "CSC Implementation",
    engagementSize: "9–12 months · $700K–$1.5M",
    priority: "critical",
  },

  {
    id: "turnaround_recovery",
    title: "Turnaround & Recovery",
    tagline: "Stabilize a failing or stalled content platform implementation",
    description:
      "Rescue program for content supply chain initiatives in trouble — stalled ownership, fragmented configurations, low adoption, over-customization, implementation debt. Rapid diagnosis, executive governance reset, and targeted remediation across technology, process, and organizational dimensions to restore operational stability and a credible foundation for sustained optimization.",
    capabilities: [
      "workflow_production",
      "asset_governance",
      "distribution_activation",
    ],
    triggerThreshold: 3.0,
    scope:
      "Operational diagnostic, stabilization plan, workflow remediation, governance reset, recovery roadmap with re-baselined metrics.",
    methods: [
      "Comprehensive operational diagnostic and root cause analysis",
      "Recovery PMO with decision rights, escalation paths, and delivery cadence",
      "Rapid stabilization actions and workflow rationalization",
      "Platform configuration and integration remediation using native patterns",
      "Adoption recovery with targeted enablement tied to real work, not generic training",
    ],
    valueNarrative:
      "Standard vendor support addresses technical issues, not human ones. Help desks fix bugs but can't fix adoption. Novo Nordisk and Highmark Health turned to T&R to stabilize failing implementations before they calcified into shelfware. A recovery PMO, executive decision-rights reset, and remediation of customization debt moves platforms from stranded investments back to delivery engines.",
    sfType: "CSC Recovery",
    engagementSize: "5–12 months · $500K–$2M+",
    priority: "high",
  },

  {
    id: "enterprise_transformation",
    title: "Enterprise Transformation",
    tagline:
      "Rebuild content operations holistically through unified strategy, implementation, and change",
    description:
      "Multi-year, PMO-anchored program for enterprises ready to reimagine content operations at scale. Unifies platform implementation, workflow redesign, data architecture, AI integration, and organizational change under a single program. Coordinates across internal stakeholders and external vendors to deliver sustained efficiency, governance, and adaptability.",
    capabilities: [
      "strategy_planning",
      "workflow_production",
      "asset_governance",
    ],
    triggerThreshold: 2.75,
    scope:
      "Program governance, enterprise platform implementation, content data fabric, AI governance, organizational change, vendor coordination.",
    methods: [
      "Program governance framework and PMO structure",
      "Enterprise platform implementation (Workfront, AEM, GenStudio, Firefly)",
      "Content data fabric architecture with enriched metadata",
      "AI adoption and governance framework for enterprise-scale automation",
      "Organizational change management across 100+ FTE content teams",
      "Vendor coordination and cross-platform integration management",
    ],
    valueNarrative:
      "Highmark Health moved from a 45–60 day content cycle toward a 15-day target via an Enterprise Transformation anchored in Merkle's PMO — 200,000 CSC-influenced hours, $21.7M net benefit over five years, 149% ROI, 28-month payback. When the ambition is not to fix one pain point but to rebuild the operating system, this is the engagement.",
    sfType: "CSC Enterprise Program",
    engagementSize: "2–5 years · $5M+/year",
    priority: "critical",
  },

  // ══════════════════════════════════════════════════════════════════
  // NAMED MERKLE ENGAGEMENTS — Activate stream
  // ══════════════════════════════════════════════════════════════════
  {
    id: "platform_value_realization",
    title: "Platform Value Realization",
    tagline:
      "Recover stranded platform ROI by fixing adoption, not adding features",
    description:
      "The Activate wedge — for enterprises whose content platforms are live but whose teams have reverted to manual workarounds. Diagnoses adoption barriers, reconfigures workflows, delivers embedded enablement, and establishes governance that prevents regression. Typical outcome: utilization moves from under 40% to over 70% within 90 days.",
    capabilities: ["workflow_production", "asset_governance"],
    triggerThreshold: 3.5,
    scope:
      "Adoption barrier diagnostic, current state workflow readout, embedded enablement, governance framework, champion training, stabilization metrics dashboard.",
    methods: [
      "Adoption barrier diagnostic across all user groups",
      "Current workflow analysis and pain point identification",
      "Workflow reconfiguration and quick-win adjustments",
      "Embedded enablement programs launched inside delivery teams",
      "Platform champion intensive training and certification",
      "Stabilization metrics dashboard with business value assessment",
    ],
    valueNarrative:
      "Only 28% of employees can effectively use their organization's AI tools today. A global CPG client had a $2M DAM investment sitting at 35% utilization six months post-launch; within 60 days of Merkle intervention, utilization jumped to 72%, asset search time dropped from 45 minutes to under 5, and duplicate content creation fell 60%. Platform Value Realization is operational rescue and scale preparation, not traditional consulting.",
    sfType: "CSC Adoption & Value",
    engagementSize: "3–8 months · $400K–$800K",
    priority: "critical",
  },

  {
    id: "continuous_value_accelerator",
    title: "Continuous Value Accelerator",
    tagline: "PMO-anchored run & optimize for sustained competitive advantage",
    description:
      "Long-horizon, PMO-anchored engagement that turns a stabilized content supply chain into a compounding growth asset. Closed-loop measurement, AI enhancement, cross-functional adoption at scale, and optimization cycles aligned to agentic and emerging technologies. For enterprises who have built — now ready to keep ahead.",
    capabilities: ["measurement_insights", "intelligence_automation"],
    triggerThreshold: 4.0,
    minTriggerScore: 3.0,
    scope:
      "PMO governance, enterprise adoption program, continuous optimization roadmap, performance analytics dashboard, AI enhancement plan, knowledge transfer.",
    methods: [
      "PMO establishment and enterprise governance framework",
      "Adoption program design across markets and business units",
      "Performance analytics dashboard and insights generation",
      "AI enhancement plan and agentic capability activation",
      "Continuous optimization cycles aligned to emerging technologies",
    ],
    valueNarrative:
      "Organizations with specialist support achieve 196% ROI versus 30% for those going it alone. A global technology client reduced content production time by 65%, improved asset reuse by 80%, and generated $4.2M annual savings through continuous optimization — with ROI compounding as insights feed back into strategic decisions. Static platforms become liabilities; continuously optimized ones become differentiators.",
    sfType: "CSC Managed Optimization",
    engagementSize: "1–3+ years · $1.0M–$2M+",
    priority: "high",
  },

  {
    id: "managed_content_production",
    title: "Managed Content Production",
    tagline: "Fully outsourced content operations via GenStudio dentsu+",
    description:
      "For enterprises recognizing that content operations excellence requires capabilities beyond their strategic focus. A complete outsourced solution through Dentsu's integrated creative, production, and media network — AI-accelerated workflows, global transcreation, performance-driven optimization, all powered by GenStudio dentsu+, the first agency ecosystem built on Adobe's platform.",
    capabilities: ["workflow_production", "distribution_activation"],
    triggerThreshold: 5,
    minTriggerScore: 3.5,
    scope:
      "Full-service creative operations, AI-powered production, multi-market transcreation, omnichannel adaptation, brand governance, performance analytics.",
    methods: [
      "Full-service content production and creative operations",
      "GenStudio dentsu+ AI-powered production ecosystem",
      "Multi-market transcreation and localization at scale",
      "Omnichannel asset adaptation and versioning",
      "Real-time compliance and brand governance",
      "Content performance analytics and continuous optimization",
    ],
    valueNarrative:
      "When content operations excellence is needed but isn't the strategic focus of the organization, outsourcing to Dentsu's integrated ecosystem delivers enterprise-grade production without the operational burden. We use GenStudio dentsu+ ourselves every day — the same platform we build for clients becomes the engine we run for you.",
    sfType: "Managed Content Services",
    engagementSize: "1–3+ years · custom",
    priority: "innovation",
  },

  // ══════════════════════════════════════════════════════════════════
  // CAPABILITY-LEVEL INITIATIVES — what sits inside the named engagements
  // ══════════════════════════════════════════════════════════════════
  {
    id: "content_data_fabric",
    title: "Content Data Fabric & Taxonomy",
    tagline: "Metadata, rights, and taxonomy that make every asset addressable",
    description:
      "Architect the marketing data fabric that sits underneath the content supply chain — enterprise campaign taxonomy, enriched metadata, content schema, and rights tracking — so every asset is discoverable, governed, compliant, and reusable at scale. Without a data fabric, personalization, AI, and measurement cannot work.",
    capabilities: ["asset_governance"],
    triggerThreshold: 3.0,
    scope:
      "Enterprise taxonomy design, metadata schema, rights and talent tracking, compliance enforcement, integration into DAM and activation.",
    methods: [
      "Enterprise campaign taxonomy and content schema design",
      "Enriched metadata architecture with efficiency and performance KPIs",
      "Rights, talent, and licensing tracking at the asset level",
      "Automated expiration and usage enforcement by geography and channel",
      "Integration with DAM, workflow, and activation systems",
    ],
    valueNarrative:
      "A DAM without a data fabric is just a storage locker. Merkle's CSC Build is anchored on a content data fabric so assets aren't just stored — they're addressable, activatable, and traceable to outcomes. Princess Cruises and Highmark both started with taxonomy and metadata remediation before any platform work.",
    sfType: "Content Data Fabric",
    engagementSize: "10–16 weeks · $250K–$500K",
    priority: "high",
  },

  {
    id: "modular_content_framework",
    title: "Modular Content & Atomic Design",
    tagline:
      "Reusable atoms that assemble into channel, variant, and market experiences",
    description:
      "Design and operationalize a modular content framework — atomic creative components (hooks, visuals, product blocks, CTAs) that reassemble across channels, variants, and personalization logic. This is the structural shift that unlocks variant scale, collapses rebuild cost, and makes content truly activatable via CRM, decisioning, and commerce.",
    capabilities: ["strategy_planning", "asset_governance"],
    triggerThreshold: 3.0,
    scope:
      "Modular taxonomy, atomic component library in DAM, brief template upgrade, creative + production + MarTech alignment, governance for reuse and versioning.",
    methods: [
      "Modular taxonomy design (atoms, molecules, experiences)",
      "Atomic component library build inside the DAM",
      "Brief and concept template upgrade for modular thinking",
      "Creative, production, and MarTech alignment on the assembly model",
      "Governance model for module reuse, versioning, and retirement",
    ],
    valueNarrative:
      "Monolithic creative breaks the economics of personalization — every variant costs another bespoke build. Modular content reverses that: one concept produces hundreds of compliant variants at a fraction of the cost. A global brand needing 600,000 assets to cover 5 products × 4 personas × 12 campaigns × 10 channels × 50 markets can't get there without modularity.",
    sfType: "Content Strategy & Design",
    engagementSize: "12–20 weeks · $500K–$900K",
    priority: "high",
  },

  {
    id: "ai_accelerated_production",
    title: "AI-Accelerated Production (GenStudio / Firefly)",
    tagline:
      "Bring generative AI into production with brand and legal guardrails",
    description:
      "Operationalize generative AI across copy, image, video, layout, translation, and resizing — inside existing approval, brand, and legal guardrails. Build approved tooling, prompt libraries, custom Firefly models trained on brand assets, and human-in-the-loop review so AI becomes a day-to-day accelerator, not a shadow workaround.",
    capabilities: ["workflow_production", "intelligence_automation"],
    triggerThreshold: 3.0,
    scope:
      "GenAI tooling selection, Firefly custom models, prompt and brand voice libraries, human-in-the-loop integration, enablement and responsible-use governance.",
    methods: [
      "Approved GenAI tooling selection (Firefly, Express, GenStudio, content AI)",
      "Custom Firefly model training on brand assets and guidelines",
      "Brand voice and visual prompt libraries",
      "Human-in-the-loop review and approval integration",
      "Adoption program with measurable lift tied to real campaigns",
    ],
    valueNarrative:
      "Microsoft bought Firefly, Express, and GenStudio — and no one used them. Merkle's brand-kit configuration, custom Firefly training, and GenStudio workflow integration restored confidence through quick wins tied to real campaigns. By 2028, organizations optimizing AI automation will report 70%+ higher ROI and 50% faster time-to-proficiency — the gap will widen fast.",
    sfType: "Content AI & Automation",
    engagementSize: "12–20 weeks · $500K–$1.2M",
    priority: "critical",
  },

  {
    id: "workflow_orchestration",
    title: "Workflow Orchestration (Workfront / AEM)",
    tagline:
      "One intake, one source of truth, orchestrated reviews and approvals",
    description:
      "Stand up enterprise work management as the orchestrating layer for content — Workfront for intake, review stages, and proofing; AEM for content and asset workflows; integrated across existing MarTech, Jira, Figma, and Creative Cloud. Replaces \"every team uses Excel/Jira/Trello\" with one source of truth and leadership visibility without status meetings.",
    capabilities: ["workflow_production"],
    triggerThreshold: 3.0,
    scope:
      "Workfront architecture, request intake design, review/proofing workflows, AEM integration, role-based access, standardized templates.",
    methods: [
      "Workfront deployment with request intake and campaign orchestration",
      "Review stages with SLAs, proofing, and deadline enforcement",
      "AEM workflow automation for asset routing and publication",
      "Integrations with Jira, Figma, Creative Cloud, AEM, and DI Studio",
      "Standardized templates across regions and product lines",
    ],
    valueNarrative:
      "A global semiconductor manufacturer reduced creative briefing cycle time 40% and eliminated non-budget-approved content production after deploying Workfront with standardized templates and automated workflows. Results scaled across 4 regions and 80+ workshops, with 60% reduction in duplicate briefs. ROI on workflow orchestration is visible within weeks.",
    sfType: "Content Workflow Implementation",
    engagementSize: "12–20 weeks · $500K–$1.2M",
    priority: "high",
  },

  {
    id: "dynamic_content_activation",
    title: "Dynamic Content Activation & Localization",
    tagline:
      "Assemble content at the moment of delivery — by locale, segment, and signal",
    description:
      "Connect the content supply chain to AEP, AEM, AJO, and decisioning platforms so modular content can be assembled dynamically at send and render — powered by customer signals, segment, and market context. Automate channel-specific adaptation (format, aspect ratio, length, localization) so creative teams build once and every downstream variant renders programmatically.",
    capabilities: ["distribution_activation", "strategy_planning"],
    triggerThreshold: 3.0,
    scope:
      "Dynamic content architecture, AEP + AEM + AJO integration, decisioning logic, automated format adaptation, localization workflow, measurement.",
    methods: [
      "Dynamic content architecture and assembly logic",
      "AEP, AEM, AJO, and decisioning integration",
      "Real-time segmentation and experience delivery by locale and persona",
      "Automated format, aspect ratio, length, and translation adaptation",
      "AI-assisted translation review with legal and market-owner workflow",
    ],
    valueNarrative:
      "Lumen accelerated content creation from 25 days to 9 days via GenStudio and delivered 3× faster time-to-market for social campaigns with 64% reduction in content creation time. Dynamic activation is where modular content, intelligent production, and CRM decisioning converge into real 1:1 experiences at scale.",
    sfType: "Content Activation",
    engagementSize: "14–22 weeks · $700K–$1.5M",
    priority: "high",
  },

  {
    id: "content_performance_intelligence",
    title: "Content Performance & Intelligence",
    tagline: "Closed-loop measurement tying every asset to business outcomes",
    description:
      "Implement the analytics, CJA, and content intelligence layer that ties asset-level performance to business outcomes — revenue, retention, acquisition cost — and that feeds insight directly back into briefing, ideation, production, and activation. Moves content from a cost center reported in vanity metrics to a measurable, optimizable growth lever.",
    capabilities: ["measurement_insights", "intelligence_automation"],
    triggerThreshold: 3.0,
    scope:
      "Content-to-outcome attribution, CJA + CDP unification, asset performance dashboards, feedback loop into briefing, experimentation framework.",
    methods: [
      "Content-to-outcome attribution methodology",
      "Adobe CJA + CDP unification for asset-to-outcome traceability",
      "Asset performance dashboards tied to campaign outcomes",
      "Feedback loop into briefing, ideation, and production",
      "Experimentation and lift measurement design with AI-assisted model insight",
    ],
    valueNarrative:
      "Highmark couldn't tell which content performed or why — analytics, CRM, and DAM were siloed. Merkle built CJA + CDP integration and asset-performance dashboards that made content ROI visible for the first time. Attribution-based measurement typically redirects 10–25% of content spend toward higher-performing assets within a year.",
    sfType: "Content Intelligence",
    engagementSize: "12–20 weeks · $600K–$1.2M",
    priority: "high",
  },

  {
    id: "operating_model_adoption",
    title: "Operating Model & Adoption",
    tagline:
      "Rewire in-house, agency, AI tools, and data into one integrated engine",
    description:
      "Redesign the operating model behind the content supply chain — roles, decision rights, agency mix, technology stack, governance — and deliver the change management that makes new ways of working stick. Addresses the root cause of most CSC failures: the organization hasn't caught up with modular, personalized, AI-accelerated content.",
    capabilities: ["strategy_planning", "workflow_production"],
    triggerThreshold: 3.0,
    scope:
      "Operating model diagnostic, role and RACI redesign, agency/partner mix, change management program, champion network, adoption measurement.",
    methods: [
      "Current-state operating model and partner diagnostic",
      "Role, decision rights, and RACI redesign for 12+ reviewer workflows",
      "In-house, agency, and partner mix strategy (buy / build / borrow)",
      "Change management program with identified champions and roadmap",
      "Adoption measurement tied to platform utilization and cycle time",
    ],
    valueNarrative:
      "CSC Value Realization = Change & Adoption. Billions are invested in CSC tech, but 55% of marketing leaders report a gap between expectations and reality — with only 49% of MarTech capabilities actually being used. The upside is already paid for; it's waiting for the organization to catch up. Highmark's $21.7M transformation depended on 97+ FTE adoption, not on the tools themselves.",
    sfType: "Operating Model",
    engagementSize: "12–20 weeks · $500K–$1.2M",
    priority: "critical",
  },
];

export function getCscTriggeredOpportunities(
  capabilityScores: Record<string, number>,
  limit: number = 6
): CscOpportunity[] {
  const triggered = CSC_OPPORTUNITIES.filter((opp) => {
    return opp.capabilities.some((cap) => {
      const score = capabilityScores[cap];
      if (score === undefined) return false;
      if (opp.minTriggerScore !== undefined) {
        return score >= opp.minTriggerScore;
      }
      return score < opp.triggerThreshold;
    });
  });

  const priorityOrder = { critical: 0, high: 1, medium: 2, innovation: 3 };

  triggered.sort((a, b) => {
    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];
    if (aPriority !== bPriority) return aPriority - bPriority;
    const aMinScore = Math.min(
      ...a.capabilities.map((c) => capabilityScores[c] ?? 5)
    );
    const bMinScore = Math.min(
      ...b.capabilities.map((c) => capabilityScores[c] ?? 5)
    );
    return aMinScore - bMinScore;
  });

  const sliced = triggered.slice(0, limit);

  return sliced.map((opp, idx) => {
    if (opp.priority === "innovation") return opp;
    const displayPriority: CscOpportunity["priority"] =
      idx < 2 ? "critical" : idx < 4 ? "high" : "medium";
    return { ...opp, priority: displayPriority };
  });
}

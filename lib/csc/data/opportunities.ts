import type { CscOpportunity } from "@/lib/csc/types";

export const CSC_OPPORTUNITIES: CscOpportunity[] = [
  // ── STRATEGY ──────────────────────────────────────────────────────
  {
    id: "content_strategy_blueprint",
    title: "Content Strategy Blueprint",
    tagline: "Reset content strategy as an audience-led, outcomes-driven portfolio",
    description:
      "Replatform the content strategy as a portfolio of always-on, lifecycle, and campaign content — planned against audience jobs-to-be-done and tied to specific business outcomes. Align brand, media, CRM, and commerce priorities on one plan so the content pipeline stops being a reactive campaign factory and starts being a shared engine for growth.",
    capabilities: ["strategy"],
    triggerThreshold: 3.0,
    scope:
      "Audience and outcomes mapping, always-on + lifecycle + campaign portfolio design, brief template redesign, and brand-media-CRM-commerce alignment workshops.",
    methods: [
      "Audience jobs-to-be-done and outcome mapping",
      "Portfolio split across always-on, lifecycle, and campaign content",
      "Brief template redesign (audience, variants, channels, personalization)",
      "Brand + media + CRM + commerce alignment working sessions",
      "Content-to-outcome KPI framework and investment rebalancing",
    ],
    valueNarrative:
      "Most content still gets planned around product and launch calendars rather than audience need — which drives up waste and collapses the value of each asset. A portfolio-led strategy shifts investment toward content that compounds, reduces duplicate effort across brand, CRM, and commerce, and makes the whole supply chain easier to measure and optimize.",
    sfType: "Content Strategy",
    engagementSize: "Medium (10–14 weeks)",
    priority: "critical",
  },

  // ── CREATIVE ──────────────────────────────────────────────────────
  {
    id: "modular_content_framework",
    title: "Modular Content Framework",
    tagline: "Re-architect creative as reusable atoms, not bespoke executions",
    description:
      "Design and roll out a modular content framework — atomic creative components (hooks, visuals, product blocks, CTAs) that can be reassembled across channels, variants, and personalization logic. Modular design is the structural shift that unlocks variant scale, reduces rebuild cost, and makes the content library genuinely activatable.",
    capabilities: ["creative", "asset_management"],
    triggerThreshold: 3.0,
    scope:
      "Modular content taxonomy, atomic component library, brief template upgrade, and creative + production + MarTech alignment on the assembly model.",
    methods: [
      "Modular taxonomy design (atoms, molecules, experiences)",
      "Atomic component library build inside DAM",
      "Brief and concept template upgrade for modular thinking",
      "Creative, production, and MarTech alignment on assembly model",
      "Governance model for module reuse, versioning, and retirement",
    ],
    valueNarrative:
      "Monolithic creative breaks the economics of personalization — every variant costs another bespoke build. Modular content reverses that: one strong concept can produce hundreds of compliant variants at a fraction of the cost, and every asset becomes re-activatable across channels. This is typically the single highest-leverage change in the content supply chain.",
    sfType: "Content Operations",
    engagementSize: "Medium (10–16 weeks)",
    priority: "critical",
  },

  // ── PRODUCTION ────────────────────────────────────────────────────
  {
    id: "ai_assisted_production",
    title: "AI-Assisted Content Production",
    tagline: "Bring GenAI into the production workflow — safely and at scale",
    description:
      "Operationalize generative AI across copy, image, video, layout, translation, and resizing — inside the existing approval, brand, and legal guardrails. Build approved tooling, prompt libraries, and human-in-the-loop review so AI becomes a day-to-day accelerator of production, not a shadow workaround.",
    capabilities: ["production", "operating_model"],
    triggerThreshold: 3.0,
    scope:
      "GenAI tooling selection, prompt and brand voice libraries, review and approval integration, human-in-the-loop workflow design, enablement and training.",
    methods: [
      "Approved GenAI tooling selection across modalities",
      "Brand voice and visual prompt libraries",
      "Human-in-the-loop review and approval integration",
      "Workflow redesign for AI-accelerated asset pathways",
      "Content team enablement, training, and responsible-use standards",
    ],
    valueNarrative:
      "GenAI compresses production cycles from weeks to days and unlocks variant scale without linear cost growth. The brands that win will be the ones that move AI from 'experiment' to 'embedded' inside their content supply chain — with governance, guardrails, and measurable productivity gains — while the rest stay stuck in bespoke, campaign-shaped production.",
    sfType: "Content Operations",
    engagementSize: "Medium to Large (12–20 weeks)",
    priority: "critical",
  },

  {
    id: "production_ops_transformation",
    title: "Production Operations Transformation",
    tagline: "Turn content production into a predictable, repeatable engine",
    description:
      "Standardize production workflows, asset pathways, and approval flows so similar asset types move through predictable, repeatable steps. Eliminate rework, surface bottlenecks, and unlock the foundation required for both AI acceleration and variant scale.",
    capabilities: ["production"],
    triggerThreshold: 2.75,
    scope:
      "Production workflow audit, asset pathway redesign, capacity modeling, workflow platform recommendation, and SLA + governance framework.",
    methods: [
      "End-to-end workflow audit and bottleneck mapping",
      "Asset pathway standardization by content type",
      "Capacity modeling and throughput forecasting",
      "Workflow platform evaluation and rollout plan",
      "SLAs, governance, and production ops operating model",
    ],
    valueNarrative:
      "Ad-hoc production is the root cause of most content waste — duplicated effort, late approvals, off-brand output, and linear cost growth. A standardized production engine typically unlocks 20–40% throughput improvement and is the structural foundation on which modular content and AI acceleration pay off.",
    sfType: "Content Operations",
    engagementSize: "Medium (10–14 weeks)",
    priority: "high",
  },

  // ── INTELLIGENCE ──────────────────────────────────────────────────
  {
    id: "content_intelligence_platform",
    title: "Content Intelligence Platform",
    tagline: "Connect every asset to its outcomes — and learn from it",
    description:
      "Implement the tagging, tracking, and analytics layer that connects each asset to its performance across channels. Standardize creative attribute tagging, capture asset-level outcomes, and surface near-real-time signals into production and activation decisions. Content intelligence is the feedback engine that makes the rest of the supply chain self-improving.",
    capabilities: ["intelligence", "measurement"],
    triggerThreshold: 3.0,
    scope:
      "Creative attribute taxonomy, asset-level tracking architecture, performance dashboard, near-real-time signal integration, and content intelligence operating cadence.",
    methods: [
      "Creative attribute tagging taxonomy and enforcement",
      "Asset-level tracking architecture across channels",
      "Content performance dashboard and executive view",
      "Near-real-time signal integration into rotation and spend decisions",
      "Content intelligence review cadence across strategy, creative, and media",
    ],
    valueNarrative:
      "Without asset-level intelligence, content decisions — what to refresh, reuse, retire — are driven by opinion and anecdote. A content intelligence platform typically improves creative win-rate by 20–40%, reduces waste on under-performing assets, and becomes the feedback loop that powers both human and AI-driven improvement.",
    sfType: "Analytics & Decisioning",
    engagementSize: "Large (14–22 weeks)",
    priority: "critical",
  },

  // ── ASSET MANAGEMENT ──────────────────────────────────────────────
  {
    id: "dam_foundation",
    title: "DAM & Metadata Foundation",
    tagline: "Make the content library discoverable, governed, and activatable",
    description:
      "Implement or re-platform the DAM as the single source of truth for approved content, with enforced metadata, rights tracking, and integration into the production and activation stack. Without a trusted asset foundation, teams duplicate, rebuild, and ship off-brand — and personalization cannot scale because the content library is not addressable.",
    capabilities: ["asset_management"],
    triggerThreshold: 3.0,
    scope:
      "DAM selection or re-platform, metadata and taxonomy design, rights and usage automation, integration into production and activation, adoption and governance model.",
    methods: [
      "DAM evaluation, selection, or re-platform",
      "Metadata and taxonomy design with enforced tagging",
      "Rights, talent, and usage expiration automation",
      "Integration with production workflow and activation systems",
      "Adoption, training, and governance model",
    ],
    valueNarrative:
      "A DAM without discipline is just a storage locker — and a fragmented asset library is the silent tax on every downstream content investment. A governed DAM foundation typically reclaims 25–40% of content spend through reuse, prevents rights and compliance failures, and is the addressable library that personalization and AI both require to work at scale.",
    sfType: "Content Technology",
    engagementSize: "Large (16–24 weeks)",
    priority: "critical",
  },

  {
    id: "content_rights_governance",
    title: "Content Rights & Governance",
    tagline: "Automate rights, usage, and expiration tracking across the portfolio",
    description:
      "Design and implement a content rights management layer — tracking talent, licensing, usage terms, and expiration at the asset level, and automating enforcement across activation systems. Removes a top source of legal exposure and unlocks confident reuse across channels and markets.",
    capabilities: ["asset_management", "operating_model"],
    triggerThreshold: 2.5,
    scope:
      "Rights metadata schema, contract and talent tracking integration, automated expiration and usage alerts, governance and escalation model.",
    methods: [
      "Rights metadata schema and contract taxonomy",
      "Talent and licensing tracking integration",
      "Automated expiration, usage, and geography enforcement",
      "Legal and brand escalation workflow",
      "Training and governance model for content owners",
    ],
    valueNarrative:
      "Rights and talent exposure is typically the largest quiet risk in the content library — and the biggest barrier to confident reuse. Automated rights governance removes fear as a reason not to reuse content, protects the brand from compliance failure, and is a prerequisite for AI-driven content generation using approved source material.",
    sfType: "Content Technology",
    engagementSize: "Medium (10–14 weeks)",
    priority: "high",
  },

  // ── ACTIVATION ────────────────────────────────────────────────────
  {
    id: "dynamic_content_activation",
    title: "Dynamic Content Activation",
    tagline: "Assemble content at the moment of delivery, not months in advance",
    description:
      "Integrate the content supply chain with CRM, CDP, and decisioning platforms so modular content can be assembled dynamically at the moment of delivery — powered by customer signals, segment, and context. This is where the modular library, intelligence layer, and personalization engine converge into real-time 1:1 experiences.",
    capabilities: ["activation", "creative"],
    triggerThreshold: 3.0,
    scope:
      "Dynamic content architecture, CRM/CDP/decisioning integration, modular variant logic, channel-level adaptation automation, and measurement framework.",
    methods: [
      "Dynamic content architecture and assembly logic",
      "CRM, CDP, and decisioning integration",
      "Modular variant logic and channel-level adaptation",
      "Automated format, aspect ratio, length, and localization adaptation",
      "Content personalization measurement and governance framework",
    ],
    valueNarrative:
      "Pre-building every variant is the old model; dynamic assembly is the new one. Brands running dynamic content activation typically see 25–50% lift in engagement and conversion — because every experience is assembled from the best-performing modules for that specific customer in that specific context. This is the bridge between a modern CRM engine and a modern content supply chain.",
    sfType: "CRM Strategy & Activation",
    engagementSize: "Large (16–22 weeks)",
    priority: "critical",
  },

  {
    id: "channel_variant_automation",
    title: "Channel & Variant Automation",
    tagline: "Stop doing manual resizes, retrims, and localizations by hand",
    description:
      "Automate channel-specific adaptation — resizing, retrimming, localizing, and reformatting — so the creative team builds a master asset once and every downstream variant is produced programmatically. Typically pairs with modular content and GenAI tooling to collapse production cycles from weeks to days.",
    capabilities: ["activation", "production"],
    triggerThreshold: 2.75,
    scope:
      "Adaptation automation tooling, master asset specification, localization workflow, brand guardrails, and measurement of variant performance.",
    methods: [
      "Adaptation tooling selection and configuration",
      "Master asset specification and modular structure",
      "Automated localization and language variant workflow",
      "Brand guardrails and QA for automated variants",
      "Variant performance feedback into master design",
    ],
    valueNarrative:
      "Manual variant work is one of the largest hidden costs inside most content supply chains — and the main reason campaigns launch late or incomplete. Automating channel and language variants typically compresses time-to-market by 40–60% and makes it economically viable to deliver the number of variants personalization actually requires.",
    sfType: "Content Operations",
    engagementSize: "Medium (10–14 weeks)",
    priority: "high",
  },

  // ── MEASUREMENT ───────────────────────────────────────────────────
  {
    id: "content_measurement_framework",
    title: "Content Measurement & Attribution",
    tagline: "Prove the business value of content — not just the engagement",
    description:
      "Implement a content measurement framework that ties asset-level performance to business outcomes — revenue, retention, acquisition cost — and that feeds insight directly back into briefing, ideation, and production. Moves content from a cost center reported in vanity metrics to a measurable growth lever.",
    capabilities: ["measurement", "intelligence"],
    triggerThreshold: 2.75,
    scope:
      "Measurement framework design, attribution methodology, dashboard build, feedback loop process, and investment case development.",
    methods: [
      "Content-to-outcome attribution methodology",
      "Experimentation and lift measurement design",
      "Executive and operator content performance dashboards",
      "Feedback loop into briefing, ideation, and production",
      "Investment case and portfolio rebalancing framework",
    ],
    valueNarrative:
      "Most content still gets reported in impressions and engagement — which is fine for a post-mortem and useless for planning. Attribution-based measurement redirects investment toward content that drives outcomes, typically yielding 10–25% improvement in content ROI within a year and turning measurement from a reporting exercise into a creative input.",
    sfType: "Analytics & Decisioning",
    engagementSize: "Medium (10–14 weeks)",
    priority: "high",
  },

  // ── OPERATING MODEL ───────────────────────────────────────────────
  {
    id: "content_operating_model",
    title: "Content Supply Chain Operating Model",
    tagline: "Re-wire in-house, agency, and tech partners into one engine",
    description:
      "Redesign the operating model that sits behind the content supply chain — roles, decision rights, agency mix, technology stack, and governance. Moves the organization from a patchwork of siloed teams and vendors to one integrated engine with clear ownership, faster decisions, and a shared view of performance.",
    capabilities: ["operating_model"],
    triggerThreshold: 3.0,
    scope:
      "Operating model diagnostic, role and decision rights design, agency and partner mix strategy, technology stack alignment, and governance + cadences.",
    methods: [
      "Current-state operating model and partner diagnostic",
      "Role, decision rights, and RACI redesign",
      "In-house, agency, and partner mix strategy",
      "Technology stack rationalization and integration",
      "Governance, rituals, and performance cadences",
    ],
    valueNarrative:
      "The content supply chain rarely fails because of missing tools — it fails because the operating model hasn't caught up with modular, personalized, AI-accelerated content. An operating model redesign typically reduces cycle time by 25–40%, rebalances spend between in-house and agency, and creates the structural clarity required for both speed and governance at scale.",
    sfType: "Content Operations",
    engagementSize: "Medium to Large (12–20 weeks)",
    priority: "high",
  },

  // ── ADVANCED / INNOVATION (fire for high-scoring mature orgs) ─────
  {
    id: "genai_content_at_scale",
    title: "Generative AI Content at Scale",
    tagline: "Produce personalized content at a scale humans cannot",
    description:
      "Deploy generative AI deeply into the content supply chain — using LLMs and multimodal models to generate subject lines, body copy, product narratives, and creative variants tuned to each customer context. For organizations that already have a modular library, asset intelligence, and strong governance, this is where the content engine stops being a factory and starts being a conversation.",
    capabilities: ["production", "creative", "activation"],
    triggerThreshold: 5,
    minTriggerScore: 3.5,
    scope:
      "GenAI content strategy at scale, brand-safe generation framework, integration with CRM/CDP/decisioning, measurement framework, and responsible-use governance.",
    methods: [
      "GenAI content strategy at scale and brand voice governance",
      "Multimodal model integration with CRM, CDP, and ESP stack",
      "Dynamic 1:1 content template architecture",
      "Prompt engineering and content generation workflow design",
      "A/B testing framework for AI-generated versus human-authored content",
    ],
    valueNarrative:
      "Generative AI at scale enables brands to produce hundreds of context-specific content variations per send — matching each customer's lifecycle stage, signal, and intent with messaging no human team could produce at scale. Early adopters are seeing 15–25% improvement in engagement from AI-generated copy alone; the leaders will use this to close the personalization gap that CRM alone cannot close.",
    sfType: "Content Operations",
    engagementSize: "Medium (12–16 weeks)",
    priority: "innovation",
  },

  {
    id: "agentic_content_operations",
    title: "Agentic Content Operations",
    tagline: "Put AI agents to work inside the content supply chain",
    description:
      "Design and pilot the use of AI agents — autonomous, goal-directed systems capable of taking action across content workflows. Explore use cases in autonomous variant generation, real-time creative rotation, briefing assistance, and QA. Agentic content ops is where the supply chain shifts from AI-assisted to AI-operated.",
    capabilities: ["production", "operating_model", "intelligence"],
    triggerThreshold: 5,
    minTriggerScore: 4.0,
    scope:
      "Agentic use-case discovery workshop, pilot scope for one to two autonomous workflows, agent architecture and guardrails, POC delivery and measurement plan.",
    methods: [
      "Agentic CSC use-case discovery and prioritization workshop",
      "Pilot workflow design for one to two autonomous content operations",
      "Agent architecture: tools, memory, context, and action framework",
      "Guardrail and escalation framework for autonomous action governance",
      "POC delivery with performance measurement and scale-readiness assessment",
    ],
    valueNarrative:
      "Agentic AI is the next paradigm shift in content — moving from AI-assisted production to AI-driven action. Mature supply chains with strong modular, DAM, and intelligence foundations are uniquely positioned to pilot agentic workflows today and build the operational experience to scale autonomous content operations before it becomes a market standard.",
    sfType: "Analytics & Decisioning",
    engagementSize: "Small to Medium (6–12 weeks)",
    priority: "innovation",
  },

  {
    id: "content_center_of_excellence",
    title: "Content Center of Excellence",
    tagline: "Institutionalize the content supply chain as a permanent capability",
    description:
      "Build the CoE charter, governance, talent model, and standards that make the content supply chain a durable organizational capability rather than a project. Codifies best practices, accelerates adoption of new tools and AI, and governs modular, DAM, and measurement standards so capability gains compound rather than decay.",
    capabilities: ["operating_model", "measurement"],
    triggerThreshold: 5,
    minTriggerScore: 4.0,
    scope:
      "CoE charter and operating model, capability maturity roadmap, cross-functional governance, talent and skills framework, technology standards, and executive activation.",
    methods: [
      "Content CoE charter, scope, and operating model design",
      "Cross-functional governance framework and decision rights mapping",
      "Capability maturity roadmap and investment prioritization",
      "Talent and AI skills gap assessment with hiring and upskilling plan",
      "Technology standards, vendor framework, and measurement standards",
    ],
    valueNarrative:
      "Organizations with a dedicated Content CoE sustain materially higher capability maturity over three years — because CoEs prevent regression, accelerate AI and tool adoption, and build the internal expertise that reduces dependency on external partners. Building a CoE is the difference between content as a one-time transformation and content as a permanent competitive advantage.",
    sfType: "Content Operations",
    engagementSize: "Medium (10–16 weeks)",
    priority: "innovation",
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

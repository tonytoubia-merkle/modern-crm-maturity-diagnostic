import type { AientOpportunity } from "@/lib/aient/types";

/**
 * Merkle AI for Enterprise offerings.
 *
 * Sourced from the Merkle 2026 "AI for Enterprise: Powering Intelligence"
 * narrative (March 2026), the Agile Operating Model Transformation
 * Offering (v1.2), the Analytics Advisory Offering Toolkit (v1.0, 2026),
 * the Digital Shelf and Commerce Intelligence Offering (v1.0), and the
 * "Re-wiring the enterprise" research (December 2025).
 *
 * Organized in two layers:
 *   1. Four "wedge" engagements – AI for Enterprise Diagnostic, AI Use
 *      Case Portfolio Sprint, Agile Operating Model Assessment, and
 *      Analytics Advisory Roadmap. These set up the larger AI for
 *      Enterprise transformation programs.
 *   2. Ten capability- and platform-level engagements – data
 *      foundations, enterprise knowledge graph & vector platform, AI
 *      assurance, workflow redesign, copilot & agentic activation,
 *      embedded intelligence delivery, multi-agent orchestration,
 *      adoption & change, talent & operating model, and an enterprise
 *      AI innovation lab.
 */
export const AIENT_OPPORTUNITIES: AientOpportunity[] = [
  // ══════════════════════════════════════════════════════════════════
  // WEDGE ENGAGEMENTS – set up the bigger transformation
  // ══════════════════════════════════════════════════════════════════
  {
    id: "ai_enterprise_diagnostic",
    title: "AI for Enterprise Diagnostic & North Star",
    tagline:
      "Benchmark AI maturity across data, work, and intelligence – and align leadership on the next horizon",
    description:
      "Leadership engagement that benchmarks AI-for-Enterprise maturity across the six capabilities, identifies the disconnect between current investments and EBIT impact, and aligns leadership on a North Star vision plus the investment themes (data, work design, assurance) that will fund it. Modeled on the McKinsey/Merkle 'AI high performer' research findings.",
    capabilities: [
      "data_foundations",
      "use_case_design",
      "work_design",
      "intelligence_delivery",
      "ai_assurance",
      "adoption_governance",
    ],
    triggerThreshold: 3.0,
    scope:
      "Maturity assessment across all six AI capabilities, leadership visioning workshops, AI-portfolio audit, definition of an AI-for-Enterprise North Star, high-level roadmap with investment themes.",
    methods: [
      "Maturity assessment across six AI-for-Enterprise capabilities",
      "Leadership visioning workshops",
      "AI portfolio audit – pilots vs. production vs. EBIT impact",
      "Definition of a North Star vision and investment themes",
      "High-level roadmap with sequenced investment themes",
    ],
    valueNarrative:
      "Only ~12% of organisations are capturing meaningful EBIT from AI today. The gap isn't models – it's the operating model around them. A clear, leadership-aligned North Star is the prerequisite for joining the high-performer cohort.",
    sfType: "Strategy & Vision",
    engagementSize: "8–12 weeks · $200K–$450K",
    priority: "critical",
  },
  {
    id: "ai_use_case_portfolio_sprint",
    title: "AI Use Case Portfolio Sprint",
    tagline:
      "Move from a list of pilots to a prioritised, value-led portfolio with clear go/no-go criteria",
    description:
      "Time-boxed sprint that takes the organisation's existing AI ideas and shadow pilots, scores them against value, feasibility, and risk, redesigns the top 3–5 use cases for production-readiness, and produces an executable portfolio with defined business cases and success metrics.",
    capabilities: ["use_case_design"],
    triggerThreshold: 3.0,
    scope:
      "Use-case discovery and consolidation, value/feasibility/risk scoring, redesign of top use cases for production-readiness, business case development, portfolio governance recommendation.",
    methods: [
      "Use-case discovery across business and shadow-IT pilots",
      "Value, feasibility, and risk scoring framework",
      "Redesign of top 3–5 use cases for production-readiness",
      "Business case development with measurable targets",
      "Portfolio governance recommendation",
    ],
    valueNarrative:
      "Most enterprises have dozens of AI ideas and few in production. The portfolio sprint is the fastest way to convert scattered enthusiasm into a fundable, defendable plan that the CFO will sign.",
    sfType: "AI Strategy",
    engagementSize: "6–8 weeks · $125K–$250K",
    priority: "high",
  },
  {
    id: "agile_operating_model_assessment",
    title: "Agile Operating Model Assessment",
    tagline:
      "Shift from project-funded IT to value-stream-funded teams that can run AI work at the pace of the market",
    description:
      "The Agile Operating Model Transformation offering (v1.2). Maps the current operating model, identifies the value streams where AI investment will land, and redesigns governance, funding, and team structures into persistent, value-stream-aligned teams. Includes a pilot on one high-impact value stream.",
    capabilities: ["work_design", "adoption_governance"],
    triggerThreshold: 3.0,
    scope:
      "Operating-model assessment, value-stream mapping, redesign of governance, funding, and team structures, pilot implementation, change enablement.",
    methods: [
      "Operating-model assessment",
      "Value-stream mapping and prioritisation",
      "Redesign of governance, funding, and team structures",
      "Pilot implementation on one high-impact value stream",
      "Change enablement and capability uplift",
    ],
    valueNarrative:
      "AI work delivered in waterfall, project-funded IT models stalls before it reaches production. Cross-functional, value-stream-aligned teams routinely deliver 25%+ faster time-to-value and are the precondition for sustained AI delivery.",
    sfType: "Operating Model",
    engagementSize: "8–14 weeks · $200K–$400K",
    priority: "critical",
  },
  {
    id: "analytics_advisory_roadmap",
    title: "Analytics Advisory Roadmap",
    tagline:
      "From reporting-led analytics to decision-led, embedded intelligence – the 12-month plan",
    description:
      "Analytics Advisory engagement (v1.0, 2026) that audits the current analytics estate, identifies the high-value decisions that should be intelligence-led, redesigns the analytics operating model around decisions (rather than reports), and builds the 12-month roadmap to embed intelligence in the workflows that matter.",
    capabilities: ["intelligence_delivery", "use_case_design"],
    triggerThreshold: 3.0,
    scope:
      "Analytics-estate audit, decision inventory, analytics operating-model redesign, 12-month roadmap, sample embedded intelligence prototype.",
    methods: [
      "Analytics-estate audit and tooling rationalisation",
      "Decision inventory across the value streams that matter",
      "Analytics operating-model redesign – decision-led, embedded",
      "12-month roadmap with measurable outcomes",
      "Sample embedded-intelligence prototype on one decision",
    ],
    valueNarrative:
      "Most enterprises have analytics – and almost no decisions running through them. The Analytics Advisory roadmap reframes the function around outcomes, not outputs, and is the precondition for embedded AI to land.",
    sfType: "Analytics Advisory",
    engagementSize: "8–12 weeks · $200K–$400K",
    priority: "high",
  },

  // ══════════════════════════════════════════════════════════════════
  // CAPABILITY ENGAGEMENTS – data foundations + intelligence delivery
  // ══════════════════════════════════════════════════════════════════
  {
    id: "data_foundations_modernization",
    title: "Data Foundations Modernization",
    tagline:
      "The unified, governed, AI-ready data foundation every enterprise AI use case depends on",
    description:
      "Architect and deliver the modern enterprise data foundation – lakehouse, semantic layer, governed metadata, data quality, lineage, and access controls – that every downstream AI workload depends on. Includes the operating model and stewardship framework.",
    capabilities: ["data_foundations"],
    triggerThreshold: 3.5,
    scope:
      "Reference architecture, lakehouse / semantic layer build, metadata and lineage, data quality and stewardship, access controls, operating model.",
    methods: [
      "Reference architecture and platform selection",
      "Lakehouse / semantic-layer build",
      "Governed metadata and lineage",
      "Data quality, stewardship, and access controls",
      "Data operating model and stewardship roles",
    ],
    valueNarrative:
      "AI workloads built on ungoverned data drift fast and erode trust. Modern data foundations are the boring, expensive precondition that quietly determines whether the AI program succeeds or stalls.",
    sfType: "Data Platform",
    engagementSize: "20–36 weeks · $750K–$2M",
    priority: "high",
  },
  {
    id: "enterprise_knowledge_graph_vectors",
    title: "Enterprise Knowledge Graph & Vector Platform",
    tagline:
      "The retrieval layer that makes RAG, agents, and copilots actually answer correctly",
    description:
      "Design and implement the enterprise knowledge graph and vector platform – content normalisation, chunking strategy, embeddings, hybrid retrieval, evaluation harness, and integration with the LLM stack – so AI agents and copilots can answer with grounded, attributable, current enterprise context.",
    capabilities: ["data_foundations", "intelligence_delivery"],
    triggerThreshold: 3.5,
    scope:
      "Knowledge-graph design, content normalisation and chunking strategy, embedding model selection, hybrid retrieval architecture, evaluation harness, integration with the LLM stack.",
    methods: [
      "Knowledge-graph design",
      "Content normalisation and chunking strategy",
      "Embedding model selection and evaluation",
      "Hybrid retrieval architecture (vector + lexical + structured)",
      "Evaluation harness and ground-truth set",
    ],
    valueNarrative:
      "Generic LLMs hallucinate on enterprise context. The knowledge-graph + vector platform is what closes the gap – and is the differentiator between copilots that deflect work and copilots that get unplugged.",
    sfType: "AI Platform",
    engagementSize: "14–24 weeks · $400K–$1M",
    priority: "high",
  },
  {
    id: "embedded_intelligence_platform",
    title: "Embedded Intelligence Platform",
    tagline:
      "Move analytics out of dashboards and into the workflows where decisions are made",
    description:
      "Design and build the embedded-intelligence delivery layer – feature store, model registry, decisioning engine, integration with workflow tools (Salesforce, ServiceNow, Workday, custom) – so AI insight is delivered at the moment of decision rather than in a separate analytics environment.",
    capabilities: ["intelligence_delivery"],
    triggerThreshold: 3.5,
    scope:
      "Embedded-decision architecture, feature store and model registry, decisioning engine, workflow-tool integration, operating model.",
    methods: [
      "Embedded-decision architecture",
      "Feature store and model registry",
      "Decisioning engine and trigger framework",
      "Integration with the workflow tools that matter",
      "Operating model for embedded intelligence",
    ],
    valueNarrative:
      "Dashboards inform; embedded intelligence acts. The embedded-intelligence platform is what shifts AI from reporting cost-center to a measurable lift on every decision in scope.",
    sfType: "Intelligence Platform",
    engagementSize: "16–28 weeks · $500K–$1.2M",
    priority: "high",
  },

  // ══════════════════════════════════════════════════════════════════
  // CAPABILITY ENGAGEMENTS – work redesign, copilots, multi-agent
  // ══════════════════════════════════════════════════════════════════
  {
    id: "workflow_redesign_human_ai",
    title: "Workflow Redesign – Human + AI Teaming",
    tagline:
      "Redesign the workflow before adding the AI – the success pattern McKinsey calls out as the #1 differentiator",
    description:
      "Take a high-volume, high-friction enterprise workflow (claims, underwriting, KYC, contracts, support escalation, marketing production) and redesign it from scratch around human + AI teaming – not bolting AI onto the existing process. Includes role redesign, decision rights, and measurement.",
    capabilities: ["work_design"],
    triggerThreshold: 3.5,
    scope:
      "Workflow selection and value-mapping, current-state friction audit, redesign for human + AI teaming, role and decision-rights redesign, measurement, change plan.",
    methods: [
      "Workflow selection and value-mapping",
      "Current-state friction audit",
      "Redesign for human + AI teaming",
      "Role and decision-rights redesign",
      "Measurement and change plan",
    ],
    valueNarrative:
      "Per McKinsey Nov 2025, AI high performers are nearly 3× as likely to have fundamentally redesigned workflows. Bolting AI onto unchanged processes is the most common reason AI investment doesn't show up in EBIT.",
    sfType: "Work Redesign",
    engagementSize: "10–16 weeks · $300K–$600K",
    priority: "critical",
  },
  {
    id: "copilot_agentic_activation",
    title: "Copilot & Agentic Workflow Activation",
    tagline:
      "Production-ready copilots and agentic workflows for the highest-leverage roles",
    description:
      "Design, build, and deploy production-ready copilots and agentic workflows for the highest-leverage roles in the enterprise – sellers, service agents, knowledge workers, analysts. Includes prompt and tool design, evaluation, supervisor framework, integration, and adoption playbook.",
    capabilities: ["intelligence_delivery", "work_design"],
    triggerThreshold: 3.5,
    scope:
      "Role and use-case selection, copilot and tool design, evaluation harness, supervisor framework, integration with systems of record, adoption playbook.",
    methods: [
      "Role and use-case selection",
      "Copilot and tool design",
      "Evaluation harness and ground-truth set",
      "Supervisor and human-in-the-loop framework",
      "Integration with systems of record",
      "Adoption playbook and measurement",
    ],
    valueNarrative:
      "Copilots in the right roles, deployed with proper evaluation and supervision, lift productivity 20–40% on knowledge work. Without these guardrails, they get adopted, abandoned, and unplugged within a year.",
    sfType: "Copilot Activation",
    engagementSize: "16–28 weeks · $500K–$1.2M",
    priority: "high",
  },
  {
    id: "multi_agent_orchestration",
    title: "Multi-Agent Orchestration",
    tagline:
      "Move from single-task copilots to coordinated agent teams that own end-to-end outcomes",
    description:
      "Design and deploy multi-agent orchestration for end-to-end enterprise workflows – agent decomposition, supervisor patterns, tool/skill registry, observability, and the assurance framework needed to operate them in production.",
    capabilities: [
      "intelligence_delivery",
      "work_design",
      "ai_assurance",
    ],
    triggerThreshold: 4.0,
    scope:
      "Workflow decomposition into agents, supervisor patterns, tool / skill registry, agent observability, assurance and audit framework.",
    methods: [
      "Workflow decomposition into agents",
      "Supervisor patterns and orchestration",
      "Tool and skill registry",
      "Agent observability and tracing",
      "Assurance and audit framework",
    ],
    valueNarrative:
      "Multi-agent orchestration is where the next wave of enterprise productivity lift lands. Done with assurance and observability, it scales; done without, it fails loudly.",
    sfType: "Agentic Operations",
    engagementSize: "20–36 weeks · $750K–$1.8M",
    priority: "innovation",
  },

  // ══════════════════════════════════════════════════════════════════
  // CAPABILITY ENGAGEMENTS – assurance + adoption + governance
  // ══════════════════════════════════════════════════════════════════
  {
    id: "ai_assurance_framework",
    title: "AI Assurance & Model-Risk Framework",
    tagline:
      "Model risk, explainability, audit, and the regulatory posture the board needs",
    description:
      "Design and operationalise the AI assurance framework – model-risk policy, explainability, evaluation, audit trail, regulatory mapping (EU AI Act, NIST AI RMF, sector regulators), and the governance forum that runs it.",
    capabilities: ["ai_assurance"],
    triggerThreshold: 3.5,
    scope:
      "Model-risk policy, explainability and evaluation framework, audit trail, regulatory mapping, governance forum design.",
    methods: [
      "Model-risk policy and tiering",
      "Explainability and evaluation framework",
      "Audit trail and incident response",
      "Regulatory mapping (EU AI Act, NIST AI RMF, sector regs)",
      "Governance forum design and operating cadence",
    ],
    valueNarrative:
      "AI without assurance ships, breaks, and blocks the next deployment. A managed assurance practice keeps the program moving – and is non-negotiable in regulated sectors and for any board-facing AI claim.",
    sfType: "AI Governance",
    engagementSize: "12–20 weeks · $300K–$700K",
    priority: "high",
  },
  {
    id: "ai_adoption_change",
    title: "AI Adoption & Change Management",
    tagline:
      "The change program that gets AI investments past pilot and into the way work is done",
    description:
      "Design and run the enterprise adoption program – leadership communications, role-level enablement, champion network, behaviour-change measurement, and the operating cadence that keeps adoption climbing rather than collapsing six months in.",
    capabilities: ["adoption_governance", "work_design"],
    triggerThreshold: 3.5,
    scope:
      "Adoption strategy, leadership communications, role-level enablement, champion network, behaviour-change measurement, operating cadence.",
    methods: [
      "Adoption strategy and segmentation",
      "Leadership communications",
      "Role-level enablement and training",
      "Champion network and feedback loops",
      "Behaviour-change measurement",
    ],
    valueNarrative:
      "AI investments quietly fail when adoption doesn't climb. The adoption program is what converts shipped technology into changed behaviour – and is what differentiates investments that show up in EBIT from those that don't.",
    sfType: "Change Management",
    engagementSize: "12–20 weeks · $250K–$600K",
    priority: "high",
  },
  {
    id: "ai_talent_operating_model",
    title: "AI Talent & Operating Model Transformation",
    tagline:
      "The talent, structure, and capability shifts that let the enterprise actually run AI work",
    description:
      "Redesign the talent and capability model for AI – central AI office vs. embedded model, role definitions (ML eng, AI product, prompt eng, AI assurance), career paths, sourcing strategy, and partnerships. Operating-model recommendations grounded in the Merkle 'Re-wiring the enterprise' research.",
    capabilities: ["adoption_governance", "work_design"],
    triggerThreshold: 3.5,
    scope:
      "Talent and capability assessment, central vs. embedded operating model, role definitions, sourcing strategy, partnership and ecosystem strategy.",
    methods: [
      "Talent and capability assessment",
      "Central vs. embedded operating-model design",
      "Role definitions and career paths",
      "Sourcing strategy (build / buy / partner)",
      "Partnership and ecosystem strategy",
    ],
    valueNarrative:
      "AI work doesn't happen in the platforms – it happens in the people. The talent and operating-model decisions made in the first 12 months of the program quietly determine its ceiling.",
    sfType: "Talent & Operating Model",
    engagementSize: "10–16 weeks · $250K–$500K",
    priority: "high",
  },
  {
    id: "enterprise_ai_innovation_lab",
    title: "Enterprise AI Innovation Lab",
    tagline:
      "Time-boxed lab for emerging enterprise patterns – multi-agent ops, autonomous workflows, generative knowledge",
    description:
      "Time-boxed innovation lab that prototypes 2–3 emerging enterprise AI patterns (multi-agent ops, autonomous KYC/contracts, generative knowledge engines, embedded forecasting) with real enterprise telemetry, then writes the case for which to scale.",
    capabilities: [
      "use_case_design",
      "intelligence_delivery",
      "work_design",
    ],
    triggerThreshold: 4.0,
    scope:
      "Use-case shortlisting, rapid prototyping (2–3 patterns in parallel), enterprise telemetry and qualitative testing, scale-decision recommendation.",
    methods: [
      "Use-case shortlisting against business and risk context",
      "Rapid prototyping of 2–3 enterprise AI patterns in parallel",
      "Enterprise telemetry and qualitative testing",
      "Scale-decision recommendation and roadmap",
    ],
    valueNarrative:
      "The enterprise AI landscape is moving fast. An innovation lab is the only way to learn at the pace of the market without committing the wrong bet at scale.",
    sfType: "Innovation",
    engagementSize: "10–14 weeks · $250K–$500K",
    priority: "innovation",
  },
];

export function getAientTriggeredOpportunities(
  capabilityScores: Record<string, number>,
  limit: number = 6
): AientOpportunity[] {
  const triggered = AIENT_OPPORTUNITIES.filter((opp) => {
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
    const displayPriority: AientOpportunity["priority"] =
      idx < 2 ? "critical" : idx < 4 ? "high" : "medium";
    return { ...opp, priority: displayPriority };
  });
}

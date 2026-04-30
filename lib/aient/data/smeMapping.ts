/**
 * Maps each AI for Enterprise opportunity to the Merkle practitioners
 * most relevant to that engagement area. Used on the project dashboard
 * to surface "who to pull in" next to each triggered opportunity.
 *
 * Initial seed list grounded in the AI for Enterprise Intro (March
 * 2026), the Agile Operating Model offering (v1.2), and the Analytics
 * Advisory Toolkit (v1.0, 2026). Compact at v1 — the practice lead
 * should expand with named owners per engagement once the diagnostic
 * is in field use.
 */
export interface AientSme {
  name: string;
  title: string;
  email?: string;
  region?: string;
}

const AIENT_PRACTICE_LEAD: AientSme = {
  name: "AI for Enterprise Practice Lead",
  title: "AI for Enterprise · AMER",
  region: "AMER",
};

const AGILE_OPMODEL_LEAD: AientSme = {
  name: "Agile Operating Model Lead",
  title: "Operating Model Transformation SME",
  region: "AMER",
};

const ANALYTICS_ADVISORY_LEAD: AientSme = {
  name: "Analytics Advisory Lead",
  title: "Decision-Led Analytics SME",
  region: "AMER",
};

const DATA_PLATFORM_LEAD: AientSme = {
  name: "Data Foundations Lead",
  title: "Lakehouse / Semantic Layer / Governance SME",
  region: "AMER",
};

const KNOWLEDGE_AI_LEAD: AientSme = {
  name: "Enterprise AI Platform Lead",
  title: "Knowledge Graph / RAG / Vector SME",
  region: "AMER",
};

const COPILOT_AGENTIC_LEAD: AientSme = {
  name: "Copilot & Agentic Lead",
  title: "Copilot Activation / Multi-Agent SME",
  region: "AMER",
};

const AI_ASSURANCE_LEAD: AientSme = {
  name: "AI Assurance Lead",
  title: "Model Risk / EU AI Act / NIST AI RMF SME",
  region: "AMER",
};

const ADOPTION_CHANGE_LEAD: AientSme = {
  name: "AI Adoption & Change Lead",
  title: "Change Management / Talent SME",
  region: "AMER",
};

const AIENT_EMEA_LEAD: AientSme = {
  name: "AI for Enterprise EMEA Lead",
  title: "AI for Enterprise · EMEA",
  region: "EMEA",
};

/** Keyed by opportunity.id. Each entry lists 2–3 SMEs most relevant. */
export const AIENT_SME_MAPPING: Record<string, AientSme[]> = {
  // Wedge engagements
  ai_enterprise_diagnostic: [AIENT_PRACTICE_LEAD, AGILE_OPMODEL_LEAD],
  ai_use_case_portfolio_sprint: [AIENT_PRACTICE_LEAD, ANALYTICS_ADVISORY_LEAD],
  agile_operating_model_assessment: [AGILE_OPMODEL_LEAD, AIENT_PRACTICE_LEAD],
  analytics_advisory_roadmap: [ANALYTICS_ADVISORY_LEAD, AIENT_PRACTICE_LEAD],

  // Data + Intelligence
  data_foundations_modernization: [DATA_PLATFORM_LEAD, AIENT_PRACTICE_LEAD],
  enterprise_knowledge_graph_vectors: [KNOWLEDGE_AI_LEAD, DATA_PLATFORM_LEAD],
  embedded_intelligence_platform: [
    ANALYTICS_ADVISORY_LEAD,
    KNOWLEDGE_AI_LEAD,
    COPILOT_AGENTIC_LEAD,
  ],

  // Work redesign + Copilots
  workflow_redesign_human_ai: [AGILE_OPMODEL_LEAD, AIENT_PRACTICE_LEAD],
  copilot_agentic_activation: [COPILOT_AGENTIC_LEAD, KNOWLEDGE_AI_LEAD],
  multi_agent_orchestration: [
    COPILOT_AGENTIC_LEAD,
    AI_ASSURANCE_LEAD,
    AIENT_PRACTICE_LEAD,
  ],

  // Assurance + Adoption + Operating model
  ai_assurance_framework: [AI_ASSURANCE_LEAD, AIENT_PRACTICE_LEAD],
  ai_adoption_change: [ADOPTION_CHANGE_LEAD, AGILE_OPMODEL_LEAD],
  ai_talent_operating_model: [AGILE_OPMODEL_LEAD, ADOPTION_CHANGE_LEAD],

  // Innovation
  enterprise_ai_innovation_lab: [
    AIENT_PRACTICE_LEAD,
    KNOWLEDGE_AI_LEAD,
    COPILOT_AGENTIC_LEAD,
  ],
};

/** EMEA leads for region-aware routing on EMEA-based client engagements. */
export const AIENT_EMEA_LEADS: AientSme[] = [AIENT_EMEA_LEAD];

export function getAientSmeForOpportunity(opportunityId: string): AientSme[] {
  return AIENT_SME_MAPPING[opportunityId] ?? [];
}

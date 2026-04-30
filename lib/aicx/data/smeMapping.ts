/**
 * Maps each AI for CX opportunity to the Merkle practitioners most
 * relevant to that engagement area. Used on the project dashboard to
 * surface "who to pull in" next to each triggered opportunity.
 *
 * Initial seed list grounded in the AI for CX deep dive (March 2026)
 * leadership cohort and the EXO Offering Toolkit (v2.0). Compact at v1
 * – the practice lead should expand with named owners per engagement
 * once the diagnostic is in field use.
 */
export interface AicxSme {
  name: string;
  title: string;
  email?: string;
  region?: string;
}

const AICX_PRACTICE_LEAD: AicxSme = {
  name: "AI for CX Practice Lead",
  title: "AI for CX · AMER",
  region: "AMER",
};

const DISCOVERABILITY_LEAD: AicxSme = {
  name: "Agentic Discoverability Lead",
  title: "SEO / AEO / LLM Discoverability SME",
  region: "AMER",
};

const EXPERIENCE_DESIGN_LEAD: AicxSme = {
  name: "Agentic Experience Lead",
  title: "Conversational & AI-Native Experience SME",
  region: "AMER",
};

const PERSONALIZATION_LEAD: AicxSme = {
  name: "Adaptive Personalization Lead",
  title: "Real-Time Decisioning / Personalization SME",
  region: "AMER",
};

const EXO_LEAD: AicxSme = {
  name: "EXO Optimization Lead",
  title: "Customer Experience Optimization SME",
  region: "AMER",
};

const IDENTITY_DATA_LEAD: AicxSme = {
  name: "Identity & Data Foundation Lead",
  title: "CDP / Identity / Merkury SME",
  region: "AMER",
};

const AI_TRUST_LEAD: AicxSme = {
  name: "AI Trust & Governance Lead",
  title: "AI Confidence / Brand-Safety SME",
  region: "AMER",
};

const AICX_EMEA_LEAD: AicxSme = {
  name: "AI for CX EMEA Lead",
  title: "AI for CX · EMEA",
  region: "EMEA",
};

/** Keyed by opportunity.id. Each entry lists 2–3 SMEs most relevant. */
export const AICX_SME_MAPPING: Record<string, AicxSme[]> = {
  // Wedge engagements
  ai_for_cx_diagnostic: [AICX_PRACTICE_LEAD, EXO_LEAD],
  agentic_discoverability_audit: [DISCOVERABILITY_LEAD, AICX_PRACTICE_LEAD],
  exo_optimization_strategy: [EXO_LEAD, AICX_PRACTICE_LEAD],
  adaptive_personalization_workshop: [PERSONALIZATION_LEAD, IDENTITY_DATA_LEAD],

  // Discoverability + Experience
  agentic_seo_aeo_modernization: [DISCOVERABILITY_LEAD, AICX_PRACTICE_LEAD],
  agentic_experience_design: [EXPERIENCE_DESIGN_LEAD, AICX_PRACTICE_LEAD],
  ai_search_conversational_commerce: [
    EXPERIENCE_DESIGN_LEAD,
    DISCOVERABILITY_LEAD,
    AI_TRUST_LEAD,
  ],

  // Personalization + Identity
  real_time_personalization_platform: [PERSONALIZATION_LEAD, IDENTITY_DATA_LEAD],
  identity_data_foundation: [IDENTITY_DATA_LEAD],

  // Experimentation + Trust + Measurement
  experimentation_infrastructure: [EXO_LEAD, PERSONALIZATION_LEAD],
  ai_trust_brand_safety: [AI_TRUST_LEAD, AICX_PRACTICE_LEAD],
  ai_measurement_scorecard: [EXO_LEAD, AI_TRUST_LEAD],

  // Innovation
  agentic_service_workflow: [
    EXPERIENCE_DESIGN_LEAD,
    AI_TRUST_LEAD,
    AICX_PRACTICE_LEAD,
  ],
  agentic_cx_innovation_lab: [
    AICX_PRACTICE_LEAD,
    EXPERIENCE_DESIGN_LEAD,
    PERSONALIZATION_LEAD,
  ],
};

/** EMEA leads for region-aware routing on EMEA-based client engagements. */
export const AICX_EMEA_LEADS: AicxSme[] = [AICX_EMEA_LEAD];

export function getAicxSmeForOpportunity(opportunityId: string): AicxSme[] {
  return AICX_SME_MAPPING[opportunityId] ?? [];
}

/**
 * Maps each B2B Transformation opportunity to the Merkle practitioners
 * most relevant to that engagement area. Used on the project dashboard
 * to surface "who to pull in" next to each triggered opportunity.
 *
 * Initial seed grounded in the AMER Summit working session (March 2026)
 * leadership list. This is intentionally compact at v1 – the practice
 * lead should expand it with named owners per engagement once the
 * diagnostic is in field use.
 */
export interface B2bSme {
  name: string;
  title: string;
  email?: string;
  region?: string;
}

const STEVE: B2bSme = {
  name: "Steve Conway",
  title: "VP, Growth Architecture · B2B Transformation Lead",
  region: "AMER",
};

const B2B_AMER_LEAD: B2bSme = {
  name: "B2B AMER Practice Lead",
  title: "B2B Transformation · AMER",
  region: "AMER",
};

const B2B_EMEA_LEAD: B2bSme = {
  name: "B2B EMEA Practice Lead",
  title: "B2B Transformation · EMEA",
  region: "EMEA",
};

const SF_REVENUE_PLATFORM: B2bSme = {
  name: "Salesforce Revenue Platform Lead",
  title: "Revenue Cloud / CPQ Modernization SME",
  region: "AMER",
};

const DATA_AI_LEAD: B2bSme = {
  name: "Data Cloud + AI Lead",
  title: "Data Cloud / Identity / Agentforce SME",
  region: "AMER",
};

const CX_STRATEGY_LEAD: B2bSme = {
  name: "B2B CX Strategy Lead",
  title: "Account Experience SME",
  region: "AMER",
};

/** Keyed by opportunity.id. Each entry lists 2–3 SMEs most relevant. */
export const B2B_SME_MAPPING: Record<string, B2bSme[]> = {
  // Wedge engagements
  north_star_digital_visioning: [STEVE, CX_STRATEGY_LEAD],
  agile_op_model_assessment: [STEVE, B2B_AMER_LEAD],
  b2b_cx_assessment: [STEVE, CX_STRATEGY_LEAD],
  tech_data_modernization: [DATA_AI_LEAD, SF_REVENUE_PLATFORM],
  value_realization_growth_optimization: [STEVE, B2B_AMER_LEAD],

  // ABM
  abm_audit_visioning: [B2B_AMER_LEAD, CX_STRATEGY_LEAD],
  abm_pilot_program: [B2B_AMER_LEAD, CX_STRATEGY_LEAD],
  abm_blueprint: [B2B_AMER_LEAD, CX_STRATEGY_LEAD, DATA_AI_LEAD],
  abm_activation_program_management: [B2B_AMER_LEAD],

  // Selling + Revenue platform
  account_based_selling_implementation: [SF_REVENUE_PLATFORM, DATA_AI_LEAD],
  salesforce_revenue_cloud_modernization: [SF_REVENUE_PLATFORM, STEVE],

  // Service & Advocacy
  account_based_service_advocacy: [DATA_AI_LEAD, B2B_AMER_LEAD],

  // Operations & Commerce
  ai_order_orchestration: [DATA_AI_LEAD, SF_REVENUE_PLATFORM],
  b2b_self_service_commerce: [SF_REVENUE_PLATFORM, B2B_AMER_LEAD],

  // Foundation
  customer_data_foundation: [DATA_AI_LEAD],
  agentforce_revenue_operations: [DATA_AI_LEAD, SF_REVENUE_PLATFORM],

  // Operating model
  operating_model_adoption: [STEVE, B2B_AMER_LEAD],
};

/** EMEA leads for region-aware routing on EMEA-based client engagements. */
export const B2B_EMEA_LEADS: B2bSme[] = [B2B_EMEA_LEAD];

export function getB2bSmeForOpportunity(opportunityId: string): B2bSme[] {
  return B2B_SME_MAPPING[opportunityId] ?? [];
}

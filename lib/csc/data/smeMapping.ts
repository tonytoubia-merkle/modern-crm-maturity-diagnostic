/**
 * Maps each CSC opportunity to the Merkle practitioners who lead that
 * capability or engagement area. Sourced from the 2026 CSC POV Narrative
 * (GTM Initiative team) and the Build / Activate Offering Toolkits v1.0.
 * Used on the project dashboard to surface "who to pull in" next to each
 * triggered opportunity.
 */
export interface CscSme {
  name: string;
  title: string;
  email?: string;
  region?: string;
}

/** Named practitioners from the 2026 CSC GTM team. */
const ED: CscSme = {
  name: "Ed Forman",
  title: "Chief Growth Architect · Executive Sponsor",
  region: "AMER",
};

const MICHELLE: CscSme = {
  name: "Michelle Cascone",
  title: "VP, Growth Architect · CSC Initiative Lead",
  email: "michelle.cascone@merkle.com",
  region: "AMER",
};

const ILONA: CscSme = {
  name: "Ilona Yeremova",
  title: "Sr. Director, DX Business Development · Sales Enablement",
  email: "ilona.yeremova@merkle.com",
  region: "AMER",
};

const MEGAN: CscSme = {
  name: "Megan Munoz",
  title: "Sr. Manager, Tech Strategy · Marketing Lead",
  region: "AMER",
};

const SAYANTIKA: CscSme = {
  name: "Sayantika Sikdar",
  title: "VP, Analytics Solutions · Analytics Lead",
  region: "AMER",
};

const NATASHA: CscSme = {
  name: "Natasha Ness",
  title: "Adobe Alliance Solutions · Solutions Lead",
  email: "natasha.ness@merkle.com",
  region: "AMER",
};

const EVAN: CscSme = {
  name: "Evan Nicholson",
  title: "CSC Practice SME",
  email: "evan.nicholson@merkle.com",
  region: "AMER",
};

const NICHOLAS: CscSme = {
  name: "Nicholas Burcher",
  title: "Adobe EMEA Alliances Director",
  region: "EMEA",
};

const BILLY: CscSme = {
  name: "Billy Hanna",
  title: "Adobe UK Alliances Director",
  region: "EMEA",
};

/** Keyed by opportunity.id. Each entry lists 2–3 SMEs most relevant to that engagement. */
export const CSC_SME_MAPPING: Record<string, CscSme[]> = {
  // Named Merkle engagements — Build stream
  csc_strategy_blueprint: [MICHELLE, ED, EVAN],
  innovation_accelerator: [MICHELLE, NATASHA, MEGAN],
  turnaround_recovery: [ED, MICHELLE],
  enterprise_transformation: [ED, MICHELLE, EVAN],

  // Named Merkle engagements — Activate stream
  platform_value_realization: [MICHELLE, NATASHA, ILONA],
  continuous_value_accelerator: [MICHELLE, SAYANTIKA],
  managed_content_production: [ED, MICHELLE],

  // Capability-level initiatives
  content_data_fabric: [NATASHA, SAYANTIKA],
  modular_content_framework: [MICHELLE, MEGAN],
  ai_accelerated_production: [NATASHA, MEGAN, EVAN],
  workflow_orchestration: [NATASHA, MICHELLE],
  dynamic_content_activation: [NATASHA, SAYANTIKA],
  content_performance_intelligence: [SAYANTIKA],
  operating_model_adoption: [ED, MICHELLE, ILONA],
};

/** EMEA leads for region-aware routing on EMEA-based client engagements. */
export const CSC_EMEA_LEADS: CscSme[] = [NICHOLAS, BILLY];

export function getCscSmeForOpportunity(opportunityId: string): CscSme[] {
  return CSC_SME_MAPPING[opportunityId] ?? [];
}

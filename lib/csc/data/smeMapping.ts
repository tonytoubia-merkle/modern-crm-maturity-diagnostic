/**
 * Maps each CSC opportunity to the SME(s) who own that capability area
 * inside the Merkle Content Supply Chain practice. Used on the project
 * dashboard to surface "who to pull in" next to each triggered opportunity.
 *
 * PLACEHOLDER — awaiting practice org chart input. Add entries keyed by
 * opportunity id (see lib/csc/data/opportunities.ts).
 */
export interface CscSme {
  name: string;
  title: string;
  email?: string;
  region?: string;
}

/** Keyed by opportunity.id. Empty until practice leads populate. */
export const CSC_SME_MAPPING: Record<string, CscSme[]> = {
  // TODO: Populate with CSC practice SMEs per opportunity.
};

export function getCscSmeForOpportunity(opportunityId: string): CscSme[] {
  return CSC_SME_MAPPING[opportunityId] ?? [];
}

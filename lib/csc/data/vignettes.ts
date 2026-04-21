import type { CscCapability } from "@/lib/csc/types";

/**
 * CSC workshop vignettes.
 *
 * PLACEHOLDER — awaiting content from the Merkle Content Supply Chain
 * practice. Each vignette is a 1–2 paragraph anonymized case study used in
 * workshop facilitation and as a pipeline/opportunity anchor.
 *
 * To populate, follow the shape defined by CscVignette below. The workshop
 * agenda generator and the project dashboard already key off vignette IDs,
 * so no downstream code change is needed once entries are added.
 */
export interface CscVignette {
  id: string;
  title: string;
  tagline: string;
  /** Capabilities this vignette illustrates — drives matching to triggered opportunities. */
  capabilities: CscCapability[];
  /** 1–2 paragraph anonymized client story. */
  narrative: string;
  /** Outcomes or measured impact claimed in the story. */
  outcomes?: string[];
  /** Industries the vignette is most relevant to; omit for sector-agnostic. */
  industries?: string[];
  /** Suggested facilitation prompts / discussion questions. */
  prompts?: string[];
}

export const CSC_VIGNETTES: CscVignette[] = [
  // TODO: Add vignettes grounded in Merkle CSC practice case studies.
];

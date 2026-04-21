/**
 * CSC Facilitator Playbook scaffolding.
 *
 * PLACEHOLDER — mirrors the shape of the CRM guide at lib/data/guide.ts.
 * Populate with Merkle-specific CSC workshop content once the practice
 * lead has reviewed. The /csc/guide page (not yet built) will consume
 * these exports directly.
 */

export interface CscGuideStep {
  stepNumber: number;
  title: string;
  timing: string;
  description: string;
  actions?: string[];
  emailTemplateId?: string;
}

export interface CscEmailTemplate {
  id: string;
  subject: string;
  body: string;
  audience: string;
}

export interface CscChecklistItem {
  id: string;
  label: string;
  category: "logistics" | "materials" | "technology" | "facilitation" | "follow_up";
  format?: "onsite" | "virtual" | "both";
}

/** Empty until content is authored. */
export const CSC_GUIDE_STEPS: CscGuideStep[] = [];
export const CSC_EMAIL_TEMPLATES: CscEmailTemplate[] = [];
export const CSC_CHECKLIST: CscChecklistItem[] = [];

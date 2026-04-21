import type { CscWorkshopAgenda, CscWorkshopAgendaSection } from "@/lib/csc/types";
import { CSC_VIGNETTES } from "@/lib/csc/data/vignettes";

/**
 * CSC workshop agenda builder — scaffold.
 *
 * Produces a valid CscWorkshopAgenda from a list of triggered opportunity
 * IDs. Today vignettes are empty (awaiting practice input) so this returns
 * a minimal "opening + capability deep-dives + closing" skeleton. Once
 * CSC_VIGNETTES is populated, extend this to mirror the CRM builder's
 * capability-deduped, exclusion-aware selection logic.
 */
export function buildCscWorkshopAgenda(
  triggeredOpportunityIds: string[],
  _industry?: string
): CscWorkshopAgenda {
  const count = triggeredOpportunityIds.length;
  const format: CscWorkshopAgenda["format"] =
    count <= 3 ? "half_day" : count <= 5 ? "full_day" : "two_day";

  const sections: CscWorkshopAgendaSection[] = [
    {
      title: "Opening & framing",
      duration: "30 min",
      description:
        "Frame the diagnostic findings, share the capability radar, align on outcomes and decision rights for the session.",
    },
  ];

  // Capability deep-dive section — pulls any matching vignettes when present.
  const matchedVignettes = CSC_VIGNETTES.filter((v) =>
    v.capabilities.some(() => true)
  );

  if (matchedVignettes.length > 0) {
    sections.push(
      ...matchedVignettes.slice(0, count).map((v) => ({
        title: v.title,
        duration: "45 min",
        description: v.tagline,
        vignetteIds: [v.id],
        facilitationGuide: v.prompts?.join("\n\n"),
      }))
    );
  } else {
    sections.push({
      title: "Capability deep-dives (placeholder)",
      duration: "60 min",
      description:
        "Workshop vignettes have not yet been authored. Once CSC practice content is added to lib/csc/data/vignettes.ts the agenda builder will surface matched case studies here.",
    });
  }

  sections.push({
    title: "Prioritisation & roadmap",
    duration: "30 min",
    description:
      "Rank opportunities by impact and feasibility, agree on next-wave quick wins and longer-horizon capability investments.",
  });

  sections.push({
    title: "Close & commitments",
    duration: "15 min",
    description:
      "Confirm owners, next meetings, and immediate actions coming out of the session.",
  });

  return { format, sections };
}

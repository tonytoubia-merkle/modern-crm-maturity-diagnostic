import type {
  CscWorkshopAgenda,
  CscWorkshopAgendaSection,
  CscCapability,
} from "@/lib/csc/types";
import { CSC_VIGNETTES } from "@/lib/csc/data/vignettes";
import { CSC_OPPORTUNITIES } from "@/lib/csc/data/opportunities";

/**
 * CSC workshop agenda builder.
 *
 * Produces a CscWorkshopAgenda from a list of triggered opportunity IDs.
 * Strategy:
 *   1. Resolve the capabilities those opportunities live under.
 *   2. Pull workshop vignettes (CSC_VIGNETTES) whose triggerCapabilities
 *      intersect with that set, deduped by capability so we don't run
 *      two strategy_planning vignettes back-to-back.
 *   3. Format wraps the session in opening + capability deep-dives +
 *      prioritisation + close, scaling format by section count.
 */
export function buildCscWorkshopAgenda(
  triggeredOpportunityIds: string[],
  _industry?: string
): CscWorkshopAgenda {
  // Resolve target capabilities from the triggered opportunities.
  const targetCapabilities = new Set<CscCapability>();
  for (const oppId of triggeredOpportunityIds) {
    const opp = CSC_OPPORTUNITIES.find((o) => o.id === oppId);
    if (opp) {
      for (const cap of opp.capabilities) targetCapabilities.add(cap);
    }
  }

  // Match workshop vignettes whose triggerCapabilities intersect with
  // the target set. Dedupe by primary capability so we don't pile up
  // multiple sessions in the same area.
  const seenCapabilities = new Set<CscCapability>();
  const matched = CSC_VIGNETTES.filter((v) => {
    const overlap = v.triggerCapabilities.find((c) =>
      targetCapabilities.has(c)
    );
    if (!overlap) return false;
    if (seenCapabilities.has(overlap)) return false;
    seenCapabilities.add(overlap);
    return true;
  })
    .slice() // copy before sort
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const deepDiveCount = matched.length;
  const format: CscWorkshopAgenda["format"] =
    deepDiveCount <= 2 ? "half_day" : deepDiveCount <= 4 ? "full_day" : "two_day";

  const sections: CscWorkshopAgendaSection[] = [
    {
      title: "Opening & framing",
      duration: "30 min",
      description:
        "Frame the diagnostic findings, share the capability radar, align on outcomes and decision rights for the session.",
    },
  ];

  if (matched.length > 0) {
    sections.push(
      ...matched.map<CscWorkshopAgendaSection>((v) => ({
        title: v.title,
        duration: `${v.durationMinutes} min`,
        description: v.description,
        vignetteIds: [v.id],
        facilitationGuide: v.facilitationGuide,
      }))
    );
  } else {
    sections.push({
      title: "Capability deep-dives",
      duration: "60 min",
      description:
        "No vignettes matched the triggered opportunities. Walk the team through the lowest-scoring capability and discuss target-state behaviors live.",
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

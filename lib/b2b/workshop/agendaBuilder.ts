import type {
  B2bWorkshopAgenda,
  B2bWorkshopAgendaSection,
  B2bCapability,
} from "@/lib/b2b/types";
import { B2B_VIGNETTES } from "@/lib/b2b/data/vignettes";
import { B2B_OPPORTUNITIES } from "@/lib/b2b/data/opportunities";

/**
 * B2B workshop agenda builder. Mirrors CSC's logic.
 * Produces an agenda from a list of triggered opportunity IDs:
 *   1. Resolve the capabilities those opportunities live under.
 *   2. Pull workshop vignettes whose triggerCapabilities intersect with
 *      that set, deduped by capability so we don't run two vision_strategy
 *      vignettes back-to-back.
 *   3. Wrap with opening + capability deep-dives + prioritisation + close.
 */
export function buildB2bWorkshopAgenda(
  triggeredOpportunityIds: string[],
  _industry?: string
): B2bWorkshopAgenda {
  const targetCapabilities = new Set<B2bCapability>();
  for (const oppId of triggeredOpportunityIds) {
    const opp = B2B_OPPORTUNITIES.find((o) => o.id === oppId);
    if (opp) {
      for (const cap of opp.capabilities) targetCapabilities.add(cap);
    }
  }

  const seenCapabilities = new Set<B2bCapability>();
  const matched = B2B_VIGNETTES.filter((v) => {
    const overlap = v.triggerCapabilities.find((c) =>
      targetCapabilities.has(c)
    );
    if (!overlap) return false;
    if (seenCapabilities.has(overlap)) return false;
    seenCapabilities.add(overlap);
    return true;
  })
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const deepDiveCount = matched.length;
  const format: B2bWorkshopAgenda["format"] =
    deepDiveCount <= 2 ? "half_day" : deepDiveCount <= 4 ? "full_day" : "two_day";

  const sections: B2bWorkshopAgendaSection[] = [
    {
      title: "Opening & framing",
      duration: "30 min",
      description:
        "Frame the diagnostic findings, share the capability radar, align on outcomes and decision rights for the session.",
    },
  ];

  if (matched.length > 0) {
    sections.push(
      ...matched.map<B2bWorkshopAgendaSection>((v) => ({
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

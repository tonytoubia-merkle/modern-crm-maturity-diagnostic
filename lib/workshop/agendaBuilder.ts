import type { Vignette, WorkshopAgenda, AgendaBlock, Capability } from "@/lib/types";
import { getVignettesForOpportunities, VIGNETTES } from "@/lib/data/vignettes";

// Pairs of vignettes that overlap significantly – never include both
const EXCLUSION_PAIRS: [string, string][] = [
  ["identity_data_value_mapping", "tech_stack_integration_audit"],
  ["consumer_lifecycle_touchpoint", "signal_capture_discovery"],
  ["journey_orchestration_mapping", "crm_intelligence_loop_design"],
  ["human_loyalty_assessment", "gamification_mechanics_design"],
];

// When both are candidates, prefer the first (more comprehensive)
const PREFERENCE_ORDER: Record<string, string> = {
  tech_stack_integration_audit: "identity_data_value_mapping",
  signal_capture_discovery: "consumer_lifecycle_touchpoint",
  crm_intelligence_loop_design: "journey_orchestration_mapping",
  gamification_mechanics_design: "human_loyalty_assessment",
};

/**
 * Strategic agenda builder.
 *
 * Instead of naively taking the top N vignettes by opportunity coverage,
 * this uses a triage approach:
 * 1. Group triggered vignettes by primary capability
 * 2. Pick at most ONE vignette per capability gap (the best fit)
 * 3. Apply exclusion rules for overlapping content
 * 4. Ensure the agenda covers diverse capability areas
 * 5. Limit to realistic caps (3 half-day, 4 full-day, 6 two-day)
 */
export function buildWorkshopAgenda(
  triggeredOpportunityIds: string[],
  industry?: string
): WorkshopAgenda {
  const allCandidates = getVignettesForOpportunities(triggeredOpportunityIds, industry);

  // Step 1: Strategic selection – one per capability, no overlaps
  const selected = selectStrategicVignettes(allCandidates, triggeredOpportunityIds);

  // Step 2: Determine format based on selected count
  let format: WorkshopAgenda["format"];
  if (selected.length <= 3) {
    format = "half_day";
  } else if (selected.length <= 5) {
    format = "full_day";
  } else {
    format = "two_day";
  }

  // Step 3: Build day structure
  const days = buildDays(format, selected);

  const totalMinutes = days.reduce(
    (sum, day) => sum + day.blocks.reduce((s, b) => s + b.durationMinutes, 0),
    0
  );

  return {
    format,
    totalMinutes,
    days,
    generatedAt: new Date().toISOString(),
  };
}

function selectStrategicVignettes(
  candidates: Vignette[],
  triggeredOpportunityIds: string[]
): Vignette[] {
  const selected: Vignette[] = [];
  const selectedIds = new Set<string>();
  const coveredCapabilities = new Set<string>();

  // Build a set of excluded IDs as we go
  const excludedIds = new Set<string>();

  // Sort candidates: prefer vignettes that cover more triggered opportunities,
  // then by sort order (which prioritizes foundational exercises)
  const oppIdSet = new Set(triggeredOpportunityIds);
  const sorted = [...candidates].sort((a, b) => {
    const aCoverage = a.relatedOpportunityIds.filter((id) => oppIdSet.has(id)).length;
    const bCoverage = b.relatedOpportunityIds.filter((id) => oppIdSet.has(id)).length;
    if (bCoverage !== aCoverage) return bCoverage - aCoverage;
    return a.sortOrder - b.sortOrder;
  });

  for (const v of sorted) {
    // Skip if excluded by a previously selected vignette
    if (excludedIds.has(v.id)) continue;

    // Skip if we already selected a vignette for this primary capability
    // (allow one cross-capability vignette per cap, but not two)
    const primaryCap = v.triggerCapabilities[0];
    const allCapsAlreadyCovered = v.triggerCapabilities.every((c) => coveredCapabilities.has(c));

    // If ALL of this vignette's capabilities are already covered by other
    // selected vignettes, skip it – it would be redundant
    if (allCapsAlreadyCovered && selected.length >= 2) continue;

    // Select this vignette
    selected.push(v);
    selectedIds.add(v.id);

    // Mark its capabilities as covered
    for (const cap of v.triggerCapabilities) {
      coveredCapabilities.add(cap);
    }

    // Apply exclusion rules – block the partner vignette
    for (const [a, b] of EXCLUSION_PAIRS) {
      if (v.id === a) excludedIds.add(b);
      if (v.id === b) excludedIds.add(a);
    }

    // Cap at 6 max (even for two-day)
    if (selected.length >= 6) break;
  }

  return selected;
}

// ── Day building (unchanged logic, cleaner structure) ──

function buildDays(
  format: WorkshopAgenda["format"],
  vignettes: Vignette[]
): WorkshopAgenda["days"] {
  if (format === "half_day") {
    return [buildDay(1, "Modern CRM Workshop", vignettes, true)];
  }

  if (format === "full_day") {
    const midpoint = Math.ceil(vignettes.length / 2);
    const morning = vignettes.slice(0, midpoint);
    const afternoon = vignettes.slice(midpoint);

    const blocks: AgendaBlock[] = [];
    blocks.push(createIntro(30, true));
    for (const v of morning) {
      blocks.push(vignetteToBlock(v));
      blocks.push(createBreak(15));
    }
    blocks.push(createBreak(60, "Lunch Break"));
    for (let i = 0; i < afternoon.length; i++) {
      blocks.push(vignetteToBlock(afternoon[i]));
      if (i < afternoon.length - 1) blocks.push(createBreak(15));
    }
    blocks.push(createClosing(30));

    return [{ dayNumber: 1, title: "Modern CRM Workshop", blocks }];
  }

  // Two-day
  const midpoint = Math.ceil(vignettes.length / 2);
  return [
    buildDay(1, "Discovery & Assessment", vignettes.slice(0, midpoint), true),
    buildDay(2, "Strategy & Roadmap", vignettes.slice(midpoint), false),
  ];
}

function buildDay(
  dayNumber: number,
  title: string,
  vignettes: Vignette[],
  isFirstDay: boolean
): WorkshopAgenda["days"][0] {
  const blocks: AgendaBlock[] = [];
  blocks.push(createIntro(isFirstDay ? 30 : 15, isFirstDay));

  for (let i = 0; i < vignettes.length; i++) {
    blocks.push(vignetteToBlock(vignettes[i]));
    if (i < vignettes.length - 1) blocks.push(createBreak(15));
    if (i === Math.floor(vignettes.length / 2) - 1 && vignettes.length > 2) {
      blocks.push(createBreak(60, "Lunch Break"));
    }
  }

  blocks.push(createClosing(30));
  return { dayNumber, title, blocks };
}

function vignetteToBlock(v: Vignette): AgendaBlock {
  return {
    type: "vignette",
    vignetteId: v.id,
    title: v.title,
    description: v.description,
    durationMinutes: v.durationMinutes,
    relatedOpportunities: v.relatedOpportunityIds,
    relatedCapabilities: v.triggerCapabilities,
  };
}

function createIntro(minutes: number, isFirstDay: boolean): AgendaBlock {
  return {
    type: "intro",
    title: isFirstDay ? "Welcome & Assessment Review" : "Day 2 Kickoff",
    description: isFirstDay
      ? "Introductions, workshop objectives, and review of the aggregated Modern CRM Maturity Assessment results."
      : "Recap of Day 1 findings and preview of Day 2 focus areas.",
    durationMinutes: minutes,
    relatedOpportunities: [],
    relatedCapabilities: [],
  };
}

function createBreak(minutes: number, label?: string): AgendaBlock {
  return {
    type: "break",
    title: label || "Break",
    description: "",
    durationMinutes: minutes,
    relatedOpportunities: [],
    relatedCapabilities: [],
  };
}

function createClosing(minutes: number): AgendaBlock {
  return {
    type: "closing",
    title: "Summary & Next Steps",
    description:
      "Review key findings and outputs from the workshop. Align on priorities, assign owners, and define the engagement roadmap.",
    durationMinutes: minutes,
    relatedOpportunities: [],
    relatedCapabilities: [],
  };
}

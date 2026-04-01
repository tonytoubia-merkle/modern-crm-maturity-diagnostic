import type { Vignette, WorkshopAgenda, AgendaBlock, Capability } from "@/lib/types";
import { getVignettesForOpportunities } from "@/lib/data/vignettes";

export function buildWorkshopAgenda(
  triggeredOpportunityIds: string[],
  industry?: string
): WorkshopAgenda {
  const vignettes = getVignettesForOpportunities(triggeredOpportunityIds, industry);

  // Calculate total vignette time
  const totalVignetteMinutes = vignettes.reduce((sum, v) => sum + v.durationMinutes, 0);

  // Determine format based on total vignette content
  let format: WorkshopAgenda["format"];
  let maxVignettes: number;
  if (totalVignetteMinutes <= 300) {
    format = "half_day";
    maxVignettes = 4;
  } else if (totalVignetteMinutes <= 540) {
    format = "full_day";
    maxVignettes = 6;
  } else {
    format = "two_day";
    maxVignettes = 10;
  }

  const selectedVignettes = vignettes.slice(0, maxVignettes);

  // Build day structure
  const days = buildDays(format, selectedVignettes);

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

    // Morning
    blocks.push(createIntro(30, true));
    for (const v of morning) {
      blocks.push(vignetteToBlock(v));
      blocks.push(createBreak(15));
    }
    blocks.push(createBreak(60, "Lunch Break"));

    // Afternoon
    for (const v of afternoon) {
      blocks.push(vignetteToBlock(v));
      if (afternoon.indexOf(v) < afternoon.length - 1) {
        blocks.push(createBreak(15));
      }
    }
    blocks.push(createClosing(30));

    return [{ dayNumber: 1, title: "Modern CRM Workshop", blocks }];
  }

  // Two-day
  const midpoint = Math.ceil(vignettes.length / 2);
  const day1Vignettes = vignettes.slice(0, midpoint);
  const day2Vignettes = vignettes.slice(midpoint);

  return [
    buildDay(1, "Discovery & Assessment", day1Vignettes, true),
    buildDay(2, "Strategy & Roadmap", day2Vignettes, false),
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
    if (i < vignettes.length - 1) {
      blocks.push(createBreak(15));
    }
    // Lunch break after roughly half the vignettes
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
      ? "Introductions, workshop objectives, and a review of the aggregated Modern CRM Maturity Assessment results. Set the stage for the day's exercises."
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
      "Review key findings and outputs from the workshop exercises. Align on priorities, assign owners, and define the engagement roadmap.",
    durationMinutes: minutes,
    relatedOpportunities: [],
    relatedCapabilities: [],
  };
}

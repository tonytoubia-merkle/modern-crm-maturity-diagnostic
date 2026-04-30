import PptxGenJS from "pptxgenjs";
import type { DiagnosticResults, ResponseItem } from "@/lib/types";
import {
  CAPABILITY_LABELS,
  CAPABILITY_SUBTITLES,
  CORE_QUESTIONS,
  INDUSTRY_QUESTIONS,
  INDUSTRY_LABELS,
} from "@/lib/data/questions";
import { MATURITY_STAGES } from "@/lib/scoring";
import { formatDate } from "@/lib/utils";

// ── Palette ────────────────────────────────────────────────────────────────
// pptxgenjs expects hex strings WITHOUT a leading "#". Each palette mirrors
// one of the three brand systems in lib/brand/tokens.ts:
//   - "merkle"   (default)        – Merkle ARC, deep blue + coral
//   - "dentsu"   (cannes/dentsu)  – DDS Light, mono ink
//   - "connections"               – Salesforce Lightning + Merkle blend
type Palette = {
  navy: string;     // hero / cover background
  navyMid: string;  // secondary dark surface
  navySoft: string; // tertiary dark accent
  blue: string;     // primary brand accent
  blueLight: string;// soft tinted accent
  slate7: string;   // body ink
  slate6: string;   // supportive ink
  slate5: string;   // meta ink
  slate3: string;   // borders
  slate1: string;   // page tint
  white: string;
  red: string;
  orange: string;
  amber: string;
  green: string;
  purple: string;
  brandLabel: string;  // wordmark text, e.g. "MERKLE" / "DENTSU"
  productLabel: string;// product line, e.g. "Merkle Maturity Assessment"
};

const MERKLE_PALETTE: Palette = {
  navy:      "040E4B", // secondary-600
  navyMid:   "0C1E48", // secondary-700
  navySoft:  "12295D", // secondary-500
  blue:      "8F1D0E", // primary-500 (Merkle coral as accent)
  blueLight: "FFE0DC", // tinted coral
  slate7:    "171717", // grey-900
  slate6:    "454545", // grey-700
  slate5:    "5C5C5C", // grey-600
  slate3:    "B2B2B2", // grey-300
  slate1:    "F2F1F6", // grey-60
  white:     "FFFFFF",
  red:       "DB1616", // notification-red
  orange:    "D5402B", // primary-400
  amber:     "C84B38", // primary-300
  green:     "154734", // brandGreen
  purple:    "0058AA", // notification-blue (purple slot)
  brandLabel:   "MERKLE",
  productLabel: "Merkle Maturity Assessment",
};

const DENTSU_PALETTE: Palette = {
  navy:      "040406", // surfaceGlobalHeader
  navyMid:   "0D0D11", // fillAccent1 / Neutral 1250
  navySoft:  "262631", // borderGlobalNav
  blue:      "076CDF", // fillAccent2 / DDS Blue
  blueLight: "E6F0FB", // blue-50
  slate7:    "0D0D11", // textDefault
  slate6:    "60607B", // textSupportive
  slate5:    "8E8EA0",
  slate3:    "CECED6", // borderDefault
  slate1:    "F7F7F8", // bgBase
  white:     "FFFFFF",
  red:       "DC2F23",
  orange:    "FF9B3F", // warningAmber
  amber:     "C6992E", // Cannes gold-friendly
  green:     "3ED483", // successGreen
  purple:    "5B19C4", // aiAccent
  brandLabel:   "DENTSU",
  productLabel: "CRM Maturity Diagnostic",
};

const CONNECTIONS_PALETTE: Palette = {
  navy:      "032E61", // Salesforce brand-dark
  navyMid:   "014486",
  navySoft:  "0B5CAB",
  blue:      "0176D3", // Lightning brand-primary
  blueLight: "F3F9FF",
  slate7:    "1F2937",
  slate6:    "475569",
  slate5:    "64748B",
  slate3:    "CFE5FB",
  slate1:    "F8FAFC",
  white:     "FFFFFF",
  red:       "DB1616",
  orange:    "F97316",
  amber:     "F59E0B",
  green:     "22C55E",
  purple:    "8F1D0E", // Merkle coral co-presence
  brandLabel:   "MERKLE × SALESFORCE",
  productLabel: "Merkle at Salesforce Connections",
};

function paletteFor(source?: string | null): Palette {
  switch (source) {
    case "cannes":
    case "dentsu":
      return DENTSU_PALETTE;
    case "connections":
      return CONNECTIONS_PALETTE;
    default:
      return MERKLE_PALETTE;
  }
}

// Active palette – set inside generatePptx() based on the source.
let C: Palette = MERKLE_PALETTE;

function scoreHex(score: number): string {
  if (score < 1.75) return C.red;
  if (score < 2.75) return C.orange;
  if (score < 3.5)  return C.amber;
  if (score < 4.5)  return C.blue;
  return C.green;
}

function priorityHex(priority: string): string {
  switch (priority) {
    case "critical":   return C.red;
    case "high":       return C.amber;
    case "medium":     return C.blue;
    case "innovation": return C.purple;
    default:           return C.slate6;
  }
}

function stageHex(stage: number): string {
  switch (stage) {
    case 1: return C.red;
    case 2: return C.orange;
    case 3: return C.blue;
    case 4: return C.green;
    default: return C.slate6;
  }
}

// ── Layout helpers ────────────────────────────────────────────────────────────
// LAYOUT_WIDE = 13.33" × 7.5"
const W = 13.33;
const H = 7.5;
const PAD = 0.55;
const HEADER_H = 1.0;

function addHeader(
  pptx: PptxGenJS,
  slide: PptxGenJS.Slide,
  title: string,
  subtitle?: string
) {
  // Dark header band
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: HEADER_H,
    fill: { color: C.navy }, line: { color: C.navy },
  });
  // Blue left accent stripe
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.07, h: HEADER_H,
    fill: { color: C.blue }, line: { color: C.blue },
  });
  slide.addText(title, {
    x: PAD, y: 0, w: W - PAD * 2, h: subtitle ? 0.62 : HEADER_H,
    fontSize: 22, bold: true, color: C.white, valign: subtitle ? "bottom" : "middle",
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: PAD, y: 0.62, w: W - PAD * 2, h: 0.35,
      fontSize: 11, color: "94A3B8", valign: "top",
    });
  }
  // Right-aligned label
  slide.addText(`${C.productLabel}  ·  ${C.brandLabel}`, {
    x: 0, y: 0, w: W - PAD, h: HEADER_H,
    fontSize: 9, color: C.slate6, align: "right", valign: "middle",
  });
}

function addFooter(pptx: PptxGenJS, slide: PptxGenJS.Slide) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: H - 0.08, w: W, h: 0.08,
    fill: { color: C.blue }, line: { color: C.blue },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
export async function generatePptx(
  results: DiagnosticResults,
  responses: ResponseItem[],
  options?: { source?: string | null }
): Promise<Buffer> {
  // Switch the module-level palette based on the assessment source. This lets
  // every helper in this file (addHeader, addFooter, the cover, every chart)
  // read the brand from `C` without changing call sites.
  C = paletteFor(options?.source);

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = C.brandLabel;
  pptx.company = C.brandLabel;
  pptx.subject = C.productLabel;
  pptx.title = `${C.productLabel} – ${results.assessment.clientName}`;

  const { assessment, capabilityScores, overallScore, maturityStage, opportunities } = results;
  const stageInfo = MATURITY_STAGES[maturityStage];
  const sColor = stageHex(maturityStage);
  const industryLabel = assessment.industry ? INDUSTRY_LABELS[assessment.industry] : null;
  const allQs = [...CORE_QUESTIONS, ...INDUSTRY_QUESTIONS];

  // ── Slide 1: Cover ─────────────────────────────────────────────────────────
  const cover = pptx.addSlide();
  cover.background = { color: C.navy };

  // Top accent line
  cover.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.08,
    fill: { color: C.blue }, line: { color: C.blue },
  });

  // Brand wordmark – switches based on source
  cover.addText(C.brandLabel, {
    x: PAD, y: 0.22, w: 6, h: 0.4,
    fontSize: 13, bold: true, color: C.blue, charSpacing: 4,
  });

  // Eyebrow
  cover.addText(C.productLabel, {
    x: PAD, y: 1.0, w: W - PAD * 2, h: 0.5,
    fontSize: 18, color: "94A3B8",
  });

  // Client name (hero)
  cover.addText(assessment.clientName, {
    x: PAD, y: 1.6, w: W - PAD * 2, h: 1.4,
    fontSize: 54, bold: true, color: C.white,
  });

  // Company + industry line
  const companyLine = [assessment.clientCompany, industryLabel].filter(Boolean).join("  ·  ");
  cover.addText(companyLine, {
    x: PAD, y: 3.1, w: W - PAD * 2, h: 0.45,
    fontSize: 17, color: "94A3B8",
  });

  // Maturity stage badge
  cover.addShape(pptx.ShapeType.rect, {
    x: PAD, y: 3.75, w: 5.2, h: 0.65,
    fill: { color: C.navyMid }, line: { color: sColor, width: 1.5 },
  });
  cover.addText(`${stageInfo.label}  ·  Score: ${overallScore.toFixed(1)} / 5.0`, {
    x: PAD, y: 3.75, w: 5.2, h: 0.65,
    fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle",
  });

  // Divider line
  cover.addShape(pptx.ShapeType.line, {
    x: PAD, y: 6.3, w: W - PAD * 2, h: 0,
    line: { color: "1E293B", width: 0.75 },
  });

  // Meta
  cover.addText(
    `Assessed by ${assessment.respondentName}  ·  Completed ${formatDate(assessment.createdAt)}`,
    { x: PAD, y: 6.5, w: W - PAD * 2, h: 0.35, fontSize: 11, color: "475569" }
  );

  // Bottom accent
  cover.addShape(pptx.ShapeType.rect, {
    x: 0, y: H - 0.08, w: W, h: 0.08,
    fill: { color: C.blue }, line: { color: C.blue },
  });

  // ── Slide 2: Maturity Summary ───────────────────────────────────────────────
  const summarySlide = pptx.addSlide();
  summarySlide.background = { color: C.slate1 };
  addHeader(pptx, summarySlide, "Maturity Assessment Summary", stageInfo.label);
  addFooter(pptx, summarySlide);

  // Score circle
  const cx = PAD, cy = 1.25;
  summarySlide.addShape(pptx.ShapeType.ellipse, {
    x: cx, y: cy, w: 2.4, h: 2.4,
    fill: { color: C.navyMid }, line: { color: sColor, width: 2.5 },
  });
  summarySlide.addText(overallScore.toFixed(1), {
    x: cx, y: cy + 0.45, w: 2.4, h: 1.0,
    fontSize: 52, bold: true, color: sColor, align: "center",
  });
  summarySlide.addText("/ 5.0", {
    x: cx, y: cy + 1.5, w: 2.4, h: 0.4,
    fontSize: 13, color: "94A3B8", align: "center",
  });

  // Stage description
  summarySlide.addText(stageInfo.description, {
    x: 3.3, y: 1.25, w: 9.4, h: 2.4,
    fontSize: 12.5, color: C.slate7, wrap: true, valign: "top",
  });

  // Stage progress bar
  const barY = 4.05;
  const barH = 0.4;
  const segW = (W - PAD * 2) / 4;
  const stageColors = [C.red, C.orange, C.blue, C.green];
  const stageLabels = ["Stage 1\nCampaign-Centric", "Stage 2\nSegmented", "Stage 3\nOrchestrated", "Stage 4\nRelationship Engine"];

  summarySlide.addText("MATURITY PROGRESSION", {
    x: PAD, y: barY - 0.35, w: 6, h: 0.3,
    fontSize: 9, bold: true, color: C.slate5, charSpacing: 2,
  });

  for (let i = 0; i < 4; i++) {
    const isActive = (i + 1) === maturityStage;
    const bx = PAD + i * segW;
    summarySlide.addShape(pptx.ShapeType.rect, {
      x: bx, y: barY, w: segW - 0.06, h: barH,
      fill: { color: isActive ? stageColors[i] : C.navyMid },
      line: { color: stageColors[i], width: isActive ? 0 : 0.75 },
    });
    if (isActive) {
      summarySlide.addShape(pptx.ShapeType.rect, {
        x: bx, y: barY - 0.08, w: segW - 0.06, h: 0.08,
        fill: { color: stageColors[i] }, line: { color: stageColors[i] },
      });
    }
    summarySlide.addText(stageLabels[i], {
      x: bx, y: barY + barH + 0.08, w: segW - 0.06, h: 0.55,
      fontSize: 9.5, color: isActive ? stageColors[i] : C.slate5,
      align: "center", bold: isActive,
    });
  }

  // ── Slide 3: Capability Scores ──────────────────────────────────────────────
  const capSlide = pptx.addSlide();
  capSlide.background = { color: C.slate1 };
  addHeader(pptx, capSlide, "Capability Score Breakdown", "Scores across the six Modern CRM capability dimensions");
  addFooter(pptx, capSlide);

  const barStartX = 3.6;
  const maxBarW = W - barStartX - PAD - 0.8;
  const rowH = 0.72;
  const rowStartY = 1.2;

  capabilityScores.forEach((cs, i) => {
    const y = rowStartY + i * rowH;
    const barLen = maxBarW * (cs.score / 5);
    const bColor = scoreHex(cs.score);

    // Capability label
    capSlide.addText(CAPABILITY_LABELS[cs.capability], {
      x: PAD, y: y + 0.1, w: 2.8, h: 0.3,
      fontSize: 12, bold: true, color: C.slate7, align: "right",
    });
    capSlide.addText(CAPABILITY_SUBTITLES[cs.capability], {
      x: PAD, y: y + 0.38, w: 2.8, h: 0.25,
      fontSize: 9, color: C.slate5, align: "right",
    });

    // Track
    capSlide.addShape(pptx.ShapeType.rect, {
      x: barStartX, y: y + 0.16, w: maxBarW, h: 0.36,
      fill: { color: C.navyMid }, line: { color: C.slate3, width: 0.5 },
    });

    // Fill
    if (barLen > 0.01) {
      capSlide.addShape(pptx.ShapeType.rect, {
        x: barStartX, y: y + 0.16, w: barLen, h: 0.36,
        fill: { color: bColor }, line: { color: bColor },
      });
    }

    // Score label
    capSlide.addText(cs.score.toFixed(1), {
      x: barStartX + maxBarW + 0.1, y: y + 0.13, w: 0.6, h: 0.38,
      fontSize: 13, bold: true, color: bColor, align: "left",
    });
  });

  // ── Slides 4+: Opportunity Detail ──────────────────────────────────────────
  for (const opp of opportunities) {
    const oppSlide = pptx.addSlide();
    oppSlide.background = { color: C.slate1 };
    const pColor = priorityHex(opp.priority);
    const priorityLabel = opp.priority.charAt(0).toUpperCase() + opp.priority.slice(1) + " Priority";

    // Header
    oppSlide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: W, h: HEADER_H,
      fill: { color: C.navy }, line: { color: C.navy },
    });
    oppSlide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: 0.07, h: HEADER_H,
      fill: { color: pColor }, line: { color: pColor },
    });

    // Priority badge
    oppSlide.addShape(pptx.ShapeType.rect, {
      x: PAD, y: 0.14, w: 1.7, h: 0.28,
      fill: { color: pColor + "33" }, line: { color: pColor, width: 0.75 },
    });
    oppSlide.addText(priorityLabel, {
      x: PAD, y: 0.14, w: 1.7, h: 0.28,
      fontSize: 8, bold: true, color: C.white, align: "center", valign: "middle",
    });

    oppSlide.addText(opp.title, {
      x: PAD, y: 0.46, w: W - PAD * 2, h: 0.48,
      fontSize: 20, bold: true, color: C.white,
    });

    // Tagline
    oppSlide.addText(opp.tagline, {
      x: PAD, y: 1.08, w: W - PAD * 2, h: 0.34,
      fontSize: 12.5, color: C.slate5, italic: true,
    });

    // Description
    oppSlide.addText(opp.description, {
      x: PAD, y: 1.5, w: W - PAD * 2, h: 0.75,
      fontSize: 11.5, color: C.slate7, wrap: true,
    });

    // Two-column section
    const colW = (W - PAD * 2 - 0.3) / 2;
    const col2X = PAD + colW + 0.3;

    // Scope
    oppSlide.addText("SCOPE", {
      x: PAD, y: 2.35, w: colW, h: 0.28,
      fontSize: 8.5, bold: true, color: C.slate5, charSpacing: 2,
    });
    oppSlide.addShape(pptx.ShapeType.line, {
      x: PAD, y: 2.63, w: colW, h: 0,
      line: { color: C.slate3, width: 0.5 },
    });
    oppSlide.addText(opp.scope, {
      x: PAD, y: 2.72, w: colW, h: 1.35,
      fontSize: 11, color: C.slate7, wrap: true, valign: "top",
    });

    // Methods
    oppSlide.addText("KEY METHODS", {
      x: col2X, y: 2.35, w: colW, h: 0.28,
      fontSize: 8.5, bold: true, color: C.slate5, charSpacing: 2,
    });
    oppSlide.addShape(pptx.ShapeType.line, {
      x: col2X, y: 2.63, w: colW, h: 0,
      line: { color: C.slate3, width: 0.5 },
    });
    oppSlide.addText(opp.methods.map((m) => `• ${m}`).join("\n"), {
      x: col2X, y: 2.72, w: colW, h: 1.35,
      fontSize: 11, color: C.slate7, wrap: true, valign: "top",
    });

    // Business Value box
    oppSlide.addShape(pptx.ShapeType.rect, {
      x: PAD, y: 4.25, w: W - PAD * 2, h: 1.35,
      fill: { color: "EFF6FF" }, line: { color: C.blueLight, width: 0.75 },
    });
    oppSlide.addText("BUSINESS VALUE", {
      x: PAD + 0.2, y: 4.35, w: 4, h: 0.28,
      fontSize: 8.5, bold: true, color: "1D4ED8", charSpacing: 2,
    });
    oppSlide.addText(opp.valueNarrative, {
      x: PAD + 0.2, y: 4.65, w: W - PAD * 2 - 0.4, h: 0.82,
      fontSize: 11, color: "1E3A5F", wrap: true,
    });

    // Engagement size + SF type
    oppSlide.addText(`Engagement Size: ${opp.engagementSize}  ·  ${opp.sfType}`, {
      x: PAD, y: 5.75, w: W - PAD * 2, h: 0.3,
      fontSize: 10, color: C.slate5,
    });

    addFooter(pptx, oppSlide);
  }

  // ── Respondent Notes ────────────────────────────────────────────────────────
  const notedResponses = responses.filter((r) => r.notes);
  if (notedResponses.length > 0) {
    const notesSlide = pptx.addSlide();
    notesSlide.background = { color: C.slate1 };
    addHeader(pptx, notesSlide, "Respondent Notes & Context", "Additional context provided during the assessment");
    addFooter(pptx, notesSlide);

    let noteY = 1.2;
    for (const r of notedResponses.slice(0, 7)) {
      const q = allQs.find((q) => String(q.id) === String(r.questionId));
      notesSlide.addShape(pptx.ShapeType.rect, {
        x: PAD, y: noteY, w: 0.05, h: 0.55,
        fill: { color: C.blue }, line: { color: C.blue },
      });
      notesSlide.addText(q?.text ?? `Question ${r.questionId}`, {
        x: PAD + 0.2, y: noteY, w: W - PAD * 2 - 0.2, h: 0.26,
        fontSize: 9.5, bold: true, color: C.slate5,
      });
      notesSlide.addText(r.notes!, {
        x: PAD + 0.2, y: noteY + 0.26, w: W - PAD * 2 - 0.2, h: 0.3,
        fontSize: 11, color: C.slate7, wrap: true,
      });
      noteY += 0.72;
      if (noteY > 6.4) break;
    }
  }

  // ── Final Slide: Next Steps ─────────────────────────────────────────────────
  const nextSlide = pptx.addSlide();
  nextSlide.background = { color: C.navy };

  nextSlide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.08,
    fill: { color: C.blue }, line: { color: C.blue },
  });
  nextSlide.addText("MERKLE", {
    x: PAD, y: 0.22, w: 4, h: 0.4,
    fontSize: 13, bold: true, color: C.blue, charSpacing: 4,
  });
  nextSlide.addText("Ready to Move Forward?", {
    x: PAD, y: 1.1, w: W - PAD * 2, h: 0.9,
    fontSize: 40, bold: true, color: C.white,
  });
  nextSlide.addText(
    "Your diagnostic results provide a clear roadmap for CRM transformation. Merkle's Modern CRM practice combines strategy, data engineering, decisioning, and activation to move clients across the maturity curve – faster than going it alone.",
    {
      x: PAD, y: 2.15, w: 11, h: 1.2,
      fontSize: 13.5, color: "94A3B8", wrap: true,
    }
  );

  const steps: [string, string, string][] = [
    ["01", "Alignment Workshop", "Bring stakeholders together around your current-state findings and align on the top 2–3 capability investments with the highest return."],
    ["02", "90-Day Roadmap", "Translate your maturity gaps into a prioritized action plan mapped to your commercial goals and technical environment."],
    ["03", "Pilot & Prove", "Scope a fast-track POC on your highest-priority opportunity to prove value before scaling – de-risked and delivery-ready."],
  ];

  steps.forEach(([num, title, body], i) => {
    const sx = PAD + i * 4.1;
    nextSlide.addShape(pptx.ShapeType.rect, {
      x: sx, y: 3.65, w: 3.85, h: 2.5,
      fill: { color: C.navyMid }, line: { color: C.navySoft, width: 0.75 },
    });
    nextSlide.addText(num, {
      x: sx + 0.2, y: 3.8, w: 0.7, h: 0.55,
      fontSize: 24, bold: true, color: C.blue,
    });
    nextSlide.addText(title, {
      x: sx + 0.2, y: 4.35, w: 3.4, h: 0.45,
      fontSize: 14, bold: true, color: C.white,
    });
    nextSlide.addText(body, {
      x: sx + 0.2, y: 4.82, w: 3.4, h: 1.22,
      fontSize: 10.5, color: "94A3B8", wrap: true,
    });
  });

  nextSlide.addShape(pptx.ShapeType.rect, {
    x: 0, y: H - 0.08, w: W, h: 0.08,
    fill: { color: C.blue }, line: { color: C.blue },
  });

  // ── Export ──────────────────────────────────────────────────────────────────
  const data = await pptx.write({ outputType: "nodebuffer" });
  return data as Buffer;
}

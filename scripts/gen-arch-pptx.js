const PptxGenJS = require("pptxgenjs");
const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";

const NAVY = "00205B";
const WHITE = "FFFFFF";
const GREY = "F4F4F5";
const PURPLE = "8E24C6";
const GREEN = "22C55E";
const ORANGE = "F97316";
const BLUE = "3B82F6";
const SLATE = "64748B";

// ── Slide 1: Title ──
let slide = pptx.addSlide();
slide.background = { color: NAVY };
slide.addText("Modern CRM Maturity Diagnostic", { x: 0.8, y: 1.5, w: 10, fontSize: 32, color: WHITE, bold: true, fontFace: "Arial" });
slide.addText("Process Architecture", { x: 0.8, y: 2.2, w: 10, fontSize: 20, color: WHITE, fontFace: "Arial" });
slide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 3.2, w: 1.5, h: 0.05, fill: { color: PURPLE } });
slide.addText("Three assessment modes \u2192 Shared scoring pipeline \u2192 Actionable outputs", { x: 0.8, y: 3.5, w: 10, fontSize: 14, color: "AAAAAA", fontFace: "Arial" });

// ── Slide 2: Three Entry Points ──
slide = pptx.addSlide();
slide.addText("Three Assessment Modes", { x: 0.5, y: 0.3, w: 12, fontSize: 22, bold: true, color: NAVY, fontFace: "Arial" });
slide.addText("All three produce identical ResponseItem[] output \u2192 same scoring pipeline", { x: 0.5, y: 0.8, w: 12, fontSize: 11, color: SLATE, fontFace: "Arial" });

// Workshop
slide.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.5, w: 3.8, h: 3.5, fill: { color: "F0F4FF" }, line: { color: NAVY, width: 2 }, rectRadius: 0.1 });
slide.addText("Workshop Project", { x: 0.7, y: 1.6, w: 3.4, fontSize: 14, bold: true, color: NAVY, fontFace: "Arial" });
slide.addText("/project/new", { x: 0.7, y: 2.0, w: 3.4, fontSize: 9, color: SLATE, fontFace: "Arial" });
slide.addText("\u2022 Multiple stakeholders\n\u2022 Distribute unique survey links\n\u2022 Track completion on dashboard\n\u2022 Aggregate responses (avg + variance)\n\u2022 Generate workshop agenda\n\u2022 Auto-create Miro boards\n\u2022 SME RACI per opportunity", { x: 0.7, y: 2.4, w: 3.4, fontSize: 10, color: "333333", fontFace: "Arial", lineSpacingMultiple: 1.3 });
slide.addShape(pptx.ShapeType.roundRect, { x: 2.8, y: 1.5, w: 1.4, h: 0.3, fill: { color: PURPLE }, rectRadius: 0.05 });
slide.addText("RECOMMENDED", { x: 2.8, y: 1.5, w: 1.4, h: 0.3, fontSize: 7, bold: true, color: WHITE, align: "center", valign: "middle", fontFace: "Arial" });

// Quick
slide.addShape(pptx.ShapeType.roundRect, { x: 4.7, y: 1.5, w: 3.8, h: 3.5, fill: { color: GREY }, line: { color: "D1D5DB", width: 1 }, rectRadius: 0.1 });
slide.addText("Quick Assessment", { x: 4.9, y: 1.6, w: 3.4, fontSize: 14, bold: true, color: NAVY, fontFace: "Arial" });
slide.addText("/assessment/new", { x: 4.9, y: 2.0, w: 3.4, fontSize: 9, color: SLATE, fontFace: "Arial" });
slide.addText("\u2022 Single respondent\n\u2022 30 questions, 8 sections\n\u2022 1-5 score per question\n\u2022 'Not sure' option\n\u2022 Optional industry module\n\u2022 Instant results\n\u2022 Internal discovery / triage", { x: 4.9, y: 2.4, w: 3.4, fontSize: 10, color: "333333", fontFace: "Arial", lineSpacingMultiple: 1.3 });

// Conversational
slide.addShape(pptx.ShapeType.roundRect, { x: 8.9, y: 1.5, w: 3.8, h: 3.5, fill: { color: "FFF7ED" }, line: { color: ORANGE, width: 2 }, rectRadius: 0.1 });
slide.addText("Conversational AI", { x: 9.1, y: 1.6, w: 3.4, fontSize: 14, bold: true, color: NAVY, fontFace: "Arial" });
slide.addText("/assessment/chat  \u00b7  /marketing", { x: 9.1, y: 2.0, w: 3.4, fontSize: 9, color: SLATE, fontFace: "Arial" });
slide.addText("\u2022 Natural dialogue (Gemini 3)\n\u2022 AI infers 1-5 scores\n\u2022 One answer covers multiple Qs\n\u2022 Coverage tracker sidebar\n\u2022 Voice I/O (Gemini TTS)\n\u2022 'Still thinking' ring UX\n\u2022 Review + edit before submit", { x: 9.1, y: 2.4, w: 3.4, fontSize: 10, color: "333333", fontFace: "Arial", lineSpacingMultiple: 1.3 });

// Arrow
slide.addText("\u25BC", { x: 6.1, y: 5.15, w: 1, fontSize: 20, color: NAVY, align: "center", fontFace: "Arial" });

// Pipeline
slide.addShape(pptx.ShapeType.roundRect, { x: 2, y: 5.6, w: 9.2, h: 1.2, fill: { color: NAVY }, rectRadius: 0.1 });
slide.addText("SHARED SCORING PIPELINE", { x: 2.3, y: 5.65, w: 8, fontSize: 12, bold: true, color: WHITE, fontFace: "Arial" });
slide.addText("ResponseItem[] \u2192 Capability Scores (8) \u2192 Overall Score \u2192 Maturity Stage (1-4) \u2192 Triggered Opportunities (top 6)", { x: 2.3, y: 6.1, w: 8.6, fontSize: 10, color: "AAAAAA", fontFace: "Arial" });

// ── Slide 3: Outputs ──
slide = pptx.addSlide();
slide.addText("Outputs & Activation", { x: 0.5, y: 0.3, w: 12, fontSize: 22, bold: true, color: NAVY, fontFace: "Arial" });

const outputs = [
  { title: "Results Page", items: "Maturity stage card\nCapability heatmap\nOpportunity cards\nInternal / Client view", color: "EFF6FF", border: BLUE },
  { title: "Salesforce Output", items: "Account narrative\nOpportunity records\nPipeline table\nCopy-to-clipboard", color: "F0FDF4", border: GREEN },
  { title: "Workshop Agenda", items: "Vignettes \u2192 gaps\nDe-duplicated\nHalf/full/two-day\nFacilitation guides", color: "F0F4FF", border: NAVY },
  { title: "Exports", items: "Branded PPTX\nShareable link\nMiro boards (auto)\nPDF via print", color: "FFF7ED", border: ORANGE },
  { title: "Facilitator Kit", items: "Email templates (4)\nWorkshop checklist\nSME RACI mapping\n8-step playbook", color: "FAF5FF", border: PURPLE },
];

outputs.forEach((o, i) => {
  const x = 0.3 + i * 2.55;
  slide.addShape(pptx.ShapeType.roundRect, { x, y: 1.3, w: 2.35, h: 2.5, fill: { color: o.color }, line: { color: o.border, width: 1.5 }, rectRadius: 0.1 });
  slide.addText(o.title, { x: x + 0.15, y: 1.4, w: 2, fontSize: 11, bold: true, color: NAVY, fontFace: "Arial" });
  slide.addText(o.items, { x: x + 0.15, y: 1.9, w: 2, fontSize: 9, color: "555555", fontFace: "Arial", lineSpacingMultiple: 1.4 });
});

slide.addText("Workshop Agenda + Miro boards only generated for Workshop Projects", { x: 0.5, y: 4.1, w: 12, fontSize: 9, italic: true, color: SLATE, fontFace: "Arial" });

// ── Slide 4: Opp → Workshop ──
slide = pptx.addSlide();
slide.addText("Opportunity \u2192 Workshop Flow", { x: 0.5, y: 0.3, w: 12, fontSize: 22, bold: true, color: NAVY, fontFace: "Arial" });
slide.addText("How capability gaps become structured workshop exercises", { x: 0.5, y: 0.8, w: 12, fontSize: 11, color: SLATE, fontFace: "Arial" });

const chain = [
  { label: "Low Capability\nScore", sub: "(e.g. Identity = 2.1)", color: "FEE2E2", border: "EF4444" },
  { label: "Triggered\nOpportunity", sub: "(e.g. Merkury 360)", color: "FFF7ED", border: ORANGE },
  { label: "Matched\nVignette", sub: "(e.g. Data Value Map)", color: "EFF6FF", border: BLUE },
  { label: "SME\nAssigned", sub: "(e.g. Identity Architect)", color: "F0FDF4", border: GREEN },
  { label: "Workshop\nBlock", sub: "(90 min exercise)", color: "FAF5FF", border: PURPLE },
];

chain.forEach((c, i) => {
  const x = 0.3 + i * 2.55;
  slide.addShape(pptx.ShapeType.roundRect, { x, y: 1.5, w: 2.2, h: 1.5, fill: { color: c.color }, line: { color: c.border, width: 1.5 }, rectRadius: 0.1 });
  slide.addText(c.label, { x: x + 0.1, y: 1.55, w: 2, fontSize: 11, bold: true, color: NAVY, align: "center", fontFace: "Arial" });
  slide.addText(c.sub, { x: x + 0.1, y: 2.35, w: 2, fontSize: 8, color: SLATE, align: "center", fontFace: "Arial" });
  if (i < chain.length - 1) {
    slide.addText("\u2192", { x: x + 2.2, y: 1.9, w: 0.35, fontSize: 18, color: NAVY, align: "center", fontFace: "Arial" });
  }
});

// Exclusion rules
slide.addText("Exclusion Rules (prevent overlapping exercises)", { x: 0.5, y: 3.5, w: 12, fontSize: 12, bold: true, color: NAVY, fontFace: "Arial" });
const exclusions = [
  "Identity Data Mapping  \u2194  Tech Stack Audit  (pick one)",
  "Lifecycle Touchpoint  \u2194  Signal Capture Discovery  (pick one)",
  "Journey Orchestration  \u2194  CRM Intelligence Loop  (pick one)",
  "Human Loyalty Assessment  \u2194  Gamification Mechanics  (pick one)",
];
exclusions.forEach((e, i) => {
  slide.addText("\u2022 " + e, { x: 0.7, y: 3.9 + i * 0.35, w: 10, fontSize: 10, color: "555555", fontFace: "Arial" });
});

slide.addText("Agenda auto-sizes:    \u22643 vignettes = Half-day    |    4-5 = Full-day    |    6 = Two-day", { x: 0.5, y: 5.5, w: 12, fontSize: 10, bold: true, color: NAVY, fontFace: "Arial" });

// ── Slide 5: Capabilities + Stages ──
slide = pptx.addSlide();
slide.addText("8 Capability Dimensions + 4 Maturity Stages", { x: 0.5, y: 0.3, w: 12, fontSize: 22, bold: true, color: NAVY, fontFace: "Arial" });

const caps = [
  { name: "Identity", sub: "Customer Recognition", qs: 4 },
  { name: "Signals", sub: "Customer Understanding", qs: 3 },
  { name: "Decisioning", sub: "Next Best Action", qs: 3 },
  { name: "Engagement", sub: "Experience Delivery", qs: 5 },
  { name: "Media Activation", sub: "Growth Engine", qs: 3 },
  { name: "Learning & Optim.", sub: "Feedback Loop", qs: 4 },
  { name: "Technology", sub: "Value Realization", qs: 4 },
  { name: "Organization", sub: "Operating Model", qs: 4 },
];

caps.forEach((c, i) => {
  const x = 0.5 + (i % 4) * 3.1;
  const y = 1.1 + Math.floor(i / 4) * 1.3;
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 2.9, h: 1, fill: { color: "F8FAFC" }, line: { color: NAVY, width: 1 }, rectRadius: 0.05 });
  slide.addText(c.name, { x: x + 0.15, y: y + 0.05, w: 2.6, fontSize: 11, bold: true, color: NAVY, fontFace: "Arial" });
  slide.addText(c.sub + "  (" + c.qs + " Qs)", { x: x + 0.15, y: y + 0.5, w: 2.6, fontSize: 9, color: SLATE, fontFace: "Arial" });
});

// Stages
slide.addText("Maturity Stages", { x: 0.5, y: 3.9, w: 12, fontSize: 14, bold: true, color: NAVY, fontFace: "Arial" });
const stages = [
  { n: "1", name: "Campaign-Centric", range: "< 1.75", color: "FEE2E2", tc: "EF4444" },
  { n: "2", name: "Segmented Engagement", range: "1.75 \u2013 2.74", color: "FFF7ED", tc: ORANGE },
  { n: "3", name: "Orchestrated Engagement", range: "2.75 \u2013 3.74", color: "DBEAFE", tc: "2563EB" },
  { n: "4", name: "Relationship Growth Engine", range: "3.75+", color: "DCFCE7", tc: "16A34A" },
];
stages.forEach((s, i) => {
  const x = 0.5 + i * 3.1;
  slide.addShape(pptx.ShapeType.roundRect, { x, y: 4.3, w: 2.9, h: 0.9, fill: { color: s.color }, rectRadius: 0.05 });
  slide.addText("Stage " + s.n + ": " + s.name, { x: x + 0.1, y: 4.35, w: 2.7, fontSize: 10, bold: true, color: s.tc, fontFace: "Arial" });
  slide.addText("Score: " + s.range, { x: x + 0.1, y: 4.75, w: 2.7, fontSize: 9, color: SLATE, fontFace: "Arial" });
});

slide.addText("30 core questions + 5 optional industry questions (Retail, QSR, Financial Services, Travel & Hospitality, Automotive)", { x: 0.5, y: 5.5, w: 12, fontSize: 9, italic: true, color: SLATE, fontFace: "Arial" });

pptx.writeFile({ fileName: "Architecture_Diagram.pptx" }).then(() => console.log("Done: Architecture_Diagram.pptx"));

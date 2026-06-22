import {
  EXEC_DIMENSIONS,
  EXEC_STAGES,
  type ExecDimensionKey,
} from "@/lib/data/execQuestions";
import type { MaturityStage } from "@/lib/types";

/**
 * Dynamic "here's where you stand" results email for the Cannes Modern CRM
 * Self-Assessment. Provider-agnostic: returns a subject + inline-styled,
 * table-based HTML body that renders across email clients. The send transport
 * (Resend today, Amazon SES on AWS) just hands these two strings to the API.
 */

const COBALT = "#0328d1";
const GREEN = "#1f9d57";
const AMBER = "#c77f0a";
const INK = "#14141a";
const BODY_GREY = "#52525b";
const FAINT_GREY = "#9a9aa6";
const HAIRLINE = "#ededf2";
const FONT = "Arial,Helvetica,sans-serif";

export interface ExecResultsEmailParams {
  maturityStage?: MaturityStage;
  overallScore?: number;
  high?: { key?: ExecDimensionKey; score?: number };
  low?: { key?: ExecDimensionKey; score?: number };
  /** Absolute URL to the recipient's completed results page (public, no login). */
  fullUrl: string;
}

/** Attribute-safe HTML escaping (quotes included). */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/** A slim rounded progress bar (nested tables for email-client support). */
function bar(pctRaw: number, color: string): string {
  const pct = Math.max(2, Math.min(100, pctRaw));
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ececf1;border-radius:99px;">
    <tr><td style="font-size:0;line-height:0;">
      <table role="presentation" width="${pct}%" cellpadding="0" cellspacing="0">
        <tr><td style="background:${color};height:8px;border-radius:99px;font-size:0;line-height:0;">&nbsp;</td></tr>
      </table>
    </td></tr>
  </table>`;
}

/** A Standout / Opportunity result block with a left accent and a score bar. */
function resultBlock(args: {
  kicker: string;
  color: string;
  tint: string;
  label: string;
  body: string;
  score: number;
}): string {
  const { kicker, color, tint, label, body, score } = args;
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;background:${tint};border:1px solid ${HAIRLINE};border-left:4px solid ${color};border-radius:10px;">
    <tr><td style="padding:18px 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="vertical-align:top;">
            <p style="margin:0 0 5px;font:700 11px/1 ${FONT};letter-spacing:1px;text-transform:uppercase;color:${color};">${esc(kicker)}</p>
            <p style="margin:0;font:700 17px/1.3 ${FONT};color:${INK};">${esc(label)}</p>
          </td>
          <td align="right" style="vertical-align:top;white-space:nowrap;padding-left:12px;">
            <span style="font:800 22px/1 ${FONT};color:${color};">${score.toFixed(1)}</span><span style="font:600 12px/1 ${FONT};color:#b4b4be;">/5</span>
          </td>
        </tr>
      </table>
      <div style="margin:12px 0 4px;">${bar((score / 5) * 100, color)}</div>
      <p style="margin:12px 0 0;font:400 14px/1.55 ${FONT};color:${BODY_GREY};">${esc(body)}</p>
    </td></tr>
  </table>`;
}

export function renderExecResultsEmail(p: ExecResultsEmailParams): {
  subject: string;
  html: string;
} {
  const stage = p.maturityStage ? EXEC_STAGES[p.maturityStage] : undefined;
  const findDim = (k?: ExecDimensionKey) =>
    EXEC_DIMENSIONS.find((d) => d.key === k);
  const highDim = findDim(p.high?.key);
  const lowDim = findDim(p.low?.key);

  const stageLabel = stage?.label ?? "Your Modern CRM snapshot";
  const stageDescription = stage?.description ?? "";
  const overall = (p.overallScore ?? 0).toFixed(1);
  const overallPct = ((p.overallScore ?? 0) / 5) * 100;

  const subject = `Your Modern CRM snapshot${stage ? `: ${stage.label}` : ""}`;
  const preheader = stage
    ? `You're ${stage.label}. Here's your standout, your biggest opportunity, and what's next.`
    : "Here's where your Modern CRM maturity stands.";

  const highBlock = highDim
    ? resultBlock({
        kicker: "Your Standout",
        color: GREEN,
        tint: "#f3fbf6",
        label: highDim.label,
        body: highDim.standout,
        score: p.high?.score ?? 0,
      })
    : "";
  const lowBlock = lowDim
    ? resultBlock({
        kicker: "Your Biggest Opportunity",
        color: AMBER,
        tint: "#fdf8ef",
        label: lowDim.label,
        body: lowDim.opportunity,
        score: p.low?.score ?? 0,
      })
    : "";

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light only">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f7;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f4f4f7;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e7e7ee;">
      <!-- Header -->
      <tr><td style="background:#0b0b12;padding:26px 32px;">
        <span style="display:inline-block;width:0;height:0;border-top:7px solid transparent;border-bottom:7px solid transparent;border-left:12px solid #DD3039;vertical-align:middle;margin-right:10px;"></span>
        <span style="font:800 22px/1 ${FONT};color:#ffffff;letter-spacing:1px;vertical-align:middle;">MERKLE</span>
        <div style="margin-top:9px;font:700 11px/1 ${FONT};letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.6);">Modern CRM Self-Assessment</div>
      </td></tr>
      <!-- Stage -->
      <tr><td style="padding:32px 32px 8px;">
        <p style="margin:0 0 7px;font:700 12px/1 ${FONT};letter-spacing:1.5px;text-transform:uppercase;color:${COBALT};">Here&#x27;s where you stand</p>
        <h1 style="margin:0 0 4px;font:800 30px/1.15 ${FONT};color:${INK};">${esc(stageLabel)}</h1>
        <p style="margin:0 0 16px;font:600 13px/1 ${FONT};color:${FAINT_GREY};">Overall maturity ${overall} / 5</p>
        ${bar(overallPct, COBALT)}
        <p style="margin:18px 0 0;font:400 15px/1.6 ${FONT};color:${BODY_GREY};">${esc(stageDescription)}</p>
      </td></tr>
      <!-- Result blocks -->
      <tr><td style="padding:8px 32px 0;">
        ${highBlock}
        ${lowBlock}
      </td></tr>
      <!-- CTA -->
      <tr><td style="padding:28px 32px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${HAIRLINE};">
          <tr><td style="padding-top:24px;">
            <h2 style="margin:0 0 8px;font:800 19px/1.3 ${FONT};color:${INK};">Keep your results</h2>
            <p style="margin:0 0 18px;font:400 15px/1.6 ${FONT};color:${BODY_GREY};">Open your personalized Modern CRM snapshot anytime &mdash; your stage, your standout strength, and your biggest opportunity.</p>
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr><td bgcolor="${COBALT}" style="border-radius:10px;">
                <a href="${esc(p.fullUrl)}" style="display:inline-block;padding:15px 30px;font:700 15px/1 ${FONT};color:#ffffff;text-decoration:none;border-radius:10px;">View your results &rarr;</a>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </td></tr>
      <!-- Footer -->
      <tr><td style="padding:24px 32px;background:#fafafb;border-top:1px solid ${HAIRLINE};">
        <p style="margin:0;font:400 12px/1.5 ${FONT};color:${FAINT_GREY};">You&#x27;re receiving this because you completed the Modern CRM Self-Assessment at a Merkle activation.</p>
        <p style="margin:7px 0 0;font:700 12px/1 ${FONT};color:#b4b4be;letter-spacing:0.5px;">MERKLE &middot; Modern CRM</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  return { subject, html };
}

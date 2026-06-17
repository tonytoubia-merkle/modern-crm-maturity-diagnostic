import { NextRequest, NextResponse } from "next/server";
import {
  EXEC_STAGES,
  EXEC_DIMENSIONS,
  type ExecDimension,
  type ExecDimensionKey,
} from "@/lib/data/execQuestions";
import type { MaturityStage } from "@/lib/types";

export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const COBALT = "#0328d1";

interface Body {
  email: string;
  maturityStage: MaturityStage;
  overallScore: number;
  high: { key: ExecDimensionKey; score: number };
  low: { key: ExecDimensionKey; score: number };
  fullUrl: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Body>;
    const { email, maturityStage, overallScore, high, low, fullUrl } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "valid email required" }, { status: 400 });
    }

    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EXEC_FROM_EMAIL;
    // Graceful no-op until the provider is configured. The lead is already
    // captured by the caller; email simply switches on once env vars exist.
    if (!apiKey || !from) {
      return NextResponse.json({ ok: true, sent: false, reason: "email_not_configured" });
    }

    const stage = maturityStage ? EXEC_STAGES[maturityStage] : undefined;
    const findDim = (k?: ExecDimensionKey) => EXEC_DIMENSIONS.find((d) => d.key === k);
    const highDim = findDim(high?.key);
    const lowDim = findDim(low?.key);

    const html = renderEmail({
      stageLabel: stage?.label ?? "Your Modern CRM snapshot",
      stageDescription: stage?.description ?? "",
      overallScore: overallScore ?? 0,
      highDim,
      highScore: high?.score ?? 0,
      lowDim,
      lowScore: low?.score ?? 0,
      fullUrl: safeAssessmentUrl(fullUrl),
    });

    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [email],
        subject: `Your Modern CRM snapshot${stage ? `: ${stage.label}` : ""}`,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[exec/send-results] Resend error", res.status, detail.slice(0, 300));
      return NextResponse.json({ ok: false, sent: false, error: "send_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, sent: true });
  } catch (err) {
    console.error("[exec/send-results] error", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const ALLOWED_HOST_SUFFIXES = [".vercel.app", ".merkle.com"];

/**
 * Only ever embed a trusted https assessment link in the email. The
 * client-supplied URL is validated against an allowlist; anything else
 * falls back to the configured app URL. Prevents the unauthenticated
 * endpoint from being used to inject arbitrary/phishing links.
 */
function safeAssessmentUrl(input?: string): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  const fallback =
    (envUrl && /^https?:\/\//.test(envUrl)
      ? envUrl.replace(/\/+$/, "")
      : "https://merkle-maturity-assessment.vercel.app") + "/crm/assessment/new";
  if (!input) return fallback;
  try {
    const u = new URL(input);
    const host = u.hostname.toLowerCase();
    const envHost = envUrl ? new URL(envUrl).hostname.toLowerCase() : "";
    const allowed =
      u.protocol === "https:" &&
      (host === envHost ||
        host === "merkle.com" ||
        ALLOWED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix)));
    return allowed ? u.toString() : fallback;
  } catch {
    return fallback;
  }
}

// Best-effort per-instance rate limit — a warm-instance speed bump against
// abuse of this unauthenticated endpoint as a branded-email relay. Robust
// cross-instance limiting would need a shared store (e.g. Upstash).
const rlHits = new Map<string, { count: number; resetAt: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = rlHits.get(ip);
  if (!rec || now > rec.resetAt) {
    rlHits.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  rec.count += 1;
  return rec.count > 8;
}

function renderEmail(p: {
  stageLabel: string;
  stageDescription: string;
  overallScore: number;
  highDim?: ExecDimension;
  highScore: number;
  lowDim?: ExecDimension;
  lowScore: number;
  fullUrl: string;
}): string {
  const block = (
    kicker: string,
    color: string,
    label: string,
    copy: string,
    score: number
  ) => `
    <tr><td style="padding:16px 0;border-top:1px solid #eee;">
      <p style="margin:0 0 4px;font:700 11px/1 Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;color:${color};">${esc(kicker)}</p>
      <p style="margin:0 0 6px;font:700 18px/1.2 Arial,sans-serif;color:#1f1f1f;">${esc(label)} <span style="color:${color};">${score.toFixed(1)}/5</span></p>
      <p style="margin:0;font:400 14px/1.5 Arial,sans-serif;color:#505050;">${esc(copy)}</p>
    </td></tr>`;

  return `<!doctype html><html><body style="margin:0;background:#f5f5f7;padding:24px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eee;">
    <tr><td style="background:#141419;padding:24px 28px;">
      <p style="margin:0;font:800 20px/1 Arial,sans-serif;color:#ffffff;letter-spacing:0.5px;">MERKLE</p>
      <p style="margin:6px 0 0;font:700 11px/1 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7);">Modern CRM Self-Assessment</p>
    </td></tr>
    <tr><td style="padding:28px;">
      <p style="margin:0 0 4px;font:600 13px/1 Arial,sans-serif;color:${COBALT};">Here's where you stand:</p>
      <h1 style="margin:0 0 8px;font:800 28px/1.1 Arial,sans-serif;color:#1f1f1f;">${esc(p.stageLabel)} <span style="font:400 14px/1 Arial,sans-serif;color:#aaa;">Overall ${p.overallScore.toFixed(1)} / 5</span></h1>
      <p style="margin:0;font:400 15px/1.5 Arial,sans-serif;color:#505050;">${esc(p.stageDescription)}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
        ${p.highDim ? block("Your Standout", "#1f9d57", p.highDim.label, p.highDim.standout, p.highScore) : ""}
        ${p.lowDim ? block("Your Biggest Opportunity", "#c77f0a", p.lowDim.label, p.lowDim.opportunity, p.lowScore) : ""}
      </table>
      <div style="margin-top:24px;padding-top:24px;border-top:1px solid #eee;">
        <p style="margin:0 0 12px;font:400 15px/1.5 Arial,sans-serif;color:#505050;">Ready to see the full picture? Our complete 30-question assessment goes deeper on every dimension and leaves you with a roadmap, not just a score.</p>
        <a href="${esc(p.fullUrl)}" style="display:inline-block;background:${COBALT};color:#ffffff;font:700 15px/1 Arial,sans-serif;text-decoration:none;padding:14px 28px;border-radius:10px;">Take the full assessment →</a>
      </div>
    </td></tr>
    <tr><td style="padding:16px 28px;background:#fafafa;border-top:1px solid #eee;">
      <p style="margin:0;font:400 12px/1.4 Arial,sans-serif;color:#999;">Merkle · Modern CRM Self-Assessment</p>
    </td></tr>
  </table>
</body></html>`;
}

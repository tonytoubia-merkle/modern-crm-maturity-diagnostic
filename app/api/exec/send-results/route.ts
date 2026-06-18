import { NextRequest, NextResponse } from "next/server";
import { renderExecResultsEmail } from "@/lib/email/execResultsEmail";
import { sendTransactionalEmail } from "@/lib/email/send";
import type { ExecDimensionKey } from "@/lib/data/execQuestions";
import type { MaturityStage } from "@/lib/types";

export const runtime = "nodejs";

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

    const { subject, html } = renderExecResultsEmail({
      maturityStage,
      overallScore,
      high,
      low,
      fullUrl: safeAssessmentUrl(fullUrl),
    });

    // Delegate to the provider-agnostic transport (Resend today, SES on AWS).
    // A graceful no-op until the provider is configured — the lead is already
    // captured by the caller, so email simply switches on once env vars exist.
    const result = await sendTransactionalEmail({ to: email, subject, html });

    if (!result.sent) {
      if (result.reason === "email_not_configured") {
        return NextResponse.json({ ok: true, sent: false, reason: result.reason });
      }
      return NextResponse.json(
        { ok: false, sent: false, error: result.error ?? "send_failed" },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, sent: true });
  } catch (err) {
    console.error("[exec/send-results] error", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
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

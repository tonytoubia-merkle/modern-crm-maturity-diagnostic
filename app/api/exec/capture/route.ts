import { NextRequest, NextResponse } from "next/server";
import {
  EXEC_STAGES,
  EXEC_DIMENSIONS,
  type ExecDimensionKey,
} from "@/lib/data/execQuestions";
import type { MaturityStage } from "@/lib/types";

export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/**
 * Captures a completed kiosk lead to a SharePoint List — with no Graph/Entra
 * credentials on the server.
 *
 * Writing to SharePoint directly would need an Entra app registration
 * (Sites.ReadWrite.All + admin consent) we don't have. Instead this emails a
 * structured "capture" message to EXEC_CAPTURE_EMAIL via Resend. A standard,
 * non-premium Power Automate flow watches that inbox ("When a new email
 * arrives", filtered on the subject prefix), parses the body, and creates the
 * list item — then sends the Outlook follow-up. The flow runs as the user, so
 * it can write to a personal-site list the server never could.
 *
 * The body carries human-readable lines plus a machine-parseable JSON block
 * (between the JSON markers) so the flow can parse it reliably from a plain-text
 * email. Gracefully no-ops until Resend + EXEC_CAPTURE_EMAIL are configured, so
 * the kiosk is never affected before the flow exists.
 */

const SUBJECT_PREFIX = "[Cannes Capture]";
const JSON_OPEN = "---DATA-JSON---";
const JSON_CLOSE = "---END-JSON---";

interface Body {
  email: string;
  maturityStage?: MaturityStage;
  overallScore?: number;
  high?: { key?: ExecDimensionKey; score?: number };
  low?: { key?: ExecDimensionKey; score?: number };
  fullUrl?: string;
  responses?: { question: string; score: number }[];
}

// Best-effort per-instance rate limit (speed bump on the unauthenticated route).
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

/**
 * Plain-text body: labeled lines for humans, plus a fenced JSON block the flow
 * can extract (substring between the markers) and Parse JSON. Kept plain text
 * so Power Automate's "Body" is clean and not HTML-wrapped.
 */
function buildCaptureText(payload: Record<string, unknown>): string {
  const f = (k: string) => String(payload[k] ?? "");
  return [
    "New Cannes Modern CRM assessment completion.",
    "",
    `Email: ${f("email")}`,
    `Submitted: ${f("submittedAt")}`,
    `Maturity stage: ${f("maturityStage")}`,
    `Overall score: ${f("overallScore")}`,
    `Standout dimension: ${f("standoutDimension")} (${f("standoutScore")})`,
    `Opportunity dimension: ${f("opportunityDimension")} (${f("opportunityScore")})`,
    `Assessment URL: ${f("fullUrl")}`,
    "",
    JSON_OPEN,
    JSON.stringify(payload),
    JSON_CLOSE,
    "",
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Body>;
    const email = body.email?.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "valid email required" }, { status: 400 });
    }

    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EXEC_FROM_EMAIL;
    const to = process.env.EXEC_CAPTURE_EMAIL;
    // Graceful no-op until the capture mailbox + Resend are configured.
    if (!apiKey || !from || !to) {
      return NextResponse.json({ ok: true, captured: false, reason: "capture_not_configured" });
    }

    const stage = body.maturityStage ? EXEC_STAGES[body.maturityStage] : undefined;
    const findDim = (k?: ExecDimensionKey) => EXEC_DIMENSIONS.find((d) => d.key === k);

    // Flat payload — maps cleanly to SharePoint List columns in the flow.
    const payload = {
      email,
      submittedAt: new Date().toISOString(),
      maturityStage: stage?.label ?? "",
      overallScore: body.overallScore ?? 0,
      standoutDimension: findDim(body.high?.key)?.label ?? "",
      standoutScore: body.high?.score ?? 0,
      opportunityDimension: findDim(body.low?.key)?.label ?? "",
      opportunityScore: body.low?.score ?? 0,
      fullUrl: body.fullUrl ?? "",
      responses: body.responses ?? [],
    };

    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `${SUBJECT_PREFIX} ${email}`,
        text: buildCaptureText(payload),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[exec/capture] capture-email error", res.status, detail.slice(0, 300));
      return NextResponse.json({ ok: false, captured: false, error: "capture_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, captured: true });
  } catch (err) {
    console.error("[exec/capture] error", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

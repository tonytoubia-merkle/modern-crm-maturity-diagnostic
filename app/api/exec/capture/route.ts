import { NextRequest, NextResponse } from "next/server";
import {
  EXEC_STAGES,
  EXEC_DIMENSIONS,
  type ExecDimensionKey,
} from "@/lib/data/execQuestions";
import type { MaturityStage } from "@/lib/types";

export const runtime = "nodejs";

/**
 * Forwards a completed kiosk lead to a Power Automate cloud flow (the flow's
 * "When an HTTP request is received" URL, set in POWER_AUTOMATE_URL). The flow
 * then writes the row to a SharePoint List and sends the Outlook email.
 *
 * Server-side on purpose: keeps the flow URL (which contains a SAS signature)
 * out of the browser. Gracefully no-ops until POWER_AUTOMATE_URL is set, so the
 * kiosk is never affected before the flow exists.
 */

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

    const url = process.env.POWER_AUTOMATE_URL;
    // Graceful no-op until the flow is wired up.
    if (!url) {
      return NextResponse.json({ ok: true, captured: false, reason: "flow_not_configured" });
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
      responsesJson: JSON.stringify(body.responses ?? []),
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[exec/capture] flow error", res.status, detail.slice(0, 300));
      return NextResponse.json({ ok: false, captured: false, error: "flow_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, captured: true });
  } catch (err) {
    console.error("[exec/capture] error", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

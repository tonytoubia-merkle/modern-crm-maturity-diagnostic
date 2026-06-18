import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lightweight liveness probe for App Runner / ECS / load balancer health
 * checks. Returns 200 without touching the database, so it reflects "the
 * server is up" rather than downstream availability. Public via the /api/
 * prefix in middleware.
 */
export function GET() {
  return NextResponse.json({ status: "ok" });
}

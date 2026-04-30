import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/averages?industry=retail&excludeId=<assessmentId>
 *
 * Returns benchmark averages computed from all completed assessments.
 *
 * Response shape:
 * {
 *   // Per-question integer averages (legacy – used by ScoreMapModal review).
 *   overall: { "1": 3, "2": 2, ... },
 *   industry: { "1": 3, "2": 4, ... } | null,
 *
 *   // Per-capability float averages (used for radar benchmark overlays).
 *   capabilitiesOverall: { identity: 3.21, signals: 2.87, ... },
 *   capabilitiesIndustry: { ... } | null,
 *
 *   // Number of completed assessments contributing to each pool.
 *   sampleSize: { overall: 42, industry: 12 | null }
 * }
 *
 * `excludeId` removes a single assessment from the pool so a completed
 * result page doesn't benchmark itself against itself.
 */
export async function GET(request: NextRequest) {
  try {
    const industry = request.nextUrl.searchParams.get("industry");
    const excludeId = request.nextUrl.searchParams.get("excludeId");
    const supabase = createServerClient();

    const { data: assessments, error: aErr } = await supabase
      .from("assessments")
      .select("id, industry, capability_scores")
      .eq("status", "completed");

    if (aErr) throw aErr;

    const empty = {
      overall: {},
      industry: null,
      capabilitiesOverall: {},
      capabilitiesIndustry: null,
      sampleSize: { overall: 0, industry: null },
    };
    if (!assessments || assessments.length === 0) {
      return NextResponse.json(empty);
    }

    // Apply excludeId filter once for every downstream computation.
    const pool = excludeId
      ? assessments.filter((a) => a.id !== excludeId)
      : assessments;
    if (pool.length === 0) return NextResponse.json(empty);

    const poolIds = pool.map((a) => a.id);
    const industryIdSet = new Set(
      industry ? pool.filter((a) => a.industry === industry).map((a) => a.id) : []
    );

    // ─── Per-capability averages (from stored capability_scores JSONB) ───
    const overallCap: Record<string, { sum: number; count: number }> = {};
    const industryCap: Record<string, { sum: number; count: number }> = {};
    let overallN = 0;
    let industryN = 0;

    for (const a of pool) {
      const scores = (a.capability_scores ?? {}) as Record<string, unknown>;
      const capEntries = Object.entries(scores).filter(
        ([, v]) => typeof v === "number" && Number.isFinite(v)
      ) as [string, number][];
      if (capEntries.length === 0) continue;
      overallN += 1;
      const inIndustry = industry && industryIdSet.has(a.id);
      if (inIndustry) industryN += 1;
      for (const [cap, score] of capEntries) {
        overallCap[cap] ??= { sum: 0, count: 0 };
        overallCap[cap].sum += score;
        overallCap[cap].count += 1;
        if (inIndustry) {
          industryCap[cap] ??= { sum: 0, count: 0 };
          industryCap[cap].sum += score;
          industryCap[cap].count += 1;
        }
      }
    }

    const capabilitiesOverall: Record<string, number> = {};
    for (const [cap, { sum, count }] of Object.entries(overallCap)) {
      capabilitiesOverall[cap] = Number((sum / count).toFixed(2));
    }

    let capabilitiesIndustry: Record<string, number> | null = null;
    if (industry && Object.keys(industryCap).length > 0) {
      capabilitiesIndustry = {};
      for (const [cap, { sum, count }] of Object.entries(industryCap)) {
        capabilitiesIndustry[cap] = Number((sum / count).toFixed(2));
      }
    }

    // ─── Per-question rounded averages (legacy review-mode chips) ───
    const { data: responses, error: rErr } = await supabase
      .from("responses")
      .select("assessment_id, question_id, score")
      .in("assessment_id", poolIds);

    if (rErr) throw rErr;

    const overallQ: Record<string, { sum: number; count: number }> = {};
    const industryQ: Record<string, { sum: number; count: number }> = {};

    for (const r of responses ?? []) {
      overallQ[r.question_id] ??= { sum: 0, count: 0 };
      overallQ[r.question_id].sum += r.score;
      overallQ[r.question_id].count += 1;
      if (industry && industryIdSet.has(r.assessment_id)) {
        industryQ[r.question_id] ??= { sum: 0, count: 0 };
        industryQ[r.question_id].sum += r.score;
        industryQ[r.question_id].count += 1;
      }
    }

    const overall: Record<string, number> = {};
    for (const [qId, { sum, count }] of Object.entries(overallQ)) {
      overall[qId] = Math.round(sum / count);
    }

    let industryAvg: Record<string, number> | null = null;
    if (industry && Object.keys(industryQ).length > 0) {
      industryAvg = {};
      for (const [qId, { sum, count }] of Object.entries(industryQ)) {
        industryAvg[qId] = Math.round(sum / count);
      }
    }

    return NextResponse.json({
      overall,
      industry: industryAvg,
      capabilitiesOverall,
      capabilitiesIndustry,
      sampleSize: {
        overall: overallN,
        industry: industry ? industryN : null,
      },
    });
  } catch (err) {
    console.error("GET /api/averages error:", err);
    return NextResponse.json(
      { error: "Failed to compute averages" },
      { status: 500 }
    );
  }
}

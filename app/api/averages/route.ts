import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/averages?industry=retail
 *
 * Returns rounded average scores per question across all completed assessments,
 * and optionally for a specific industry.
 *
 * Response shape:
 * {
 *   overall: { "1": 3, "2": 2, ... },       // question_id → rounded avg
 *   industry: { "1": 3, "2": 4, ... } | null // null when no industry or no data
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const industry = request.nextUrl.searchParams.get("industry");
    const supabase = createServerClient();

    // Get all completed assessment IDs
    const { data: assessments, error: aErr } = await supabase
      .from("assessments")
      .select("id, industry")
      .eq("status", "completed");

    if (aErr) throw aErr;
    if (!assessments || assessments.length === 0) {
      return NextResponse.json({ overall: {}, industry: null });
    }

    const allIds = assessments.map((a) => a.id);
    const industryIds = industry
      ? assessments.filter((a) => a.industry === industry).map((a) => a.id)
      : [];

    // Fetch all responses for completed assessments
    const { data: responses, error: rErr } = await supabase
      .from("responses")
      .select("assessment_id, question_id, score")
      .in("assessment_id", allIds);

    if (rErr) throw rErr;
    if (!responses) {
      return NextResponse.json({ overall: {}, industry: null });
    }

    // Compute overall averages
    const overallMap: Record<string, { sum: number; count: number }> = {};
    const industryMap: Record<string, { sum: number; count: number }> = {};
    const industryIdSet = new Set(industryIds);

    for (const r of responses) {
      if (!overallMap[r.question_id]) {
        overallMap[r.question_id] = { sum: 0, count: 0 };
      }
      overallMap[r.question_id].sum += r.score;
      overallMap[r.question_id].count += 1;

      if (industry && industryIdSet.has(r.assessment_id)) {
        if (!industryMap[r.question_id]) {
          industryMap[r.question_id] = { sum: 0, count: 0 };
        }
        industryMap[r.question_id].sum += r.score;
        industryMap[r.question_id].count += 1;
      }
    }

    const overall: Record<string, number> = {};
    for (const [qId, { sum, count }] of Object.entries(overallMap)) {
      overall[qId] = Math.round(sum / count);
    }

    let industryAvg: Record<string, number> | null = null;
    if (industry && Object.keys(industryMap).length > 0) {
      industryAvg = {};
      for (const [qId, { sum, count }] of Object.entries(industryMap)) {
        industryAvg[qId] = Math.round(sum / count);
      }
    }

    return NextResponse.json({ overall, industry: industryAvg });
  } catch (err) {
    console.error("GET /api/averages error:", err);
    return NextResponse.json(
      { error: "Failed to compute averages" },
      { status: 500 }
    );
  }
}

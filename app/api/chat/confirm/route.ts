import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { computeCapabilityScores, computeOverallScore, computeMaturityStage } from "@/lib/scoring";
import { CORE_QUESTIONS, QUESTIONS_BY_CAPABILITY, CAPABILITIES_ORDER } from "@/lib/data/questions";
import type { InferredScore } from "@/lib/chat/types";
import type { Capability, ResponseItem } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentId, scores, skipped } = body as {
      assessmentId: string;
      scores: Record<string, InferredScore>;
      skipped: (string | number)[];
    };

    if (!assessmentId) {
      return NextResponse.json({ error: "assessmentId required" }, { status: 400 });
    }

    // Convert InferredScore map to ResponseItem array
    const responses: ResponseItem[] = Object.values(scores).map((s) => ({
      questionId: s.questionId,
      score: Math.round(s.score),
      capability: s.capability,
      isIndustryQuestion: s.isIndustryQuestion,
      notes: `[AI-inferred] ${s.evidence}`,
    }));

    if (responses.length === 0) {
      return NextResponse.json({ error: "No scores to save" }, { status: 400 });
    }

    const supabase = createServerClient();

    // Save responses via upsert
    const records = responses.map((r) => ({
      assessment_id: assessmentId,
      question_id: String(r.questionId),
      score: r.score,
      capability: r.capability,
      is_industry_question: r.isIndustryQuestion || false,
      notes: r.notes ?? null,
    }));

    const { error: rErr } = await supabase
      .from("responses")
      .upsert(records, { onConflict: "assessment_id,question_id" });

    if (rErr) throw rErr;

    // Compute scores
    const capabilityScores = computeCapabilityScores(responses);
    const overallScore = computeOverallScore(capabilityScores);
    const maturityStage = computeMaturityStage(overallScore);

    // Mark assessment completed
    const { error: aErr } = await supabase
      .from("assessments")
      .update({
        status: "completed",
        overall_score: overallScore,
        maturity_stage: maturityStage,
        capability_scores: capabilityScores,
        updated_at: new Date().toISOString(),
      })
      .eq("id", assessmentId);

    if (aErr) throw aErr;

    // Get share_id for redirect
    const { data: assessment } = await supabase
      .from("assessments")
      .select("share_id")
      .eq("id", assessmentId)
      .single();

    return NextResponse.json({
      success: true,
      shareId: assessment?.share_id,
      overallScore,
      maturityStage,
    });
  } catch (err) {
    console.error("POST /api/chat/confirm error:", err);
    return NextResponse.json(
      { error: "Failed to confirm scores" },
      { status: 500 }
    );
  }
}

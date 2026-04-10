import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { computeCapabilityScores, computeOverallScore, computeMaturityStage } from "@/lib/scoring";
import { CORE_QUESTIONS, INDUSTRY_QUESTIONS } from "@/lib/data/questions";
import type { InferredScore } from "@/lib/chat/types";
import type { Capability, ResponseItem } from "@/lib/types";

// Build a lookup: questionId -> { capability, isIndustry }
const QUESTION_META: Record<string, { capability: Capability; isIndustry: boolean }> = {};
for (const q of CORE_QUESTIONS) {
  QUESTION_META[String(q.id)] = { capability: q.capability, isIndustry: false };
}
for (const q of INDUSTRY_QUESTIONS) {
  QUESTION_META[String(q.id)] = { capability: q.capability as Capability, isIndustry: true };
}

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
    // Use server-side question metadata for capability (don't trust client)
    const responses: ResponseItem[] = Object.entries(scores)
      .filter(([_, s]) => s && typeof s.score === "number")
      .map(([qId, s]) => {
        const meta = QUESTION_META[qId] || QUESTION_META[String(s.questionId)];
        return {
          questionId: /^\d+$/.test(qId) ? Number(qId) : qId,
          score: Math.round(s.score),
          capability: meta?.capability || (s.capability as Capability) || "identity",
          isIndustryQuestion: meta?.isIndustry ?? s.isIndustryQuestion ?? false,
          notes: s.evidence ? `[AI-inferred] ${s.evidence}` : undefined,
        };
      });

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
    const msg = err instanceof Error ? err.message : String(err);
    console.error("POST /api/chat/confirm error:", msg);
    return NextResponse.json(
      { error: `Failed to confirm scores: ${msg}` },
      { status: 500 }
    );
  }
}

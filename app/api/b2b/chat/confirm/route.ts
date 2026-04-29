import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import {
  computeB2bCapabilityScores,
  computeB2bOverallScore,
  computeB2bMaturityStage,
} from "@/lib/b2b/scoring";
import {
  B2B_CORE_QUESTIONS,
  B2B_INDUSTRY_QUESTIONS,
} from "@/lib/b2b/data/questions";
import type { B2bInferredScore } from "@/lib/b2b/chat/types";
import type { B2bCapability, B2bResponseItem } from "@/lib/b2b/types";

const B2B_QUESTION_META: Record<
  string,
  { capability: B2bCapability; isIndustry: boolean }
> = {};
for (const q of B2B_CORE_QUESTIONS) {
  B2B_QUESTION_META[String(q.id)] = {
    capability: q.capability,
    isIndustry: false,
  };
}
for (const q of B2B_INDUSTRY_QUESTIONS) {
  B2B_QUESTION_META[String(q.id)] = {
    capability: q.capability as B2bCapability,
    isIndustry: true,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentId, scores } = body as {
      assessmentId: string;
      scores: Record<string, B2bInferredScore>;
      skipped: (string | number)[];
    };

    if (!assessmentId) {
      return NextResponse.json(
        { error: "assessmentId required" },
        { status: 400 }
      );
    }

    const responses: B2bResponseItem[] = Object.entries(scores)
      .filter(([, s]) => s && typeof s.score === "number")
      .map(([qId, s]) => {
        const meta =
          B2B_QUESTION_META[qId] || B2B_QUESTION_META[String(s.questionId)];
        return {
          questionId: /^\d+$/.test(qId) ? Number(qId) : qId,
          score: Math.round(s.score),
          capability:
            meta?.capability ||
            (s.capability as B2bCapability) ||
            "vision_strategy",
          isIndustryQuestion:
            meta?.isIndustry ?? s.isIndustryQuestion ?? false,
          notes: s.evidence ? `[AI-inferred] ${s.evidence}` : undefined,
        };
      });

    if (responses.length === 0) {
      return NextResponse.json(
        { error: "No scores to save" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const records = responses.map((r) => ({
      assessment_id: assessmentId,
      question_id: String(r.questionId),
      score: r.score,
      capability: r.capability,
      is_industry_question: r.isIndustryQuestion || false,
      notes: r.notes ?? null,
    }));

    const { error: rErr } = await supabase
      .from("b2b_responses")
      .upsert(records, { onConflict: "assessment_id,question_id" });

    if (rErr) throw rErr;

    const capabilityScores = computeB2bCapabilityScores(responses);
    const overallScore = computeB2bOverallScore(capabilityScores);
    const maturityStage = computeB2bMaturityStage(overallScore);

    const { error: aErr } = await supabase
      .from("b2b_assessments")
      .update({
        status: "completed",
        overall_score: overallScore,
        maturity_stage: maturityStage,
        capability_scores: capabilityScores,
        updated_at: new Date().toISOString(),
      })
      .eq("id", assessmentId);

    if (aErr) throw aErr;

    const { data: assessment } = await supabase
      .from("b2b_assessments")
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
    console.error("POST /api/b2b/chat/confirm error:", msg);
    return NextResponse.json(
      { error: `Failed to confirm scores: ${msg}` },
      { status: 500 }
    );
  }
}

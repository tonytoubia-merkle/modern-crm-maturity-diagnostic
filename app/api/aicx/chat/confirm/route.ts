import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import {
  computeAicxCapabilityScores,
  computeAicxOverallScore,
  computeAicxMaturityStage,
} from "@/lib/aicx/scoring";
import {
  AICX_CORE_QUESTIONS,
  AICX_INDUSTRY_QUESTIONS,
} from "@/lib/aicx/data/questions";
import type { AicxInferredScore } from "@/lib/aicx/chat/types";
import type { AicxCapability, AicxResponseItem } from "@/lib/aicx/types";

const AICX_QUESTION_META: Record<
  string,
  { capability: AicxCapability; isIndustry: boolean }
> = {};
for (const q of AICX_CORE_QUESTIONS) {
  AICX_QUESTION_META[String(q.id)] = {
    capability: q.capability,
    isIndustry: false,
  };
}
for (const q of AICX_INDUSTRY_QUESTIONS) {
  AICX_QUESTION_META[String(q.id)] = {
    capability: q.capability as AicxCapability,
    isIndustry: true,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentId, scores } = body as {
      assessmentId: string;
      scores: Record<string, AicxInferredScore>;
      skipped: (string | number)[];
    };

    if (!assessmentId) {
      return NextResponse.json(
        { error: "assessmentId required" },
        { status: 400 }
      );
    }

    const responses: AicxResponseItem[] = Object.entries(scores)
      .filter(([, s]) => s && typeof s.score === "number")
      .map(([qId, s]) => {
        const meta =
          AICX_QUESTION_META[qId] || AICX_QUESTION_META[String(s.questionId)];
        return {
          questionId: /^\d+$/.test(qId) ? Number(qId) : qId,
          score: Math.round(s.score),
          capability:
            meta?.capability ||
            (s.capability as AicxCapability) ||
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
      .from("aicx_responses")
      .upsert(records, { onConflict: "assessment_id,question_id" });

    if (rErr) throw rErr;

    const capabilityScores = computeAicxCapabilityScores(responses);
    const overallScore = computeAicxOverallScore(capabilityScores);
    const maturityStage = computeAicxMaturityStage(overallScore);

    const { error: aErr } = await supabase
      .from("aicx_assessments")
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
      .from("aicx_assessments")
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
    console.error("POST /api/aicx/chat/confirm error:", msg);
    return NextResponse.json(
      { error: `Failed to confirm scores: ${msg}` },
      { status: 500 }
    );
  }
}

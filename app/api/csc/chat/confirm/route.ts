import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import {
  computeCscCapabilityScores,
  computeCscOverallScore,
  computeCscMaturityStage,
} from "@/lib/csc/scoring";
import {
  CSC_CORE_QUESTIONS,
  CSC_INDUSTRY_QUESTIONS,
} from "@/lib/csc/data/questions";
import type { CscInferredScore } from "@/lib/csc/chat/types";
import type { CscCapability, CscResponseItem } from "@/lib/csc/types";

/**
 * POST /api/csc/chat/confirm — finalize a conversational CSC assessment.
 *
 * Mirrors /api/chat/confirm (CRM):
 *   - Persist the inferred scores into csc_responses
 *   - Compute capability scores, overall score, and maturity stage
 *   - Mark the csc_assessments row completed and return the share id
 */

const CSC_QUESTION_META: Record<
  string,
  { capability: CscCapability; isIndustry: boolean }
> = {};
for (const q of CSC_CORE_QUESTIONS) {
  CSC_QUESTION_META[String(q.id)] = {
    capability: q.capability,
    isIndustry: false,
  };
}
for (const q of CSC_INDUSTRY_QUESTIONS) {
  CSC_QUESTION_META[String(q.id)] = {
    capability: q.capability as CscCapability,
    isIndustry: true,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentId, scores } = body as {
      assessmentId: string;
      scores: Record<string, CscInferredScore>;
      skipped: (string | number)[];
    };

    if (!assessmentId) {
      return NextResponse.json(
        { error: "assessmentId required" },
        { status: 400 }
      );
    }

    // Convert inferred score map to ResponseItem array.
    // Trust server-side metadata for capability — never the client.
    const responses: CscResponseItem[] = Object.entries(scores)
      .filter(([, s]) => s && typeof s.score === "number")
      .map(([qId, s]) => {
        const meta =
          CSC_QUESTION_META[qId] || CSC_QUESTION_META[String(s.questionId)];
        return {
          questionId: /^\d+$/.test(qId) ? Number(qId) : qId,
          score: Math.round(s.score),
          capability:
            meta?.capability ||
            (s.capability as CscCapability) ||
            "strategy_planning",
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
      .from("csc_responses")
      .upsert(records, { onConflict: "assessment_id,question_id" });

    if (rErr) throw rErr;

    const capabilityScores = computeCscCapabilityScores(responses);
    const overallScore = computeCscOverallScore(capabilityScores);
    const maturityStage = computeCscMaturityStage(overallScore);

    const { error: aErr } = await supabase
      .from("csc_assessments")
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
      .from("csc_assessments")
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
    console.error("POST /api/csc/chat/confirm error:", msg);
    return NextResponse.json(
      { error: `Failed to confirm scores: ${msg}` },
      { status: 500 }
    );
  }
}

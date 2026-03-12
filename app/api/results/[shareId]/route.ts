import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { buildDiagnosticResults } from "@/lib/scoring";
import type { ResponseItem } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: { shareId: string } }
) {
  try {
    const supabase = createServerClient();

    const { data: assessment, error: aErr } = await supabase
      .from("assessments")
      .select("*")
      .eq("share_id", params.shareId)
      .single();

    if (aErr || !assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    const { data: rawResponses, error: rErr } = await supabase
      .from("responses")
      .select("*")
      .eq("assessment_id", assessment.id);

    if (rErr) throw rErr;

    const responses: ResponseItem[] = (rawResponses || []).map((r) => ({
      questionId: r.question_id,
      score: r.score,
      capability: r.capability,
      isIndustryQuestion: r.is_industry_question,
    }));

    const normalizedAssessment = {
      id: assessment.id,
      shareId: assessment.share_id,
      clientName: assessment.client_name,
      clientCompany: assessment.client_company,
      respondentName: assessment.respondent_name,
      repEmail: assessment.rep_email,
      isRepMode: assessment.is_rep_mode,
      industry: assessment.industry,
      status: assessment.status,
      createdAt: assessment.created_at,
      updatedAt: assessment.updated_at,
    };

    const results = buildDiagnosticResults(normalizedAssessment, responses);

    return NextResponse.json(results);
  } catch (err) {
    console.error("GET /api/results/[shareId] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}

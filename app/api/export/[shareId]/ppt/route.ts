import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { buildDiagnosticResults } from "@/lib/scoring";
import { generatePptx } from "@/lib/export/generatePptx";
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
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
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
      notes: r.notes ?? undefined,
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
    const buffer = await generatePptx(results, responses);

    const filename = `${assessment.client_name}_CRM_Diagnostic`
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .replace(/_+/g, "_");

    return new Response(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${filename}.pptx"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("GET /api/export/[shareId]/ppt error:", err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}

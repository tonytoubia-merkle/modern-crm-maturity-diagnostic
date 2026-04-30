import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { inviteToken: string } }
) {
  try {
    const supabase = createServerClient();

    const { data: stakeholder, error: sErr } = await supabase
      .from("aient_stakeholders")
      .select("*")
      .eq("invite_token", params.inviteToken)
      .single();

    if (sErr || !stakeholder) {
      return NextResponse.json(
        { error: "Invalid survey link" },
        { status: 404 }
      );
    }

    const { data: project, error: pErr } = await supabase
      .from("aient_projects")
      .select("*")
      .eq("id", stakeholder.project_id)
      .single();

    if (pErr || !project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    let responses: unknown[] = [];
    if (stakeholder.assessment_id) {
      const { data: rawResponses } = await supabase
        .from("aient_responses")
        .select("*")
        .eq("assessment_id", stakeholder.assessment_id);
      responses = rawResponses || [];
    }

    const mapped = (responses as Array<Record<string, string | number | boolean | null>>).map(
      (r) => ({
        questionId: /^\d+$/.test(String(r.question_id))
          ? Number(r.question_id)
          : r.question_id,
        score: r.score,
        capability: r.capability,
        isIndustryQuestion: r.is_industry_question,
        notes: r.notes ?? undefined,
      })
    );

    return NextResponse.json({
      project: {
        id: project.id,
        clientName: project.client_name,
        industry: project.industry,
        hasPassword: !!project.survey_password,
        mode: project.mode,
        status: project.status,
      },
      stakeholder: {
        id: stakeholder.id,
        name: stakeholder.name,
        status: stakeholder.status,
        assessmentId: stakeholder.assessment_id,
      },
      responses: mapped,
    });
  } catch (err) {
    console.error("GET /api/aient/survey/[inviteToken] error:", err);
    return NextResponse.json(
      { error: "Failed to load survey" },
      { status: 500 }
    );
  }
}

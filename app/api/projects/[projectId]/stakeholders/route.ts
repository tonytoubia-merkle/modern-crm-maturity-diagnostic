import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { generateInviteToken, generateShareId } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await request.json();
    const { stakeholders } = body;

    if (!Array.isArray(stakeholders) || stakeholders.length === 0) {
      return NextResponse.json(
        { error: "stakeholders array is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Verify project exists and get industry
    const { data: project, error: pErr } = await supabase
      .from("projects")
      .select("id, industry, client_name")
      .eq("id", params.projectId)
      .single();

    if (pErr || !project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const results = [];

    for (const s of stakeholders) {
      const inviteToken = generateInviteToken();

      // Create a linked assessment for this stakeholder
      const assessmentShareId = generateShareId();
      const { data: assessment, error: aErr } = await supabase
        .from("assessments")
        .insert({
          share_id: assessmentShareId,
          client_name: project.client_name,
          client_company: s.role || "",
          respondent_name: s.name,
          rep_email: s.email || null,
          is_rep_mode: false,
          industry: project.industry || null,
          status: "in_progress",
          project_id: project.id,
        })
        .select()
        .single();

      if (aErr) throw aErr;

      // Create the stakeholder record
      const { data: stakeholder, error: sErr } = await supabase
        .from("stakeholders")
        .insert({
          project_id: project.id,
          name: s.name,
          email: s.email || null,
          role: s.role || null,
          invite_token: inviteToken,
          assessment_id: assessment.id,
          status: "invited",
        })
        .select()
        .single();

      if (sErr) throw sErr;

      // Link assessment back to stakeholder
      await supabase
        .from("assessments")
        .update({ stakeholder_id: stakeholder.id })
        .eq("id", assessment.id);

      results.push({
        id: stakeholder.id,
        name: s.name,
        email: s.email,
        role: s.role,
        inviteToken,
        assessmentId: assessment.id,
      });
    }

    return NextResponse.json({ stakeholders: results });
  } catch (err) {
    console.error("POST /api/projects/[id]/stakeholders error:", err);
    return NextResponse.json(
      { error: "Failed to add stakeholders" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("stakeholders")
      .select("*, assessments(status, overall_score, maturity_stage, updated_at)")
      .eq("project_id", params.projectId)
      .order("invited_at", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err) {
    console.error("GET /api/projects/[id]/stakeholders error:", err);
    return NextResponse.json(
      { error: "Failed to fetch stakeholders" },
      { status: 500 }
    );
  }
}

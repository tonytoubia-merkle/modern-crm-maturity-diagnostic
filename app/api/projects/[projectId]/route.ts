import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = createServerClient();

    const { data: project, error: pErr } = await supabase
      .from("projects")
      .select("*")
      .eq("id", params.projectId)
      .single();

    if (pErr || !project) {
      // Try by share_id
      const { data: projByShare, error: sErr } = await supabase
        .from("projects")
        .select("*")
        .eq("share_id", params.projectId)
        .single();

      if (sErr || !projByShare) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      const { data: stakeholders } = await supabase
        .from("stakeholders")
        .select("*, assessments(share_id, status, overall_score, maturity_stage)")
        .eq("project_id", projByShare.id)
        .order("invited_at", { ascending: true });

      return NextResponse.json({
        project: { ...projByShare, survey_password: undefined },
        stakeholders: stakeholders || [],
      });
    }

    const { data: stakeholders } = await supabase
      .from("stakeholders")
      .select("*, assessments(share_id, status, overall_score, maturity_stage)")
      .eq("project_id", project.id)
      .order("invited_at", { ascending: true });

    return NextResponse.json({
      project: { ...project, survey_password: undefined },
      stakeholders: stakeholders || [],
    });
  } catch (err) {
    console.error("GET /api/projects/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await request.json();
    const supabase = createServerClient();

    const allowedFields: Record<string, string> = {
      status: "status",
      aggregatedScores: "aggregated_scores",
      aggregatedOverall: "aggregated_overall",
      aggregatedMaturity: "aggregated_maturity",
      triggeredOpportunityIds: "triggered_opportunity_ids",
      workshopAgenda: "workshop_agenda",
    };

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const [key, dbCol] of Object.entries(allowedFields)) {
      if (body[key] !== undefined) updates[dbCol] = body[key];
    }

    const { error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", params.projectId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/projects/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = createServerClient();
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", params.projectId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/projects/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

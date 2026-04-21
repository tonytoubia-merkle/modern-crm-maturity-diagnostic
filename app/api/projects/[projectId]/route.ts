import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { canAdmin } from "@/lib/auth/roles";

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

      // Also get assessments linked directly to this project (covers pre-stakeholder records)
      const { data: linkedAssessments } = await supabase
        .from("assessments")
        .select("id, share_id, respondent_name, status, overall_score, maturity_stage")
        .eq("project_id", projByShare.id);

      return NextResponse.json({
        project: { ...projByShare, survey_password: undefined },
        stakeholders: stakeholders || [],
        linkedAssessments: linkedAssessments || [],
      });
    }

    const { data: stakeholders } = await supabase
      .from("stakeholders")
      .select("*, assessments(share_id, status, overall_score, maturity_stage)")
      .eq("project_id", project.id)
      .order("invited_at", { ascending: true });

    const { data: linkedAssessments } = await supabase
      .from("assessments")
      .select("id, share_id, respondent_name, status, overall_score, maturity_stage")
      .eq("project_id", project.id);

    return NextResponse.json({
      project: { ...project, survey_password: undefined },
      stakeholders: stakeholders || [],
      linkedAssessments: linkedAssessments || [],
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

/**
 * DELETE /api/projects/:id?mode=orphan|cascade
 *
 * orphan (default): delete the project only. Because
 *   assessments.project_id has ON DELETE SET NULL, linked assessments are
 *   retained and simply un-linked.
 * cascade: delete every assessment linked to the project first (responses
 *   cascade via their own FK), then the project itself.
 *
 * CRM admins only.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    if (!(await canAdmin("crm"))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") === "cascade" ? "cascade" : "orphan";
    const supabase = createServerClient();

    if (mode === "cascade") {
      const { error: aErr } = await supabase
        .from("assessments")
        .delete()
        .eq("project_id", params.projectId);
      if (aErr) throw aErr;
    }

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", params.projectId);

    if (error) throw error;
    return NextResponse.json({ success: true, mode });
  } catch (err) {
    console.error("DELETE /api/projects/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

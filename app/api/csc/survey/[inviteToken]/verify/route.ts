import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";

export async function POST(
  request: NextRequest,
  { params }: { params: { inviteToken: string } }
) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data: stakeholder, error: sErr } = await supabase
      .from("csc_stakeholders")
      .select("project_id")
      .eq("invite_token", params.inviteToken)
      .single();

    if (sErr || !stakeholder) {
      return NextResponse.json(
        { error: "Invalid survey link" },
        { status: 404 }
      );
    }

    const { data: project, error: pErr } = await supabase
      .from("csc_projects")
      .select("survey_password")
      .eq("id", stakeholder.project_id)
      .single();

    if (pErr || !project || !project.survey_password) {
      return NextResponse.json(
        { error: "No password required" },
        { status: 400 }
      );
    }

    const valid = await bcrypt.compare(password, project.survey_password);

    return NextResponse.json({ valid });
  } catch (err) {
    console.error("POST /api/csc/survey/[inviteToken]/verify error:", err);
    return NextResponse.json(
      { error: "Failed to verify password" },
      { status: 500 }
    );
  }
}

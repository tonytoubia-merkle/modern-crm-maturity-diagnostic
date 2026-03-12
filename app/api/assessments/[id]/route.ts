import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { data: assessment, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    // Also fetch responses
    const { data: responses } = await supabase
      .from("responses")
      .select("*")
      .eq("assessment_id", params.id);

    return NextResponse.json({ assessment, responses: responses || [] });
  } catch (err) {
    console.error("GET /api/assessments/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch assessment" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const supabase = createServerClient();

    const allowedFields: Record<string, string> = {
      industry: "industry",
      status: "status",
      overallScore: "overall_score",
      maturityStage: "maturity_stage",
      capabilityScores: "capability_scores",
    };

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const [key, dbCol] of Object.entries(allowedFields)) {
      if (body[key] !== undefined) updates[dbCol] = body[key];
    }

    const { error } = await supabase
      .from("assessments")
      .update(updates)
      .eq("id", params.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/assessments/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update assessment" },
      { status: 500 }
    );
  }
}

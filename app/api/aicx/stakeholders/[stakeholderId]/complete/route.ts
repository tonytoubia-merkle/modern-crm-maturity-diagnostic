import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { stakeholderId: string } }
) {
  try {
    const supabase = createServerClient();

    let status = "completed";
    try {
      const body = await request.json();
      if (body.status === "in_progress") status = "in_progress";
    } catch {
      // default
    }

    const updates: Record<string, unknown> = { status };
    if (status === "completed") {
      updates.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("aicx_stakeholders")
      .update(updates)
      .eq("id", params.stakeholderId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/aicx/stakeholders/[id]/complete error:", err);
    return NextResponse.json(
      { error: "Failed to update CSC stakeholder status" },
      { status: 500 }
    );
  }
}

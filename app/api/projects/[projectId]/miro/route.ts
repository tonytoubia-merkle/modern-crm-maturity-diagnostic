import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createWorkshopBoard } from "@/lib/miro/createBoard";
import type { WorkshopAgenda } from "@/lib/types";

export async function POST(
  _request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    if (!process.env.MIRO_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Miro integration not configured" },
        { status: 501 }
      );
    }

    const supabase = createServerClient();

    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", params.projectId)
      .single();

    if (error || !project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (!project.workshop_agenda) {
      return NextResponse.json(
        { error: "No workshop agenda generated yet. Aggregate results first." },
        { status: 400 }
      );
    }

    const agenda = project.workshop_agenda as WorkshopAgenda;
    const { boardUrl, boardId } = await createWorkshopBoard(
      project.client_name,
      agenda
    );

    return NextResponse.json({ boardUrl, boardId });
  } catch (err) {
    console.error("POST /api/projects/[id]/miro error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create Miro board" },
      { status: 500 }
    );
  }
}

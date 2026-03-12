import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { responses } = body;

    if (!Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json(
        { error: "responses array is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Upsert all responses
    const records = responses.map(
      (r: {
        questionId: string | number;
        score: number;
        capability: string;
        isIndustryQuestion: boolean;
      }) => ({
        assessment_id: params.id,
        question_id: String(r.questionId),
        score: r.score,
        capability: r.capability,
        is_industry_question: r.isIndustryQuestion || false,
      })
    );

    const { error } = await supabase
      .from("responses")
      .upsert(records, { onConflict: "assessment_id,question_id" });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/assessments/[id]/responses error:", err);
    return NextResponse.json(
      { error: "Failed to save responses" },
      { status: 500 }
    );
  }
}

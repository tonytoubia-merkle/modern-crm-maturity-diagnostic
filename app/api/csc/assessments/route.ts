import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { generateShareId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientName,
      clientCompany,
      respondentName,
      repEmail,
      isRepMode,
      industry,
      source,
    } = body;

    if (!clientName || !respondentName) {
      return NextResponse.json(
        { error: "clientName and respondentName are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const shareId = generateShareId();

    const record = {
      share_id: shareId,
      client_name: clientName,
      client_company: clientCompany || "",
      respondent_name: respondentName,
      rep_email: repEmail || null,
      is_rep_mode: isRepMode || false,
      industry: industry || null,
      status: "in_progress",
      source: source || null,
    };

    const { data, error } = await supabase
      .from("csc_assessments")
      .insert(record)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id, shareId: data.share_id });
  } catch (err) {
    console.error("POST /api/csc/assessments error:", err);
    return NextResponse.json(
      { error: "Failed to create CSC assessment" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const repEmail = searchParams.get("repEmail");

    if (!repEmail) {
      return NextResponse.json({ error: "Missing repEmail" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("csc_assessments")
      .select(
        "id, share_id, client_name, client_company, respondent_name, status, industry, overall_score, maturity_stage, created_at, updated_at"
      )
      .eq("rep_email", repEmail)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/csc/assessments error:", err);
    return NextResponse.json(
      { error: "Failed to fetch CSC assessments" },
      { status: 500 }
    );
  }
}

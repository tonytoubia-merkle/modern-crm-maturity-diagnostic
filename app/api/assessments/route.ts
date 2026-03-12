import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { generateShareId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientCompany, respondentName, repEmail, isRepMode, industry } =
      body;

    if (!clientName || !respondentName) {
      return NextResponse.json(
        { error: "clientName and respondentName are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const shareId = generateShareId();

    const { data, error } = await supabase
      .from("assessments")
      .insert({
        share_id: shareId,
        client_name: clientName,
        client_company: clientCompany || "",
        respondent_name: respondentName,
        rep_email: repEmail || null,
        is_rep_mode: isRepMode || false,
        industry: industry || null,
        status: "in_progress",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id, shareId: data.share_id });
  } catch (err) {
    console.error("POST /api/assessments error:", err);
    return NextResponse.json(
      { error: "Failed to create assessment" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const repEmail = searchParams.get("repEmail");
    const adminPassword = request.headers.get("x-admin-password");

    const supabase = createServerClient();

    // Admin access: return all assessments
    if (adminPassword) {
      if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json(data);
    }

    // Rep email lookup: return assessments for that rep
    if (repEmail) {
      const { data, error } = await supabase
        .from("assessments")
        .select(
          "id, share_id, client_name, client_company, respondent_name, status, industry, overall_score, maturity_stage, created_at, updated_at"
        )
        .eq("rep_email", repEmail)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (err) {
    console.error("GET /api/assessments error:", err);
    return NextResponse.json(
      { error: "Failed to fetch assessments" },
      { status: 500 }
    );
  }
}

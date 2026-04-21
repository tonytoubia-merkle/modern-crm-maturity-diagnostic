import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { canAdmin } from "@/lib/auth/roles";
import { generateShareId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientCompany, respondentName, repEmail, isRepMode, industry, projectId, stakeholderId, source } =
      body;

    if (!clientName || !respondentName) {
      return NextResponse.json(
        { error: "clientName and respondentName are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const shareId = generateShareId();

    const baseRecord = {
      share_id: shareId,
      client_name: clientName,
      client_company: clientCompany || "",
      respondent_name: respondentName,
      rep_email: repEmail || null,
      is_rep_mode: isRepMode || false,
      industry: industry || null,
      status: "in_progress",
      project_id: projectId || null,
      stakeholder_id: stakeholderId || null,
    };

    // Try with source column first, fall back without if column doesn't exist
    let data, error;
    if (source) {
      const result = await supabase
        .from("assessments")
        .insert({ ...baseRecord, source })
        .select()
        .single();
      data = result.data;
      error = result.error;

      // If source column doesn't exist, retry without it
      if (error && error.message?.includes("source")) {
        const retry = await supabase
          .from("assessments")
          .insert(baseRecord)
          .select()
          .single();
        data = retry.data;
        error = retry.error;
      }
    } else {
      const result = await supabase
        .from("assessments")
        .insert(baseRecord)
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

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
    const wantsAdmin = searchParams.get("admin") === "1";

    const supabase = createServerClient();

    // Admin access: return all assessments (CRM admins only).
    if (wantsAdmin) {
      if (!(await canAdmin("crm"))) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
          "id, share_id, client_name, client_company, respondent_name, status, industry, overall_score, maturity_stage, created_at, updated_at, project_id"
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

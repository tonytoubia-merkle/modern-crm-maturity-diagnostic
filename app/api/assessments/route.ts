import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { canAdmin } from "@/lib/auth/roles";
import { generateShareId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientCompany, respondentName, repEmail, isRepMode, industry, businessModel, projectId, stakeholderId, source } =
      body;

    if (!clientName || !respondentName) {
      return NextResponse.json(
        { error: "clientName and respondentName are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const shareId = generateShareId();

    const record: Record<string, unknown> = {
      share_id: shareId,
      client_name: clientName,
      client_company: clientCompany || "",
      respondent_name: respondentName,
      rep_email: repEmail || null,
      is_rep_mode: isRepMode || false,
      industry: industry || null,
      business_model: businessModel || null,
      status: "in_progress",
      project_id: projectId || null,
      stakeholder_id: stakeholderId || null,
    };
    if (source) record.source = source;

    // Insert, gracefully dropping optional columns that may not exist yet in
    // environments where a migration hasn't run (business_model, source).
    let data, error;
    for (let attempt = 0; attempt < 3; attempt++) {
      const result = await supabase
        .from("assessments")
        .insert(record)
        .select()
        .single();
      data = result.data;
      error = result.error;
      if (!error) break;
      const msg = error.message || "";
      if ("business_model" in record && msg.includes("business_model")) {
        delete record.business_model;
        continue;
      }
      if ("source" in record && msg.includes("source")) {
        delete record.source;
        continue;
      }
      break;
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

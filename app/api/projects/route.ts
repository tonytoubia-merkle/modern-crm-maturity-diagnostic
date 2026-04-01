import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { generateShareId } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientName,
      clientCompany,
      industry,
      createdByName,
      createdByEmail,
      mode,
      surveyPassword,
    } = body;

    if (!clientName || !createdByName) {
      return NextResponse.json(
        { error: "clientName and createdByName are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const shareId = generateShareId();

    const hashedPassword = surveyPassword
      ? await bcrypt.hash(surveyPassword, 10)
      : null;

    const { data, error } = await supabase
      .from("projects")
      .insert({
        share_id: shareId,
        client_name: clientName,
        client_company: clientCompany || "",
        industry: industry || null,
        created_by_name: createdByName,
        created_by_email: createdByEmail || null,
        mode: mode || "workshop",
        survey_password: hashedPassword,
        status: "collecting",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id, shareId: data.share_id });
  } catch (err) {
    console.error("POST /api/projects error:", err);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const adminPassword = request.headers.get("x-admin-password");

    const supabase = createServerClient();

    if (adminPassword) {
      if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json(data);
    }

    if (email) {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("created_by_email", email)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (err) {
    console.error("GET /api/projects error:", err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

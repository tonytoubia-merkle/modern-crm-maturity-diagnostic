import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getAdminAccess } from "@/lib/auth/roles";

const VALID_SCOPES = new Set(["crm", "csc"]);
const VALID_ROLES = new Set(["user", "super_admin"]);

function normalizeScopes(input: unknown): string[] | null {
  if (input === undefined) return null;
  if (!Array.isArray(input)) return null;
  const cleaned = input
    .map((s) => (typeof s === "string" ? s.toLowerCase() : ""))
    .filter((s) => VALID_SCOPES.has(s));
  return Array.from(new Set(cleaned));
}

/** GET /api/admin/users – list all app_users rows. Super admins only. */
export async function GET() {
  const access = await getAdminAccess();
  if (!access.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("app_users")
    .select("email, role, admin_scopes, created_at, updated_at")
    .order("role", { ascending: false })
    .order("email", { ascending: true });
  if (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

/** POST /api/admin/users – upsert a user's role and/or scopes. Super admins only. */
export async function POST(request: NextRequest) {
  const access = await getAdminAccess();
  if (!access.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { email?: string; role?: string; admin_scopes?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const role = body.role ?? "user";
  if (!VALID_ROLES.has(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const scopes = normalizeScopes(body.admin_scopes) ?? [];

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("app_users")
    .upsert(
      { email, role, admin_scopes: scopes },
      { onConflict: "email" }
    )
    .select("email, role, admin_scopes, created_at, updated_at")
    .single();

  if (error) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
  }
  return NextResponse.json(data);
}

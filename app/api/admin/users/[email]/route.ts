import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getAdminAccess } from "@/lib/auth/roles";

const VALID_SCOPES = new Set(["crm", "csc"]);
const VALID_ROLES = new Set(["user", "super_admin"]);

function normalizeScopes(input: unknown): string[] | null {
  if (input === undefined) return null;
  if (!Array.isArray(input)) return null;
  return Array.from(
    new Set(
      input
        .map((s) => (typeof s === "string" ? s.toLowerCase() : ""))
        .filter((s) => VALID_SCOPES.has(s))
    )
  );
}

/** PATCH /api/admin/users/[email] – update role and/or scopes. Super admins only. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  const access = await getAdminAccess();
  if (!access.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const targetEmail = decodeURIComponent(params.email).toLowerCase();

  let body: { role?: string; admin_scopes?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (body.role !== undefined) {
    if (!VALID_ROLES.has(body.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    // Guard: prevent a caller from demoting themselves out of super_admin –
    // would lock themselves out of this very surface.
    if (
      access.email &&
      access.email.toLowerCase() === targetEmail &&
      body.role !== "super_admin"
    ) {
      return NextResponse.json(
        { error: "You can't demote yourself from super_admin." },
        { status: 400 }
      );
    }
    updates.role = body.role;
  }

  if (body.admin_scopes !== undefined) {
    const scopes = normalizeScopes(body.admin_scopes);
    if (scopes === null) {
      return NextResponse.json({ error: "Invalid admin_scopes" }, { status: 400 });
    }
    updates.admin_scopes = scopes;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No changes provided" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("app_users")
    .update(updates)
    .eq("email", targetEmail)
    .select("email, role, admin_scopes, created_at, updated_at")
    .single();

  if (error) {
    console.error("PATCH /api/admin/users/[email] error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
  return NextResponse.json(data);
}

/** DELETE /api/admin/users/[email] – remove a user row. Super admins only.
 *  Removing a row returns the user to default ('user', no scopes) on next lookup. */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { email: string } }
) {
  const access = await getAdminAccess();
  if (!access.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const targetEmail = decodeURIComponent(params.email).toLowerCase();

  if (access.email && access.email.toLowerCase() === targetEmail) {
    return NextResponse.json(
      { error: "You can't remove your own admin record." },
      { status: 400 }
    );
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from("app_users")
    .delete()
    .eq("email", targetEmail);

  if (error) {
    console.error("DELETE /api/admin/users/[email] error:", error);
    return NextResponse.json({ error: "Failed to remove user" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

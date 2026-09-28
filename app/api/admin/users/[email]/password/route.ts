import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";
import { getAdminAccess } from "@/lib/auth/roles";
import { isAllowedEmail, MIN_PASSWORD_LENGTH } from "@/lib/auth/domains";

async function findAuthUser(supabase: SupabaseClient, email: string): Promise<User | null> {
  const perPage = 1000;
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === email);
    if (match) return match;
    if (data.users.length < perPage) return null;
  }
}

/** POST /api/admin/users/[email]/password – set a user's password, creating the
 *  account if it doesn't exist yet. Super admins only. */
export async function POST(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  const access = await getAdminAccess();
  if (!access.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const email = decodeURIComponent(params.email).trim().toLowerCase();
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!isAllowedEmail(email)) {
    return NextResponse.json(
      { error: "Only @merkle.com and @dentsu.com accounts are allowed." },
      { status: 400 }
    );
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const supabase = createServerClient();
  try {
    const existing = await findAuthUser(supabase, email);
    const { error } = existing
      ? await supabase.auth.admin.updateUserById(existing.id, {
          password,
          email_confirm: true,
        })
      : await supabase.auth.admin.createUser({ email, password, email_confirm: true });

    if (error) {
      if (error.code === "weak_password") {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error;
    }
    return NextResponse.json({ created: !existing });
  } catch (err) {
    console.error("POST /api/admin/users/[email]/password error:", err);
    return NextResponse.json({ error: "Failed to set password" }, { status: 500 });
  }
}

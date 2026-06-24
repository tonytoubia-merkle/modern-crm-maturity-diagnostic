import { createServerClient } from "@/lib/supabase/server";
import { getCurrentUserEmail } from "@/lib/auth/session";

// Re-exported so existing importers of `roles` keep working; the canonical
// implementation now lives in the auth seam (lib/auth/session.ts).
export { getCurrentUserEmail };

export type AppRole = "user" | "super_admin";

/** Product areas that can be independently admin-scoped. */
export type AdminScope = "crm" | "csc" | "b2b" | "aicx" | "aient";

export interface AdminAccess {
  /** role = 'super_admin' – grants access to all current and future scopes. */
  isSuperAdmin: boolean;
  /** Narrow admin scopes granted via app_users.admin_scopes (ignored when isSuperAdmin). */
  scopes: Set<AdminScope>;
  /** Signed-in user's email, or null when there is no session. */
  email: string | null;
}

/**
 * One-stop lookup: signed-in email, super-admin flag, narrow scopes.
 * Treat any authenticated user without an app_users row as a regular 'user'.
 */
export async function getAdminAccess(): Promise<AdminAccess> {
  const email = await getCurrentUserEmail();
  if (!email) {
    return { isSuperAdmin: false, scopes: new Set<AdminScope>(), email: null };
  }
  const service = createServerClient();
  const { data } = await service
    .from("app_users")
    .select("role, admin_scopes")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  const role = (data?.role as AppRole | undefined) ?? "user";
  const raw = Array.isArray(data?.admin_scopes) ? (data!.admin_scopes as string[]) : [];
  const scopes = new Set<AdminScope>(
    raw.filter(
      (s): s is AdminScope =>
        s === "crm" ||
        s === "csc" ||
        s === "b2b" ||
        s === "aicx" ||
        s === "aient"
    )
  );
  return { isSuperAdmin: role === "super_admin", scopes, email };
}

/** True for role='super_admin' OR a user whose admin_scopes includes the scope. */
export async function canAdmin(scope: AdminScope): Promise<boolean> {
  const a = await getAdminAccess();
  return a.isSuperAdmin || a.scopes.has(scope);
}

/** Back-compat helper – checks for role='super_admin' specifically. */
export async function isSuperAdmin(): Promise<boolean> {
  return (await getAdminAccess()).isSuperAdmin;
}

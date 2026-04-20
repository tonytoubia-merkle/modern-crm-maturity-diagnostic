import { cookies } from "next/headers";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import { createServerClient } from "@/lib/supabase/server";

export type AppRole = "user" | "super_admin";

/**
 * Returns the email of the currently signed-in Supabase user, or null if
 * there is no session. Safe to call from route handlers / server components.
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  const cookieStore = cookies();
  const supabase = createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        // We don't need to mutate cookies during a role check; the request
        // lifecycle handles session refresh elsewhere (middleware).
        setAll: () => {},
      },
    }
  );
  const { data } = await supabase.auth.getUser();
  return data.user?.email ?? null;
}

/**
 * Role lookup for the signed-in user. Returns null when no session exists.
 * Any authenticated user without an app_users row is treated as 'user'.
 */
export async function getCurrentRole(): Promise<AppRole | null> {
  const email = await getCurrentUserEmail();
  if (!email) return null;
  const service = createServerClient();
  const { data } = await service
    .from("app_users")
    .select("role")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  return (data?.role as AppRole | undefined) ?? "user";
}

export async function isSuperAdmin(): Promise<boolean> {
  return (await getCurrentRole()) === "super_admin";
}

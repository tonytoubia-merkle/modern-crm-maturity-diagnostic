import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Server-side authentication seam.
 *
 * This is the ONLY place the server reads the current user's identity from the
 * auth provider. Everything else — middleware, route handlers, server
 * components, role checks (lib/auth/roles.ts) — goes through these functions.
 *
 * To migrate to Okta (Auth.js): reimplement the two functions below against the
 * Okta/Auth.js session. Callers do not change.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * The signed-in user's email in a route handler or server component, or null
 * when there is no session. Safe to call anywhere with request cookies.
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  const cookieStore = cookies();
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {},
    },
  });
  const { data } = await supabase.auth.getUser();
  return data.user?.email ?? null;
}

/**
 * Middleware-context variant: returns the signed-in email (or null) plus the
 * NextResponse carrying any refreshed auth cookies. Return that response from
 * the middleware so the session stays warm.
 */
export async function getRequestUserEmail(
  request: NextRequest
): Promise<{ email: string | null; response: NextResponse }> {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request: { headers: request.headers } });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  return { email: data.user?.email ?? null, response };
}

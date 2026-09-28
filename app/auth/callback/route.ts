import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAllowedEmail, safeRedirectPath } from "@/lib/auth/domains";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = safeRedirectPath(searchParams.get("redirect"));

  const authError = (reason: "link" | "domain") => {
    const url = new URL("/auth", request.url);
    url.searchParams.set("error", reason);
    url.searchParams.set("redirect", redirect);
    return NextResponse.redirect(url);
  };

  if (!code) return authError("link");

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component can't set cookies, handled by middleware
          }
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return authError("link");

  if (!isAllowedEmail(data.user?.email)) {
    await supabase.auth.signOut();
    return authError("domain");
  }

  return NextResponse.redirect(new URL(redirect, request.url));
}

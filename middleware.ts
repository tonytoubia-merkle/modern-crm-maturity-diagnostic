import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/auth/callback",
  "/crm/exec",          // Modern CRM Executive Self-Assessment (kiosk)
  "/crm/short",         // Modern CRM Executive Snapshot (events, QR, web)
];

// Routes that start with these prefixes are public
const PUBLIC_PREFIXES = [
  "/survey/",           // CRM stakeholder survey links
  "/csc/survey/",       // CSC stakeholder survey links
  "/b2b/survey/",       // B2B stakeholder survey links
  "/aicx/survey/",      // AI for CX stakeholder survey links
  "/aient/survey/",     // AI for Enterprise stakeholder survey links
  "/results/",          // shareable CRM results pages
  "/csc/results/",      // shareable CSC results pages
  "/b2b/results/",      // shareable B2B results pages
  "/aicx/results/",     // shareable AI for CX results pages
  "/aient/results/",    // shareable AI for Enterprise results pages
  "/api/",              // all API routes (they use service role key server-side)
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow public prefixes
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/merkle-logo") ||
    pathname.startsWith("/dentsu-logo") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".webp")
  ) {
    return NextResponse.next();
  }

  // Create Supabase client with cookie handling
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, redirect to login
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

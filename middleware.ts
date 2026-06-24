import { NextResponse, type NextRequest } from "next/server";
import { getRequestUserEmail } from "@/lib/auth/session";

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/auth/callback",
  "/crm/exec",          // Modern CRM Executive Self-Assessment (kiosk)
  "/crm/exec/tablet",   // Landscape tablet preview of the kiosk
  "/crm/exec/results",  // Public QR results page (scores in ?r=, no login/PII)
  "/crm/exec/email-preview", // Static preview of the results email
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
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".gif") ||
    pathname.endsWith(".avif")
  ) {
    return NextResponse.next();
  }

  // Read the session through the auth seam (refreshes cookies on `response`).
  const { email, response } = await getRequestUserEmail(request);

  // If not signed in, redirect to login.
  if (!email) {
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

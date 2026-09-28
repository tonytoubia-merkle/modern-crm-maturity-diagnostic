export const ALLOWED_DOMAINS = ["merkle.com", "dentsu.com"];

export const AUTH_REDIRECT_KEY = "auth_redirect";

export function isAllowedEmail(email: string | null | undefined): boolean {
  const domain = email?.trim().split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return ALLOWED_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`));
}

// Only same-origin paths; blocks "//evil.com" and absolute URLs.
export function safeRedirectPath(redirect: string | null | undefined): string {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return "/";
  }
  return redirect;
}

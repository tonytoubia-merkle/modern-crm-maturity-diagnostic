"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { isAllowedEmail, safeRedirectPath } from "@/lib/auth/domains";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { detectSessionInUrl: false } }
);

// Landing page for sign-in links: reads the session from the URL fragment
// and stores it in cookies so the server and middleware see it.
export default function ConfirmPage() {
  const [failed, setFailed] = useState<null | "link" | "domain">(null);

  useEffect(() => {
    const finish = async () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");

      if (!accessToken || !refreshToken) {
        console.error("auth confirm: no session in link", hash.get("error_code"));
        setFailed("link");
        return;
      }

      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error) {
        console.error("auth confirm: setSession failed", error.message);
        setFailed("link");
        return;
      }
      if (!isAllowedEmail(data.user?.email)) {
        await supabase.auth.signOut();
        setFailed("domain");
        return;
      }

      const redirect = safeRedirectPath(
        new URLSearchParams(window.location.search).get("redirect")
      );
      window.location.replace(redirect);
    };
    finish();
  }, []);

  return (
    <AuthShell title="Signing you in" subtitle="">
      {failed === null && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-m2-blue border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {failed && (
        <div className="space-y-3">
          <AuthAlert
            tone={failed === "domain" ? "domain" : "error"}
            title={failed === "domain" ? "Use a Merkle or dentsu email" : "Link expired"}
            body={
              failed === "domain"
                ? "Only @merkle.com and @dentsu.com addresses can sign in."
                : "This sign-in link has already been used or has expired. Request a new one to continue."
            }
          />
          <a
            href="/auth"
            className="w-full block text-center px-4 py-2.5 text-sm font-semibold text-white rounded-lg bg-m2-blue hover:bg-m2-blue-alt transition-colors"
          >
            Get a new sign-in link
          </a>
        </div>
      )}
    </AuthShell>
  );
}

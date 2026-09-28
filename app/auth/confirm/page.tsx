"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { AUTH_REDIRECT_KEY, safeRedirectPath } from "@/lib/auth/domains";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Verifies only on click: Outlook Safe Links and other scanners open email
// links automatically, which would otherwise burn the one-time token.
export default function ConfirmPage() {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    const params = new URLSearchParams(window.location.search);
    const tokenHash = params.get("token_hash");
    const type = (params.get("type") || "email") as EmailOtpType;

    const { error } = tokenHash
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error("missing token_hash") };

    if (error) {
      console.error("auth confirm failed:", error.message);
      setFailed(true);
      setLoading(false);
      return;
    }

    const redirect = safeRedirectPath(localStorage.getItem(AUTH_REDIRECT_KEY));
    localStorage.removeItem(AUTH_REDIRECT_KEY);
    window.location.href = redirect;
  };

  return (
    <AuthShell title="Sign in" subtitle="Confirm it's you to finish signing in.">
      {failed ? (
        <div className="space-y-3">
          <AuthAlert
            tone="error"
            title="Link expired"
            body="This sign-in link has already been used or has expired. Request a new one to continue."
          />
          <a
            href="/auth"
            className="w-full block text-center px-4 py-2.5 text-sm font-semibold text-white rounded-lg bg-m2-blue hover:bg-m2-blue-alt transition-colors"
          >
            Get a new sign-in email
          </a>
        </div>
      ) : (
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full px-4 py-2.5 text-sm font-semibold text-white rounded-lg bg-m2-blue hover:bg-m2-blue-alt transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Continue to the assessment"}
        </button>
      )}
    </AuthShell>
  );
}

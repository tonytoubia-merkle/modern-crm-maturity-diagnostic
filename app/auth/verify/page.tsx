"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthAlert } from "@/components/auth/AuthAlert";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * /auth/verify – handles the magic link callback.
 *
 * When user clicks the link in their email, they land here with a token.
 * We verify the token, sign them in, and redirect to the destination.
 */
export default function VerifyPage() {
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Get the code from URL hash (Supabase magic links use #code=...)
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const code = params.get("code");

        if (!code) {
          setErrorMsg("No verification code found. The link may be invalid or expired.");
          setStatus("error");
          return;
        }

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          setErrorMsg(error.message || "Failed to verify link. It may be expired.");
          setStatus("error");
          return;
        }

        setStatus("success");

        // Get redirect URL from search params
        const redirect = new URLSearchParams(window.location.search).get("redirect") || "/";
        setTimeout(() => {
          window.location.href = redirect;
        }, 1500);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Verification failed";
        setErrorMsg(msg);
        setStatus("error");
      }
    };

    verifyToken();
  }, []);

  return (
    <AuthShell title="Verifying..." subtitle="">
      {status === "verifying" && (
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-m2-blue border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-center text-sm text-slate-600">
            Signing you in...
          </p>
        </div>
      )}

      {status === "success" && (
        <AuthAlert
          tone="success"
          title="You're in!"
          body="Redirecting to the workspace..."
        />
      )}

      {status === "error" && (
        <div className="space-y-3">
          <AuthAlert
            tone="error"
            title="Verification failed"
            body={errorMsg || "We couldn't verify your sign-in link."}
          />
          <a
            href="/auth"
            className="w-full block text-center px-4 py-2.5 text-sm font-semibold text-white rounded-lg bg-m2-blue hover:bg-m2-blue-alt transition-colors"
          >
            Try Again
          </a>
        </div>
      )}
    </AuthShell>
  );
}

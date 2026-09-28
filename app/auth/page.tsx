"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { validateAuthEmail } from "@/components/auth/authShared";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * /auth – unified passwordless authentication.
 *
 * User enters email → magic link sent → click link in email → auto-authenticated.
 * No passwords, no registration confusion. Simple and accessible.
 *
 * Custom AlertCards handle:
 *   - wrong domain    → amber "use @merkle.com or @dentsu.com"
 *   - email sent      → green "check your email for the magic link"
 *   - generic failure → red error card
 */
export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [domainError, setDomainError] = useState(false);
  const [authFailure, setAuthFailure] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const redirect =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect") || "/"
      : "/";

  const clearAlerts = () => {
    setDomainError(false);
    setAuthFailure(null);
    setMissingFields(null);
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    if (!email.trim()) {
      setMissingFields("Enter your email to continue.");
      return;
    }

    const v = validateAuthEmail(email);
    if (!v.ok) {
      if (v.reason === "wrong_domain") setDomainError(true);
      else setMissingFields("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify?redirect=${encodeURIComponent(redirect)}`,
        },
      });
      if (error) throw error;
      setEmailSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send magic link";
      setAuthFailure(msg);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="A magic link has been sent to your inbox."
      >
        <AuthAlert
          tone="success"
          title="Magic link sent"
          body={
            <>
              We sent a sign-in link to <strong>{email}</strong>. Click it to
              authenticate and access the workspace. The link expires in 24
              hours.
            </>
          }
        />
        <button
          onClick={() => {
            setEmailSent(false);
            setEmail("");
            clearAlerts();
          }}
          className="w-full mt-4 px-4 py-2.5 text-sm font-semibold text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Try another email
        </button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Enter your email to receive a magic sign-in link."
    >
      <p className="text-[11px] text-slate-400 mb-3 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
        Only <strong className="text-slate-600">@merkle.com</strong> and{" "}
        <strong className="text-slate-600">@dentsu.com</strong> email addresses
        are permitted.
      </p>

      <form noValidate onSubmit={handleMagicLink} className="space-y-3">
        <input
          type="email"
          placeholder="you@merkle.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (domainError || authFailure || missingFields) clearAlerts();
          }}
          autoComplete="email"
          className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
        />

        {domainError && (
          <AuthAlert
            tone="domain"
            title="Use a Merkle or dentsu email"
            body={
              <>
                You can only sign in with <strong>@merkle.com</strong> or{" "}
                <strong>@dentsu.com</strong> addresses. Try again with your
                work email.
              </>
            }
          />
        )}

        {missingFields && (
          <AuthAlert tone="error" title="Missing details" body={missingFields} />
        )}

        {authFailure && !domainError && (
          <AuthAlert
            tone="error"
            title="Sign-in failed"
            body={authFailure}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 text-sm font-semibold text-white rounded-lg bg-m2-blue hover:bg-m2-blue-alt transition-colors disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
      </form>
    </AuthShell>
  );
}

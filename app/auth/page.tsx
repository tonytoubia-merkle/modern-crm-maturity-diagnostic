"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { validateAuthEmail } from "@/components/auth/authShared";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Passwordless sign-in: the magic link lands on /auth/callback, which also
// creates the account on first use, so there is no separate registration step.
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

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    if (error === "domain") setDomainError(true);
    if (error === "link") {
      setAuthFailure(
        "That sign-in link is invalid or has expired. Enter your email to get a new one."
      );
    }
  }, []);

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
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
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
              sign in. If it doesn&apos;t arrive in a minute or two, check
              your junk folder.
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

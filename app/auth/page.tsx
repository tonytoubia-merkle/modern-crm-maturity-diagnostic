"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { validateAuthEmail } from "@/components/auth/authShared";
import { AUTH_REDIRECT_KEY, safeRedirectPath } from "@/lib/auth/domains";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Passwordless sign-in. The email carries both a code (typed here) and a
// link to /auth/confirm; either one also creates the account on first use.
export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [domainError, setDomainError] = useState(false);
  const [authFailure, setAuthFailure] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const redirect = safeRedirectPath(
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect")
      : null
  );

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

  const handleSendEmail = async (e: React.FormEvent) => {
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
      localStorage.setItem(AUTH_REDIRECT_KEY, redirect);
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
        },
      });
      if (error) throw error;
      setEmailSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send sign-in email";
      setAuthFailure(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    const token = code.replace(/\s/g, "");
    if (!/^\d{6,10}$/.test(token)) {
      setMissingFields("Enter the code from your email.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token,
        type: "email",
      });
      if (error) throw error;
      window.location.href = redirect;
    } catch {
      setAuthFailure(
        "That code is incorrect or has expired. Check the latest email, or send a new one."
      );
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <AuthShell
        title="Check your email"
        subtitle={`We sent a sign-in email to ${email}.`}
      >
        <p className="text-sm text-slate-600 mb-3">
          Enter the code from the email below, or click the link in the email.
          If it doesn&apos;t arrive in a minute or two, check your junk folder.
        </p>

        <form noValidate onSubmit={handleVerifyCode} className="space-y-3">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Sign-in code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (authFailure || missingFields) clearAlerts();
            }}
            className="w-full text-center tracking-[0.3em] text-lg px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
          />

          {missingFields && (
            <AuthAlert tone="error" title="Missing code" body={missingFields} />
          )}

          {authFailure && (
            <AuthAlert tone="error" title="Sign-in failed" body={authFailure} />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 text-sm font-semibold text-white rounded-lg bg-m2-blue hover:bg-m2-blue-alt transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <button
          onClick={() => {
            setEmailSent(false);
            setCode("");
            clearAlerts();
          }}
          className="w-full mt-3 px-4 py-2.5 text-sm font-semibold text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Use a different email or resend
        </button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Enter your work email and we'll send you a sign-in code."
    >
      <p className="text-[11px] text-slate-400 mb-3 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
        Only <strong className="text-slate-600">@merkle.com</strong> and{" "}
        <strong className="text-slate-600">@dentsu.com</strong> email addresses
        are permitted.
      </p>

      <form noValidate onSubmit={handleSendEmail} className="space-y-3">
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
          <AuthAlert tone="error" title="Sign-in failed" body={authFailure} />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 text-sm font-semibold text-white rounded-lg bg-m2-blue hover:bg-m2-blue-alt transition-colors disabled:opacity-50"
        >
          {loading ? "Sending..." : "Email Me a Sign-In Code"}
        </button>
      </form>
    </AuthShell>
  );
}

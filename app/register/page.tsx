"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { PasswordInput } from "@/components/auth/PasswordInput";
import {
  GoogleAuthButton,
  OrDivider,
  validateAuthEmail,
} from "@/components/auth/authShared";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * /register — account creation. /login handles sign-in.
 *
 * Same custom-alert pattern as /login. Specific to register:
 *   - wrong domain      → amber "use @merkle.com or @dentsu.com"
 *   - already registered → blue "looks like you already have an
 *                          account — sign in" with a link to /login
 *   - generic failure   → red error card with the raw message
 *   - success           → green confirmation, "check your email"
 */
export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [domainError, setDomainError] = useState(false);
  const [authFailure, setAuthFailure] = useState<string | null>(null);
  const [validation, setValidation] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const redirect =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect") || "/"
      : "/";

  const loginHref = `/login?redirect=${encodeURIComponent(redirect)}`;

  const clearAlerts = () => {
    setDomainError(false);
    setAuthFailure(null);
    setValidation(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    if (!email.trim() || !password || !confirmPassword) {
      setValidation("Fill out all fields to create your account.");
      return;
    }

    const v = validateAuthEmail(email);
    if (!v.ok) {
      if (v.reason === "wrong_domain") setDomainError(true);
      else setValidation("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setValidation("The two passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setValidation("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
        },
      });
      if (error) throw error;

      // Supabase quirks: when email confirmation is on and the email
      // already exists, signUp returns success with a synthesized
      // "fake" user object whose `identities` array is empty. Detect
      // and surface the "already registered" alert instead of
      // pretending we sent a confirmation.
      const isExistingAccount =
        data?.user?.identities && data.user.identities.length === 0;
      if (isExistingAccount) {
        setAuthFailure("ALREADY_REGISTERED");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setAuthFailure(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    clearAlerts();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });
    if (error) setAuthFailure(error.message);
  };

  const isAlreadyRegistered =
    authFailure === "ALREADY_REGISTERED" ||
    (authFailure?.toLowerCase().includes("already registered") ?? false) ||
    (authFailure?.toLowerCase().includes("user already") ?? false);

  return (
    <AuthShell
      title="Create account"
      subtitle="Use your Merkle or dentsu email to create an account."
      footer={
        <>
          Already have an account?{" "}
          <a href={loginHref} className="text-m2-blue hover:underline">
            Sign in
          </a>
        </>
      }
    >
      <p className="text-[11px] text-slate-400 mb-3 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
        Only <strong className="text-slate-600">@merkle.com</strong> and{" "}
        <strong className="text-slate-600">@dentsu.com</strong> email addresses
        are permitted.
      </p>

      <form noValidate onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="you@merkle.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (domainError || authFailure || validation) clearAlerts();
          }}
          autoComplete="email"
          className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
        />
        <PasswordInput
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (authFailure || validation) clearAlerts();
          }}
          showPassword={showPw}
          onShowStart={() => setShowPw(true)}
          onShowEnd={() => setShowPw(false)}
          autoComplete="new-password"
        />
        <PasswordInput
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (authFailure || validation) clearAlerts();
          }}
          showPassword={showPw}
          onShowStart={() => setShowPw(true)}
          onShowEnd={() => setShowPw(false)}
          autoComplete="new-password"
        />

        {domainError && (
          <AuthAlert
            tone="domain"
            title="Use a Merkle or dentsu email"
            body={
              <>
                You can only register with <strong>@merkle.com</strong> or{" "}
                <strong>@dentsu.com</strong> addresses. Try again with your
                work email.
              </>
            }
          />
        )}

        {validation && (
          <AuthAlert tone="error" title="Check your details" body={validation} />
        )}

        {authFailure && !domainError && (
          isAlreadyRegistered ? (
            <AuthAlert
              tone="info"
              title="You already have an account"
              body={
                <>
                  An account with this email already exists. Sign in to
                  continue.
                </>
              }
              action={{ label: "Sign in", href: loginHref }}
            />
          ) : (
            <AuthAlert
              tone="error"
              title="Registration failed"
              body={authFailure}
            />
          )
        )}

        {success && (
          <AuthAlert
            tone="success"
            title="Check your email"
            body="We sent you a confirmation link. Open it to finish setting up your account, then sign in."
            action={{ label: "Go to sign in", href: loginHref }}
          />
        )}

        <button
          type="submit"
          disabled={loading || success}
          className="w-full px-4 py-2.5 text-sm font-semibold text-white rounded-lg bg-m2-blue hover:bg-m2-blue-alt transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "Create Account"}
        </button>
      </form>

      <OrDivider />

      <GoogleAuthButton
        onClick={handleGoogleAuth}
        label="Continue with Google"
      />
    </AuthShell>
  );
}

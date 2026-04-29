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
 * /login — sign-in only. /register handles account creation.
 *
 * Custom AuthAlert cards replace browser popups for the two surfaces
 * users see most often:
 *   - wrong domain  → amber "use @merkle.com or @dentsu.com"
 *   - account not   → blue "we couldn't sign you in — register?" with
 *     found / wrong   a link to /register (Supabase reports both as
 *     password        "Invalid login credentials" so we surface the
 *                     register CTA either way)
 *
 * The form has noValidate set and inputs do NOT use `required`/
 * `minLength` — we validate manually so native browser tooltips never
 * appear in place of our cards.
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [domainError, setDomainError] = useState(false);
  const [authFailure, setAuthFailure] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);

  const redirect =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect") || "/"
      : "/";

  const registerHref = `/register?redirect=${encodeURIComponent(redirect)}`;

  const clearAlerts = () => {
    setDomainError(false);
    setAuthFailure(null);
    setMissingFields(null);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    if (!email.trim() || !password) {
      setMissingFields("Enter your email and password to sign in.");
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
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      window.location.href = redirect;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
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

  // Map Supabase signin failures to a friendlier alert. Supabase returns
  // "Invalid login credentials" for both wrong-password and unknown-user
  // (intentionally — security best practice), so we surface a register CTA.
  const isInvalidCredentials =
    authFailure?.toLowerCase().includes("invalid login credentials") ||
    authFailure?.toLowerCase().includes("invalid_credentials") ||
    authFailure?.toLowerCase().includes("invalid email or password");

  return (
    <AuthShell
      title="Sign in"
      subtitle="Sign in to access the assessment workspace."
      footer={
        <>
          No account?{" "}
          <a href={registerHref} className="text-m2-blue hover:underline">
            Create one
          </a>
        </>
      }
    >
      <p className="text-[11px] text-slate-400 mb-3 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
        Only <strong className="text-slate-600">@merkle.com</strong> and{" "}
        <strong className="text-slate-600">@dentsu.com</strong> email addresses
        are permitted.
      </p>

      <form noValidate onSubmit={handleEmailAuth} className="space-y-3">
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
        <PasswordInput
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (authFailure || missingFields) clearAlerts();
          }}
          showPassword={showPw}
          onShowStart={() => setShowPw(true)}
          onShowEnd={() => setShowPw(false)}
          autoComplete="current-password"
        />

        {domainError && (
          <AuthAlert
            tone="domain"
            title="Use a Merkle or dentsu email"
            body={
              <>
                You can only sign in with{" "}
                <strong>@merkle.com</strong> or <strong>@dentsu.com</strong>{" "}
                addresses. Try again with your work email.
              </>
            }
          />
        )}

        {missingFields && (
          <AuthAlert tone="error" title="Missing details" body={missingFields} />
        )}

        {authFailure && !domainError && (
          isInvalidCredentials ? (
            <AuthAlert
              tone="info"
              title="We couldn't sign you in"
              body={
                <>
                  Either the password is wrong, or there&apos;s no account for
                  that email yet. If you haven&apos;t registered before,
                  create an account to continue.
                </>
              }
              action={{ label: "Create an account", href: registerHref }}
            />
          ) : (
            <AuthAlert
              tone="error"
              title="Sign-in failed"
              body={authFailure}
            />
          )
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 text-sm font-semibold text-white rounded-lg bg-m2-blue hover:bg-m2-blue-alt transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "Sign In"}
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

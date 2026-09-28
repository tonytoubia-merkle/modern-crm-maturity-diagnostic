"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthAlert } from "@/components/auth/AuthAlert";
import {
  DomainNotice,
  PasswordField,
  inputClass,
  useRedirectParam,
  primaryButtonClass,
  validateAuthEmail,
} from "@/components/auth/authShared";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [domainError, setDomainError] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirect = useRedirectParam();
  const registerHref =
    redirect === "/" ? "/register" : `/register?redirect=${encodeURIComponent(redirect)}`;

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error") === "domain") {
      setDomainError(true);
    }
  }, []);

  const clearAlerts = () => {
    setDomainError(false);
    setInvalidCredentials(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    if (!email.trim() || !password) {
      setError("Enter your email and password to sign in.");
      return;
    }
    const v = validateAuthEmail(email);
    if (!v.ok) {
      if (v.reason === "wrong_domain") setDomainError(true);
      else setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      if (/invalid/i.test(signInError.message)) setInvalidCredentials(true);
      else setError(signInError.message);
      setLoading(false);
      return;
    }
    window.location.href = redirect;
  };

  return (
    <AuthShell
      activeTab="login"
      redirect={redirect}
      title="Sign in"
      subtitle="Sign in to access the assessment workspace."
    >
      <DomainNotice />

      <form noValidate onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="you@merkle.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearAlerts();
          }}
          autoComplete="email"
          className={inputClass}
        />
        <PasswordField
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearAlerts();
          }}
          autoComplete="current-password"
          shown={showPassword}
          onToggle={() => setShowPassword((s) => !s)}
          toggleLabel={showPassword ? "Hide password" : "Show password"}
        />

        {domainError && (
          <AuthAlert
            tone="domain"
            title="Use a Merkle or dentsu email"
            body={
              <>
                You can only sign in with <strong>@merkle.com</strong> or{" "}
                <strong>@dentsu.com</strong> addresses.
              </>
            }
          />
        )}

        {invalidCredentials && (
          <AuthAlert
            tone="info"
            title="We couldn't sign you in"
            body="Either the password is wrong, or there's no account for that email yet. New here? Create an account."
            action={{ label: "Create an account", href: registerHref }}
          />
        )}

        {error && <AuthAlert tone="error" title="Sign-in failed" body={error} />}

        <button type="submit" disabled={loading} className={primaryButtonClass}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-sm text-slate-500 text-center mt-5">
        New here?{" "}
        <a href={registerHref} className="font-semibold text-m2-blue hover:underline">
          Create an account
        </a>
      </p>
    </AuthShell>
  );
}

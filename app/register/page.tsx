"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthAlert } from "@/components/auth/AuthAlert";
import {
  DomainNotice,
  MIN_PASSWORD_LENGTH,
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

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [domainError, setDomainError] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirect = useRedirectParam();
  const loginHref =
    redirect === "/" ? "/login" : `/login?redirect=${encodeURIComponent(redirect)}`;

  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const passwordsToggleLabel = showPasswords ? "Hide passwords" : "Show passwords";

  const clearAlerts = () => {
    setDomainError(false);
    setAlreadyRegistered(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    if (!email.trim() || !password || !confirmPassword) {
      setError("Fill out all fields to create your account.");
      return;
    }
    const v = validateAuthEmail(email);
    if (!v.ok) {
      if (v.reason === "wrong_domain") setDomainError(true);
      else setError("Please enter a valid email address.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.error === "exists") setAlreadyRegistered(true);
        else if (body.error === "domain") setDomainError(true);
        else if (body.error === "weak_password") setError(body.message || "Choose a stronger password.");
        else setError("We couldn't create your account. Please try again.");
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError("Your account was created, but signing in failed. Try signing in.");
        setLoading(false);
        return;
      }
      window.location.href = redirect;
    } catch {
      setError("We couldn't create your account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthShell
      activeTab="register"
      redirect={redirect}
      title="Create your account"
      subtitle="Use your Merkle or dentsu email and choose a password."
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
          placeholder={`Password (at least ${MIN_PASSWORD_LENGTH} characters)`}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearAlerts();
          }}
          autoComplete="new-password"
          shown={showPasswords}
          onToggle={() => setShowPasswords((s) => !s)}
          toggleLabel={passwordsToggleLabel}
        />
        <PasswordField
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            clearAlerts();
          }}
          autoComplete="new-password"
          shown={showPasswords}
          onToggle={() => setShowPasswords((s) => !s)}
          toggleLabel={passwordsToggleLabel}
          invalid={passwordsMismatch}
        />

        {passwordsMismatch && (
          <AuthAlert tone="error" title="Passwords don't match" body="Re-enter the same password in both fields." />
        )}

        {domainError && (
          <AuthAlert
            tone="domain"
            title="Use a Merkle or dentsu email"
            body={
              <>
                You can only register with <strong>@merkle.com</strong> or{" "}
                <strong>@dentsu.com</strong> addresses.
              </>
            }
          />
        )}

        {alreadyRegistered && (
          <AuthAlert
            tone="info"
            title="You already have an account"
            body="An account with this email already exists. Sign in instead."
            action={{ label: "Go to sign in", href: loginHref }}
          />
        )}

        {error && <AuthAlert tone="error" title="Check your details" body={error} />}

        <button type="submit" disabled={loading || passwordsMismatch} className={primaryButtonClass}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-sm text-slate-500 text-center mt-5">
        Already have an account?{" "}
        <a href={loginHref} className="font-semibold text-m2-blue hover:underline">
          Sign in
        </a>
      </p>
    </AuthShell>
  );
}

"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ALLOWED_DOMAINS = ["merkle.com", "dentsu.com"];

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

function PasswordInput({
  value,
  onChange,
  placeholder,
  required,
  minLength,
  showPassword,
  onShowStart,
  onShowEnd,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  minLength?: number;
  showPassword: boolean;
  onShowStart: () => void;
  onShowEnd: () => void;
}) {
  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 pr-10"
      />
      <button
        type="button"
        onMouseDown={onShowStart}
        onMouseUp={onShowEnd}
        onMouseLeave={onShowEnd}
        onTouchStart={onShowStart}
        onTouchEnd={onShowEnd}
        className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity select-none"
        tabIndex={-1}
      >
        <EyeIcon open={showPassword} />
      </button>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPw, setShowPw] = useState(false);

  const redirect = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("redirect") || "/"
    : "/";

  const validateEmail = (email: string): string | null => {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return "Please enter a valid email address.";
    if (!ALLOWED_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`))) {
      return "Only @merkle.com and @dentsu.com email addresses are allowed.";
    }
    return null;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validate email domain
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      // Validate passwords match
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }
    }

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
          },
        });
        if (error) throw error;
        setMessage("Check your email for a confirmation link.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = redirect;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f8f9fb" }}>
      <div className="w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/merkle-logo.webp" alt="Merkle" className="h-8 w-auto mx-auto mb-3" />
          <p className="text-xs text-slate-400">Modern CRM Diagnostic</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900 mb-1">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h1>
          <p className="text-sm text-slate-500 mb-5">
            {mode === "signin"
              ? "Sign in to access the diagnostic tool."
              : "Use your Merkle or dentsu email to create an account."}
          </p>

          {/* Email domain notice */}
          <p className="text-[11px] text-slate-400 mb-3 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
            Only <strong className="text-slate-600">@merkle.com</strong> and <strong className="text-slate-600">@dentsu.com</strong> email addresses are permitted.
          </p>

          {/* Email/password form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            <input
              type="email"
              placeholder="you@merkle.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
            <PasswordInput
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              showPassword={showPw}
              onShowStart={() => setShowPw(true)}
              onShowEnd={() => setShowPw(false)}
            />
            {mode === "signup" && (
              <PasswordInput
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                showPassword={showPw}
                onShowStart={() => setShowPw(true)}
                onShowEnd={() => setShowPw(false)}
              />
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}
            {message && <p className="text-xs text-green-600">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#00205B" }}
            >
              {loading ? "..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-xs text-slate-400 text-center mt-4">
            {mode === "signin" ? (
              <>
                No account?{" "}
                <button onClick={() => { setMode("signup"); setError(""); setMessage(""); }} className="text-blue-600 hover:underline">
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => { setMode("signin"); setError(""); setMessage(""); }} className="text-blue-600 hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

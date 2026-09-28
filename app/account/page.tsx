"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { M2Logo } from "@/components/brand/M2Logo";
import { AuthAlert } from "@/components/auth/AuthAlert";
import {
  MIN_PASSWORD_LENGTH,
  PasswordField,
  primaryButtonClass,
} from "@/components/auth/authShared";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AccountPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const tooShort = newPassword.length > 0 && newPassword.length < MIN_PASSWORD_LENGTH;
  const canSubmit =
    !!email &&
    currentPassword.length > 0 &&
    newPassword.length >= MIN_PASSWORD_LENGTH &&
    newPassword === confirmPassword &&
    !busy;
  const newToggleLabel = showNew ? "Hide new passwords" : "Show new passwords";

  const clearMessages = () => {
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !email) return;
    setBusy(true);
    clearMessages();

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });
    if (verifyError) {
      setError("Your current password is incorrect.");
      setBusy(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      setError(updateError.message);
      setBusy(false);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccess(true);
    setBusy(false);
  };

  return (
    <div className="min-h-screen font-m2 bg-m2-surface-light">
      <header className="bg-m2-navy">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" aria-label="Home">
            <M2Logo tone="dark" height={44} />
          </a>
          <a href="/" className="text-xs text-white/70 hover:text-white">
            ← Back to diagnostics
          </a>
        </div>
      </header>

      <main className="max-w-sm mx-auto px-4 py-10">
        <h1 className="text-xl font-bold text-m2-text mb-1">Your account</h1>
        {email && <p className="text-sm text-slate-500 mb-6">{email}</p>}

        <form
          noValidate
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3"
        >
          <h2 className="text-sm font-bold text-slate-900">Change password</h2>

          <PasswordField
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              clearMessages();
            }}
            autoComplete="current-password"
            shown={showCurrent}
            onToggle={() => setShowCurrent((s) => !s)}
            toggleLabel={showCurrent ? "Hide current password" : "Show current password"}
          />
          <PasswordField
            placeholder={`New password (at least ${MIN_PASSWORD_LENGTH} characters)`}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              clearMessages();
            }}
            autoComplete="new-password"
            shown={showNew}
            onToggle={() => setShowNew((s) => !s)}
            toggleLabel={newToggleLabel}
            invalid={tooShort}
          />
          <PasswordField
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearMessages();
            }}
            autoComplete="new-password"
            shown={showNew}
            onToggle={() => setShowNew((s) => !s)}
            toggleLabel={newToggleLabel}
            invalid={mismatch}
          />

          {tooShort && (
            <AuthAlert
              tone="error"
              title="Password too short"
              body={`Use at least ${MIN_PASSWORD_LENGTH} characters.`}
            />
          )}
          {mismatch && (
            <AuthAlert
              tone="error"
              title="Passwords don't match"
              body="Re-enter the same new password in both fields."
            />
          )}
          {error && <AuthAlert tone="error" title="Couldn't change password" body={error} />}
          {success && (
            <AuthAlert tone="success" title="Password changed" body="Use your new password next time you sign in." />
          )}

          <button type="submit" disabled={!canSubmit} className={primaryButtonClass}>
            {busy ? "Saving..." : "Change Password"}
          </button>
        </form>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  MIN_PASSWORD_LENGTH,
  PasswordField,
  inputClass,
} from "@/components/auth/authShared";

export function SetPasswordModal({
  initialEmail,
  onClose,
  onDone,
}: {
  initialEmail: string | null;
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const [email, setEmail] = useState(initialEmail ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shown, setShown] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const tooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH;
  const canSubmit =
    email.includes("@") &&
    password.length >= MIN_PASSWORD_LENGTH &&
    password === confirmPassword &&
    !busy;
  const toggleLabel = shown ? "Hide passwords" : "Show passwords";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    const target = email.trim().toLowerCase();
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(target)}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Failed to set password.");
        setBusy(false);
        return;
      }
      onDone(
        body.created
          ? `Created an account for ${target} with that password.`
          : `Password updated for ${target}.`
      );
    } catch {
      setError("Failed to set password.");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => !busy && onClose()}
      />
      <form
        noValidate
        onSubmit={submit}
        className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm mx-4 p-6 space-y-3"
      >
        <h3 className="text-base font-bold text-slate-900">Set password</h3>
        <p className="text-xs text-slate-500">
          Replaces the user&apos;s current password. If they don&apos;t have an
          account yet, one is created. Share the password with them securely.
        </p>

        {initialEmail ? (
          <p className="text-sm font-semibold text-slate-700">{initialEmail}</p>
        ) : (
          <input
            type="email"
            placeholder="someone@merkle.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            autoFocus
          />
        )}

        <PasswordField
          placeholder={`New password (at least ${MIN_PASSWORD_LENGTH} characters)`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          shown={shown}
          onToggle={() => setShown((s) => !s)}
          toggleLabel={toggleLabel}
          invalid={tooShort}
        />
        <PasswordField
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          shown={shown}
          onToggle={() => setShown((s) => !s)}
          toggleLabel={toggleLabel}
          invalid={mismatch}
        />

        {tooShort && (
          <p className="text-xs text-red-600">
            Password must be at least {MIN_PASSWORD_LENGTH} characters.
          </p>
        )}
        {mismatch && <p className="text-xs text-red-600">Passwords don&apos;t match.</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#0328d1" }}
          >
            {busy ? "Saving…" : "Set password"}
          </button>
        </div>
      </form>
    </div>
  );
}

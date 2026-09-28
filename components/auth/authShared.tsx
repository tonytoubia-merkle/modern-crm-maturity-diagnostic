"use client";

import { useEffect, useState } from "react";
import { isAllowedEmail, safeRedirectPath } from "@/lib/auth/domains";

// Read after mount: these pages are prerendered, and hydration keeps the
// server-rendered link hrefs, which would drop ?redirect=.
export function useRedirectParam(): string {
  const [redirect, setRedirect] = useState("/");
  useEffect(() => {
    setRedirect(
      safeRedirectPath(new URLSearchParams(window.location.search).get("redirect"))
    );
  }, []);
  return redirect;
}

export const MIN_PASSWORD_LENGTH = 8;

export function validateAuthEmail(
  email: string
): { ok: true } | { ok: false; reason: "missing" | "wrong_domain" } {
  const trimmed = email.trim();
  if (!trimmed || !trimmed.split("@")[1]) return { ok: false, reason: "missing" };
  if (!isAllowedEmail(trimmed)) return { ok: false, reason: "wrong_domain" };
  return { ok: true };
}

export const inputClass =
  "w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400";

export const primaryButtonClass =
  "w-full px-4 py-2.5 text-sm font-semibold text-white rounded-lg bg-m2-blue hover:bg-m2-blue-alt transition-colors disabled:opacity-50";

export function DomainNotice() {
  return (
    <p className="text-[11px] text-slate-400 mb-3 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
      Only <strong className="text-slate-600">@merkle.com</strong> and{" "}
      <strong className="text-slate-600">@dentsu.com</strong> email addresses
      are permitted.
    </p>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <line x1="3" y1="3" x2="21" y2="21" />}
    </svg>
  );
}

export function PasswordField({
  shown,
  onToggle,
  toggleLabel,
  invalid,
  ...inputProps
}: {
  shown: boolean;
  onToggle: () => void;
  toggleLabel: string;
  invalid?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <div className="relative">
      <input
        {...inputProps}
        type={shown ? "text" : "password"}
        aria-invalid={invalid || undefined}
        className={`${inputClass} pr-10 ${invalid ? "border-red-300 focus:border-red-400" : ""}`}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={toggleLabel}
        aria-pressed={shown}
        title={toggleLabel}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-700"
      >
        <EyeIcon open={shown} />
      </button>
    </div>
  );
}

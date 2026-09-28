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

export function ShowPasswordsToggle({
  shown,
  onToggle,
  plural,
}: {
  shown: boolean;
  onToggle: () => void;
  plural?: boolean;
}) {
  const noun = plural ? "passwords" : "password";
  return (
    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={shown}
        onChange={onToggle}
        className="h-3.5 w-3.5 rounded border-slate-300 accent-m2-blue"
      />
      Show {noun}
    </label>
  );
}

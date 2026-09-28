"use client";

import { isAllowedEmail } from "@/lib/auth/domains";

export function validateAuthEmail(
  email: string
): { ok: true } | { ok: false; reason: "missing" | "wrong_domain" } {
  const trimmed = email.trim();
  if (!trimmed || !trimmed.split("@")[1]) return { ok: false, reason: "missing" };
  if (!isAllowedEmail(trimmed)) return { ok: false, reason: "wrong_domain" };
  return { ok: true };
}

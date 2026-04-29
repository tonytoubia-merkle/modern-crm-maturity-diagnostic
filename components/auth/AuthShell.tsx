"use client";

import { M2Logo } from "@/components/brand/M2Logo";

/**
 * Shared M2-branded shell for /login and /register. Keeps the visual
 * frame consistent across both surfaces so the auth flow feels like
 * one product even though it spans two URLs.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center font-m2 bg-m2-surface-light">
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <M2Logo tone="light" height={52} />
          </div>
          <p className="text-xs text-slate-500">Merkle Maturity Assessment</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-xl font-bold text-m2-text mb-1">{title}</h1>
          <p className="text-sm text-slate-500 mb-5">{subtitle}</p>
          {children}
        </div>

        {footer && (
          <p className="text-xs text-slate-400 text-center mt-4">{footer}</p>
        )}
      </div>
    </div>
  );
}

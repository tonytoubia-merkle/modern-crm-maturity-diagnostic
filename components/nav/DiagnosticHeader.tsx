"use client";

import { useState } from "react";
import { M2Logo } from "@/components/brand/M2Logo";

/**
 * Shared M2-branded header for the diagnostic home pages
 * (/crm, /csc, /b2b, /aicx, /aient). Renders:
 *
 *   1. M2 logo
 *   2. Cross-diagnostic links – Modern CRM, Content Supply Chain,
 *      B2B Transformation, AI for CX, AI for Enterprise. The current
 *      page is bolded / fully-white; the others are dim links.
 *   3. Utility links – Guide, Library, Badges (yellow), Admin, About.
 *   4. Profile bubble with Badges + Sign out menu.
 *
 * Kept as a single component so the diagnostic homes can't drift out
 * of sync as new diagnostics or utility links are added.
 */

type Diagnostic = "crm" | "csc" | "b2b" | "aicx" | "aient";

const DIAGNOSTICS: Array<{
  key: Diagnostic;
  href: string;
  label: string;
}> = [
  { key: "crm", href: "/crm", label: "Modern CRM" },
  { key: "csc", href: "/csc", label: "Content Supply Chain" },
  { key: "b2b", href: "/b2b", label: "B2B Transformation" },
  { key: "aicx", href: "/aicx", label: "AI for CX" },
  { key: "aient", href: "/aient", label: "AI for Enterprise" },
];

interface DiagnosticHeaderProps {
  current: Diagnostic;
  user: { email?: string; name?: string } | null;
  onSignOut: () => void;
}

export function DiagnosticHeader({
  current,
  user,
  onSignOut,
}: DiagnosticHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header className="bg-m2-navy">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <M2Logo tone="dark" height={44} />
        <div className="flex items-center gap-5 flex-wrap justify-end">
          {/* Diagnostic switcher – current is bolded */}
          {DIAGNOSTICS.map((d) =>
            d.key === current ? (
              <span
                key={d.key}
                className="text-xs text-white font-semibold"
                aria-current="page"
              >
                {d.label}
              </span>
            ) : (
              <a
                key={d.key}
                href={d.href}
                className="text-xs text-white/60 hover:text-white transition-colors"
              >
                {d.label}
              </a>
            )
          )}

          {/* Subtle divider before utility nav */}
          <span className="text-white/20" aria-hidden>
            |
          </span>

          {/* Utility nav */}
          <a
            href="/guide"
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            Guide
          </a>
          <a
            href="/library"
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            Library
          </a>
          <a
            href="/badges"
            className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            Badges
          </a>
          <a
            href="/admin"
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            Admin
          </a>
          <a
            href="/about"
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            About
          </a>

          {/* Profile bubble */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white hover:bg-white/30 transition-colors"
                aria-label="Open profile menu"
              >
                {initials}
              </button>
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 z-40">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <a
                      href="/badges"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Badges
                    </a>
                    <button
                      onClick={onSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

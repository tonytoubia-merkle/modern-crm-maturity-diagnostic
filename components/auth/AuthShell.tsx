"use client";

import { M2Logo } from "@/components/brand/M2Logo";

export type AuthTab = "login" | "register";

function withRedirect(path: string, redirect: string) {
  return redirect === "/" ? path : `${path}?redirect=${encodeURIComponent(redirect)}`;
}

export function AuthShell({
  activeTab,
  redirect,
  title,
  subtitle,
  children,
}: {
  activeTab: AuthTab;
  redirect: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const tabs: { id: AuthTab; label: string; href: string }[] = [
    { id: "login", label: "Sign in", href: withRedirect("/login", redirect) },
    { id: "register", label: "Create account", href: withRedirect("/register", redirect) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center font-m2 bg-m2-surface-light">
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <M2Logo tone="light" height={52} />
          </div>
          <p className="text-xs text-slate-500">Merkle Maturity Assessment</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <nav className="grid grid-cols-2 border-b border-slate-200" aria-label="Account">
            {tabs.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <a
                  key={tab.id}
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={`py-3 text-center text-sm font-semibold transition-colors ${
                    active
                      ? "text-m2-blue border-b-2 border-m2-blue -mb-px bg-white"
                      : "text-slate-500 hover:text-slate-800 bg-slate-50"
                  }`}
                >
                  {tab.label}
                </a>
              );
            })}
          </nav>

          <div className="p-6">
            <h1 className="text-xl font-bold text-m2-text mb-1">{title}</h1>
            <p className="text-sm text-slate-500 mb-5">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { M2Logo } from "@/components/brand/M2Logo";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ChooserHome() {
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(
    null
  );
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          email: data.user.email,
          name:
            data.user.user_metadata?.full_name ||
            data.user.email?.split("@")[0],
        });
      }
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="min-h-screen font-m2 bg-m2-surface-light">
      <header className="bg-m2-navy">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <M2Logo tone="dark" height={32} />
          <div className="flex items-center gap-5">
            <a
              href="/about"
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="/admin"
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Admin
            </a>
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white hover:bg-white/30 transition-colors"
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
                      <button
                        onClick={handleSignOut}
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

      <section className="bg-m2-navy">
        <div className="max-w-5xl mx-auto px-6 pt-14 pb-20">
          <p className="text-sm font-medium text-m2-sky mb-3">
            Merkle Maturity Assessment
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
            Which diagnostic?
          </h1>
          <p className="text-base text-white/70 leading-relaxed max-w-2xl">
            Two separate diagnostics share this workspace. Pick the one you&apos;re
            running — each has its own assessments, projects, and scoring model.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChooserCard
            href="/crm"
            eyebrow="Modern CRM Practice"
            title="Modern CRM Maturity"
            description="Assess CRM maturity across eight capabilities. Distribute stakeholder surveys, aggregate results, and generate workshop agendas with Merkle-grounded opportunities and vignettes."
            ctaLabel="Open Modern CRM"
          />
          <ChooserCard
            href="/csc"
            eyebrow="Content Practice"
            title="Content Supply Chain"
            description="Assess CSC maturity across six capabilities — strategy, workflow, asset governance, distribution, measurement, and AI. Run single respondents or multi-stakeholder workshops."
            ctaLabel="Open Content Supply Chain"
          />
        </div>
      </div>

      <footer className="border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/merkle-logo.webp"
              alt="Merkle"
              className="h-4 w-auto opacity-40"
            />
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Merkle
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="/about"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              About
            </a>
            <a
              href="/admin"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Admin
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ChooserCard({
  href,
  eyebrow,
  title,
  description,
  ctaLabel,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
}) {
  return (
    <a
      href={href}
      className="group bg-white border border-slate-200 rounded-2xl p-8 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col"
    >
      <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-m2-blue">
        {eyebrow}
      </p>
      <h2 className="text-xl font-bold text-m2-text mb-3">{title}</h2>
      <p className="text-sm text-slate-600 leading-relaxed flex-1">
        {description}
      </p>
      <div className="mt-6 inline-flex items-center text-sm font-semibold text-m2-text group-hover:gap-2 transition-all">
        {ctaLabel}
        <span className="ml-1.5 group-hover:translate-x-0.5 transition-transform">
          →
        </span>
      </div>
    </a>
  );
}

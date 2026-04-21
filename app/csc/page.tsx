"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AssessmentRow = {
  key: string;
  name: string;
  href: string;
  score: number | null;
  status: string;
  date: string;
  respondent?: string;
  repEmail?: string | null;
};

type Scope = "mine" | "all";

export default function CscHomePage() {
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(
    null
  );
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mine, setMine] = useState<AssessmentRow[]>([]);
  const [all, setAll] = useState<AssessmentRow[] | null>(null);
  const [scope, setScope] = useState<Scope>("mine");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          email: data.user.email,
          name:
            data.user.user_metadata?.full_name ||
            data.user.email?.split("@")[0],
        });
        loadAssessments(data.user.email || "");
      } else {
        setLoading(false);
      }
    });
  }, []);

  const toRow = (a: Record<string, string | number | null>): AssessmentRow => ({
    key: a.id as string,
    name: a.client_name as string,
    href:
      a.status === "completed"
        ? `/csc/results/${a.share_id}`
        : `/csc/assessment/resume/${a.share_id}`,
    score: a.overall_score as number | null,
    status: a.status as string,
    date: a.created_at as string,
    respondent: (a.respondent_name as string) ?? undefined,
    repEmail: (a.rep_email as string | null) ?? null,
  });

  const loadAssessments = async (email: string) => {
    setLoading(true);
    try {
      // Fetch the user's own list and the admin list in parallel. The
      // admin call returns 403 for non-admins; we quietly fall back to
      // hiding the All toggle in that case.
      const [mineRes, adminRes] = await Promise.all([
        fetch(`/api/csc/assessments?repEmail=${encodeURIComponent(email)}`),
        fetch("/api/csc/assessments?admin=1"),
      ]);
      const mineData = mineRes.ok ? await mineRes.json() : [];
      setMine(mineData.map(toRow));

      if (adminRes.ok) {
        const adminData = await adminRes.json();
        setAll(adminData.map(toRow));
      } else {
        setAll(null);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const isCscAdmin = all !== null;
  const visible = scope === "all" && all ? all : mine;

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
    <div className="min-h-screen" style={{ backgroundColor: "#f8f9fb" }}>
      <header style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/merkle-logo.webp"
            alt="Merkle"
            className="h-6 w-auto brightness-0 invert"
          />
          <div className="flex items-center gap-5">
            <a
              href="/"
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Modern CRM
            </a>
            <span className="text-xs text-white font-semibold">
              Content Supply Chain
            </span>
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

      <section style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-16">
          <p className="text-sm font-medium text-white/50 mb-3">
            Merkle Content Practice
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
            Content Supply Chain Diagnostic
          </h1>
          <p className="text-base text-white/70 leading-relaxed max-w-2xl mb-8">
            Assess how effectively your organization turns creative ideas into
            personalized content at scale — from strategy and production through
            intelligence, activation, and measurement.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/csc/assessment/new"
              className="inline-flex items-center px-6 py-3 text-sm font-semibold rounded-lg transition-colors hover:bg-white/90"
              style={{ backgroundColor: "white", color: "#00205B" }}
            >
              Start Assessment
            </a>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 text-sm font-semibold rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              Switch to Modern CRM
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Assess</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              45 questions across six content supply chain capabilities —
              Strategy &amp; Planning, Workflow &amp; Production, Asset Management
              &amp; Governance, Distribution &amp; Activation, Measurement
              &amp; Insights, and Intelligence &amp; Automation.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">
              Generate
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Maturity scores, a stage classification, and prioritized
              opportunities across modular content, DAM, AI-assisted production,
              and dynamic activation.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">
              Activate
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Salesforce-ready account narrative, pipeline table, and
              individual opportunity records — plus shareable results for
              client conversations.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <h3 className="text-sm font-bold text-slate-900">
              {scope === "all" ? "All CSC Assessments" : "Your CSC Assessments"}
            </h3>
            {isCscAdmin && (
              <div className="inline-flex rounded-full border border-slate-200 bg-white p-0.5 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setScope("mine")}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    scope === "mine"
                      ? "bg-slate-100 text-slate-800"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  aria-pressed={scope === "mine"}
                >
                  Mine ({mine.length})
                </button>
                <button
                  type="button"
                  onClick={() => setScope("all")}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    scope === "all"
                      ? "bg-slate-100 text-slate-800"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  aria-pressed={scope === "all"}
                >
                  All ({all?.length ?? 0})
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center gap-2 py-4">
              <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-400">
                Loading assessments...
              </span>
            </div>
          ) : visible.length > 0 ? (
            <div className="space-y-1">
              {visible.map((r) => (
                <a
                  key={r.key}
                  href={r.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {r.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      CSC · {new Date(r.date).toLocaleDateString()}
                      {scope === "all" && r.respondent && ` · ${r.respondent}`}
                      {scope === "all" && r.repEmail && ` · ${r.repEmail}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {r.score && (
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "#00205B" }}
                      >
                        {Number(r.score).toFixed(1)}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        r.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {r.status === "completed" ? "Done" : "Active"}
                    </span>
                    <span className="text-slate-300 group-hover:text-slate-500 transition-colors">
                      →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-slate-500 mb-1">
                {scope === "all" ? "No CSC assessments yet." : "No assessments yet"}
              </p>
              <p className="text-xs text-slate-400">
                Run a{" "}
                <a
                  href="/csc/assessment/new"
                  className="text-blue-600 hover:underline"
                >
                  new CSC assessment
                </a>{" "}
                to get started.
              </p>
            </div>
          )}
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
              href="/"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Modern CRM
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

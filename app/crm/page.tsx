"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ProjectRow = {
  key: string;
  name: string;
  href: string;
  label: string;
  score: number | null;
  status: string;
  date: string;
  respondent?: string;
  repEmail?: string | null;
};

type Scope = "mine" | "all";

export default function HomePage() {
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mine, setMine] = useState<ProjectRow[]>([]);
  const [all, setAll] = useState<ProjectRow[] | null>(null);
  const [scope, setScope] = useState<Scope>("mine");
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0],
        });
        loadProjects(data.user.email || "");
      }
    });
  }, []);

  const toProjectRow = (p: Record<string, string | number | null>): ProjectRow => ({
    key: p.id as string,
    name: p.client_name as string,
    href: `/crm/project/${p.share_id}`,
    label: p.mode === "workshop" ? "Workshop" : "Quick",
    score: p.aggregated_overall as number | null,
    status: p.status as string,
    date: p.created_at as string,
    respondent: (p.created_by_name as string) ?? undefined,
    repEmail: (p.created_by_email as string | null) ?? null,
  });

  const toAssessmentRow = (a: Record<string, string | number | null>): ProjectRow => ({
    key: a.id as string,
    name: a.client_name as string,
    href:
      a.status === "completed"
        ? `/results/${a.share_id}`
        : `/crm/assessment/resume/${a.share_id}`,
    label: "Assessment",
    score: a.overall_score as number | null,
    status: a.status as string,
    date: a.created_at as string,
    respondent: (a.respondent_name as string) ?? undefined,
    repEmail: (a.rep_email as string | null) ?? null,
  });

  const loadProjects = async (email: string) => {
    setLoadingProjects(true);
    try {
      // Fire own + admin requests in parallel. Admin requests 403 for
      // non-CRM-admins; we quietly fall back to hiding the All toggle.
      const [pMine, aMine, pAll, aAll] = await Promise.all([
        fetch(`/api/projects?email=${encodeURIComponent(email)}`),
        fetch(`/api/assessments?repEmail=${encodeURIComponent(email)}`),
        fetch("/api/projects?admin=1"),
        fetch("/api/assessments?admin=1"),
      ]);

      const projectsMine = pMine.ok ? await pMine.json() : [];
      const assessmentsMine = aMine.ok ? await aMine.json() : [];
      const standaloneMine = assessmentsMine.filter(
        (x: { project_id: string | null }) => !x.project_id
      );
      setMine([
        ...projectsMine.map(toProjectRow),
        ...standaloneMine.map(toAssessmentRow),
      ]);

      if (pAll.ok && aAll.ok) {
        const projectsAll = await pAll.json();
        const assessmentsAll = await aAll.json();
        const standaloneAll = assessmentsAll.filter(
          (x: { project_id: string | null }) => !x.project_id
        );
        setAll([
          ...projectsAll.map(toProjectRow),
          ...standaloneAll.map(toAssessmentRow),
        ]);
      } else {
        setAll(null);
      }
    } catch {
      // Silently fail
    } finally {
      setLoadingProjects(false);
    }
  };

  const isCrmAdmin = all !== null;
  const visible = scope === "all" && all ? all : mine;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f9fb" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/merkle-logo.webp" alt="Merkle" className="h-6 w-auto brightness-0 invert" />
          <div className="flex items-center gap-5">
            <a href="/guide" className="text-xs text-white/60 hover:text-white transition-colors">Guide</a>
            <a href="/library" className="text-xs text-white/60 hover:text-white transition-colors">Library</a>
            <a href="/badges" className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors">Badges</a>
            <a href="/csc" className="text-xs text-white/60 hover:text-white transition-colors">CSC Diagnostic</a>
            <a href="/admin" className="text-xs text-white/60 hover:text-white transition-colors">Admin</a>
            <a href="/about" className="text-xs text-white/60 hover:text-white transition-colors">About</a>

            {/* Profile bubble */}
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
                    <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 z-40">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      <a href="/badges" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        Badges
                      </a>
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

      {/* Hero */}
      <section style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-16">
          <p className="text-sm font-medium text-white/50 mb-3">Merkle CRM Practice</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
            Modern CRM Maturity Diagnostic
          </h1>
          <p className="text-base text-white/70 leading-relaxed max-w-2xl mb-8">
            Assess client CRM maturity, generate strategic opportunities, and build
            structured workshop agendas — from diagnostic to pipeline in one workflow.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/crm/project/new"
              className="inline-flex items-center px-6 py-3 text-sm font-semibold rounded-lg transition-colors hover:bg-white/90"
              style={{ backgroundColor: "white", color: "#00205B" }}
            >
              New Project
            </a>
            <div className="relative group">
              <a
                href="/crm/assessment/new"
                className="inline-flex items-center px-6 py-3 text-sm font-semibold rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                Quick Assessment
              </a>
              <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                <a href="/crm/assessment/new" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-t-lg transition-colors">
                  <span className="font-medium">Manual Survey</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">30 questions, step by step</span>
                </a>
                <a href="/crm/assessment/chat" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-b-lg border-t border-slate-100 transition-colors">
                  <span className="font-medium">Conversational AI</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">Natural dialogue with voice support</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Three columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Assess</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              30 questions across eight capability dimensions. Distribute
              surveys to multiple stakeholders or complete independently.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Generate</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Aggregated maturity scores, strategic opportunities, workshop
              agendas with facilitation guides, and Miro boards.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Activate</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Salesforce-ready opportunity records, branded PPTX exports,
              shareable results, and a complete workshop toolkit.
            </p>
          </div>
        </div>

        {/* Projects + standalone assessments — auto-loaded */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <h3 className="text-sm font-bold text-slate-900">
              {scope === "all" ? "All Projects" : "Your Projects"}
            </h3>
            {isCrmAdmin && (
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

          {loadingProjects ? (
            <div className="flex items-center gap-2 py-4">
              <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-400">Loading your projects...</span>
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
                    <p className="text-sm font-medium text-slate-900 truncate">{r.name}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {r.label} · {new Date(r.date).toLocaleDateString()}
                      {scope === "all" && r.respondent && ` · ${r.respondent}`}
                      {scope === "all" && r.repEmail && ` · ${r.repEmail}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {r.score && (
                      <span className="text-xs font-semibold" style={{ color: "#00205B" }}>
                        {Number(r.score).toFixed(1)}
                      </span>
                    )}
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      r.status === "completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {r.status === "completed" ? "Done" : "Active"}
                    </span>
                    <span className="text-slate-300 group-hover:text-slate-500 transition-colors">→</span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-slate-500 mb-1">
                {scope === "all" ? "No projects yet." : "No projects yet"}
              </p>
              <p className="text-xs text-slate-400">
                Create a <a href="/crm/project/new" className="text-blue-600 hover:underline">new project</a> or run a{" "}
                <a href="/crm/assessment/new" className="text-blue-600 hover:underline">quick assessment</a> to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/merkle-logo.webp" alt="Merkle" className="h-4 w-auto opacity-40" />
            <p className="text-xs text-slate-400">© {new Date().getFullYear()} Merkle</p>
          </div>
          <div className="flex gap-4">
            <a href="/library" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Library</a>
            <a href="/admin" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Admin</a>
            <a href="/about" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

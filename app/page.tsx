"use client";

import { useState } from "react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [showRetrieve, setShowRetrieve] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<
    Array<{
      id: string;
      share_id: string;
      client_name: string;
      mode: string;
      status: string;
      aggregated_overall: number | null;
      created_at: string;
    }>
  >([]);
  const [assessments, setAssessments] = useState<
    Array<{
      id: string;
      share_id: string;
      client_name: string;
      status: string;
      overall_score: number | null;
      created_at: string;
      project_id: string | null;
    }>
  >([]);
  const [error, setError] = useState("");

  const handleRetrieve = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const [pRes, aRes] = await Promise.all([
        fetch(`/api/projects?email=${encodeURIComponent(email)}`),
        fetch(`/api/assessments?repEmail=${encodeURIComponent(email)}`),
      ]);
      const p = pRes.ok ? await pRes.json() : [];
      const a = aRes.ok ? await aRes.json() : [];
      const standalone = a.filter((x: { project_id: string | null }) => !x.project_id);
      setProjects(p);
      setAssessments(standalone);
      if (p.length === 0 && standalone.length === 0) {
        setError("No projects found for this email.");
      }
    } catch {
      setError("Unable to retrieve. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const results = [...projects.map((p) => ({
    key: p.id,
    name: p.client_name,
    href: `/project/${p.share_id}`,
    label: p.mode === "workshop" ? "Workshop" : "Quick",
    score: p.aggregated_overall,
    status: p.status,
    date: p.created_at,
  })), ...assessments.map((a) => ({
    key: a.id,
    name: a.client_name,
    href: `/results/${a.share_id}`,
    label: "Assessment",
    score: a.overall_score,
    status: a.status,
    date: a.created_at,
  }))];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="max-w-4xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/merkle-logo.webp" alt="Merkle" className="h-7 w-auto" />
        <div className="flex items-center gap-6">
          <a href="/library" className="text-xs tracking-wide uppercase text-slate-400 hover:text-slate-700 transition-colors">
            Library
          </a>
          <a href="/admin" className="text-xs tracking-wide uppercase text-slate-400 hover:text-slate-700 transition-colors">
            Admin
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-6" style={{ color: "#00205B" }}>
          Modern CRM<br />Maturity Diagnostic
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed max-w-xl mb-12">
          Assess CRM maturity across eight capability dimensions. Generate
          strategic opportunities, workshop agendas, and pipeline-ready outputs.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-16">
          <a
            href="/project/new"
            className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: "#00205B" }}
          >
            New Project
          </a>
          <a
            href="/assessment/new"
            className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-lg border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Quick Assessment
          </a>
        </div>

        {/* Retrieve */}
        <div className="border-t border-slate-100 pt-8">
          {!showRetrieve ? (
            <button
              onClick={() => setShowRetrieve(true)}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Retrieve an existing project
            </button>
          ) : (
            <div className="max-w-md">
              <form onSubmit={handleRetrieve} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your Merkle email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 text-sm px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50 hover:opacity-90"
                  style={{ backgroundColor: "#00205B" }}
                >
                  {loading ? "..." : "Find"}
                </button>
              </form>
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              {results.length > 0 && (
                <div className="mt-4 space-y-1.5">
                  {results.map((r) => (
                    <a
                      key={r.key}
                      href={r.href}
                      className="flex items-center justify-between px-4 py-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors group"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">{r.name}</p>
                        <p className="text-xs text-slate-400">
                          {r.label} · {new Date(r.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {r.score && (
                          <span className="text-xs font-semibold text-slate-600">
                            {r.score.toFixed(1)}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors">→</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* What it does — minimal */}
      <section className="border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Assess</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                30 questions across Identity, Signals, Decisioning, Engagement,
                Media, Optimization, Technology, and Organization. Distribute
                surveys to multiple stakeholders or complete solo.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Generate</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Aggregated maturity scores, prioritized strategic opportunities,
                structured workshop agendas with facilitation guides, and
                auto-generated Miro boards.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Activate</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Salesforce-ready opportunity records, branded PPTX exports,
                shareable results links, and a complete workshop facilitation
                toolkit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <p className="text-xs text-slate-300">
            © {new Date().getFullYear()} Merkle
          </p>
          <div className="flex gap-4">
            <a href="/library" className="text-xs text-slate-300 hover:text-slate-500 transition-colors">Library</a>
            <a href="/admin" className="text-xs text-slate-300 hover:text-slate-500 transition-colors">Admin</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

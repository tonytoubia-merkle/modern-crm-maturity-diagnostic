"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";
import { MATURITY_STAGES } from "@/lib/scoring";
import { CSC_MATURITY_STAGES } from "@/lib/csc/scoring";
import { INDUSTRY_LABELS } from "@/lib/data/questions";
import type { MaturityStage } from "@/lib/types";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AssessmentKind = "crm" | "csc";

interface AssessmentRow {
  id: string;
  share_id: string;
  client_name: string;
  client_company: string;
  respondent_name: string;
  rep_email: string | null;
  status: string;
  industry: string | null;
  overall_score: number | null;
  maturity_stage: number | null;
  created_at: string;
  updated_at: string;
  /** Present on CRM rows only; null on CSC (no project concept). */
  project_id?: string | null;
  /** Added client-side when we merge CRM + CSC admin data for /admin. */
  kind: AssessmentKind;
}

const STAGE_BADGES: Record<
  number,
  { bg: string; text: string }
> = {
  1: { bg: "bg-red-100", text: "text-red-700" },
  2: { bg: "bg-amber-100", text: "text-amber-700" },
  3: { bg: "bg-blue-100", text: "text-blue-700" },
  4: { bg: "bg-green-100", text: "text-green-700" },
};

interface ProjectRow {
  id: string;
  share_id: string;
  client_name: string;
  client_company: string;
  created_by_name: string;
  created_by_email: string | null;
  mode: string;
  status: string;
  industry: string | null;
  aggregated_overall: number | null;
  aggregated_maturity: number | null;
  created_at: string;
}

type AuthState = "loading" | "authorized" | "forbidden" | "error";

/** Reusable stage-distribution row rendered once for CRM and once for CSC. */
function StageRow({
  title,
  count,
  tally,
  stageLookup,
}: {
  title: string;
  count: number;
  tally: (stage: MaturityStage) => number;
  stageLookup: (stage: MaturityStage) => string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </h3>
        <span className="text-[11px] text-slate-400">{count} total</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {([1, 2, 3, 4] as MaturityStage[]).map((stage) => {
          const n = tally(stage);
          const label = stageLookup(stage);
          const badge = STAGE_BADGES[stage];
          return (
            <div
              key={`${title}-${stage}`}
              className="bg-white rounded-xl border border-slate-200 p-4"
            >
              <p
                className={`text-xs font-semibold px-2 py-0.5 rounded inline-block mb-2 ${badge.bg} ${badge.text}`}
              >
                Stage {stage}
              </p>
              <p className="text-2xl font-bold text-slate-900">{n}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">
                {label.split("—")[1]?.trim() ?? label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [canManageAdmins, setCanManageAdmins] = useState(false);
  const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AssessmentRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [projectDeleteTarget, setProjectDeleteTarget] = useState<ProjectRow | null>(null);
  const [projectDeleteMode, setProjectDeleteMode] = useState<"orphan" | "cascade">("orphan");
  const [projectDeleting, setProjectDeleting] = useState(false);
  const [tab, setTab] = useState<"projects" | "assessments">("projects");

  const loadAdminData = useCallback(async () => {
    try {
      // The unified /admin dashboard is super_admin only. We use the
      // /api/admin/users endpoint as the gate: it returns 200 only for
      // super admins (not scoped admins). If that 403s, stop here.
      const [usersRes, assRes, projRes, cscRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/assessments?admin=1"),
        fetch("/api/projects?admin=1"),
        fetch("/api/csc/assessments?admin=1"),
      ]);
      if (usersRes.status === 403) {
        setAuthState("forbidden");
        return;
      }
      if (!usersRes.ok || !assRes.ok || !projRes.ok || !cscRes.ok) {
        setAuthState("error");
        return;
      }

      const crmRaw = (await assRes.json()) as Omit<AssessmentRow, "kind">[];
      const cscRaw = (await cscRes.json()) as Omit<AssessmentRow, "kind">[];
      const merged: AssessmentRow[] = [
        ...crmRaw.map((a) => ({ ...a, kind: "crm" as const })),
        ...cscRaw.map((a) => ({ ...a, kind: "csc" as const })),
      ].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setAssessments(merged);
      setProjects(await projRes.json());
      setCanManageAdmins(true); // super admins by construction of this gate
      setAuthState("authorized");
    } catch {
      setAuthState("error");
    }
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
      loadAdminData();
    });
  }, [loadAdminData]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const exportCSV = () => {
    const headers = [
      "Type",
      "Client",
      "Sector",
      "Project",
      "Respondent",
      "Rep Email",
      "Status",
      "Industry",
      "Score",
      "Stage",
      "Date",
      "Share ID",
    ];
    const projectLookup = new Map(projects.map((p) => [p.id, p.client_name]));
    const rows = assessments.map((a) => [
      a.kind === "csc" ? "CSC" : "CRM",
      a.client_name,
      a.client_company,
      a.project_id ? projectLookup.get(a.project_id) ?? "" : "",
      a.respondent_name,
      a.rep_email ?? "",
      a.status,
      a.industry ? (INDUSTRY_LABELS[a.industry] ?? a.industry) : "",
      a.overall_score?.toFixed(1) ?? "",
      a.maturity_stage
        ? MATURITY_STAGES[a.maturity_stage as MaturityStage]?.label ?? ""
        : "",
      `${formatDateTime(a.created_at).date} ${formatDateTime(a.created_at).time}`,
      a.share_id,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crm-diagnostic-assessments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const endpoint =
        deleteTarget.kind === "csc"
          ? `/api/csc/assessments/${deleteTarget.id}`
          : `/api/assessments/${deleteTarget.id}`;
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setAssessments((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      // keep modal open on error so user can retry
    } finally {
      setDeleting(false);
    }
  };

  const handleProjectDelete = async () => {
    if (!projectDeleteTarget) return;
    setProjectDeleting(true);
    try {
      const res = await fetch(
        `/api/projects/${projectDeleteTarget.id}?mode=${projectDeleteMode}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete project");
      const targetId = projectDeleteTarget.id;
      setProjects((prev) => prev.filter((p) => p.id !== targetId));
      if (projectDeleteMode === "cascade") {
        setAssessments((prev) =>
          prev.filter((a) => a.project_id !== targetId)
        );
      } else {
        // Orphan: keep the rows but null out project_id so the UI stops
        // showing a project association that no longer exists.
        setAssessments((prev) =>
          prev.map((a) =>
            a.project_id === targetId ? { ...a, project_id: null } : a
          )
        );
      }
      setProjectDeleteTarget(null);
      setProjectDeleteMode("orphan");
    } catch {
      // keep modal open on error
    } finally {
      setProjectDeleting(false);
    }
  };

  const filtered = assessments.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.client_name.toLowerCase().includes(q) ||
      a.client_company.toLowerCase().includes(q) ||
      (a.rep_email ?? "").toLowerCase().includes(q)
    );
  });

  // Lookup: project_id → project client_name (used to show project linkage on each assessment).
  const projectNameById = new Map<string, string>();
  for (const p of projects) {
    projectNameById.set(p.id, p.client_name);
  }

  if (authState === "loading") {
    return (
      <div className="min-h-screen bg-m2-surface-light font-m2 flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          Checking access…
        </div>
      </div>
    );
  }

  if (authState === "forbidden") {
    return (
      <div className="min-h-screen bg-m2-surface-light font-m2 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 w-full max-w-sm text-center">
          <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-base font-bold text-slate-900 mb-1">Super admins only</h1>
          <p className="text-sm text-slate-500 mb-1">
            This dashboard combines CRM and CSC data and is limited to super
            admins. Scoped admins — use the Mine/All toggle on the home pages.
          </p>
          {userEmail && (
            <p className="text-xs text-slate-400 mb-5">Signed in as {userEmail}</p>
          )}
          <div className="flex flex-col gap-2">
            <a
              href="/"
              className="w-full px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90"
              style={{ backgroundColor: "#0328d1" }}
            >
              Back to home
            </a>
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authState === "error") {
    return (
      <div className="min-h-screen bg-m2-surface-light font-m2 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 w-full max-w-sm text-center">
          <h1 className="text-base font-bold text-slate-900 mb-1">Couldn&apos;t load admin data</h1>
          <p className="text-sm text-slate-500 mb-5">
            Something went wrong fetching assessments and projects.
          </p>
          <button
            onClick={() => { setAuthState("loading"); loadAdminData(); }}
            className="w-full px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: "#0328d1" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-m2-surface-light font-m2">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Diagnostic Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {assessments.filter((a) => a.kind === "crm").length} CRM ·{" "}
              {assessments.filter((a) => a.kind === "csc").length} CSC ·{" "}
              {assessments.filter((a) => a.status === "completed").length}{" "}
              completed
            </p>
          </div>
          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {userEmail}
              </span>
            )}
            {canManageAdmins && (
              <a
                href="/admin/users"
                className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
              >
                Manage admins
              </a>
            )}
            <Button variant="secondary" size="sm" onClick={exportCSV}>
              Export CSV
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            id="search"
            placeholder="Search by client, company, or rep email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Stage distribution — CRM and CSC each count against their own rubric */}
        <div className="mb-8 space-y-4">
          <StageRow
            title="Modern CRM"
            count={assessments.filter((a) => a.kind === "crm").length}
            stageLookup={(s) => MATURITY_STAGES[s].label}
            tally={(s) =>
              assessments.filter((a) => a.kind === "crm" && a.maturity_stage === s).length
            }
          />
          <StageRow
            title="Content Supply Chain"
            count={assessments.filter((a) => a.kind === "csc").length}
            stageLookup={(s) => CSC_MATURITY_STAGES[s].label}
            tally={(s) =>
              assessments.filter((a) => a.kind === "csc" && a.maturity_stage === s).length
            }
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4">
          <button
            onClick={() => setTab("projects")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === "projects"
                ? "bg-white border border-slate-200 text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setTab("assessments")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === "assessments"
                ? "bg-white border border-slate-200 text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Assessments ({assessments.length})
          </button>
        </div>

        {/* Projects table */}
        {tab === "projects" && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Client</th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Created By</th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden md:table-cell">Mode</th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Score</th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden lg:table-cell">Date</th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects
                    .filter((p) => {
                      const q = search.toLowerCase();
                      return (
                        p.client_name.toLowerCase().includes(q) ||
                        p.created_by_name.toLowerCase().includes(q) ||
                        (p.created_by_email ?? "").toLowerCase().includes(q)
                      );
                    })
                    .map((p, i, arr) => {
                      const stage = p.aggregated_maturity as MaturityStage | null;
                      const badge = stage ? STAGE_BADGES[stage] : null;
                      return (
                        <tr
                          key={p.id}
                          className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                            i === arr.length - 1 ? "border-b-0" : ""
                          }`}
                        >
                          <td className="px-4 py-3">
                            <p className="font-semibold text-slate-900">{p.client_name}</p>
                            <p className="text-xs text-slate-500">
                              {p.industry ? (INDUSTRY_LABELS[p.industry] ?? p.industry) : "No industry"}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-slate-700">{p.created_by_name}</p>
                            {p.created_by_email && (
                              <p className="text-xs text-slate-400">{p.created_by_email}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                              p.mode === "workshop" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"
                            }`}>
                              {p.mode === "workshop" ? "Workshop" : "Quick"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {p.aggregated_overall && stage && badge ? (
                              <div>
                                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${badge.bg} ${badge.text}`}>
                                  {p.aggregated_overall.toFixed(1)}
                                </span>
                                <p className="text-xs text-slate-400 mt-0.5">Stage {stage}</p>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                              p.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : p.status === "collecting"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                            }`}>
                              {p.status === "completed" ? "Complete" : p.status === "collecting" ? "Collecting" : "Aggregating"}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <p className="text-xs text-slate-700">{formatDateTime(p.created_at).date}</p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <a
                                href={`/crm/project/${p.share_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-blue-600 hover:text-blue-800"
                              >
                                Open →
                              </a>
                              <button
                                onClick={() => setProjectDeleteTarget(p)}
                                className="text-slate-300 hover:text-red-500 transition-colors"
                                title="Delete project"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                  <path d="M10 11v6M14 11v6" />
                                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  {projects.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-sm">
                        No projects found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Assessments table */}
        {tab === "assessments" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">
                    Type
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">
                    Client
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden md:table-cell">
                    Project
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">
                    Respondent
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">
                    Score
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden sm:table-cell">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => {
                  const stage = a.maturity_stage as MaturityStage | null;
                  const badge = stage ? STAGE_BADGES[stage] : null;
                  const isCsc = a.kind === "csc";
                  const resultsHref = isCsc
                    ? `/csc/results/${a.share_id}`
                    : `/results/${a.share_id}`;
                  const resumeHref = isCsc
                    ? `/csc/assessment/resume/${a.share_id}`
                    : `/crm/assessment/resume/${a.share_id}`;
                  return (
                    <tr
                      key={`${a.kind}-${a.id}`}
                      className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                        i === filtered.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            isCsc
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {isCsc ? "CSC" : "CRM"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">
                          {a.client_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {a.client_company}
                          {a.industry &&
                            ` · ${INDUSTRY_LABELS[a.industry] ?? a.industry}`}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {a.project_id && projectNameById.has(a.project_id) ? (
                          <p className="text-xs text-slate-700">
                            {projectNameById.get(a.project_id)}
                          </p>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-700">{a.respondent_name}</p>
                        {a.rep_email && (
                          <p className="text-xs text-slate-400">{a.rep_email}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {a.overall_score && stage && badge ? (
                          <div>
                            <span
                              className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${badge.bg} ${badge.text}`}
                            >
                              {a.overall_score.toFixed(1)}
                            </span>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Stage {stage}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded ${
                            a.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {a.status === "completed" ? "Complete" : "In Progress"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-xs text-slate-700">{formatDateTime(a.created_at).date}</p>
                        <p className="text-xs text-slate-400">{formatDateTime(a.created_at).time}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {a.status === "completed" && (
                            <a
                              href={resultsHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-blue-600 hover:text-blue-800"
                            >
                              View →
                            </a>
                          )}
                          <a
                            href={resumeHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs font-medium ${
                              a.status === "completed"
                                ? "text-slate-500 hover:text-slate-700"
                                : "text-amber-600 hover:text-amber-800"
                            }`}
                          >
                            {a.status === "completed" ? "Edit →" : "Resume →"}
                          </a>
                          <button
                            onClick={() => setDeleteTarget(a)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                            title="Delete assessment"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-slate-400 text-sm"
                    >
                      No assessments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>

    {/* Delete confirmation modal */}

    {deleteTarget && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => !deleting && setDeleteTarget(null)}
        />
        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm mx-4 p-6">
          {/* Icon */}
          <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Delete Assessment
          </h3>
          <p className="text-sm text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">{deleteTarget.client_name}</span>
            {deleteTarget.client_company && (
              <span className="text-slate-400"> · {deleteTarget.client_company}</span>
            )}
          </p>
          <p className="text-sm text-slate-500 mb-6">
            This will permanently delete the assessment and all responses. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Project delete confirmation modal — super admin only, with orphan/cascade choice */}
    {projectDeleteTarget && (() => {
      const linkedCount = assessments.filter(
        (a) => a.project_id === projectDeleteTarget.id
      ).length;
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !projectDeleting && setProjectDeleteTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md mx-4 p-6">
            <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Delete Project
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              <span className="font-semibold text-slate-700">{projectDeleteTarget.client_name}</span>
              {projectDeleteTarget.client_company && (
                <span className="text-slate-400"> · {projectDeleteTarget.client_company}</span>
              )}
              <br />
              <span className="text-xs text-slate-400">
                {linkedCount === 0
                  ? "No linked assessments."
                  : `${linkedCount} linked assessment${linkedCount === 1 ? "" : "s"}.`}
              </span>
            </p>

            {linkedCount > 0 && (
              <div className="space-y-2 mb-5">
                <label className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                  projectDeleteMode === "orphan"
                    ? "border-slate-900 bg-slate-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}>
                  <input
                    type="radio"
                    name="project-delete-mode"
                    value="orphan"
                    checked={projectDeleteMode === "orphan"}
                    onChange={() => setProjectDeleteMode("orphan")}
                    disabled={projectDeleting}
                    className="mt-0.5"
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-slate-800">
                      Keep assessments
                    </span>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      {linkedCount} assessment{linkedCount === 1 ? "" : "s"} will be un-linked from the project and remain accessible on their own.
                    </span>
                  </span>
                </label>

                <label className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                  projectDeleteMode === "cascade"
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}>
                  <input
                    type="radio"
                    name="project-delete-mode"
                    value="cascade"
                    checked={projectDeleteMode === "cascade"}
                    onChange={() => setProjectDeleteMode("cascade")}
                    disabled={projectDeleting}
                    className="mt-0.5"
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-slate-800">
                      Delete everything
                    </span>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      Also permanently deletes {linkedCount} linked assessment{linkedCount === 1 ? "" : "s"} and all responses.
                    </span>
                  </span>
                </label>
              </div>
            )}

            <p className="text-xs text-slate-400 mb-5">
              Stakeholder invitations for this project will be removed either way.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setProjectDeleteTarget(null)}
                disabled={projectDeleting}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleProjectDelete}
                disabled={projectDeleting}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {projectDeleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Deleting…
                  </>
                ) : projectDeleteMode === "cascade" ? (
                  "Delete everything"
                ) : (
                  "Delete project"
                )}
              </button>
            </div>
          </div>
        </div>
      );
    })()}
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { MATURITY_STAGES } from "@/lib/scoring";
import { INDUSTRY_LABELS } from "@/lib/data/questions";
import type { MaturityStage } from "@/lib/types";

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

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AssessmentRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/assessments", {
        headers: { "x-admin-password": password },
      });
      if (res.ok) {
        const data = await res.json();
        setAssessments(data);
        setAuthed(true);
        setError("");
      } else {
        setError("Incorrect password");
      }
    } catch {
      setError("Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Client",
      "Sector",
      "Respondent",
      "Rep Email",
      "Status",
      "Industry",
      "Score",
      "Stage",
      "Date",
      "Share ID",
    ];
    const rows = assessments.map((a) => [
      a.client_name,
      a.client_company,
      a.respondent_name,
      a.rep_email ?? "",
      a.status,
      a.industry ? (INDUSTRY_LABELS[a.industry] ?? a.industry) : "",
      a.overall_score?.toFixed(1) ?? "",
      a.maturity_stage
        ? MATURITY_STAGES[a.maturity_stage as MaturityStage]?.label ?? ""
        : "",
      formatDate(a.created_at),
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
      const res = await fetch(`/api/assessments/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setAssessments((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      // keep modal open on error so user can retry
    } finally {
      setDeleting(false);
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

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-slate-900 mb-1">Admin Access</h1>
          <p className="text-sm text-slate-500 mb-6">
            Enter your admin password to view all assessments.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              id="password"
              type="password"
              label="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              required
            />
            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Diagnostic Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {assessments.length} assessments total ·{" "}
              {assessments.filter((a) => a.status === "completed").length}{" "}
              completed
            </p>
          </div>
          <div className="flex gap-2">
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

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {([1, 2, 3, 4] as MaturityStage[]).map((stage) => {
            const count = assessments.filter(
              (a) => a.maturity_stage === stage
            ).length;
            const info = MATURITY_STAGES[stage];
            const badge = STAGE_BADGES[stage];
            return (
              <div
                key={stage}
                className="bg-white rounded-xl border border-slate-200 p-4"
              >
                <p
                  className={`text-xs font-semibold px-2 py-0.5 rounded inline-block mb-2 ${badge.bg} ${badge.text}`}
                >
                  Stage {stage}
                </p>
                <p className="text-2xl font-bold text-slate-900">{count}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-tight">
                  {info.label.split("—")[1]?.trim()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">
                    Client
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">
                    Respondent
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden md:table-cell">
                    Industry
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
                  return (
                    <tr
                      key={a.id}
                      className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                        i === filtered.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">
                          {a.client_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {a.client_company}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-700">{a.respondent_name}</p>
                        {a.rep_email && (
                          <p className="text-xs text-slate-400">{a.rep_email}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-slate-600 text-xs">
                          {a.industry
                            ? INDUSTRY_LABELS[a.industry] ?? a.industry
                            : "—"}
                        </p>
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
                        <p className="text-xs text-slate-500">
                          {formatDate(a.created_at)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {a.status === "completed" && (
                            <a
                              href={`/results/${a.share_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-blue-600 hover:text-blue-800"
                            >
                              View →
                            </a>
                          )}
                          <a
                            href={`/assessment/resume/${a.share_id}`}
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
                      colSpan={7}
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
    </>
  );
}

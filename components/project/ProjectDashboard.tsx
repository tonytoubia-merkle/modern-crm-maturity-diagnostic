"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { StakeholderManager } from "./StakeholderManager";

interface StakeholderData {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  invite_token: string;
  assessment_id: string | null;
  status: string;
  invited_at: string;
  completed_at: string | null;
  assessments?: {
    share_id: string;
    status: string;
    overall_score: number | null;
    maturity_stage: number | null;
  };
}

interface ProjectData {
  id: string;
  share_id: string;
  client_name: string;
  client_company: string;
  industry: string | null;
  created_by_name: string;
  mode: string;
  status: string;
  aggregated_overall: number | null;
  aggregated_maturity: number | null;
}

interface ProjectDashboardProps {
  projectShareId: string;
}

export function ProjectDashboard({ projectShareId }: ProjectDashboardProps) {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [stakeholders, setStakeholders] = useState<StakeholderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [aggregating, setAggregating] = useState(false);
  const [showAddMore, setShowAddMore] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/projects/${projectShareId}`);
    if (!res.ok) return;
    const data = await res.json();
    setProject(data.project);
    setStakeholders(data.stakeholders);
    setLoading(false);
  }, [projectShareId]);

  useEffect(() => {
    fetchData();
    // Poll every 30s for status updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const completedCount = stakeholders.filter((s) => s.status === "completed").length;
  const totalCount = stakeholders.length;

  const handleAggregate = async () => {
    if (!project) return;
    setAggregating(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/aggregate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Aggregation failed");
      await fetchData();
    } finally {
      setAggregating(false);
    }
  };

  const copyLink = (token: string) => {
    navigator.clipboard.writeText(`${baseUrl}/survey/${token}`);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return <p className="text-center py-12 text-slate-500">Project not found.</p>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#00205B" }}>
          Workshop Project
        </p>
        <h1 className="text-2xl font-bold text-slate-900">{project.client_name}</h1>
        <p className="text-sm text-slate-500 mt-1">
          {project.client_company}
          {project.industry && ` · ${project.industry}`}
          {" · "}Created by {project.created_by_name}
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Stakeholders</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: completedCount === totalCount && totalCount > 0 ? "#16a34a" : "#00205B" }}>
            {completedCount}/{totalCount}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Completed</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900 capitalize">{project.status}</p>
          <p className="text-xs text-slate-500 mt-0.5">Status</p>
        </div>
      </div>

      {/* Stakeholder list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-700">Stakeholders</p>
          <button
            type="button"
            onClick={() => setShowAddMore(!showAddMore)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAddMore ? "Hide" : "+ Add more"}
          </button>
        </div>

        {showAddMore && (
          <div className="mb-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <StakeholderManager
              projectId={project.id}
              onDone={() => {
                setShowAddMore(false);
                fetchData();
              }}
            />
          </div>
        )}

        <div className="space-y-2">
          {stakeholders.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3 bg-white"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    s.status === "completed"
                      ? "bg-green-500"
                      : s.status === "in_progress"
                      ? "bg-amber-500"
                      : "bg-slate-300"
                  }`}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-500">
                    {s.role || "No role"}{s.email && ` · ${s.email}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    s.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : s.status === "in_progress"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {s.status === "completed" ? "Done" : s.status === "in_progress" ? "In Progress" : "Invited"}
                </span>
                {s.assessments?.share_id && s.status === "completed" && (
                  <a
                    href={`/results/${s.assessments.share_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Results
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => copyLink(s.invite_token)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {copied === s.invite_token ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate results */}
      {project.status === "collecting" && (
        <div className="border-t border-slate-200 pt-6">
          <h3 className="font-bold text-slate-900 mb-2">Generate Results</h3>
          <p className="text-sm text-slate-600 mb-4">
            Once you&apos;ve received enough surveys, aggregate the responses to generate
            combined results and a workshop agenda.
            {completedCount === 0 && " No surveys completed yet."}
          </p>
          <Button
            onClick={handleAggregate}
            loading={aggregating}
            disabled={completedCount === 0}
          >
            Aggregate {completedCount} Response{completedCount !== 1 ? "s" : ""} & Generate Results →
          </Button>
        </div>
      )}

      {/* View results (if aggregated) */}
      {project.status === "completed" && project.aggregated_overall && (
        <div className="border-t border-slate-200 pt-6">
          <h3 className="font-bold text-slate-900 mb-2">Results Ready</h3>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold" style={{ color: "#00205B" }}>
              {project.aggregated_overall.toFixed(1)}
            </span>
            <span className="text-sm text-slate-500">
              Overall Score · Stage {project.aggregated_maturity}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Aggregated from {completedCount} stakeholder response{completedCount !== 1 ? "s" : ""}.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleAggregate}
              loading={aggregating}
            >
              Regenerate Results
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

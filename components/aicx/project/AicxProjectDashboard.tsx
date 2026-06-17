"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { AicxCapabilityHeatmap } from "@/components/aicx/results/AicxCapabilityHeatmap";
import { AicxStakeholderManager } from "./AicxStakeholderManager";
import {
  AICX_CAPABILITIES_ORDER,
  AICX_CAPABILITY_LABELS,
  AICX_CAPABILITY_SUBTITLES,
  AICX_INDUSTRY_LABELS,
} from "@/lib/aicx/data/questions";
import { AICX_OPPORTUNITIES } from "@/lib/aicx/data/opportunities";
import { getAicxSmeForOpportunity } from "@/lib/aicx/data/smeMapping";
import type {
  AicxCapability,
  AicxCapabilityScore,
  AicxWorkshopAgenda,
} from "@/lib/aicx/types";

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
  csc_assessments?: {
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
  aggregated_scores: Record<string, number> | null;
  triggered_opportunity_ids: string[] | null;
  workshop_agenda: AicxWorkshopAgenda | null;
}

interface AicxProjectDashboardProps {
  projectShareId: string;
}

export function AicxProjectDashboard({
  projectShareId,
}: AicxProjectDashboardProps) {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [stakeholders, setStakeholders] = useState<StakeholderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [aggregating, setAggregating] = useState(false);
  const [showAddMore, setShowAddMore] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/aicx/projects/${projectShareId}`);
    if (!res.ok) return;
    const data = await res.json();
    setProject(data.project);
    setStakeholders(data.stakeholders);
    setLoading(false);
  }, [projectShareId]);

  useEffect(() => {
    fetchData();
    // Poll every 30s for stakeholder progress
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const totalCount = stakeholders.length;
  const completedCount = stakeholders.filter(
    (s) => s.status === "completed" || s.csc_assessments?.status === "completed"
  ).length;

  const handleAggregate = async () => {
    if (!project) return;
    setAggregating(true);
    try {
      const res = await fetch(`/api/aicx/projects/${project.id}/aggregate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Aggregation failed");
      await fetchData();
    } finally {
      setAggregating(false);
    }
  };

  const copyLink = (token: string) => {
    navigator.clipboard.writeText(`${baseUrl}/aicx/survey/${token}`);
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
    return (
      <p className="text-center py-12 text-slate-500">Project not found.</p>
    );
  }

  // Build CapabilityScore[] from aggregated_scores for the radar
  const capabilityScores: AicxCapabilityScore[] = project.aggregated_scores
    ? AICX_CAPABILITIES_ORDER.map((cap) => ({
        capability: cap,
        label: AICX_CAPABILITY_LABELS[cap],
        subtitle: AICX_CAPABILITY_SUBTITLES[cap],
        score: (project.aggregated_scores as Record<string, number>)[cap] ?? 0,
        questionCount: 0,
      }))
    : [];

  const triggeredOpps = (project.triggered_opportunity_ids ?? [])
    .map((id) => AICX_OPPORTUNITIES.find((o) => o.id === id))
    .filter((o): o is NonNullable<typeof o> => !!o);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-1"
          style={{ color: "#141419" }}
        >
          AI for CX Workshop
        </p>
        <h1 className="text-2xl font-bold text-slate-900">
          {project.client_name}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {project.client_company}
          {project.industry &&
            ` · ${AICX_INDUSTRY_LABELS[project.industry as keyof typeof AICX_INDUSTRY_LABELS] ?? project.industry}`}
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
          <p
            className="text-2xl font-bold"
            style={{
              color:
                completedCount === totalCount && totalCount > 0
                  ? "#16a34a"
                  : "#141419",
            }}
          >
            {completedCount}/{totalCount}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Completed</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900 capitalize">
            {project.status}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Status</p>
        </div>
      </div>

      {/* Stakeholders */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">Stakeholders</h3>
          <button
            type="button"
            onClick={() => setShowAddMore(!showAddMore)}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            {showAddMore ? "Cancel" : "+ Add more"}
          </button>
        </div>

        {showAddMore && (
          <div className="mb-4 pb-4 border-b border-slate-100">
            <AicxStakeholderManager
              projectId={project.id}
              onDone={() => {
                setShowAddMore(false);
                fetchData();
              }}
            />
          </div>
        )}

        {stakeholders.length === 0 ? (
          <p className="text-sm text-slate-400 py-3">
            No stakeholders yet. Add people to send survey links.
          </p>
        ) : (
          <div className="space-y-2">
            {stakeholders.map((s) => {
              const status = s.csc_assessments?.status ?? s.status;
              const done = status === "completed";
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {s.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {s.email ?? "No email"}
                      {s.role && ` · ${s.role}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        done
                          ? "bg-green-100 text-green-700"
                          : status === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {done
                        ? "Done"
                        : status === "in_progress"
                        ? "In progress"
                        : "Invited"}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyLink(s.invite_token)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-white border border-slate-200 px-2 py-1 rounded-lg transition-colors"
                    >
                      {copied === s.invite_token ? "Copied!" : "Copy link"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Aggregation button */}
        {totalCount > 0 && completedCount > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-slate-500">
              {completedCount} of {totalCount} stakeholder
              {totalCount !== 1 ? "s" : ""} completed.
              {completedCount < totalCount &&
                " You can aggregate now or wait for the rest."}
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAggregate}
              loading={aggregating}
            >
              {project.aggregated_scores
                ? "Re-aggregate"
                : "Aggregate results →"}
            </Button>
          </div>
        )}
      </div>

      {/* Aggregated results */}
      {project.aggregated_scores && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 mb-2">
              Aggregated Results
            </h3>
            <div className="flex items-center gap-3 mb-1">
              <span
                className="text-3xl font-bold"
                style={{ color: "#141419" }}
              >
                {project.aggregated_overall?.toFixed(1) ?? "–"}
              </span>
              <span className="text-sm text-slate-500">
                Overall Score · Stage {project.aggregated_maturity ?? "–"}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Aggregated from {completedCount} stakeholder response
              {completedCount !== 1 ? "s" : ""}.
            </p>
          </div>

          <AicxCapabilityHeatmap scores={capabilityScores} />
        </div>
      )}

      {/* Triggered opportunities */}
      {triggeredOpps.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Triggered Opportunities ({triggeredOpps.length})
          </h3>
          <div className="space-y-2">
            {triggeredOpps.map((opp) => {
              const smes = getAicxSmeForOpportunity(opp.id);
              return (
                <div
                  key={opp.id}
                  className="border border-slate-200 rounded-lg p-3 bg-white"
                  style={{
                    borderLeftWidth: "3px",
                    borderLeftColor: "#141419",
                  }}
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {opp.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {opp.tagline}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {opp.sfType}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {opp.engagementSize}
                    </span>
                    {opp.capabilities.map((c: AicxCapability) => (
                      <span
                        key={c}
                        className="text-[10px] text-slate-400"
                      >
                        · {AICX_CAPABILITY_LABELS[c]}
                      </span>
                    ))}
                  </div>
                  {smes.length > 0 && (
                    <p className="text-[10px] text-slate-500 mt-1.5">
                      SME: {smes.map((s) => s.name).join(", ")}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Workshop agenda */}
      {project.workshop_agenda && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Workshop Agenda</h3>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
              {project.workshop_agenda.format.replace("_", " ")}
            </span>
          </div>
          <ol className="space-y-3">
            {project.workshop_agenda.sections.map((sec, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center mt-0.5"
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {sec.title}
                    </p>
                    <span className="text-[11px] text-slate-400 flex-shrink-0">
                      {sec.duration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {sec.description}
                  </p>
                  {sec.facilitationGuide && (
                    <p className="text-[11px] text-slate-500 mt-1.5 italic whitespace-pre-line">
                      {sec.facilitationGuide}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-slate-400 mt-4">
            Vignettes and facilitation guides are scaffold content. Populate{" "}
            <span className="font-mono">lib/aicx/data/vignettes.ts</span> with
            practice-reviewed case studies to replace placeholders.
          </p>
        </div>
      )}
    </div>
  );
}

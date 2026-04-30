"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { StakeholderManager } from "./StakeholderManager";
import { CapabilityHeatmap, type HeatmapBenchmarks } from "@/components/results/CapabilityHeatmap";
import { CAPABILITY_LABELS, INDUSTRY_LABELS } from "@/lib/data/questions";
import { OPPORTUNITIES } from "@/lib/data/opportunities";
import { VIGNETTES } from "@/lib/data/vignettes";
import { getSmeForOpportunity } from "@/lib/data/smeMapping";
import { CHECKLIST } from "@/lib/data/guide";
import type { Capability, CapabilityScore, WorkshopAgenda } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  logistics: "Logistics",
  materials: "Materials",
  technology: "Technology",
  facilitation: "Facilitation",
  follow_up: "Follow-Up",
};

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
  aggregated_scores: Record<string, number> | null;
  triggered_opportunity_ids: string[] | null;
  workshop_agenda: WorkshopAgenda | null;
}

interface ProjectDashboardProps {
  projectShareId: string;
}

export function ProjectDashboard({ projectShareId }: ProjectDashboardProps) {
  interface LinkedAssessment {
    id: string;
    share_id: string;
    respondent_name: string;
    status: string;
    overall_score: number | null;
    maturity_stage: number | null;
  }

  const [project, setProject] = useState<ProjectData | null>(null);
  const [stakeholders, setStakeholders] = useState<StakeholderData[]>([]);
  const [linkedAssessments, setLinkedAssessments] = useState<LinkedAssessment[]>([]);
  const [benchmarks, setBenchmarks] = useState<HeatmapBenchmarks | null>(null);
  const [loading, setLoading] = useState(true);
  const [aggregating, setAggregating] = useState(false);
  const [showAddMore, setShowAddMore] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [creatingMiro, setCreatingMiro] = useState(false);
  const [miroUrl, setMiroUrl] = useState<string | null>(null);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistFormat, setChecklistFormat] = useState<"onsite" | "virtual">("onsite");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const saved = localStorage.getItem(`checklist-${projectShareId}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  // Persist checklist to localStorage
  useEffect(() => {
    if (checkedItems.size > 0) {
      localStorage.setItem(`checklist-${projectShareId}`, JSON.stringify(Array.from(checkedItems)));
    }
  }, [checkedItems, projectShareId]);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/projects/${projectShareId}`);
    if (!res.ok) return;
    const data = await res.json();
    setProject(data.project);
    setStakeholders(data.stakeholders);
    setLinkedAssessments(data.linkedAssessments || []);
    setLoading(false);
  }, [projectShareId]);

  useEffect(() => {
    fetchData();
    // Poll every 30s for status updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Fetch benchmarks once we have a project (post-aggregation view).
  useEffect(() => {
    if (!project?.aggregated_scores) return;
    const qs = new URLSearchParams();
    if (project.industry) qs.set("industry", project.industry);
    fetch(`/api/averages?${qs.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setBenchmarks({
          overall: data.capabilitiesOverall ?? {},
          industry: data.capabilitiesIndustry ?? undefined,
          industryLabel: project.industry
            ? INDUSTRY_LABELS[project.industry] ?? undefined
            : undefined,
          sampleSize: data.sampleSize ?? { overall: 0, industry: null },
        });
      })
      .catch(() => {});
  }, [project?.aggregated_scores, project?.industry]);

  // Use linked assessments as source of truth for counts
  const totalAssessments = linkedAssessments.length;
  const completedAssessments = linkedAssessments.filter((a) => a.status === "completed").length;
  // Fall back to stakeholder count if no linked assessments
  const completedCount = completedAssessments || stakeholders.filter(
    (s) => s.status === "completed" || s.assessments?.status === "completed"
  ).length;
  const totalCount = totalAssessments || stakeholders.length;

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
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#040e4b" }}>
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
          <p className="text-2xl font-bold" style={{ color: completedCount === totalCount && totalCount > 0 ? "#16a34a" : "#040e4b" }}>
            {completedCount}/{totalCount}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Completed</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900 capitalize">{project.status}</p>
          <p className="text-xs text-slate-500 mt-0.5">Status</p>
        </div>
      </div>

      {/* Workshop checklist */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setShowChecklist(!showChecklist)}
          className="w-full text-left px-5 py-3.5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-900">Workshop Checklist</h3>
            {(() => {
              const filtered = CHECKLIST.filter((c) => checklistFormat === "onsite" ? c.onsite : c.virtual);
              const done = filtered.filter((c) => checkedItems.has(c.id)).length;
              return (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                  done === filtered.length && filtered.length > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {done}/{filtered.length}
                </span>
              );
            })()}
          </div>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${showChecklist ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showChecklist && (
          <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
            {/* Format toggle */}
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium w-fit">
              <button
                onClick={() => setChecklistFormat("onsite")}
                className={`px-3 py-1.5 transition-colors ${
                  checklistFormat === "onsite" ? "text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
                style={checklistFormat === "onsite" ? { backgroundColor: "#040e4b" } : undefined}
              >
                On-Site
              </button>
              <button
                onClick={() => setChecklistFormat("virtual")}
                className={`px-3 py-1.5 transition-colors ${
                  checklistFormat === "virtual" ? "text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
                style={checklistFormat === "virtual" ? { backgroundColor: "#040e4b" } : undefined}
              >
                Virtual
              </button>
            </div>

            {/* Checklist items by category */}
            {(() => {
              const filtered = CHECKLIST.filter((c) => checklistFormat === "onsite" ? c.onsite : c.virtual);
              const categories = Array.from(new Set(filtered.map((c) => c.category)));
              return categories.map((cat) => {
                const items = filtered.filter((c) => c.category === cat);
                return (
                  <div key={cat}>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      {CATEGORY_LABELS[cat] || cat}
                    </p>
                    <div className="space-y-1">
                      {items.map((item) => (
                        <label key={item.id} className="flex items-start gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={checkedItems.has(item.id)}
                            onChange={() => {
                              setCheckedItems((prev) => {
                                const next = new Set(prev);
                                next.has(item.id) ? next.delete(item.id) : next.add(item.id);
                                return next;
                              });
                            }}
                            className="mt-0.5 rounded border-slate-300"
                          />
                          <div>
                            <p className={`text-xs leading-relaxed ${checkedItems.has(item.id) ? "text-slate-400 line-through" : "text-slate-700"}`}>
                              {item.label}
                            </p>
                            {item.details && (
                              <p className="text-[10px] text-slate-400">{item.details}</p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
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
          {stakeholders.map((s) => {
            const isDone = s.status === "completed" || s.assessments?.status === "completed";
            const isActive = !isDone && (s.status === "in_progress" || s.assessments?.status === "in_progress");
            return (
            <div
              key={s.id}
              className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3 bg-white"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    isDone
                      ? "bg-green-500"
                      : isActive
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
                    isDone
                      ? "bg-green-100 text-green-700"
                      : isActive
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {isDone ? "Done" : isActive ? "In Progress" : "Invited"}
                </span>
                {s.assessments?.share_id && isDone && (
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
            );
          })}
        </div>
      </div>

      {/* Linked assessments (when no stakeholders but assessments exist) */}
      {stakeholders.length === 0 && linkedAssessments.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">Linked Assessments</p>
          <div className="space-y-2">
            {linkedAssessments.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3 bg-white"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      a.status === "completed" ? "bg-green-500" : "bg-amber-500"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{a.respondent_name}</p>
                    <p className="text-xs text-slate-500">
                      {a.overall_score ? `Score: ${a.overall_score.toFixed(1)}` : "In progress"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      a.status === "completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {a.status === "completed" ? "Done" : "In Progress"}
                  </span>
                  {a.status === "completed" && (
                    <a
                      href={`/results/${a.share_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Results
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results section */}
      <div className="border-t border-slate-200 pt-6 space-y-6">
        {project.aggregated_overall ? (
          <>
            {/* Score summary */}
            <div>
              <h3 className="font-bold text-slate-900 mb-3">Aggregated Results</h3>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold" style={{ color: "#040e4b" }}>
                  {project.aggregated_overall.toFixed(1)}
                </span>
                <span className="text-sm text-slate-500">
                  Overall Score · Stage {project.aggregated_maturity}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Aggregated from {completedCount} stakeholder response{completedCount !== 1 ? "s" : ""}.
              </p>
            </div>

            {/* Capability radar + scores */}
            {project.aggregated_scores && (() => {
              const capabilityScores: CapabilityScore[] = Object.entries(project.aggregated_scores)
                .filter(([, v]) => typeof v === "number")
                .map(([cap, score]) => ({
                  capability: cap as Capability,
                  label: CAPABILITY_LABELS[cap] ?? cap,
                  score: score as number,
                  questionCount: 0,
                }));
              return (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Capability Scores</h4>
                  <CapabilityHeatmap
                    scores={capabilityScores}
                    benchmarks={benchmarks}
                  />
                </div>
              );
            })()}

            {/* Triggered opportunities */}
            {project.triggered_opportunity_ids && project.triggered_opportunity_ids.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">
                  Triggered Opportunities ({project.triggered_opportunity_ids.length})
                </h4>
                <div className="space-y-2">
                  {project.triggered_opportunity_ids.map((oppId) => {
                    const opp = OPPORTUNITIES.find((o) => o.id === oppId);
                    if (!opp) return null;
                    const sme = getSmeForOpportunity(oppId);
                    return (
                      <div
                        key={oppId}
                        className="border border-slate-200 rounded-lg p-3 bg-white"
                        style={{ borderLeftWidth: "3px", borderLeftColor: "#040e4b" }}
                      >
                        <p className="text-sm font-semibold text-slate-900">{opp.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{opp.tagline}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {opp.sfType}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {opp.engagementSize}
                          </span>
                          {opp.capabilities.map((c) => (
                            <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                              {CAPABILITY_LABELS[c] || c}
                            </span>
                          ))}
                        </div>
                        {sme && (
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-semibold text-slate-400">SME:</span>
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: "#040e4b" }}>
                              {sme.leadSmeRole}
                            </span>
                            <span className="text-[10px] text-slate-400">{sme.leadPractice}</span>
                            {sme.workshopRole === "R" && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-medium">
                                Must attend workshop
                              </span>
                            )}
                            {sme.workshopRole === "A" && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-medium">
                                Workshop lead
                              </span>
                            )}
                            {sme.workshopRole === "C" && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                                Brief beforehand
                              </span>
                            )}
                            {sme.notes && (
                              <span className="text-[10px] text-slate-400 italic">{sme.notes}</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Workshop agenda */}
            {project.workshop_agenda && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-1">
                  Workshop Agenda
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  {project.workshop_agenda.format.replace("_", " ")} format ·{" "}
                  {Math.round(project.workshop_agenda.totalMinutes / 60)}h{" "}
                  {project.workshop_agenda.totalMinutes % 60 > 0
                    ? `${project.workshop_agenda.totalMinutes % 60}m`
                    : ""}{" "}
                  · {project.workshop_agenda.days.length} day{project.workshop_agenda.days.length !== 1 ? "s" : ""}
                </p>
                {project.workshop_agenda.days.map((day) => (
                  <div key={day.dayNumber} className="mb-4">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Day {day.dayNumber} – {day.title}
                    </p>
                    <div className="space-y-1.5">
                      {day.blocks.map((block, bi) => {
                        const vignette = block.vignetteId
                          ? VIGNETTES.find((v) => v.id === block.vignetteId)
                          : null;
                        const isBreak = block.type === "break";
                        return (
                          <div
                            key={bi}
                            className={`rounded-lg p-3 ${
                              isBreak
                                ? "bg-slate-50 border border-slate-100"
                                : block.type === "vignette"
                                ? "bg-white border border-slate-200"
                                : "bg-blue-50 border border-blue-100"
                            }`}
                            style={
                              block.type === "vignette"
                                ? { borderLeftWidth: "3px", borderLeftColor: "#040e4b" }
                                : undefined
                            }
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm font-semibold ${
                                    isBreak ? "text-slate-400" : "text-slate-900"
                                  }`}
                                >
                                  {block.title}
                                </p>
                                {block.description && !isBreak && (
                                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                    {block.description}
                                  </p>
                                )}
                                {/* Vignette details */}
                                {vignette && (
                                  <div className="mt-2 space-y-1.5">
                                    <div className="flex flex-wrap gap-1.5">
                                      {vignette.expectedOutputs.map((output, oi) => (
                                        <span
                                          key={oi}
                                          className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-100"
                                        >
                                          {output}
                                        </span>
                                      ))}
                                    </div>
                                    {vignette.requiredInputs.length > 0 && (
                                      <p className="text-[10px] text-slate-400">
                                        Pre-work: {vignette.requiredInputs.join(" · ")}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded flex-shrink-0 ${
                                  isBreak
                                    ? "bg-slate-100 text-slate-400"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {block.durationMinutes}m
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={handleAggregate}
                loading={aggregating}
                disabled={completedCount === 0}
              >
                Regenerate Results
              </Button>
              {project.workshop_agenda && (
                miroUrl ? (
                  <a
                    href={miroUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
                    style={{ backgroundColor: "#FFD02F", color: "#050038" }}
                  >
                    Open Miro Board →
                  </a>
                ) : (
                  <Button
                    variant="secondary"
                    loading={creatingMiro}
                    onClick={async () => {
                      setCreatingMiro(true);
                      try {
                        const res = await fetch(`/api/projects/${project.id}/miro`, { method: "POST" });
                        if (!res.ok) {
                          const err = await res.json();
                          alert(err.error || "Failed to create Miro board");
                          return;
                        }
                        const data = await res.json();
                        setMiroUrl(data.boardUrl);
                        window.open(data.boardUrl, "_blank");
                      } finally {
                        setCreatingMiro(false);
                      }
                    }}
                  >
                    Generate Miro Board
                  </Button>
                )
              )}
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

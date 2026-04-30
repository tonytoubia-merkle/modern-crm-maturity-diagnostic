"use client";

import { useState } from "react";
import { VIGNETTES, CLIENT_STORIES } from "@/lib/data/vignettes";
import { OPPORTUNITIES } from "@/lib/data/opportunities";
import { CAPABILITY_LABELS } from "@/lib/data/questions";
import {
  CSC_VIGNETTES,
  CSC_CLIENT_STORIES,
} from "@/lib/csc/data/vignettes";
import { CSC_OPPORTUNITIES } from "@/lib/csc/data/opportunities";
import { CSC_CAPABILITY_LABELS } from "@/lib/csc/data/questions";
import {
  B2B_VIGNETTES,
  B2B_CLIENT_STORIES,
} from "@/lib/b2b/data/vignettes";
import { B2B_OPPORTUNITIES } from "@/lib/b2b/data/opportunities";
import { B2B_CAPABILITY_LABELS } from "@/lib/b2b/data/questions";
import {
  AICX_VIGNETTES,
  AICX_CLIENT_STORIES,
} from "@/lib/aicx/data/vignettes";
import { AICX_OPPORTUNITIES } from "@/lib/aicx/data/opportunities";
import { AICX_CAPABILITY_LABELS } from "@/lib/aicx/data/questions";
import {
  AIENT_VIGNETTES,
  AIENT_CLIENT_STORIES,
} from "@/lib/aient/data/vignettes";
import { AIENT_OPPORTUNITIES } from "@/lib/aient/data/opportunities";
import { AIENT_CAPABILITY_LABELS } from "@/lib/aient/data/questions";
import { M2Logo } from "@/components/brand/M2Logo";

const CRM_CATEGORIES = Array.from(
  new Set(VIGNETTES.map((v) => v.category))
).sort();

type Suite = "crm" | "csc" | "b2b" | "aicx" | "aient";

export default function LibraryPage() {
  const [suite, setSuite] = useState<Suite>("crm");

  return (
    <div className="min-h-screen font-m2 bg-m2-surface-light">
      {/* Nav */}
      <div className="bg-m2-navy">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3">
          <M2Logo tone="dark" height={36} />
          <a
            href="/crm"
            className="text-xs text-white/70 hover:text-white transition-colors"
          >
            ← Merkle Maturity Assessment
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-m2-blue">
            Workshop Library
          </p>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Vignettes & Exercises
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Five libraries, one workspace. Each diagnostic ships workshop
            vignettes – facilitation exercises with required inputs,
            timed agendas, and expected outputs – plus anonymized client
            stories used as proof points during pitch. Use the toggle
            below to switch.
          </p>
        </div>

        {/* Suite tabs */}
        <div className="inline-flex bg-white border border-slate-200 rounded-lg p-1 mb-8">
          <SuiteTab
            active={suite === "crm"}
            onClick={() => setSuite("crm")}
            label="Modern CRM"
            sublabel={`${VIGNETTES.length} vignettes · ${CLIENT_STORIES.length} stories`}
          />
          <SuiteTab
            active={suite === "csc"}
            onClick={() => setSuite("csc")}
            label="Content Supply Chain"
            sublabel={`${CSC_VIGNETTES.length} vignettes · ${CSC_CLIENT_STORIES.length} stories`}
          />
          <SuiteTab
            active={suite === "b2b"}
            onClick={() => setSuite("b2b")}
            label="B2B Transformation"
            sublabel={`${B2B_VIGNETTES.length} vignettes · ${B2B_CLIENT_STORIES.length} stories`}
          />
          <SuiteTab
            active={suite === "aicx"}
            onClick={() => setSuite("aicx")}
            label="AI for CX"
            sublabel={`${AICX_VIGNETTES.length} vignettes · ${AICX_CLIENT_STORIES.length} stories`}
          />
          <SuiteTab
            active={suite === "aient"}
            onClick={() => setSuite("aient")}
            label="AI for Enterprise"
            sublabel={`${AIENT_VIGNETTES.length} vignettes · ${AIENT_CLIENT_STORIES.length} stories`}
          />
        </div>

        {suite === "crm" && <CrmLibrary />}
        {suite === "csc" && <CscLibrary />}
        {suite === "b2b" && <B2bLibrary />}
        {suite === "aicx" && <AicxLibrary />}
        {suite === "aient" && <AientLibrary />}
      </div>
    </div>
  );
}

// ── Suite tabs ─────────────────────────────────────────────────────

function SuiteTab({
  active,
  onClick,
  label,
  sublabel,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sublabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-left transition-colors ${
        active
          ? "bg-m2-navy text-white"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span className="block text-sm font-semibold">{label}</span>
      <span
        className={`block text-[10px] mt-0.5 ${
          active ? "text-white/70" : "text-slate-400"
        }`}
      >
        {sublabel}
      </span>
    </button>
  );
}

// ── Modern CRM library – workshop vignettes ───────────────────────

function CrmLibrary() {
  const [view, setView] = useState<"vignettes" | "stories">("vignettes");

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat value={String(VIGNETTES.length)} label="Workshop Vignettes" />
        <Stat
          value={`${Math.round(
            VIGNETTES.reduce((s, v) => s + v.durationMinutes, 0) / 60
          )}h`}
          label="Total Content"
        />
        <Stat value={String(CLIENT_STORIES.length)} label="Client Stories" />
        <Stat
          value={String(
            new Set([
              ...VIGNETTES.flatMap((v) => v.triggerCapabilities),
              ...CLIENT_STORIES.flatMap((s) => s.capabilities),
            ]).size
          )}
          label="Capabilities Covered"
        />
      </div>

      <div className="inline-flex bg-white border border-slate-200 rounded-lg p-1 mb-6">
        <SubTab
          active={view === "vignettes"}
          onClick={() => setView("vignettes")}
          label="Workshop Vignettes"
          sublabel="Facilitation exercises"
        />
        <SubTab
          active={view === "stories"}
          onClick={() => setView("stories")}
          label="Client Stories"
          sublabel="Proof points"
        />
      </div>

      {view === "vignettes" ? (
        <CrmWorkshopVignettesList />
      ) : (
        <CrmClientStoriesList />
      )}
    </>
  );
}

function CrmWorkshopVignettesList() {
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [miroUrls, setMiroUrls] = useState<Record<string, string>>({});
  const [miroLoading, setMiroLoading] = useState<string | null>(null);

  const filtered =
    filter === "all"
      ? VIGNETTES
      : VIGNETTES.filter((v) => v.category === filter);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
            filter === "all"
              ? "text-white border-transparent"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          }`}
          style={
            filter === "all" ? { backgroundColor: "#0328d1" } : undefined
          }
        >
          All ({VIGNETTES.length})
        </button>
        {CRM_CATEGORIES.map((cat) => {
          const count = VIGNETTES.filter((v) => v.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                filter === cat
                  ? "text-white border-transparent"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
              style={
                filter === cat ? { backgroundColor: "#0328d1" } : undefined
              }
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Vignette cards */}
      <div className="space-y-3">
        {filtered.map((v) => {
          const isOpen = expanded === v.id;
          const relatedOpps = v.relatedOpportunityIds
            .map((id) => OPPORTUNITIES.find((o) => o.id === id))
            .filter(Boolean);

          return (
            <div
              key={v.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
              style={{ borderLeftWidth: "4px", borderLeftColor: "#0328d1" }}
            >
              <button
                type="button"
                className="w-full text-left px-5 py-4"
                onClick={() => setExpanded(isOpen ? null : v.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-m2-navy text-white">
                        {v.durationMinutes} min
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {v.category}
                      </span>
                      {v.triggerCapabilities.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600"
                        >
                          {CAPABILITY_LABELS[c] || c}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {v.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {v.description}
                    </p>
                  </div>
                  <Chevron open={isOpen} />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Facilitation Guide
                    </p>
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 border border-slate-100 rounded-lg p-4">
                      {v.facilitationGuide.split("**").map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={i}>{part}</strong>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <BulletList
                      title="Required Inputs / Pre-Work"
                      items={v.requiredInputs}
                      bulletClass="text-amber-500"
                      bullet="*"
                    />
                    <BulletList
                      title="Expected Outputs"
                      items={v.expectedOutputs}
                      bulletClass="text-green-500"
                      bullet="+"
                    />
                  </div>

                  {relatedOpps.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Triggered By These Opportunities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {relatedOpps.map(
                          (opp) =>
                            opp && (
                              <span
                                key={opp.id}
                                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100"
                              >
                                {opp.title}
                              </span>
                            )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Miro board */}
                  <div className="pt-2 border-t border-slate-100">
                    {miroUrls[v.id] ? (
                      <a
                        href={miroUrls[v.id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
                        style={{
                          backgroundColor: "#FFD02F",
                          color: "#050038",
                        }}
                      >
                        Open Miro Board →
                      </a>
                    ) : (
                      <button
                        onClick={async () => {
                          setMiroLoading(v.id);
                          try {
                            const res = await fetch(
                              `/api/vignettes/${v.id}/miro`,
                              { method: "POST" }
                            );
                            if (!res.ok) {
                              const err = await res.json();
                              alert(err.error || "Failed to create Miro board");
                              return;
                            }
                            const data = await res.json();
                            setMiroUrls((prev) => ({
                              ...prev,
                              [v.id]: data.boardUrl,
                            }));
                            window.open(data.boardUrl, "_blank");
                          } finally {
                            setMiroLoading(null);
                          }
                        }}
                        disabled={miroLoading === v.id}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                      >
                        {miroLoading === v.id
                          ? "Creating..."
                          : "Generate Miro Board"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function CrmClientStoriesList() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {CLIENT_STORIES.map((s) => {
        const isOpen = expanded === s.id;
        return (
          <div
            key={s.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
            style={{ borderLeftWidth: "4px", borderLeftColor: "#0328d1" }}
          >
            <button
              type="button"
              className="w-full text-left px-5 py-4"
              onClick={() => setExpanded(isOpen ? null : s.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {s.capabilities.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600"
                      >
                        {CAPABILITY_LABELS[c] || c}
                      </span>
                    ))}
                    {s.industries?.map((ind) => (
                      <span
                        key={ind}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 capitalize"
                      >
                        {ind.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5 italic">
                    {s.tagline}
                  </p>
                </div>
                <Chevron open={isOpen} />
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Narrative
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-4">
                    {s.narrative}
                  </p>
                </div>

                {s.outcomes && s.outcomes.length > 0 && (
                  <BulletList
                    title="Outcomes"
                    items={s.outcomes}
                    bulletClass="text-green-500"
                    bullet="+"
                  />
                )}

                {s.prompts && s.prompts.length > 0 && (
                  <BulletList
                    title="Discussion Prompts"
                    items={s.prompts}
                    bulletClass="text-amber-500"
                    bullet="?"
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── CSC library – workshop exercises + anonymized client stories ──

function CscLibrary() {
  const [view, setView] = useState<"vignettes" | "stories">("vignettes");

  return (
    <>
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat
          value={String(CSC_VIGNETTES.length)}
          label="Workshop Vignettes"
        />
        <Stat
          value={`${Math.round(
            CSC_VIGNETTES.reduce((s, v) => s + v.durationMinutes, 0) / 60
          )}h`}
          label="Total Content"
        />
        <Stat
          value={String(CSC_CLIENT_STORIES.length)}
          label="Client Stories"
        />
        <Stat
          value={String(
            new Set([
              ...CSC_VIGNETTES.flatMap((v) => v.triggerCapabilities),
              ...CSC_CLIENT_STORIES.flatMap((s) => s.capabilities),
            ]).size
          )}
          label="Capabilities Covered"
        />
      </div>

      {/* Sub-section toggle */}
      <div className="inline-flex bg-white border border-slate-200 rounded-lg p-1 mb-6">
        <SubTab
          active={view === "vignettes"}
          onClick={() => setView("vignettes")}
          label="Workshop Vignettes"
          sublabel="Facilitation exercises"
        />
        <SubTab
          active={view === "stories"}
          onClick={() => setView("stories")}
          label="Client Stories"
          sublabel="Proof points"
        />
      </div>

      {view === "vignettes" ? <CscWorkshopVignettesList /> : <CscClientStoriesList />}
    </>
  );
}

function SubTab({
  active,
  onClick,
  label,
  sublabel,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sublabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-left transition-colors ${
        active ? "bg-m2-navy text-white" : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span className="block text-xs font-semibold">{label}</span>
      <span
        className={`block text-[10px] mt-0.5 ${
          active ? "text-white/70" : "text-slate-400"
        }`}
      >
        {sublabel}
      </span>
    </button>
  );
}

// Workshop vignettes – same UI shape as the CRM vignette cards.
function CscWorkshopVignettesList() {
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const categories = Array.from(
    new Set(CSC_VIGNETTES.map((v) => v.category))
  ).sort();
  const filtered =
    filter === "all"
      ? CSC_VIGNETTES
      : CSC_VIGNETTES.filter((v) => v.category === filter);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
            filter === "all"
              ? "text-white border-transparent"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          }`}
          style={
            filter === "all" ? { backgroundColor: "#0328d1" } : undefined
          }
        >
          All ({CSC_VIGNETTES.length})
        </button>
        {categories.map((cat) => {
          const count = CSC_VIGNETTES.filter((v) => v.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                filter === cat
                  ? "text-white border-transparent"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
              style={
                filter === cat ? { backgroundColor: "#0328d1" } : undefined
              }
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((v) => {
          const isOpen = expanded === v.id;
          const relatedOpps = v.relatedOpportunityIds
            .map((id) => CSC_OPPORTUNITIES.find((o) => o.id === id))
            .filter(Boolean);

          return (
            <div
              key={v.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
              style={{ borderLeftWidth: "4px", borderLeftColor: "#0328d1" }}
            >
              <button
                type="button"
                className="w-full text-left px-5 py-4"
                onClick={() => setExpanded(isOpen ? null : v.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-m2-navy text-white">
                        {v.durationMinutes} min
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {v.category}
                      </span>
                      {v.triggerCapabilities.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600"
                        >
                          {CSC_CAPABILITY_LABELS[c] || c}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {v.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {v.description}
                    </p>
                  </div>
                  <Chevron open={isOpen} />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Facilitation Guide
                    </p>
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 border border-slate-100 rounded-lg p-4">
                      {v.facilitationGuide.split("**").map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={i}>{part}</strong>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <BulletList
                      title="Required Inputs / Pre-Work"
                      items={v.requiredInputs}
                      bulletClass="text-amber-500"
                      bullet="*"
                    />
                    <BulletList
                      title="Expected Outputs"
                      items={v.expectedOutputs}
                      bulletClass="text-green-500"
                      bullet="+"
                    />
                  </div>

                  {relatedOpps.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Anchors These Opportunities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {relatedOpps.map(
                          (opp) =>
                            opp && (
                              <span
                                key={opp.id}
                                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100"
                              >
                                {opp.title}
                              </span>
                            )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

// Client stories – kept for proof-point recall during pitch.
function CscClientStoriesList() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {CSC_CLIENT_STORIES.map((s) => {
        const isOpen = expanded === s.id;
        return (
          <div
            key={s.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
            style={{ borderLeftWidth: "4px", borderLeftColor: "#0328d1" }}
          >
            <button
              type="button"
              className="w-full text-left px-5 py-4"
              onClick={() => setExpanded(isOpen ? null : s.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {s.capabilities.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600"
                      >
                        {CSC_CAPABILITY_LABELS[c] || c}
                      </span>
                    ))}
                    {s.industries?.map((ind) => (
                      <span
                        key={ind}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 capitalize"
                      >
                        {ind.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5 italic">
                    {s.tagline}
                  </p>
                </div>
                <Chevron open={isOpen} />
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Narrative
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-4">
                    {s.narrative}
                  </p>
                </div>

                {s.outcomes && s.outcomes.length > 0 && (
                  <BulletList
                    title="Outcomes"
                    items={s.outcomes}
                    bulletClass="text-green-500"
                    bullet="+"
                  />
                )}

                {s.prompts && s.prompts.length > 0 && (
                  <BulletList
                    title="Discussion Prompts"
                    items={s.prompts}
                    bulletClass="text-amber-500"
                    bullet="?"
                  />
                )}
              </div>
            )}
          </div>
        );
      })}

      {CSC_CLIENT_STORIES.length === 0 && (
        <p className="text-sm text-slate-500">
          No CSC stories yet – they&apos;ll appear here as the catalog grows.
        </p>
      )}
    </div>
  );
}

// ── B2B library – workshop exercises + client stories ────────────

function B2bLibrary() {
  const [view, setView] = useState<"vignettes" | "stories">("vignettes");

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat
          value={String(B2B_VIGNETTES.length)}
          label="Workshop Vignettes"
        />
        <Stat
          value={`${Math.round(
            B2B_VIGNETTES.reduce((s, v) => s + v.durationMinutes, 0) / 60
          )}h`}
          label="Total Content"
        />
        <Stat
          value={String(B2B_CLIENT_STORIES.length)}
          label="Client Stories"
        />
        <Stat
          value={String(
            new Set([
              ...B2B_VIGNETTES.flatMap((v) => v.triggerCapabilities),
              ...B2B_CLIENT_STORIES.flatMap((s) => s.capabilities),
            ]).size
          )}
          label="Capabilities Covered"
        />
      </div>

      <div className="inline-flex bg-white border border-slate-200 rounded-lg p-1 mb-6">
        <SubTab
          active={view === "vignettes"}
          onClick={() => setView("vignettes")}
          label="Workshop Vignettes"
          sublabel="Facilitation exercises"
        />
        <SubTab
          active={view === "stories"}
          onClick={() => setView("stories")}
          label="Client Stories"
          sublabel="Proof points"
        />
      </div>

      {view === "vignettes" ? <B2bWorkshopVignettesList /> : <B2bClientStoriesList />}
    </>
  );
}

function B2bWorkshopVignettesList() {
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const categories = Array.from(
    new Set(B2B_VIGNETTES.map((v) => v.category))
  ).sort();
  const filtered =
    filter === "all"
      ? B2B_VIGNETTES
      : B2B_VIGNETTES.filter((v) => v.category === filter);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
            filter === "all"
              ? "text-white border-transparent"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          }`}
          style={
            filter === "all" ? { backgroundColor: "#0328d1" } : undefined
          }
        >
          All ({B2B_VIGNETTES.length})
        </button>
        {categories.map((cat) => {
          const count = B2B_VIGNETTES.filter((v) => v.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                filter === cat
                  ? "text-white border-transparent"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
              style={
                filter === cat ? { backgroundColor: "#0328d1" } : undefined
              }
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((v) => {
          const isOpen = expanded === v.id;
          const relatedOpps = v.relatedOpportunityIds
            .map((id) => B2B_OPPORTUNITIES.find((o) => o.id === id))
            .filter(Boolean);

          return (
            <div
              key={v.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
              style={{ borderLeftWidth: "4px", borderLeftColor: "#0328d1" }}
            >
              <button
                type="button"
                className="w-full text-left px-5 py-4"
                onClick={() => setExpanded(isOpen ? null : v.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-m2-navy text-white">
                        {v.durationMinutes} min
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {v.category}
                      </span>
                      {v.triggerCapabilities.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600"
                        >
                          {B2B_CAPABILITY_LABELS[c] || c}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {v.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {v.description}
                    </p>
                  </div>
                  <Chevron open={isOpen} />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Facilitation Guide
                    </p>
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 border border-slate-100 rounded-lg p-4">
                      {v.facilitationGuide.split("**").map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={i}>{part}</strong>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <BulletList
                      title="Required Inputs / Pre-Work"
                      items={v.requiredInputs}
                      bulletClass="text-amber-500"
                      bullet="*"
                    />
                    <BulletList
                      title="Expected Outputs"
                      items={v.expectedOutputs}
                      bulletClass="text-green-500"
                      bullet="+"
                    />
                  </div>

                  {relatedOpps.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Anchors These Opportunities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {relatedOpps.map(
                          (opp) =>
                            opp && (
                              <span
                                key={opp.id}
                                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100"
                              >
                                {opp.title}
                              </span>
                            )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function B2bClientStoriesList() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {B2B_CLIENT_STORIES.map((s) => {
        const isOpen = expanded === s.id;
        return (
          <div
            key={s.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
            style={{ borderLeftWidth: "4px", borderLeftColor: "#0328d1" }}
          >
            <button
              type="button"
              className="w-full text-left px-5 py-4"
              onClick={() => setExpanded(isOpen ? null : s.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {s.capabilities.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600"
                      >
                        {B2B_CAPABILITY_LABELS[c] || c}
                      </span>
                    ))}
                    {s.industries?.map((ind) => (
                      <span
                        key={ind}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 capitalize"
                      >
                        {ind.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5 italic">
                    {s.tagline}
                  </p>
                </div>
                <Chevron open={isOpen} />
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Narrative
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-4">
                    {s.narrative}
                  </p>
                </div>

                {s.outcomes && s.outcomes.length > 0 && (
                  <BulletList
                    title="Outcomes"
                    items={s.outcomes}
                    bulletClass="text-green-500"
                    bullet="+"
                  />
                )}

                {s.prompts && s.prompts.length > 0 && (
                  <BulletList
                    title="Discussion Prompts"
                    items={s.prompts}
                    bulletClass="text-amber-500"
                    bullet="?"
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── AICX library – workshop exercises + client stories ────────────

function AicxLibrary() {
  const [view, setView] = useState<"vignettes" | "stories">("vignettes");

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat
          value={String(AICX_VIGNETTES.length)}
          label="Workshop Vignettes"
        />
        <Stat
          value={`${Math.round(
            AICX_VIGNETTES.reduce((s, v) => s + v.durationMinutes, 0) / 60
          )}h`}
          label="Total Content"
        />
        <Stat
          value={String(AICX_CLIENT_STORIES.length)}
          label="Client Stories"
        />
        <Stat
          value={String(
            new Set([
              ...AICX_VIGNETTES.flatMap((v) => v.triggerCapabilities),
              ...AICX_CLIENT_STORIES.flatMap((s) => s.capabilities),
            ]).size
          )}
          label="Capabilities Covered"
        />
      </div>

      <div className="inline-flex bg-white border border-slate-200 rounded-lg p-1 mb-6">
        <SubTab
          active={view === "vignettes"}
          onClick={() => setView("vignettes")}
          label="Workshop Vignettes"
          sublabel="Facilitation exercises"
        />
        <SubTab
          active={view === "stories"}
          onClick={() => setView("stories")}
          label="Client Stories"
          sublabel="Proof points"
        />
      </div>

      {view === "vignettes" ? <AicxWorkshopVignettesList /> : <AicxClientStoriesList />}
    </>
  );
}

function AicxWorkshopVignettesList() {
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const categories = Array.from(
    new Set(AICX_VIGNETTES.map((v) => v.category))
  ).sort();
  const filtered =
    filter === "all"
      ? AICX_VIGNETTES
      : AICX_VIGNETTES.filter((v) => v.category === filter);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
            filter === "all"
              ? "text-white border-transparent"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          }`}
          style={
            filter === "all" ? { backgroundColor: "#0328d1" } : undefined
          }
        >
          All ({AICX_VIGNETTES.length})
        </button>
        {categories.map((cat) => {
          const count = AICX_VIGNETTES.filter((v) => v.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                filter === cat
                  ? "text-white border-transparent"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
              style={
                filter === cat ? { backgroundColor: "#0328d1" } : undefined
              }
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((v) => {
          const isOpen = expanded === v.id;
          const relatedOpps = v.relatedOpportunityIds
            .map((id) => AICX_OPPORTUNITIES.find((o) => o.id === id))
            .filter(Boolean);

          return (
            <div
              key={v.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
              style={{ borderLeftWidth: "4px", borderLeftColor: "#0328d1" }}
            >
              <button
                type="button"
                className="w-full text-left px-5 py-4"
                onClick={() => setExpanded(isOpen ? null : v.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-m2-navy text-white">
                        {v.durationMinutes} min
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {v.category}
                      </span>
                      {v.triggerCapabilities.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600"
                        >
                          {AICX_CAPABILITY_LABELS[c] || c}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {v.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {v.description}
                    </p>
                  </div>
                  <Chevron open={isOpen} />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Facilitation Guide
                    </p>
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 border border-slate-100 rounded-lg p-4">
                      {v.facilitationGuide.split("**").map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={i}>{part}</strong>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <BulletList
                      title="Required Inputs / Pre-Work"
                      items={v.requiredInputs}
                      bulletClass="text-amber-500"
                      bullet="*"
                    />
                    <BulletList
                      title="Expected Outputs"
                      items={v.expectedOutputs}
                      bulletClass="text-green-500"
                      bullet="+"
                    />
                  </div>

                  {relatedOpps.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Anchors These Opportunities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {relatedOpps.map(
                          (opp) =>
                            opp && (
                              <span
                                key={opp.id}
                                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100"
                              >
                                {opp.title}
                              </span>
                            )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function AicxClientStoriesList() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {AICX_CLIENT_STORIES.map((s) => {
        const isOpen = expanded === s.id;
        return (
          <div
            key={s.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
            style={{ borderLeftWidth: "4px", borderLeftColor: "#0328d1" }}
          >
            <button
              type="button"
              className="w-full text-left px-5 py-4"
              onClick={() => setExpanded(isOpen ? null : s.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {s.capabilities.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600"
                      >
                        {AICX_CAPABILITY_LABELS[c] || c}
                      </span>
                    ))}
                    {s.industries?.map((ind) => (
                      <span
                        key={ind}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 capitalize"
                      >
                        {ind.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5 italic">
                    {s.tagline}
                  </p>
                </div>
                <Chevron open={isOpen} />
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Narrative
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-4">
                    {s.narrative}
                  </p>
                </div>

                {s.outcomes && s.outcomes.length > 0 && (
                  <BulletList
                    title="Outcomes"
                    items={s.outcomes}
                    bulletClass="text-green-500"
                    bullet="+"
                  />
                )}

                {s.prompts && s.prompts.length > 0 && (
                  <BulletList
                    title="Discussion Prompts"
                    items={s.prompts}
                    bulletClass="text-amber-500"
                    bullet="?"
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── AIENT library – workshop exercises + client stories ────────────

function AientLibrary() {
  const [view, setView] = useState<"vignettes" | "stories">("vignettes");

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat
          value={String(AIENT_VIGNETTES.length)}
          label="Workshop Vignettes"
        />
        <Stat
          value={`${Math.round(
            AIENT_VIGNETTES.reduce((s, v) => s + v.durationMinutes, 0) / 60
          )}h`}
          label="Total Content"
        />
        <Stat
          value={String(AIENT_CLIENT_STORIES.length)}
          label="Client Stories"
        />
        <Stat
          value={String(
            new Set([
              ...AIENT_VIGNETTES.flatMap((v) => v.triggerCapabilities),
              ...AIENT_CLIENT_STORIES.flatMap((s) => s.capabilities),
            ]).size
          )}
          label="Capabilities Covered"
        />
      </div>

      <div className="inline-flex bg-white border border-slate-200 rounded-lg p-1 mb-6">
        <SubTab
          active={view === "vignettes"}
          onClick={() => setView("vignettes")}
          label="Workshop Vignettes"
          sublabel="Facilitation exercises"
        />
        <SubTab
          active={view === "stories"}
          onClick={() => setView("stories")}
          label="Client Stories"
          sublabel="Proof points"
        />
      </div>

      {view === "vignettes" ? <AientWorkshopVignettesList /> : <AientClientStoriesList />}
    </>
  );
}

function AientWorkshopVignettesList() {
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const categories = Array.from(
    new Set(AIENT_VIGNETTES.map((v) => v.category))
  ).sort();
  const filtered =
    filter === "all"
      ? AIENT_VIGNETTES
      : AIENT_VIGNETTES.filter((v) => v.category === filter);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
            filter === "all"
              ? "text-white border-transparent"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          }`}
          style={
            filter === "all" ? { backgroundColor: "#0328d1" } : undefined
          }
        >
          All ({AIENT_VIGNETTES.length})
        </button>
        {categories.map((cat) => {
          const count = AIENT_VIGNETTES.filter((v) => v.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                filter === cat
                  ? "text-white border-transparent"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
              style={
                filter === cat ? { backgroundColor: "#0328d1" } : undefined
              }
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((v) => {
          const isOpen = expanded === v.id;
          const relatedOpps = v.relatedOpportunityIds
            .map((id) => AIENT_OPPORTUNITIES.find((o) => o.id === id))
            .filter(Boolean);

          return (
            <div
              key={v.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
              style={{ borderLeftWidth: "4px", borderLeftColor: "#0328d1" }}
            >
              <button
                type="button"
                className="w-full text-left px-5 py-4"
                onClick={() => setExpanded(isOpen ? null : v.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-m2-navy text-white">
                        {v.durationMinutes} min
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {v.category}
                      </span>
                      {v.triggerCapabilities.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600"
                        >
                          {AIENT_CAPABILITY_LABELS[c] || c}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {v.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {v.description}
                    </p>
                  </div>
                  <Chevron open={isOpen} />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Facilitation Guide
                    </p>
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 border border-slate-100 rounded-lg p-4">
                      {v.facilitationGuide.split("**").map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={i}>{part}</strong>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <BulletList
                      title="Required Inputs / Pre-Work"
                      items={v.requiredInputs}
                      bulletClass="text-amber-500"
                      bullet="*"
                    />
                    <BulletList
                      title="Expected Outputs"
                      items={v.expectedOutputs}
                      bulletClass="text-green-500"
                      bullet="+"
                    />
                  </div>

                  {relatedOpps.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Anchors These Opportunities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {relatedOpps.map(
                          (opp) =>
                            opp && (
                              <span
                                key={opp.id}
                                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100"
                              >
                                {opp.title}
                              </span>
                            )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function AientClientStoriesList() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {AIENT_CLIENT_STORIES.map((s) => {
        const isOpen = expanded === s.id;
        return (
          <div
            key={s.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
            style={{ borderLeftWidth: "4px", borderLeftColor: "#0328d1" }}
          >
            <button
              type="button"
              className="w-full text-left px-5 py-4"
              onClick={() => setExpanded(isOpen ? null : s.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {s.capabilities.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600"
                      >
                        {AIENT_CAPABILITY_LABELS[c] || c}
                      </span>
                    ))}
                    {s.industries?.map((ind) => (
                      <span
                        key={ind}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 capitalize"
                      >
                        {ind.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5 italic">
                    {s.tagline}
                  </p>
                </div>
                <Chevron open={isOpen} />
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Narrative
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-4">
                    {s.narrative}
                  </p>
                </div>

                {s.outcomes && s.outcomes.length > 0 && (
                  <BulletList
                    title="Outcomes"
                    items={s.outcomes}
                    bulletClass="text-green-500"
                    bullet="+"
                  />
                )}

                {s.prompts && s.prompts.length > 0 && (
                  <BulletList
                    title="Discussion Prompts"
                    items={s.prompts}
                    bulletClass="text-amber-500"
                    bullet="?"
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ── Shared bits ───────────────────────────────────────────────────

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
      <p className="text-2xl font-bold" style={{ color: "#0328d1" }}>
        {value}
      </p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-slate-400 flex-shrink-0 mt-1 transition-transform ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function BulletList({
  title,
  items,
  bulletClass,
  bullet,
}: {
  title: string;
  items: string[];
  bulletClass: string;
  bullet: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-700 flex gap-2">
            <span className={`mt-0.5 flex-shrink-0 ${bulletClass}`}>
              {bullet}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

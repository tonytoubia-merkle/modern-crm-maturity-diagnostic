"use client";

import { useState } from "react";
import { VIGNETTES } from "@/lib/data/vignettes";
import { OPPORTUNITIES } from "@/lib/data/opportunities";
import { CAPABILITY_LABELS } from "@/lib/data/questions";

const CATEGORIES = Array.from(new Set(VIGNETTES.map((v) => v.category))).sort();

export default function LibraryPage() {
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [miroUrls, setMiroUrls] = useState<Record<string, string>>({});
  const [miroLoading, setMiroLoading] = useState<string | null>(null);

  const filtered =
    filter === "all"
      ? VIGNETTES
      : VIGNETTES.filter((v) => v.category === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <div style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/merkle-logo.webp" alt="Merkle" className="h-4 w-auto brightness-0 invert" />
          <a href="/crm" className="text-xs text-white/70 hover:text-white transition-colors">
            ← Modern CRM Diagnostic
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#00205B" }}>
            Workshop Library
          </p>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Workshop Vignettes & Exercises
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Browse all available workshop exercises. Each vignette is triggered by
            specific diagnostic outcomes and includes a facilitation guide,
            required inputs, and expected deliverables.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              filter === "all"
                ? "text-white border-transparent"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
            style={filter === "all" ? { backgroundColor: "#00205B" } : undefined}
          >
            All ({VIGNETTES.length})
          </button>
          {CATEGORIES.map((cat) => {
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
                style={filter === cat ? { backgroundColor: "#00205B" } : undefined}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: "#00205B" }}>{VIGNETTES.length}</p>
            <p className="text-xs text-slate-500">Total Vignettes</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: "#00205B" }}>
              {Math.round(VIGNETTES.reduce((s, v) => s + v.durationMinutes, 0) / 60)}h
            </p>
            <p className="text-xs text-slate-500">Total Content</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: "#00205B" }}>{CATEGORIES.length}</p>
            <p className="text-xs text-slate-500">Categories</p>
          </div>
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
                style={{ borderLeftWidth: "4px", borderLeftColor: "#00205B" }}
              >
                <button
                  type="button"
                  className="w-full text-left px-5 py-4"
                  onClick={() => setExpanded(isOpen ? null : v.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ backgroundColor: "#00205B", color: "white" }}>
                          {v.durationMinutes} min
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {v.category}
                        </span>
                        {v.triggerCapabilities.map((c) => (
                          <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                            {CAPABILITY_LABELS[c] || c}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{v.title}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{v.description}</p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 mt-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                    {/* Facilitation guide */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Facilitation Guide
                      </p>
                      <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 border border-slate-100 rounded-lg p-4">
                        {v.facilitationGuide.split("**").map((part, i) =>
                          i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Required inputs */}
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Required Inputs / Pre-Work
                        </p>
                        <ul className="space-y-1">
                          {v.requiredInputs.map((input, i) => (
                            <li key={i} className="text-sm text-slate-700 flex gap-2">
                              <span className="text-amber-500 mt-0.5 flex-shrink-0">*</span>
                              {input}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Expected outputs */}
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Expected Outputs
                        </p>
                        <ul className="space-y-1">
                          {v.expectedOutputs.map((output, i) => (
                            <li key={i} className="text-sm text-slate-700 flex gap-2">
                              <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
                              {output}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Triggered by */}
                    {relatedOpps.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Triggered By These Opportunities
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {relatedOpps.map((opp) => opp && (
                            <span
                              key={opp.id}
                              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100"
                            >
                              {opp.title}
                            </span>
                          ))}
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
                          style={{ backgroundColor: "#FFD02F", color: "#050038" }}
                        >
                          Open Miro Board →
                        </a>
                      ) : (
                        <button
                          onClick={async () => {
                            setMiroLoading(v.id);
                            try {
                              const res = await fetch(`/api/vignettes/${v.id}/miro`, { method: "POST" });
                              if (!res.ok) {
                                const err = await res.json();
                                alert(err.error || "Failed to create Miro board");
                                return;
                              }
                              const data = await res.json();
                              setMiroUrls((prev) => ({ ...prev, [v.id]: data.boardUrl }));
                              window.open(data.boardUrl, "_blank");
                            } finally {
                              setMiroLoading(null);
                            }
                          }}
                          disabled={miroLoading === v.id}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                          {miroLoading === v.id ? "Creating..." : "Generate Miro Board"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

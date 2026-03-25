"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CAPABILITY_LABELS } from "@/lib/data/questions";
import type { Opportunity } from "@/lib/types";

interface OpportunityCardsProps {
  opportunities: Opportunity[];
  clientMode?: boolean;
}

const PRIORITY_STYLES: Record<
  string,
  { badge: string; border: string }
> = {
  critical: {
    badge: "bg-red-100 text-red-700 border-red-200",
    border: "border-l-red-500",
  },
  high: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    border: "border-l-amber-500",
  },
  medium: {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    border: "border-l-blue-500",
  },
  innovation: {
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    border: "border-l-purple-500",
  },
};

export function OpportunityCards({ opportunities, clientMode = false }: OpportunityCardsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (opportunities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p>No specific opportunities identified at this time.</p>
      </div>
    );
  }

  // Client mode: simplified cards without expandable detail
  if (clientMode) {
    return (
      <div className="space-y-4">
        {opportunities.map((opp) => {
          const styles = PRIORITY_STYLES[opp.priority];
          return (
            <div
              key={opp.id}
              className={cn(
                "rounded-xl border bg-white overflow-hidden border-l-4 px-6 py-4",
                styles.border
              )}
            >
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded border",
                    styles.badge
                  )}
                >
                  {opp.priority.charAt(0).toUpperCase() + opp.priority.slice(1)} Priority
                </span>
                {opp.capabilities.map((c) => (
                  <span
                    key={c}
                    className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                  >
                    {CAPABILITY_LABELS[c]}
                  </span>
                ))}
              </div>
              <h4 className="text-base font-bold text-slate-900">{opp.title}</h4>
              <p className="text-sm text-slate-600 mt-0.5">{opp.tagline}</p>
              <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                {opp.description.split(".").slice(0, 2).join(".") + "."}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  // Internal mode: full expandable cards
  return (
    <div className="space-y-4">
      {opportunities.map((opp) => {
        const isOpen = expanded === opp.id;
        const styles = PRIORITY_STYLES[opp.priority];
        return (
          <div
            key={opp.id}
            className={cn(
              "rounded-xl border bg-white overflow-hidden border-l-4 transition-shadow",
              isOpen ? "shadow-md" : "shadow-sm hover:shadow-md",
              styles.border
            )}
          >
            <button
              type="button"
              className="w-full text-left px-6 py-4"
              onClick={() => setExpanded(isOpen ? null : opp.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded border",
                        styles.badge
                      )}
                    >
                      {opp.priority.charAt(0).toUpperCase() + opp.priority.slice(1)} Priority
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {opp.sfType}
                    </span>
                    {opp.capabilities.map((c) => (
                      <span
                        key={c}
                        className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                      >
                        {CAPABILITY_LABELS[c]}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {opp.title}
                  </h4>
                  <p className="text-sm text-slate-600 mt-0.5">{opp.tagline}</p>
                </div>
                <div className="flex-shrink-0 text-slate-400 mt-1">
                  <svg
                    className={cn(
                      "w-5 h-5 transition-transform",
                      isOpen ? "rotate-180" : ""
                    )}
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
                </div>
              </div>
            </button>

            {isOpen && (
              <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {opp.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Scope
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {opp.scope}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Key Methods
                    </p>
                    <ul className="space-y-1">
                      {opp.methods.map((m, i) => (
                        <li
                          key={i}
                          className="text-sm text-slate-700 flex gap-2"
                        >
                          <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1.5">
                    Business Value
                  </p>
                  <p className="text-sm text-blue-900 leading-relaxed">
                    {opp.valueNarrative}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="font-medium">Engagement Size:</span>
                  <span>{opp.engagementSize}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

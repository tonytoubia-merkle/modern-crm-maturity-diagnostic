"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { MATURITY_STAGES } from "@/lib/scoring";
import type { DiagnosticResults } from "@/lib/types";

interface SalesforceOutputProps {
  results: DiagnosticResults;
}

function generateNarrative(results: DiagnosticResults): string {
  const { assessment, overallScore, maturityStage, maturityLabel, capabilityScores } = results;

  const weakCapabilities = capabilityScores
    .filter((s) => s.score < 3.0)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const weakList = weakCapabilities
    .map((s) => `${s.label} (${s.score.toFixed(1)})`)
    .join(", ");

  const stageInfo = MATURITY_STAGES[maturityStage];

  return `${assessment.clientName} (${assessment.clientCompany}) completed a Modern CRM Maturity Diagnostic on ${formatDate(assessment.createdAt)}, scoring ${overallScore.toFixed(1)} out of 5.0 and placing at ${maturityLabel}. ${stageInfo.description} Key capability gaps were identified in ${weakList || "several areas"}, representing priority areas for transformation investment. Merkle's Modern CRM practice is positioned to support ${assessment.clientName} in building a connected customer engagement engine that turns first-party data into coordinated growth.`;
}

function generateOpportunityTable(results: DiagnosticResults): string {
  const rows = results.opportunities
    .slice(0, 5)
    .map(
      (opp) =>
        `${opp.title} | ${opp.sfType} | ${opp.priority.charAt(0).toUpperCase() + opp.priority.slice(1)} | ${opp.engagementSize} | ${opp.valueNarrative.slice(0, 80)}…`
    )
    .join("\n");
  return `Opportunity Name | Type | Priority | Estimated Engagement | Value Summary\n${"─".repeat(80)}\n${rows}`;
}

export function SalesforceOutput({ results }: SalesforceOutputProps) {
  const [copied, setCopied] = useState<"narrative" | "table" | null>(null);

  const narrative = generateNarrative(results);
  const opportunityTable = generateOpportunityTable(results);

  const copy = async (text: string, type: "narrative" | "table") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-1">
          Account Narrative
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Ready to paste into Salesforce account notes or an opportunity description.
        </p>
        <div className="relative">
          <textarea
            readOnly
            value={narrative}
            rows={5}
            className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 resize-none focus:outline-none"
          />
          <button
            onClick={() => copy(narrative, "narrative")}
            className="absolute top-2.5 right-2.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-sm"
          >
            {copied === "narrative" ? "✓ Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-1">
          Opportunity Pipeline Table
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Paste into Salesforce opportunity descriptions, proposal documents, or pipeline planning tools.
        </p>
        <div className="relative">
          <pre className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
            {opportunityTable}
          </pre>
          <button
            onClick={() => copy(opportunityTable, "table")}
            className="absolute top-2.5 right-2.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-sm"
          >
            {copied === "table" ? "✓ Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Structured opportunity cards for SF */}
      <div className="border-t border-slate-100 pt-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          Individual Opportunity Records
        </h3>
        <div className="space-y-3">
          {results.opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white border border-slate-200 rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {opp.sfType}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {opp.engagementSize}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-1">
                    {opp.title}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {opp.valueNarrative}
                  </p>
                </div>
                <button
                  onClick={() =>
                    copy(
                      `Opportunity: ${opp.title}\nType: ${opp.sfType}\nPriority: ${opp.priority}\nEngagement Size: ${opp.engagementSize}\n\nDescription:\n${opp.description}\n\nBusiness Value:\n${opp.valueNarrative}\n\nKey Methods:\n${opp.methods.map((m) => `• ${m}`).join("\n")}`,
                      "table"
                    )
                  }
                  className="flex-shrink-0 text-xs font-medium text-blue-600 hover:text-blue-800 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

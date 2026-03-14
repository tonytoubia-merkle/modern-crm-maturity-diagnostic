"use client";

import { useState, useRef } from "react";
import { MaturityStageCard } from "./MaturityStageCard";
import { CapabilityHeatmap } from "./CapabilityHeatmap";
import { OpportunityCards } from "./OpportunityCards";
import { SalesforceOutput } from "./SalesforceOutput";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { INDUSTRY_LABELS, CORE_QUESTIONS, INDUSTRY_QUESTIONS } from "@/lib/data/questions";
import type { DiagnosticResults, ResponseItem } from "@/lib/types";

interface ResultsViewProps {
  results: DiagnosticResults;
  shareId: string;
  responses?: ResponseItem[];
}

const ALL_QUESTIONS = [...CORE_QUESTIONS, ...INDUSTRY_QUESTIONS];

function getQuestionText(questionId: string | number): string {
  const q = ALL_QUESTIONS.find((q) => String(q.id) === String(questionId));
  return q?.text ?? `Question ${questionId}`;
}

export function ResultsView({ results, shareId, responses = [] }: ResultsViewProps) {
  const { assessment, capabilityScores, overallScore, maturityStage, opportunities } = results;
  const [sharecopied, setShareCopied] = useState(false);
  const [exportingPptx, setExportingPptx] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/results/${shareId}`
      : `/results/${shareId}`;

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPptx = async () => {
    setExportingPptx(true);
    try {
      const res = await fetch(`/api/export/${shareId}/ppt`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${assessment.clientName}_CRM_Diagnostic.pptx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExportingPptx(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">
      {/* Print styles injected via global.css */}
      <div className="max-w-4xl mx-auto px-4 py-10" ref={printRef}>
        {/* Header */}
        <div className="mb-8 print:mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                Modern CRM Maturity Diagnostic
              </p>
              <h1 className="text-3xl font-bold text-slate-900">
                {assessment.clientName}
              </h1>
              <p className="text-slate-500 mt-1">
                {assessment.clientCompany}
                {assessment.industry &&
                  INDUSTRY_LABELS[assessment.industry] &&
                  ` · ${INDUSTRY_LABELS[assessment.industry]}`}
              </p>
              <p className="text-slate-400 text-sm mt-0.5">
                Completed {formatDate(assessment.createdAt)} · Assessed by{" "}
                {assessment.respondentName}
              </p>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button variant="secondary" size="sm" onClick={copyShareLink}>
                {sharecopied ? "✓ Copied!" : "Share Link"}
              </Button>
              <Button variant="secondary" size="sm" onClick={handlePrint}>
                Download PDF
              </Button>
              <Button variant="primary" size="sm" onClick={handleExportPptx} disabled={exportingPptx}>
                {exportingPptx ? "Generating…" : "Export PPTX"}
              </Button>
            </div>
          </div>
        </div>

        {/* Maturity stage */}
        <div className="mb-6">
          <MaturityStageCard stage={maturityStage} overallScore={overallScore} />
        </div>

        {/* Capability heatmap */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-bold text-slate-900">
              Capability Heatmap
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Scores across the six Modern CRM capability dimensions
            </p>
          </CardHeader>
          <CardContent>
            <CapabilityHeatmap scores={capabilityScores} />
          </CardContent>
        </Card>

        {/* Strategic opportunities */}
        {opportunities.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-bold text-slate-900">
                Strategic Opportunity Areas
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {opportunities.length} prioritized opportunities based on your
                capability gaps. Click each to expand scope and methods.
              </p>
            </CardHeader>
            <CardContent>
              <OpportunityCards opportunities={opportunities} />
            </CardContent>
          </Card>
        )}

        {/* Salesforce / Proposal output */}
        <Card className="mb-6 print:hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Pipeline & Proposal Output
              </h2>
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                Salesforce Ready
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Copy-ready narratives, opportunity tables, and individual records
              for Salesforce and proposal documents.
            </p>
          </CardHeader>
          <CardContent>
            <SalesforceOutput results={results} />
          </CardContent>
        </Card>

        {/* Respondent notes */}
        {responses.some((r) => r.notes) && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-bold text-slate-900">
                Respondent Notes &amp; Context
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Additional context provided during the assessment.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {responses
                  .filter((r) => r.notes)
                  .map((r) => (
                    <div
                      key={r.questionId}
                      className="border-l-2 border-blue-200 pl-4"
                    >
                      <p className="text-xs font-semibold text-slate-500 mb-1">
                        {getQuestionText(r.questionId)}
                      </p>
                      <p className="text-sm text-slate-800 leading-relaxed">
                        {r.notes}
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-t border-slate-200 print:hidden">
          <a
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            ← Start a new assessment
          </a>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={copyShareLink}>
              {sharecopied ? "✓ Link Copied!" : "Copy Share Link"}
            </Button>
            <Button variant="secondary" size="sm" onClick={handlePrint}>
              Download PDF
            </Button>
            <Button variant="primary" size="sm" onClick={handleExportPptx} disabled={exportingPptx}>
              {exportingPptx ? "Generating…" : "Export PPTX"}
            </Button>
          </div>
        </div>

        {/* Print footer */}
        <div className="hidden print:block mt-8 pt-4 border-t border-slate-200 text-xs text-slate-400">
          <p>
            Modern CRM Maturity Diagnostic · Merkle ·{" "}
            {new Date().getFullYear()} · {shareUrl}
          </p>
        </div>
      </div>
    </div>
  );
}

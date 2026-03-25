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
import type { DiagnosticResults, ResponseItem, ViewMode } from "@/lib/types";

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
  const [viewMode, setViewMode] = useState<ViewMode>("internal");
  const printRef = useRef<HTMLDivElement>(null);

  const isClient = viewMode === "client";

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
      a.download = `${assessment.clientName}_Modern_CRM_Diagnostic.pptx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExportingPptx(false);
    }
  };

  // In client mode, show max 5 opportunities and exclude innovation tier
  const displayOpportunities = isClient
    ? opportunities.filter((o) => o.priority !== "innovation").slice(0, 5)
    : opportunities;

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">
      <div className="max-w-4xl mx-auto px-4 py-10" ref={printRef}>
        {/* Header */}
        <div className="mb-8 print:mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/merkle-logo.webp" alt="Merkle" className="h-5 w-auto" />
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Modern CRM Maturity Diagnostic
                </span>
              </div>
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
            <div className="flex flex-col gap-2 print:hidden">
              {/* View mode toggle */}
              <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setViewMode("internal")}
                  className={`px-3 py-1.5 transition-colors ${
                    !isClient
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Internal
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("client")}
                  className={`px-3 py-1.5 transition-colors ${
                    isClient
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Client
                </button>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={copyShareLink}>
                  {sharecopied ? "Copied!" : "Share Link"}
                </Button>
                <Button variant="secondary" size="sm" onClick={handlePrint}>
                  Download PDF
                </Button>
                <Button variant="primary" size="sm" onClick={handleExportPptx} disabled={exportingPptx}>
                  {exportingPptx ? "Generating..." : "Export PPTX"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Framing text */}
        <Card className="mb-6">
          <CardContent>
            <div className="py-2">
              <p className="text-sm text-slate-700 leading-relaxed">
                {isClient ? (
                  <>
                    This report summarizes the findings of a Modern CRM Maturity Diagnostic
                    conducted for <strong>{assessment.clientName}</strong>. The assessment
                    evaluates six core capabilities — Identity, Signals, Decisioning, Engagement,
                    Media Activation, and Learning &amp; Optimization — that together determine how
                    effectively an organization turns customer data into coordinated engagement and
                    growth. Each capability is scored on a 1–5 scale and mapped to one of four
                    maturity stages. The opportunities below highlight the highest-impact areas for
                    advancement.
                  </>
                ) : (
                  <>
                    This diagnostic assessed <strong>{assessment.clientName}</strong> across
                    the six capabilities of Modern CRM — Identity, Signals, Decisioning,
                    Engagement, Media Activation, and Learning &amp; Optimization. Scores reflect
                    the respondent&apos;s assessment on a 1–5 maturity scale (1 = Not in Place,
                    3 = Operational, 5 = Optimized). Strategic opportunities are triggered by
                    capability gaps and sorted by priority. Use the Salesforce output section
                    below for pipeline and proposal development.
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

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
        {displayOpportunities.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-bold text-slate-900">
                {isClient ? "Key Opportunity Areas" : "Strategic Opportunity Areas"}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {isClient
                  ? `${displayOpportunities.length} prioritized opportunities based on your assessment results.`
                  : `${displayOpportunities.length} prioritized opportunities based on capability gaps. Click each to expand scope and methods.`}
              </p>
            </CardHeader>
            <CardContent>
              <OpportunityCards opportunities={displayOpportunities} clientMode={isClient} />
            </CardContent>
          </Card>
        )}

        {/* Salesforce / Proposal output — internal only */}
        {!isClient && (
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
        )}

        {/* Respondent notes — internal only */}
        {!isClient && responses.some((r) => r.notes) && (
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

        {/* Validation flags — internal only */}
        {!isClient && responses.some((r) => r.score === undefined || r.score === null) && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-bold text-slate-900">
                Validation Flags
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Questions marked &quot;Not sure / Requires validation&quot; by the respondent.
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Some questions were flagged for validation. Consider following up on these areas for a more complete assessment.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-t border-slate-200 print:hidden">
          <a
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Start a new assessment
          </a>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={copyShareLink}>
              {sharecopied ? "Link Copied!" : "Copy Share Link"}
            </Button>
            <Button variant="secondary" size="sm" onClick={handlePrint}>
              Download PDF
            </Button>
            <Button variant="primary" size="sm" onClick={handleExportPptx} disabled={exportingPptx}>
              {exportingPptx ? "Generating..." : "Export PPTX"}
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

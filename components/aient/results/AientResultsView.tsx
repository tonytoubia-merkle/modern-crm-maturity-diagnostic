"use client";

import { useState, useRef } from "react";
import { AientMaturityStageCard } from "./AientMaturityStageCard";
import { AientCapabilityHeatmap } from "./AientCapabilityHeatmap";
import { AientOpportunityCards } from "./AientOpportunityCards";
import { AientSalesforceOutput } from "./AientSalesforceOutput";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import {
  AIENT_INDUSTRY_LABELS,
  AIENT_CORE_QUESTIONS,
  AIENT_INDUSTRY_QUESTIONS,
} from "@/lib/aient/data/questions";
import type {
  AientDiagnosticResults,
  AientResponseItem,
  AientViewMode,
} from "@/lib/aient/types";

interface AientResultsViewProps {
  results: AientDiagnosticResults;
  shareId: string;
  responses?: AientResponseItem[];
}

const ALL_QUESTIONS = [...AIENT_CORE_QUESTIONS, ...AIENT_INDUSTRY_QUESTIONS];

function getQuestionText(questionId: string | number): string {
  const q = ALL_QUESTIONS.find((q) => String(q.id) === String(questionId));
  return q?.text ?? `Question ${questionId}`;
}

export function AientResultsView({
  results,
  shareId,
  responses = [],
}: AientResultsViewProps) {
  const {
    assessment,
    capabilityScores,
    overallScore,
    maturityStage,
    opportunities,
  } = results;
  const [sharecopied, setShareCopied] = useState(false);
  const [viewMode, setViewMode] = useState<AientViewMode>("internal");
  const printRef = useRef<HTMLDivElement>(null);

  const isClient = viewMode === "client";

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/aient/results/${shareId}`
      : `/aient/results/${shareId}`;

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const displayOpportunities = isClient
    ? opportunities.filter((o) => o.priority !== "innovation").slice(0, 5)
    : opportunities;

  return (
    <div className="min-h-screen font-merkle bg-merkle-grey-60 print:bg-white">
      <div className="print:hidden bg-merkle-secondary-600">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/merkle-logo.webp"
              alt="Merkle"
              className="h-5 w-auto brightness-0 invert"
            />
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              AI for Enterprise Assessment
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-md overflow-hidden text-xs font-medium border border-white/20">
              <button
                type="button"
                onClick={() => setViewMode("internal")}
                className={`px-2.5 py-1 transition-colors ${
                  !isClient
                    ? "bg-white text-slate-900"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Internal
              </button>
              <button
                type="button"
                onClick={() => setViewMode("client")}
                className={`px-2.5 py-1 transition-colors ${
                  isClient
                    ? "bg-white text-slate-900"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Client
              </button>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={copyShareLink}
                className="text-xs text-white/70 hover:text-white px-2 py-1 rounded transition-colors"
              >
                {sharecopied ? "Copied!" : "Share"}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="text-xs text-white/70 hover:text-white px-2 py-1 rounded transition-colors"
              >
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10" ref={printRef}>
        <div className="hidden print:block mb-6">
          <div className="flex items-center gap-2 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/merkle-logo.webp"
              alt="Merkle"
              className="h-5 w-auto"
            />
            <span
              className="text-xs font-semibold uppercase tracking-wider text-merkle-secondary-600"
            >
              AI for Enterprise Assessment
            </span>
          </div>
        </div>

        <div className="mb-8 print:mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            {assessment.clientName}
          </h1>
          <p className="text-slate-500 mt-1">
            {assessment.clientCompany}
            {assessment.industry &&
              AIENT_INDUSTRY_LABELS[assessment.industry] &&
              ` · ${AIENT_INDUSTRY_LABELS[assessment.industry]}`}
          </p>
          <p className="text-slate-400 text-sm mt-0.5">
            Completed {formatDate(assessment.createdAt)} · Assessed by{" "}
            {assessment.respondentName}
          </p>
        </div>

        <Card className="mb-6">
          <CardContent>
            <div className="py-2">
              <p className="text-sm text-slate-700 leading-relaxed">
                {isClient ? (
                  <>
                    This report summarizes the findings of a Content Supply
                    Chain Diagnostic conducted for{" "}
                    <strong>{assessment.clientName}</strong>. The assessment
                    evaluates six capabilities — Strategy &amp; Planning,
                    Workflow &amp; Production, Asset Management &amp; Governance,
                    Distribution &amp; Activation, Measurement &amp; Insights,
                    and Intelligence &amp; Automation — that together determine
                    how effectively an organization turns creative ideas into
                    personalized content at scale. Each capability is scored on
                    a 1–5 scale and mapped to one of four maturity stages. The
                    opportunities below highlight the highest-impact areas for
                    advancement.
                  </>
                ) : (
                  <>
                    This diagnostic assessed{" "}
                    <strong>{assessment.clientName}</strong> across the six
                    capabilities of a modern content supply chain — Strategy
                    &amp; Planning, Workflow &amp; Production, Asset Management
                    &amp; Governance, Distribution &amp; Activation, Measurement
                    &amp; Insights, and Intelligence &amp; Automation. Scores
                    reflect the respondent&apos;s assessment on a 1–5 maturity
                    scale (1 = Not in Place, 3 = Operational, 5 = Optimized).
                    Strategic opportunities are triggered by capability gaps and
                    sorted by priority. Use the Salesforce output section below
                    for pipeline and proposal development.
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <AientMaturityStageCard
            stage={maturityStage}
            overallScore={overallScore}
          />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-bold text-slate-900">
              Capability Heatmap
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Scores across the six Content Supply Chain capability
              dimensions
            </p>
          </CardHeader>
          <CardContent>
            <AientCapabilityHeatmap scores={capabilityScores} />
          </CardContent>
        </Card>

        {displayOpportunities.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-bold text-slate-900">
                {isClient
                  ? "Key Opportunity Areas"
                  : "Strategic Opportunity Areas"}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {isClient
                  ? `${displayOpportunities.length} prioritized opportunities based on your assessment results.`
                  : `${displayOpportunities.length} prioritized opportunities based on capability gaps. Click each to expand scope and methods.`}
              </p>
            </CardHeader>
            <CardContent>
              <AientOpportunityCards
                opportunities={displayOpportunities}
                clientMode={isClient}
              />
            </CardContent>
          </Card>
        )}

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
              <AientSalesforceOutput results={results} />
            </CardContent>
          </Card>
        )}

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

        <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-t border-slate-200 print:hidden">
          <a
            href="/aient"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Start a new CSC assessment
          </a>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={copyShareLink}>
              {sharecopied ? "Link Copied!" : "Share Link"}
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint}>
              Print / PDF
            </Button>
          </div>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-slate-200 text-xs text-slate-400">
          <p>
            Content Supply Chain Diagnostic · Merkle ·{" "}
            {new Date().getFullYear()} · {shareUrl}
          </p>
        </div>
      </div>
    </div>
  );
}

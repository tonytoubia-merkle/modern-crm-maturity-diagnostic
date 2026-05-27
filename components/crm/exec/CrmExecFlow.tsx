"use client";

import { useMemo, useState } from "react";
import {
  EXEC_DIMENSIONS,
  EXEC_QUESTIONS,
  EXEC_QUESTIONS_BY_DIMENSION,
  EXEC_SCORE_LABELS,
  type ExecDimension,
  type ExecQuestion,
} from "@/lib/data/execQuestions";
import {
  computeMaturityStage,
  MATURITY_STAGES,
} from "@/lib/scoring";
import type { Capability, MaturityStage } from "@/lib/types";

const SOURCE_TAG = "exec_kiosk";

type Step = "intro" | "dimension" | "submitting" | "results" | "error";

interface DimensionResult {
  dimension: ExecDimension;
  average: number;
}

/**
 * Modern CRM Executive Self-Assessment — touchscreen-friendly variant of
 * the full Modern CRM Diagnostic. Email-gated intro → one page per
 * dimension → Oui Oui / Zut Alors results with a QR back to the full tool.
 *
 * Responses are tagged with the underlying CRM capability so the back-end
 * scoring stays consistent with the long-form diagnostic.
 */
export function CrmExecFlow() {
  const [step, setStep] = useState<Step>("intro");
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [dimensionIndex, setDimensionIndex] = useState(0);
  /** key = exec question id (e.g. "exec_1"), value = 1-5 score */
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<{
    high: DimensionResult;
    low: DimensionResult;
    overallScore: number;
    maturityStage: MaturityStage;
    shareId: string;
  } | null>(null);

  const currentDimension = EXEC_DIMENSIONS[dimensionIndex];
  const currentQuestions = currentDimension
    ? EXEC_QUESTIONS_BY_DIMENSION[currentDimension.key]
    : [];
  const allCurrentAnswered = currentQuestions.every((q) => answers[q.id]);
  const isLastDimension = dimensionIndex === EXEC_DIMENSIONS.length - 1;

  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = EXEC_QUESTIONS.length;

  const handleStart = () => {
    const trimmed = email.trim().toLowerCase();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!ok) {
      setEmailError("Enter a valid email to begin.");
      return;
    }
    setEmailError(null);
    setStep("dimension");
  };

  const handleScore = (questionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleNext = async () => {
    if (!isLastDimension) {
      setDimensionIndex((i) => i + 1);
      setTimeout(() => window.scrollTo(0, 0), 0);
      return;
    }
    await handleComplete();
  };

  const handleBack = () => {
    if (dimensionIndex > 0) {
      setDimensionIndex((i) => i - 1);
      setTimeout(() => window.scrollTo(0, 0), 0);
    }
  };

  const handleComplete = async () => {
    setStep("submitting");

    // Build dimension averages + capability averages from the answers.
    const dimensionResults: DimensionResult[] = EXEC_DIMENSIONS.map((d) => {
      const qs = EXEC_QUESTIONS_BY_DIMENSION[d.key];
      const total = qs.reduce((s, q) => s + (answers[q.id] ?? 0), 0);
      const avg = total / qs.length;
      return { dimension: d, average: Math.round(avg * 100) / 100 };
    });

    const capabilityScores: Record<Capability, number> = {} as Record<
      Capability,
      number
    >;
    const capabilityBuckets: Partial<Record<Capability, number[]>> = {};
    for (const q of EXEC_QUESTIONS) {
      const score = answers[q.id];
      if (!score) continue;
      const bucket = capabilityBuckets[q.capability] ?? [];
      bucket.push(score);
      capabilityBuckets[q.capability] = bucket;
    }
    for (const cap of Object.keys(capabilityBuckets) as Capability[]) {
      const arr = capabilityBuckets[cap]!;
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      capabilityScores[cap] = Math.round(avg * 100) / 100;
    }

    const capValues = Object.values(capabilityScores).filter((v) => v > 0);
    const overallScore = capValues.length
      ? Math.round(
          (capValues.reduce((a, b) => a + b, 0) / capValues.length) * 100
        ) / 100
      : 0;
    const maturityStage = computeMaturityStage(overallScore);

    const sorted = [...dimensionResults].sort((a, b) => b.average - a.average);
    const high = sorted[0];
    const low = sorted[sorted.length - 1];

    try {
      // Create the assessment.
      const createRes = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: orgName.trim() || email.trim(),
          clientCompany: "",
          respondentName: email.trim(),
          repEmail: email.trim().toLowerCase(),
          isRepMode: false,
          source: SOURCE_TAG,
        }),
      });
      if (!createRes.ok) throw new Error("create");
      const { id, shareId } = await createRes.json();

      // Post raw responses (tagged with the underlying capability so the
      // full diagnostic back-end can still render results / opportunities).
      await fetch(`/api/assessments/${id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responses: EXEC_QUESTIONS.filter((q) => answers[q.id]).map((q) => ({
            questionId: q.id,
            score: answers[q.id],
            capability: q.capability,
            isIndustryQuestion: false,
          })),
        }),
      });

      // PATCH with the computed scores + completion status so the dashboard
      // doesn't show a half-finished record.
      await fetch(`/api/assessments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          capabilityScores,
          overallScore,
          maturityStage,
        }),
      });

      setResults({ high, low, overallScore, maturityStage, shareId });
      setStep("results");
    } catch {
      setStep("error");
    }
  };

  const handleRestart = () => {
    setStep("intro");
    setEmail("");
    setOrgName("");
    setEmailError(null);
    setDimensionIndex(0);
    setAnswers({});
    setResults(null);
  };

  return (
    <div className="min-h-screen font-m2 bg-m2-surface-light flex flex-col">
      {/* Top brand bar — kiosk-friendly */}
      <div className="bg-m2-navy">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/merkle-logo.webp"
            alt="Merkle"
            className="h-5 w-auto brightness-0 invert"
          />
          <span className="text-xs text-white/60 uppercase tracking-wider">
            Modern CRM Self-Assessment
          </span>
        </div>
      </div>

      {/* Progress strip */}
      {step === "dimension" && (
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-m2-blue">
                {dimensionIndex + 1} of {EXEC_DIMENSIONS.length} ·{" "}
                {currentDimension.label}
              </p>
              <p className="text-xs text-slate-400">
                {totalAnswered}/{totalQuestions} answered
              </p>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-m2-blue transition-all duration-300"
                style={{
                  width: `${
                    (totalAnswered / totalQuestions) * 100
                  }%`,
                  backgroundColor: "#0328d1",
                }}
              />
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          {step === "intro" && (
            <IntroPanel
              email={email}
              setEmail={setEmail}
              orgName={orgName}
              setOrgName={setOrgName}
              error={emailError}
              onStart={handleStart}
            />
          )}

          {step === "dimension" && currentDimension && (
            <DimensionPanel
              dimension={currentDimension}
              questions={currentQuestions}
              answers={answers}
              onScore={handleScore}
              onNext={handleNext}
              onBack={dimensionIndex > 0 ? handleBack : undefined}
              canAdvance={allCurrentAnswered}
              ctaLabel={
                isLastDimension ? "See my results →" : "Next dimension →"
              }
            />
          )}

          {step === "submitting" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
              <div className="w-10 h-10 border-4 border-m2-blue/20 border-t-m2-blue rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium text-slate-700">
                Scoring your assessment…
              </p>
            </div>
          )}

          {step === "results" && results && (
            <ResultsPanel
              results={results}
              email={email}
              onRestart={handleRestart}
            />
          )}

          {step === "error" && (
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                Couldn&apos;t save your assessment
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Something went wrong. Please try again.
              </p>
              <button
                onClick={() => handleComplete()}
                className="px-6 py-3 text-sm font-semibold rounded-lg text-white"
                style={{ backgroundColor: "#0328d1" }}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <span>© {new Date().getFullYear()} Merkle</span>
          <span>Under 5 minutes · 13 questions · 5 dimensions</span>
        </div>
      </footer>
    </div>
  );
}

// ── Sub-panels ─────────────────────────────────────────────────────

function IntroPanel({
  email,
  setEmail,
  orgName,
  setOrgName,
  error,
  onStart,
}: {
  email: string;
  setEmail: (v: string) => void;
  orgName: string;
  setOrgName: (v: string) => void;
  error: string | null;
  onStart: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-m2-blue mb-3">
        Modern CRM Diagnostic
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-3">
        Benchmark your CRM maturity in minutes.
      </h1>
      <p className="text-base text-slate-600 leading-relaxed mb-6 max-w-xl">
        See what&apos;s working, what&apos;s not, and where your biggest
        opportunities are. 13 questions across 5 dimensions — under 5 minutes.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Work email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-base px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-m2-blue transition-colors"
            autoFocus
          />
          {error && (
            <p className="mt-1.5 text-xs text-red-600">{error}</p>
          )}
          <p className="mt-1.5 text-xs text-slate-400">
            We&apos;ll send your full results and let you take the long-form
            diagnostic.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Company{" "}
            <span className="text-slate-400 font-light">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="Your organization"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="w-full text-base px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-m2-blue transition-colors"
          />
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-lg text-white hover:opacity-90 transition-opacity"
        style={{ backgroundColor: "#0328d1" }}
      >
        Start assessment →
      </button>

      <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs text-slate-500">
        {EXEC_DIMENSIONS.map((d, i) => (
          <div key={d.key}>
            <p className="font-semibold text-slate-700 mb-0.5">
              {i + 1}. {d.label}
            </p>
            <p className="text-slate-500 leading-snug">{d.blurb}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DimensionPanel({
  dimension,
  questions,
  answers,
  onScore,
  onNext,
  onBack,
  canAdvance,
  ctaLabel,
}: {
  dimension: ExecDimension;
  questions: ExecQuestion[];
  answers: Record<string, number>;
  onScore: (id: string, score: number) => void;
  onNext: () => void;
  onBack?: () => void;
  canAdvance: boolean;
  ctaLabel: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-wider text-m2-blue mb-2">
        Dimension
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
        {dimension.label}
      </h2>
      <p className="text-sm text-slate-600 mb-2">
        How effective is your organization at:
      </p>
      <p className="text-xs text-slate-400 mb-6">
        Tap a score from 1 (Not yet) to 5 (Best in class).
      </p>

      <div className="space-y-6">
        {questions.map((q) => (
          <QuestionRow
            key={q.id}
            number={q.number}
            text={q.text}
            value={answers[q.id]}
            onSelect={(v) => onScore(q.id, v)}
          />
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        <button
          onClick={onNext}
          disabled={!canAdvance}
          className="px-6 py-3 text-sm font-semibold rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
          style={{ backgroundColor: "#0328d1" }}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

function QuestionRow({
  number,
  text,
  value,
  onSelect,
}: {
  number: number;
  text: string;
  value: number | undefined;
  onSelect: (v: number) => void;
}) {
  return (
    <div>
      <p className="text-sm sm:text-base text-slate-800 mb-3 leading-snug">
        <span className="text-slate-400 mr-2">{number}.</span>
        {text}
      </p>
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4, 5].map((v) => {
          const active = value === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onSelect(v)}
              className={`flex-1 min-w-[60px] py-3 rounded-lg border text-sm font-semibold transition-all ${
                active
                  ? "text-white border-transparent"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
              }`}
              style={active ? { backgroundColor: "#0328d1" } : undefined}
              aria-pressed={active}
              aria-label={`Score ${v} — ${EXEC_SCORE_LABELS[v]}`}
            >
              <span className="block text-base">{v}</span>
              <span
                className={`block text-[10px] mt-0.5 ${
                  active ? "text-white/80" : "text-slate-400"
                }`}
              >
                {EXEC_SCORE_LABELS[v]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultsPanel({
  results,
  email,
  onRestart,
}: {
  results: {
    high: DimensionResult;
    low: DimensionResult;
    overallScore: number;
    maturityStage: MaturityStage;
    shareId: string;
  };
  email: string;
  onRestart: () => void;
}) {
  const stage = MATURITY_STAGES[results.maturityStage];
  const fullAssessmentUrl = useFullAssessmentUrl();
  const qrSrc = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=12&data=${encodeURIComponent(
        fullAssessmentUrl
      )}`,
    [fullAssessmentUrl]
  );

  return (
    <div className="space-y-6">
      {/* Headline result */}
      <div className="bg-m2-navy rounded-2xl p-8 sm:p-10 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-m2-sky mb-2">
          Your maturity stage
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
          {stage.label}
        </h2>
        <p className="text-base text-white/70">
          Overall score: {results.overallScore.toFixed(1)} / 5
        </p>
      </div>

      {/* Oui Oui + Zut Alors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-6 sm:p-8 border-2 border-green-200"
          style={{ backgroundColor: "#ECFDF5" }}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-green-700 mb-1">
            Oui Oui!
          </p>
          <p className="text-xs text-green-600 mb-3">Where you&apos;re strongest</p>
          <h3 className="text-xl font-bold text-green-900 mb-2">
            {results.high.dimension.label}
          </h3>
          <p className="text-sm text-green-800 leading-relaxed">
            {results.high.dimension.blurb}
          </p>
          <p className="mt-4 text-3xl font-extrabold text-green-700">
            {results.high.average.toFixed(1)}
            <span className="text-base font-medium text-green-500 ml-1">
              / 5
            </span>
          </p>
        </div>

        <div
          className="rounded-2xl p-6 sm:p-8 border-2 border-amber-200"
          style={{ backgroundColor: "#FFFBEB" }}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
            Zut Alors!
          </p>
          <p className="text-xs text-amber-600 mb-3">
            Your biggest opportunity
          </p>
          <h3 className="text-xl font-bold text-amber-900 mb-2">
            {results.low.dimension.label}
          </h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            {results.low.dimension.blurb}
          </p>
          <p className="mt-4 text-3xl font-extrabold text-amber-700">
            {results.low.average.toFixed(1)}
            <span className="text-base font-medium text-amber-500 ml-1">
              / 5
            </span>
          </p>
        </div>
      </div>

      {/* QR + email follow-up */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center">
        <div className="flex-shrink-0 bg-white rounded-xl border border-slate-200 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrSrc}
            alt="Scan to take the full Modern CRM diagnostic"
            width={180}
            height={180}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-m2-blue mb-2">
            Want the full picture?
          </p>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Take the long-form Modern CRM Diagnostic
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            30 questions across 8 capabilities, with prioritized opportunities,
            workshop vignettes, and Salesforce-ready outputs. Scan the QR code
            or visit{" "}
            <span className="font-mono text-xs">{fullAssessmentUrl}</span>.
          </p>
          <p className="text-xs text-slate-400">
            Sent to {email}: your dimension scores + a link back to this
            result.
          </p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onRestart}
          className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          Start a new assessment
        </button>
      </div>
    </div>
  );
}

function useFullAssessmentUrl(): string {
  if (typeof window === "undefined") return "/crm/assessment/new";
  return `${window.location.origin}/crm/assessment/new`;
}

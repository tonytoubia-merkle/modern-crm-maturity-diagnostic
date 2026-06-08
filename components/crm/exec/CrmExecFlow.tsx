"use client";

import { useMemo, useState } from "react";
import {
  EXEC_DIMENSIONS,
  EXEC_QUESTIONS,
  EXEC_QUESTIONS_BY_DIMENSION,
  EXEC_SCORE_LABELS,
  EXEC_STAGES,
  type ExecDimension,
  type ExecQuestion,
} from "@/lib/data/execQuestions";
import { computeMaturityStage } from "@/lib/scoring";
import type { Capability, MaturityStage } from "@/lib/types";

const SOURCE_TAG = "exec_kiosk";

type Step = "intro" | "dimension" | "results";

interface DimensionResult {
  dimension: ExecDimension;
  average: number;
}

interface ExecResults {
  high: DimensionResult;
  low: DimensionResult;
  overallScore: number;
  maturityStage: MaturityStage;
  capabilityScores: Record<Capability, number>;
}

/**
 * Modern CRM Self-Assessment — the Cannes kiosk activation. Frictionless
 * welcome → one page per dimension → an "Et voilà" snapshot with the
 * respondent's standout strength and biggest opportunity. Email is captured
 * at the end (on the results CTA), not as a gate, so the 90-second snapshot
 * stays frictionless.
 *
 * Scoring is computed client-side and only persisted when the respondent
 * leaves an email on the results page — that submission tags responses with
 * the underlying CRM capability so the back-end stays consistent with the
 * long-form diagnostic.
 */
export function CrmExecFlow() {
  const [step, setStep] = useState<Step>("intro");
  const [dimensionIndex, setDimensionIndex] = useState(0);
  /** key = exec question id (e.g. "exec_1"), value = 1-5 score */
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<ExecResults | null>(null);

  const currentDimension = EXEC_DIMENSIONS[dimensionIndex];
  const currentQuestions = currentDimension
    ? EXEC_QUESTIONS_BY_DIMENSION[currentDimension.key]
    : [];
  const allCurrentAnswered = currentQuestions.every((q) => answers[q.id]);
  const isLastDimension = dimensionIndex === EXEC_DIMENSIONS.length - 1;

  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = EXEC_QUESTIONS.length;

  const handleScore = (questionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleNext = () => {
    if (!isLastDimension) {
      setDimensionIndex((i) => i + 1);
      setTimeout(() => window.scrollTo(0, 0), 0);
      return;
    }
    computeAndShow();
  };

  const handleBack = () => {
    if (dimensionIndex > 0) {
      setDimensionIndex((i) => i - 1);
      setTimeout(() => window.scrollTo(0, 0), 0);
    }
  };

  /** Compute the snapshot entirely client-side and show it immediately. */
  const computeAndShow = () => {
    const dimensionResults: DimensionResult[] = EXEC_DIMENSIONS.map((d) => {
      const qs = EXEC_QUESTIONS_BY_DIMENSION[d.key];
      const total = qs.reduce((s, q) => s + (answers[q.id] ?? 0), 0);
      const avg = qs.length ? total / qs.length : 0;
      return { dimension: d, average: Math.round(avg * 100) / 100 };
    });

    const capabilityBuckets: Partial<Record<Capability, number[]>> = {};
    for (const q of EXEC_QUESTIONS) {
      const score = answers[q.id];
      if (!score) continue;
      const bucket = capabilityBuckets[q.capability] ?? [];
      bucket.push(score);
      capabilityBuckets[q.capability] = bucket;
    }
    const capabilityScores: Record<Capability, number> = {} as Record<
      Capability,
      number
    >;
    for (const cap of Object.keys(capabilityBuckets) as Capability[]) {
      const arr = capabilityBuckets[cap]!;
      capabilityScores[cap] =
        Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) / 100;
    }

    const capValues = Object.values(capabilityScores).filter((v) => v > 0);
    const overallScore = capValues.length
      ? Math.round(
          (capValues.reduce((a, b) => a + b, 0) / capValues.length) * 100
        ) / 100
      : 0;
    const maturityStage = computeMaturityStage(overallScore);

    const sorted = [...dimensionResults].sort((a, b) => b.average - a.average);
    setResults({
      high: sorted[0],
      low: sorted[sorted.length - 1],
      overallScore,
      maturityStage,
      capabilityScores,
    });
    setStep("results");
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  /**
   * Persist the snapshot as a lead when the respondent leaves an email on the
   * results page. Throws on failure so the panel can surface a retry.
   */
  const submitLead = async (email: string) => {
    if (!results) throw new Error("no results");
    const normalized = email.trim();

    const createRes = await fetch("/api/assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: normalized,
        clientCompany: "",
        respondentName: normalized,
        repEmail: normalized.toLowerCase(),
        isRepMode: false,
        source: SOURCE_TAG,
      }),
    });
    if (!createRes.ok) throw new Error("create");
    const { id } = await createRes.json();

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

    await fetch(`/api/assessments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "completed",
        capabilityScores: results.capabilityScores,
        overallScore: results.overallScore,
        maturityStage: results.maturityStage,
      }),
    });
  };

  const handleRestart = () => {
    setStep("intro");
    setDimensionIndex(0);
    setAnswers({});
    setResults(null);
    setTimeout(() => window.scrollTo(0, 0), 0);
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
                className="h-full transition-all duration-300"
                style={{
                  width: `${(totalAnswered / totalQuestions) * 100}%`,
                  backgroundColor: "#0328d1",
                }}
              />
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          {step === "intro" && <IntroPanel onStart={() => setStep("dimension")} />}

          {step === "dimension" && currentDimension && (
            <DimensionPanel
              dimension={currentDimension}
              questions={currentQuestions}
              answers={answers}
              onScore={handleScore}
              onNext={handleNext}
              onBack={dimensionIndex > 0 ? handleBack : undefined}
              canAdvance={allCurrentAnswered}
              ctaLabel={isLastDimension ? "See my results →" : "Next →"}
            />
          )}

          {step === "results" && results && (
            <ResultsPanel
              results={results}
              onSubmitEmail={submitLead}
              onRestart={handleRestart}
            />
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <span>© {new Date().getFullYear()} Merkle</span>
          <span>90 seconds · 8 questions · 5 dimensions</span>
        </div>
      </footer>
    </div>
  );
}

// ── Sub-panels ─────────────────────────────────────────────────────

function IntroPanel({ onStart }: { onStart: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-m2-blue mb-3">
        Modern CRM Self-Assessment
      </p>
      <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-3">
        Bienvenue.
      </h1>
      <p className="text-lg text-slate-700 font-medium mb-4">
        The rosé can wait. Your business can&apos;t.
      </p>
      <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-xl">
        8 questions. 90 seconds. A Modern CRM snapshot of where you stand and
        where the real opportunity lies.
      </p>

      <button
        onClick={onStart}
        className="w-full sm:w-auto px-10 py-4 text-base font-semibold rounded-lg text-white hover:opacity-90 transition-opacity"
        style={{ backgroundColor: "#0328d1" }}
      >
        Allons-y!
      </button>
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
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        {dimension.blurb}
      </p>

      <div className="space-y-6">
        {questions.map((q) => (
          <QuestionRow
            key={q.id}
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
  text,
  value,
  onSelect,
}: {
  text: string;
  value: number | undefined;
  onSelect: (v: number) => void;
}) {
  return (
    <div>
      <p className="text-sm sm:text-base text-slate-800 mb-3 leading-snug">
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
  onSubmitEmail,
  onRestart,
}: {
  results: ExecResults;
  onSubmitEmail: (email: string) => Promise<void>;
  onRestart: () => void;
}) {
  const stage = EXEC_STAGES[results.maturityStage];
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
        <p className="text-sm font-medium text-m2-sky mb-2">
          Et voilà! Here&apos;s where you stand:
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          {stage.label}
        </h2>
        <p className="text-base text-white/80 leading-relaxed max-w-2xl">
          {stage.description}
        </p>
        <p className="mt-4 text-xs text-white/50">
          Overall score: {results.overallScore.toFixed(1)} / 5
        </p>
      </div>

      {/* Standout + biggest opportunity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-6 sm:p-8 border-2 border-green-200"
          style={{ backgroundColor: "#ECFDF5" }}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-green-700 mb-1">
            Your Standout
          </p>
          <h3 className="text-xl font-bold text-green-900 mb-2">
            {results.high.dimension.label}
          </h3>
          <p className="text-sm text-green-800 leading-relaxed">
            {results.high.dimension.standout}
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
            Your Biggest Opportunity
          </p>
          <h3 className="text-xl font-bold text-amber-900 mb-2">
            {results.low.dimension.label}
          </h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            {results.low.dimension.opportunity}
          </p>
          <p className="mt-4 text-3xl font-extrabold text-amber-700">
            {results.low.average.toFixed(1)}
            <span className="text-base font-medium text-amber-500 ml-1">
              / 5
            </span>
          </p>
        </div>
      </div>

      {/* CTA — full assessment, email capture + QR */}
      <FullPictureCta
        qrSrc={qrSrc}
        fullAssessmentUrl={fullAssessmentUrl}
        onSubmitEmail={onSubmitEmail}
      />

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

function FullPictureCta({
  qrSrc,
  fullAssessmentUrl,
  onSubmitEmail,
}: {
  qrSrc: string;
  fullAssessmentUrl: string;
  onSubmitEmail: (email: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">(
    "idle"
  );

  const submit = async () => {
    const trimmed = email.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!ok) {
      setState("error");
      return;
    }
    setState("submitting");
    try {
      await onSubmitEmail(trimmed);
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-m2-blue mb-2">
        Ready to see the full picture?
      </p>
      <h3 className="text-lg font-bold text-slate-900 mb-1">
        Go deeper with the complete 30-question assessment
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed mb-6">
        It goes deeper on every dimension and leaves you with a roadmap, not
        just a score.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="flex-1 min-w-0 w-full">
          {state === "done" ? (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm font-semibold text-green-800">Merci!</p>
              <p className="text-sm text-green-700">
                We&apos;ll send your results and the full assessment link to{" "}
                {email.trim()}.
              </p>
            </div>
          ) : (
            <>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                We&apos;ll send your results and the full assessment link
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error") setState("idle");
                  }}
                  className="flex-1 text-base px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-m2-blue transition-colors"
                />
                <button
                  onClick={submit}
                  disabled={state === "submitting"}
                  className="px-6 py-3 text-sm font-semibold rounded-lg text-white disabled:opacity-50 transition-opacity"
                  style={{ backgroundColor: "#0328d1" }}
                >
                  {state === "submitting" ? "Sending…" : "Send my results"}
                </button>
              </div>
              {state === "error" && (
                <p className="mt-1.5 text-xs text-red-600">
                  Enter a valid email and try again.
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex-shrink-0 text-center">
          <div className="bg-white rounded-xl border border-slate-200 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrSrc}
              alt="Scan to take the full Modern CRM diagnostic"
              width={140}
              height={140}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">Or scan to take it now</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Full assessment:{" "}
        <span className="font-mono text-xs">{fullAssessmentUrl}</span>
      </p>
    </div>
  );
}

function useFullAssessmentUrl(): string {
  if (typeof window === "undefined") return "/crm/assessment/new";
  return `${window.location.origin}/crm/assessment/new`;
}

"use client";

import { useMemo, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import {
  SHORT_DIMENSIONS,
  SHORT_QUESTIONS,
  SHORT_QUESTIONS_BY_DIMENSION,
  SHORT_SCORE_LABELS,
  SHORT_SCORE_DESCRIPTIONS,
  DIMENSION_OPPORTUNITY,
  STAGE_NARRATIVE,
  resolveArchetype,
  type Archetype,
  type ShortDimension,
  type ShortDimensionKey,
  type ShortQuestion,
} from "@/lib/data/shortAssessment";
import { computeMaturityStage, MATURITY_STAGES } from "@/lib/scoring";
import type { Capability, MaturityStage } from "@/lib/types";

const SOURCE_TAG = "short_assessment";

type Step = "intro" | "dimension" | "capture" | "submitting" | "results" | "error";

interface DimensionResult {
  dimension: ShortDimension;
  average: number;
}

/**
 * Modern CRM Short Assessment — executive snapshot of CRM maturity.
 *
 * Lightweight flow: intro → 5 dimension pages → optional capture
 * (name/email/company) → results with radar + maturity stage +
 * archetype + 2–3 opportunity callouts + workshop transition.
 *
 * Responses are tagged with the underlying CRM capability so the
 * back-end scoring stays consistent with the long-form diagnostic.
 */
export function CrmShortFlow() {
  const [step, setStep] = useState<Step>("intro");
  const [dimensionIndex, setDimensionIndex] = useState(0);
  /** key = short question id, value = 1-5 */
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // Capture step (optional contact details before showing results).
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const [results, setResults] = useState<{
    dimensionResults: DimensionResult[];
    overallScore: number;
    maturityStage: MaturityStage;
    archetype: Archetype;
    topOpportunities: DimensionResult[];
    shareId: string;
  } | null>(null);

  const currentDimension = SHORT_DIMENSIONS[dimensionIndex];
  const currentQuestions = currentDimension
    ? SHORT_QUESTIONS_BY_DIMENSION[currentDimension.key]
    : [];
  const allCurrentAnswered = currentQuestions.every((q) => answers[q.id]);
  const isLastDimension = dimensionIndex === SHORT_DIMENSIONS.length - 1;
  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = SHORT_QUESTIONS.length;

  const handleScore = (qId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: score }));
  };

  const advance = () => {
    if (!isLastDimension) {
      setDimensionIndex((i) => i + 1);
      setTimeout(() => window.scrollTo(0, 0), 0);
      return;
    }
    setStep("capture");
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const back = () => {
    if (dimensionIndex > 0) {
      setDimensionIndex((i) => i - 1);
      setTimeout(() => window.scrollTo(0, 0), 0);
    }
  };

  const submit = async (opts: { skipContact?: boolean } = {}) => {
    if (!opts.skipContact) {
      const trimmed = email.trim();
      if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        setEmailError("That email doesn't look right.");
        return;
      }
    }
    setEmailError(null);
    setStep("submitting");

    // ── Compute dimension + capability averages ────────────────────
    const dimensionResults: DimensionResult[] = SHORT_DIMENSIONS.map((d) => {
      const qs = SHORT_QUESTIONS_BY_DIMENSION[d.key];
      const total = qs.reduce((s, q) => s + (answers[q.id] ?? 0), 0);
      const avg = total / qs.length;
      return { dimension: d, average: Math.round(avg * 100) / 100 };
    });

    const capabilityBuckets: Partial<Record<Capability, number[]>> = {};
    for (const q of SHORT_QUESTIONS) {
      const s = answers[q.id];
      if (!s) continue;
      const bucket = capabilityBuckets[q.capability] ?? [];
      bucket.push(s);
      capabilityBuckets[q.capability] = bucket;
    }
    const capabilityScores: Record<Capability, number> = {} as Record<
      Capability,
      number
    >;
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

    const dimensionAvgMap = dimensionResults.reduce((acc, r) => {
      acc[r.dimension.key] = r.average;
      return acc;
    }, {} as Record<ShortDimensionKey, number>);
    const archetype = resolveArchetype(overallScore, dimensionAvgMap);

    // Lowest 2–3 dimensions become the "opportunity areas".
    const topOpportunities = [...dimensionResults]
      .sort((a, b) => a.average - b.average)
      .slice(0, 3);

    // ── Persist via the standard CRM API surface ──────────────────
    try {
      const respondentName = name.trim() || email.trim() || "Anonymous";
      const createRes = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: orgName.trim() || respondentName,
          clientCompany: orgName.trim(),
          respondentName,
          repEmail: email.trim().toLowerCase() || undefined,
          isRepMode: false,
          source: SOURCE_TAG,
        }),
      });
      if (!createRes.ok) throw new Error("create failed");
      const { id, shareId } = await createRes.json();

      await fetch(`/api/assessments/${id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responses: SHORT_QUESTIONS.filter((q) => answers[q.id]).map((q) => ({
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
          capabilityScores,
          overallScore,
          maturityStage,
        }),
      });

      setResults({
        dimensionResults,
        overallScore,
        maturityStage,
        archetype,
        topOpportunities,
        shareId,
      });
      setStep("results");
    } catch {
      // Still show results even if persistence fails — the user has
      // earned them. We can revisit error UX once the surface ships.
      setResults({
        dimensionResults,
        overallScore,
        maturityStage,
        archetype,
        topOpportunities,
        shareId: "",
      });
      setStep("results");
    }
  };

  const restart = () => {
    setStep("intro");
    setDimensionIndex(0);
    setAnswers({});
    setName("");
    setEmail("");
    setOrgName("");
    setEmailError(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen font-m2 bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Brand bar */}
      <header className="bg-m2-navy">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/merkle-logo.webp"
            alt="Merkle"
            className="h-5 w-auto brightness-0 invert"
          />
          <span className="text-[11px] text-white/60 uppercase tracking-[0.18em]">
            Modern CRM · Executive Snapshot
          </span>
        </div>
      </header>

      {/* Progress strip */}
      {step === "dimension" && currentDimension && (
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between mb-2 gap-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-m2-blue">
                {dimensionIndex + 1} of {SHORT_DIMENSIONS.length} ·{" "}
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
          {step === "intro" && <Intro onStart={() => setStep("dimension")} />}

          {step === "dimension" && currentDimension && (
            <DimensionPanel
              dimension={currentDimension}
              questions={currentQuestions}
              answers={answers}
              onScore={handleScore}
              onNext={advance}
              onBack={dimensionIndex > 0 ? back : undefined}
              canAdvance={allCurrentAnswered}
              ctaLabel={
                isLastDimension ? "Reveal my snapshot →" : "Next dimension →"
              }
            />
          )}

          {step === "capture" && (
            <CapturePanel
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              orgName={orgName}
              setOrgName={setOrgName}
              emailError={emailError}
              onSubmit={() => submit()}
              onSkip={() => submit({ skipContact: true })}
              onBack={() => setStep("dimension")}
            />
          )}

          {step === "submitting" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
              <div className="w-10 h-10 border-4 border-m2-blue/20 border-t-m2-blue rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium text-slate-700">
                Scoring your snapshot…
              </p>
            </div>
          )}

          {step === "results" && results && (
            <ResultsPanel results={results} email={email} onRestart={restart} />
          )}

          {step === "error" && (
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center">
              <p className="text-sm text-slate-700">
                Something went wrong scoring your snapshot.
              </p>
              <button
                onClick={() => submit({ skipContact: true })}
                className="mt-4 px-5 py-2.5 text-sm font-semibold rounded-lg text-white"
                style={{ backgroundColor: "#0328d1" }}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>© {new Date().getFullYear()} Merkle</span>
          <span>12 questions · 5 dimensions · under 5 minutes</span>
        </div>
      </footer>
    </div>
  );
}

// ── Intro ──────────────────────────────────────────────────────────

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div
        className="px-8 sm:px-12 py-12"
        style={{
          background:
            "linear-gradient(135deg, #141419 0%, #0328d1 100%)",
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-m2-sky mb-4">
          Modern CRM Diagnostic — Executive Snapshot
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-3">
          Where does your organization sit on the CRM maturity curve?
        </h1>
        <p className="text-base text-white/80 leading-relaxed max-w-2xl">
          A five-minute, executive-level read of where your CRM engine stands
          today — and where the biggest opportunities are hiding. Twelve
          questions across five strategic dimensions. Designed to spark
          alignment, not deliver a roadmap.
        </p>
      </div>

      <div className="px-8 sm:px-12 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {SHORT_DIMENSIONS.map((d, i) => (
            <div key={d.key}>
              <p className="text-xs font-bold text-m2-navy mb-1">
                0{i + 1}. {d.label}
              </p>
              <p className="text-xs text-slate-500 leading-snug">{d.blurb}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={onStart}
            className="px-7 py-3.5 text-sm font-semibold rounded-lg text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#0328d1" }}
          >
            Begin the snapshot →
          </button>
          <p className="text-xs text-slate-400">
            Anonymous to start. You can choose to share contact details before
            seeing your results.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Dimension page ─────────────────────────────────────────────────

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
  dimension: ShortDimension;
  questions: ShortQuestion[];
  answers: Record<string, number>;
  onScore: (id: string, score: number) => void;
  onNext: () => void;
  onBack?: () => void;
  canAdvance: boolean;
  ctaLabel: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-m2-blue mb-2">
        Dimension
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
        {dimension.label}
      </h2>
      <p className="text-sm text-slate-600 mb-5 max-w-2xl">{dimension.blurb}</p>

      <div className="space-y-7">
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
              className={`flex-1 min-w-[80px] py-3 px-2 rounded-lg border text-sm font-semibold transition-all ${
                active
                  ? "text-white border-transparent shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
              }`}
              style={active ? { backgroundColor: "#0328d1" } : undefined}
              aria-pressed={active}
              title={SHORT_SCORE_DESCRIPTIONS[v]}
            >
              <span className="block text-base">{v}</span>
              <span
                className={`block text-[10px] mt-0.5 ${
                  active ? "text-white/80" : "text-slate-500"
                }`}
              >
                {SHORT_SCORE_LABELS[v]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Capture (name / email / company) ───────────────────────────────

function CapturePanel({
  name,
  setName,
  email,
  setEmail,
  orgName,
  setOrgName,
  emailError,
  onSubmit,
  onSkip,
  onBack,
}: {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  orgName: string;
  setOrgName: (v: string) => void;
  emailError: string | null;
  onSubmit: () => void;
  onSkip: () => void;
  onBack: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-m2-blue mb-2">
        Final step
      </p>
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
        Want a copy of your snapshot?
      </h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-xl">
        Optional — share your details and we&apos;ll send you the executive
        summary plus an invitation to the deeper Modern CRM workshop. Or skip
        ahead to your results.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name
          </label>
          <input
            type="text"
            placeholder="First last"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-base px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-m2-blue transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Work email
          </label>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-base px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-m2-blue transition-colors"
          />
          {emailError && (
            <p className="mt-1.5 text-xs text-red-600">{emailError}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Company
          </label>
          <input
            type="text"
            placeholder="Your organisation"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="w-full text-base px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-m2-blue transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          onClick={onSubmit}
          className="px-6 py-3 text-sm font-semibold rounded-lg text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#0328d1" }}
        >
          Send me my snapshot →
        </button>
        <button
          onClick={onSkip}
          className="px-6 py-3 text-sm font-medium rounded-lg text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-400 transition-colors"
        >
          Skip — just show results
        </button>
        <button
          onClick={onBack}
          className="text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors sm:ml-auto"
        >
          ← Back to questions
        </button>
      </div>
    </div>
  );
}

// ── Results ────────────────────────────────────────────────────────

function ResultsPanel({
  results,
  email,
  onRestart,
}: {
  results: {
    dimensionResults: DimensionResult[];
    overallScore: number;
    maturityStage: MaturityStage;
    archetype: Archetype;
    topOpportunities: DimensionResult[];
    shareId: string;
  };
  email: string;
  onRestart: () => void;
}) {
  const stage = MATURITY_STAGES[results.maturityStage];

  const radarData = useMemo(
    () =>
      results.dimensionResults.map((r) => ({
        dimension: r.dimension.label,
        score: r.average,
        full: 5,
      })),
    [results.dimensionResults]
  );

  return (
    <div className="space-y-6">
      {/* Headline — archetype + maturity stage */}
      <div
        className="rounded-2xl p-8 sm:p-10 text-white shadow-md"
        style={{
          background:
            "linear-gradient(135deg, #141419 0%, #0328d1 100%)",
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-m2-sky mb-3">
          Your archetype
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          {results.archetype.label}
        </h2>
        <p className="text-base text-white/85 italic mb-5 max-w-2xl">
          {results.archetype.oneLiner}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 pt-5 border-t border-white/20">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/60">
              Maturity stage
            </p>
            <p className="text-lg font-bold text-white">{stage.label}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/60">
              Overall score
            </p>
            <p className="text-lg font-bold text-white">
              {results.overallScore.toFixed(1)} / 5.0
            </p>
          </div>
        </div>
      </div>

      {/* Radar chart + executive summary side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-m2-blue mb-1">
            Dimension snapshot
          </p>
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Where you scored across the five dimensions
          </h3>
          <div className="h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={radarData}
                margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
              >
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fontSize: 11, fill: "#475569" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 5]}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickCount={6}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#0328d1"
                  fill="#0328d1"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
            {results.dimensionResults.map((r) => (
              <li
                key={r.dimension.key}
                className="flex items-center justify-between"
              >
                <span className="text-slate-600">{r.dimension.label}</span>
                <span className="font-semibold text-slate-900">
                  {r.average.toFixed(1)} / 5
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-m2-blue mb-1">
            Executive summary
          </p>
          <h3 className="text-lg font-bold text-slate-900 mb-3">
            What this means
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            {STAGE_NARRATIVE[results.maturityStage]}
          </p>
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Your archetype profile
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {results.archetype.narrative}
            </p>
          </div>
        </div>
      </div>

      {/* Opportunity callouts */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-m2-blue mb-1">
          Where to focus
        </p>
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {results.topOpportunities.length === 1
            ? "1 key opportunity area"
            : `${results.topOpportunities.length} key opportunity areas`}
        </h3>
        <div className="space-y-4">
          {results.topOpportunities.map((opp, i) => {
            const narrative = DIMENSION_OPPORTUNITY[opp.dimension.key];
            return (
              <div
                key={opp.dimension.key}
                className="border-l-4 pl-4 py-1"
                style={{ borderLeftColor: "#0328d1" }}
              >
                <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
                  <p className="text-sm font-bold text-slate-900">
                    {i + 1}. {narrative.headline}
                  </p>
                  <p className="text-xs text-slate-400">
                    {opp.dimension.label} · {opp.average.toFixed(1)} / 5
                  </p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {narrative.narrative}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workshop transition */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white shadow-md"
        style={{ backgroundColor: "#141419" }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-m2-sky mb-3">
          The next conversation
        </p>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          This snapshot is directionally right.
        </h3>
        <p className="text-base text-white/85 leading-relaxed mb-5 max-w-2xl">
          The real work is making it specific to your organization — your
          customers, your teams, your tech, and your operating model. That&apos;s
          what the Modern CRM Workshop is built for: deeper journey and
          use-case mapping, prioritised opportunity sequencing, and an
          actionable roadmap aligned across CRM, loyalty, media, service, and
          data strategy.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href="/crm/assessment/new"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg bg-white text-m2-navy hover:bg-white/90 transition-colors"
          >
            Take the long-form diagnostic →
          </a>
          <a
            href="mailto:?subject=Modern%20CRM%20Workshop%20conversation&body=I%20just%20took%20the%20Modern%20CRM%20Executive%20Snapshot%20and%20would%20like%20to%20talk%20about%20the%20deeper%20workshop."
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors"
          >
            Start a workshop conversation
          </a>
        </div>
        {email && (
          <p className="text-xs text-white/50 mt-5">
            We&apos;ll follow up with {email} on next steps and a copy of this
            snapshot.
          </p>
        )}
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onRestart}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          Start a fresh snapshot
        </button>
      </div>
    </div>
  );
}

"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
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

// ── Merkle Create / Cannes "Rebuilt" palette (from Figma) ──────────────
const COBALT = "#0328d1";
const COBALT_HOVER = "#1e56fa";
const LABEL_GREY = "#aeaebc";
const SUB_GREY = "#d6d6df";
const NEAR_BLACK = "#05060a";

/** Dark hero glow — cobalt bleed from the bottom-right + a softer top-left. */
const GLOW_BG =
  "radial-gradient(115% 90% at 100% 100%, rgba(3,40,209,0.55) 0%, rgba(3,40,209,0.18) 28%, rgba(5,6,10,0) 58%), " +
  "radial-gradient(80% 70% at 0% 0%, rgba(30,86,250,0.28) 0%, rgba(5,6,10,0) 52%)";

const ORDINALS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

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
 * Modern CRM Self-Assessment — the Cannes kiosk activation, styled to the
 * "Rebuilt" Figma (dark cobalt-glow theme, Work Sans, slider scoring).
 * Frictionless welcome → one page per dimension → an "Et voilà" snapshot.
 * Email is captured at the end (results CTA), not as a gate.
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

    // Best-effort: trigger the results + full-assessment-link email. The lead
    // is already saved above, so a send failure must never surface to the user.
    try {
      await fetch("/api/exec/send-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalized,
          maturityStage: results.maturityStage,
          overallScore: results.overallScore,
          high: { key: results.high.dimension.key, score: results.high.average },
          low: { key: results.low.dimension.key, score: results.low.average },
          fullUrl:
            typeof window !== "undefined"
              ? `${window.location.origin}/crm/assessment/new`
              : "/crm/assessment/new",
        }),
      });
    } catch {
      // ignore — email is a bonus; the lead is already captured.
    }
  };

  const handleRestart = () => {
    setStep("intro");
    setDimensionIndex(0);
    setAnswers({});
    setResults(null);
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  return (
    <div
      className="h-[100dvh] font-m2 text-white relative overflow-hidden"
      style={{ background: NEAR_BLACK }}
    >
      {/* Cobalt glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: GLOW_BG }} />

      <FitToViewport>
        {step === "intro" && <IntroPanel onStart={() => setStep("dimension")} />}

        {step === "dimension" && currentDimension && (
          <DimensionPanel
            dimension={currentDimension}
            dimensionIndex={dimensionIndex}
            totalDimensions={EXEC_DIMENSIONS.length}
            questions={currentQuestions}
            answers={answers}
            onScore={handleScore}
            onNext={handleNext}
            onBack={dimensionIndex > 0 ? handleBack : undefined}
            canAdvance={allCurrentAnswered}
            ctaLabel={isLastDimension ? "See my results" : "Next"}
          />
        )}

        {step === "results" && results && (
          <ResultsPanel
            results={results}
            onSubmitEmail={submitLead}
            onRestart={handleRestart}
          />
        )}
      </FitToViewport>
    </div>
  );
}

/**
 * Kiosk fit: locks content to the viewport and scales the active page down
 * (never up) when it would overflow, so the user never scrolls on any screen.
 */
function FitToViewport({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const recalc = () => {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;
      const avail = outer.clientHeight;
      const natural = inner.offsetHeight; // layout height, unaffected by transform
      if (!avail || !natural) return;
      const next = natural > avail ? Math.max(0.4, avail / natural) : 1;
      setScale((prev) => (Math.abs(prev - next) > 0.004 ? next : prev));
    };
    recalc();
    const ro = new ResizeObserver(recalc);
    if (innerRef.current) ro.observe(innerRef.current);
    window.addEventListener("resize", recalc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, []);

  return (
    <div
      ref={outerRef}
      className="relative h-full w-full overflow-hidden flex items-center justify-center"
    >
      <div
        ref={innerRef}
        className="w-full"
        style={{
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Shared bits ────────────────────────────────────────────────────────

function MerkleLockup() {
  return (
    <div className="flex flex-col items-start gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/merkle-cannes-logo.svg"
        alt="Merkle"
        className="h-9 sm:h-10 w-auto shrink-0"
      />
      <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
        Modern CRM Self-Assessment
      </span>
    </div>
  );
}

function CobaltButton({
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white transition-all disabled:cursor-not-allowed ${className}`}
      style={
        disabled
          ? { backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }
          : { backgroundColor: COBALT }
      }
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = COBALT_HOVER;
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = COBALT;
      }}
    >
      {children}
    </button>
  );
}

// ── Cover ──────────────────────────────────────────────────────────────

function IntroPanel({ onStart }: { onStart: () => void }) {
  return (
    <div className="max-w-5xl w-full mx-auto px-8 sm:px-12 py-12">
      <div className="mb-12 sm:mb-20">
        <MerkleLockup />
      </div>
      <h1 className="font-extrabold leading-[0.95] tracking-tight text-white text-5xl sm:text-7xl xl:text-8xl mb-8">
        Results before
        <br />
        your rosé warms.
      </h1>
      <p className="text-xl sm:text-2xl leading-snug max-w-2xl mb-12" style={{ color: SUB_GREY }}>
        <span className="font-bold text-white">8 questions. 90 seconds.</span>{" "}
        A Modern CRM snapshot of where you stand and where the real opportunity lies.
      </p>
      <div>
        <CobaltButton onClick={onStart}>Allons-y!</CobaltButton>
      </div>
    </div>
  );
}

// ── Question page ────────────────────────────────────────────────────────

function ProgressDots({ count, current }: { count: number; current: number }) {
  return (
    <div className="flex items-center gap-2.5" aria-label={`Dimension ${current + 1} of ${count}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="rounded-full transition-all"
          style={{
            width: i === current ? 10 : 8,
            height: i === current ? 10 : 8,
            backgroundColor: i <= current ? "#ffffff" : "rgba(255,255,255,0.28)",
          }}
        />
      ))}
    </div>
  );
}

function DimensionPanel({
  dimension,
  dimensionIndex,
  totalDimensions,
  questions,
  answers,
  onScore,
  onNext,
  onBack,
  canAdvance,
  ctaLabel,
}: {
  dimension: ExecDimension;
  dimensionIndex: number;
  totalDimensions: number;
  questions: ExecQuestion[];
  answers: Record<string, number>;
  onScore: (id: string, score: number) => void;
  onNext: () => void;
  onBack?: () => void;
  canAdvance: boolean;
  ctaLabel: string;
}) {
  return (
    <div className="max-w-5xl w-full mx-auto px-8 sm:px-12 py-10">
      <ProgressDots count={totalDimensions} current={dimensionIndex} />

      <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
        Dimension {ORDINALS[dimensionIndex] ?? dimensionIndex + 1}
      </p>
      <h2 className="mt-1 font-extrabold tracking-tight text-white text-4xl sm:text-5xl xl:text-6xl">
        {dimension.label}
      </h2>
      <p className="mt-3 text-base sm:text-lg leading-relaxed max-w-3xl" style={{ color: SUB_GREY }}>
        {dimension.blurb}
      </p>

      {/* Reserve a consistent height so 1- and 2-question dimensions don't
          resize the page between screens. */}
      <div className="mt-8 sm:mt-10 min-h-[20rem] flex flex-col justify-center space-y-10">
        {questions.map((q) => (
          <div key={q.id}>
            <p className="text-base sm:text-lg font-semibold text-white mb-7 leading-snug">
              {q.text}
            </p>
            <ScoreSlider value={answers[q.id]} onSelect={(v) => onScore(q.id, v)} />
          </div>
        ))}
      </div>

      <div className="pt-12 flex items-center justify-between gap-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="text-sm font-medium text-white/50 hover:text-white transition-colors"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        <CobaltButton onClick={onNext} disabled={!canAdvance}>
          {ctaLabel} <span aria-hidden>→</span>
        </CobaltButton>
      </div>
    </div>
  );
}

// ── Score slider — drag the hollow-ring handle to set a level ─────────────
// Per the Figma "Rebuilt" design: a hollow ring handle parks at the far left
// (unset) and the user drags it onto one of five stops. Tap-to-set on a stop
// is intentionally disabled to force the drag gesture — flip
// ALLOW_CLICK_TO_SET back to true to restore tap-to-pick.
const ALLOW_CLICK_TO_SET = false;

function ScoreSlider({
  value,
  onSelect,
}: {
  value: number | undefined;
  onSelect: (v: number) => void;
}) {
  const stops = [1, 2, 3, 4, 5] as const;
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const isSet = value != null;
  const pct = value != null ? ((value - 1) / 4) * 100 : 0;

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const stop = Math.round(ratio * 4) + 1; // → 1..5
    if (stop !== value) onSelect(stop);
  };

  const beginDrag = (e: ReactPointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    setFromClientX(e.clientX); // grabbing the handle commits the nearest stop
  };
  const moveDrag = (e: ReactPointerEvent) => {
    if (dragging) setFromClientX(e.clientX);
  };
  const endDrag = (e: ReactPointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* capture may already be released */
    }
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    let next: number;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(5, (value ?? 0) + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(1, (value ?? 2) - 1);
    else if (e.key === "Home") next = 1;
    else if (e.key === "End") next = 5;
    else return;
    e.preventDefault();
    onSelect(next);
  };

  return (
    <div className="px-3 select-none">
      {/* Track + handle */}
      <div
        ref={trackRef}
        className="relative h-11 flex items-center"
        style={{ touchAction: "none" }}
        onPointerDown={ALLOW_CLICK_TO_SET ? beginDrag : undefined}
      >
        {/* Base track */}
        <div
          className="absolute left-0 right-0 h-[3px] rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
        />
        {/* Cobalt fill — only after the user engages */}
        {isSet ? (
          <div
            className="absolute left-0 h-[3px] rounded-full"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${COBALT_HOVER}, ${COBALT})` }}
          />
        ) : null}

        {/* Faint stop dots */}
        {stops.map((v, i) => (
          <span
            key={v}
            className="absolute -translate-x-1/2 rounded-full"
            style={{
              left: `${(i / 4) * 100}%`,
              width: 10,
              height: 10,
              backgroundColor: "rgba(255,255,255,0.4)",
            }}
          />
        ))}

        {/* Draggable hollow-ring handle */}
        <button
          type="button"
          role="slider"
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={value ?? undefined}
          aria-label="Drag to rate from 1 (not yet) to 5 (best in class)"
          tabIndex={0}
          onPointerDown={beginDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          className="absolute -translate-x-1/2 grid place-items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          style={{
            left: `${pct}%`,
            width: 44,
            height: 44,
            cursor: dragging ? "grabbing" : "grab",
            touchAction: "none",
          }}
        >
          <span
            className="rounded-full transition-shadow"
            style={{
              width: 22,
              height: 22,
              border: "2px solid #ffffff",
              backgroundColor: "transparent",
              opacity: isSet ? 1 : 0.7,
              boxShadow:
                isSet || dragging
                  ? "0 0 0 6px rgba(255,255,255,0.12), 0 1px 4px rgba(0,0,0,0.4)"
                  : "0 1px 4px rgba(0,0,0,0.4)",
            }}
          />
        </button>
      </div>

      {/* Labels */}
      <div className="relative mt-3 h-4">
        {stops.map((v, i) => {
          const left = `${(i / 4) * 100}%`;
          const transform = i === 0 ? "translateX(0)" : i === 4 ? "translateX(-100%)" : "translateX(-50%)";
          const selected = value === v;
          return (
            <span
              key={v}
              className="absolute text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-colors"
              style={{ left, transform, color: selected ? "#ffffff" : LABEL_GREY }}
            >
              {EXEC_SCORE_LABELS[v]}
            </span>
          );
        })}
      </div>

      {/* Drag hint — keeps its height once set so the page doesn't shift */}
      <p className="mt-2 h-4 text-[11px] font-medium tracking-wide text-white/45">
        {isSet ? "" : "Drag the dial to rate →"}
      </p>
    </div>
  );
}

// ── Results ──────────────────────────────────────────────────────────────

/** Horizontal result bar — content left, score right; color only as accent. */
function ResultBar({
  kicker,
  dotClass,
  accentClass,
  label,
  body,
  score,
}: {
  kicker: string;
  dotClass: string;
  accentClass: string;
  label: string;
  body: string;
  score: number;
}) {
  return (
    <div className="rounded-2xl p-5 sm:p-6 border border-white/10 bg-white/[0.03] flex items-start gap-5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`h-2 w-2 rounded-full ${dotClass}`} />
          <p className={`text-xs font-bold uppercase tracking-wider ${accentClass}`}>{kicker}</p>
        </div>
        <h3 className="text-lg font-bold text-white">{label}</h3>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: SUB_GREY }}>
          {body}
        </p>
      </div>
      <span className={`shrink-0 text-2xl font-extrabold ${accentClass}`}>
        {score.toFixed(1)}
        <span className="text-xs font-medium text-white/40">/5</span>
      </span>
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
      `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=12&bgcolor=05060a&color=ffffff&data=${encodeURIComponent(
        fullAssessmentUrl
      )}`,
    [fullAssessmentUrl]
  );

  return (
    <div className="max-w-6xl w-full mx-auto px-6 sm:px-10 py-8 space-y-4">
      <MerkleLockup />

      {/* Stage banner — full width, compact */}
      <div className="rounded-2xl px-6 py-5 sm:px-8 sm:py-6 border border-white/10 bg-white/[0.03]">
        <p className="text-sm font-semibold mb-1.5" style={{ color: COBALT_HOVER }}>
          Et voilà! Here&apos;s where you stand:
        </p>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {stage.label}
          </h2>
          <span className="text-sm text-white/45">
            Overall {results.overallScore.toFixed(1)} / 5
          </span>
        </div>
        <p className="mt-2 text-sm sm:text-base leading-relaxed" style={{ color: SUB_GREY }}>
          {stage.description}
        </p>
      </div>

      {/* Standout + Opportunity stacked (left) · CTA (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <div className="lg:col-span-2 flex flex-col justify-center gap-4">
          <ResultBar
            kicker="Your Standout"
            dotClass="bg-emerald-400"
            accentClass="text-emerald-300"
            label={results.high.dimension.label}
            body={results.high.dimension.standout}
            score={results.high.average}
          />
          <ResultBar
            kicker="Your Biggest Opportunity"
            dotClass="bg-amber-400"
            accentClass="text-amber-300"
            label={results.low.dimension.label}
            body={results.low.dimension.opportunity}
            score={results.low.average}
          />
        </div>

        <FullPictureCta qrSrc={qrSrc} onSubmitEmail={onSubmitEmail} />
      </div>

      <div className="text-center pt-1">
        <button
          onClick={onRestart}
          className="text-sm font-medium text-white/50 hover:text-white transition-colors"
        >
          Start a new assessment
        </button>
      </div>
    </div>
  );
}

function FullPictureCta({
  qrSrc,
  onSubmitEmail,
}: {
  qrSrc: string;
  onSubmitEmail: (email: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">("idle");

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
    <div className="rounded-2xl p-5 sm:p-6 border border-white/10 bg-white/[0.03] flex flex-col">
      <h3 className="text-lg font-bold text-white mb-1">Ready to see the full picture?</h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: SUB_GREY }}>
        Our complete 30-question assessment goes deeper on every dimension and leaves you
        with a roadmap, not just a score.
      </p>

      {state === "done" ? (
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3">
          <p className="text-sm font-semibold text-emerald-300">Merci!</p>
          <p className="text-sm text-emerald-200/80">
            We&apos;ll send these initial results and the full assessment link to {email.trim()}.
          </p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1.5">
            We&apos;ll send these initial results and the full assessment link
          </label>
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
            className="w-full text-base px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:border-white/40 transition-colors"
          />
          <CobaltButton onClick={submit} disabled={state === "submitting"} className="mt-2 w-full">
            {state === "submitting" ? "Sending…" : "Send my results"}
          </CobaltButton>
          {state === "error" && (
            <p className="mt-1.5 text-xs text-red-300">Enter a valid email and try again.</p>
          )}
        </div>
      )}

      <div className="mt-auto pt-4 flex items-center gap-3">
        <div className="rounded-lg border border-white/15 p-2 shrink-0" style={{ backgroundColor: NEAR_BLACK }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt="Scan to take the full Modern CRM diagnostic" width={84} height={84} />
        </div>
        <p className="text-xs text-white/45">Or scan to take it now</p>
      </div>
    </div>
  );
}

function useFullAssessmentUrl(): string {
  if (typeof window === "undefined") return "/crm/assessment/new";
  return `${window.location.origin}/crm/assessment/new`;
}

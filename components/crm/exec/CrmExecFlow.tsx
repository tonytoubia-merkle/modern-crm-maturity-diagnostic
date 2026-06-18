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

  const handleScore = (questionId: string, score: number | null) => {
    setAnswers((prev) => {
      if (score == null) {
        // Dragged back to the far-left "unset" zone — clear the answer.
        const next = { ...prev };
        delete next[questionId];
        return next;
      }
      return { ...prev, [questionId]: score };
    });
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
      {/* Background image — cover art on intro/results; mirrored (flipped,
          not rotated) on the question pages. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url(/exec-bg.png)",
          backgroundSize: "cover",
          // Anchor the bottom so the cobalt glow (bottom ~40% of the image)
          // stays visible instead of being cropped out on wide viewports.
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          transform: step === "dimension" ? "scaleX(-1)" : undefined,
        }}
      />

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
      {/* Nudge left so the MERKLE wordmark aligns with the content edge and
          the triangle overhangs to its left (wordmark starts at x=27.6/288). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/merkle-cannes-logo.svg"
        alt="Merkle"
        className="h-7 sm:h-8 w-auto shrink-0 -ml-[21px] sm:-ml-[24px]"
      />
      <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
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
      <div className="mb-16 lg:mb-[120px]">
        <MerkleLockup />
      </div>
      <h1 className="font-extrabold leading-none text-white text-6xl sm:text-7xl lg:text-[112px] mb-6 lg:mb-9">
        Results before
        <br />
        your rosé warms.
      </h1>
      <p className="text-2xl lg:text-[34px] leading-[1.15] mb-10 lg:mb-[87px]" style={{ color: SUB_GREY }}>
        <span className="font-bold text-white">8 questions. 90 seconds.</span>{" "}
        A Modern CRM snapshot of where you stand and where the real opportunity lies.
      </p>
      <div>
        <CobaltButton
          onClick={onStart}
          className="lg:px-[51px] lg:py-[23px] lg:text-[23px] lg:rounded-[15px]"
        >
          Allons-y!
        </CobaltButton>
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
  onScore: (id: string, score: number | null) => void;
  onNext: () => void;
  onBack?: () => void;
  canAdvance: boolean;
  ctaLabel: string;
}) {
  return (
    <div className="max-w-[1100px] w-full mx-auto px-8 sm:px-12 py-10">
      <ProgressDots count={totalDimensions} current={dimensionIndex} />

      {/* 40px between the dots and the dimension eyebrow (Figma) */}
      <p className="mt-10 text-sm lg:text-[19px] font-bold uppercase tracking-[0.08em] text-white">
        Dimension {ORDINALS[dimensionIndex] ?? dimensionIndex + 1}
      </p>
      <h2 className="mt-4 font-extrabold leading-none text-white text-4xl sm:text-5xl lg:text-[73px]">
        {dimension.label}
      </h2>
      <p className="mt-1 text-lg lg:text-[26px] leading-[1.5] whitespace-nowrap" style={{ color: SUB_GREY }}>
        {dimension.blurb}
      </p>

      {/* Reserve a consistent height so 1- and 2-question dimensions don't
          resize the page between screens. */}
      <div className="mt-12 lg:mt-16 min-h-[30rem] flex flex-col justify-center gap-16 lg:gap-[120px]">
        {questions.map((q) => (
          <div key={q.id}>
            <p className="text-lg lg:text-[26px] font-bold leading-[1.4] text-white mb-10 lg:mb-12">
              {q.text}
            </p>
            <ScoreSlider value={answers[q.id]} onSelect={(v) => onScore(q.id, v)} />
          </div>
        ))}
      </div>

      <div className="pt-10 flex items-center justify-between gap-4">
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
        {/* Next button — cobalt; 30% opacity when disabled (Figma) */}
        <button
          type="button"
          onClick={onNext}
          disabled={!canAdvance}
          className="inline-flex items-center justify-center gap-3 rounded-[17px] font-bold text-white transition-opacity disabled:cursor-not-allowed px-8 py-4 text-lg lg:px-[40px] lg:py-[23px] lg:text-[25px]"
          style={{ backgroundColor: COBALT, opacity: canAdvance ? 1 : 0.3 }}
        >
          {ctaLabel} <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

// ── Score slider — drag the handle to set a level ────────────────────────
// Per the Figma "Rebuilt" design: the handle parks all the way at the far
// left in an UNSET state (just left of the first stop, no label), and the
// user drags it onto one of five pill-dash stops. The stops are inset from
// the left so "Not yet" sits a little right of the unset park. Tap-to-set on
// a stop is disabled to force the drag gesture — flip ALLOW_CLICK_TO_SET back
// to true to restore tap-to-pick.
const ALLOW_CLICK_TO_SET = false;

// Stop positions as a % of the track. Stop 1 is inset from the left so the
// unset handle has room to park to its left; the last stop runs to the right
// edge. End labels are centered under their dash (room comes from the panel's
// horizontal padding).
const STOP_START_PCT = 10;
const STOP_END_PCT = 100;
const STOP_STEP_PCT = (STOP_END_PCT - STOP_START_PCT) / 4;
const stopPos = (i: number) => STOP_START_PCT + i * STOP_STEP_PCT;
// Anywhere left of the midpoint between the park (0%) and stop 1 reads as unset.
const UNSET_MAX_PCT = STOP_START_PCT / 2;
// The filled portion is cobalt at 50% opacity — softer than the solid-cobalt handle.
const SLIDER_FILL = "rgba(3, 40, 209, 0.5)";

function ScoreSlider({
  value,
  onSelect,
}: {
  value: number | undefined;
  onSelect: (v: number | null) => void;
}) {
  const stops = [1, 2, 3, 4, 5] as const;
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const isSet = value != null;
  // Set → sit on the stop; unset → park at the far left, left of stop 1.
  const pct = value != null ? stopPos(value - 1) : 0;

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const posPct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    if (posPct < UNSET_MAX_PCT) {
      // Far-left zone → back to unset.
      if (value != null) onSelect(null);
      return;
    }
    const i = Math.max(0, Math.min(4, Math.round((posPct - STOP_START_PCT) / STOP_STEP_PCT)));
    const stop = i + 1; // → 1..5
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
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onSelect(Math.min(5, (value ?? 0) + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      if (value == null) return;
      onSelect(value <= 1 ? null : value - 1); // step below 1 → unset
    } else if (e.key === "Home") {
      e.preventDefault();
      onSelect(1);
    } else if (e.key === "End") {
      e.preventDefault();
      onSelect(5);
    }
  };

  return (
    <div className="select-none" style={{ paddingLeft: 32, paddingRight: 32 }}>
      {/* Track + handle (row tall enough for the 56px handle) */}
      <div
        ref={trackRef}
        className="relative flex items-center"
        style={{ height: 56, touchAction: "none" }}
        onPointerDown={ALLOW_CLICK_TO_SET ? beginDrag : undefined}
      >
        {/* Base track — 12px, #d6d6df, inset shadow */}
        <div
          className="absolute left-0 right-0 rounded-full"
          style={{
            height: 12,
            backgroundColor: "#d6d6df",
            boxShadow: "inset 0 0 8px 1.5px rgba(0,0,0,0.25)",
          }}
        />
        {/* Filled portion — cobalt @ 50% */}
        {isSet ? (
          <div
            className="absolute left-0 rounded-full"
            style={{
              height: 12,
              width: `${pct}%`,
              backgroundColor: SLIDER_FILL,
              boxShadow: "inset 0 4px 8px 1.5px rgba(0,0,0,0.25)",
            }}
          />
        ) : null}

        {/* Stop pills — 14x26, radius 8, solid #FFF (Figma) */}
        {stops.map((v, i) => (
          <span
            key={v}
            className="absolute -translate-x-1/2"
            style={{
              left: `${stopPos(i)}%`,
              width: 14,
              height: 26,
              borderRadius: 8,
              backgroundColor: "#FFFFFF",
            }}
          />
        ))}

        {/* Draggable handle — 56px, cobalt + 8px white ring + drop shadow */}
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
          className="absolute -translate-x-1/2 rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          style={{
            left: `${pct}%`,
            width: 56,
            height: 56,
            backgroundColor: COBALT,
            border: "8px solid #ffffff",
            boxShadow: dragging
              ? "0 0 0 6px rgba(3,40,209,0.25), 0 7px 20px rgba(0,0,0,0.6)"
              : "0 7px 20px rgba(0,0,0,0.6)",
            cursor: dragging ? "grabbing" : "grab",
            touchAction: "none",
          }}
        />
      </div>

      {/* Labels — 17px, centered under each pill, 32px below (Figma) */}
      <div className="relative" style={{ marginTop: 18, height: 22 }}>
        {stops.map((v, i) => {
          const selected = value === v;
          return (
            <span
              key={v}
              className="absolute -translate-x-1/2 text-center font-medium uppercase whitespace-nowrap transition-colors"
              style={{
                left: `${stopPos(i)}%`,
                fontSize: 17,
                letterSpacing: "0.67px",
                color: selected ? "#ffffff" : LABEL_GREY,
              }}
            >
              {EXEC_SCORE_LABELS[v]}
            </span>
          );
        })}
      </div>
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
  className = "",
}: {
  kicker: string;
  dotClass: string;
  accentClass: string;
  label: string;
  body: string;
  score: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl p-6 sm:p-8 border border-white/10 bg-white/[0.03] flex items-center gap-6 ${className}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
          <p className={`text-[13px] font-bold uppercase tracking-wider ${accentClass}`}>{kicker}</p>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white">{label}</h3>
        <p className="mt-2 text-base leading-relaxed" style={{ color: SUB_GREY }}>
          {body}
        </p>
      </div>
      <span className={`shrink-0 text-4xl font-extrabold ${accentClass}`}>
        {score.toFixed(1)}
        <span className="text-sm font-medium text-white/40">/5</span>
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
        <p className="text-sm font-semibold mb-1.5" style={{ color: "#1D43F1" }}>
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
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
        <div className="lg:col-span-3 flex flex-col gap-4">
          <ResultBar
            kicker="Your Standout"
            dotClass="bg-emerald-400"
            accentClass="text-emerald-300"
            label={results.high.dimension.label}
            body={results.high.dimension.standout}
            score={results.high.average}
            className="flex-1"
          />
          <ResultBar
            kicker="Your Biggest Opportunity"
            dotClass="bg-amber-400"
            accentClass="text-amber-300"
            label={results.low.dimension.label}
            body={results.low.dimension.opportunity}
            score={results.low.average}
            className="flex-1"
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
    <div className="lg:col-span-2 rounded-2xl p-5 sm:p-6 border border-white/10 bg-white/[0.03] flex flex-col">
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

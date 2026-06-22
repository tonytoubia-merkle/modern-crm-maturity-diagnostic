import Link from "next/link";
import { EXEC_STAGES } from "@/lib/data/execQuestions";
import {
  computeExecResults,
  decodeExecAnswers,
  hasAnyAnswer,
  type ExecResults,
} from "@/lib/exec/results";

export const metadata = {
  title: "Your Modern CRM Maturity · Merkle",
  description: "Your Modern CRM maturity snapshot from the Cannes self-assessment.",
};

const NEAR_BLACK = "#05060a";
const SUB_GREY = "#d6d6df";
const COBALT = "#1D43F1";

/**
 * Public, no-login results page the kiosk QR points to. The scores ride in the
 * `?r=` param (one digit per question — see lib/exec/results encodeExecAnswers),
 * so we recompute the exact same snapshot the kiosk showed, with zero PII, no
 * database lookup, and no auth. Server-rendered (Next 14 searchParams prop).
 */
export default function ExecResultsPage({
  searchParams,
}: {
  searchParams: { r?: string | string[] };
}) {
  const raw = Array.isArray(searchParams.r) ? searchParams.r[0] : searchParams.r;
  const answers = decodeExecAnswers(raw);

  return (
    <main
      className="min-h-[100dvh] w-full font-m2 text-white relative overflow-hidden"
      style={{ background: NEAR_BLACK }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url(/cover.png)",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-2xl px-5 py-10 sm:py-14">
        {hasAnyAnswer(answers) ? (
          <ResultsView results={computeExecResults(answers)} />
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  );
}

function ResultsView({ results }: { results: ExecResults }) {
  const stage = EXEC_STAGES[results.maturityStage];
  return (
    <div className="space-y-4">
      <Lockup />

      {/* Stage banner */}
      <section className="rounded-2xl px-6 py-5 border border-white/10 bg-white/[0.03]">
        <p className="text-sm font-semibold mb-1.5" style={{ color: COBALT }}>
          Et voilà! Here&apos;s where you stand:
        </p>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {stage.label}
          </h1>
          <span className="text-sm text-white/45">
            Overall {results.overallScore.toFixed(1)} / 5
          </span>
        </div>
        <p className="mt-2 text-sm sm:text-base leading-relaxed" style={{ color: SUB_GREY }}>
          {stage.description}
        </p>
      </section>

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

      <p className="pt-2 text-center text-sm text-white/45">
        A snapshot from the Merkle Modern CRM self-assessment.{" "}
        <Link href="/crm/exec" className="text-white/70 underline underline-offset-2">
          Take it yourself
        </Link>
      </p>
    </div>
  );
}

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
    <div className="rounded-2xl p-6 border border-white/10 bg-white/[0.03] flex items-center gap-5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
          <p className={`text-[13px] font-bold uppercase tracking-wider ${accentClass}`}>
            {kicker}
          </p>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">{label}</h2>
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

function Lockup() {
  return (
    <div className="flex flex-col items-start gap-1.5 pb-1">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
        Modern CRM
      </span>
      <span className="text-2xl font-extrabold tracking-tight text-white">MERKLE</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="space-y-4">
      <Lockup />
      <section className="rounded-2xl px-6 py-8 border border-white/10 bg-white/[0.03] text-center">
        <h1 className="text-2xl font-bold text-white">No results to show</h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: SUB_GREY }}>
          This link doesn&apos;t carry a completed assessment. Take the 90-second Modern CRM
          self-assessment to see where you stand.
        </p>
        <Link
          href="/crm/exec"
          className="mt-5 inline-block rounded-lg px-6 py-3 text-sm font-semibold text-white"
          style={{ backgroundColor: COBALT }}
        >
          Start the assessment
        </Link>
      </section>
    </div>
  );
}

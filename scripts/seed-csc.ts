/**
 * Seeds two Content Supply Chain (CSC) assessments:
 *   1. "Meridian Stores"     — fully completed, Retail, Stage 3 profile
 *   2. "Nimbus Travel Co."   — in-progress (~80% answered), Travel & Hospitality, Stage 2 profile
 *
 * Re-runs are idempotent: any prior rows with source='seed' are deleted
 * (csc_responses cascade) before the new seeds are created.
 *
 * Run: npx dotenv-cli -e .env.local -- npx tsx scripts/seed-csc.ts
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

async function sb<T = unknown>(
  path: string,
  body?: unknown,
  method: "GET" | "POST" | "PATCH" | "DELETE" = body ? "POST" : "GET"
): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer:
        method === "POST" || method === "PATCH" || method === "DELETE"
          ? "return=representation"
          : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    console.error(`Supabase ${method} ${path} ${res.status}:`, await res.text());
    throw new Error(`Supabase request failed: ${path}`);
  }
  return (await res.json()) as T;
}

function rid(n = 10) {
  const c = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < n; i++) out += c[Math.floor(Math.random() * c.length)];
  return out;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// Core question IDs per capability — mirrors lib/csc/data/questions.ts.
// 45 core questions across 6 capabilities.
const CORE_QS_BY_CAP: Record<string, number[]> = {
  strategy_planning: [1, 2, 3, 4, 5, 6, 7, 8],
  workflow_production: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  asset_governance: [19, 20, 21, 22, 23, 24, 25, 26, 27],
  distribution_activation: [28, 29, 30, 31, 32, 33, 34, 35, 36],
  measurement_insights: [37, 38, 39, 40, 41, 42],
  intelligence_automation: [43, 44, 45],
};

const CAPS_ORDER = [
  "strategy_planning",
  "workflow_production",
  "asset_governance",
  "distribution_activation",
  "measurement_insights",
  "intelligence_automation",
] as const;

// Industry question → capability mapping (mirrors lib/csc/data/questions.ts).
const RETAIL_QS: Array<{ id: string; capability: string }> = [
  { id: "retail_1", capability: "workflow_production" },
  { id: "retail_2", capability: "distribution_activation" },
  { id: "retail_3", capability: "asset_governance" },
  { id: "retail_4", capability: "strategy_planning" },
  { id: "retail_5", capability: "measurement_insights" },
];

const TH_QS: Array<{ id: string; capability: string }> = [
  { id: "th_1", capability: "distribution_activation" },
  { id: "th_2", capability: "asset_governance" },
  { id: "th_3", capability: "strategy_planning" },
  { id: "th_4", capability: "distribution_activation" },
  { id: "th_5", capability: "measurement_insights" },
];

type ResponseRow = {
  assessment_id: string;
  question_id: string;
  score: number;
  capability: string;
  is_industry_question: boolean;
  notes: string | null;
};

// Replicates computeCscCapabilityScores: average across that capability's
// CORE questions only (industry questions don't count toward capability).
function computeCapabilityScores(responses: ResponseRow[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const cap of CAPS_ORDER) {
    const rs = responses.filter((r) => !r.is_industry_question && r.capability === cap);
    const denom = CORE_QS_BY_CAP[cap].length;
    if (rs.length === 0) {
      out[cap] = 0;
      continue;
    }
    const sum = rs.reduce((s, r) => s + r.score, 0);
    out[cap] = Math.round((sum / denom) * 100) / 100;
  }
  return out;
}

function computeOverallScore(caps: Record<string, number>) {
  const vals = CAPS_ORDER.map((c) => caps[c]).filter((v) => v > 0);
  if (vals.length === 0) return 0;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
}

function computeMaturityStage(overall: number): 1 | 2 | 3 | 4 {
  if (overall < 1.75) return 1;
  if (overall < 2.75) return 2;
  if (overall < 3.75) return 3;
  return 4;
}

function buildCoreResponses(
  assessmentId: string,
  profile: Record<string, number>,
  /** capabilities to leave un-answered entirely */
  skipCaps: string[] = [],
  /** within one capability, keep this many questions (from the top) instead of all */
  partialCap?: { cap: string; keep: number }
): ResponseRow[] {
  const rows: ResponseRow[] = [];
  for (const cap of CAPS_ORDER) {
    if (skipCaps.includes(cap)) continue;
    const base = profile[cap] ?? 3;
    const ids = [...CORE_QS_BY_CAP[cap]];
    const keep = partialCap && partialCap.cap === cap ? partialCap.keep : ids.length;
    for (let i = 0; i < keep; i++) {
      const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
      rows.push({
        assessment_id: assessmentId,
        question_id: String(ids[i]),
        score: clamp(base + variation, 1, 5),
        capability: cap,
        is_industry_question: false,
        notes: null,
      });
    }
  }
  return rows;
}

function buildIndustryResponses(
  assessmentId: string,
  industryQs: Array<{ id: string; capability: string }>,
  profile: Record<string, number>,
  keep?: number
): ResponseRow[] {
  const rows: ResponseRow[] = [];
  const take = keep ?? industryQs.length;
  for (let i = 0; i < take; i++) {
    const q = industryQs[i];
    const base = profile[q.capability] ?? 3;
    const variation = Math.floor(Math.random() * 3) - 1;
    rows.push({
      assessment_id: assessmentId,
      question_id: q.id,
      score: clamp(base + variation, 1, 5),
      capability: q.capability,
      is_industry_question: true,
      notes: null,
    });
  }
  return rows;
}

async function seedComplete() {
  console.log("\n→ Seeding COMPLETE: Meridian Stores (Retail, Stage 3)");

  // Stage 3 target (~3.3) — strongest in production + asset governance,
  // operational in strategy/distribution, emerging in measurement + AI.
  const profile: Record<string, number> = {
    strategy_planning: 3,
    workflow_production: 4,
    asset_governance: 4,
    distribution_activation: 3,
    measurement_insights: 3,
    intelligence_automation: 3,
  };

  const shareId = rid();
  const [assessment] = await sb<Array<{ id: string; share_id: string }>>(
    "csc_assessments",
    {
      share_id: shareId,
      client_name: "Meridian Stores",
      client_company: "Retail / Commerce",
      respondent_name: "Alicia Nguyen",
      rep_email: "tony.toubia@merkle.com",
      is_rep_mode: false,
      industry: "retail",
      source: "seed",
      status: "in_progress",
    }
  );

  const responses: ResponseRow[] = [
    ...buildCoreResponses(assessment.id, profile),
    ...buildIndustryResponses(assessment.id, RETAIL_QS, profile),
  ];

  // Sprinkle two notes on representative questions.
  const firstStrategy = responses.find(
    (r) => r.capability === "strategy_planning" && !r.is_industry_question
  );
  if (firstStrategy) {
    firstStrategy.notes =
      "We restructured creative ops last year to push modular design into every brief.";
  }
  const firstGovernance = responses.find(
    (r) => r.capability === "asset_governance" && !r.is_industry_question
  );
  if (firstGovernance) {
    firstGovernance.notes =
      "DAM rollout finally complete across all three brands as of Q4.";
  }

  await sb("csc_responses", responses);

  const capScores = computeCapabilityScores(responses);
  const overall = computeOverallScore(capScores);
  const stage = computeMaturityStage(overall);

  await sb(
    `csc_assessments?id=eq.${assessment.id}`,
    {
      status: "completed",
      capability_scores: capScores,
      overall_score: overall,
      maturity_stage: stage,
    },
    "PATCH"
  );

  console.log(
    `  ✓ Meridian Stores — overall ${overall}, stage ${stage}, ${responses.length} responses`
  );
  console.log(`  → Results: /csc/results/${shareId}`);
  return { shareId, overall, stage, responseCount: responses.length };
}

async function seedMostlyComplete() {
  console.log(
    "\n→ Seeding MOSTLY COMPLETE: Nimbus Travel Co. (Travel & Hospitality, Stage 2)"
  );

  const profile: Record<string, number> = {
    strategy_planning: 3,
    workflow_production: 2,
    asset_governance: 3,
    distribution_activation: 3,
    measurement_insights: 2,
    intelligence_automation: 2,
  };

  const shareId = rid();
  const [assessment] = await sb<Array<{ id: string; share_id: string }>>(
    "csc_assessments",
    {
      share_id: shareId,
      client_name: "Nimbus Travel Co.",
      client_company: "Travel & Hospitality",
      respondent_name: "Marco Delgado",
      rep_email: "tony.toubia@merkle.com",
      is_rep_mode: false,
      industry: "travel_hospitality",
      source: "seed",
      status: "in_progress",
    }
  );

  // Answer: all of strategy_planning, workflow_production, asset_governance,
  // distribution_activation (= 8+10+9+9 = 36 core), plus the first 3 of
  // measurement_insights (= 39 core). Skip all intelligence_automation.
  // Plus 3 of 5 industry questions.
  const coreResponses = buildCoreResponses(
    assessment.id,
    profile,
    ["intelligence_automation"],
    { cap: "measurement_insights", keep: 3 }
  );
  const industryResponses = buildIndustryResponses(assessment.id, TH_QS, profile, 3);
  const responses: ResponseRow[] = [...coreResponses, ...industryResponses];

  const firstWorkflow = responses.find(
    (r) => r.capability === "workflow_production" && !r.is_industry_question
  );
  if (firstWorkflow) {
    firstWorkflow.notes =
      "Production team just started experimenting with modular briefs — early days.";
  }

  await sb("csc_responses", responses);

  // Leave status in_progress and no aggregates — realistic paused assessment.
  const totalExpected =
    Object.values(CORE_QS_BY_CAP).reduce((n, arr) => n + arr.length, 0) + TH_QS.length;
  console.log(
    `  ✓ Nimbus Travel Co. — in_progress, ${responses.length}/${totalExpected} responses`
  );
  console.log(`  → Partial view: /csc/results/${shareId}`);
  return { shareId, responseCount: responses.length };
}

async function cleanupPriorSeeds() {
  const removed = await sb<unknown[]>(
    `csc_assessments?source=eq.seed`,
    undefined,
    "DELETE"
  );
  if (removed.length > 0) {
    console.log(`Removed ${removed.length} prior seed assessment(s).`);
  }
}

async function main() {
  await cleanupPriorSeeds();

  const done = await seedComplete();
  const partial = await seedMostlyComplete();

  console.log("\nDone.");
  console.log("─".repeat(60));
  console.log(`Complete    → /csc/results/${done.shareId}`);
  console.log(`In-progress → /csc/results/${partial.shareId}  (partial scoring)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

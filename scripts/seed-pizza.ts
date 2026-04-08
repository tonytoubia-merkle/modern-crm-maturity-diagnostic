/**
 * Seeds "Tony Makes Pizza" project with 4 completed stakeholders.
 * Run: npx dotenv-cli -e .env.local -- npx tsx scripts/seed-pizza.ts
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function sb(path: string, body?: unknown) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json", Prefer: body ? "return=representation" : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) { console.error(await res.text()); throw new Error(`fail: ${path}`); }
  return res.json();
}

function rid(n = 10) {
  const c = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let r = ""; for (let i = 0; i < n; i++) r += c[Math.floor(Math.random() * c.length)]; return r;
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

const STAKEHOLDERS = [
  { name: "Tony Toubia", email: "tony@tonymakespizza.com", role: "Founder & CEO" },
  { name: "Maria Rossi", email: "maria@tonymakespizza.com", role: "VP Marketing" },
  { name: "Jake Park", email: "jake@tonymakespizza.com", role: "Head of Digital" },
  { name: "Anika Sharma", email: "anika@tonymakespizza.com", role: "Loyalty Program Manager" },
];

// [identity, signals, decisioning, engagement, media, learning, technology, organization]
const PROFILES = [
  [2, 2, 1, 3, 1, 1, 2, 3], // Tony: founder, knows engagement, weak on tech/data/decisioning
  [3, 3, 2, 4, 3, 2, 2, 3], // Maria: marketing, stronger engagement+media
  [3, 4, 2, 3, 2, 3, 4, 2], // Jake: digital, strong signals+tech
  [2, 2, 1, 4, 1, 2, 2, 2], // Anika: loyalty focused, strong engagement only
];

const QS: Record<string, number[]> = {
  identity: [1, 2, 3, 4], signals: [5, 6, 7], decisioning: [8, 9, 10],
  engagement: [11, 12, 13, 14, 15], media_activation: [16, 17, 18],
  learning_optimization: [19, 20, 21, 22], technology: [23, 24, 25, 26], organization: [27, 28, 29, 30],
};
const CAPS = Object.keys(QS);

async function main() {
  console.log("Creating Tony Makes Pizza project...");

  const psid = rid();
  const [proj] = await sb("projects", {
    share_id: psid, client_name: "Tony Makes Pizza", client_company: "Quick Service / Fast Casual",
    industry: "qsr", created_by_name: "Tony Toubia", created_by_email: "tony.toubia@merkle.com",
    mode: "workshop", status: "collecting",
  });
  console.log(`  Project: ${proj.id} (share: ${psid})`);

  for (let si = 0; si < STAKEHOLDERS.length; si++) {
    const s = STAKEHOLDERS[si];
    const profile = PROFILES[si];
    const token = rid(16);
    const asid = rid();

    const [assessment] = await sb("assessments", {
      share_id: asid, client_name: "Tony Makes Pizza", client_company: s.role,
      respondent_name: s.name, rep_email: s.email, is_rep_mode: false,
      industry: "qsr", status: "completed", project_id: proj.id,
    });

    const [stakeholder] = await sb("stakeholders", {
      project_id: proj.id, name: s.name, email: s.email, role: s.role,
      invite_token: token, assessment_id: assessment.id,
      status: "completed", completed_at: new Date().toISOString(),
    });

    await fetch(`${SUPABASE_URL}/rest/v1/assessments?id=eq.${assessment.id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ stakeholder_id: stakeholder.id }),
    });

    const responses: Array<{
      assessment_id: string; question_id: string; score: number; capability: string; is_industry_question: boolean;
    }> = [];

    for (let ci = 0; ci < CAPS.length; ci++) {
      const cap = CAPS[ci];
      const base = profile[ci];
      for (const qId of QS[cap]) {
        const v = Math.floor(Math.random() * 3) - 1;
        responses.push({ assessment_id: assessment.id, question_id: String(qId), score: clamp(base + v, 1, 5), capability: cap, is_industry_question: false });
      }
    }

    // QSR industry questions
    const qsrQs = ["qsr_1", "qsr_2", "qsr_3", "qsr_4", "qsr_5"];
    const qsrCaps = ["signals", "signals", "engagement", "engagement", "signals"];
    for (let ri = 0; ri < qsrQs.length; ri++) {
      const ci = CAPS.indexOf(qsrCaps[ri]);
      const base = ci >= 0 ? profile[ci] : 3;
      const v = Math.floor(Math.random() * 3) - 1;
      responses.push({ assessment_id: assessment.id, question_id: qsrQs[ri], score: clamp(base + v, 1, 5), capability: qsrCaps[ri], is_industry_question: true });
    }

    await sb("responses", responses);
    console.log(`  ${s.name} (${s.role}) — ${responses.length} responses`);
  }

  console.log(`\nDone! Dashboard: /project/${psid}`);
  console.log("Aggregation NOT triggered.");
}

main().catch(console.error);

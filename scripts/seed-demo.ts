/**
 * Seed script: creates an Acme Co. demo project with 5 stakeholders,
 * each with completed assessment responses. Does NOT trigger aggregation.
 *
 * Run: npx tsx scripts/seed-demo.ts
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function supabase(path: string, body?: unknown) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: body ? "return=representation" : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    console.error(`Supabase error ${res.status}:`, await res.text());
    throw new Error(`Supabase request failed: ${path}`);
  }
  return res.json();
}

function randomId(len = 10) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let r = "";
  for (let i = 0; i < len; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}

// 5 stakeholders with different perspectives and scoring tendencies
const STAKEHOLDERS = [
  { name: "Sarah Chen", email: "schen@acme.com", role: "VP, Marketing" },
  { name: "Marcus Williams", email: "mwilliams@acme.com", role: "Director, CRM & Loyalty" },
  { name: "Priya Patel", email: "ppatel@acme.com", role: "Head of Data & Analytics" },
  { name: "James Rodriguez", email: "jrodriguez@acme.com", role: "Director, Media" },
  { name: "Amanda Foster", email: "afoster@acme.com", role: "SVP, Digital Experience" },
];

// Score profiles per stakeholder — each has different strengths/gaps
// [identity, signals, decisioning, engagement, media, learning, technology, organization]
// Each array has base scores per capability; individual questions vary ±1
const SCORE_PROFILES: number[][] = [
  [3, 2, 2, 3, 2, 2, 3, 3], // Sarah: marketing leader, sees engagement better
  [4, 3, 2, 4, 2, 3, 3, 2], // Marcus: CRM/loyalty expert, strong on engagement+identity
  [4, 4, 3, 2, 2, 4, 4, 3], // Priya: data leader, strong on signals+tech+learning
  [2, 2, 2, 2, 4, 2, 2, 2], // James: media focused, only media is strong
  [3, 3, 3, 3, 3, 3, 3, 4], // Amanda: balanced SVP view, slight org strength
];

// Question IDs per capability
const QUESTIONS_BY_CAP: Record<string, number[]> = {
  identity: [1, 2, 3, 4],
  signals: [5, 6, 7],
  decisioning: [8, 9, 10],
  engagement: [11, 12, 13, 14, 15],
  media_activation: [16, 17, 18],
  learning_optimization: [19, 20, 21, 22],
  technology: [23, 24, 25, 26],
  organization: [27, 28, 29, 30],
};

const CAPS = Object.keys(QUESTIONS_BY_CAP);

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

async function main() {
  console.log("Creating Acme Co. demo project...");

  // 1. Create project
  const projectShareId = randomId();
  const [project] = await supabase("projects", {
    share_id: projectShareId,
    client_name: "Acme Co.",
    client_company: "Retail / Commerce",
    industry: "retail",
    created_by_name: "Tony Toubia",
    created_by_email: "tony.toubia@merkle.com",
    mode: "workshop",
    status: "collecting",
  });

  console.log(`  Project created: ${project.id} (share: ${projectShareId})`);

  // 2. Create stakeholders with linked assessments
  for (let si = 0; si < STAKEHOLDERS.length; si++) {
    const s = STAKEHOLDERS[si];
    const profile = SCORE_PROFILES[si];
    const inviteToken = randomId(16);
    const assessmentShareId = randomId();

    // Create assessment
    const [assessment] = await supabase("assessments", {
      share_id: assessmentShareId,
      client_name: "Acme Co.",
      client_company: s.role,
      respondent_name: s.name,
      rep_email: s.email,
      is_rep_mode: false,
      industry: "retail",
      status: "completed",
      project_id: project.id,
    });

    // Create stakeholder
    const [stakeholder] = await supabase("stakeholders", {
      project_id: project.id,
      name: s.name,
      email: s.email,
      role: s.role,
      invite_token: inviteToken,
      assessment_id: assessment.id,
      status: "completed",
      completed_at: new Date().toISOString(),
    });

    // Link assessment back to stakeholder
    await fetch(`${SUPABASE_URL}/rest/v1/assessments?id=eq.${assessment.id}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stakeholder_id: stakeholder.id }),
    });

    // Create responses for all 30 questions
    const responses: Array<{
      assessment_id: string;
      question_id: string;
      score: number;
      capability: string;
      is_industry_question: boolean;
    }> = [];

    for (let ci = 0; ci < CAPS.length; ci++) {
      const cap = CAPS[ci];
      const baseScore = profile[ci];
      const questionIds = QUESTIONS_BY_CAP[cap];

      for (const qId of questionIds) {
        // Vary ±1 from base score, clamped to 1-5
        const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const score = clamp(baseScore + variation, 1, 5);
        responses.push({
          assessment_id: assessment.id,
          question_id: String(qId),
          score,
          capability: cap,
          is_industry_question: false,
        });
      }
    }

    // Also add retail industry questions (5 questions)
    const retailQs = ["retail_1", "retail_2", "retail_3", "retail_4", "retail_5"];
    const retailCaps = ["identity", "signals", "decisioning", "engagement", "identity"];
    for (let ri = 0; ri < retailQs.length; ri++) {
      const capIdx = CAPS.indexOf(retailCaps[ri]);
      const base = capIdx >= 0 ? profile[capIdx] : 3;
      const variation = Math.floor(Math.random() * 3) - 1;
      responses.push({
        assessment_id: assessment.id,
        question_id: retailQs[ri],
        score: clamp(base + variation, 1, 5),
        capability: retailCaps[ri],
        is_industry_question: true,
      });
    }

    await supabase("responses", responses);

    console.log(`  Stakeholder: ${s.name} (${s.role}) — ${responses.length} responses`);
  }

  console.log(`\nDone! Project dashboard: /project/${projectShareId}`);
  console.log("Aggregation NOT triggered — click 'Aggregate' on the dashboard to generate results.");
}

main().catch(console.error);

import {
  CORE_QUESTIONS,
  INDUSTRY_QUESTIONS,
  CAPABILITIES_ORDER,
  CAPABILITY_LABELS,
  CAPABILITY_SUBTITLES,
  QUESTIONS_BY_CAPABILITY,
  SCORE_LABELS,
  SCORE_DESCRIPTIONS,
  resolveQuestionText,
} from "@/lib/data/questions";
import type { InferredScore, ChatPhase } from "./types";
import type { Industry } from "@/lib/types";

export function buildSystemPrompt(
  clientName: string,
  respondentName: string,
  industry: Industry | null,
  scores: Record<string, InferredScore>,
  skipped: (string | number)[],
  phase: ChatPhase
): string {
  const sections: string[] = [];

  // ── ROLE ──
  sections.push(`You are a CRM maturity diagnostic consultant from Merkle (a dentsu company). You are conducting a conversational assessment of ${clientName}'s CRM capabilities with ${respondentName}.

You are knowledgeable, approachable, and efficient. You NEVER sound like you're reading from a survey or questionnaire. You have a natural conversation about their CRM capabilities and infer maturity scores from what they tell you.`);

  // ── SCORING SCALE ──
  sections.push(`SCORING SCALE (1-5):
${Object.entries(SCORE_LABELS).map(([k, v]) => `${k} = ${v}: ${SCORE_DESCRIPTIONS[Number(k)]}`).join("\n")}`);

  // ── QUESTION BANK ──
  const questionBank: string[] = ["QUESTION BANK – 30 core questions across 8 capabilities:"];
  for (const cap of CAPABILITIES_ORDER) {
    const qs = QUESTIONS_BY_CAPABILITY[cap];
    const label = CAPABILITY_LABELS[cap];
    const subtitle = CAPABILITY_SUBTITLES[cap];
    questionBank.push(`\n${label} (${subtitle}):`);
    for (const q of qs) {
      const scoreInfo = scores[String(q.id)];
      const isSkipped = skipped.includes(q.id) || skipped.includes(String(q.id));
      const status = scoreInfo
        ? `[SCORED: ${scoreInfo.score} – ${scoreInfo.evidence}]`
        : isSkipped
        ? "[SKIPPED]"
        : "[NEEDS ANSWER]";
      // Use a shortened version of the question – resolved against
      // the selected industry so dynamic-text questions present their
      // industry-natural wording to the LLM.
      const fullText = resolveQuestionText(q, industry);
      const shortText = fullText.replace(/^To what extent (does |are |is |can )?the organization('s)? /i, "").replace(/\?$/, "");
      questionBank.push(`  Q${q.id}: ${shortText} ${status}`);
    }
  }

  if (industry) {
    const indQs = INDUSTRY_QUESTIONS.filter((q) => q.industry === industry);
    questionBank.push(`\nIndustry-Specific (${industry}):`);
    for (const q of indQs) {
      const scoreInfo = scores[String(q.id)];
      const isSkipped = skipped.includes(q.id) || skipped.includes(String(q.id));
      const status = scoreInfo
        ? `[SCORED: ${scoreInfo.score}]`
        : isSkipped
        ? "[SKIPPED]"
        : "[NEEDS ANSWER]";
      const shortText = q.text.replace(/^To what extent (does |are |is |can )?/i, "").replace(/\?$/, "");
      questionBank.push(`  ${q.id}: ${shortText} ${status}`);
    }
  }

  sections.push(questionBank.join("\n"));

  // ── COVERAGE STATE ──
  const totalCore = CORE_QUESTIONS.length;
  const totalIndustry = industry ? INDUSTRY_QUESTIONS.filter((q) => q.industry === industry).length : 0;
  const total = totalCore + totalIndustry;
  const answeredCount = Object.keys(scores).length + skipped.length;
  const remaining: string[] = [];

  for (const cap of CAPABILITIES_ORDER) {
    const qs = QUESTIONS_BY_CAPABILITY[cap];
    const unanswered = qs.filter(
      (q) => !scores[String(q.id)] && !skipped.includes(q.id) && !skipped.includes(String(q.id))
    );
    if (unanswered.length > 0) {
      remaining.push(`${CAPABILITY_LABELS[cap]}: Q${unanswered.map((q) => q.id).join(", Q")}`);
    }
  }

  sections.push(`COVERAGE: ${answeredCount}/${total} questions answered or skipped.
${remaining.length > 0 ? `Still need answers for: ${remaining.join("; ")}` : "All questions covered – ready for confirmation."}`);

  // ── PHASE INSTRUCTION ──
  const phaseInstructions: Record<ChatPhase, string> = {
    opening: `PHASE: Opening. Start with a warm greeting to ${respondentName}. Ask a broad, open-ended question like: "Tell me about how ${clientName} manages customer relationships today – what systems you use, how teams are structured, and where you see the biggest strengths and gaps." Let them talk freely. Extract as many scores as you can from their answer.`,
    exploration: `PHASE: Exploration. Continue the conversation naturally. Follow the thread of what ${respondentName} is telling you. After acknowledging what you've learned, steer toward capability areas that still have unanswered questions. Focus on the LEAST covered capability. Don't jump between topics – let the conversation flow naturally from one area to related ones.`,
    gap_filling: `PHASE: Gap filling. Most questions are covered. Now ask targeted questions about the remaining gaps. Group related gaps together. For example: "We haven't touched on your media activation approach – how does CRM data feed into paid media targeting?" Be direct but conversational.`,
    confirmation: `PHASE: Confirmation. All questions have inferred scores. Present a summary table organized by capability showing each question's inferred score (1-5) and a one-line evidence note. Ask ${respondentName} if any scores feel wrong and should be adjusted. Keep it concise – use a structured format.`,
    complete: `PHASE: Complete. Thank ${respondentName} and let them know the assessment is being finalized.`,
  };

  sections.push(phaseInstructions[phase]);

  // ── SCORING RULES ──
  sections.push(`SCORING RULES:
After EVERY response from the user, you MUST emit a <scores> JSON block at the very end of your message. This block is hidden from the user.

Format:
<scores>
{
  "updates": [
    { "questionId": 1, "score": 3, "confidence": "high", "evidence": "Has CDP but not connected to loyalty platform" }
  ],
  "skipped": []
}
</scores>

Rules:
- Score 1 if capability doesn't exist or is ad hoc
- Score 2 if there are pilots or isolated efforts
- Score 3 if operational but not integrated across org
- Score 4 if works across teams with governance
- Score 5 if fully optimized with continuous improvement
- Only score when you have clear evidence. If uncertain between two, use the lower score with "confidence": "low"
- If user says "I don't know" about a topic, add those questionIds to "skipped"
- A single user response can update multiple questions
- You can update previously scored questions if new info changes the assessment
- questionId is a number (1-30) for core questions or a string like "qsr_1" for industry questions
- ALWAYS include the <scores> block, even if empty: {"updates":[],"skipped":[]}`);

  // ── STYLE RULES ──
  sections.push(`CONVERSATION STYLE:
- Never list all questions or mention you have a questionnaire
- Ask at most 2 follow-up questions at a time
- Acknowledge what you learned before asking more
- Use "${clientName}" naturally in conversation
- Reference specific details they mentioned
- When probing, explain WHY you're asking
- Keep responses concise – 2-4 paragraphs max
- Be encouraging about what they're doing well, not just gap-focused`);

  return sections.join("\n\n---\n\n");
}

import {
  AIENT_CORE_QUESTIONS,
  AIENT_INDUSTRY_QUESTIONS,
  AIENT_CAPABILITIES_ORDER,
  AIENT_CAPABILITY_LABELS,
  AIENT_CAPABILITY_SUBTITLES,
  AIENT_QUESTIONS_BY_CAPABILITY,
  AIENT_SCORE_LABELS,
  AIENT_SCORE_DESCRIPTIONS,
  resolveAientQuestionText,
} from "@/lib/aient/data/questions";
import type { AientInferredScore, AientChatPhase } from "./types";
import type { AientIndustry } from "@/lib/aient/types";

export function buildAientSystemPrompt(
  clientName: string,
  respondentName: string,
  industry: AientIndustry | null,
  scores: Record<string, AientInferredScore>,
  skipped: (string | number)[],
  phase: AientChatPhase
): string {
  const sections: string[] = [];

  sections.push(`You are an AI for Enterprise diagnostic consultant from Merkle (a dentsu company). You are conducting a conversational assessment of ${clientName}'s enterprise AI maturity with ${respondentName}.

You are knowledgeable, approachable, and efficient. You NEVER sound like you're reading from a survey or questionnaire. You have a natural conversation about how the enterprise has built its data foundations, designed AI use cases, redesigned work, delivered intelligence into workflows, run AI assurance, and managed AI adoption — and you infer maturity scores from what they tell you.

The "AI for Enterprise" framing comes from Merkle's 2026 narrative — only ~12% of organisations are seeing meaningful EBIT impact from AI today. The gap isn't models; it's the operating model around them. The four pillars are Data Foundations, Work Design, Enterprise Intelligence Systems, and AI Assurance & Trust. Use that framing naturally.`);

  sections.push(`SCORING SCALE (1-5):
${Object.entries(AIENT_SCORE_LABELS)
  .map(([k, v]) => `${k} = ${v}: ${AIENT_SCORE_DESCRIPTIONS[Number(k)]}`)
  .join("\n")}`);

  const totalCore = AIENT_CORE_QUESTIONS.length;
  const questionBank: string[] = [
    `QUESTION BANK — ${totalCore} core questions across ${AIENT_CAPABILITIES_ORDER.length} capabilities:`,
  ];
  for (const cap of AIENT_CAPABILITIES_ORDER) {
    const qs = AIENT_QUESTIONS_BY_CAPABILITY[cap];
    const label = AIENT_CAPABILITY_LABELS[cap];
    const subtitle = AIENT_CAPABILITY_SUBTITLES[cap];
    questionBank.push(`\n${label} (${subtitle}):`);
    for (const q of qs) {
      const scoreInfo = scores[String(q.id)];
      const isSkipped =
        skipped.includes(q.id) || skipped.includes(String(q.id));
      const status = scoreInfo
        ? `[SCORED: ${scoreInfo.score} — ${scoreInfo.evidence}]`
        : isSkipped
        ? "[SKIPPED]"
        : "[NEEDS ANSWER]";
      const fullText = resolveAientQuestionText(q, industry);
      const shortText = fullText
        .replace(
          /^To what extent (does |are |is |can )?the (enterprise|organization)('s)? /i,
          ""
        )
        .replace(/\?$/, "");
      questionBank.push(`  Q${q.id}: ${shortText} ${status}`);
    }
  }

  if (industry) {
    const indQs = AIENT_INDUSTRY_QUESTIONS.filter(
      (q) => q.industry === industry
    );
    if (indQs.length > 0) {
      questionBank.push(`\nIndustry-Specific (${industry}):`);
      for (const q of indQs) {
        const scoreInfo = scores[String(q.id)];
        const isSkipped =
          skipped.includes(q.id) || skipped.includes(String(q.id));
        const status = scoreInfo
          ? `[SCORED: ${scoreInfo.score}]`
          : isSkipped
          ? "[SKIPPED]"
          : "[NEEDS ANSWER]";
        const shortText = q.text
          .replace(/^To what extent (does |are |is |can )?/i, "")
          .replace(/\?$/, "");
        questionBank.push(`  ${q.id}: ${shortText} ${status}`);
      }
    }
  }

  sections.push(questionBank.join("\n"));

  // Coverage state
  const totalIndustry = industry
    ? AIENT_INDUSTRY_QUESTIONS.filter((q) => q.industry === industry).length
    : 0;
  const total = totalCore + totalIndustry;
  const answeredCount = Object.keys(scores).length + skipped.length;
  const remaining: string[] = [];

  for (const cap of AIENT_CAPABILITIES_ORDER) {
    const qs = AIENT_QUESTIONS_BY_CAPABILITY[cap];
    const unanswered = qs.filter(
      (q) =>
        !scores[String(q.id)] &&
        !skipped.includes(q.id) &&
        !skipped.includes(String(q.id))
    );
    if (unanswered.length > 0) {
      remaining.push(
        `${AIENT_CAPABILITY_LABELS[cap]}: Q${unanswered
          .map((q) => q.id)
          .join(", Q")}`
      );
    }
  }

  sections.push(`COVERAGE: ${answeredCount}/${total} questions answered or skipped.
${
  remaining.length > 0
    ? `Still need answers for: ${remaining.join("; ")}`
    : "All questions covered — ready for confirmation."
}`);

  // Phase instructions
  const phaseInstructions: Record<AientChatPhase, string> = {
    opening: `PHASE: Opening. Start with a warm greeting to ${respondentName}. Ask a broad, open-ended question like: "Tell me how ${clientName} thinks about AI as an enterprise capability today — where the data foundations sit, where AI work is happening, and where you're seeing impact (or not). Where are the bets, and where are the gaps?" Let them talk freely. Extract as many scores as you can from their answer.`,
    exploration: `PHASE: Exploration. Continue the conversation naturally. Follow the thread of what ${respondentName} is telling you. After acknowledging what you've learned, steer toward capability areas that still have unanswered questions. Focus on the LEAST covered capability. Don't jump between topics — let the conversation flow naturally from one area to related ones.`,
    gap_filling: `PHASE: Gap filling. Most questions are covered. Ask targeted questions about the remaining gaps. Group related gaps together. For example: "We haven't really dug into AI assurance — where does model-risk policy stand for tier-1 surfaces?" Be direct but conversational.`,
    confirmation: `PHASE: Confirmation. All questions have inferred scores. Present a summary table organized by capability showing each question's inferred score (1-5) and a one-line evidence note. Ask ${respondentName} if any scores feel wrong and should be adjusted. Keep it concise — use a structured format.`,
    complete: `PHASE: Complete. Thank ${respondentName} and let them know the assessment is being finalized.`,
  };

  sections.push(phaseInstructions[phase]);

  // Scoring rules
  sections.push(`SCORING RULES:
After EVERY response from the user, you MUST emit a <scores> JSON block at the very end of your message. This block is hidden from the user.

Format:
<scores>
{
  "updates": [
    { "questionId": 1, "score": 3, "confidence": "high", "evidence": "Lakehouse exists; semantic layer in flight; metadata still partial" }
  ],
  "skipped": []
}
</scores>

Rules:
- Score 1 if the capability is not in place (disconnected pilots, no data foundation, unmanaged AI risk)
- Score 2 if pilots or isolated efforts exist but not consistent
- Score 3 if operational and used by core teams but not embedded across value streams
- Score 4 if the capability runs across data, work, intelligence delivery, assurance and adoption with shared governance and KPIs
- Score 5 if AI-augmented, agent-orchestrated, continuously optimised — workflows fundamentally redesigned and EBIT impact attributable
- Only score when you have clear evidence. If uncertain between two, use the lower score with "confidence": "low"
- If the user says "I don't know" about a topic, add those questionIds to "skipped"
- A single user response can update multiple questions
- You can update previously scored questions if new info changes the assessment
- questionId is a number for core questions (1-36) or a string like "manufacturing_1" for industry questions
- ALWAYS include the <scores> block, even if empty: {"updates":[],"skipped":[]}`);

  // Style
  sections.push(`CONVERSATION STYLE:
- Never list all questions or mention you have a questionnaire
- Ask at most 2 follow-up questions at a time
- Acknowledge what you learned before asking more
- Use "${clientName}" naturally in conversation
- Reference specific details they mentioned
- When probing, explain WHY you're asking
- Keep responses concise — 2-4 paragraphs max
- Be encouraging about what they're doing well, not just gap-focused
- The AI for Enterprise vocabulary: "data foundations", "lakehouse / semantic layer", "knowledge graph + RAG", "use case portfolio", "value stream", "human + AI teaming", "workflow redesign", "copilot", "agentic workflow", "multi-agent orchestration", "embedded intelligence", "decision-led analytics", "model risk / EU AI Act / NIST AI RMF", "AI assurance", "adoption / change", "operating model", "AI high performer" — use these terms naturally rather than generic AI jargon`);

  return sections.join("\n\n---\n\n");
}

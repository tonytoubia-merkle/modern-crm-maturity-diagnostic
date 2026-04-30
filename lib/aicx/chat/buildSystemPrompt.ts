import {
  AICX_CORE_QUESTIONS,
  AICX_INDUSTRY_QUESTIONS,
  AICX_CAPABILITIES_ORDER,
  AICX_CAPABILITY_LABELS,
  AICX_CAPABILITY_SUBTITLES,
  AICX_QUESTIONS_BY_CAPABILITY,
  AICX_SCORE_LABELS,
  AICX_SCORE_DESCRIPTIONS,
  resolveAicxQuestionText,
} from "@/lib/aicx/data/questions";
import type { AicxInferredScore, AicxChatPhase } from "./types";
import type { AicxIndustry } from "@/lib/aicx/types";

export function buildAicxSystemPrompt(
  clientName: string,
  respondentName: string,
  industry: AicxIndustry | null,
  scores: Record<string, AicxInferredScore>,
  skipped: (string | number)[],
  phase: AicxChatPhase
): string {
  const sections: string[] = [];

  sections.push(`You are an AI for CX diagnostic consultant from Merkle (a dentsu company). You are conducting a conversational assessment of ${clientName}'s AI for CX maturity with ${respondentName}.

You are knowledgeable, approachable, and efficient. You NEVER sound like you're reading from a survey or questionnaire. You have a natural conversation about how the brand shows up to AI agents, how AI shapes the digital experience, how personalization is run, and how AI investment is measured – and you infer maturity scores from what they tell you.

The "AI for CX" framing comes from Merkle's 2026 deep dive: AI is no longer the future of CX – it's reshaping search, experience, personalization, and measurement right now. The four pillars are Agentic Discoverability, Agentic Experience, Adaptive Personalization, and Customer Experience Optimization (EXO). Use that framing naturally.`);

  sections.push(`SCORING SCALE (1-5):
${Object.entries(AICX_SCORE_LABELS)
  .map(([k, v]) => `${k} = ${v}: ${AICX_SCORE_DESCRIPTIONS[Number(k)]}`)
  .join("\n")}`);

  const totalCore = AICX_CORE_QUESTIONS.length;
  const questionBank: string[] = [
    `QUESTION BANK – ${totalCore} core questions across ${AICX_CAPABILITIES_ORDER.length} capabilities:`,
  ];
  for (const cap of AICX_CAPABILITIES_ORDER) {
    const qs = AICX_QUESTIONS_BY_CAPABILITY[cap];
    const label = AICX_CAPABILITY_LABELS[cap];
    const subtitle = AICX_CAPABILITY_SUBTITLES[cap];
    questionBank.push(`\n${label} (${subtitle}):`);
    for (const q of qs) {
      const scoreInfo = scores[String(q.id)];
      const isSkipped =
        skipped.includes(q.id) || skipped.includes(String(q.id));
      const status = scoreInfo
        ? `[SCORED: ${scoreInfo.score} – ${scoreInfo.evidence}]`
        : isSkipped
        ? "[SKIPPED]"
        : "[NEEDS ANSWER]";
      const fullText = resolveAicxQuestionText(q, industry);
      const shortText = fullText
        .replace(
          /^To what extent (does |are |is |can )?the (brand|organization)('s)? /i,
          ""
        )
        .replace(/\?$/, "");
      questionBank.push(`  Q${q.id}: ${shortText} ${status}`);
    }
  }

  if (industry) {
    const indQs = AICX_INDUSTRY_QUESTIONS.filter((q) => q.industry === industry);
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
    ? AICX_INDUSTRY_QUESTIONS.filter((q) => q.industry === industry).length
    : 0;
  const total = totalCore + totalIndustry;
  const answeredCount = Object.keys(scores).length + skipped.length;
  const remaining: string[] = [];

  for (const cap of AICX_CAPABILITIES_ORDER) {
    const qs = AICX_QUESTIONS_BY_CAPABILITY[cap];
    const unanswered = qs.filter(
      (q) =>
        !scores[String(q.id)] &&
        !skipped.includes(q.id) &&
        !skipped.includes(String(q.id))
    );
    if (unanswered.length > 0) {
      remaining.push(
        `${AICX_CAPABILITY_LABELS[cap]}: Q${unanswered.map((q) => q.id).join(", Q")}`
      );
    }
  }

  sections.push(`COVERAGE: ${answeredCount}/${total} questions answered or skipped.
${
  remaining.length > 0
    ? `Still need answers for: ${remaining.join("; ")}`
    : "All questions covered – ready for confirmation."
}`);

  // Phase instructions
  const phaseInstructions: Record<AicxChatPhase, string> = {
    opening: `PHASE: Opening. Start with a warm greeting to ${respondentName}. Ask a broad, open-ended question like: "Tell me how ${clientName} thinks about AI showing up in the customer experience today – discoverability, experience, personalization, and measurement. Where are the bets, and where are the gaps?" Let them talk freely. Extract as many scores as you can from their answer.`,
    exploration: `PHASE: Exploration. Continue the conversation naturally. Follow the thread of what ${respondentName} is telling you. After acknowledging what you've learned, steer toward capability areas that still have unanswered questions. Focus on the LEAST covered capability. Don't jump between topics – let the conversation flow naturally from one area to related ones.`,
    gap_filling: `PHASE: Gap filling. Most questions are covered. Ask targeted questions about the remaining gaps. Group related gaps together. For example: "We haven't really talked about how AI is measured today – where does experimentation rigor stand?" Be direct but conversational.`,
    confirmation: `PHASE: Confirmation. All questions have inferred scores. Present a summary table organized by capability showing each question's inferred score (1-5) and a one-line evidence note. Ask ${respondentName} if any scores feel wrong and should be adjusted. Keep it concise – use a structured format.`,
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
    { "questionId": 1, "score": 3, "confidence": "high", "evidence": "Schema and structured data live on top categories but not consistent across all PDPs" }
  ],
  "skipped": []
}
</scores>

Rules:
- Score 1 if the capability is not in place (AI-invisible, no schema, no AI-native experience, faith-based investment)
- Score 2 if pilots or isolated efforts exist but not consistent
- Score 3 if operational and used by core teams but not orchestrated end-to-end
- Score 4 if the capability runs across discovery, experience, personalization and measurement with shared governance and KPIs
- Score 5 if AI-augmented, agent-orchestrated, continuously optimised, validated through rigorous experimentation
- Only score when you have clear evidence. If uncertain between two, use the lower score with "confidence": "low"
- If the user says "I don't know" about a topic, add those questionIds to "skipped"
- A single user response can update multiple questions
- You can update previously scored questions if new info changes the assessment
- questionId is a number for core questions (1-36) or a string like "retail_1" for industry questions
- ALWAYS include the <scores> block, even if empty: {"updates":[],"skipped":[]}`);

  // Style
  sections.push(`CONVERSATION STYLE:
- Never list all questions or mention you have a questionnaire
- Ask at most 2 follow-up questions at a time
- Acknowledge what you learned before asking more
- Use "${clientName}" naturally in conversation
- Reference specific details they mentioned
- When probing, explain WHY you're asking
- Keep responses concise – 2-4 paragraphs max
- Be encouraging about what they're doing well, not just gap-focused
- The AI for CX vocabulary: "agentic discoverability", "AEO / answer-engine optimisation", "schema and knowledge graph", "agentic experience", "conversational commerce", "Gen-Alpha research patterns", "real-time decisioning", "feature store", "next-best-action / NBA", "EXO / experimentation", "multi-arm bandits", "factorial design", "holdout discipline", "AI confidence scoring", "trigger logic", "brand-safety guardrails", "value-realisation scorecard" – use these terms naturally rather than generic AI jargon`);

  return sections.join("\n\n---\n\n");
}

import {
  CSC_CORE_QUESTIONS,
  CSC_INDUSTRY_QUESTIONS,
  CSC_CAPABILITIES_ORDER,
  CSC_CAPABILITY_LABELS,
  CSC_CAPABILITY_SUBTITLES,
  CSC_QUESTIONS_BY_CAPABILITY,
  CSC_SCORE_LABELS,
  CSC_SCORE_DESCRIPTIONS,
} from "@/lib/csc/data/questions";
import type { CscInferredScore, CscChatPhase } from "./types";
import type { CscIndustry } from "@/lib/csc/types";

export function buildCscSystemPrompt(
  clientName: string,
  respondentName: string,
  industry: CscIndustry | null,
  scores: Record<string, CscInferredScore>,
  skipped: (string | number)[],
  phase: CscChatPhase
): string {
  const sections: string[] = [];

  sections.push(`You are a Content Supply Chain (CSC) maturity diagnostic consultant from Merkle (a dentsu company). You are conducting a conversational assessment of ${clientName}'s content supply chain capabilities with ${respondentName}.

You are knowledgeable, approachable, and efficient. You NEVER sound like you're reading from a survey or questionnaire. You have a natural conversation about how the organization plans, produces, governs, distributes, measures, and AI-augments content — and infer maturity scores from what they tell you.

The "content supply chain" is the end-to-end system an organization uses to turn creative ideas into personalized content at scale. Think DAMs and asset libraries, briefing and production workflows, modular content and personalization, distribution into CRM/commerce/media, measurement loops back into briefing, and the role of GenAI / agentic workflows across all of it.`);

  sections.push(`SCORING SCALE (1-5):
${Object.entries(CSC_SCORE_LABELS)
  .map(([k, v]) => `${k} = ${v}: ${CSC_SCORE_DESCRIPTIONS[Number(k)]}`)
  .join("\n")}`);

  const totalCore = CSC_CORE_QUESTIONS.length;
  const questionBank: string[] = [
    `QUESTION BANK — ${totalCore} core questions across ${CSC_CAPABILITIES_ORDER.length} capabilities:`,
  ];
  for (const cap of CSC_CAPABILITIES_ORDER) {
    const qs = CSC_QUESTIONS_BY_CAPABILITY[cap];
    const label = CSC_CAPABILITY_LABELS[cap];
    const subtitle = CSC_CAPABILITY_SUBTITLES[cap];
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
      const shortText = q.text
        .replace(
          /^To what extent (does |are |is |can )?the organization('s)? /i,
          ""
        )
        .replace(/\?$/, "");
      questionBank.push(`  Q${q.id}: ${shortText} ${status}`);
    }
  }

  if (industry) {
    const indQs = CSC_INDUSTRY_QUESTIONS.filter(
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
    ? CSC_INDUSTRY_QUESTIONS.filter((q) => q.industry === industry).length
    : 0;
  const total = totalCore + totalIndustry;
  const answeredCount = Object.keys(scores).length + skipped.length;
  const remaining: string[] = [];

  for (const cap of CSC_CAPABILITIES_ORDER) {
    const qs = CSC_QUESTIONS_BY_CAPABILITY[cap];
    const unanswered = qs.filter(
      (q) =>
        !scores[String(q.id)] &&
        !skipped.includes(q.id) &&
        !skipped.includes(String(q.id))
    );
    if (unanswered.length > 0) {
      remaining.push(
        `${CSC_CAPABILITY_LABELS[cap]}: Q${unanswered.map((q) => q.id).join(", Q")}`
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
  const phaseInstructions: Record<CscChatPhase, string> = {
    opening: `PHASE: Opening. Start with a warm greeting to ${respondentName}. Ask a broad, open-ended question like: "Tell me about how ${clientName} produces and distributes content today — what tools and teams are involved, where the biggest bottlenecks are, and where AI is starting to fit in." Let them talk freely. Extract as many scores as you can from their answer.`,
    exploration: `PHASE: Exploration. Continue the conversation naturally. Follow the thread of what ${respondentName} is telling you. After acknowledging what you've learned, steer toward capability areas that still have unanswered questions. Focus on the LEAST covered capability. Don't jump between topics — let the conversation flow naturally from one area to related ones.`,
    gap_filling: `PHASE: Gap filling. Most questions are covered. Ask targeted questions about the remaining gaps. Group related gaps together. For example: "We haven't talked about how content performance feeds back into briefing — what does measurement look like today?" Be direct but conversational.`,
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
    { "questionId": 1, "score": 3, "confidence": "high", "evidence": "Has DAM but content not modular; teams produce per-channel" }
  ],
  "skipped": []
}
</scores>

Rules:
- Score 1 if the capability is not in place (manual, ad hoc, siloed)
- Score 2 if there are isolated efforts or partial tools (e.g. DAM but no governance)
- Score 3 if operational and connected across some teams
- Score 4 if works across teams with shared standards, governance, and modular practice
- Score 5 if fully optimized — modular content, AI-augmented, asset intelligence feeding briefing, measurement loops closed
- Only score when you have clear evidence. If uncertain between two, use the lower score with "confidence": "low"
- If user says "I don't know" about a topic, add those questionIds to "skipped"
- A single user response can update multiple questions
- You can update previously scored questions if new info changes the assessment
- questionId is a number for core questions or a string like "retail_1" for industry questions
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
- The CSC vocabulary uses "DAM", "modular content", "briefing", "asset intelligence", "GenAI", "agentic workflows", "personalization variants", "content velocity" — use these terms naturally rather than CRM/marketing jargon`);

  return sections.join("\n\n---\n\n");
}

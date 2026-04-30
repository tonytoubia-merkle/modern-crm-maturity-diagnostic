import {
  B2B_CORE_QUESTIONS,
  B2B_INDUSTRY_QUESTIONS,
  B2B_CAPABILITIES_ORDER,
  B2B_CAPABILITY_LABELS,
  B2B_CAPABILITY_SUBTITLES,
  B2B_QUESTIONS_BY_CAPABILITY,
  B2B_SCORE_LABELS,
  B2B_SCORE_DESCRIPTIONS,
  resolveB2bQuestionText,
} from "@/lib/b2b/data/questions";
import type { B2bInferredScore, B2bChatPhase } from "./types";
import type { B2bIndustry } from "@/lib/b2b/types";

export function buildB2bSystemPrompt(
  clientName: string,
  respondentName: string,
  industry: B2bIndustry | null,
  scores: Record<string, B2bInferredScore>,
  skipped: (string | number)[],
  phase: B2bChatPhase
): string {
  const sections: string[] = [];

  sections.push(`You are a B2B Transformation diagnostic consultant from Merkle (a dentsu company). You are conducting a conversational assessment of ${clientName}'s account-based maturity with ${respondentName}.

You are knowledgeable, approachable, and efficient. You NEVER sound like you're reading from a survey or questionnaire. You have a natural conversation about how the organization runs marketing, selling, service, and operations against its highest-value accounts — and you infer maturity scores from what they tell you.

The "B2B Transformation" framing comes from Merkle's 2025 GTM narrative: Account-Based Everything Transformation reshapes how a business thinks, operates, and engages with customers — aligning marketing, sales, service, and operations around shared account success. Use that framing naturally.`);

  sections.push(`SCORING SCALE (1-5):
${Object.entries(B2B_SCORE_LABELS)
  .map(([k, v]) => `${k} = ${v}: ${B2B_SCORE_DESCRIPTIONS[Number(k)]}`)
  .join("\n")}`);

  const totalCore = B2B_CORE_QUESTIONS.length;
  const questionBank: string[] = [
    `QUESTION BANK — ${totalCore} core questions across ${B2B_CAPABILITIES_ORDER.length} capabilities:`,
  ];
  for (const cap of B2B_CAPABILITIES_ORDER) {
    const qs = B2B_QUESTIONS_BY_CAPABILITY[cap];
    const label = B2B_CAPABILITY_LABELS[cap];
    const subtitle = B2B_CAPABILITY_SUBTITLES[cap];
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
      // Resolve against industry so dynamic-text questions present
      // their industry-natural wording to the LLM.
      const fullText = resolveB2bQuestionText(q, industry);
      const shortText = fullText
        .replace(
          /^To what extent (does |are |is |can )?the organization('s)? /i,
          ""
        )
        .replace(/\?$/, "");
      questionBank.push(`  Q${q.id}: ${shortText} ${status}`);
    }
  }

  if (industry) {
    const indQs = B2B_INDUSTRY_QUESTIONS.filter((q) => q.industry === industry);
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
    ? B2B_INDUSTRY_QUESTIONS.filter((q) => q.industry === industry).length
    : 0;
  const total = totalCore + totalIndustry;
  const answeredCount = Object.keys(scores).length + skipped.length;
  const remaining: string[] = [];

  for (const cap of B2B_CAPABILITIES_ORDER) {
    const qs = B2B_QUESTIONS_BY_CAPABILITY[cap];
    const unanswered = qs.filter(
      (q) =>
        !scores[String(q.id)] &&
        !skipped.includes(q.id) &&
        !skipped.includes(String(q.id))
    );
    if (unanswered.length > 0) {
      remaining.push(
        `${B2B_CAPABILITY_LABELS[cap]}: Q${unanswered.map((q) => q.id).join(", Q")}`
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
  const phaseInstructions: Record<B2bChatPhase, string> = {
    opening: `PHASE: Opening. Start with a warm greeting to ${respondentName}. Ask a broad, open-ended question like: "Tell me how ${clientName} thinks about its highest-value B2B accounts today — how marketing, sales, service, and operations work together (or don't), and where the biggest gaps and bets are." Let them talk freely. Extract as many scores as you can from their answer.`,
    exploration: `PHASE: Exploration. Continue the conversation naturally. Follow the thread of what ${respondentName} is telling you. After acknowledging what you've learned, steer toward capability areas that still have unanswered questions. Focus on the LEAST covered capability. Don't jump between topics — let the conversation flow naturally from one area to related ones.`,
    gap_filling: `PHASE: Gap filling. Most questions are covered. Ask targeted questions about the remaining gaps. Group related gaps together. For example: "We haven't really talked about how AI agents fit into your seller workflows — where is that today?" Be direct but conversational.`,
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
    { "questionId": 1, "score": 3, "confidence": "high", "evidence": "Has tiered ABM list shared with sales but no shared KPI" }
  ],
  "skipped": []
}
</scores>

Rules:
- Score 1 if the capability is not in place (functional silos, no account view, ad hoc work)
- Score 2 if pilots or isolated efforts exist (a tiered list, an Agentforce pilot, a CDP pilot) but not consistent
- Score 3 if operational and used by core teams but not orchestrated end-to-end across the account journey
- Score 4 if the capability runs across marketing/sales/service/ops with shared governance, KPIs, and account playbooks
- Score 5 if AI-augmented, account-orchestrated, continuously optimized — agentic workflows acting on signals in real time
- Only score when you have clear evidence. If uncertain between two, use the lower score with "confidence": "low"
- If the user says "I don't know" about a topic, add those questionIds to "skipped"
- A single user response can update multiple questions
- You can update previously scored questions if new info changes the assessment
- questionId is a number for core questions (1-36) or a string like "tech_1" for industry questions
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
- The B2B Transformation vocabulary: "Account-Based Everything", "buying group", "tier-1 accounts", "ICP / TAL", "ABM / ABS / ABX", "MEDDIC", "Revenue Cloud", "CPQ modernization", "Agentforce", "agentic workflows", "Data Cloud", "identity graph", "self-service commerce", "marketplace", "service-to-revenue", "NRR / GRR", "value realization" — use these terms naturally rather than CRM/marketing jargon`);

  return sections.join("\n\n---\n\n");
}

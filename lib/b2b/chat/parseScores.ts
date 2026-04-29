import type { B2bScoreUpdate } from "./types";

/**
 * Strips the <scores> JSON block (complete or partial) from an
 * assistant message. Same shape as the CRM/CSC parser — kept as a
 * separate module so the B2B chat surface can evolve independently.
 */
export function parseB2bAssistantMessage(raw: string): {
  displayContent: string;
  scoreUpdate: B2bScoreUpdate | null;
} {
  const completeMatch = raw.match(/<scores>([\s\S]*?)<\/scores>/);

  let scoreUpdate: B2bScoreUpdate | null = null;
  let cleaned = raw;

  if (completeMatch) {
    cleaned = raw.replace(/<scores>[\s\S]*?<\/scores>/, "");
    try {
      scoreUpdate = JSON.parse(completeMatch[1]) as B2bScoreUpdate;
    } catch {
      // malformed JSON — ignore
    }
  }

  cleaned = cleaned.replace(/<scores>[\s\S]*$/, "");
  cleaned = cleaned.replace(/<scores$/, "");
  cleaned = cleaned.replace(/<score$/, "");
  cleaned = cleaned.replace(/<scor$/, "");
  cleaned = cleaned.replace(/<sco$/, "");
  cleaned = cleaned.replace(/<sc$/, "");
  cleaned = cleaned.replace(/<s$/, "");

  return { displayContent: cleaned.trim(), scoreUpdate };
}

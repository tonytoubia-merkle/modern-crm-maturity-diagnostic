import type { CscScoreUpdate } from "./types";

/**
 * Strips the <scores> JSON block (complete or partial) from an assistant
 * message. Returns the clean display content and parsed scores (if complete).
 *
 * Same shape as the CRM parser at lib/chat/parseScores.ts – kept as a
 * separate module so the CSC chat surface can evolve independently.
 */
export function parseCscAssistantMessage(raw: string): {
  displayContent: string;
  scoreUpdate: CscScoreUpdate | null;
} {
  const completeMatch = raw.match(/<scores>([\s\S]*?)<\/scores>/);

  let scoreUpdate: CscScoreUpdate | null = null;
  let cleaned = raw;

  if (completeMatch) {
    cleaned = raw.replace(/<scores>[\s\S]*?<\/scores>/, "");
    try {
      scoreUpdate = JSON.parse(completeMatch[1]) as CscScoreUpdate;
    } catch {
      // Malformed JSON – ignore
    }
  }

  // Strip incomplete <scores> blocks during streaming so the JSON doesn't
  // flash on screen.
  cleaned = cleaned.replace(/<scores>[\s\S]*$/, "");
  cleaned = cleaned.replace(/<scores$/, "");
  cleaned = cleaned.replace(/<score$/, "");
  cleaned = cleaned.replace(/<scor$/, "");
  cleaned = cleaned.replace(/<sco$/, "");
  cleaned = cleaned.replace(/<sc$/, "");
  cleaned = cleaned.replace(/<s$/, "");

  return { displayContent: cleaned.trim(), scoreUpdate };
}

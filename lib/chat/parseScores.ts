import type { ScoreUpdate } from "./types";

/**
 * Strips the <scores> JSON block (complete or partial) from an assistant message.
 * Returns the clean display content and parsed scores (if complete).
 */
export function parseAssistantMessage(raw: string): {
  displayContent: string;
  scoreUpdate: ScoreUpdate | null;
} {
  // Strip complete <scores>...</scores> blocks
  const completeMatch = raw.match(/<scores>([\s\S]*?)<\/scores>/);

  let scoreUpdate: ScoreUpdate | null = null;
  let cleaned = raw;

  if (completeMatch) {
    cleaned = raw.replace(/<scores>[\s\S]*?<\/scores>/, "");
    try {
      scoreUpdate = JSON.parse(completeMatch[1]) as ScoreUpdate;
    } catch {
      // Malformed JSON — ignore
    }
  }

  // Also strip any partial/incomplete <scores> block that hasn't closed yet
  // This prevents the JSON from flashing during streaming
  cleaned = cleaned.replace(/<scores>[\s\S]*$/, "");

  // Also strip if just the opening tag appeared
  cleaned = cleaned.replace(/<scores$/, "");
  cleaned = cleaned.replace(/<score$/, "");
  cleaned = cleaned.replace(/<scor$/, "");
  cleaned = cleaned.replace(/<sco$/, "");
  cleaned = cleaned.replace(/<sc$/, "");
  cleaned = cleaned.replace(/<s$/, "");

  return { displayContent: cleaned.trim(), scoreUpdate };
}

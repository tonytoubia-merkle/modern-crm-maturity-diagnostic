import type { ScoreUpdate } from "./types";

/**
 * Extracts the <scores> JSON block from an assistant message.
 * Returns the clean display content (block stripped) and parsed scores.
 */
export function parseAssistantMessage(raw: string): {
  displayContent: string;
  scoreUpdate: ScoreUpdate | null;
} {
  const match = raw.match(/<scores>([\s\S]*?)<\/scores>/);

  if (!match) {
    return { displayContent: raw.trim(), scoreUpdate: null };
  }

  const displayContent = raw.replace(/<scores>[\s\S]*?<\/scores>/, "").trim();

  try {
    const scoreUpdate = JSON.parse(match[1]) as ScoreUpdate;
    return { displayContent, scoreUpdate };
  } catch {
    return { displayContent, scoreUpdate: null };
  }
}

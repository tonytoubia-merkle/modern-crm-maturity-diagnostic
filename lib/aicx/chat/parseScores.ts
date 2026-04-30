import type { AicxScoreUpdate } from "./types";

export function parseAicxAssistantMessage(raw: string): {
  displayContent: string;
  scoreUpdate: AicxScoreUpdate | null;
} {
  const completeMatch = raw.match(/<scores>([\s\S]*?)<\/scores>/);

  let scoreUpdate: AicxScoreUpdate | null = null;
  let cleaned = raw;

  if (completeMatch) {
    cleaned = raw.replace(/<scores>[\s\S]*?<\/scores>/, "");
    try {
      scoreUpdate = JSON.parse(completeMatch[1]) as AicxScoreUpdate;
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

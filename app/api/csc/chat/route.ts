import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildCscSystemPrompt } from "@/lib/csc/chat/buildSystemPrompt";
import type {
  CscInferredScore,
  CscChatPhase,
} from "@/lib/csc/chat/types";
import type { CscIndustry } from "@/lib/csc/types";

export const runtime = "nodejs";

/**
 * POST /api/csc/chat – streaming Gemini chat for the CSC voice/chat
 * conversational diagnostic. Mirrors /api/chat but builds a CSC-aware
 * system prompt (45 questions, 6 capabilities, content-supply-chain
 * vocabulary) instead of the CRM one.
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
        { status: 501, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const {
      messages,
      currentScores,
      skipped,
      phase,
      industry,
      clientName,
      respondentName,
    } = body as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      currentScores: Record<string, CscInferredScore>;
      skipped: (string | number)[];
      phase: CscChatPhase;
      industry: CscIndustry | null;
      clientName: string;
      respondentName: string;
    };

    const systemPrompt = buildCscSystemPrompt(
      clientName,
      respondentName,
      industry,
      currentScores,
      skipped,
      phase
    );

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: systemPrompt,
    });

    const geminiHistory = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessageStream(lastMessage.content);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("POST /api/csc/chat error:", message, err);
    return new Response(
      JSON.stringify({ error: `Chat request failed: ${message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt } from "@/lib/chat/buildSystemPrompt";
import type { InferredScore, ChatPhase } from "@/lib/chat/types";
import type { Industry } from "@/lib/types";

export const runtime = "nodejs";

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
      currentScores: Record<string, InferredScore>;
      skipped: (string | number)[];
      phase: ChatPhase;
      industry: Industry | null;
      clientName: string;
      respondentName: string;
    };

    const systemPrompt = buildSystemPrompt(
      clientName,
      respondentName,
      industry,
      currentScores,
      skipped,
      phase
    );

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-04-17",
      systemInstruction: systemPrompt,
    });

    // Convert messages to Gemini format
    const geminiHistory = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessageStream(lastMessage.content);

    // Stream the response
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
    console.error("POST /api/chat error:", message, err);
    return new Response(
      JSON.stringify({ error: `Chat request failed: ${message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

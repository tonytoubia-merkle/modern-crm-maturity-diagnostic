import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/chat/buildSystemPrompt";
import type { InferredScore, ChatPhase } from "@/lib/chat/types";
import type { Industry } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
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

    const client = new Anthropic({ apiKey });

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    // Convert Anthropic stream to a ReadableStream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
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
    console.error("POST /api/chat error:", err);
    return new Response(
      JSON.stringify({ error: "Chat request failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

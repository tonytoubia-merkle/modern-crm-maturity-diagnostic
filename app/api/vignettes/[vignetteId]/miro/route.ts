import { NextRequest, NextResponse } from "next/server";
import { VIGNETTES } from "@/lib/data/vignettes";

const MIRO_API = "https://api.miro.com/v2";

async function miroFetch(path: string, body: unknown) {
  const token = process.env.MIRO_ACCESS_TOKEN;
  if (!token) throw new Error("MIRO_ACCESS_TOKEN not configured");
  const res = await fetch(`${MIRO_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Miro API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function POST(
  _request: NextRequest,
  { params }: { params: { vignetteId: string } }
) {
  try {
    if (!process.env.MIRO_ACCESS_TOKEN) {
      return NextResponse.json({ error: "Miro not configured" }, { status: 501 });
    }

    const vignette = VIGNETTES.find((v) => v.id === params.vignetteId);
    if (!vignette) {
      return NextResponse.json({ error: "Vignette not found" }, { status: 404 });
    }

    // Create the board
    const board = await miroFetch("/boards", {
      name: `Workshop: ${vignette.title}`,
      description: vignette.description,
    });
    const boardId = board.id;

    // Title frame
    await miroFetch(`/boards/${boardId}/shapes`, {
      data: {
        content: `<strong>${vignette.title}</strong><br/>${vignette.category} · ${vignette.durationMinutes} minutes`,
        shape: "round_rectangle",
      },
      style: { fillColor: "#00205B", fontColor: "#ffffff", textAlign: "center", fontSize: "24" },
      position: { x: 600, y: -100 },
      geometry: { width: 1200, height: 120 },
    });

    // Description
    await miroFetch(`/boards/${boardId}/shapes`, {
      data: { content: vignette.description, shape: "rectangle" },
      style: { fillColor: "#f8f9fb", textAlign: "left", fontSize: "14", borderColor: "#e2e8f0" },
      position: { x: 600, y: 80 },
      geometry: { width: 1200, height: 100 },
    });

    // Required Inputs frame
    await miroFetch(`/boards/${boardId}/frames`, {
      data: { title: "Required Inputs / Pre-Work", format: "custom", type: "freeform" },
      position: { x: 300, y: 400 },
      geometry: { width: 550, height: 500 },
    });

    for (let i = 0; i < vignette.requiredInputs.length; i++) {
      await miroFetch(`/boards/${boardId}/sticky_notes`, {
        data: { content: vignette.requiredInputs[i], shape: "square" },
        style: { fillColor: "light_yellow" },
        position: { x: 150 + (i % 2) * 250, y: 250 + Math.floor(i / 2) * 230 },
      });
    }

    // Parse exercises from facilitation guide
    const exerciseBlocks = vignette.facilitationGuide.split(/\*\*(?=Exercise|Setup|Wrap)/);
    let exX = 650;

    for (const block of exerciseBlocks) {
      if (block.trim().length < 10) continue;
      const titleMatch = block.match(/^([^*]+)\*\*/);
      const title = titleMatch ? titleMatch[1].trim().replace(/[()]/g, "") : "Section";
      const bodyText = block.replace(/\*\*[^*]+\*\*/, "").replace(/\*\*/g, "").trim().slice(0, 300);

      await miroFetch(`/boards/${boardId}/shapes`, {
        data: { content: `<strong>${title}</strong><br/><br/>${bodyText}`, shape: "round_rectangle" },
        style: { fillColor: "#dbeafe", textAlign: "left", fontSize: "12", borderColor: "#93c5fd" },
        position: { x: exX, y: 350 },
        geometry: { width: 350, height: 280 },
      });
      exX += 400;
    }

    // Expected Outputs frame
    await miroFetch(`/boards/${boardId}/frames`, {
      data: { title: "Expected Outputs", format: "custom", type: "freeform" },
      position: { x: 300, y: 850 },
      geometry: { width: 1200, height: 300 },
    });

    for (let i = 0; i < vignette.expectedOutputs.length; i++) {
      await miroFetch(`/boards/${boardId}/sticky_notes`, {
        data: { content: `✓ ${vignette.expectedOutputs[i]}`, shape: "square" },
        style: { fillColor: "light_green" },
        position: { x: 150 + i * 350, y: 800 },
      });
    }

    const boardUrl = board.viewLink || `https://miro.com/app/board/${boardId}/`;
    return NextResponse.json({ boardUrl, boardId });
  } catch (err) {
    console.error("POST /api/vignettes/[id]/miro error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create board" },
      { status: 500 }
    );
  }
}

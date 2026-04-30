import type { WorkshopAgenda, Vignette } from "@/lib/types";
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

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Miro API error ${res.status}: ${err}`);
  }
  return res.json();
}

/**
 * Creates a fully structured Miro board for a workshop agenda.
 * Returns the board URL.
 */
export async function createWorkshopBoard(
  clientName: string,
  agenda: WorkshopAgenda
): Promise<{ boardUrl: string; boardId: string }> {
  // 1. Create the board
  const board = await miroFetch("/boards", {
    name: `${clientName} – Modern CRM Workshop`,
    description: `Auto-generated workshop board · ${agenda.format.replace("_", " ")} format · ${agenda.days.length} day(s)`,
  });

  const boardId = board.id;

  // Layout constants
  const FRAME_WIDTH = 1800;
  const FRAME_HEIGHT = 1200;
  const FRAME_GAP = 200;
  let currentX = 0;

  for (const day of agenda.days) {
    // Create a day header frame
    await miroFetch(`/boards/${boardId}/frames`, {
      data: {
        title: `Day ${day.dayNumber}: ${day.title}`,
        format: "custom",
        type: "freeform",
      },
      position: { x: currentX + FRAME_WIDTH / 2, y: 0 },
      geometry: { width: FRAME_WIDTH, height: 200 },
    });

    let blockY = 400;

    for (const block of day.blocks) {
      if (block.type === "break") {
        // Small break indicator
        await miroFetch(`/boards/${boardId}/shapes`, {
          data: {
            content: `☕ ${block.title} – ${block.durationMinutes}m`,
            shape: "round_rectangle",
          },
          style: {
            fillColor: "#f1f5f9",
            textAlign: "center",
            fontSize: "14",
          },
          position: { x: currentX + FRAME_WIDTH / 2, y: blockY },
          geometry: { width: 400, height: 60 },
        });
        blockY += 120;
        continue;
      }

      if (block.type === "intro" || block.type === "closing") {
        await miroFetch(`/boards/${boardId}/shapes`, {
          data: {
            content: `<strong>${block.title}</strong><br/>${block.durationMinutes}m<br/><br/>${block.description}`,
            shape: "round_rectangle",
          },
          style: {
            fillColor: "#dbeafe",
            textAlign: "left",
            fontSize: "14",
          },
          position: { x: currentX + FRAME_WIDTH / 2, y: blockY },
          geometry: { width: FRAME_WIDTH - 100, height: 200 },
        });
        blockY += 300;
        continue;
      }

      // Vignette block – create a full exercise frame
      const vignette = block.vignetteId
        ? VIGNETTES.find((v) => v.id === block.vignetteId)
        : null;

      // Exercise frame
      const frameData = await miroFetch(`/boards/${boardId}/frames`, {
        data: {
          title: `${block.title} (${block.durationMinutes}m)`,
          format: "custom",
          type: "freeform",
        },
        position: { x: currentX + FRAME_WIDTH / 2, y: blockY + FRAME_HEIGHT / 2 },
        geometry: { width: FRAME_WIDTH, height: FRAME_HEIGHT },
      });

      if (vignette) {
        // Add exercise description
        await miroFetch(`/boards/${boardId}/shapes`, {
          data: {
            content: `<strong>${vignette.title}</strong><br/><br/>${vignette.description}`,
            shape: "rectangle",
          },
          style: {
            fillColor: "#ffffff",
            borderColor: "#00205B",
            borderWidth: "2.0",
            textAlign: "left",
            fontSize: "14",
          },
          position: { x: currentX + 250, y: blockY + 120 },
          geometry: { width: 450, height: 200 },
        });

        // Add required inputs as sticky notes
        const inputX = currentX + 800;
        for (let i = 0; i < vignette.requiredInputs.length; i++) {
          await miroFetch(`/boards/${boardId}/sticky_notes`, {
            data: {
              content: vignette.requiredInputs[i],
              shape: "square",
            },
            style: { fillColor: "light_yellow" },
            position: { x: inputX + (i % 3) * 220, y: blockY + 80 + Math.floor(i / 3) * 220 },
          });
        }

        // Add expected outputs as sticky notes
        for (let i = 0; i < vignette.expectedOutputs.length; i++) {
          await miroFetch(`/boards/${boardId}/sticky_notes`, {
            data: {
              content: `✓ ${vignette.expectedOutputs[i]}`,
              shape: "square",
            },
            style: { fillColor: "light_green" },
            position: { x: inputX + (i % 3) * 220, y: blockY + 600 + Math.floor(i / 3) * 220 },
          });
        }

        // Parse facilitation guide into exercise sections and create sticky notes for each
        const exercises = vignette.facilitationGuide
          .split(/\*\*Exercise \d/)
          .filter((s) => s.trim().length > 20)
          .slice(0, 4);

        for (let i = 0; i < exercises.length; i++) {
          const title = exercises[i].match(/^[^*]+\*\*/)?.[0]?.replace(/\*\*/g, "").trim() || `Exercise ${i + 1}`;
          await miroFetch(`/boards/${boardId}/sticky_notes`, {
            data: {
              content: title.slice(0, 200),
              shape: "square",
            },
            style: { fillColor: "light_blue" },
            position: { x: currentX + 150 + i * 220, y: blockY + 400 },
          });
        }
      }

      blockY += FRAME_HEIGHT + FRAME_GAP;
    }

    currentX += FRAME_WIDTH + FRAME_GAP;
  }

  return {
    boardUrl: board.viewLink || `https://miro.com/app/board/${boardId}/`,
    boardId,
  };
}

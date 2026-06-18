"use client";

import { useEffect, useState } from "react";

/**
 * Tablet preview — renders the live /crm/exec kiosk inside a static
 * landscape tablet mockup so we can see how it lays out on a tablet screen.
 *
 * Uses an <iframe> at the tablet's logical resolution so the kiosk's own
 * fit-to-viewport logic adapts exactly as it would on the device. The whole
 * mockup is scaled down to fit the browser window.
 */

// iPad Pro 11" logical landscape resolution.
const SCREEN_W = 1194;
const SCREEN_H = 834;
const BEZEL = 22;
const MOCKUP_W = SCREEN_W + BEZEL * 2;
const MOCKUP_H = SCREEN_H + BEZEL * 2;

export default function ExecTabletPreview() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => {
      const margin = 56; // breathing room around the device
      const s = Math.min(
        (window.innerWidth - margin) / MOCKUP_W,
        (window.innerHeight - margin) / MOCKUP_H,
        1 // never upscale past 100%
      );
      setScale(s > 0 ? s : 1);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-neutral-950">
      <div style={{ transform: `scale(${scale})` }} className="shrink-0">
        {/* Tablet body */}
        <div
          className="relative"
          style={{
            width: MOCKUP_W,
            height: MOCKUP_H,
            padding: BEZEL,
            borderRadius: 46,
            background: "linear-gradient(145deg, #2c2c33, #131317)",
            boxShadow:
              "0 40px 120px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.05)",
          }}
        >
          {/* Front camera, centered on the top long edge */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{
              top: 8,
              width: 7,
              height: 7,
              background: "#41414a",
              boxShadow: "inset 0 0 2px rgba(0,0,0,0.9)",
            }}
          />
          {/* Screen */}
          <div
            className="overflow-hidden bg-black"
            style={{ width: SCREEN_W, height: SCREEN_H, borderRadius: 20 }}
          >
            <iframe
              src="/crm/exec"
              title="Modern CRM Self-Assessment — tablet preview"
              style={{ width: SCREEN_W, height: SCREEN_H, border: 0, display: "block" }}
            />
          </div>
        </div>
      </div>

      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium tracking-wide text-white/40">
        Tablet preview · landscape · {SCREEN_W}×{SCREEN_H}
      </p>
    </div>
  );
}

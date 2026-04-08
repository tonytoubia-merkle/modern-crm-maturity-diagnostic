"use client";

import { useState, useEffect, useRef } from "react";
import { BADGES, TIER_COLORS, getEarnedBadges, getNextBadges } from "@/lib/data/badges";
import type { UserStats } from "@/lib/data/badges";

// ── 8-bit Indiana Jones Boulder Chase ──────────────────────────

function BoulderChase({ stats, newBadge }: { stats: UserStats; newBadge: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setFrame((f) => f + 1), 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const f = frame;

    // Clear
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, W, H);

    // Ground
    ctx.fillStyle = "#3d2b1f";
    ctx.fillRect(0, H - 30, W, 30);
    // Ground texture
    ctx.fillStyle = "#4a3728";
    for (let x = 0; x < W; x += 12) {
      ctx.fillRect(x + ((f * 3) % 12), H - 30, 6, 2);
      ctx.fillRect(x + 6 + ((f * 3) % 12), H - 24, 4, 2);
    }

    // Ceiling stalactites
    ctx.fillStyle = "#2d2d44";
    for (let x = 0; x < W; x += 40) {
      const h = 8 + Math.sin(x * 0.1) * 6;
      ctx.fillRect(x + ((f * 2) % 40), 0, 6, h);
    }

    // Boulder (chasing from left)
    const boulderX = 30 + Math.sin(f * 0.15) * 3;
    const boulderY = H - 55;
    const boulderR = 22;
    ctx.fillStyle = "#7c6f64";
    ctx.beginPath();
    ctx.arc(boulderX, boulderY, boulderR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#5c524a";
    ctx.beginPath();
    ctx.arc(boulderX - 4, boulderY - 4, boulderR - 4, 0, Math.PI * 2);
    ctx.fill();
    // Boulder crack lines
    ctx.strokeStyle = "#4a423c";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(boulderX - 8, boulderY - 10);
    ctx.lineTo(boulderX + 5, boulderY + 3);
    ctx.moveTo(boulderX + 2, boulderY - 12);
    ctx.lineTo(boulderX - 3, boulderY + 8);
    ctx.stroke();
    // "TRAPPED VALUE" text on boulder
    ctx.fillStyle = "#b8a89a";
    ctx.font = "bold 5px monospace";
    ctx.textAlign = "center";
    ctx.fillText("TRAPPED", boulderX, boulderY - 2);
    ctx.fillText("VALUE", boulderX, boulderY + 5);

    // Indy (running right)
    const indyX = 110 + Math.sin(f * 0.2) * 2;
    const indyY = H - 32;
    const runCycle = f % 4;

    // Hat
    ctx.fillStyle = "#5c3a1e";
    ctx.fillRect(indyX - 5, indyY - 18, 12, 3);
    ctx.fillRect(indyX - 3, indyY - 22, 8, 4);

    // Head
    ctx.fillStyle = "#e8c39e";
    ctx.fillRect(indyX, indyY - 14, 6, 6);

    // Body (jacket)
    ctx.fillStyle = "#8b6914";
    ctx.fillRect(indyX - 1, indyY - 8, 8, 6);

    // Legs (running animation)
    ctx.fillStyle = "#4a3728";
    if (runCycle < 2) {
      ctx.fillRect(indyX, indyY - 2, 3, 4);
      ctx.fillRect(indyX + 4, indyY - 1, 3, 3);
    } else {
      ctx.fillRect(indyX + 1, indyY - 1, 3, 3);
      ctx.fillRect(indyX + 3, indyY - 2, 3, 4);
    }

    // Whip (trailing behind)
    ctx.strokeStyle = "#5c3a1e";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(indyX - 2, indyY - 6);
    const whipWave = Math.sin(f * 0.5) * 8;
    ctx.quadraticCurveTo(indyX - 15, indyY - 10 + whipWave, indyX - 25, indyY - 5 + whipWave * 0.5);
    ctx.stroke();

    // Dust particles behind Indy
    ctx.fillStyle = "rgba(180, 160, 130, 0.4)";
    for (let i = 0; i < 5; i++) {
      const dx = indyX - 10 - Math.random() * 20;
      const dy = indyY - Math.random() * 8;
      ctx.fillRect(dx + ((f * 2) % 10), dy, 2, 2);
    }

    // Treasure ahead (right side)
    const treasureX = W - 50;
    ctx.fillStyle = "#ffd700";
    const glow = Math.sin(f * 0.2) * 0.3 + 0.7;
    ctx.globalAlpha = glow;
    ctx.fillRect(treasureX, H - 42, 10, 10);
    ctx.fillStyle = "#ffec44";
    ctx.fillRect(treasureX + 2, H - 40, 6, 6);
    ctx.globalAlpha = 1;

    // Sparkle on treasure
    if (f % 8 < 4) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(treasureX + 4, H - 48, 2, 2);
      ctx.fillRect(treasureX + 10, H - 44, 2, 2);
    }

    // Badge award flash
    if (newBadge && f % 6 < 3) {
      ctx.fillStyle = "rgba(255, 215, 0, 0.15)";
      ctx.fillRect(0, 0, W, H);
    }

    // Score display
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`PIPELINE: ${stats.opportunities}`, 8, 12);
    ctx.fillText(`PROJECTS: ${stats.projects}`, 8, 22);

    ctx.textAlign = "right";
    ctx.fillText(`BADGES: ${getEarnedBadges(stats).length}/${BADGES.length}`, W - 8, 12);

  }, [frame, stats, newBadge]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={120}
      className="w-full max-w-lg rounded-xl border-2 border-slate-700 mx-auto"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

// ── Badges Page ────────────────────────────────────────────────

export default function BadgesPage() {
  const [stats, setStats] = useState<UserStats>({ assessments: 0, projects: 0, stakeholders: 0, opportunities: 0 });
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [searched, setSearched] = useState(false);
  const [newBadge, setNewBadge] = useState<string | null>(null);

  const loadStats = async (userEmail: string) => {
    setLoading(true);
    try {
      const [projRes, assRes] = await Promise.all([
        fetch(`/api/projects?email=${encodeURIComponent(userEmail)}`),
        fetch(`/api/assessments?repEmail=${encodeURIComponent(userEmail)}`),
      ]);
      const projects = projRes.ok ? await projRes.json() : [];
      const assessments = assRes.ok ? await assRes.json() : [];

      // Count stakeholders across all projects
      let stakeholderCount = 0;
      for (const p of projects) {
        try {
          const sRes = await fetch(`/api/projects/${p.id}`);
          if (sRes.ok) {
            const data = await sRes.json();
            stakeholderCount += (data.stakeholders || []).length;
          }
        } catch { /* skip */ }
      }

      // Count opportunities from completed assessments
      const completedWithScores = assessments.filter((a: Record<string, unknown>) => a.status === "completed" && a.overall_score);
      // Rough estimate: ~4 opportunities per completed assessment on average
      const oppCount = projects.reduce(
        (sum: number, p: Record<string, unknown>) =>
          sum + ((p.triggered_opportunity_ids as string[])?.length || 0),
        0
      ) + completedWithScores.length * 4;

      setStats({
        assessments: assessments.length,
        projects: projects.length,
        stakeholders: stakeholderCount,
        opportunities: oppCount,
      });
      setSearched(true);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const earned = getEarnedBadges(stats);
  const next = getNextBadges(stats);
  const earnedIds = new Set(earned.map((b) => b.id));

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1a1a2e" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/merkle-logo.webp" alt="Merkle" className="h-6 w-auto brightness-0 invert" />
          <a href="/" className="text-xs text-white/60 hover:text-white transition-colors">Home</a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-2">
            Escape the Boulder of Trapped Value
          </p>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Achievement Badges
          </h1>
          <p className="text-sm text-slate-400">
            Run diagnostics. Generate opportunities. Earn glory.
          </p>
        </div>

        {/* 8-bit animation */}
        <div className="mb-10">
          <BoulderChase stats={stats} newBadge={newBadge} />
        </div>

        {/* Email lookup */}
        {!searched ? (
          <div className="max-w-sm mx-auto mb-10">
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) loadStats(email); }}
              className="flex gap-2"
            >
              <input
                type="email"
                placeholder="your.name@merkle.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 text-sm px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-yellow-500 text-sm font-bold text-slate-900 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {loading ? "..." : "Load"}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center mb-8">
            <p className="text-sm text-slate-400">
              Stats for <span className="text-yellow-500 font-semibold">{email}</span>
              {" · "}
              <button onClick={() => setSearched(false)} className="text-blue-400 hover:underline">change</button>
            </p>
            <div className="flex justify-center gap-6 mt-3">
              <div className="text-center">
                <p className="text-xl font-bold text-white">{stats.assessments}</p>
                <p className="text-[10px] text-slate-500 uppercase">Assessments</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">{stats.projects}</p>
                <p className="text-[10px] text-slate-500 uppercase">Projects</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">{stats.stakeholders}</p>
                <p className="text-[10px] text-slate-500 uppercase">Stakeholders</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">{stats.opportunities}</p>
                <p className="text-[10px] text-slate-500 uppercase">Opportunities</p>
              </div>
            </div>
          </div>
        )}

        {/* Earned badges */}
        {earned.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-yellow-500 mb-4">
              Earned ({earned.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {earned.map((b) => {
                const colors = TIER_COLORS[b.tier];
                return (
                  <div
                    key={b.id}
                    className={`rounded-xl border-2 p-4 ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{b.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-bold ${colors.text}`}>{b.name}</p>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${colors.text} bg-white/50`}>
                            {b.tier}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{b.description}</p>
                        <p className="text-[10px] text-slate-400 italic mt-1">&ldquo;{b.indyQuote}&rdquo;</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Next up */}
        {next.length > 0 && searched && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-slate-400 mb-4">Up Next</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {next.map((b) => {
                const progress = Math.min(stats[b.metric] / b.threshold, 0.99);
                return (
                  <div
                    key={b.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl opacity-40">{b.emoji}</span>
                      <p className="text-sm font-bold text-slate-400">{b.name}</p>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{b.description}</p>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div
                        className="bg-yellow-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {stats[b.metric]}/{b.threshold} {b.metric}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All badges gallery */}
        <div>
          <h2 className="text-lg font-bold text-slate-500 mb-4">All Badges ({BADGES.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BADGES.map((b) => {
              const isEarned = earnedIds.has(b.id);
              return (
                <div
                  key={b.id}
                  className={`rounded-lg border p-3 text-center transition-all ${
                    isEarned
                      ? "border-yellow-500/50 bg-yellow-500/10"
                      : "border-white/5 bg-white/5 opacity-40"
                  }`}
                >
                  <span className={`text-2xl ${isEarned ? "" : "grayscale"}`}>{b.emoji}</span>
                  <p className={`text-xs font-bold mt-1 ${isEarned ? "text-yellow-500" : "text-slate-500"}`}>
                    {b.name}
                  </p>
                  <p className="text-[9px] text-slate-500 capitalize">{b.tier}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

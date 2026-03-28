"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CAPABILITY_LABELS, CAPABILITY_SUBTITLES, CAPABILITIES_ORDER } from "@/lib/data/questions";
import { MATURITY_STAGES } from "@/lib/scoring";
import type { MaturityStage } from "@/lib/types";

const CAPABILITY_ICONS: Record<string, string> = {
  identity: "◉",
  signals: "⚡",
  decisioning: "◈",
  engagement: "◎",
  media_activation: "◇",
  learning_optimization: "↻",
};

export default function HomePage() {
  const [retrieveEmail, setRetrieveEmail] = useState("");
  const [showRetrieve, setShowRetrieve] = useState(false);
  const [retrieveLoading, setRetrieveLoading] = useState(false);
  const [retrieveResults, setRetrieveResults] = useState<
    Array<{
      id: string;
      share_id: string;
      client_name: string;
      client_company: string;
      status: string;
      overall_score: number | null;
      created_at: string;
    }>
  >([]);
  const [retrieveError, setRetrieveError] = useState("");

  const handleRetrieve = async (e: React.FormEvent) => {
    e.preventDefault();
    setRetrieveLoading(true);
    setRetrieveError("");
    try {
      const res = await fetch(
        `/api/assessments?repEmail=${encodeURIComponent(retrieveEmail)}`
      );
      if (!res.ok) throw new Error("Failed to retrieve");
      const data = await res.json();
      setRetrieveResults(data);
      if (data.length === 0) {
        setRetrieveError("No assessments found for this email address.");
      }
    } catch {
      setRetrieveError("Unable to retrieve assessments. Please try again.");
    } finally {
      setRetrieveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-10" style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/merkle-logo.webp" alt="Merkle" className="h-7 w-auto brightness-0 invert" />
          </div>
          <button
            onClick={() => setShowRetrieve(!showRetrieve)}
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Retrieve Assessment
          </button>
        </div>
      </nav>

      {/* Retrieve panel */}
      {showRetrieve && (
        <div className="border-b border-slate-100 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Retrieve Your Assessments
            </h3>
            <form
              onSubmit={handleRetrieve}
              className="flex gap-3 max-w-md"
            >
              <Input
                id="repEmail"
                type="email"
                placeholder="Enter your email address"
                value={retrieveEmail}
                onChange={(e) => setRetrieveEmail(e.target.value)}
                required
              />
              <Button type="submit" size="sm" loading={retrieveLoading}>
                Find
              </Button>
            </form>
            {retrieveError && (
              <p className="text-sm text-red-600 mt-2">{retrieveError}</p>
            )}
            {retrieveResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {retrieveResults.map((a) => (
                  <a
                    key={a.id}
                    href={`/results/${a.share_id}`}
                    className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 hover:border-blue-300 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {a.client_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {a.client_company} ·{" "}
                        {new Date(a.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {a.overall_score && (
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {a.overall_score.toFixed(1)}
                        </span>
                      )}
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${
                          a.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {a.status === "completed" ? "Complete" : "In Progress"}
                      </span>
                      <span className="text-blue-600 text-sm">→</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero — branded navy */}
      <section style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-20">
          <div className="max-w-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/merkle-logo.webp"
              alt="Merkle"
              className="h-10 w-auto brightness-0 invert mb-8"
            />
            <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mb-4">
              Modern CRM
              <br />
              Maturity Diagnostic
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-2xl">
              Assess your organization&apos;s readiness to connect identity,
              behavioral signals, decisioning, and engagement into a unified
              CRM growth engine. Takes 15–20 minutes.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/assessment/new">
                <button
                  className="px-6 py-3 bg-white font-bold text-sm rounded-lg hover:bg-white/90 transition-colors"
                  style={{ color: "#00205B" }}
                >
                  Start Assessment →
                </button>
              </a>
            </div>
            <p className="text-xs text-white/40 mt-4">
              No account required · Results shareable via link
            </p>
          </div>
        </div>
      </section>

      {/* What it measures */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#00205B" }}>
            Framework
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Six-Capability Assessment Model
          </h2>
          <p className="text-slate-600 text-sm mb-8 max-w-xl">
            The diagnostic evaluates 22 core questions across the six
            capabilities required to operate a Modern CRM relationship engine —
            with optional industry-specific questions for additional context.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAPABILITIES_ORDER.map((cap, i) => (
              <div
                key={cap}
                className="border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                style={{ borderLeftWidth: "4px", borderLeftColor: "#00205B" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold" style={{ color: "#00205B" }}>
                    {CAPABILITY_ICONS[cap]}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-0.5">
                  {CAPABILITY_LABELS[cap]}
                </h3>
                <p className="text-xs font-semibold" style={{ color: "#00205B" }}>
                  {CAPABILITY_SUBTITLES[cap]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#00205B" }}>
            Process
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Rate Your Capabilities",
                description:
                  "Score 22 core questions across 6 capability areas on a 1–5 maturity scale, with optional industry context. Takes 15–20 minutes.",
              },
              {
                step: "02",
                title: "Get Instant Results",
                description:
                  "See your maturity stage, capability heatmap, and prioritized strategic opportunities.",
              },
              {
                step: "03",
                title: "Act on the Insights",
                description:
                  "Use copy-ready Salesforce narratives and opportunity records to build your pipeline and roadmap.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <span className="text-2xl font-black flex-shrink-0 w-10" style={{ color: "#00205B", opacity: 0.2 }}>
                  {item.step}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maturity stages */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#00205B" }}>
            Outcomes
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Four Maturity Stages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {([1, 2, 3, 4] as MaturityStage[]).map((stage) => {
              const s = MATURITY_STAGES[stage];
              const colorMap: Record<string, { card: string; badge: string }> = {
                red:   { card: "border-red-300 bg-red-50",   badge: "bg-red-100 text-red-700" },
                orange: { card: "border-orange-300 bg-orange-50", badge: "bg-orange-100 text-orange-700" },
                blue:  { card: "border-blue-300 bg-blue-50",  badge: "bg-blue-100 text-blue-700" },
                green: { card: "border-green-300 bg-green-50", badge: "bg-green-100 text-green-700" },
              };
              const colors = colorMap[s.color];
              const shortDesc = s.description.split(".")[0] + ".";
              return (
                <div key={stage} className={`border-2 rounded-xl p-5 ${colors.card}`}>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full mb-3 inline-block ${colors.badge}`}>
                    Stage {stage}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                    {s.label.replace(/^Stage \d — /, "")}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{shortDesc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA — branded navy */}
      <section style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to assess your CRM maturity?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            15–20 minutes. No account required. Instant results with shareable
            link and downloadable PDF.
          </p>
          <a href="/assessment/new">
            <button
              className="px-6 py-3 bg-white font-bold text-sm rounded-lg hover:bg-white/90 transition-colors"
              style={{ color: "#00205B" }}
            >
              Start Assessment →
            </button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/merkle-logo.webp" alt="Merkle" className="h-5 w-auto" />
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Merkle
            </p>
          </div>
          <a
            href="/admin"
            className="text-xs text-slate-300 hover:text-slate-500 transition-colors"
          >
            Admin
          </a>
        </div>
      </footer>
    </div>
  );
}

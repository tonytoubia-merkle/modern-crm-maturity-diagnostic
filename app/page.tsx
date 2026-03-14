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
      <nav className="border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/merkle-logo.webp" alt="Merkle" className="h-6 w-auto" />
            <span className="text-sm font-semibold text-slate-500">
              Modern CRM Diagnostic
            </span>
          </div>
          <button
            onClick={() => setShowRetrieve(!showRetrieve)}
            className="text-sm text-slate-500 hover:text-slate-800"
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

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
            Modern CRM Maturity Diagnostic
          </div>
          <h1 className="text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
            Turn Customer Signals
            <br />
            Into Growth
          </h1>
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">What to expect</p>
            <p className="text-lg text-slate-900 leading-relaxed">
              Assess your organization&apos;s readiness to connect identity,
              behavioral signals, decisioning, and engagement into a unified Modern
              CRM growth engine. Takes 15–20 minutes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/assessment/new">
              <Button size="lg">
                Start Assessment →
              </Button>
            </a>
          </div>
          <p className="text-xs text-slate-600 mt-4">
            No account required · Results shareable via link
          </p>
        </div>
      </section>

      {/* What it measures */}
      <section className="border-t border-slate-100 bg-slate-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Framework
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Six-Capability Assessment Model
          </h2>
          <p className="text-slate-900 text-sm mb-8 max-w-xl">
            The diagnostic evaluates 22 core questions across the six
            capabilities required to operate a Modern CRM relationship engine —
            with optional industry-specific questions for additional context.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAPABILITIES_ORDER.map((cap, i) => (
              <div
                key={cap}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl text-blue-600 font-bold">
                    {CAPABILITY_ICONS[cap]}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-0.5">
                  {CAPABILITY_LABELS[cap]}
                </h3>
                <p className="text-xs text-blue-600 font-semibold mb-2">
                  {CAPABILITY_SUBTITLES[cap]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
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
                <span className="text-2xl font-black text-slate-200 flex-shrink-0 w-10">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-900 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maturity stages */}
      <section className="border-t border-slate-100 bg-slate-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
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
              // Use first sentence of description for the homepage card
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

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to assess your CRM maturity?
          </h2>
          <p className="text-slate-900 mb-8 max-w-xl mx-auto">
            15–20 minutes. No account required. Instant results with shareable
            link and downloadable PDF.
          </p>
          <a href="/assessment/new">
            <Button size="lg">Start Assessment →</Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Merkle. Modern CRM Maturity Diagnostic.
          </p>
          <a
            href="/admin"
            className="text-xs text-slate-300 hover:text-slate-500"
          >
            Admin
          </a>
        </div>
      </footer>
    </div>
  );
}

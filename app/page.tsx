"use client";

import { useState } from "react";
import { CAPABILITY_LABELS, CAPABILITY_SUBTITLES, CAPABILITIES_ORDER } from "@/lib/data/questions";

const CAPABILITY_ICONS: Record<string, string> = {
  identity: "◉",
  signals: "⚡",
  decisioning: "◈",
  engagement: "◎",
  media_activation: "◇",
  learning_optimization: "↻",
};

const PLAYBOOK_STEPS = [
  {
    step: "01",
    title: "Prepare",
    description:
      "Identify the client and the right stakeholder(s) to involve. Decide whether you'll complete the assessment independently based on what you know, or run it as a guided workshop with the client and a Merkle SME.",
    tip: "Workshop format recommended for strategic accounts — drives richer conversation and surfaces more accurate signals.",
  },
  {
    step: "02",
    title: "Assess",
    description:
      "Walk through 22 core questions across the six Modern CRM capabilities. Rate each on a 1–5 maturity scale. Use \"Not sure\" for areas that need validation — these get flagged in the output.",
    tip: "Select an industry for 5 additional context questions that enrich the opportunity analysis.",
  },
  {
    step: "03",
    title: "Review Results",
    description:
      "Your results generate instantly: an overall maturity stage, a capability heatmap showing strengths and gaps, and prioritized strategic opportunities ranked by impact.",
    tip: "Switch between Internal and Client view modes — Internal shows full detail and Salesforce output; Client shows a clean, presentable summary.",
  },
  {
    step: "04",
    title: "Add to Salesforce",
    description:
      "The results page includes copy-ready Salesforce narratives, opportunity records, and an exportable opportunity table. Use these to create or update opportunities on the client account.",
    tip: "Each opportunity includes a suggested SF type, engagement size, and value narrative ready for proposal or pipeline entry.",
  },
  {
    step: "05",
    title: "Generate Presentation",
    description:
      "Export a branded Modern CRM presentation (PPTX) directly from the results page. The deck includes maturity scoring, capability analysis, and recommended next steps — ready for a client conversation.",
    tip: "Use the Client view mode before exporting for a cleaner, client-appropriate framing.",
  },
  {
    step: "06",
    title: "Follow Up",
    description:
      "Share the results link with client stakeholders or internal team members. Use the opportunity detail to scope engagement proposals and align on next steps.",
    tip: "Results are shareable via link — no login required. Bookmark the URL or retrieve past assessments using your email.",
  },
];

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
      {/* Hero */}
      <section style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-5xl mx-auto px-4 pt-10 pb-16">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/merkle-logo.webp"
              alt="Merkle"
              className="h-10 w-auto brightness-0 invert"
            />
            <button
              onClick={() => setShowRetrieve(!showRetrieve)}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              {showRetrieve ? "Close" : "Retrieve Assessment"}
            </button>
          </div>

          {/* Retrieve panel */}
          {showRetrieve && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-5 mb-10 max-w-lg">
              <h3 className="text-sm font-semibold text-white mb-3">
                Retrieve Your Assessments
              </h3>
              <form onSubmit={handleRetrieve} className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your Merkle email"
                  value={retrieveEmail}
                  onChange={(e) => setRetrieveEmail(e.target.value)}
                  required
                  className="flex-1 text-sm px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={retrieveLoading}
                  className="px-4 py-2 bg-white text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
                  style={{ color: "#00205B" }}
                >
                  {retrieveLoading ? "..." : "Find"}
                </button>
              </form>
              {retrieveError && (
                <p className="text-sm text-red-300 mt-2">{retrieveError}</p>
              )}
              {retrieveResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  {retrieveResults.map((a) => (
                    <a
                      key={a.id}
                      href={`/results/${a.share_id}`}
                      className="flex items-center justify-between bg-white/10 border border-white/20 rounded-lg px-4 py-3 hover:bg-white/20 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {a.client_name}
                        </p>
                        <p className="text-xs text-white/50">
                          {a.client_company} ·{" "}
                          {new Date(a.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {a.overall_score && (
                          <span className="text-xs font-bold text-white bg-white/20 px-2 py-0.5 rounded">
                            {a.overall_score.toFixed(1)}
                          </span>
                        )}
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded ${
                            a.status === "completed"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {a.status === "completed" ? "Complete" : "In Progress"}
                        </span>
                        <span className="text-white/60 text-sm">→</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Hero content */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full mb-6">
              Internal Tool · Merkle CRM Practice
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mb-4">
              Modern CRM
              <br />
              Maturity Diagnostic
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-2xl">
              Assess a client&apos;s CRM maturity across six capability areas,
              generate prioritized opportunities, and build pipeline — all in
              one sitting. Run it solo or as a workshop with a client and SME.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="/assessment/new">
                <button
                  className="px-6 py-3 bg-white font-bold text-sm rounded-lg hover:bg-white/90 transition-colors"
                  style={{ color: "#00205B" }}
                >
                  Start New Assessment →
                </button>
              </a>
              <a href="#playbook" className="text-sm text-white/60 hover:text-white transition-colors">
                See the playbook ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Seller Playbook */}
      <section id="playbook" className="py-16 bg-white scroll-mt-4">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#00205B" }}>
            Seller Playbook
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            How to Use This Tool
          </h2>
          <p className="text-slate-600 text-sm mb-10 max-w-2xl">
            This diagnostic is designed to help you identify CRM capability gaps,
            generate strategic opportunities, and accelerate pipeline creation.
            Follow these steps from assessment through to client conversation.
          </p>

          <div className="space-y-6">
            {PLAYBOOK_STEPS.map((item) => (
              <div
                key={item.step}
                className="flex gap-5 items-start"
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black text-white"
                  style={{ backgroundColor: "#00205B" }}
                >
                  {item.step}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-base mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                    <span className="font-semibold" style={{ color: "#00205B" }}>Tip:</span> {item.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Framework */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#00205B" }}>
            Framework
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            What It Assesses
          </h2>
          <p className="text-slate-600 text-sm mb-8 max-w-xl">
            22 core questions across six capabilities that define a Modern CRM
            relationship engine, plus optional industry-specific modules.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAPABILITIES_ORDER.map((cap, i) => (
              <div
                key={cap}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
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

      {/* What you get */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#00205B" }}>
            Outputs
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            What You Get
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Maturity Scorecard",
                description: "Overall maturity stage + per-capability heatmap showing exactly where the client stands.",
              },
              {
                title: "Strategic Opportunities",
                description: "Prioritized, gap-triggered opportunities with scope, methods, and business value narratives.",
              },
              {
                title: "Salesforce Output",
                description: "Copy-ready opportunity records, pipeline narratives, and exportable tables for SF entry.",
              },
              {
                title: "Client Presentation",
                description: "Branded PPTX export with maturity analysis, capability gaps, and recommended next steps.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-slate-200 rounded-xl p-5"
                style={{ borderTopWidth: "3px", borderTopColor: "#00205B" }}
              >
                <h3 className="font-bold text-slate-900 text-sm mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to run a diagnostic?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            15–20 minutes. Instant results. Shareable link. Exportable PPTX.
            Pipeline-ready Salesforce output.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="/assessment/new">
              <button
                className="px-6 py-3 bg-white font-bold text-sm rounded-lg hover:bg-white/90 transition-colors"
                style={{ color: "#00205B" }}
              >
                Start New Assessment →
              </button>
            </a>
            <button
              onClick={() => {
                setShowRetrieve(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold text-sm rounded-lg hover:bg-white/20 transition-colors"
            >
              Retrieve Past Assessment
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/merkle-logo.webp" alt="Merkle" className="h-5 w-auto" />
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Merkle · CRM Practice
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

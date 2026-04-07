"use client";

import { useState } from "react";
import { GUIDE_STEPS, EMAIL_TEMPLATES, CHECKLIST } from "@/lib/data/guide";

const CATEGORY_LABELS: Record<string, string> = {
  logistics: "Logistics",
  materials: "Materials",
  technology: "Technology",
  facilitation: "Facilitation",
  follow_up: "Follow-Up",
};

export default function GuidePage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
  const [checklistFormat, setChecklistFormat] = useState<"onsite" | "virtual">("onsite");
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);

  const filteredChecklist = CHECKLIST.filter((c) =>
    checklistFormat === "onsite" ? c.onsite : c.virtual
  );
  const categories = Array.from(new Set(filteredChecklist.map((c) => c.category)));

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f9fb" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/merkle-logo.webp" alt="Merkle" className="h-6 w-auto brightness-0 invert" />
          <div className="flex items-center gap-5">
            <a href="/" className="text-xs text-white/60 hover:text-white transition-colors">Home</a>
            <a href="/library" className="text-xs text-white/60 hover:text-white transition-colors">Library</a>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-sm font-medium mb-2" style={{ color: "#00205B" }}>Internal Guide</p>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Workshop Facilitator Playbook
        </h1>
        <p className="text-sm text-slate-500 mb-10 max-w-2xl">
          Everything you need to run a Modern CRM Diagnostic workshop from start to finish.
          Step-by-step instructions, email templates, logistics checklist, and SME guidance.
        </p>

        {/* ── Step-by-Step Guide ── */}
        <section className="mb-14">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Step-by-Step Process</h2>
          <div className="space-y-2">
            {GUIDE_STEPS.map((step) => {
              const isOpen = expandedStep === step.stepNumber;
              const emailTemplate = step.emailTemplateId
                ? EMAIL_TEMPLATES.find((t) => t.id === step.emailTemplateId)
                : null;
              return (
                <div key={step.stepNumber} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    className="w-full text-left px-5 py-4 flex items-start gap-4"
                    onClick={() => setExpandedStep(isOpen ? null : step.stepNumber)}
                  >
                    <span
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: "#00205B" }}
                    >
                      {step.stepNumber}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                        <span className="text-[10px] text-slate-400 font-medium">{step.timing}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{step.description}</p>
                    </div>
                    <svg
                      className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 ml-12 space-y-3">
                      <ol className="space-y-1.5">
                        {step.substeps.map((s, i) => (
                          <li key={i} className="text-sm text-slate-700 flex gap-2">
                            <span className="text-slate-400 flex-shrink-0 w-4 text-right">{i + 1}.</span>
                            {s}
                          </li>
                        ))}
                      </ol>

                      {step.tips && step.tips.length > 0 && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                          {step.tips.map((tip, i) => (
                            <p key={i} className="text-xs text-blue-800 leading-relaxed">
                              {i > 0 && <br />}
                              <span className="font-semibold">Tip:</span> {tip}
                            </p>
                          ))}
                        </div>
                      )}

                      {emailTemplate && (
                        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-slate-500">
                              Email Template: {emailTemplate.name}
                            </p>
                            <button
                              onClick={() => copyToClipboard(
                                `Subject: ${emailTemplate.subject}\n\n${emailTemplate.body}`,
                                emailTemplate.id
                              )}
                              className="text-xs font-medium hover:underline"
                              style={{ color: "#00205B" }}
                            >
                              {copied === emailTemplate.id ? "Copied!" : "Copy to clipboard"}
                            </button>
                          </div>
                          <p className="text-xs text-slate-600 font-mono bg-white border border-slate-100 rounded px-3 py-2 mb-1">
                            Subject: {emailTemplate.subject}
                          </p>
                          <p className="text-[10px] text-slate-400 italic">{emailTemplate.usage}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Email Templates ── */}
        <section className="mb-14">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Email Templates</h2>
          <div className="space-y-2">
            {EMAIL_TEMPLATES.map((tmpl) => {
              const isOpen = expandedEmail === tmpl.id;
              return (
                <div key={tmpl.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    className="w-full text-left px-5 py-3.5 flex items-center justify-between"
                    onClick={() => setExpandedEmail(isOpen ? null : tmpl.id)}
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{tmpl.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Subject: {tmpl.subject}</p>
                    </div>
                    <svg
                      className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => copyToClipboard(
                            `Subject: ${tmpl.subject}\n\n${tmpl.body}`,
                            `email-${tmpl.id}`
                          )}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                          style={{ color: "#00205B" }}
                        >
                          {copied === `email-${tmpl.id}` ? "Copied!" : "Copy Full Email"}
                        </button>
                      </div>
                      <pre className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 border border-slate-100 rounded-lg p-4 font-sans">
                        {tmpl.body}
                      </pre>
                      <p className="text-[10px] text-slate-400 mt-2 italic">{tmpl.usage}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {tmpl.placeholders.map((p) => (
                          <span key={p} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Workshop Checklist ── */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Workshop Checklist</h2>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
              <button
                onClick={() => setChecklistFormat("onsite")}
                className={`px-3 py-1.5 transition-colors ${
                  checklistFormat === "onsite" ? "text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
                style={checklistFormat === "onsite" ? { backgroundColor: "#00205B" } : undefined}
              >
                On-Site
              </button>
              <button
                onClick={() => setChecklistFormat("virtual")}
                className={`px-3 py-1.5 transition-colors ${
                  checklistFormat === "virtual" ? "text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
                style={checklistFormat === "virtual" ? { backgroundColor: "#00205B" } : undefined}
              >
                Virtual
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
            {categories.map((cat) => {
              const items = filteredChecklist.filter((c) => c.category === cat);
              return (
                <div key={cat}>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {CATEGORY_LABELS[cat] || cat}
                  </p>
                  <div className="space-y-1.5">
                    {items.map((item) => (
                      <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={checked.has(item.id)}
                          onChange={() => {
                            setChecked((prev) => {
                              const next = new Set(prev);
                              next.has(item.id) ? next.delete(item.id) : next.add(item.id);
                              return next;
                            });
                          }}
                          className="mt-0.5 rounded border-slate-300"
                        />
                        <div>
                          <p className={`text-sm ${checked.has(item.id) ? "text-slate-400 line-through" : "text-slate-700"}`}>
                            {item.label}
                          </p>
                          {item.details && (
                            <p className="text-[10px] text-slate-400 mt-0.5">{item.details}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
              {checked.size} / {filteredChecklist.length} completed
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Merkle</p>
          <div className="flex gap-4">
            <a href="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Home</a>
            <a href="/library" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Library</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

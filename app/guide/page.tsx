"use client";

import { useState } from "react";
import { GUIDE_STEPS, EMAIL_TEMPLATES } from "@/lib/data/guide";
import { M2Logo } from "@/components/brand/M2Logo";

export default function GuidePage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [expandedEmails, setExpandedEmails] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen font-m2 bg-m2-surface-light">
      {/* Header */}
      <header className="bg-m2-navy">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <M2Logo tone="dark" height={44} />
          <div className="flex items-center gap-5">
            <a href="/crm" className="text-xs text-white/60 hover:text-white transition-colors">Home</a>
            <a href="/library" className="text-xs text-white/60 hover:text-white transition-colors">Library</a>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-sm font-medium mb-2 text-m2-blue">Internal Guide</p>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Workshop Facilitator Playbook
        </h1>
        <p className="text-sm text-slate-500 mb-10 max-w-2xl">
          Everything you need to run a Merkle Maturity Assessment workshop from start to finish.
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
                      style={{ backgroundColor: "#0328d1" }}
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
                        <div className="border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setExpandedEmails((prev) => {
                              const next = new Set(prev);
                              next.has(emailTemplate.id) ? next.delete(emailTemplate.id) : next.add(emailTemplate.id);
                              return next;
                            })}
                            className="w-full text-left px-4 py-3 flex items-center justify-between"
                          >
                            <div>
                              <p className="text-xs font-semibold text-slate-700">
                                Email: {emailTemplate.name}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                Subject: {emailTemplate.subject}
                              </p>
                            </div>
                            <span className="text-[10px] font-medium" style={{ color: "#0328d1" }}>
                              {expandedEmails.has(emailTemplate.id) ? "Collapse" : "Expand to copy"}
                            </span>
                          </button>
                          {expandedEmails.has(emailTemplate.id) && (
                            <div className="px-4 pb-4 space-y-2">
                              <div className="flex justify-end">
                                <button
                                  onClick={() => copyToClipboard(
                                    `Subject: ${emailTemplate.subject}\n\n${emailTemplate.body}`,
                                    emailTemplate.id
                                  )}
                                  className="text-xs font-medium px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                                  style={{ color: "#0328d1" }}
                                >
                                  {copied === emailTemplate.id ? "Copied!" : "Copy Full Email"}
                                </button>
                              </div>
                              <pre className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap bg-white border border-slate-100 rounded-lg p-3 font-sans">
                                {emailTemplate.body}
                              </pre>
                              <p className="text-[10px] text-slate-400 italic">{emailTemplate.usage}</p>
                              <div className="flex flex-wrap gap-1">
                                {emailTemplate.placeholders.map((p) => (
                                  <span key={p} className="text-[9px] font-mono px-1 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-100">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Checklist note */}
        <section className="mb-14">
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Workshop Checklist</span> – The interactive checklist lives on each project dashboard, so you can track preparation per-project with on-site/virtual toggle and persistent progress.
            </p>
          </div>
        </section>
      </div>

      <footer className="border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Merkle</p>
          <div className="flex gap-4">
            <a href="/crm" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Home</a>
            <a href="/library" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Library</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CscProjectSetupForm } from "@/components/csc/project/CscProjectSetupForm";
import { CscStakeholderManager } from "@/components/csc/project/CscStakeholderManager";
import type { CscIndustry, CscProjectMode } from "@/lib/csc/types";

export default function NewCscProjectPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);

  const handleCreate = async (data: {
    clientName: string;
    clientCompany: string;
    industry: CscIndustry | "none" | "";
    createdByName: string;
    createdByEmail: string;
    mode: CscProjectMode;
    surveyPassword: string;
  }) => {
    const resolvedIndustry =
      data.industry === "none" || data.industry === "" ? null : data.industry;

    const res = await fetch("/api/csc/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: data.clientName,
        clientCompany: data.clientCompany,
        industry: resolvedIndustry,
        createdByName: data.createdByName,
        createdByEmail: data.createdByEmail,
        mode: data.mode,
        surveyPassword: data.surveyPassword || null,
      }),
    });

    if (!res.ok) throw new Error("Failed to create project");
    const { id, shareId: sid } = await res.json();
    setProjectId(id);
    setShareId(sid);
  };

  return (
    <div className="min-h-screen font-m2 bg-m2-surface-light">
      <div className="bg-m2-navy">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-3">
          <div className="flex items-baseline gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/merkle-logo.webp"
              alt="Merkle"
              className="h-4 w-auto brightness-0 invert"
            />
            <span className="text-[10px] font-bold tracking-[0.2em] text-m2-sky">M2</span>
          </div>
          <a
            href="/csc"
            className="text-xs text-white/70 hover:text-white transition-colors"
          >
            ← Content Supply Chain Diagnostic
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {!projectId ? (
            <CscProjectSetupForm onSubmit={handleCreate} />
          ) : (
            <CscStakeholderManager
              projectId={projectId}
              onDone={() => {
                window.location.href = `/csc/project/${shareId}`;
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

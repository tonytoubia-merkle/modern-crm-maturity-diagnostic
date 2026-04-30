"use client";

import { useState } from "react";
import { B2bProjectSetupForm } from "@/components/b2b/project/B2bProjectSetupForm";
import { B2bStakeholderManager } from "@/components/b2b/project/B2bStakeholderManager";
import { M2Logo } from "@/components/brand/M2Logo";
import type { B2bIndustry, B2bProjectMode } from "@/lib/b2b/types";

export default function NewB2bProjectPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);

  const handleCreate = async (data: {
    clientName: string;
    clientCompany: string;
    industry: B2bIndustry | "none" | "";
    createdByName: string;
    createdByEmail: string;
    mode: B2bProjectMode;
    surveyPassword: string;
  }) => {
    const resolvedIndustry =
      data.industry === "none" || data.industry === "" ? null : data.industry;

    const res = await fetch("/api/b2b/projects", {
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
          <M2Logo tone="dark" height={36} />
          <a
            href="/b2b"
            className="text-xs text-white/70 hover:text-white transition-colors"
          >
            ← B2B Transformation Diagnostic
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {!projectId ? (
            <B2bProjectSetupForm onSubmit={handleCreate} />
          ) : (
            <B2bStakeholderManager
              projectId={projectId}
              onDone={() => {
                window.location.href = `/b2b/project/${shareId}`;
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

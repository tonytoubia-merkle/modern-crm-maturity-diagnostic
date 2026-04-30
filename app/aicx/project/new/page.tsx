"use client";

import { useState } from "react";
import { AicxProjectSetupForm } from "@/components/aicx/project/AicxProjectSetupForm";
import { AicxStakeholderManager } from "@/components/aicx/project/AicxStakeholderManager";
import { M2Logo } from "@/components/brand/M2Logo";
import type { AicxIndustry, AicxProjectMode } from "@/lib/aicx/types";

export default function NewAicxProjectPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);

  const handleCreate = async (data: {
    clientName: string;
    clientCompany: string;
    industry: AicxIndustry | "none" | "";
    createdByName: string;
    createdByEmail: string;
    mode: AicxProjectMode;
    surveyPassword: string;
  }) => {
    const resolvedIndustry =
      data.industry === "none" || data.industry === "" ? null : data.industry;

    const res = await fetch("/api/aicx/projects", {
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
            href="/csc"
            className="text-xs text-white/70 hover:text-white transition-colors"
          >
            ← AI for CX Diagnostic
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {!projectId ? (
            <AicxProjectSetupForm onSubmit={handleCreate} />
          ) : (
            <AicxStakeholderManager
              projectId={projectId}
              onDone={() => {
                window.location.href = `/aicx/project/${shareId}`;
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { AientProjectSetupForm } from "@/components/aient/project/AientProjectSetupForm";
import { AientStakeholderManager } from "@/components/aient/project/AientStakeholderManager";
import { M2Logo } from "@/components/brand/M2Logo";
import type { AientIndustry, AientProjectMode } from "@/lib/aient/types";

export default function NewAientProjectPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);

  const handleCreate = async (data: {
    clientName: string;
    clientCompany: string;
    industry: AientIndustry | "none" | "";
    createdByName: string;
    createdByEmail: string;
    mode: AientProjectMode;
    surveyPassword: string;
  }) => {
    const resolvedIndustry =
      data.industry === "none" || data.industry === "" ? null : data.industry;

    const res = await fetch("/api/aient/projects", {
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
            ← AI for Enterprise Diagnostic
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {!projectId ? (
            <AientProjectSetupForm onSubmit={handleCreate} />
          ) : (
            <AientStakeholderManager
              projectId={projectId}
              onDone={() => {
                window.location.href = `/aient/project/${shareId}`;
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

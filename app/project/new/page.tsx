"use client";

import { useState } from "react";
import { ProjectSetupForm } from "@/components/project/ProjectSetupForm";
import { StakeholderManager } from "@/components/project/StakeholderManager";
import type { Industry, ProjectMode } from "@/lib/types";

export default function NewProjectPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [mode, setMode] = useState<ProjectMode | null>(null);

  const handleCreate = async (data: {
    clientName: string;
    clientCompany: string;
    industry: Industry | "none" | "";
    createdByName: string;
    createdByEmail: string;
    mode: ProjectMode;
    surveyPassword: string;
  }) => {
    const resolvedIndustry =
      data.industry === "none" || data.industry === "" ? null : data.industry;

    const res = await fetch("/api/projects", {
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
    setMode("workshop");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Branded nav */}
      <div style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/merkle-logo.webp" alt="Merkle" className="h-4 w-auto brightness-0 invert" />
          <a href="/" className="text-xs text-white/70 hover:text-white transition-colors">
            ← Modern CRM Diagnostic
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {!projectId ? (
            <ProjectSetupForm onSubmit={handleCreate} />
          ) : (
            <StakeholderManager
              projectId={projectId}
              onDone={() => {
                window.location.href = `/project/${shareId}`;
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

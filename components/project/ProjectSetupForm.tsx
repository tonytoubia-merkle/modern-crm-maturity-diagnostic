"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { INDUSTRY_LABELS } from "@/lib/data/questions";
import type { Industry, ProjectMode } from "@/lib/types";

interface ProjectSetupData {
  clientName: string;
  clientCompany: string;
  industry: Industry | "none" | "";
  createdByName: string;
  createdByEmail: string;
  mode: ProjectMode;
  surveyPassword: string;
}

interface ProjectSetupFormProps {
  onSubmit: (data: ProjectSetupData) => Promise<void>;
}

export function ProjectSetupForm({ onSubmit }: ProjectSetupFormProps) {
  const [data, setData] = useState<ProjectSetupData>({
    clientName: "",
    clientCompany: "",
    industry: "",
    createdByName: "",
    createdByEmail: "",
    mode: "workshop",
    surveyPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!data.clientName.trim()) errs.clientName = "Client name is required";
    if (!data.createdByName.trim()) errs.createdByName = "Your name is required";
    if (!data.createdByEmail.trim()) {
      errs.createdByEmail = "Your email is required to manage this project";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.createdByEmail)) {
      errs.createdByEmail = "Please enter a valid email";
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Create a New Project</h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Set up a diagnostic project for your client. Choose between a quick assessment
          you complete yourself, or a multi-stakeholder workshop with pre-work surveys.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mode selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Engagement Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setData({ ...data, mode: "lite" })}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                data.mode === "lite"
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <p className={`font-semibold text-sm ${data.mode === "lite" ? "text-blue-700" : "text-slate-800"}`}>
                Quick Assessment
              </p>
              <p className="text-xs text-slate-500 mt-1">
                You complete the assessment on behalf of or alongside the client. Single respondent.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setData({ ...data, mode: "workshop" })}
              className={`text-left p-4 rounded-xl border-2 transition-all relative ${
                data.mode === "workshop"
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <span className="absolute -top-2 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#00205B", color: "white" }}>
                Recommended
              </span>
              <p className={`font-semibold text-sm ${data.mode === "workshop" ? "text-blue-700" : "text-slate-800"}`}>
                Workshop Mode
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Distribute surveys to multiple client stakeholders. Aggregate results into a structured workshop.
              </p>
            </button>
          </div>
        </div>

        {/* Client info */}
        <Input
          id="clientName"
          label="Client / Organization Name"
          placeholder="e.g. Acme Corporation"
          value={data.clientName}
          onChange={(e) => setData({ ...data, clientName: e.target.value })}
          error={errors.clientName}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Industry / Sector
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setData({ ...data, industry: "none", clientCompany: "" })}
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all whitespace-nowrap ${
                data.industry === "none"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
              }`}
            >
              No specific industry
            </button>
            {(Object.entries(INDUSTRY_LABELS) as [Industry, string][]).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setData({ ...data, industry: key, clientCompany: label })}
                className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all whitespace-nowrap ${
                  data.industry === key
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Your info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="createdByName"
            label="Your Name"
            placeholder="e.g. Jane Smith"
            value={data.createdByName}
            onChange={(e) => setData({ ...data, createdByName: e.target.value })}
            error={errors.createdByName}
            required
          />
          <Input
            id="createdByEmail"
            label="Your Email"
            type="email"
            placeholder="you@merkle.com"
            value={data.createdByEmail}
            onChange={(e) => setData({ ...data, createdByEmail: e.target.value })}
            error={errors.createdByEmail}
            required
          />
        </div>

        {/* Survey password (workshop mode only) */}
        {data.mode === "workshop" && (
          <Input
            id="surveyPassword"
            label="Survey Password (optional)"
            type="text"
            placeholder="Leave blank for open access"
            value={data.surveyPassword}
            onChange={(e) => setData({ ...data, surveyPassword: e.target.value })}
            hint="If set, stakeholders must enter this password to access their survey."
          />
        )}

        <div className="pt-2">
          <Button type="submit" size="lg" loading={loading}>
            {data.mode === "workshop" ? "Create Project & Add Stakeholders →" : "Create Project & Start Assessment →"}
          </Button>
        </div>
      </form>
    </div>
  );
}

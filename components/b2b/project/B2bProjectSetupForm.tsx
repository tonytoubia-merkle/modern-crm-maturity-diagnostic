"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { B2B_INDUSTRY_LABELS } from "@/lib/b2b/data/questions";
import type { B2bIndustry, B2bProjectMode } from "@/lib/b2b/types";

interface B2bProjectSetupData {
  clientName: string;
  clientCompany: string;
  industry: B2bIndustry | "none" | "";
  createdByName: string;
  createdByEmail: string;
  mode: B2bProjectMode;
  surveyPassword: string;
}

interface B2bProjectSetupFormProps {
  onSubmit: (data: B2bProjectSetupData) => Promise<void>;
}

export function B2bProjectSetupForm({ onSubmit }: B2bProjectSetupFormProps) {
  const [data, setData] = useState<B2bProjectSetupData>({
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
        <h2 className="text-2xl font-bold text-slate-900">
          Create a CSC Workshop Project
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Set up a Content Supply Chain diagnostic project. Distribute pre-work
          surveys to stakeholders, aggregate the results, and generate a
          workshop agenda with facilitation guides.
        </p>
        <p className="mt-1.5 text-xs text-slate-400">
          For a single-respondent view, use the{" "}
          <a href="/b2b/assessment/new" className="underline hover:text-slate-600">
            Quick Assessment
          </a>{" "}
          instead.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              onClick={() =>
                setData({ ...data, industry: "none", clientCompany: "" })
              }
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all whitespace-nowrap ${
                data.industry === "none"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
              }`}
            >
              No specific industry
            </button>
            {(Object.entries(B2B_INDUSTRY_LABELS) as [B2bIndustry, string][]).map(
              ([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setData({ ...data, industry: key, clientCompany: label })
                  }
                  className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all whitespace-nowrap ${
                    data.industry === key
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>

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

        <Input
          id="surveyPassword"
          label="Survey Password (optional)"
          type="text"
          placeholder="Leave blank for open access"
          value={data.surveyPassword}
          onChange={(e) => setData({ ...data, surveyPassword: e.target.value })}
          hint="If set, stakeholders must enter this password to access their survey."
        />

        <div className="pt-2">
          <Button type="submit" size="lg" loading={loading}>
            Create Project & Add Stakeholders →
          </Button>
        </div>
      </form>
    </div>
  );
}

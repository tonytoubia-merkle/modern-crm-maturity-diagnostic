"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { INDUSTRY_LABELS } from "@/lib/data/questions";
import type { Industry } from "@/lib/types";

interface SetupData {
  clientName: string;
  clientCompany: string;
  respondentName: string;
  repEmail: string;
  isRepMode: boolean;
  industry: Industry | "none" | "";
}

interface SetupFormProps {
  onSubmit: (data: SetupData) => Promise<void>;
}

export function SetupForm({ onSubmit }: SetupFormProps) {
  const [data, setData] = useState<SetupData>({
    clientName: "",
    clientCompany: "",
    respondentName: "",
    repEmail: "",
    isRepMode: false,
    industry: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<SetupData>>({});

  const validate = () => {
    const errs: Partial<SetupData> = {};
    if (!data.clientName.trim()) errs.clientName = "Organization name is required";
    if (!data.respondentName.trim()) errs.respondentName = "Your name is required";
    if (data.repEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.repEmail)) {
      errs.repEmail = "Please enter a valid email address";
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Let&apos;s get started</h2>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed">
          Tell us about the organization being assessed. This information helps
          personalize your results and makes the report easy to share.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="clientName"
          label="Organization Name"
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
                onClick={() =>
                  setData({ ...data, industry: key as Industry, clientCompany: label })
                }
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
        <Input
          id="respondentName"
          label="Your Name"
          placeholder="e.g. Jane Smith"
          value={data.respondentName}
          onChange={(e) =>
            setData({ ...data, respondentName: e.target.value })
          }
          error={errors.respondentName}
          required
        />

        {/* Rep mode toggle */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                className="sr-only"
                checked={data.isRepMode}
                onChange={(e) =>
                  setData({ ...data, isRepMode: e.target.checked })
                }
              />
              <div
                className={`w-10 h-6 rounded-full transition-colors ${
                  data.isRepMode ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    data.isRepMode ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                I&apos;m completing this on behalf of a client
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Save your email to easily retrieve and manage multiple client assessments.
              </p>
            </div>
          </label>
        </div>

        {data.isRepMode && (
          <Input
            id="repEmail"
            label="Your Email"
            type="email"
            placeholder="you@merkle.com"
            value={data.repEmail}
            onChange={(e) => setData({ ...data, repEmail: e.target.value })}
            error={errors.repEmail}
            hint="We'll use this to let you retrieve all your client assessments."
          />
        )}

        <div className="pt-2">
          <Button type="submit" size="lg" loading={loading}>
            Begin Assessment →
          </Button>
        </div>
      </form>
    </div>
  );
}

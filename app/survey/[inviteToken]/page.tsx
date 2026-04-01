"use client";

import { useState, useEffect } from "react";
import { PasswordGate } from "@/components/survey/PasswordGate";
import { SurveyFlow } from "@/components/survey/SurveyFlow";
import { useParams } from "next/navigation";
import type { Industry, ResponseItem } from "@/lib/types";

interface SurveyData {
  project: {
    id: string;
    clientName: string;
    industry: Industry | null;
    hasPassword: boolean;
    status: string;
  };
  stakeholder: {
    id: string;
    name: string;
    status: string;
    assessmentId: string;
  };
  responses: ResponseItem[];
}

export default function SurveyPage() {
  const params = useParams();
  const inviteToken = params.inviteToken as string;

  const [data, setData] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    fetch(`/api/survey/${inviteToken}`)
      .then((r) => {
        if (!r.ok) throw new Error("Invalid link");
        return r.json();
      })
      .then((d) => {
        setData(d);
        if (!d.project.hasPassword) setVerified(true);
      })
      .catch(() => setError("This survey link is invalid or has expired."))
      .finally(() => setLoading(false));
  }, [inviteToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/merkle-logo.webp" alt="Merkle" className="h-8 w-auto mx-auto mb-6" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Link Invalid</h2>
          <p className="text-sm text-slate-600">
            {error || "This survey link could not be found."}
          </p>
        </div>
      </div>
    );
  }

  if (data.project.status !== "collecting") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/merkle-logo.webp" alt="Merkle" className="h-8 w-auto mx-auto mb-6" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Survey Closed</h2>
          <p className="text-sm text-slate-600">
            This survey is no longer accepting responses. The project has moved to the next phase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Branded header */}
      <div style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/merkle-logo.webp" alt="Merkle" className="h-4 w-auto brightness-0 invert" />
          <span className="text-xs text-white/50">
            Modern CRM Diagnostic · {data.project.clientName}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {!verified ? (
            <PasswordGate
              inviteToken={inviteToken}
              onVerified={() => setVerified(true)}
            />
          ) : (
            <SurveyFlow
              assessmentId={data.stakeholder.assessmentId}
              stakeholderId={data.stakeholder.id}
              respondentName={data.stakeholder.name}
              clientName={data.project.clientName}
              industry={data.project.industry}
              initialResponses={data.responses}
            />
          )}
        </div>
      </div>
    </div>
  );
}

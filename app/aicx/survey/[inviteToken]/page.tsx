"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AicxAssessmentFlow } from "@/components/aicx/assessment/AicxAssessmentFlow";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { AicxIndustry, AicxResponseItem } from "@/lib/aicx/types";

interface SurveyData {
  project: {
    id: string;
    clientName: string;
    industry: AicxIndustry | null;
    hasPassword: boolean;
    status: string;
  };
  stakeholder: {
    id: string;
    name: string;
    status: string;
    assessmentId: string;
  };
  responses: AicxResponseItem[];
}

export default function B2bSurveyPage() {
  const params = useParams();
  const inviteToken = params.inviteToken as string;

  const [data, setData] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [thankYou, setThankYou] = useState(false);

  useEffect(() => {
    fetch(`/api/aicx/survey/${inviteToken}`)
      .then((r) => {
        if (!r.ok) throw new Error("Invalid link");
        return r.json();
      })
      .then((d: SurveyData) => {
        setData(d);
        if (!d.project.hasPassword) setVerified(true);
      })
      .catch(() => setError("This survey link is invalid or has expired."))
      .finally(() => setLoading(false));
  }, [inviteToken]);

  const verifyPassword = async () => {
    setVerifying(true);
    setPasswordError("");
    try {
      const res = await fetch(`/api/aicx/survey/${inviteToken}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (res.ok && json.valid) {
        setVerified(true);
      } else {
        setPasswordError("Incorrect password.");
      }
    } catch {
      setPasswordError("Could not verify password. Try again.");
    } finally {
      setVerifying(false);
    }
  };

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
      <CenteredCard title="Link Invalid">
        {error || "This survey link could not be found."}
      </CenteredCard>
    );
  }

  if (thankYou || data.stakeholder.status === "completed") {
    return (
      <CenteredCard title="Thanks — you&apos;re done.">
        Your responses have been submitted. The workshop team will share
        aggregated findings back with you. You can close this tab.
      </CenteredCard>
    );
  }

  if (data.project.status !== "collecting") {
    return (
      <CenteredCard title="Survey Closed">
        This survey is no longer accepting responses. The project has moved to
        the next phase.
      </CenteredCard>
    );
  }

  return (
    <div className="min-h-screen font-merkle bg-merkle-grey-60">
      <div className="bg-merkle-secondary-600">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/merkle-logo.webp"
            alt="Merkle"
            className="h-4 w-auto brightness-0 invert"
          />
          <span className="text-xs text-white/50">
            AI for CX Assessment · {data.project.clientName}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {!verified ? (
            <div className="space-y-4 max-w-sm mx-auto">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Survey access
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  This survey is password protected. Enter the password you
                  received to continue.
                </p>
              </div>
              <Input
                id="survey-password"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
              />
              <Button
                onClick={verifyPassword}
                loading={verifying}
                disabled={!password.trim()}
                className="w-full"
              >
                Continue →
              </Button>
            </div>
          ) : (
            <AicxAssessmentFlow
              initialAssessmentId={data.stakeholder.assessmentId}
              initialShareId={null}
              initialResponses={data.responses}
              initialIndustry={data.project.industry}
              initialStep={1}
              stakeholderId={data.stakeholder.id}
              onComplete={() => setThankYou(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function CenteredCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center max-w-sm px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/merkle-logo.webp"
          alt="Merkle"
          className="h-8 w-auto mx-auto mb-6"
        />
        <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-sm text-slate-600">{children}</p>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { AicxResultsView } from "@/components/aicx/results/AicxResultsView";
import { createServerClient } from "@/lib/supabase/server";
import { buildAicxDiagnosticResults } from "@/lib/aicx/scoring";
import type { AicxResponseItem } from "@/lib/aicx/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { shareId: string };
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `AI for CX Diagnostic Results · ${params.shareId}`,
    description:
      "AI for CX Diagnostic results and strategic recommendations.",
  };
}

export default async function B2bResultsPage({ params }: PageProps) {
  const supabase = createServerClient();

  const { data: assessment, error } = await supabase
    .from("aicx_assessments")
    .select("*")
    .eq("share_id", params.shareId)
    .single();

  if (error || !assessment) {
    notFound();
  }

  const { data: rawResponses } = await supabase
    .from("aicx_responses")
    .select("*")
    .eq("assessment_id", assessment.id);

  const responses: AicxResponseItem[] = (rawResponses || []).map((r) => ({
    questionId: r.question_id,
    score: r.score,
    capability: r.capability,
    isIndustryQuestion: r.is_industry_question,
    notes: r.notes ?? undefined,
  }));

  const normalizedAssessment = {
    id: assessment.id,
    shareId: assessment.share_id,
    clientName: assessment.client_name,
    clientCompany: assessment.client_company,
    respondentName: assessment.respondent_name,
    repEmail: assessment.rep_email,
    isRepMode: assessment.is_rep_mode,
    industry: assessment.industry,
    status: assessment.status,
    createdAt: assessment.created_at,
    updatedAt: assessment.updated_at,
  };

  const results = buildAicxDiagnosticResults(normalizedAssessment, responses);

  return (
    <AicxResultsView
      results={results}
      shareId={params.shareId}
      responses={responses}
    />
  );
}

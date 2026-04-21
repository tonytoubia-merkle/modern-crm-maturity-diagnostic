import { notFound } from "next/navigation";
import { CscResultsView } from "@/components/csc/results/CscResultsView";
import { createServerClient } from "@/lib/supabase/server";
import { buildCscDiagnosticResults } from "@/lib/csc/scoring";
import type { CscResponseItem } from "@/lib/csc/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { shareId: string };
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `Content Supply Chain Diagnostic Results · ${params.shareId}`,
    description:
      "Content Supply Chain Diagnostic results and strategic recommendations.",
  };
}

export default async function CscResultsPage({ params }: PageProps) {
  const supabase = createServerClient();

  const { data: assessment, error } = await supabase
    .from("csc_assessments")
    .select("*")
    .eq("share_id", params.shareId)
    .single();

  if (error || !assessment) {
    notFound();
  }

  const { data: rawResponses } = await supabase
    .from("csc_responses")
    .select("*")
    .eq("assessment_id", assessment.id);

  const responses: CscResponseItem[] = (rawResponses || []).map((r) => ({
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

  const results = buildCscDiagnosticResults(normalizedAssessment, responses);

  return (
    <CscResultsView
      results={results}
      shareId={params.shareId}
      responses={responses}
    />
  );
}

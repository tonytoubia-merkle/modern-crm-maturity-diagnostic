import { notFound } from "next/navigation";
import { ResultsView } from "@/components/results/ResultsView";
import { createServerClient } from "@/lib/supabase/server";
import { buildDiagnosticResults } from "@/lib/scoring";
import type { ResponseItem } from "@/lib/types";

interface PageProps {
  params: { shareId: string };
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `CRM Diagnostic Results · ${params.shareId}`,
    description: "Modern CRM Maturity Diagnostic results and strategic recommendations.",
  };
}

export default async function ResultsPage({ params }: PageProps) {
  const supabase = createServerClient();

  const { data: assessment, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("share_id", params.shareId)
    .single();

  if (error || !assessment) {
    notFound();
  }

  const { data: rawResponses } = await supabase
    .from("responses")
    .select("*")
    .eq("assessment_id", assessment.id);

  const responses: ResponseItem[] = (rawResponses || []).map((r) => ({
    questionId: r.question_id,
    score: r.score,
    capability: r.capability,
    isIndustryQuestion: r.is_industry_question,
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

  const results = buildDiagnosticResults(normalizedAssessment, responses);

  return <ResultsView results={results} shareId={params.shareId} />;
}

import { notFound } from "next/navigation";
import { B2bResultsView } from "@/components/b2b/results/B2bResultsView";
import { createServerClient } from "@/lib/supabase/server";
import { buildB2bDiagnosticResults } from "@/lib/b2b/scoring";
import type { B2bResponseItem } from "@/lib/b2b/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { shareId: string };
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `B2B Transformation Diagnostic Results · ${params.shareId}`,
    description:
      "B2B Transformation Diagnostic results and strategic recommendations.",
  };
}

export default async function B2bResultsPage({ params }: PageProps) {
  const supabase = createServerClient();

  const { data: assessment, error } = await supabase
    .from("b2b_assessments")
    .select("*")
    .eq("share_id", params.shareId)
    .single();

  if (error || !assessment) {
    notFound();
  }

  const { data: rawResponses } = await supabase
    .from("b2b_responses")
    .select("*")
    .eq("assessment_id", assessment.id);

  const responses: B2bResponseItem[] = (rawResponses || []).map((r) => ({
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

  const results = buildB2bDiagnosticResults(normalizedAssessment, responses);

  return (
    <B2bResultsView
      results={results}
      shareId={params.shareId}
      responses={responses}
    />
  );
}

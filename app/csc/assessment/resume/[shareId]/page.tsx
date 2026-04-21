import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { CscAssessmentFlow } from "@/components/csc/assessment/CscAssessmentFlow";
import {
  CSC_CAPABILITIES_ORDER,
  CSC_QUESTIONS_BY_CAPABILITY,
} from "@/lib/csc/data/questions";
import type {
  CscCapability,
  CscIndustry,
  CscResponseItem,
} from "@/lib/csc/types";

export const dynamic = "force-dynamic";

export default async function ResumeCscAssessmentPage({
  params,
}: {
  params: { shareId: string };
}) {
  const supabase = createServerClient();

  const { data: assessment } = await supabase
    .from("csc_assessments")
    .select("*")
    .eq("share_id", params.shareId)
    .single();

  if (!assessment) notFound();

  const { data: rawResponses } = await supabase
    .from("csc_responses")
    .select("*")
    .eq("assessment_id", assessment.id);

  const responses: CscResponseItem[] = (rawResponses ?? []).map((r) => ({
    // Core question IDs are numbers in the app but stored as TEXT in DB — convert back
    questionId: /^\d+$/.test(r.question_id) ? Number(r.question_id) : r.question_id,
    score: r.score,
    capability: r.capability as CscCapability,
    isIndustryQuestion: r.is_industry_question,
    notes: r.notes ?? undefined,
  }));

  // Start at step 1 for completed assessments (user edits from the top).
  // For in-progress, jump to the first capability with any unanswered question.
  let initialStep = 1;
  if (assessment.status !== "completed") {
    for (let i = 0; i < CSC_CAPABILITIES_ORDER.length; i++) {
      const cap = CSC_CAPABILITIES_ORDER[i];
      const capQuestions = CSC_QUESTIONS_BY_CAPABILITY[cap];
      const allAnswered = capQuestions.every((q) =>
        responses.some((r) => r.questionId === q.id)
      );
      if (!allAnswered) {
        initialStep = i + 1;
        break;
      }
      initialStep = i + 1;
    }
  }

  const industry = (assessment.industry as CscIndustry | null) ?? null;

  return (
    <CscAssessmentFlow
      initialAssessmentId={assessment.id}
      initialShareId={assessment.share_id}
      initialResponses={responses}
      initialIndustry={industry}
      initialStep={initialStep}
    />
  );
}

import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { AicxAssessmentFlow } from "@/components/aicx/assessment/AicxAssessmentFlow";
import {
  AICX_CAPABILITIES_ORDER,
  AICX_QUESTIONS_BY_CAPABILITY,
} from "@/lib/aicx/data/questions";
import type {
  AicxCapability,
  AicxIndustry,
  AicxResponseItem,
} from "@/lib/aicx/types";

export const dynamic = "force-dynamic";

export default async function ResumeAicxAssessmentPage({
  params,
}: {
  params: { shareId: string };
}) {
  const supabase = createServerClient();

  const { data: assessment } = await supabase
    .from("aicx_assessments")
    .select("*")
    .eq("share_id", params.shareId)
    .single();

  if (!assessment) notFound();

  const { data: rawResponses } = await supabase
    .from("aicx_responses")
    .select("*")
    .eq("assessment_id", assessment.id);

  const responses: AicxResponseItem[] = (rawResponses ?? []).map((r) => ({
    // Core question IDs are numbers in the app but stored as TEXT in DB — convert back
    questionId: /^\d+$/.test(r.question_id) ? Number(r.question_id) : r.question_id,
    score: r.score,
    capability: r.capability as AicxCapability,
    isIndustryQuestion: r.is_industry_question,
    notes: r.notes ?? undefined,
  }));

  // Start at step 1 for completed assessments (user edits from the top).
  // For in-progress, jump to the first capability with any unanswered question.
  let initialStep = 1;
  if (assessment.status !== "completed") {
    for (let i = 0; i < AICX_CAPABILITIES_ORDER.length; i++) {
      const cap = AICX_CAPABILITIES_ORDER[i];
      const capQuestions = AICX_QUESTIONS_BY_CAPABILITY[cap];
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

  const industry = (assessment.industry as AicxIndustry | null) ?? null;

  return (
    <AicxAssessmentFlow
      initialAssessmentId={assessment.id}
      initialShareId={assessment.share_id}
      initialResponses={responses}
      initialIndustry={industry}
      initialStep={initialStep}
    />
  );
}

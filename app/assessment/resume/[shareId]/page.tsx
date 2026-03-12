import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { AssessmentFlow } from "@/components/assessment/AssessmentFlow";
import { CAPABILITIES_ORDER, QUESTIONS_BY_CAPABILITY } from "@/lib/data/questions";
import type { Industry, ResponseItem, Capability } from "@/lib/types";

export default async function ResumeAssessmentPage({
  params,
}: {
  params: { shareId: string };
}) {
  const supabase = createServerClient();

  const { data: assessment } = await supabase
    .from("assessments")
    .select("*")
    .eq("share_id", params.shareId)
    .single();

  if (!assessment) notFound();

  // Completed assessments go straight to results
  if (assessment.status === "completed") {
    redirect(`/results/${params.shareId}`);
  }

  const { data: rawResponses } = await supabase
    .from("responses")
    .select("*")
    .eq("assessment_id", assessment.id);

  const responses: ResponseItem[] = (rawResponses ?? []).map((r) => ({
    // Core question IDs are numbers in the app but stored as TEXT in DB — convert back
    questionId: /^\d+$/.test(r.question_id) ? Number(r.question_id) : r.question_id,
    score: r.score,
    capability: r.capability as Capability,
    isIndustryQuestion: r.is_industry_question,
  }));

  // Find first incomplete core section to resume at
  let initialStep = 1;
  for (let i = 0; i < CAPABILITIES_ORDER.length; i++) {
    const cap = CAPABILITIES_ORDER[i] as Capability;
    const capQuestions = QUESTIONS_BY_CAPABILITY[cap];
    const allAnswered = capQuestions.every((q) =>
      responses.some((r) => r.questionId === q.id)
    );
    if (!allAnswered) {
      initialStep = i + 1;
      break;
    }
    initialStep = i + 1; // all done so far, keep advancing
  }

  const industry = assessment.industry as Industry | null;

  return (
    <AssessmentFlow
      initialAssessmentId={assessment.id}
      initialShareId={assessment.share_id}
      initialResponses={responses}
      initialIndustry={industry}
      initialStep={initialStep}
    />
  );
}

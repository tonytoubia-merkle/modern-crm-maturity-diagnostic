import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { aggregateAicxStakeholderResponses } from "@/lib/aicx/workshop/aggregation";
import {
  computeAicxCapabilityScores,
  computeAicxOverallScore,
  computeAicxMaturityStage,
} from "@/lib/aicx/scoring";
import { getAicxTriggeredOpportunities } from "@/lib/aicx/data/opportunities";
import { buildAicxWorkshopAgenda } from "@/lib/aicx/workshop/agendaBuilder";
import type { AicxCapability, AicxResponseItem } from "@/lib/aicx/types";

export async function POST(
  _request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = createServerClient();

    const { data: project, error: pErr } = await supabase
      .from("aicx_projects")
      .select("*")
      .eq("id", params.projectId)
      .single();

    if (pErr || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { data: assessments, error: aErr } = await supabase
      .from("aicx_assessments")
      .select("id")
      .eq("project_id", params.projectId)
      .eq("status", "completed");

    if (aErr) throw aErr;

    if (!assessments || assessments.length === 0) {
      return NextResponse.json(
        { error: "No completed assessments to aggregate" },
        { status: 400 }
      );
    }

    const allResponses: AicxResponseItem[][] = [];

    for (const assessment of assessments) {
      const { data: rawResponses } = await supabase
        .from("aicx_responses")
        .select("*")
        .eq("assessment_id", assessment.id);

      if (rawResponses && rawResponses.length > 0) {
        allResponses.push(
          rawResponses.map((r) => ({
            questionId: /^\d+$/.test(r.question_id)
              ? Number(r.question_id)
              : r.question_id,
            score: r.score,
            capability: r.capability as AicxCapability,
            isIndustryQuestion: r.is_industry_question,
          }))
        );
      }
    }

    if (allResponses.length === 0) {
      return NextResponse.json(
        { error: "No responses found" },
        { status: 400 }
      );
    }

    const { averagedResponses, varianceByQuestion, responseCountByQuestion } =
      aggregateAicxStakeholderResponses(allResponses);

    const capabilityScores = computeAicxCapabilityScores(averagedResponses);
    const overallScore = computeAicxOverallScore(capabilityScores);
    const maturityStage = computeAicxMaturityStage(overallScore);
    const opportunities = getAicxTriggeredOpportunities(capabilityScores);

    const agenda = buildAicxWorkshopAgenda(
      opportunities.map((o) => o.id),
      project.industry || undefined
    );

    const { error: updateErr } = await supabase
      .from("aicx_projects")
      .update({
        status: "completed",
        aggregated_scores: capabilityScores,
        aggregated_overall: overallScore,
        aggregated_maturity: maturityStage,
        triggered_opportunity_ids: opportunities.map((o) => o.id),
        workshop_agenda: agenda,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.projectId);

    if (updateErr) throw updateErr;

    await supabase
      .from("aicx_stakeholders")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("project_id", params.projectId)
      .in(
        "assessment_id",
        assessments.map((a) => a.id)
      );

    return NextResponse.json({
      aggregatedScores: capabilityScores,
      overallScore,
      maturityStage,
      opportunityCount: opportunities.length,
      respondentCount: allResponses.length,
      varianceByQuestion,
      responseCountByQuestion,
    });
  } catch (err) {
    console.error("POST /api/aicx/projects/[id]/aggregate error:", err);
    return NextResponse.json(
      { error: "Failed to aggregate CSC responses" },
      { status: 500 }
    );
  }
}

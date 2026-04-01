import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { aggregateStakeholderResponses } from "@/lib/workshop/aggregation";
import {
  computeCapabilityScores,
  computeOverallScore,
  computeMaturityStage,
} from "@/lib/scoring";
import { getTriggeredOpportunities } from "@/lib/data/opportunities";
import { buildWorkshopAgenda } from "@/lib/workshop/agendaBuilder";
import type { Capability, ResponseItem } from "@/lib/types";

export async function POST(
  _request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = createServerClient();

    // Get project
    const { data: project, error: pErr } = await supabase
      .from("projects")
      .select("*")
      .eq("id", params.projectId)
      .single();

    if (pErr || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get all completed assessments for this project
    const { data: assessments, error: aErr } = await supabase
      .from("assessments")
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

    // Fetch all responses for each completed assessment
    const allResponses: ResponseItem[][] = [];

    for (const assessment of assessments) {
      const { data: rawResponses } = await supabase
        .from("responses")
        .select("*")
        .eq("assessment_id", assessment.id);

      if (rawResponses && rawResponses.length > 0) {
        allResponses.push(
          rawResponses.map((r) => ({
            questionId: /^\d+$/.test(r.question_id)
              ? Number(r.question_id)
              : r.question_id,
            score: r.score,
            capability: r.capability as Capability,
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

    // Aggregate
    const { averagedResponses, varianceByQuestion, responseCountByQuestion } =
      aggregateStakeholderResponses(allResponses);

    // Run through existing scoring pipeline
    const capabilityScores = computeCapabilityScores(averagedResponses);
    const overallScore = computeOverallScore(capabilityScores);
    const maturityStage = computeMaturityStage(overallScore);
    const opportunities = getTriggeredOpportunities(capabilityScores);

    // Build workshop agenda from triggered opportunities
    const agenda = buildWorkshopAgenda(
      opportunities.map((o) => o.id),
      project.industry || undefined
    );

    // Update project with aggregated results + agenda
    const { error: updateErr } = await supabase
      .from("projects")
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

    // Update all stakeholder statuses
    await supabase
      .from("stakeholders")
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
    console.error("POST /api/projects/[id]/aggregate error:", err);
    return NextResponse.json(
      { error: "Failed to aggregate responses" },
      { status: 500 }
    );
  }
}

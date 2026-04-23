import type { CscCapability } from "@/lib/csc/types";

/**
 * CSC workshop vignettes — anonymized client stories used in facilitation
 * and as pipeline/opportunity anchors.
 *
 * Sourced from the Merkle 2026 CSC POV Narrative and the Build / Activate
 * Offering Toolkits (v1.0, March 2026). Each vignette maps to the
 * capabilities it illustrates and the triggered opportunities it anchors.
 */
export interface CscVignette {
  id: string;
  title: string;
  tagline: string;
  /** Capabilities this vignette illustrates — drives matching to opportunities. */
  capabilities: CscCapability[];
  /** 1–2 paragraph anonymized (or Merkle-public) client story. */
  narrative: string;
  /** Outcomes or measured impact claimed in the story. */
  outcomes?: string[];
  /** Industry codes (matching CscIndustry) where the vignette is most relevant. */
  industries?: string[];
  /** Suggested facilitation prompts / discussion questions. */
  prompts?: string[];
}

export const CSC_VIGNETTES: CscVignette[] = [
  {
    id: "highmark_enterprise_transformation",
    title: "Enterprise Content Transformation in a Regulated Industry",
    tagline:
      "From 45–60 day content cycles toward a 15-day target with governed AI",
    capabilities: [
      "strategy_planning",
      "workflow_production",
      "asset_governance",
      "intelligence_automation",
    ],
    narrative:
      "A regulated healthcare enterprise ran 200,000+ content-influenced hours annually across ~98 monthly contributors, with content moving through 12+ reviewer workflows in cycles averaging 45–60 days. Five DAMs coexisted. Tooling fragmented across Excel, Jira, and Trello. Review cycles were so long that by the time content shipped, the strategy had moved on. Merkle anchored the work in an Enterprise Transformation — unifying the operating system around Workfront + AEM + integrated AI, with a 15-day cycle target, role clarity for 97+ FTE adoption, and an AI enablement model that moved isolated pilots to governed, scalable automation.",
    outcomes: [
      "$21.7M net benefit over 5 years",
      "149% ROI with 28-month payback",
      "5 DAMs consolidated to a single hub (Tenovos)",
      "~15% asset reuse → 60–75% governed reuse target",
      "Cycle time: 45–60 days → target <15 days",
    ],
    prompts: [
      "Where are your longest review cycles today, and who actually owns each decision?",
      "Which platforms are live but getting bypassed — and why?",
      "If AI automation could eliminate one category of manual work this quarter, which would it be?",
    ],
  },
  {
    id: "princess_csc_blueprint",
    title: "From CSC Blueprint to $5.7M Transformation Vision",
    tagline: "Phase 1 strategy engagement becomes an enterprise Phase 2 plan",
    capabilities: [
      "strategy_planning",
      "asset_governance",
      "workflow_production",
    ],
    narrative:
      "Princess Cruise Lines had fragmented tools, redundant asset creation, and no clear migration path. The engagement started as a 12-week CSC Strategy Blueprint and expanded into a full transformation vision. Merkle delivered 15 use cases with crawl-walk-run phasing, ran technology evaluations (AEM vs. Widen, Express vs. Canva, Content Hub vs. Frontify), remediated enterprise governance and taxonomy, and designed the end-to-end CSC using Workfront, AEM Assets, Creative Cloud, and Adobe Express — complete with a change management framework and stakeholder alignment approach.",
    outcomes: [
      "$5.7M annual operational value identified in Phase 2",
      "$486K year-one quick wins scaling to $2.2M at full adoption",
      "$134K CX opportunity unlocked",
      "15 use cases defined with crawl-walk-run phasing & dependency mapping",
    ],
    industries: ["travel_hospitality"],
    prompts: [
      "What fragmentation exists in your asset and creative tools stack today?",
      "If you had a prioritized 15-use-case roadmap, which would you attack first?",
      "Where are you currently defaulting to 'buy' without a blueprint?",
    ],
  },
  {
    id: "lumen_genstudio_acceleration",
    title: "B2B Content Acceleration with GenStudio",
    tagline: "From 25-day content cycles to 9 days through AI-powered production",
    capabilities: [
      "workflow_production",
      "intelligence_automation",
      "distribution_activation",
    ],
    narrative:
      "Lumen was evolving from a traditional network service provider to a modern B2B tech solutions partner. A disconnected marketing and CX technology stack, manual workflows, and siloed data architecture prevented delivery of personalized customer experiences at scale. Merkle led a comprehensive digital transformation spanning data modernization, content supply chain optimization, and technology architecture alignment. Adobe GenStudio became the acceleration engine, with enterprise data strategy optimizing Adobe and Salesforce integration, governance frameworks, and customer journey development enabling real-time, personalized engagement.",
    outcomes: [
      "Content creation accelerated from 25 days to 9 days",
      "3× faster time-to-market for social campaigns",
      "64% reduction in content creation time",
    ],
    prompts: [
      "How long does it currently take from brief to live campaign?",
      "Which channels are waiting the longest for content today?",
      "If GenAI could cut 50% from one workflow this year, where would you use it?",
    ],
  },
  {
    id: "vanguard_aem_cloud_migration",
    title: "AEM Cloud Migration with Governance-First Design",
    tagline:
      "Structured intake, workflow, and governance in a regulated environment",
    capabilities: [
      "asset_governance",
      "workflow_production",
      "distribution_activation",
    ],
    narrative:
      "Vanguard wanted to migrate to AEM cloud from on-premise but had no governance model, fragmented ownership across teams, and an unclear migration path. Merkle designed AEM Cloud + Workfront for structured intake, workflow, and content governance. Follow-on work introduced Adobe Experience Platform + AJO for real-time decisioning and AEM for structured content fragments — unlocking 1:1 personalization at scale, improved conversion, and reduced production burden inside the constraints of a regulated financial services environment.",
    outcomes: [
      "Governance model established for regulated content",
      "Migration path defined with risk mitigation",
      "1:1 personalization at scale enabled",
      "Production burden reduced through structured content fragments",
    ],
    industries: ["financial_services"],
    prompts: [
      "Who owns which content decisions across your teams today?",
      "What's preventing your next platform migration from starting?",
      "Where are regulated disclosures still getting recreated manually across surfaces?",
    ],
  },
  {
    id: "microsoft_ai_adoption_recovery",
    title: "Rescuing Stalled AI Tool Adoption",
    tagline:
      "From \"no one is using it\" to measurable adoption lift tied to real campaigns",
    capabilities: ["workflow_production", "intelligence_automation"],
    narrative:
      "Microsoft had purchased Firefly, Express, and GenStudio, but adoption stalled post-launch. There was no governance or enablement plan; teams defaulted back to legacy tools; early outputs felt generic and off-brand, eroding stakeholder trust. Merkle led an activation program that configured the brand kit in Express, trained a custom Firefly model on approved brand assets, and integrated a GenStudio workflow into the existing campaign intake. Tools now work within brand guardrails from day one, and confidence was restored through quick wins tied to real campaigns.",
    outcomes: [
      "Tools working within brand guardrails from day 1",
      "Measurable adoption lift across content teams",
      "Restored stakeholder confidence through campaign-tied quick wins",
    ],
    prompts: [
      "Which AI tools have you bought that aren't being used today?",
      "What brand guardrails do your teams worry would get broken by AI?",
      "Where do you have champions who could become AI catalysts?",
    ],
  },
  {
    id: "cpg_dam_value_realization",
    title: "Recovering Stranded DAM ROI Through Adoption",
    tagline: "From 35% utilization to 72% in 60 days",
    capabilities: ["asset_governance", "workflow_production"],
    narrative:
      "A global CPG client saw their $2M DAM investment sitting at 35% utilization six months post-launch. Creative teams were still using shared drives, brand managers couldn't find approved assets, and regional offices operated in silos. Merkle's Platform Value Realization engagement diagnosed adoption barriers, reconfigured workflows, and delivered embedded enablement inside delivery teams. Within 60 days of intervention, the platform finally started delivering the ROI originally projected two years earlier.",
    outcomes: [
      "DAM utilization: 35% → 72% in 60 days",
      "Asset search time: 45 minutes → under 5 minutes",
      "60% reduction in duplicate content creation",
    ],
    industries: ["retail"],
    prompts: [
      "What's the utilization of your largest content platform today?",
      "How long does it take your team to find an approved asset?",
      "Where is manual rework silently taxing every campaign?",
    ],
  },
];

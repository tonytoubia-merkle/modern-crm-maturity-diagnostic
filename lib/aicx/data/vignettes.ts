import type {
  AicxClientStory,
  AicxWorkshopVignette,
} from "@/lib/aicx/types";

/**
 * AI for CX workshop content – two parallel datasets:
 *
 *   1. AICX_VIGNETTES        – facilitation exercises that consultants
 *                              run with client teams to develop one or
 *                              more capability areas.
 *   2. AICX_CLIENT_STORIES   – anonymized proof points used as anchors
 *                              during pitch and capability conversations.
 *                              Sourced from the AI for CX deep dive
 *                              (March 2026) and the EXO Offering Toolkit
 *                              (v2.0).
 */

// ══════════════════════════════════════════════════════════════════
// AICX_VIGNETTES – workshop facilitation exercises
// ══════════════════════════════════════════════════════════════════

export const AICX_VIGNETTES: AicxWorkshopVignette[] = [
  {
    id: "aicx_north_star_visioning",
    title: "AI for CX North Star Visioning",
    description:
      "Align leadership on a future-state, AI-native customer experience and the investment themes needed to get there. Output is a draft North Star and three to five investment themes that will fund the next 24 months.",
    durationMinutes: 90,
    category: "Vision & Strategy",
    requiredInputs: [
      "Executive sponsor list (CMO/CXO/CDO/CIO at minimum) and pre-read interview notes",
      "Top three customer / market threats heard in the last 90 days",
      "Most recent CX strategy and its primary growth assumptions",
      "Current AI investment portfolio and which surfaces are AI-active today",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the session around the agentic-CX shift – Gartner forecasts 25%+ of search queries handled by AI agents/answer engines by 2026. Walk the macro pressures: AI invisibility, Gen-Alpha research patterns, conversational commerce, and the EXO measurement gap.\n\n**Exercise 1 – Future-State Story (25 min):** In pairs, leaders write a one-paragraph story describing the customer experience three years from now. Constraint: the story must reference at least two of the four AI for CX pillars (Discoverability, Agentic Experience, Adaptive Personalization, EXO). Cluster on a board.\n\n**Exercise 2 – Investment Themes (25 min):** Distill three to five investment themes that, if funded, would make the future-state real. For each: what it changes, who owns it, rough cost, what becomes possible after.\n\n**Exercise 3 – Stop-doing list (20 min):** What does the organization stop doing? List five legacy programs, KPIs, or rituals that no longer serve an AI-native CX (e.g., last-click attribution, faith-based personalization, ungoverned generative content).\n\n**Wrap-up (10 min):** Capture a draft North Star, the investment themes, and the stop-doing list. Get verbal sponsor commitment on publication.",
    expectedOutputs: [
      "Draft North Star statement crossing 2+ AI-for-CX pillars",
      "Three to five funded investment themes with rough cost",
      "Stop-doing list with named retirement dates",
      "Sponsor commitment on publication of the North Star",
    ],
    relatedOpportunityIds: [
      "ai_for_cx_diagnostic",
      "agentic_discoverability_audit",
    ],
    triggerCapabilities: [
      "agentic_discoverability",
      "agentic_experience",
      "adaptive_personalization",
      "measurement_trust",
    ],
    sortOrder: 1,
  },
  {
    id: "agentic_discoverability_sprint",
    title: "Agentic Discoverability Sprint",
    description:
      "Probe how the brand is represented across leading LLMs and AI search engines, identify the structural fixes that unlock agent inclusion, and produce a 60-day remediation plan.",
    durationMinutes: 120,
    category: "Agentic Discoverability",
    requiredInputs: [
      "Top 30 brand and category queries the business cares about",
      "Current SEO content map and authority content inventory",
      "Schema and structured-data audit (if available)",
      "Top three competitor brands for benchmarking",
    ],
    facilitationGuide:
      "**Setup (15 min):** Frame the gap – brands that aren't structured for AI extraction are silently filtered out of agentic answers. Walk the room through the cohort findings from the AI for CX deep dive on AEO/LLM share-of-voice.\n\n**Exercise 1 – LLM Probe (35 min):** Run the 30 queries through ChatGPT, Claude, Gemini, and Perplexity (or have the team do it live in pairs). For each query capture: (a) was the brand mentioned, (b) was it the primary recommendation, (c) what authority sources were cited, (d) which competitor was named instead.\n\n**Exercise 2 – Root Cause Map (35 min):** Cluster the misses into root-cause buckets – schema gaps, authority-content gaps, knowledge-graph gaps, brand-mention/citation gaps. For each cluster, identify the structural fix and the team that owns it.\n\n**Exercise 3 – 60-Day Plan (25 min):** Pick the top three structural fixes that close the most cited misses. Define owners, deliverables, and a re-probe date 60 days out.\n\n**Wrap-up (10 min):** Capture the probe data, the root-cause map, and the 60-day plan. Establish the LLM-monitoring cadence.",
    expectedOutputs: [
      "Cross-LLM probe data on top 30 brand and category queries",
      "Root-cause map with named structural fixes",
      "60-day plan with owners and re-probe date",
      "Ongoing LLM-monitoring cadence",
    ],
    relatedOpportunityIds: [
      "agentic_discoverability_audit",
      "agentic_seo_aeo_modernization",
    ],
    triggerCapabilities: ["agentic_discoverability"],
    sortOrder: 2,
  },
  {
    id: "agentic_experience_design_lab",
    title: "Agentic Experience Design Lab",
    description:
      "Redesign one high-value digital surface (PDP, search, browse, support) for AI-native users. Output is a design hypothesis, prototype scope, and a measurement plan to validate it.",
    durationMinutes: 120,
    category: "Agentic Experience",
    requiredInputs: [
      "Current-state journey map for the chosen surface",
      "Top three jobs the surface needs to do for the customer",
      "Behavioural data on Gen-Z / Gen-Alpha research patterns (if available)",
      "Existing design-system tokens and content patterns",
    ],
    facilitationGuide:
      "**Setup (15 min):** Frame the shift – Gen-Alpha and Gen-Z research the way they research TikTok. Pages designed for human-only browsing feel obsolete to them within seconds. Walk the AI for CX deep-dive examples on conversational discovery and video-led product pages.\n\n**Exercise 1 – Surface Selection (15 min):** Pick the single surface with the highest leverage (high traffic, high friction, AI-relevant intent). Frame the behaviour change you want.\n\n**Exercise 2 – Pattern Library (40 min):** In pairs, sketch three AI-native pattern variants – conversational, video-led, and AI-summarised. For each, capture the user flow, the AI's role, the brand-safety guardrails, and what data the pattern needs.\n\n**Exercise 3 – Hypothesis & Measurement (40 min):** For the leading variant, write a falsifiable hypothesis ('users in this variant complete the job 25% faster') and a measurement plan that uses the EXO infrastructure – A/B, holdout, factorial as appropriate.\n\n**Wrap-up (10 min):** Capture the design hypothesis, the prototype scope, and the named owner who will run it.",
    expectedOutputs: [
      "Selected high-value surface with named behaviour change",
      "Three AI-native pattern variants with user flow and guardrails",
      "Falsifiable hypothesis and measurement plan",
      "Named prototype owner with start date inside 14 days",
    ],
    relatedOpportunityIds: [
      "agentic_experience_design",
      "ai_search_conversational_commerce",
    ],
    triggerCapabilities: ["agentic_experience"],
    sortOrder: 3,
  },
  {
    id: "adaptive_personalization_workshop",
    title: "Adaptive Personalization Workshop",
    description:
      "Pick one high-value journey and redesign it around real-time AI decisioning. Output is an MVP plan that moves the journey from rules / batch personalization to model-driven, multi-armed delivery.",
    durationMinutes: 120,
    category: "Adaptive Personalization",
    requiredInputs: [
      "Journey selection candidates (acquisition, onboarding, cross-sell, retention)",
      "Identity coverage and signal inventory for the journey",
      "Current personalization tooling and segmentation logic",
      "Last 12 months of behaviour data on the journey",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the shift from rules and batch to real-time, model-driven decisioning. Reference the typical 15–35% conversion lift on owned channels when adaptive replaces rules.\n\n**Exercise 1 – Journey Selection (20 min):** From the candidates, pick one journey using the criteria: (a) sized opportunity, (b) signal density, (c) identity coverage, (d) decisioning surface available, (e) measurement clean enough to prove a lift.\n\n**Exercise 2 – Decisioning Architecture (45 min):** Sketch the architecture: signal inventory, feature store, models (propensity / NBA / value), trigger logic, content / offer factory, channel orchestration. Note where existing tooling fits and where new pieces are needed.\n\n**Exercise 3 – MVP Plan (35 min):** Define an MVP that ships one decisioning loop in 90 days – what is in scope (one journey, three offers, two channels) and what is parked for v2. Capture measurement, holdout discipline, and the team running it.\n\n**Wrap-up (10 min):** Capture the journey, architecture sketch, MVP scope, and named lead.",
    expectedOutputs: [
      "Selected high-value journey with sized opportunity",
      "Decisioning architecture sketch",
      "90-day MVP plan with explicit scope and parked-for-v2 list",
      "Measurement plan with holdout discipline",
    ],
    relatedOpportunityIds: [
      "adaptive_personalization_workshop",
      "real_time_personalization_platform",
      "identity_data_foundation",
    ],
    triggerCapabilities: ["adaptive_personalization", "identity_data"],
    sortOrder: 4,
  },
  {
    id: "exo_maturity_assessment",
    title: "EXO Maturity Assessment",
    description:
      "Audit the experimentation engine – cadence, statistical rigor, holdout discipline, factorial design – and produce a 12-month plan to mature it.",
    durationMinutes: 90,
    category: "Testing & Experimentation",
    requiredInputs: [
      "Last 12 months of experimentation backlog and results",
      "Current tooling (LaunchDarkly / Optimizely / GrowthBook / etc.)",
      "Statistical methodology playbooks (if any)",
      "Team structure across product, marketing science, and analytics",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame EXO as the truth-telling layer for AI investment. Without rigor, AI ROI claims are unfalsifiable. Reference the EXO toolkit's maturity model.\n\n**Exercise 1 – Cadence & Rigor Audit (30 min):** Walk the last 12 months. How many experiments shipped? What share had pre-registered hypotheses, holdouts, and post-hoc reviews? Score the team across cadence, rigor, methodology, and learnings-flow.\n\n**Exercise 2 – Capability & Tooling (25 min):** Map the current tooling stack and the team capability against the maturity model. Identify the top three gaps – methodology, tooling, capability, governance.\n\n**Exercise 3 – 12-Month Plan (20 min):** Sequence the gaps into a 12-month plan with quarterly milestones. Identify which gap unlocks the others.\n\n**Wrap-up (5 min):** Capture the maturity score, the gaps, and the named EXO owner.",
    expectedOutputs: [
      "Maturity score across cadence, rigor, methodology, and learnings-flow",
      "Top three gaps with named structural fixes",
      "12-month plan with quarterly milestones",
      "Named EXO owner with reporting line",
    ],
    relatedOpportunityIds: [
      "exo_optimization_strategy",
      "experimentation_infrastructure",
      "ai_measurement_scorecard",
    ],
    triggerCapabilities: ["experimentation", "measurement_trust"],
    sortOrder: 5,
  },
  {
    id: "ai_trust_brand_safety_workshop",
    title: "AI Trust & Brand-Safety Workshop",
    description:
      "Define the AI-confidence and brand-safety framework that governs where AI can act in customer-facing surfaces and where humans stay in the loop.",
    durationMinutes: 90,
    category: "Trust & Measurement",
    requiredInputs: [
      "Inventory of AI-active surfaces today and planned",
      "Current AI incidents log (if any)",
      "Brand voice and content guidelines",
      "Compliance and legal contacts",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the trade-off. AI failures in customer-facing surfaces erode brand trust faster than they're caught. The trust framework is what makes scaling AI safely possible – not optional.\n\n**Exercise 1 – Surface-by-Surface Trust Tier (30 min):** For each AI-active surface, score the trust tier – what's the worst plausible AI failure, who'd notice, and how fast can it be contained? Tier them: full-auto, supervised, advisory-only.\n\n**Exercise 2 – Confidence & Trigger Design (30 min):** For each tier, define the confidence-scoring framework, trigger thresholds, and human-in-the-loop checkpoints. Reference the AI for CX deep-dive guidance on trigger logic.\n\n**Exercise 3 – Incident Response (15 min):** Define the incident-response playbook – who's paged, what's the rollback, who decides re-enable.\n\n**Wrap-up (5 min):** Capture the trust tiers, confidence framework, and incident playbook.",
    expectedOutputs: [
      "Trust tier per AI-active surface (full-auto / supervised / advisory)",
      "Confidence-scoring framework and trigger thresholds",
      "Human-in-the-loop checkpoints by tier",
      "Incident-response playbook",
    ],
    relatedOpportunityIds: [
      "ai_trust_brand_safety",
      "ai_measurement_scorecard",
    ],
    triggerCapabilities: ["measurement_trust", "agentic_experience"],
    sortOrder: 6,
  },
  {
    id: "identity_foundation_sprint",
    title: "Identity & Customer Data Foundation Sprint",
    description:
      "Map the unified identity, segmentation, and predictive layer every downstream AI use case depends on. Output is a foundation roadmap and the AI use cases unlocked at each stage.",
    durationMinutes: 90,
    category: "Identity & Data",
    requiredInputs: [
      "Inventory of customer-data sources and their freshness",
      "Current identity-resolution approach and coverage",
      "Existing segmentation and predictive model library",
      "Top three AI use cases stalled by data gaps",
    ],
    facilitationGuide:
      "**Setup (10 min):** Frame the gap – AI is only as good as the customer signal it has access to. Without unified identity, every AI use case operates with a partial view.\n\n**Exercise 1 – Use-Case-to-Data Map (25 min):** For each of the top three stalled AI use cases, identify the specific data, identity, or model gap blocking it.\n\n**Exercise 2 – Foundation Architecture (40 min):** Sketch the unified architecture – identity resolution, CDP layer, segmentation framework, model library, consent. Note what exists and what's missing.\n\n**Exercise 3 – Sequenced Roadmap (15 min):** Sequence the foundation in stages, each unlocking specific AI use cases. Sponsor commits to which stage funds first.\n\n**Wrap-up (5 min):** Capture the architecture and roadmap.",
    expectedOutputs: [
      "Use-case-to-data gap map",
      "Foundation architecture sketch",
      "Sequenced roadmap with AI use cases unlocked per stage",
      "Sponsor commitment on the first funded stage",
    ],
    relatedOpportunityIds: [
      "identity_data_foundation",
      "real_time_personalization_platform",
    ],
    triggerCapabilities: ["identity_data", "adaptive_personalization"],
    sortOrder: 7,
  },
];

// ══════════════════════════════════════════════════════════════════
// AICX_CLIENT_STORIES – anonymized proof points / pitch anchors
// ══════════════════════════════════════════════════════════════════

export const AICX_CLIENT_STORIES: AicxClientStory[] = [
  {
    id: "aeo_modernization_recovery",
    title: "AEO Modernization: From AI-Invisible to Cited Brand",
    tagline:
      "Schema, knowledge-graph, and authority content rebuilt brand citation across LLMs",
    capabilities: ["agentic_discoverability"],
    narrative:
      "A retail brand discovered through a Merkle audit that across the four leading LLMs the brand was named in less than 8% of category-relevant queries – competitors led by 3–5×. Merkle ran a 16-week modernization: re-architected schema and structured data on 1,200 product and authority pages, deployed a knowledge-graph layer, and stood up an authority-content production model. By month six, the brand's citation share matched the category leader on top branded queries, and click-through from agent-generated answers became measurable in the EXO scorecard.",
    outcomes: [
      "LLM citation share grew from 8% to 41% on top branded queries",
      "Authority content production tripled on the same editorial team",
      "AEO/LLM monitoring became a standing measurement in the EXO scorecard",
      "Direct attributable revenue from AI-driven discovery surfaces stood up in measurement for the first time",
    ],
    industries: ["retail", "qsr", "travel_hospitality"],
    prompts: [
      "When did you last probe how AI agents represent your brand?",
      "Which authority content does your team feel proudest of, and is it structured for AI extraction?",
      "What competitor is winning AI-cited share that should be yours?",
    ],
  },
  {
    id: "conversational_commerce_launch",
    title: "Conversational Commerce on the PDP",
    tagline:
      "Embedded conversational AI on PDPs lifted assisted-conversion 18% in two quarters",
    capabilities: ["agentic_experience", "agentic_discoverability"],
    narrative:
      "A travel-and-hospitality client embedded a conversational AI surface on its top 12 destination pages. Merkle delivered the use-case design, hybrid retrieval architecture, brand-voice tuning, and the safety guardrails. The AI answered destination, fit, and itinerary questions, handed off to booking when intent firmed, and routed brand-sensitive questions to humans. Inside two quarters, assisted conversion lifted 18%, average session value rose 11%, and the conversational surface became the second-highest source of attributed revenue on those pages.",
    outcomes: [
      "Assisted conversion +18% on the conversational PDPs",
      "Average session value +11% on the same surfaces",
      "Brand-voice tuning measured and held inside ±5% drift via the trust framework",
      "Conversational surface ranked #2 attributed revenue source on those pages",
    ],
    industries: ["travel_hospitality", "retail"],
    prompts: [
      "Which surfaces in your experience would benefit most from a conversational AI?",
      "What's the worst-plausible AI failure on those surfaces, and how would you contain it?",
      "Where does brand-voice drift become unacceptable, and how would you measure it?",
    ],
  },
  {
    id: "adaptive_retention_journey",
    title: "Adaptive Retention with Real-Time Decisioning",
    tagline:
      "AI-driven retention journey lifted active-account retention 6 points in one year",
    capabilities: ["adaptive_personalization", "identity_data"],
    narrative:
      "A financial-services client's retention program ran on rules and quarterly batch – high-value account churn was rising and the team had no real-time signal. Merkle redesigned the retention journey around real-time AI decisioning: feature store for engagement and account health, churn-propensity model, NBA model, and a decisioning loop that fired the right outreach in the right channel within minutes. Holdout discipline attributed every lift cleanly. After 12 months: active-account retention +6 points, intervention efficiency +35%, and the operating model became the template for cross-sell.",
    outcomes: [
      "Active-account retention +6 points across the segment",
      "Intervention efficiency (saves per outreach) +35%",
      "Holdout-attributed measurement framework adopted as the new standard",
      "Operating model templated and reused for cross-sell journey",
    ],
    industries: ["financial_services", "technology_saas"],
    prompts: [
      "Which journey is currently running on rules that should be running on models?",
      "Where would real-time decisioning create the highest-leverage business shift?",
      "How is your current retention program attributing lift – holdout or fingers-crossed?",
    ],
  },
  {
    id: "exo_program_at_scale",
    title: "EXO Program at Scale",
    tagline:
      "Multi-arm bandit and factorial design across 6 teams unlocked $42M in attributable lift",
    capabilities: ["experimentation", "measurement_trust"],
    narrative:
      "A QSR brand had AB tests in three teams but no consistent rigor – confidence-low experiments shipped, holdouts were inconsistent. Merkle stood up the EXO program: shared methodology playbooks, a multi-arm bandit and factorial framework, weekly experiment review, and a quarterly value-realization scorecard. Across six teams in 12 months, 240 experiments shipped, 38% with holdouts, and the program attributed $42M in lift directly to AI-driven personalization, content, and offer changes.",
    outcomes: [
      "240 experiments shipped across six teams in 12 months",
      "$42M attributable lift to AI-driven personalization and offer changes",
      "Holdout discipline lifted from 6% of tests to 38%",
      "Quarterly value-realization scorecard became the AI-budget anchor",
    ],
    industries: ["qsr", "retail"],
    prompts: [
      "What share of your AI investment today is validated through real holdouts?",
      "Which team has the most rigorous experimentation muscle, and what's stopping the rest?",
      "When did your CFO last see a quarterly AI-attribution scorecard?",
    ],
  },
  {
    id: "identity_foundation_unlocks_ai",
    title: "Identity Foundation Unlocks Stuck AI Use Cases",
    tagline:
      "Unified identity and signal layer unlocked three stalled AI use cases inside 90 days",
    capabilities: ["identity_data", "adaptive_personalization"],
    narrative:
      "A retail client had invested in personalization tooling and an AI roadmap – but every AI use case stalled because the customer record was fragmented across CRM, ecommerce, app, and loyalty. Merkle deployed a CDP, integrated identity-resolution, instrumented signal pipelines, and stood up the consent and segmentation framework. With the foundation in place, three stalled AI use cases (NBA on web, anonymous-shopper personalization, app re-engagement) shipped within 90 days of foundation go-live.",
    outcomes: [
      "Single source of truth across CRM, ecommerce, app, and loyalty",
      "Identity-resolution coverage on 78% of high-value customers",
      "Three stalled AI use cases shipped within 90 days of foundation go-live",
      "Quarterly value-realization scorecard governs all downstream AI investment",
    ],
    industries: ["retail", "travel_hospitality"],
    prompts: [
      "How many systems hold a 'customer record' today, and which one is canonical?",
      "Which AI use case has been stuck longest, and what data gap is the real blocker?",
      "Who owns customer-data quality at the enterprise level, and what's their KPI?",
    ],
  },
  {
    id: "ai_service_agent_deflection",
    title: "AI Service Agents That Earn Their Keep",
    tagline:
      "Multi-agent service flow deflected 42% of routine cases with measurable CSAT lift",
    capabilities: ["agentic_experience", "measurement_trust"],
    narrative:
      "A technology-SaaS client's support center handled 60% of cases on Tier-1 patterns that didn't need a human – but the existing chatbot frustrated more than it deflected. Merkle redesigned the service flow as a multi-agent orchestration: triage agent, knowledge-retrieval agent, resolution agent, supervisor and human-in-the-loop. Confidence-scored handoffs, brand-voice guardrails, and a CSAT measurement framework. Inside one year: 42% of routine cases deflected with no CSAT regression, average resolution time on the deflected cases dropped 73%, and human team capacity redirected to high-touch accounts.",
    outcomes: [
      "42% of routine cases deflected through the AI service flow",
      "73% reduction in resolution time on deflected cases",
      "No CSAT regression – measured monthly with confidence intervals",
      "Human team capacity redirected to high-touch accounts",
    ],
    industries: ["technology_saas", "financial_services"],
    prompts: [
      "What share of your case volume is on a small set of repeatable patterns?",
      "Where would an AI agent get measured – what KPI proves it's working?",
      "What guardrails would your CISO need to feel comfortable letting AI act in service?",
    ],
  },
];

import type {
  B2bQuestion,
  B2bIndustryQuestion,
  B2bCapability,
  B2bIndustry,
} from "@/lib/b2b/types";

/**
 * Resolves a question's display text given the assessment's industry.
 * Mirrors lib/data/questions.ts:resolveQuestionText — see notes there.
 */
export function resolveB2bQuestionText(
  q: Pick<B2bQuestion, "text" | "byIndustry">,
  industry: B2bIndustry | null | undefined
): string {
  if (industry && q.byIndustry?.[industry]) {
    return q.byIndustry[industry] as string;
  }
  return q.text;
}

// ── B2B Transformation Diagnostic — Questions ───────────────────────
// Sourced from the Merkle 2025 B2B Transformation GTM narrative,
// Account-Based Marketing / Selling / Service & Advocacy offering
// toolkits (v1.0, November 2025), and the AMER Summit working session
// (March 2026). Six capabilities × six questions = 36 core questions,
// ground-truthed against the Account-Based Everything operating model.
//
// Each question reads as a "To what extent…" prompt and maps to the
// 5-point maturity scale. Tooltips anchor each question against the
// Stage 4 ("Adaptive Engine") descriptor so respondents calibrate
// against the same end-state.

export const B2B_CAPABILITY_LABELS: Record<B2bCapability, string> = {
  vision_strategy: "Vision & Operating Model",
  abm: "Account-Based Marketing",
  abs: "Account-Based Selling",
  service_advocacy: "Account-Based Service & Advocacy",
  operations_commerce: "Account-Based Operations & Commerce",
  tech_data_intelligence: "Tech, Data & Intelligence",
};

export const B2B_CAPABILITY_SUBTITLES: Record<B2bCapability, string> = {
  vision_strategy: "Strategic Foundation",
  abm: "Demand Engine",
  abs: "Revenue Engine",
  service_advocacy: "Retention Engine",
  operations_commerce: "Fulfillment Engine",
  tech_data_intelligence: "Foundation Layer",
};

export const B2B_CAPABILITY_DESCRIPTIONS: Record<B2bCapability, string> = {
  vision_strategy:
    "Assess the extent to which a North Star digital vision, agile operating model, account-aligned KPIs, and customer-led prioritisation are embedded across the business.",
  abm:
    "Assess the extent to which the demand engine identifies and prioritises high-value accounts, identifies buying groups, orchestrates personalised journeys, and measures account-level engagement and pipeline impact.",
  abs:
    "Assess the extent to which the sales engine converts prioritised accounts — through AI-powered lead qualification, sales velocity, modern CPQ/contracting, and AI-augmented seller workflows.",
  service_advocacy:
    "Assess the extent to which post-sale service operations turn customer interactions into retention, expansion, and advocacy — with proactive churn signals, AI-led service, and a service-to-revenue motion.",
  operations_commerce:
    "Assess the extent to which order orchestration, B2B commerce, billing, supply chain, and self-service / marketplace experiences run as a unified, AI-orchestrated revenue platform.",
  tech_data_intelligence:
    "Assess the extent to which a unified customer data foundation, identity graph, modern revenue platform, and AI / agentic capability give every team account intelligence in real time.",
};

export const B2B_CAPABILITY_SCOPE_HINTS: Record<B2bCapability, string> = {
  vision_strategy:
    "These questions assess enterprise vision, operating model, and KPI alignment. Input from CEO/COO, transformation lead, or strategy team may be helpful.",
  abm:
    "These questions assess marketing and demand-generation operations. Input from CMO, marketing operations, ABM, and demand-gen leadership may be helpful.",
  abs:
    "These questions assess sales and revenue operations. Input from CRO/VP Sales, sales operations, sales enablement, and revenue ops may be helpful.",
  service_advocacy:
    "These questions assess service, customer success, and advocacy. Input from COO, customer success, field service, and account management may be helpful.",
  operations_commerce:
    "These questions assess B2B commerce, OMS, supply chain, and self-service. Input from commerce ops, supply chain, fulfillment, and IT may be helpful.",
  tech_data_intelligence:
    "These questions assess CRM/CDP/MDM, data governance, identity, and AI capability. Input from CDO/CIO, data architecture, and AI enablement may be helpful.",
};

export const B2B_SCORE_LABELS: Record<number, string> = {
  1: "Not in Place",
  2: "Emerging",
  3: "Operational",
  4: "Integrated",
  5: "Optimized",
};

export const B2B_SCORE_DESCRIPTIONS: Record<number, string> = {
  1: "Capability does not exist or is fragmented with no formal account view.",
  2: "Pilots or isolated efforts exist but are not consistently applied across functions or accounts.",
  3: "Capability is operational and used by core teams, but not orchestrated end-to-end across the account journey.",
  4: "Capability runs across marketing, selling, service, and operations with shared governance, KPIs, and account playbooks.",
  5: "Capability is AI-augmented, account-orchestrated, and continuously optimized — agentic workflows act on signals in real time.",
};

// ── 36 Core Questions (6 per capability) ────────────────────────────
export const B2B_CORE_QUESTIONS: B2bQuestion[] = [
  // ── Vision & Operating Model (6) ────────────────────────────────
  {
    id: 1,
    text: "To what extent does the organization have a defined North Star vision for the customer experience that crosses sales, marketing, service, and operations — rather than function-specific roadmaps?",
    capability: "vision_strategy",
    tooltip:
      "Optimized: a published cross-functional North Star drives investment, KPIs, and quarterly priorities across every account-facing team.",
  },
  {
    id: 2,
    text: "To what extent are KPIs aligned across marketing, sales, service, and operations around shared account success — rather than function-specific metrics?",
    capability: "vision_strategy",
    tooltip:
      "Optimized: every account-facing function shares a common scorecard around account health, expansion, and lifetime value.",
  },
  {
    id: 3,
    text: "To what extent does the organization operate in cross-functional, account-aligned squads — rather than functional silos and hand-offs?",
    capability: "vision_strategy",
    tooltip:
      "Optimized: cross-functional account squads with single-threaded leaders own outcomes for tier-1 accounts end-to-end.",
  },
  {
    id: 4,
    text: "To what extent are transformation initiatives prioritized through a structured, value-led process — rather than the loudest voice or most recent vendor pitch?",
    capability: "vision_strategy",
    tooltip:
      "Optimized: a value/feasibility-scored portfolio governs transformation investment with measurable outcome targets and quarterly stage gates.",
  },
  {
    id: 5,
    text: "To what extent is the organization's operating model agile and outcome-led — funded by value streams rather than rigid annual project plans?",
    capability: "vision_strategy",
    tooltip:
      "Optimized: persistent product/value-stream teams own outcomes; funding flows to value, not projects, with quarterly OKRs.",
  },
  {
    id: 6,
    text: "To what extent is leadership equipped to drive change while delivering business as usual — with a clear change-management capability and adoption mindset?",
    capability: "vision_strategy",
    tooltip:
      "Optimized: change capability is institutional — leaders are trained, adoption is measured, and BAU and transformation run side-by-side without trade-off.",
  },

  // ── Account-Based Marketing (6) ──────────────────────────────────
  {
    id: 7,
    text: "To what extent does marketing prioritize a defined set of high-value target accounts — rather than firmographic segments or broad personas?",
    capability: "abm",
    tooltip:
      "Optimized: a tiered ICP and target account list (TAL) is shared across marketing and sales and refreshed continuously from intent + fit signals.",
  },
  {
    id: 8,
    text: "To what extent are buying groups (multiple stakeholders per account) identified and engaged — rather than marketing solely to individual leads?",
    capability: "abm",
    tooltip:
      "Optimized: buying-group identification is automated; nurture orchestrates across all members of an account by role and stage.",
  },
  {
    id: 9,
    text: "To what extent are account journeys orchestrated across paid, owned, earned, and sales touch — rather than channel-by-channel campaigns?",
    capability: "abm",
    tooltip:
      "Optimized: an orchestration layer sequences plays across channels by account stage and intent, with sales triggers tied to engagement signals.",
  },
  {
    id: 10,
    text: "To what extent is content tailored to specific buying-group roles, account context, and stage — rather than generic value propositions?",
    capability: "abm",
    tooltip:
      "Optimized: modular, role- and stage-aware content assembles dynamically per account; AI generates variants within brand and legal guardrails.",
  },
  {
    id: 11,
    text: "To what extent is marketing measurement organized around account engagement, pipeline acceleration, and deal velocity — rather than lead volume or cost per lead?",
    capability: "abm",
    tooltip:
      "Optimized: account-level engagement, sales velocity, and deal influence are the primary scorecard; lead-volume KPIs are deprecated.",
  },
  {
    id: 12,
    text: "To what extent is marketing accountable for revenue outcomes alongside sales — rather than positioned as a lead supplier?",
    capability: "abm",
    tooltip:
      "Optimized: marketing and sales share revenue targets, joint account plans, and weekly account reviews.",
  },

  // ── Account-Based Selling (6) ────────────────────────────────────
  {
    id: 13,
    text: "To what extent are leads qualified and routed using AI-driven scoring tied to account fit, intent, and buying-group readiness — rather than form-fill triggers?",
    capability: "abs",
    tooltip:
      "Optimized: AI lead scoring pulls firmographic, intent, and engagement signals to deliver only buying-group-ready leads to sellers.",
  },
  {
    id: 14,
    text: "To what extent are sellers equipped with account-level intelligence — buying-group map, prior interactions, intent signals, whitespace — at every step?",
    capability: "abs",
    tooltip:
      "Optimized: every seller dashboard surfaces a live account graph, next-best-action, and AI-generated talking points pulled from CRM/Data Cloud.",
  },
  {
    id: 15,
    text: "To what extent is the quote-to-cash (or proposal-to-contract) motion modernised with AI-powered configuration, pricing, and contracting — rather than manual quoting, legacy CPQ, or freehand proposal documents?",
    capability: "abs",
    tooltip:
      "Optimized: a unified revenue platform runs CPQ + billing for product-led businesses, or AI-assisted proposal / SOW / engagement contracting for services-led businesses, with shared pricing and approval governance.",
    byIndustry: {
      technology_saas:
        "To what extent is the quote-to-cash motion modernised with AI-powered CPQ, subscription billing, and contracting — rather than manual quoting and legacy CPQ?",
      manufacturing:
        "To what extent is the quote-to-cash motion modernised with AI-powered CPQ, configurable product pricing, and contracting — rather than manual quoting, ERP-tethered pricing, or legacy CPQ?",
      industrial_b2b:
        "To what extent is the quote-to-cash motion modernised with AI-powered CPQ, configurable bundles, and service-contract management — rather than manual quoting and legacy CPQ?",
      financial_services:
        "To what extent are pricing, fee schedules, and client agreements modernised with AI-powered configuration and CLM — rather than spreadsheets, freehand drafting, and disconnected approval flows?",
      healthcare_lifesciences:
        "To what extent is the quoting and contracting motion modernised with AI-powered CPQ + CLM (for product / device deals) or proposal-to-contract automation (for services and partnerships) — rather than manual quoting and disconnected legal handoffs?",
      professional_services:
        "To what extent is the proposal-to-contract motion modernised with AI-assisted proposal and SOW generation, structured pricing, and contracting — rather than freehand decks, manual rate cards, and disconnected approval flows?",
    },
  },
  {
    id: 16,
    text: "To what extent are deal review and forecasting driven by structured signals (engagement, qualification fields such as MEDDIC / MEDDPICC / BANT, AI risk scoring) — rather than rep gut?",
    capability: "abs",
    tooltip:
      "Optimized: deal hygiene is enforced through whichever B2B qualification framework fits the practice (MEDDIC, MEDDPICC, BANT, Miller-Heiman, etc.); AI surfaces deal risk, slippage prediction, and recommended interventions to managers in real time.",
  },
  {
    id: 17,
    text: "To what extent has sales velocity (lead-to-close cycle time, conversion rates) been measurably improved through AI and automation — rather than benchmarked against historical averages?",
    capability: "abs",
    tooltip:
      "Optimized: sales cycle compression of 25%+ is measured year over year; automation removes manual touches at every stage of the funnel.",
  },
  {
    id: 18,
    text: "To what extent is AI used to draft seller communications, follow-ups, and proposals — within brand, legal, and pricing guardrails?",
    capability: "abs",
    tooltip:
      "Optimized: AI agents draft outreach, summarize calls, and produce proposal sections; sellers edit and send rather than write from scratch.",
  },

  // ── Account-Based Service & Advocacy (6) ─────────────────────────
  {
    id: 19,
    text: "To what extent does the post-sale service motion proactively detect risk and expansion signals — rather than wait for tickets or QBRs?",
    capability: "service_advocacy",
    tooltip:
      "Optimized: a customer-health scoring model fires churn-risk and expansion alerts to CSMs, AMs, and sellers automatically.",
  },
  {
    id: 20,
    text: "To what extent are service interactions a revenue motion — explicitly designed to surface upsell, cross-sell, and renewal opportunities at point of contact?",
    capability: "service_advocacy",
    tooltip:
      "Optimized: every service touchpoint runs an offer-eligibility check; service agents (human + AI) execute upsell and renewal plays in-flow.",
  },
  {
    id: 21,
    text: "To what extent are AI service agents (chat, email, voice) deployed against high-volume / low-complexity work — and orchestrated alongside humans for high-value cases?",
    capability: "service_advocacy",
    tooltip:
      "Optimized: AI agents handle Tier 1 deflection at 50%+, escalate cleanly with full context, and human agents are reserved for relationship and revenue work.",
  },
  {
    id: 22,
    text: "To what extent are renewals, contract extensions, or re-purchase cycles managed proactively with structured plays, multi-quarter coverage, and risk scoring — rather than scrambled as the renewal / extension / next-engagement window approaches?",
    capability: "service_advocacy",
    tooltip:
      "Optimized: renewals (SaaS), contract extensions (manufacturing / industrial / services), and re-purchase cycles are scoped 12+ months out, scored for risk, multi-threaded across the buying group, and supported by AI-generated value summaries.",
    byIndustry: {
      technology_saas:
        "To what extent are subscription renewals managed proactively with structured plays, multi-quarter coverage, and renewal-risk scoring — rather than scrambled as the contract date approaches?",
      manufacturing:
        "To what extent are service contracts, parts agreements, and equipment re-purchase cycles managed proactively with structured plays, multi-quarter coverage, and risk scoring — rather than reactive at expiration?",
      industrial_b2b:
        "To what extent are service contracts, consumables agreements, and equipment re-purchase cycles managed proactively with structured plays, multi-quarter coverage, and risk scoring?",
      financial_services:
        "To what extent are mandate renewals, fee-schedule reviews, and contract extensions managed proactively with structured plays, multi-quarter coverage, and risk scoring — rather than reactive at the relationship review?",
      healthcare_lifesciences:
        "To what extent are contract renewals (device service, formulary, license) managed proactively with structured plays, multi-quarter coverage, and risk scoring?",
      professional_services:
        "To what extent are engagement re-engagement, retainer renewals, and follow-on opportunities managed proactively with structured plays and multi-quarter coverage — rather than scrambled as the current engagement closes?",
    },
  },
  {
    id: 23,
    text: "To what extent are advocacy programs (references, case studies, community, NPS-driven outreach) systematic — rather than ad hoc when a deal needs it?",
    capability: "service_advocacy",
    tooltip:
      "Optimized: advocates are nominated, scored, and engaged through a structured program with measurable contribution to pipeline and retention.",
  },
  {
    id: 24,
    text: "To what extent are in-person customer touchpoints — field service, on-site delivery, customer success engagements, or professional services work — connected back to the account record and feeding signals into expansion, retention, and product / service roadmaps?",
    capability: "service_advocacy",
    tooltip:
      "Optimized: field service work orders, on-site delivery notes, customer success activity, and professional services engagement data feed the account record live; product, sales, and service share the same view (whether the work is physical, digital, or advisory).",
    byIndustry: {
      technology_saas:
        "To what extent are customer success engagements (QBRs, deployments, training, support touchpoints) connected back to the account record and feeding signals into expansion, retention, and product roadmaps?",
      manufacturing:
        "To what extent are field service operations (work orders, on-site visits, parts usage, customer feedback) connected back to the account record and feeding signals into expansion, retention, and product roadmaps?",
      industrial_b2b:
        "To what extent are field service and on-site service operations (work orders, parts usage, equipment health, customer feedback) connected back to the account record and feeding signals into expansion, retention, and product roadmaps?",
      financial_services:
        "To what extent are advisor / relationship-manager touchpoints, branch interactions, and on-site client engagements connected back to the account record and feeding signals into expansion, retention, and service roadmaps?",
      healthcare_lifesciences:
        "To what extent are field-based touchpoints (MSL visits, device service, in-clinic training, conference engagements) connected back to the account record and feeding signals into evidence, expansion, and product / service roadmaps?",
      professional_services:
        "To what extent is professional-services delivery work — engagement progress, on-site presence, deliverable feedback — connected back to the account record and feeding signals into expansion and account-development plans?",
    },
  },

  // ── Account-Based Operations & Commerce (6) ──────────────────────
  {
    id: 25,
    text: "To what extent is the order-to-fulfillment process — OMS, inventory, shipping, and billing for goods, or engagement / project / service-fulfillment systems for services — orchestrated end-to-end rather than handled by disconnected systems and manual handoffs?",
    capability: "operations_commerce",
    tooltip:
      "Optimized: an AI-orchestrated platform routes orders or engagements across channels, optimises fulfillment (inventory and shipping for goods; staffing, scheduling, and delivery milestones for services), and gives customers real-time visibility into status.",
    byIndustry: {
      technology_saas:
        "To what extent is the order-to-cash and provisioning process — subscription order management, entitlements, provisioning, and billing — orchestrated end-to-end rather than handled by disconnected systems and manual handoffs?",
      manufacturing:
        "To what extent is the order-to-fulfillment process (OMS, inventory, shipping, billing) orchestrated end-to-end rather than handled by disconnected systems and manual handoffs?",
      industrial_b2b:
        "To what extent is the order-to-fulfillment process (OMS, inventory, parts, shipping, billing) orchestrated end-to-end rather than handled by disconnected systems and manual handoffs?",
      financial_services:
        "To what extent is the client onboarding and servicing process (KYC, account opening, agreement execution, fee setup, statements) orchestrated end-to-end rather than handled by disconnected systems and manual handoffs?",
      healthcare_lifesciences:
        "To what extent are order, contract, and fulfillment processes (device or product OMS, sample management, formulary execution, service contracting, billing) orchestrated end-to-end rather than handled by disconnected systems?",
      professional_services:
        "To what extent are engagement-fulfillment processes (resource staffing, project setup, time/expense, milestone billing) orchestrated end-to-end rather than handled by disconnected systems and manual handoffs?",
    },
  },
  {
    id: 26,
    text: "To what extent do customers have a true self-service experience — account-pricing, configurations, repeat ordering, or marketplace for product-led businesses; account portal, status visibility, or partner self-service for services-led businesses — rather than every routine transaction needing a rep?",
    capability: "operations_commerce",
    tooltip:
      "Optimized: routine transactions and information requests run through self-service (commerce / marketplace for goods; account portal, KYC-style flows, statement / engagement self-service for services); reps focus on consultative, complex, or strategic conversations.",
    byIndustry: {
      technology_saas:
        "To what extent do customers have a true self-service experience — license management, seat provisioning, plan changes, usage visibility — rather than every routine transaction needing a rep?",
      manufacturing:
        "To what extent does B2B commerce offer customers a true self-service experience — account-pricing, configurations, repeat ordering, marketplace, dealer portals — rather than rep-mediated transactions?",
      industrial_b2b:
        "To what extent does B2B commerce offer customers a true self-service experience — account-pricing, parts catalog, repeat ordering, configurations, channel-partner portal — rather than rep-mediated transactions?",
      financial_services:
        "To what extent do clients have a true self-service experience — account access, document execution, statement and reporting access, status visibility — rather than every request needing a relationship manager?",
      healthcare_lifesciences:
        "To what extent do customers have a true self-service experience appropriate to the channel — provider portals, device-management portals, sample-request flows, partner self-service — rather than every routine interaction needing a rep?",
      professional_services:
        "To what extent do clients and partners have a true self-service experience — engagement-status portal, deliverable access, billing visibility, partner self-service — rather than every status check or document request needing a partner / engagement lead?",
    },
  },
  {
    id: 27,
    text: "To what extent are recurring revenue, subscription, and consumption-based models supported natively — rather than retrofitted onto a transaction-based platform?",
    capability: "operations_commerce",
    tooltip:
      "Optimized: subscriptions, usage billing, and renewals run natively; pricing, billing, and revenue recognition are unified.",
  },
  {
    id: 28,
    text: "To what extent is real-time delivery / status visibility shared with customers — for goods this is shipment tracking, exception alerts, and inventory / lead-time accuracy; for services it is engagement / project status, milestone progress, and proactive issue alerts?",
    capability: "operations_commerce",
    tooltip:
      "Optimized: customers see live status — order / shipment / inventory for goods, or project / engagement / milestone / case status for services — plus proactive exception or risk alerts through a connected portal and APIs.",
    byIndustry: {
      technology_saas:
        "To what extent is real-time status visibility shared with customers — provisioning state, deployment progress, system health, support-case status, usage and entitlement reporting — through a connected portal and APIs?",
      manufacturing:
        "To what extent is supply chain visibility shared with customers — proactive shipment and exception alerts, real-time inventory, lead-time accuracy?",
      industrial_b2b:
        "To what extent is supply chain visibility shared with customers — proactive shipment and exception alerts, real-time inventory, parts availability, lead-time accuracy — through a connected portal and APIs?",
      financial_services:
        "To what extent is real-time status visibility shared with clients — onboarding stage, document execution, fund status, statement availability, request progress — through a connected portal?",
      healthcare_lifesciences:
        "To what extent is real-time order, sample, and service-status visibility shared with customers — shipment tracking and inventory for goods, case / engagement / evidence status for services — through a connected portal and APIs?",
      professional_services:
        "To what extent is engagement status visibility shared with clients — milestone progress, deliverable status, risk / exception alerts, billing visibility — through a connected portal?",
    },
  },
  {
    id: 29,
    text: "To what extent are operational metrics (cost-to-serve, fulfillment cycle, deflection rate, task completion) tracked and tied to account-level economics — rather than aggregated cost lines?",
    capability: "operations_commerce",
    tooltip:
      "Optimized: cost-to-serve and profitability are measured per account; tier-1 accounts are reviewed monthly for service economics, not just revenue.",
  },
  {
    id: 30,
    text: "To what extent is process orchestration (cross-system workflows, approvals, exception handling) automated through a modern orchestration layer — rather than email, tickets, and tribal knowledge?",
    capability: "operations_commerce",
    tooltip:
      "Optimized: a process orchestration platform (e.g. Regrello + Agentforce) runs critical revenue workflows with full auditability and AI-assisted exception handling.",
  },

  // ── Tech, Data & Intelligence (6) ────────────────────────────────
  {
    id: 31,
    text: "To what extent is there a single, unified customer data foundation that resolves account, buying-group, and individual identity across systems — rather than per-system records?",
    capability: "tech_data_intelligence",
    tooltip:
      "Optimized: a Data Cloud (or equivalent) with an identity graph (e.g. Merkury) is the system of record across marketing, sales, service, and commerce.",
  },
  {
    id: 32,
    text: "To what extent has the legacy CRM/CPQ/billing landscape been modernized onto a connected revenue platform — rather than maintained as point-to-point integrations?",
    capability: "tech_data_intelligence",
    tooltip:
      "Optimized: the revenue stack runs on a unified platform (Sales + Service + Revenue + Commerce Clouds, or equivalent) with shared data and shared governance.",
  },
  {
    id: 33,
    text: "To what extent is the canonical sales-relevant data — product / service catalog, pricing, contract / SOW / proposal IP — clean, structured, and AI-ready, rather than scattered across spreadsheets, PDFs, partner laptops, and tribal knowledge?",
    capability: "tech_data_intelligence",
    tooltip:
      "Optimized: structured systems of record hold canonical pricing and contract data — PIM + CPQ + CLM for product-led businesses, service catalog + proposal IP repository + engagement IP for services-led businesses; AI agents read and write from these systems within governance.",
    byIndustry: {
      technology_saas:
        "To what extent is product, pricing, and contract data — PIM, CPQ, CLM, entitlements — clean, structured, and AI-ready, rather than scattered across spreadsheets, PDFs, and tribal knowledge?",
      manufacturing:
        "To what extent is product, pricing, and contract data — PIM, CPQ, CLM, configurator rules — clean, structured, and AI-ready, rather than scattered across spreadsheets, PDFs, and tribal knowledge?",
      industrial_b2b:
        "To what extent is product, pricing, and contract data — PIM, CPQ, CLM, parts catalog, service-contract definitions — clean, structured, and AI-ready, rather than scattered across spreadsheets, PDFs, and tribal knowledge?",
      financial_services:
        "To what extent are pricing schedules, fee structures, and client agreements — CPQ, CLM, pricing repositories — clean, structured, and AI-ready, rather than scattered across spreadsheets, PDFs, and tribal knowledge?",
      healthcare_lifesciences:
        "To what extent is product, pricing, contract, and evidence data — PIM, CPQ, CLM, MLR-approved content repositories — clean, structured, and AI-ready, rather than scattered across spreadsheets, PDFs, and tribal knowledge?",
      professional_services:
        "To what extent is the practice's IP — service catalog, rate cards, proposal and SOW templates, case-study and credential libraries — clean, structured, and AI-ready, rather than scattered across email, decks, and partner laptops?",
    },
  },
  {
    id: 34,
    text: "To what extent are AI agents and copilots embedded inside seller, marketer, service, and ops workflows — rather than standalone chat experiences?",
    capability: "tech_data_intelligence",
    tooltip:
      "Optimized: Agentforce-style agents (or equivalent) are first-class citizens in CRM, with explicit roles, guardrails, and KPIs measured per agent.",
  },
  {
    id: 35,
    text: "To what extent are data privacy, consent, and AI governance managed end-to-end — rather than retrofitted to each new use case?",
    capability: "tech_data_intelligence",
    tooltip:
      "Optimized: a single privacy + AI governance layer enforces consent, model access, and PII handling across every system; AI usage is auditable.",
  },
  {
    id: 36,
    text: "To what extent does the organization measure and continuously optimize the ROI of its tech and AI investments — rather than budgeting once and re-evaluating annually?",
    capability: "tech_data_intelligence",
    tooltip:
      "Optimized: every major platform and AI program has a value-realization scorecard reviewed quarterly; under-performing investments are sunset or reinvested.",
  },
];

export const B2B_CAPABILITIES_ORDER: B2bCapability[] = [
  "vision_strategy",
  "abm",
  "abs",
  "service_advocacy",
  "operations_commerce",
  "tech_data_intelligence",
];

export const B2B_QUESTIONS_BY_CAPABILITY: Record<B2bCapability, B2bQuestion[]> =
  B2B_CAPABILITIES_ORDER.reduce(
    (acc, cap) => {
      acc[cap] = B2B_CORE_QUESTIONS.filter((q) => q.capability === cap);
      return acc;
    },
    {} as Record<B2bCapability, B2bQuestion[]>
  );

export const B2B_INDUSTRY_LABELS: Record<B2bIndustry, string> = {
  technology_saas: "Technology / SaaS",
  manufacturing: "Manufacturing / Distribution",
  financial_services: "Financial Services",
  healthcare_lifesciences: "Healthcare / Life Sciences",
  industrial_b2b: "Industrial / B2B",
  professional_services: "Professional Services",
};

// Industry supplement — 3 questions per industry, mapped to the
// capability they most affect. These are advisory; the core 36 carry
// the primary scoring weight.
export const B2B_INDUSTRY_QUESTIONS: B2bIndustryQuestion[] = [
  // Technology / SaaS
  {
    id: "tech_1",
    text: "To what extent are product-led-growth signals (trial usage, free-tier engagement, feature adoption) integrated into account scoring and seller plays?",
    industry: "technology_saas",
    capability: "abm",
  },
  {
    id: "tech_2",
    text: "To what extent are customer success, renewals, and expansion treated as a coordinated revenue motion under a unified Net Revenue Retention scorecard?",
    industry: "technology_saas",
    capability: "service_advocacy",
  },
  {
    id: "tech_3",
    text: "To what extent are usage-based and consumption pricing models supported with the billing, metering, and rev-rec to back them?",
    industry: "technology_saas",
    capability: "operations_commerce",
  },

  // Manufacturing / Distribution
  {
    id: "mfg_1",
    text: "To what extent are distributors, dealers, and channel partners part of the account-based program — with shared visibility into demand, inventory, and pipeline?",
    industry: "manufacturing",
    capability: "abs",
  },
  {
    id: "mfg_2",
    text: "To what extent does the customer have real-time visibility into inventory, lead time, and order status across channels — direct, distributor, and marketplace?",
    industry: "manufacturing",
    capability: "operations_commerce",
  },
  {
    id: "mfg_3",
    text: "To what extent does field service and parts/aftermarket revenue feed back into product, sales, and account expansion plans?",
    industry: "manufacturing",
    capability: "service_advocacy",
  },

  // Financial Services
  {
    id: "fins_1",
    text: "To what extent is the buying group (treasurer, CFO, procurement, IT) identified, mapped, and engaged through coordinated account plays — rather than relationship-led one-to-one?",
    industry: "financial_services",
    capability: "abm",
  },
  {
    id: "fins_2",
    text: "To what extent are AI/agentic capabilities deployed inside regulatory and compliance guardrails — with auditable agent activity?",
    industry: "financial_services",
    capability: "tech_data_intelligence",
  },
  {
    id: "fins_3",
    text: "To what extent do client onboarding and ongoing servicing run on a connected platform — KYC, agreements, fee schedules, reporting — rather than fragmented operations?",
    industry: "financial_services",
    capability: "operations_commerce",
  },

  // Healthcare / Life Sciences
  {
    id: "hls_1",
    text: "To what extent are HCP, IDN, and payer relationships managed under a coordinated account model — rather than role-specific call plans?",
    industry: "healthcare_lifesciences",
    capability: "abs",
  },
  {
    id: "hls_2",
    text: "To what extent is content tailored to MLR/PRC review and regulatory constraints while still personalized at the account / specialty / role level?",
    industry: "healthcare_lifesciences",
    capability: "abm",
  },
  {
    id: "hls_3",
    text: "To what extent is post-launch evidence (real-world data, outcomes) connected back into account plans, value stories, and contracting?",
    industry: "healthcare_lifesciences",
    capability: "service_advocacy",
  },

  // Industrial / B2B
  {
    id: "ind_1",
    text: "To what extent are long, multi-stakeholder procurement cycles supported with structured account plans, MEDDIC discipline, and AI-assisted seller enablement?",
    industry: "industrial_b2b",
    capability: "abs",
  },
  {
    id: "ind_2",
    text: "To what extent are quote-to-cash, contract management, and billing connected into a single revenue platform — rather than ERP-tethered point systems?",
    industry: "industrial_b2b",
    capability: "tech_data_intelligence",
  },
  {
    id: "ind_3",
    text: "To what extent is recurring revenue (service contracts, parts, consumables) treated as a strategic motion alongside large equipment sales?",
    industry: "industrial_b2b",
    capability: "operations_commerce",
  },

  // Professional Services
  {
    id: "prosvc_1",
    text: "To what extent is account expansion (cross-practice, cross-geo) treated as a structured motion with named owners, plays, and quarterly targets?",
    industry: "professional_services",
    capability: "service_advocacy",
  },
  {
    id: "prosvc_2",
    text: "To what extent does practice and proposal IP live in a structured, AI-discoverable repository — rather than across email, decks, and partner laptops?",
    industry: "professional_services",
    capability: "tech_data_intelligence",
  },
  {
    id: "prosvc_3",
    text: "To what extent are sellers and partners equipped with AI-assisted proposal generation, pricing benchmarks, and competitive intelligence?",
    industry: "professional_services",
    capability: "abs",
  },
];

export const B2B_INDUSTRY_QUESTIONS_BY_INDUSTRY = (
  B2B_INDUSTRY_QUESTIONS.reduce(
    (acc, q) => {
      (acc[q.industry] ||= []).push(q);
      return acc;
    },
    {} as Record<B2bIndustry, B2bIndustryQuestion[]>
  )
);

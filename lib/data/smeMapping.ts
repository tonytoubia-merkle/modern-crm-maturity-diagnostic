import type { SmeMapping } from "@/lib/types";

export const SME_MAPPINGS: SmeMapping[] = [
  // Identity
  { opportunityId: "merkury_consumer_360", leadSmeRole: "Identity Architect", leadPractice: "Identity & Data", supportingRoles: ["Data Engineer", "CDP Specialist", "Cloud Architect"], supportingPractice: "Technology & Platforms", workshopRole: "R", notes: "Requires Merkury product team alignment for identity graph scoping" },
  { opportunityId: "identity_resolution", leadSmeRole: "Identity Architect", leadPractice: "Identity & Data", supportingRoles: ["Data Strategist", "Privacy & Compliance Lead"], supportingPractice: "Identity & Data", workshopRole: "R" },
  { opportunityId: "householding", leadSmeRole: "Identity Analyst", leadPractice: "Identity & Data", supportingRoles: ["CRM Strategist", "Audience Planner"], supportingPractice: "CRM Strategy", workshopRole: "C" },
  // Signals
  { opportunityId: "real_time_signals", leadSmeRole: "MarTech Architect", leadPractice: "Technology & Platforms", supportingRoles: ["CDP Specialist", "Data Engineer", "Tag Management Lead"], supportingPractice: "Identity & Data", workshopRole: "R", notes: "Technical discovery session — bring architecture diagrams" },
  { opportunityId: "lifecycle_triggers", leadSmeRole: "CRM Strategist", leadPractice: "CRM Strategy", supportingRoles: ["Email/SMS Specialist", "Journey Architect", "Marketing Automation Lead"], supportingPractice: "CRM Strategy", workshopRole: "R" },
  // Decisioning
  { opportunityId: "predictive_segmentation", leadSmeRole: "Data Scientist", leadPractice: "Analytics & Decisioning", supportingRoles: ["Audience Strategist", "ML Engineer", "CRM Analyst"], supportingPractice: "Analytics & Decisioning", workshopRole: "R" },
  { opportunityId: "nba_engine", leadSmeRole: "Decisioning Architect", leadPractice: "Analytics & Decisioning", supportingRoles: ["Data Scientist", "CRM Strategist", "Personalization Lead"], supportingPractice: "CRM Strategy", workshopRole: "R", notes: "May require pre-workshop alignment on offer catalog" },
  // Engagement
  { opportunityId: "human_loyalty", leadSmeRole: "Loyalty Strategist", leadPractice: "Loyalty", supportingRoles: ["Program Designer", "Loyalty Platform Lead", "CRM Strategist"], supportingPractice: "Loyalty", workshopRole: "R", notes: "Leverage Merkle proprietary loyalty benchmarks" },
  { opportunityId: "crm_messaging", leadSmeRole: "CRM Strategist", leadPractice: "CRM Strategy", supportingRoles: ["Email Deliverability Specialist", "Content Strategist", "Marketing Automation Lead"], supportingPractice: "CRM Strategy", workshopRole: "R" },
  { opportunityId: "journey_orchestration", leadSmeRole: "Journey Architect", leadPractice: "CRM Strategy", supportingRoles: ["CRM Strategist", "MarTech Architect", "UX Strategist"], supportingPractice: "Technology & Platforms", workshopRole: "R" },
  { opportunityId: "gamification", leadSmeRole: "Gamification Strategist", leadPractice: "Promotions & Gamification", supportingRoles: ["Motivational Science Lead", "UX Designer", "Loyalty Strategist"], supportingPractice: "Loyalty", workshopRole: "C", notes: "Merkle has dedicated gamification practice — 25 years experience" },
  { opportunityId: "experiential_promotions", leadSmeRole: "Promotions Strategist", leadPractice: "Promotions & Gamification", supportingRoles: ["Legal & Compliance Lead", "UX Designer", "CRM Strategist"], supportingPractice: "Promotions & Gamification", workshopRole: "C", notes: "Full-service capability including legal compliance across 44 countries" },
  // Media
  { opportunityId: "first_party_media", leadSmeRole: "Media Strategist", leadPractice: "Media", supportingRoles: ["Audience Planner", "Clean Room Specialist", "Identity Architect"], supportingPractice: "Identity & Data", workshopRole: "R" },
  { opportunityId: "owned_channel_growth", leadSmeRole: "Growth Marketing Lead", leadPractice: "Media", supportingRoles: ["CRM Strategist", "Loyalty Strategist", "Paid Media Analyst"], supportingPractice: "CRM Strategy", workshopRole: "C" },
  // Learning
  { opportunityId: "test_learn_framework", leadSmeRole: "Experimentation Lead", leadPractice: "Analytics & Decisioning", supportingRoles: ["Data Scientist", "CRM Analyst", "Marketing Ops Lead"], supportingPractice: "Analytics & Decisioning", workshopRole: "R" },
  { opportunityId: "incrementality_measurement", leadSmeRole: "Measurement Scientist", leadPractice: "Analytics & Decisioning", supportingRoles: ["Data Scientist", "Media Analyst", "CRM Analyst"], supportingPractice: "Analytics & Decisioning", workshopRole: "C" },
  { opportunityId: "crm_intelligence_loop", leadSmeRole: "CRM Analyst", leadPractice: "Analytics & Decisioning", supportingRoles: ["CRM Strategist", "Data Scientist", "Media Strategist"], supportingPractice: "CRM Strategy", workshopRole: "C" },
  // Innovation
  { opportunityId: "modern_crm_innovation_sprint", leadSmeRole: "Innovation Lead", leadPractice: "Innovation & AI", supportingRoles: ["CRM Strategist", "Data Scientist", "GenAI Engineer"], supportingPractice: "CRM Strategy", workshopRole: "R" },
  { opportunityId: "genai_personalization", leadSmeRole: "GenAI Engineer", leadPractice: "Innovation & AI", supportingRoles: ["Content Strategist", "CRM Strategist", "Data Scientist"], supportingPractice: "CRM Strategy", workshopRole: "R", notes: "Coordinate with dentsu AI practice leads" },
  { opportunityId: "agentic_crm_pilot", leadSmeRole: "AI Solutions Architect", leadPractice: "Innovation & AI", supportingRoles: ["GenAI Engineer", "Decisioning Architect", "CRM Strategist"], supportingPractice: "Analytics & Decisioning", workshopRole: "R", notes: "Frontier capability — frame as exploration" },
  { opportunityId: "crm_center_of_excellence", leadSmeRole: "CRM Strategy Director", leadPractice: "CRM Strategy", supportingRoles: ["Org Design Consultant", "Capability Lead", "Change Management Lead"], supportingPractice: "CRM Strategy", workshopRole: "A", notes: "Requires Director+ lead" },
];

export function getSmeForOpportunity(opportunityId: string): SmeMapping | undefined {
  return SME_MAPPINGS.find((m) => m.opportunityId === opportunityId);
}

export function getRequiredSmes(opportunityIds: string[]): SmeMapping[] {
  const ids = new Set(opportunityIds);
  return SME_MAPPINGS.filter((m) => ids.has(m.opportunityId) && (m.workshopRole === "R" || m.workshopRole === "A"));
}

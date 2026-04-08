export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  threshold: number;
  metric: "assessments" | "projects" | "opportunities" | "stakeholders";
  tier: "bronze" | "silver" | "gold" | "legendary";
  indyQuote: string;
}

export const BADGES: Badge[] = [
  // Assessment volume
  { id: "first_dig", name: "First Dig", description: "Complete your first assessment", emoji: "🏺", threshold: 1, metric: "assessments", tier: "bronze", indyQuote: "We're not going home empty-handed." },
  { id: "relic_hunter", name: "Relic Hunter", description: "Complete 5 assessments", emoji: "🗿", threshold: 5, metric: "assessments", tier: "silver", indyQuote: "Fortune and glory, kid. Fortune and glory." },
  { id: "temple_raider", name: "Temple Raider", description: "Complete 15 assessments", emoji: "🏛️", threshold: 15, metric: "assessments", tier: "gold", indyQuote: "It's not the years, honey. It's the mileage." },
  { id: "ark_finder", name: "Ark Finder", description: "Complete 30 assessments", emoji: "⚡", threshold: 30, metric: "assessments", tier: "legendary", indyQuote: "They're digging in the wrong place!" },

  // Project volume
  { id: "expedition_leader", name: "Expedition Leader", description: "Launch your first workshop project", emoji: "🧭", threshold: 1, metric: "projects", tier: "bronze", indyQuote: "I'm making this up as I go." },
  { id: "map_master", name: "Map Master", description: "Launch 3 workshop projects", emoji: "🗺️", threshold: 3, metric: "projects", tier: "silver", indyQuote: "X never marks the spot." },
  { id: "crusader", name: "The Crusader", description: "Launch 10 workshop projects", emoji: "🏆", threshold: 10, metric: "projects", tier: "gold", indyQuote: "The penitent man shall pass." },

  // Stakeholders engaged
  { id: "crew_builder", name: "Crew Builder", description: "Engage 10 stakeholders across projects", emoji: "👥", threshold: 10, metric: "stakeholders", tier: "bronze", indyQuote: "I don't know, I'm making this up as I go." },
  { id: "coalition", name: "Coalition of the Willing", description: "Engage 30 stakeholders", emoji: "🌍", threshold: 30, metric: "stakeholders", tier: "silver", indyQuote: "You want to talk to God? Let's go see him together." },
  { id: "army_of_allies", name: "Army of Allies", description: "Engage 100 stakeholders", emoji: "⚔️", threshold: 100, metric: "stakeholders", tier: "gold", indyQuote: "We have top men working on it right now." },

  // Opportunities generated
  { id: "treasure_spotter", name: "Treasure Spotter", description: "Generate 10 pipeline opportunities", emoji: "💎", threshold: 10, metric: "opportunities", tier: "bronze", indyQuote: "It belongs in a pipeline!" },
  { id: "golden_idol", name: "Golden Idol", description: "Generate 30 pipeline opportunities", emoji: "🪙", threshold: 30, metric: "opportunities", tier: "silver", indyQuote: "Throw me the idol, I'll throw you the whip!" },
  { id: "holy_grail", name: "Holy Grail", description: "Generate 100 pipeline opportunities", emoji: "🏆", threshold: 100, metric: "opportunities", tier: "gold", indyQuote: "You have chosen... wisely." },
  { id: "crystal_skull", name: "Crystal Skull", description: "Generate 250 pipeline opportunities", emoji: "💀", threshold: 250, metric: "opportunities", tier: "legendary", indyQuote: "Knowledge was their treasure." },
];

export const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  bronze: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  silver: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-300" },
  gold: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-300" },
  legendary: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-300" },
};

export interface UserStats {
  assessments: number;
  projects: number;
  stakeholders: number;
  opportunities: number;
}

export function getEarnedBadges(stats: UserStats): Badge[] {
  return BADGES.filter((b) => stats[b.metric] >= b.threshold);
}

export function getNextBadges(stats: UserStats): Badge[] {
  return BADGES.filter((b) => stats[b.metric] < b.threshold)
    .sort((a, b) => {
      const aProgress = stats[a.metric] / a.threshold;
      const bProgress = stats[b.metric] / b.threshold;
      return bProgress - aProgress; // closest to earning first
    })
    .slice(0, 3);
}

import { CrmShortFlow } from "@/components/crm/short/CrmShortFlow";

export const metadata = {
  title: "Modern CRM Executive Snapshot · Merkle",
  description:
    "A five-minute, executive-level read of your CRM maturity. Twelve questions across five dimensions, with a radar visualization, an organizational archetype, and the key opportunity areas where most value is trapped.",
};

export default function CrmShortPage() {
  return <CrmShortFlow />;
}

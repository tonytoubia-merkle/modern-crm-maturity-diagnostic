import { CrmExecFlow } from "@/components/crm/exec/CrmExecFlow";

export const metadata = {
  title: "Modern CRM Self-Assessment · Merkle",
  description:
    "Benchmark your CRM maturity in about 90 seconds — 8 questions across 5 dimensions. Kiosk-friendly variation of the full Modern CRM Diagnostic.",
};

export default function CrmExecPage() {
  return <CrmExecFlow />;
}

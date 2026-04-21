import { CscProjectDashboard } from "@/components/csc/project/CscProjectDashboard";

export const dynamic = "force-dynamic";

export default function CscProjectPage({
  params,
}: {
  params: { shareId: string };
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/merkle-logo.webp"
            alt="Merkle"
            className="h-4 w-auto brightness-0 invert"
          />
          <a
            href="/csc"
            className="text-xs text-white/70 hover:text-white transition-colors"
          >
            ← CSC Diagnostic
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <CscProjectDashboard projectShareId={params.shareId} />
      </div>
    </div>
  );
}

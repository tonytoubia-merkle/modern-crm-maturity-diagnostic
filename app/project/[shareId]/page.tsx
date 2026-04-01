import { ProjectDashboard } from "@/components/project/ProjectDashboard";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { shareId: string };
}

export default function ProjectPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Branded nav */}
      <div style={{ backgroundColor: "#00205B" }}>
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/merkle-logo.webp" alt="Merkle" className="h-4 w-auto brightness-0 invert" />
          <a href="/" className="text-xs text-white/70 hover:text-white transition-colors">
            ← Modern CRM Diagnostic
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <ProjectDashboard projectShareId={params.shareId} />
        </div>
      </div>
    </div>
  );
}

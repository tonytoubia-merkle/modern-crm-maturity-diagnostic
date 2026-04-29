import { B2bProjectDashboard } from "@/components/b2b/project/B2bProjectDashboard";

export const dynamic = "force-dynamic";

export default function B2bProjectPage({
  params,
}: {
  params: { shareId: string };
}) {
  return (
    <div className="min-h-screen font-merkle bg-merkle-grey-60">
      <div className="bg-merkle-secondary-600">
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
            ← B2B Transformation Assessment
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <B2bProjectDashboard projectShareId={params.shareId} />
      </div>
    </div>
  );
}

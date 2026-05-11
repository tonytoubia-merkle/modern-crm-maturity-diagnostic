import { M2Logo } from "@/components/brand/M2Logo";

export const metadata = {
  title: "About – Merkle Maturity Assessment",
  description:
    "Product overview, technical architecture, and security & legal guardrails.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen font-m2 bg-m2-surface-light">
      {/* Header */}
      <header className="bg-m2-navy">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <M2Logo tone="dark" height={44} />
          <div className="flex items-center gap-5">
            <a
              href="/"
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="/guide"
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Guide
            </a>
            <a
              href="/library"
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Library
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-m2-navy">
        <div className="max-w-4xl mx-auto px-6 pt-10 pb-12">
          <p className="text-sm font-medium text-m2-sky mb-2">About</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-3">
            Merkle Maturity Assessment
          </h1>
          <p className="text-sm text-white/70 leading-relaxed max-w-2xl">
            A Merkle-internal consulting workspace for diagnosing client CRM,
            Content Supply Chain, B2B Transformation, AI for CX, and AI for
            Enterprise maturity, generating opportunities, and running
            structured workshop engagements – from first conversation to
            Salesforce pipeline.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* ── Introduction ── */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            What this product is
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 text-sm text-slate-600 leading-relaxed">
            <p>
              The Merkle Maturity Assessment is a Merkle/Dentsu-internal suite
              of consulting diagnostics that share one workspace, one consultant
              experience, and one set of scoring, workshop, and export
              primitives. Each diagnostic in the suite assesses a different
              practice area on a common 1–5 scale, produces a maturity stage,
              a capability heatmap, prioritized transformation opportunities,
              Salesforce-ready pipeline records, and facilitator-ready workshop
              materials.
            </p>

            <div>
              <p className="font-semibold text-slate-900 mb-2">
                Diagnostics in the suite
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="border border-slate-200 rounded-lg p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-m2-blue mb-1">
                    Modern CRM Practice
                  </p>
                  <p className="font-semibold text-slate-900 mb-1.5">
                    Modern CRM Maturity
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Eight capabilities – Identity, Signals, Decisioning,
                    Engagement, Media Activation, Measurement, Operating Model,
                    and Learning &amp; Optimization.
                  </p>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-m2-blue mb-1">
                    Content Practice
                  </p>
                  <p className="font-semibold text-slate-900 mb-1.5">
                    Content Supply Chain
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Six capabilities – Strategy &amp; Planning, Workflow &amp;
                    Production, Asset Management &amp; Governance, Distribution
                    &amp; Activation, Measurement &amp; Insights, and
                    Intelligence &amp; Automation.
                  </p>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-m2-blue mb-1">
                    B2B Transformation Practice
                  </p>
                  <p className="font-semibold text-slate-900 mb-1.5">
                    B2B Transformation
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Six capabilities – Vision &amp; Operating Model,
                    Account-Based Marketing, Account-Based Selling,
                    Account-Based Service &amp; Advocacy, Account-Based
                    Operations &amp; Commerce, and Tech, Data &amp; Intelligence.
                  </p>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-m2-blue mb-1">
                    AI for CX Practice
                  </p>
                  <p className="font-semibold text-slate-900 mb-1.5">
                    AI for CX
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Six capabilities – Agentic Discoverability, Agentic
                    Experience, Adaptive Personalization, Testing &amp;
                    Experimentation, Identity &amp; Data, and Measurement
                    &amp; AI Trust.
                  </p>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-m2-blue mb-1">
                    AI for Enterprise Practice
                  </p>
                  <p className="font-semibold text-slate-900 mb-1.5">
                    AI for Enterprise
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Six capabilities – Data Foundations, Use Case Design, Work
                    Design, Intelligence Delivery, AI Assurance &amp; Trust,
                    and Adoption &amp; Governance.
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Each diagnostic owns its own questions, scoring model,
                opportunity catalog, and admin scope – but inherits the same
                shell, branding (M2 internal / Merkle artifact),
                survey/aggregation engine, conversational and PPTX/PDF exports.
                Additional diagnostics will be added to the suite over time.
              </p>
            </div>

            <div>
              <p className="font-semibold text-slate-900 mb-1.5">
                Who it&apos;s for
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <span className="font-medium text-slate-800">
                    Merkle/Dentsu strategists and consultants
                  </span>{" "}
                  running client discovery, pursuits, and transformation
                  roadmaps across CRM and Content engagements.
                </li>
                <li>
                  <span className="font-medium text-slate-800">
                    Merkle sellers
                  </span>{" "}
                  qualifying accounts and framing Salesforce opportunities for
                  either practice.
                </li>
                <li>
                  <span className="font-medium text-slate-800">
                    Client stakeholders
                  </span>{" "}
                  completing surveys through unique, scoped links (no login
                  required on their side).
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-slate-900 mb-1.5">Intended use</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Workshop projects with multi-stakeholder surveys, aggregation,
                  and facilitation guides – available for all five diagnostics
                  (Modern CRM, Content Supply Chain, B2B Transformation, AI
                  for CX, and AI for Enterprise).
                </li>
                <li>
                  Quick assessments – a single consultant or seller completing
                  a diagnostic solo for either practice.
                </li>
                <li>
                  Conversational assessments – voice- or chat-driven interviews
                  where an LLM infers scores from natural dialogue.
                </li>
              </ul>
              <p className="mt-2 text-xs text-slate-500">
                Not intended as a system of record for client PII, regulated
                data, or commitments. Outputs are advisory and require
                consultant review before sharing externally.
              </p>
            </div>
          </div>
        </section>

        {/* ── Technical Architecture ── */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Technical architecture
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 text-sm text-slate-600 leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ArchItem label="Framework" value="Next.js 14 (App Router) + TypeScript, React 18" />
              <ArchItem label="Hosting" value="Vercel (serverless functions, edge middleware)" />
              <ArchItem label="Database" value="Supabase Postgres with row-level security" />
              <ArchItem label="Auth" value="Supabase Auth (Merkle-email allowlist, SSR cookies)" />
              <ArchItem label="Styling" value="Tailwind CSS, Recharts for visualizations" />
              <ArchItem label="AI providers" value="Anthropic Claude, Google Gemini (chat + TTS)" />
              <ArchItem label="Exports" value="PPTX (pptxgenjs), browser PDF print, CSV" />
              <ArchItem label="Integrations" value="Miro boards, Salesforce opportunity templates" />
            </div>

            <div className="pt-2">
              <p className="font-semibold text-slate-900 mb-2">Request flow</p>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>
                  Edge <span className="font-mono text-xs">middleware.ts</span>{" "}
                  validates the Supabase session on every protected route and
                  redirects unauthenticated users to <code>/login</code>.
                </li>
                <li>
                  Server components and API routes under{" "}
                  <span className="font-mono text-xs">/app/api/*</span> execute
                  business logic and call Postgres with the service role key
                  only from the server side.
                </li>
                <li>
                  The shared scoring pipeline
                  (<span className="font-mono text-xs">lib/scoring.ts</span>)
                  computes capability scores, maturity stage, and triggered
                  opportunities – identical across manual, conversational, and
                  aggregated modes.
                </li>
                <li>
                  Results are persisted with a unique share ID and rendered
                  client-side; exports are generated on demand.
                </li>
                <li>
                  LLM calls for the conversational flow stream from server
                  routes; no client key exposure.
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* ── Security ── */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Security guardrails
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <GuardItem title="Authentication">
                All internal routes are gated by Supabase Auth in edge
                middleware. Only Merkle/Dentsu email domains may register, and
                sessions use HTTP-only cookies with SSR refresh.
              </GuardItem>
              <GuardItem title="Authorization & data scoping">
                Projects and assessments are scoped to the authenticated
                consultant&apos;s email. Stakeholder survey links and shareable
                results URLs use unguessable share IDs and never expose the
                authoring account.
              </GuardItem>
              <GuardItem title="Secret handling">
                The Supabase service role key, Anthropic key, and Gemini key
                live in Vercel environment variables and are only read from
                server routes. The browser receives the anon key only.
              </GuardItem>
              <GuardItem title="Database hardening">
                Postgres row-level security is enabled on all tables. API
                routes validate inputs and constrain writes to the calling
                user&apos;s projects.
              </GuardItem>
              <GuardItem title="Transport & storage">
                All traffic is HTTPS via Vercel. Data is stored in Supabase
                (AWS-hosted, encrypted at rest). No client files or uploads are
                accepted.
              </GuardItem>
              <GuardItem title="LLM safety">
                Conversational flows pass only assessment context (questions,
                anonymized responses) to providers. Chat transcripts are not
                used to retrain third-party models – Anthropic and Google
                enterprise terms apply.
              </GuardItem>
              <GuardItem title="Admin access">
                Admin is scoped per product on{" "}
                <span className="font-mono text-xs">app_users</span>.{" "}
                <span className="font-mono text-xs">role = &apos;super_admin&apos;</span>{" "}
                grants every admin surface;{" "}
                <span className="font-mono text-xs">admin_scopes</span> (any
                subset of{" "}
                <span className="font-mono text-xs">
                  {"{'crm', 'csc', 'b2b', 'aicx', 'aient'}"}
                </span>
                ) grants narrow access to just those diagnostics. A scoped
                admin cannot see or mutate data from diagnostics outside their
                scope set.
              </GuardItem>
            </ul>
          </div>
        </section>

        {/* ── Legal ── */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Legal guardrails
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <GuardItem title="Data minimization">
                Collect only what the diagnostic needs: client name, stakeholder
                role/email, scores, and free-text notes. Do not enter PII of
                end customers, credentials, financials, or regulated data
                (PHI, PCI, etc.).
              </GuardItem>
              <GuardItem title="Client consent">
                Before distributing stakeholder survey links, confirm the
                client is comfortable with responses being stored in
                Merkle-managed Supabase infrastructure and used internally for
                diagnostic scoring and opportunity shaping.
              </GuardItem>
              <GuardItem title="Confidentiality">
                Treat all client-provided content as confidential under the
                governing MSA or NDA. Do not share results, exports, or
                Salesforce narratives outside the engaged Merkle/Dentsu account
                team without written approval.
              </GuardItem>
              <GuardItem title="AI-assisted outputs">
                Narratives, opportunity copy, and scoring inferences generated
                by LLMs are drafts. A Merkle consultant must review and
                approve every client-facing output – the tool does not
                replace professional judgment or deliverable QA.
              </GuardItem>
              <GuardItem title="Retention & deletion">
                Assessments are retained for active engagements and ongoing
                account management. Clients may request deletion through their
                account lead; contact the admin owner to remove records.
              </GuardItem>
              <GuardItem title="Third-party terms">
                Usage is subject to the terms of Vercel, Supabase, Anthropic,
                and Google Cloud. Exported decks, CSVs, and Salesforce records
                inherit Merkle&apos;s standard client deliverable governance.
              </GuardItem>
              <GuardItem title="Ownership">
                The diagnostic framework, opportunity catalog, and workshop
                materials are Merkle/Dentsu intellectual property. Client
                inputs remain the client&apos;s property; derived scores and
                recommendations are jointly used under the engagement
                agreement.
              </GuardItem>
            </ul>
            <p className="text-xs text-slate-400 mt-4">
              Questions about appropriate use, data handling, or client consent
              – contact the relevant practice lead (Modern CRM or Content)
              before proceeding.
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/merkle-logo.webp"
              alt="Merkle"
              className="h-4 w-auto opacity-40"
            />
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Merkle – Internal Use Only
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Home
            </a>
            <a
              href="/guide"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Guide
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ArchItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
        {label}
      </p>
      <p className="text-sm text-slate-700">{value}</p>
    </div>
  );
}

function GuardItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span
        className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-m2-blue"
      />
      <div>
        <p className="font-semibold text-slate-900 mb-0.5">{title}</p>
        <p>{children}</p>
      </div>
    </li>
  );
}

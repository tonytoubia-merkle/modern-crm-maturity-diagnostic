# Modern CRM Maturity Diagnostic

A consulting-grade web application for assessing an organization's Modern CRM maturity across six capability dimensions. Built for Merkle client workshops, sales pursuits, and transformation roadmaps.

## Features

- **22-question diagnostic** across 6 capability areas (Identity, Signals, Decisioning, Engagement, Media Activation, Learning & Optimization)
- **5-point maturity scale** with contextual descriptions at each level
- **Optional industry modules** (Retail, QSR, Financial Services, Travel & Hospitality, Automotive)
- **Instant results** with capability heatmap (radar chart + score bars) and maturity stage classification
- **Prioritized opportunity cards** with scope, methods, and business value narratives
- **Salesforce-ready output** — copy-paste account narrative, pipeline table, and individual opportunity records
- **Shareable results link** — unique URL for every assessment
- **PDF export** via browser print
- **Rep mode** — email-based retrieval for Merkle sellers managing multiple client assessments
- **Admin dashboard** — view all submissions, filter, and export to CSV

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Deployment**: Vercel

---

## Setup Instructions

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd modern-crm-maturity-diagnostic
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (secret) |
| `ADMIN_PASSWORD` | Password for `/admin` dashboard access |
| `NEXT_PUBLIC_APP_URL` | Your deployment URL (for share links) |

Get your Supabase keys from: **Supabase Dashboard → Project Settings → API**

### 3. Set up the database

In your Supabase project, open the **SQL Editor** and run the migration:

```bash
# Copy and paste the contents of:
supabase/migrations/001_initial.sql
```

This creates:
- `assessments` table — stores client info, metadata, and computed scores
- `responses` table — stores individual question scores
- Indexes, RLS policies, and updated_at trigger

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploying to Vercel

### Option A: Vercel Dashboard

1. Push this repo to GitHub
2. In Vercel: **Add New Project** → select your repo
3. Add environment variables (from `.env.local`) in **Project Settings → Environment Variables**
4. Deploy

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

Follow the prompts to link your project and add environment variables.

---

## Application Structure

```
app/
  page.tsx                    # Landing page
  assessment/new/page.tsx     # Start a new assessment
  results/[shareId]/page.tsx  # View results by share ID
  admin/page.tsx              # Admin dashboard (password protected)
  api/
    assessments/route.ts      # Create assessment, list by rep email / admin
    assessments/[id]/route.ts # Get / update assessment
    assessments/[id]/responses/route.ts  # Save responses
    results/[shareId]/route.ts           # Get computed results

components/
  assessment/                 # SetupForm, CapabilitySection, IndustryModule, etc.
  results/                    # ResultsView, CapabilityHeatmap, OpportunityCards, etc.
  admin/                      # AdminDashboard
  ui/                         # Button, Card, Input

lib/
  data/questions.ts           # All 22 core + industry questions
  data/opportunities.ts       # Opportunity catalog (14 opportunities)
  scoring.ts                  # Score calculation and maturity stage logic
  supabase/client.ts          # Browser Supabase client
  supabase/server.ts          # Server-side Supabase client (service role)
  types.ts                    # TypeScript types
  utils.ts                    # Utility functions

supabase/migrations/          # Database schema
```

---

## Scoring Model

| Score | Label | Description |
|---|---|---|
| 1 | Not in Place | Capability does not exist or is highly fragmented |
| 2 | Emerging | Limited pilots or isolated capabilities exist |
| 3 | Operational | Capability is in use but not consistently integrated |
| 4 | Integrated | Capability operates across teams and channels |
| 5 | Optimized | Orchestrated and continuously improved through data and experimentation |

### Maturity Stages

| Overall Score | Stage | Label |
|---|---|---|
| 1.0 – 1.74 | Stage 1 | Campaign-Centric CRM |
| 1.75 – 2.74 | Stage 2 | Segmented Engagement |
| 2.75 – 3.74 | Stage 3 | Orchestrated Engagement |
| 3.75 – 5.0 | Stage 4 | Relationship Growth Engine |

---

## Opportunity Catalog

14 prioritized opportunity areas are pre-built and mapped to capability thresholds. Each includes:
- Priority level (Critical / High / Medium)
- Capability associations
- Scope description
- Key methods and approaches
- Business value narrative
- Salesforce opportunity type
- Estimated engagement size

Opportunities are triggered when a relevant capability scores below the configured threshold (typically 3.0 = "Operational"). The top 6 are surfaced in results, sorted by priority and gap size.

---

## Admin Dashboard

Access at `/admin`. Protected by `ADMIN_PASSWORD` environment variable.

Features:
- View all assessments with score and status
- Filter by client name, company, or rep email
- Stage distribution summary cards
- Export all data to CSV
- Click-through to individual assessment results

---

## Customizing the Opportunity Catalog

Edit `lib/data/opportunities.ts` to:
- Update opportunity descriptions and scope language with Merkle-specific content
- Add new opportunities
- Adjust trigger thresholds
- Link opportunities to specific Salesforce opportunity types

---

## Use Cases

- **Client Workshops**: Run as a guided exercise during strategy sessions
- **Sales & Pursuits**: Use to introduce the Modern CRM model and identify transformation opportunities
- **Transformation Roadmaps**: Starting point for multi-year CRM strategy definition

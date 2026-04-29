-- B2B Transformation Diagnostic — Isolated Schema
-- Mirrors the CSC tables (006 + 009) so the new B2B Transformation
-- diagnostic has zero impact on CRM or CSC pipelines. Includes both
-- the assessment/response tables and the project + stakeholder
-- container in one migration since this is being added all at once.

-- ============================================================
-- B2B ASSESSMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS b2b_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id TEXT UNIQUE NOT NULL,

  client_name TEXT NOT NULL,
  client_company TEXT NOT NULL,
  respondent_name TEXT NOT NULL,

  rep_email TEXT,
  is_rep_mode BOOLEAN DEFAULT FALSE,

  industry TEXT,
  source TEXT,

  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),

  overall_score DECIMAL(4, 2),
  maturity_stage SMALLINT CHECK (maturity_stage BETWEEN 1 AND 4),
  capability_scores JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- B2B RESPONSES
-- ============================================================
CREATE TABLE IF NOT EXISTS b2b_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES b2b_assessments(id) ON DELETE CASCADE,

  question_id TEXT NOT NULL,
  score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  capability TEXT NOT NULL,
  is_industry_question BOOLEAN DEFAULT FALSE,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (assessment_id, question_id)
);

-- ============================================================
-- B2B PROJECTS (workshop container)
-- ============================================================
CREATE TABLE IF NOT EXISTS b2b_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id TEXT UNIQUE NOT NULL,

  client_name TEXT NOT NULL,
  client_company TEXT NOT NULL DEFAULT '',
  industry TEXT,

  created_by_name TEXT NOT NULL,
  created_by_email TEXT,

  mode TEXT NOT NULL DEFAULT 'workshop' CHECK (mode IN ('lite', 'workshop')),

  survey_password TEXT,
  max_stakeholders SMALLINT DEFAULT 20,

  status TEXT DEFAULT 'collecting' CHECK (status IN ('collecting', 'aggregating', 'completed')),

  aggregated_scores JSONB,
  aggregated_overall DECIMAL(4, 2),
  aggregated_maturity SMALLINT CHECK (aggregated_maturity BETWEEN 1 AND 4),
  triggered_opportunity_ids TEXT[],
  workshop_agenda JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- B2B STAKEHOLDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS b2b_stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES b2b_projects(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  email TEXT,
  role TEXT,

  invite_token TEXT UNIQUE NOT NULL,

  assessment_id UUID REFERENCES b2b_assessments(id) ON DELETE SET NULL,

  status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'in_progress', 'completed')),

  invited_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Backfill nullable links between assessments, projects, and stakeholders
ALTER TABLE b2b_assessments ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES b2b_projects(id) ON DELETE SET NULL;
ALTER TABLE b2b_assessments ADD COLUMN IF NOT EXISTS stakeholder_id UUID REFERENCES b2b_stakeholders(id) ON DELETE SET NULL;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_b2b_assessments_share_id ON b2b_assessments(share_id);
CREATE INDEX IF NOT EXISTS idx_b2b_assessments_rep_email ON b2b_assessments(rep_email) WHERE rep_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_b2b_assessments_status ON b2b_assessments(status);
CREATE INDEX IF NOT EXISTS idx_b2b_assessments_created_at ON b2b_assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_b2b_assessments_source ON b2b_assessments(source) WHERE source IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_b2b_assessments_project_id ON b2b_assessments(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_b2b_responses_assessment_id ON b2b_responses(assessment_id);
CREATE INDEX IF NOT EXISTS idx_b2b_projects_share_id ON b2b_projects(share_id);
CREATE INDEX IF NOT EXISTS idx_b2b_projects_created_by_email ON b2b_projects(created_by_email) WHERE created_by_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_b2b_projects_status ON b2b_projects(status);
CREATE INDEX IF NOT EXISTS idx_b2b_stakeholders_project_id ON b2b_stakeholders(project_id);
CREATE INDEX IF NOT EXISTS idx_b2b_stakeholders_invite_token ON b2b_stakeholders(invite_token);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- Reuse update_updated_at_column() from migration 001.
-- ============================================================
DROP TRIGGER IF EXISTS update_b2b_assessments_updated_at ON b2b_assessments;
CREATE TRIGGER update_b2b_assessments_updated_at
  BEFORE UPDATE ON b2b_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_b2b_projects_updated_at ON b2b_projects;
CREATE TRIGGER update_b2b_projects_updated_at
  BEFORE UPDATE ON b2b_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE b2b_assessments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_responses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_stakeholders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read b2b_assessments by share_id"
  ON b2b_assessments FOR SELECT
  USING (true);

CREATE POLICY "Public read b2b_responses"
  ON b2b_responses FOR SELECT
  USING (true);

CREATE POLICY "Public read b2b_projects" ON b2b_projects FOR SELECT USING (true);
CREATE POLICY "Public read b2b_stakeholders" ON b2b_stakeholders FOR SELECT USING (true);

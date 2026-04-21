-- Content Supply Chain Projects (workshop container) — mirror of migration 003
-- for the CSC diagnostic. Deliberately parallel schema so CSC project work
-- has zero impact on CRM projects/assessments.

-- ============================================================
-- CSC_PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS csc_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id TEXT UNIQUE NOT NULL,

  client_name TEXT NOT NULL,
  client_company TEXT NOT NULL DEFAULT '',
  industry TEXT,

  created_by_name TEXT NOT NULL,
  created_by_email TEXT,

  mode TEXT NOT NULL DEFAULT 'workshop' CHECK (mode IN ('lite', 'workshop')),

  survey_password TEXT,                  -- bcrypt hash; null = no password
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
-- CSC_STAKEHOLDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS csc_stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES csc_projects(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  email TEXT,
  role TEXT,

  invite_token TEXT UNIQUE NOT NULL,

  assessment_id UUID REFERENCES csc_assessments(id) ON DELETE SET NULL,

  status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'in_progress', 'completed')),

  invited_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================================
-- LINK CSC ASSESSMENTS TO PROJECTS (backward-compatible nullable FKs)
-- ============================================================
ALTER TABLE csc_assessments ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES csc_projects(id) ON DELETE SET NULL;
ALTER TABLE csc_assessments ADD COLUMN IF NOT EXISTS stakeholder_id UUID REFERENCES csc_stakeholders(id) ON DELETE SET NULL;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_csc_projects_share_id ON csc_projects(share_id);
CREATE INDEX IF NOT EXISTS idx_csc_projects_created_by_email ON csc_projects(created_by_email) WHERE created_by_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_csc_projects_status ON csc_projects(status);
CREATE INDEX IF NOT EXISTS idx_csc_stakeholders_project_id ON csc_stakeholders(project_id);
CREATE INDEX IF NOT EXISTS idx_csc_stakeholders_invite_token ON csc_stakeholders(invite_token);
CREATE INDEX IF NOT EXISTS idx_csc_assessments_project_id ON csc_assessments(project_id) WHERE project_id IS NOT NULL;

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
DROP TRIGGER IF EXISTS update_csc_projects_updated_at ON csc_projects;
CREATE TRIGGER update_csc_projects_updated_at
  BEFORE UPDATE ON csc_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE csc_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE csc_stakeholders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read csc_projects" ON csc_projects FOR SELECT USING (true);
CREATE POLICY "Public read csc_stakeholders" ON csc_stakeholders FOR SELECT USING (true);

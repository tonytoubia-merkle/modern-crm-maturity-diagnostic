-- Workshop Mode: Projects, Stakeholders, and Assessment Linkage
-- Run this in your Supabase SQL editor or via the CLI

-- ============================================================
-- PROJECTS (workshop container)
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id TEXT UNIQUE NOT NULL,

  -- Client info
  client_name TEXT NOT NULL,
  client_company TEXT NOT NULL DEFAULT '',
  industry TEXT,

  -- Creator (internal Merkle user)
  created_by_name TEXT NOT NULL,
  created_by_email TEXT,

  -- Mode
  mode TEXT NOT NULL DEFAULT 'workshop' CHECK (mode IN ('lite', 'workshop')),

  -- Workshop config
  survey_password TEXT,                  -- bcrypt hash; null = no password required
  max_stakeholders SMALLINT DEFAULT 20,

  -- Status
  status TEXT DEFAULT 'collecting' CHECK (status IN ('collecting', 'aggregating', 'completed')),

  -- Aggregated results (computed when internal user triggers aggregation)
  aggregated_scores JSONB,
  aggregated_overall DECIMAL(4, 2),
  aggregated_maturity SMALLINT CHECK (aggregated_maturity BETWEEN 1 AND 4),
  triggered_opportunity_ids TEXT[],
  workshop_agenda JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STAKEHOLDERS (invited survey participants)
-- ============================================================
CREATE TABLE IF NOT EXISTS stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Participant info
  name TEXT NOT NULL,
  email TEXT,
  role TEXT,

  -- Unique survey link token
  invite_token TEXT UNIQUE NOT NULL,

  -- Link to their assessment (null until they start the survey)
  assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,

  -- Status
  status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'in_progress', 'completed')),

  invited_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================================
-- LINK ASSESSMENTS TO PROJECTS (backward-compatible nullable FKs)
-- ============================================================
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS stakeholder_id UUID REFERENCES stakeholders(id) ON DELETE SET NULL;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_projects_share_id ON projects(share_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_by_email ON projects(created_by_email) WHERE created_by_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_stakeholders_project_id ON stakeholders(project_id);
CREATE INDEX IF NOT EXISTS idx_stakeholders_invite_token ON stakeholders(invite_token);
CREATE INDEX IF NOT EXISTS idx_assessments_project_id ON assessments(project_id) WHERE project_id IS NOT NULL;

-- ============================================================
-- UPDATED_AT TRIGGER (reuse existing function)
-- ============================================================
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read stakeholders" ON stakeholders FOR SELECT USING (true);

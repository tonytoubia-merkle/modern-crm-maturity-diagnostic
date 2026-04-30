-- AI for CX + AI for Enterprise Diagnostics — Isolated Schemas
-- Mirrors the CSC tables (006 + 009) and the B2B tables (010) so the
-- two new AI diagnostics have zero impact on CRM, CSC, or B2B
-- pipelines. Adds both diagnostics in one migration since they're
-- being added together.

-- ════════════════════════════════════════════════════════════════
-- AI FOR CX
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS aicx_assessments (
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

CREATE TABLE IF NOT EXISTS aicx_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES aicx_assessments(id) ON DELETE CASCADE,

  question_id TEXT NOT NULL,
  score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  capability TEXT NOT NULL,
  is_industry_question BOOLEAN DEFAULT FALSE,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (assessment_id, question_id)
);

CREATE TABLE IF NOT EXISTS aicx_projects (
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

CREATE TABLE IF NOT EXISTS aicx_stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES aicx_projects(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  email TEXT,
  role TEXT,

  invite_token TEXT UNIQUE NOT NULL,

  assessment_id UUID REFERENCES aicx_assessments(id) ON DELETE SET NULL,

  status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'in_progress', 'completed')),

  invited_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE aicx_assessments ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES aicx_projects(id) ON DELETE SET NULL;
ALTER TABLE aicx_assessments ADD COLUMN IF NOT EXISTS stakeholder_id UUID REFERENCES aicx_stakeholders(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_aicx_assessments_share_id ON aicx_assessments(share_id);
CREATE INDEX IF NOT EXISTS idx_aicx_assessments_rep_email ON aicx_assessments(rep_email) WHERE rep_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_aicx_assessments_status ON aicx_assessments(status);
CREATE INDEX IF NOT EXISTS idx_aicx_assessments_created_at ON aicx_assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_aicx_assessments_source ON aicx_assessments(source) WHERE source IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_aicx_assessments_project_id ON aicx_assessments(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_aicx_responses_assessment_id ON aicx_responses(assessment_id);
CREATE INDEX IF NOT EXISTS idx_aicx_projects_share_id ON aicx_projects(share_id);
CREATE INDEX IF NOT EXISTS idx_aicx_projects_created_by_email ON aicx_projects(created_by_email) WHERE created_by_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_aicx_projects_status ON aicx_projects(status);
CREATE INDEX IF NOT EXISTS idx_aicx_stakeholders_project_id ON aicx_stakeholders(project_id);
CREATE INDEX IF NOT EXISTS idx_aicx_stakeholders_invite_token ON aicx_stakeholders(invite_token);

DROP TRIGGER IF EXISTS update_aicx_assessments_updated_at ON aicx_assessments;
CREATE TRIGGER update_aicx_assessments_updated_at
  BEFORE UPDATE ON aicx_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_aicx_projects_updated_at ON aicx_projects;
CREATE TRIGGER update_aicx_projects_updated_at
  BEFORE UPDATE ON aicx_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE aicx_assessments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE aicx_responses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE aicx_projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE aicx_stakeholders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read aicx_assessments by share_id" ON aicx_assessments FOR SELECT USING (true);
CREATE POLICY "Public read aicx_responses" ON aicx_responses FOR SELECT USING (true);
CREATE POLICY "Public read aicx_projects" ON aicx_projects FOR SELECT USING (true);
CREATE POLICY "Public read aicx_stakeholders" ON aicx_stakeholders FOR SELECT USING (true);

-- ════════════════════════════════════════════════════════════════
-- AI FOR ENTERPRISE
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS aient_assessments (
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

CREATE TABLE IF NOT EXISTS aient_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES aient_assessments(id) ON DELETE CASCADE,

  question_id TEXT NOT NULL,
  score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  capability TEXT NOT NULL,
  is_industry_question BOOLEAN DEFAULT FALSE,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (assessment_id, question_id)
);

CREATE TABLE IF NOT EXISTS aient_projects (
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

CREATE TABLE IF NOT EXISTS aient_stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES aient_projects(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  email TEXT,
  role TEXT,

  invite_token TEXT UNIQUE NOT NULL,

  assessment_id UUID REFERENCES aient_assessments(id) ON DELETE SET NULL,

  status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'in_progress', 'completed')),

  invited_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE aient_assessments ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES aient_projects(id) ON DELETE SET NULL;
ALTER TABLE aient_assessments ADD COLUMN IF NOT EXISTS stakeholder_id UUID REFERENCES aient_stakeholders(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_aient_assessments_share_id ON aient_assessments(share_id);
CREATE INDEX IF NOT EXISTS idx_aient_assessments_rep_email ON aient_assessments(rep_email) WHERE rep_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_aient_assessments_status ON aient_assessments(status);
CREATE INDEX IF NOT EXISTS idx_aient_assessments_created_at ON aient_assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_aient_assessments_source ON aient_assessments(source) WHERE source IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_aient_assessments_project_id ON aient_assessments(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_aient_responses_assessment_id ON aient_responses(assessment_id);
CREATE INDEX IF NOT EXISTS idx_aient_projects_share_id ON aient_projects(share_id);
CREATE INDEX IF NOT EXISTS idx_aient_projects_created_by_email ON aient_projects(created_by_email) WHERE created_by_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_aient_projects_status ON aient_projects(status);
CREATE INDEX IF NOT EXISTS idx_aient_stakeholders_project_id ON aient_stakeholders(project_id);
CREATE INDEX IF NOT EXISTS idx_aient_stakeholders_invite_token ON aient_stakeholders(invite_token);

DROP TRIGGER IF EXISTS update_aient_assessments_updated_at ON aient_assessments;
CREATE TRIGGER update_aient_assessments_updated_at
  BEFORE UPDATE ON aient_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_aient_projects_updated_at ON aient_projects;
CREATE TRIGGER update_aient_projects_updated_at
  BEFORE UPDATE ON aient_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE aient_assessments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE aient_responses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE aient_projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE aient_stakeholders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read aient_assessments by share_id" ON aient_assessments FOR SELECT USING (true);
CREATE POLICY "Public read aient_responses" ON aient_responses FOR SELECT USING (true);
CREATE POLICY "Public read aient_projects" ON aient_projects FOR SELECT USING (true);
CREATE POLICY "Public read aient_stakeholders" ON aient_stakeholders FOR SELECT USING (true);

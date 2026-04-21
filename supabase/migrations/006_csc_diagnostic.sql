-- Content Supply Chain Diagnostic — Isolated Schema
-- Separate tables so the CSC diagnostic has zero impact on the existing
-- CRM assessments/responses pipeline.

-- ============================================================
-- CSC ASSESSMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS csc_assessments (
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
-- CSC RESPONSES
-- ============================================================
CREATE TABLE IF NOT EXISTS csc_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES csc_assessments(id) ON DELETE CASCADE,

  question_id TEXT NOT NULL,
  score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  capability TEXT NOT NULL,
  is_industry_question BOOLEAN DEFAULT FALSE,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (assessment_id, question_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_csc_assessments_share_id ON csc_assessments(share_id);
CREATE INDEX IF NOT EXISTS idx_csc_assessments_rep_email ON csc_assessments(rep_email) WHERE rep_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_csc_assessments_status ON csc_assessments(status);
CREATE INDEX IF NOT EXISTS idx_csc_assessments_created_at ON csc_assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_csc_responses_assessment_id ON csc_responses(assessment_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- Reuses the existing update_updated_at_column() function from migration 001.
-- ============================================================
DROP TRIGGER IF EXISTS update_csc_assessments_updated_at ON csc_assessments;
CREATE TRIGGER update_csc_assessments_updated_at
  BEFORE UPDATE ON csc_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE csc_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE csc_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read csc_assessments by share_id"
  ON csc_assessments FOR SELECT
  USING (true);

CREATE POLICY "Public read csc_responses"
  ON csc_responses FOR SELECT
  USING (true);

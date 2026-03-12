-- Modern CRM Maturity Diagnostic — Initial Schema
-- Run this in your Supabase SQL editor or via the CLI

-- ============================================================
-- ASSESSMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id TEXT UNIQUE NOT NULL,

  -- Client info
  client_name TEXT NOT NULL,
  client_company TEXT NOT NULL,
  respondent_name TEXT NOT NULL,

  -- Rep mode
  rep_email TEXT,
  is_rep_mode BOOLEAN DEFAULT FALSE,

  -- Industry module
  industry TEXT,

  -- Status
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),

  -- Computed on completion (denormalized for fast admin queries)
  overall_score DECIMAL(4, 2),
  maturity_stage SMALLINT CHECK (maturity_stage BETWEEN 1 AND 4),
  capability_scores JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RESPONSES
-- ============================================================
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,

  question_id TEXT NOT NULL,         -- e.g. "1", "2", "retail_1"
  score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  capability TEXT NOT NULL,          -- e.g. "identity", "signals"
  is_industry_question BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (assessment_id, question_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_assessments_share_id ON assessments(share_id);
CREATE INDEX IF NOT EXISTS idx_assessments_rep_email ON assessments(rep_email) WHERE rep_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_responses_assessment_id ON responses(assessment_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_assessments_updated_at ON assessments;
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
-- RLS is enabled but all access goes through server-side API routes
-- using the service role key (which bypasses RLS).
-- Enable RLS for defense in depth:

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Allow public read by share_id (for direct Supabase client use if needed)
CREATE POLICY "Public read assessments by share_id"
  ON assessments FOR SELECT
  USING (true);  -- Filtered at application level

CREATE POLICY "Public read responses"
  ON responses FOR SELECT
  USING (true);

-- Insert/update only through service role (API routes)
-- No public INSERT/UPDATE/DELETE policies — service role bypasses RLS

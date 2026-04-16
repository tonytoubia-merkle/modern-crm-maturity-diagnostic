-- Add source tracking for assessments (marketing, cannes, connections, etc.)
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS source TEXT;
CREATE INDEX IF NOT EXISTS idx_assessments_source ON assessments(source) WHERE source IS NOT NULL;

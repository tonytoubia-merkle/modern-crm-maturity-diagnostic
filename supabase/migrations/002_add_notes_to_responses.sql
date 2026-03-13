-- Add optional respondent notes to individual question responses
ALTER TABLE responses ADD COLUMN IF NOT EXISTS notes TEXT;

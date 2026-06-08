-- Business model for Modern CRM assessments (B2C / B2B / B2B2C / Hybrid).
-- Drives the B2B / ABM reframing of questions, maturity stages, and
-- opportunities. NULL is treated as B2C (the default consumer wording).
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS business_model TEXT;

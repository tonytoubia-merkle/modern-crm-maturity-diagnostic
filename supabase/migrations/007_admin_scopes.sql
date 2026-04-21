-- Scoped admin access.
--
-- Existing 'super_admin' role continues to mean "access to everything"
-- (current products and any future ones). This migration adds an array
-- column that lets us grant narrow admin access to a single product area
-- without promoting a user to full super_admin.
--
-- Scope values currently recognised by the app:
--   'crm' — can view all Modern CRM assessments and projects on /admin
--   'csc' — can view all Content Supply Chain assessments on /csc
--
-- New values can be added just by writing them into the column; no
-- migration required per product.

ALTER TABLE app_users
  ADD COLUMN IF NOT EXISTS admin_scopes TEXT[] NOT NULL DEFAULT '{}';

-- Example: promote a user to CSC-only admin (doesn't grant CRM access):
--   INSERT INTO app_users (email, role, admin_scopes)
--   VALUES ('csc.lead@merkle.com', 'user', ARRAY['csc'])
--   ON CONFLICT (email) DO UPDATE
--     SET admin_scopes = EXCLUDED.admin_scopes;

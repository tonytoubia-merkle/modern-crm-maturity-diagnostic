-- Seed initial CSC-only admins (depends on migration 007).
--
-- These users get admin_scopes = {'csc'} so they can view every CSC
-- assessment on /csc, but do NOT gain CRM admin access.
--
-- No Supabase Auth user is created here — passwords live in the auth
-- schema and can't be set via SQL. Each user signs up themselves at
-- /login with their Merkle email (the domain allowlist permits it);
-- their admin scope is already in place when they first authenticate.

INSERT INTO app_users (email, role, admin_scopes) VALUES
  ('ilona.yeremova@merkle.com',   'user', ARRAY['csc']),
  ('natasha.ness@merkle.com',     'user', ARRAY['csc']),
  ('michelle.cascone@merkle.com', 'user', ARRAY['csc']),
  ('evan.nicholson@merkle.com',   'user', ARRAY['csc'])
ON CONFLICT (email) DO UPDATE
  SET admin_scopes = (
    SELECT ARRAY(
      SELECT DISTINCT unnest(app_users.admin_scopes || EXCLUDED.admin_scopes)
    )
  ),
  updated_at = now();

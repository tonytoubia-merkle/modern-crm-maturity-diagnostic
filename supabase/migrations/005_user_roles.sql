-- User roles for the diagnostic app
-- Drives admin access control (replaces the shared ADMIN_PASSWORD).
-- The middleware already restricts login to Merkle/Dentsu emails; this
-- table elevates specific accounts to super_admin for /admin access.

CREATE TABLE IF NOT EXISTS app_users (
  email TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'super_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Normalize email to lowercase on write so lookups are case-insensitive.
CREATE OR REPLACE FUNCTION app_users_lowercase_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email = lower(NEW.email);
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_app_users_lowercase_email ON app_users;
CREATE TRIGGER trg_app_users_lowercase_email
  BEFORE INSERT OR UPDATE ON app_users
  FOR EACH ROW EXECUTE FUNCTION app_users_lowercase_email();

-- RLS: only the service role (used by API routes) should touch this.
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- Seed the initial super admins. Re-running the migration is a no-op
-- for existing rows and is idempotent for role promotions.
INSERT INTO app_users (email, role) VALUES
  ('tony.toubia@merkle.com', 'super_admin'),
  ('james.riess@merkle.com', 'super_admin')
ON CONFLICT (email) DO UPDATE
  SET role = EXCLUDED.role,
      updated_at = now();

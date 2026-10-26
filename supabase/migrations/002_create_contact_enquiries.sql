-- Migration: Create contact_enquiries table
-- Apply this migration in your Supabase project SQL editor or via the Supabase CLI.

CREATE TABLE IF NOT EXISTS contact_enquiries (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name   TEXT        NOT NULL,
  last_name    TEXT,
  email        TEXT        NOT NULL,
  phone        TEXT,
  message      TEXT        NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_read      BOOLEAN     NOT NULL DEFAULT false
);

-- ──────────────────────────────────────────────
-- Row Level Security
-- ──────────────────────────────────────────────

ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;

-- No anonymous SELECT — public visitors cannot read enquiries via the anon key.
-- No anonymous INSERT — inserts are performed exclusively via a Server Action
-- using the service role key, which bypasses RLS entirely.

-- Authenticated admin users can read all enquiries
CREATE POLICY "admin_read_enquiries"
  ON contact_enquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated admin users can mark enquiries as read (UPDATE is_read)
CREATE POLICY "admin_update_enquiries"
  ON contact_enquiries
  FOR UPDATE
  TO authenticated
  USING (true);

-- Migration: Create feature_requests table
-- Apply this migration in your Supabase project SQL editor or via the Supabase CLI.

CREATE TABLE IF NOT EXISTS feature_requests (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT        NOT NULL,
  email        TEXT        NOT NULL,
  title        TEXT        NOT NULL,
  description  TEXT        NOT NULL,
  priority     TEXT        NOT NULL DEFAULT 'medium'
                           CHECK (priority IN ('low', 'medium', 'high')),
  status       TEXT        NOT NULL DEFAULT 'open'
                           CHECK (status IN ('open', 'in_progress', 'completed', 'declined')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_read      BOOLEAN     NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_feature_requests_submitted_at ON feature_requests (submitted_at DESC);

-- ──────────────────────────────────────────────
-- Row Level Security
-- ──────────────────────────────────────────────

ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;

-- Anonymous insert allowed (public users can submit feature requests)
CREATE POLICY "public_insert_feature_requests"
  ON feature_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated admin users can read all feature requests
CREATE POLICY "admin_read_feature_requests"
  ON feature_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated admin users can update feature requests (status, is_read)
CREATE POLICY "admin_update_feature_requests"
  ON feature_requests
  FOR UPDATE
  TO authenticated
  USING (true);

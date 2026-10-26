-- Migration: Create knowledge_base table
-- Apply this migration in your Supabase project SQL editor or via the Supabase CLI.

CREATE TABLE IF NOT EXISTS knowledge_base (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT        NOT NULL,
  content      TEXT        NOT NULL,
  category     TEXT        NOT NULL
                           CHECK (category IN ('about', 'projects', 'services', 'contact', 'faq')),
  is_published BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Automatically update updated_at whenever a row is modified
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_knowledge_base_updated_at
  BEFORE UPDATE ON knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ──────────────────────────────────────────────
-- Row Level Security
-- ──────────────────────────────────────────────

ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Authenticated admin users can read all entries (published or not)
CREATE POLICY "admin_read_kb"
  ON knowledge_base
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated admin users can insert new entries
CREATE POLICY "admin_insert_kb"
  ON knowledge_base
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated admin users can update any entry
CREATE POLICY "admin_update_kb"
  ON knowledge_base
  FOR UPDATE
  TO authenticated
  USING (true);

-- Authenticated admin users can delete entries
CREATE POLICY "admin_delete_kb"
  ON knowledge_base
  FOR DELETE
  TO authenticated
  USING (true);

-- Anonymous (public) users can only read entries where is_published = true.
-- This is used by the /api/chat route handler with the anon key.
CREATE POLICY "public_read_published_kb"
  ON knowledge_base
  FOR SELECT
  TO anon
  USING (is_published = true);

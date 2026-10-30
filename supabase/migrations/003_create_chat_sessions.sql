-- Migration: Create chat_sessions table for storing chatbot conversations
-- Apply this migration in your Supabase project SQL editor or via the Supabase CLI.

CREATE TABLE IF NOT EXISTS chat_sessions (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id   TEXT        NOT NULL,
  messages     JSONB       NOT NULL DEFAULT '[]',
  ip_address   TEXT,
  user_agent   TEXT,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  message_count INTEGER     NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON chat_sessions (session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_started_at ON chat_sessions (started_at DESC);

-- ──────────────────────────────────────────────
-- Row Level Security
-- ──────────────────────────────────────────────

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Only service role (admin server actions) can access chat sessions
-- No anon or authenticated Supabase user access needed; all access is via service key

CREATE POLICY "service_role_all_chat_sessions"
  ON chat_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- Live Chat (website visitor ⇄ admin dashboard)
-- Run this in your Supabase SQL Editor.
-- Depends on: user_profiles (users-schema.sql)
--
-- Security model:
--   • Visitors NEVER access these tables directly. The website widget talks to
--     /api/chat/* route handlers, which use the service-role key and check a
--     secret per-visitor token. (Anonymous Supabase sign-in is deliberately NOT
--     used: anonymous users get the "authenticated" role, and several existing
--     policies trust that role.)
--   • Only admins (user_profiles.role = 'admin') can read/write via the API key,
--     which powers the dashboard inbox and its realtime updates.
-- =====================================================

CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_token_hash TEXT NOT NULL,          -- sha256 of the visitor's secret token
  visitor_name VARCHAR(120),
  visitor_email VARCHAR(255),
  page_url TEXT,                              -- page the chat was started from
  status VARCHAR(20) NOT NULL DEFAULT 'open', -- open | closed
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_preview TEXT,
  last_sender VARCHAR(10),                    -- visitor | admin
  unread_admin INTEGER NOT NULL DEFAULT 0,    -- visitor messages the team hasn't read
  unread_visitor INTEGER NOT NULL DEFAULT 0,  -- team replies the visitor hasn't seen
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender VARCHAR(10) NOT NULL CHECK (sender IN ('visitor', 'admin')),
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  admin_id UUID,                              -- which admin replied (if sender = admin)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_last ON chat_conversations(last_message_at DESC);

-- Keep the conversation summary + unread counters in sync with new messages
CREATE OR REPLACE FUNCTION chat_on_message_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_conversations
  SET last_message_at = NEW.created_at,
      last_message_preview = LEFT(NEW.body, 140),
      last_sender = NEW.sender,
      unread_admin = CASE WHEN NEW.sender = 'visitor' THEN unread_admin + 1 ELSE unread_admin END,
      unread_visitor = CASE WHEN NEW.sender = 'admin' THEN unread_visitor + 1 ELSE unread_visitor END,
      status = CASE WHEN NEW.sender = 'visitor' THEN 'open' ELSE status END
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS chat_message_inserted ON chat_messages;
CREATE TRIGGER chat_message_inserted
  AFTER INSERT ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION chat_on_message_insert();

-- ── Row Level Security: admins only (visitors go through the API) ──
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage chat conversations" ON chat_conversations;
CREATE POLICY "Admins manage chat conversations" ON chat_conversations
  FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "Admins manage chat messages" ON chat_messages;
CREATE POLICY "Admins manage chat messages" ON chat_messages
  FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Never expose the token hash, even to the anon key
REVOKE ALL ON chat_conversations FROM anon;
REVOKE ALL ON chat_messages FROM anon;

-- ── Realtime for the dashboard inbox ──
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_conversations;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

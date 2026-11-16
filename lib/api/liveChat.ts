import { supabase } from '../supabaseClient';

/** Admin-side live chat API (dashboard). RLS limits these tables to admins. */
export interface ChatConversation {
  id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  page_url: string | null;
  status: 'open' | 'closed';
  last_message_at: string;
  last_message_preview: string | null;
  last_sender: 'visitor' | 'admin' | null;
  unread_admin: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender: 'visitor' | 'admin';
  body: string;
  created_at: string;
}

const CONVO_FIELDS =
  'id, visitor_name, visitor_email, page_url, status, last_message_at, last_message_preview, last_sender, unread_admin, created_at';

export const liveChatAPI = {
  async listConversations(): Promise<ChatConversation[]> {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select(CONVO_FIELDS)
      .order('last_message_at', { ascending: false })
      .limit(200);
    if (error) throw error;
    return (data ?? []) as ChatConversation[];
  },

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, conversation_id, sender, body, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(500);
    if (error) throw error;
    return (data ?? []) as ChatMessage[];
  },

  async reply(conversationId: string, body: string): Promise<ChatMessage> {
    const { data: auth } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ conversation_id: conversationId, sender: 'admin', body: body.trim(), admin_id: auth.user?.id ?? null })
      .select('id, conversation_id, sender, body, created_at')
      .single();
    if (error) throw error;
    return data as ChatMessage;
  },

  async markRead(conversationId: string) {
    const { error } = await supabase.from('chat_conversations').update({ unread_admin: 0 }).eq('id', conversationId);
    if (error) throw error;
  },

  async setStatus(conversationId: string, status: 'open' | 'closed') {
    const { error } = await supabase.from('chat_conversations').update({ status }).eq('id', conversationId);
    if (error) throw error;
  },

  async remove(conversationId: string) {
    const { error } = await supabase.from('chat_conversations').delete().eq('id', conversationId);
    if (error) throw error;
  },
};

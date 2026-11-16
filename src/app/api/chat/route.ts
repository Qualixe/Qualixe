import { NextResponse } from 'next/server';
import { chatDb, clientIp, cleanText, hashToken, MAX_MESSAGE, MESSAGE_FIELDS, newToken, notifyNewChat, tooManyNewChats } from '@/lib/chatServer';

export const dynamic = 'force-dynamic';

/**
 * POST /api/chat — start a conversation with the visitor's first message.
 * Body: { message, name?, email?, pageUrl? }
 * Returns: { conversationId, token, messages }
 * The token is the visitor's secret for this conversation; only its hash is stored.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const message = cleanText(body.message, MAX_MESSAGE);
  if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

  if (tooManyNewChats(clientIp(req))) {
    return NextResponse.json({ error: 'Too many new chats — please wait a few minutes and try again.' }, { status: 429 });
  }

  const name = cleanText(body.name, 120) || null;
  const emailRaw = cleanText(body.email, 255);
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw) ? emailRaw : null;
  const pageUrl = cleanText(body.pageUrl, 500) || null;

  const token = newToken();
  const db = chatDb();

  const { data: convo, error } = await db
    .from('chat_conversations')
    .insert({ visitor_token_hash: hashToken(token), visitor_name: name, visitor_email: email, page_url: pageUrl })
    .select('id')
    .single();
  if (error || !convo) {
    console.error('[live-chat] create conversation failed', error);
    return NextResponse.json({ error: 'Chat is unavailable right now. Please try again.' }, { status: 500 });
  }

  const { data: msg, error: msgErr } = await db
    .from('chat_messages')
    .insert({ conversation_id: convo.id, sender: 'visitor', body: message })
    .select(MESSAGE_FIELDS)
    .single();
  if (msgErr) {
    console.error('[live-chat] first message failed', msgErr);
    return NextResponse.json({ error: 'Message could not be sent. Please try again.' }, { status: 500 });
  }

  await notifyNewChat({ conversationId: convo.id, message, name: name ?? undefined, email: email ?? undefined, pageUrl: pageUrl ?? undefined });

  return NextResponse.json({ conversationId: convo.id, token, messages: [msg] });
}

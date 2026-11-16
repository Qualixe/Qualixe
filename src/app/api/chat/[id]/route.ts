import { NextResponse } from 'next/server';
import {
  chatDb,
  cleanText,
  getVisitorConversation,
  isRateLimited,
  MAX_MESSAGE,
  MESSAGE_FIELDS,
  notifyNewChat,
} from '@/lib/chatServer';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// The visitor's secret token travels in a header (not the URL, so it stays out of logs)
const tokenOf = (req: Request) => req.headers.get('x-chat-token');

/** GET /api/chat/:id?after=ISO — the visitor polls for messages (and marks replies as seen) */
export async function GET(req: Request, { params }: Ctx) {
  const { id } = await params;
  const convo = await getVisitorConversation(id, tokenOf(req));
  if (!convo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const after = new URL(req.url).searchParams.get('after');
  const db = chatDb();
  let query = db.from('chat_messages').select(MESSAGE_FIELDS).eq('conversation_id', id).order('created_at', { ascending: true }).limit(200);
  if (after && !Number.isNaN(Date.parse(after))) query = query.gt('created_at', after);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: 'Could not load messages' }, { status: 500 });

  if ((data ?? []).some((m) => m.sender === 'admin')) {
    await db.from('chat_conversations').update({ unread_visitor: 0 }).eq('id', id);
  }

  return NextResponse.json({
    messages: data ?? [],
    status: convo.status,
    hasEmail: Boolean(convo.visitor_email),
  });
}

/** POST /api/chat/:id — the visitor sends another message. Body: { message } */
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const convo = await getVisitorConversation(id, tokenOf(req));
  if (!convo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const message = cleanText(body.message, MAX_MESSAGE);
  if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

  if (await isRateLimited(id)) {
    return NextResponse.json({ error: 'You’re sending messages too quickly — please wait a moment.' }, { status: 429 });
  }

  const { data, error } = await chatDb()
    .from('chat_messages')
    .insert({ conversation_id: id, sender: 'visitor', body: message })
    .select(MESSAGE_FIELDS)
    .single();
  if (error) return NextResponse.json({ error: 'Message could not be sent' }, { status: 500 });

  return NextResponse.json({ message: data });
}

/** PATCH /api/chat/:id — the visitor leaves their name/email for follow-up. Body: { name?, email? } */
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const convo = await getVisitorConversation(id, tokenOf(req));
  if (!convo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const name = cleanText(body.name, 120);
  const email = cleanText(body.email, 255);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
  }

  const update: Record<string, string> = {};
  if (name) update.visitor_name = name;
  if (email) update.visitor_email = email;
  if (!Object.keys(update).length) return NextResponse.json({ ok: true });

  const { error } = await chatDb().from('chat_conversations').update(update).eq('id', id);
  if (error) return NextResponse.json({ error: 'Could not save your details' }, { status: 500 });

  // First time we learn the email → let the team know who to follow up with
  if (email && !convo.visitor_email) {
    await notifyNewChat({ conversationId: id, message: `Visitor left their email for follow-up: ${email}`, name: name || convo.visitor_name || undefined, email });
  }
  return NextResponse.json({ ok: true });
}

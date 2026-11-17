import { NextResponse } from 'next/server';
import { chatDb, cleanText, getVisitorConversation, MAX_MESSAGE, MESSAGE_FIELDS, overLimit } from '@/lib/chatServer';
import { VOICE_AI_PREFIX, VOICE_VISITOR_PREFIX } from '@/lib/voiceAgent';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

/**
 * POST /api/chat/:id/transcript — save one line of an AI voice call into the chat,
 * so the team sees the conversation in the dashboard / admin app.
 * Body: { role: 'visitor' | 'ai', text }
 */
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const convo = await getVisitorConversation(id, req.headers.get('x-chat-token'));
  if (!convo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const role = body.role === 'ai' ? 'ai' : body.role === 'visitor' ? 'visitor' : null;
  const text = cleanText(body.text, MAX_MESSAGE - 4);
  if (!role || !text) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  if (overLimit(`transcript:${id}`, 40, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { data, error } = await chatDb()
    .from('chat_messages')
    .insert({
      conversation_id: id,
      // AI lines are stored on the team side of the thread, clearly marked with the 🤖 prefix
      sender: role === 'ai' ? 'admin' : 'visitor',
      body: (role === 'ai' ? VOICE_AI_PREFIX : VOICE_VISITOR_PREFIX) + text,
    })
    .select(MESSAGE_FIELDS)
    .single();
  if (error) return NextResponse.json({ error: 'Could not save' }, { status: 500 });

  return NextResponse.json({ message: data });
}

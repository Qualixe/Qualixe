import { NextResponse } from 'next/server';
import { clientIp, getVisitorConversation, overLimit } from '@/lib/chatServer';
import { VOICE_INSTRUCTIONS, VOICE_MODEL, VOICE_NAME } from '@/lib/voiceAgent';

export const dynamic = 'force-dynamic';

// In development, show OpenAI's real error in the widget to make setup issues obvious
const DEV = process.env.NODE_ENV !== 'production';

type Ctx = { params: Promise<{ id: string }> };

/**
 * POST /api/chat/:id/voice — start an AI voice call (OpenAI Realtime over WebRTC).
 * Body: the browser's SDP offer (text). Returns OpenAI's SDP answer.
 * The OpenAI key and the assistant's instructions never leave the server.
 */
export async function POST(req: Request, { params }: Ctx) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('[voice] OPENAI_API_KEY is not set on this server');
    return NextResponse.json({ error: DEV ? 'OPENAI_API_KEY is missing — add it to .env and restart the server.' : 'Voice chat is not available right now.' }, { status: 503 });
  }

  const { id } = await params;
  const convo = await getVisitorConversation(id, req.headers.get('x-chat-token'));
  if (!convo) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });

  // Cost guard: 4 calls per conversation per hour, 8 per IP per hour
  if (overLimit(`voice:c:${id}`, 4, 60 * 60_000) || overLimit(`voice:ip:${clientIp(req)}`, 8, 60 * 60_000)) {
    return NextResponse.json({ error: 'Voice call limit reached — please try again later or type your message.' }, { status: 429 });
  }

  const sdp = await req.text();
  if (!sdp.startsWith('v=') || sdp.length > 20_000) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const session = {
    type: 'realtime',
    model: VOICE_MODEL,
    instructions: VOICE_INSTRUCTIONS,
    max_output_tokens: 600,
    audio: {
      input: {
        transcription: {
          model: 'gpt-4o-mini-transcribe',
          // Hint: most visitors speak Bangla, English, or a mix
          prompt: 'Conversation in Bangla (Bangladesh) and English about websites, Shopify, Laravel and web apps.',
        },
        turn_detection: { type: 'server_vad', silence_duration_ms: 600 },
      },
      output: { voice: VOICE_NAME },
    },
  };

  const form = new FormData();
  form.set('sdp', sdp);
  form.set('session', JSON.stringify(session));

  try {
    const r = await fetch('https://api.openai.com/v1/realtime/calls', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        // Lets OpenAI attribute abuse to a visitor without sending personal data
        'OpenAI-Safety-Identifier': `qx-chat-${id}`,
      },
      body: form,
    });
    const answer = await r.text();
    if (!r.ok) {
      console.error('[voice] OpenAI realtime call failed', r.status, answer.slice(0, 500));
      let detail = answer.slice(0, 300);
      try { detail = JSON.parse(answer)?.error?.message || detail; } catch { /* not JSON */ }
      return NextResponse.json({ error: DEV ? `OpenAI ${r.status}: ${detail}` : 'Voice chat is not available right now.' }, { status: 502 });
    }
    return new Response(answer, { headers: { 'Content-Type': 'application/sdp', 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[voice] OpenAI request error', err);
    return NextResponse.json({ error: DEV ? `Could not reach OpenAI: ${err instanceof Error ? err.message : err}` : 'Voice chat is not available right now.' }, { status: 502 });
  }
}

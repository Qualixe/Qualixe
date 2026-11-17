import { NextResponse } from 'next/server';
import { clientIp, getVisitorConversation, overLimit } from '@/lib/chatServer';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

const DEV = process.env.NODE_ENV !== 'production';

/**
 * POST /api/chat/:id/voice/token — start a voice call with "Moon" on ElevenLabs
 * (GPT brain + realistic Bangla voice). Returns a one-time WebRTC conversation token.
 *
 * If ElevenLabs isn't configured (or VOICE_PROVIDER=openai) it answers
 * { fallback: 'openai' } and the widget uses the OpenAI Realtime route instead.
 */
export async function POST(req: Request, { params }: Ctx) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;
  if (process.env.VOICE_PROVIDER === 'openai' || !apiKey || !agentId) {
    return NextResponse.json({ fallback: 'openai' });
  }

  const { id } = await params;
  const convo = await getVisitorConversation(id, req.headers.get('x-chat-token'));
  if (!convo) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });

  // Cost guard (shared with the OpenAI route): 4 calls per chat per hour, 8 per IP per hour
  if (overLimit(`voice:c:${id}`, 4, 60 * 60_000) || overLimit(`voice:ip:${clientIp(req)}`, 8, 60 * 60_000)) {
    return NextResponse.json({ error: 'Voice call limit reached — please try again later or type your message.' }, { status: 429 });
  }

  try {
    const r = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${encodeURIComponent(agentId)}`,
      { headers: { 'xi-api-key': apiKey }, cache: 'no-store' },
    );
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !data.token) {
      console.error('[voice] ElevenLabs token failed', r.status, JSON.stringify(data).slice(0, 400));
      const detail = data?.detail?.message || data?.detail || r.status;
      return NextResponse.json(
        { error: DEV ? `ElevenLabs: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}` : 'Voice chat is not available right now.' },
        { status: 502 },
      );
    }
    return NextResponse.json({ provider: 'elevenlabs', token: data.token }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[voice] ElevenLabs request error', err);
    return NextResponse.json({ error: 'Voice chat is not available right now.' }, { status: 502 });
  }
}

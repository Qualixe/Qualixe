'use client';

/**
 * AI voice call ("Moon") for the live chat widget.
 *
 * Primary: ElevenLabs agent (GPT brain + realistic Bangla voice) — our server hands
 * out a one-time token (/api/chat/:id/voice/token).
 * Fallback: OpenAI Realtime over WebRTC (/api/chat/:id/voice) when ElevenLabs isn't
 * configured or VOICE_PROVIDER=openai.
 *
 * API keys never reach the browser. Each finished sentence is saved to the chat via
 * /api/chat/:id/transcript so the team can read it in the dashboard / admin app.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { VOICE_GREETING as GREETING } from '@/lib/voiceGreeting';

export const VOICE_MAX_SECONDS = 300; // keep in sync with src/lib/voiceAgent.ts


export type VoiceState = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'error';

type SavedMsg = { id: string; sender: 'visitor' | 'admin'; body: string; created_at: string };

type Opts = {
  
  onSaved: (m: SavedMsg) => void;
};

export function useVoiceCall({ onSaved }: Opts) {
  const [state, setState] = useState<VoiceState>('idle');
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const micRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionRef = useRef<{ conversationId: string; token: string } | null>(null);
  const elevenRef = useRef<{ endSession: () => Promise<void> } | null>(null);
  const liveRef = useRef(false); // a call is starting or running
  const genRef = useRef(0); // bumps on every hang-up, so late async results are ignored
  const onSavedRef = useRef(onSaved);
  useEffect(() => { onSavedRef.current = onSaved; }, [onSaved]);

  // Keep transcript lines in spoken order: the visitor's transcription can finish
  // after the AI's reply, so AI lines wait (briefly) for the pending visitor line.
  const chain = useRef<Promise<void>>(Promise.resolve());
  const userLine = useRef<{ promise: Promise<string>; resolve: (t: string) => void } | null>(null);

  const save = useCallback((role: 'visitor' | 'ai', text: string) => {
    const s = sessionRef.current;
    const clean = text.trim();
    if (!s || !clean) return Promise.resolve();
    return fetch(`/api/chat/${s.conversationId}/transcript`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-chat-token': s.token },
      body: JSON.stringify({ role, text: clean }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.message) onSavedRef.current(d.message); })
      .catch(() => { /* transcript is best-effort */ });
  }, []);

  /**
   * Tool "find_demos" (used by both providers): search our demos, drop clickable
   * links into the chat, and give Moon a short summary to talk about (no URLs —
   * she shouldn't read links aloud).
   */
  const findDemos = useCallback(async (args: { query?: string; platform?: string }) => {
    const query = String(args?.query ?? '').slice(0, 200);
    const platform = args?.platform === 'laravel' || args?.platform === 'shopify' ? args.platform : 'any';
    try {
      const r = await fetch(`/api/voice/demos?q=${encodeURIComponent(query)}&platform=${platform}`);
      const data = (await r.json()) as {
        note?: string;
        matches?: { name: string; label: string; category: string; summary: string; url: string | null; page: string | null }[];
      };
      const matches = data.matches ?? [];
      if (matches.length) {
        const origin = window.location.origin;
        const lines = matches.map((m) => {
          const link = m.url || (m.page ? origin + m.page : '');
          return `• ${m.name} — ${m.label}${m.category ? ` (${m.category})` : ''}${link ? `\n  ${link}` : ''}`;
        });
        const text = `🔗 Demos for “${query}”:\n${lines.join('\n')}`;
        chain.current = chain.current.then(() => save('ai', text));
      }
      return JSON.stringify({
        note: data.note ?? '',
        links_shown_in_chat: matches.length > 0,
        matches: matches.map(({ name, label, category, summary }) => ({ name, type: label, category, summary: summary.slice(0, 160) })),
      });
    } catch {
      return JSON.stringify({ note: 'Demo search is unavailable right now. Offer to have the team send examples by email.', matches: [] });
    }
  }, [save]);

  const cleanup = useCallback(() => {
    genRef.current += 1;
    liveRef.current = false;
    const eleven = elevenRef.current;
    elevenRef.current = null;
    eleven?.endSession().catch(() => {});
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    pcRef.current?.getSenders().forEach((s) => s.track?.stop());
    pcRef.current?.close();
    pcRef.current = null;
    dcRef.current = null;
    micRef.current?.getTracks().forEach((t) => t.stop());
    micRef.current = null;
    if (audioRef.current) {
      audioRef.current.srcObject = null;
      audioRef.current = null;
    }
    userLine.current?.resolve('');
    userLine.current = null;
  }, []);

  const end = useCallback(() => {
    cleanup();
    setState('idle');
    setSeconds(0);
  }, [cleanup]);

  const fail = useCallback((msg: string) => {
    cleanup();
    setError(msg);
    setState('error');
    setSeconds(0);
  }, [cleanup]);

  const handleEvent = useCallback((ev: { type: string; transcript?: string; name?: string; call_id?: string; arguments?: string }) => {
    switch (ev.type) {
      case 'response.function_call_arguments.done': {
        if (ev.name !== 'find_demos' || !ev.call_id) break;
        let args = {};
        try { args = JSON.parse(ev.arguments || '{}'); } catch { /* use defaults */ }
        const callId = ev.call_id;
        findDemos(args).then((output) => {
          const dc = dcRef.current;
          if (!dc || dc.readyState !== 'open') return;
          dc.send(JSON.stringify({ type: 'conversation.item.create', item: { type: 'function_call_output', call_id: callId, output } }));
          dc.send(JSON.stringify({ type: 'response.create' }));
        });
        break;
      }
      case 'input_audio_buffer.speech_started':
        setState('listening');
        break;
      case 'input_audio_buffer.committed': {
        // A visitor turn ended — its transcript will arrive later
        let resolve!: (t: string) => void;
        const promise = new Promise<string>((r) => { resolve = r; });
        userLine.current = { promise, resolve };
        const p = promise;
        chain.current = chain.current.then(async () => {
          const text = await Promise.race([p, new Promise<string>((r) => setTimeout(() => r(''), 6000))]);
          if (text) await save('visitor', text);
        });
        setState('thinking');
        break;
      }
      case 'conversation.item.input_audio_transcription.completed':
        userLine.current?.resolve(ev.transcript ?? '');
        userLine.current = null;
        break;
      case 'response.created':
        setState('thinking');
        break;
      case 'response.output_audio.delta':
      case 'response.output_audio_transcript.delta':
      case 'output_audio_buffer.started':
        setState('speaking');
        break;
      case 'response.output_audio_transcript.done':
      case 'response.audio_transcript.done': {
        const text = ev.transcript ?? '';
        chain.current = chain.current.then(() => save('ai', text));
        break;
      }
      case 'output_audio_buffer.stopped':
      case 'response.done':
        setState((s) => (s === 'speaking' || s === 'thinking' ? 'listening' : s));
        break;
      case 'error':
        console.warn('[voice] realtime error event', ev);
        break;
    }
  }, [save, findDemos]);

  const startTimer = useCallback((onLimit: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const startedAt = Date.now();
    timerRef.current = setInterval(() => {
      const s = Math.floor((Date.now() - startedAt) / 1000);
      setSeconds(s);
      if (s >= VOICE_MAX_SECONDS) onLimit();
    }, 1000);
  }, []);

  const micError = (err: unknown) => {
    const name = err instanceof DOMException ? err.name : '';
    if (name === 'NotAllowedError' || name === 'SecurityError') return 'Microphone access was blocked. Allow it in your browser to talk.';
    if (name === 'NotFoundError') return 'No microphone found.';
    return err instanceof Error ? err.message : 'Voice chat is not available right now.';
  };

  const start = useCallback(async (session: { conversationId: string; token: string }) => {
    if (liveRef.current) return;
    liveRef.current = true;
    const gen = genRef.current;
    setError('');
    setSeconds(0);
    setState('connecting');
    sessionRef.current = session;

    // Browsers only expose the microphone on https:// (or http://localhost)
    if (!window.isSecureContext) {
      fail('Voice chat needs a secure (https) connection — open the site over https to talk.');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === 'undefined') {
      fail('Voice chat isn’t supported in this browser. Try Chrome, Edge, Safari or Firefox.');
      return;
    }

    // ── 1. Try ElevenLabs (realistic Bangla voice) ──
    let elevenToken: string | null = null;
    try {
      const r = await fetch(`/api/chat/${session.conversationId}/voice/token`, {
        method: 'POST',
        headers: { 'x-chat-token': session.token },
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || 'Voice chat is not available right now.');
      elevenToken = data.token ?? null; // null → server said { fallback: 'openai' }
    } catch (err) {
      fail(micError(err));
      return;
    }
    if (genRef.current !== gen) return; // hung up meanwhile

    if (elevenToken) {
      try {
        const { VoiceConversation } = await import('@elevenlabs/client');
        // A visitor line and Moon's reply in the same turn share one event_id — dedupe per speaker
        const seen = new Set<string>();
        const conv = await VoiceConversation.startSession({
          conversationToken: elevenToken,
          connectionType: 'webrtc',
          clientTools: { find_demos: findDemos },
          onConnect: () => {
            setState('listening');
            startTimer(() => end());
          },
          onModeChange: ({ mode }) => setState(mode === 'speaking' ? 'speaking' : 'listening'),
          onMessage: (m) => {
            const fromAgent = m.role === 'agent' || m.source === 'ai';
            const key = `${fromAgent ? 'ai' : 'visitor'}:${m.event_id}`;
            if (seen.has(key)) return;
            seen.add(key);
            chain.current = chain.current.then(() => save(fromAgent ? 'ai' : 'visitor', m.message));
          },
          onDisconnect: () => {
            // Ended by the agent / time limit / network (our own hang-up clears elevenRef first)
            if (elevenRef.current) {
              elevenRef.current = null;
              end();
            }
          },
          onError: (message) => console.warn('[voice] ElevenLabs:', message),
        });
        if (genRef.current !== gen) {
          conv.endSession().catch(() => {});
          return;
        }
        elevenRef.current = conv;
      } catch (err) {
        fail(micError(err));
      }
      return;
    }

    // ── 2. Fallback: OpenAI Realtime ──
    try {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      micRef.current = mic;

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audio = new Audio();
      audio.autoplay = true;
      audioRef.current = audio;
      pc.ontrack = (e) => { audio.srcObject = e.streams[0]; };
      pc.addTrack(mic.getTracks()[0], mic);

      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;
      dc.onmessage = (e) => {
        try { handleEvent(JSON.parse(e.data)); } catch { /* ignore malformed */ }
      };
      dc.onopen = () => {
        setState('listening');
        // Moon greets first
        dc.send(JSON.stringify({
          type: 'response.create',
          response: { instructions: `Greet the visitor warmly in Bangla with your natural Bangladeshi accent. Say exactly: "${GREETING}" Then stop and wait for them.` },
        }));
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed') fail('The voice connection dropped. Please try again.');
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const res = await fetch(`/api/chat/${session.conversationId}/voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/sdp', 'x-chat-token': session.token },
        body: offer.sdp,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Voice chat is not available right now.');
      }
      if (!pcRef.current) return; // hung up while connecting
      await pc.setRemoteDescription({ type: 'answer', sdp: await res.text() });

      startTimer(() => end());
    } catch (err) {
      fail(micError(err));
    }
  }, [end, fail, handleEvent, save, startTimer, findDemos]);

  // Hang up if the widget unmounts
  useEffect(() => cleanup, [cleanup]);

  const active = state === 'connecting' || state === 'listening' || state === 'thinking' || state === 'speaking';
  return { state, error, seconds, active, start, end, clearError: () => setError('') };
}

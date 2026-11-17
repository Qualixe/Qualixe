'use client';

/**
 * AI voice call for the live chat widget (OpenAI Realtime over WebRTC).
 * Audio flows browser ⇄ OpenAI directly; our server only brokers the connection
 * (/api/chat/:id/voice) so the API key stays private. Each finished sentence is
 * saved to the chat via /api/chat/:id/transcript so the team can read it.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export const VOICE_MAX_SECONDS = 300; // keep in sync with src/lib/voiceAgent.ts

/** Moon's opening line (Bangla script gives the model the right pronunciation) */
const GREETING = 'হ্যালো, আসসালামু আলাইকুম! আমি মুন, Qualixe থেকে বলছি। আপনার প্রজেক্ট নিয়ে কীভাবে সাহায্য করতে পারি?';

export type VoiceState = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'error';

type SavedMsg = { id: string; sender: 'visitor' | 'admin'; body: string; created_at: string };

type Opts = {
  /** Called with each transcript line once it's saved, so the widget can show it */
  onSaved: (m: SavedMsg) => void;
};

export function useVoiceCall({ onSaved }: Opts) {
  const [state, setState] = useState<VoiceState>('idle');
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const micRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionRef = useRef<{ conversationId: string; token: string } | null>(null);
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

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    pcRef.current?.getSenders().forEach((s) => s.track?.stop());
    pcRef.current?.close();
    pcRef.current = null;
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

  const handleEvent = useCallback((ev: { type: string; transcript?: string }) => {
    switch (ev.type) {
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
  }, [save]);

  const start = useCallback(async (session: { conversationId: string; token: string }) => {
    if (pcRef.current) return;
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

      const startedAt = Date.now();
      timerRef.current = setInterval(() => {
        const s = Math.floor((Date.now() - startedAt) / 1000);
        setSeconds(s);
        if (s >= VOICE_MAX_SECONDS) end();
      }, 1000);
    } catch (err) {
      const name = err instanceof DOMException ? err.name : '';
      if (name === 'NotAllowedError' || name === 'SecurityError') fail('Microphone access was blocked. Allow it in your browser to talk.');
      else if (name === 'NotFoundError') fail('No microphone found.');
      else fail(err instanceof Error ? err.message : 'Voice chat is not available right now.');
    }
  }, [end, fail, handleEvent]);

  // Hang up if the widget unmounts
  useEffect(() => cleanup, [cleanup]);

  const active = state === 'connecting' || state === 'listening' || state === 'thinking' || state === 'speaking';
  return { state, error, seconds, active, start, end, clearError: () => setError('') };
}

'use client';

/**
 * Website live chat widget.
 * Visitors chat on the site; the team replies from /dashboard/live-chat.
 * Talks only to /api/chat/* (never to the database directly). The visitor's
 * conversation id + secret token are kept in localStorage so the chat survives
 * page changes and return visits.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useVoiceCall, VOICE_MAX_SECONDS } from './useVoiceCall';
import './WhatsAppChat.css';

// Voice-call transcript lines are stored with these prefixes (see src/lib/voiceAgent.ts)
const AI_PREFIX = '🤖 ';
const VOICE_PREFIX = '🎙️ ';

const VOICE_LABEL: Record<string, string> = {
  connecting: 'Connecting…',
  listening: 'Listening — go ahead and talk',
  thinking: 'Thinking…',
  speaking: 'Speaking…',
};
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const WA_NUMBER = '8801318552266';
const FB_MESSENGER = 'https://m.me/qualixe';
const STORE_KEY = 'qx.livechat';

const QUICK_REPLIES = [
  'I need a Shopify store',
  'Shopify app development',
  'Laravel / web app project',
  'I want a free quote',
];

type Msg = { id: string; sender: 'visitor' | 'admin'; body: string; created_at: string; pending?: boolean; failed?: boolean };
type Session = { conversationId: string; token: string };

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}
function saveSession(s: Session | null) {
  try {
    if (s) localStorage.setItem(STORE_KEY, JSON.stringify(s));
    else localStorage.removeItem(STORE_KEY);
  } catch { /* storage unavailable */ }
}

const timeOf = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export default function WhatsAppChat() {
  const [open, setOpen] = useState(false);
  // Restored from localStorage on first render (the UI doesn't depend on it until messages load)
  const [session, setSession] = useState<Session | null>(() => (typeof window === 'undefined' ? null : loadSession()));
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [seenAdmin, setSeenAdmin] = useState(0);
  const [hasEmail, setHasEmail] = useState(true);
  const [contact, setContact] = useState({ name: '', email: '' });
  const [contactSaved, setContactSaved] = useState(false);
  const [greetTime] = useState(() => new Date().toISOString());

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const lastAt = useRef<string | null>(null);

  /** Fetch messages (all, or only new ones) */
  const poll = useCallback(async (full = false) => {
    if (!session) return;
    const url = `/api/chat/${session.conversationId}${!full && lastAt.current ? `?after=${encodeURIComponent(lastAt.current)}` : ''}`;
    try {
      const res = await fetch(url, { headers: { 'x-chat-token': session.token }, cache: 'no-store' });
      if (res.status === 404) {
        // Conversation gone (e.g. deleted by admin) — start fresh next time
        saveSession(null);
        setSession(null);
        setMessages([]);
        lastAt.current = null;
        return;
      }
      if (!res.ok) return;
      const data = (await res.json()) as { messages: Msg[]; hasEmail: boolean };
      setHasEmail(data.hasEmail);
      if (data.messages.length) {
        lastAt.current = data.messages[data.messages.length - 1].created_at;
        // History loaded on page load counts as already seen
        if (full) setSeenAdmin(data.messages.filter((m) => m.sender === 'admin').length);
        setMessages((prev) => {
          const base = full ? [] : prev.filter((m) => !m.pending);
          const ids = new Set(base.map((m) => m.id));
          return [...base, ...data.messages.filter((m) => !ids.has(m.id))];
        });
      }
    } catch { /* offline — try again next tick */ }
  }, [session]);

  // Initial load when a session exists
  useEffect(() => {
    if (session) poll(true);
  }, [session, poll]);

  // Poll: every 4s while open, every 25s while closed (for the unread badge)
  useEffect(() => {
    if (!session) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      poll();
    }, open ? 4000 : 25000);
    return () => clearInterval(id);
  }, [session, open, poll]);

  // ── AI voice call ─────────────────────────────────────
  const onVoiceSaved = useCallback((m: Msg) => {
    lastAt.current = m.created_at;
    setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
    if (m.sender === 'admin') setSeenAdmin((n) => n + 1); // heard it live — not "unread"
  }, []);
  const voice = useVoiceCall({ onSaved: onVoiceSaved });
  const hangUp = voice.end; // stable; closing the widget always hangs up

  // Unread badge = team replies that arrived while the window was closed
  const adminCount = messages.filter((m) => m.sender === 'admin').length;
  const unread = open ? 0 : Math.max(0, adminCount - seenAdmin);

  const toggleOpen = () => {
    setSeenAdmin(adminCount); // opening or closing marks everything so far as seen
    if (open) hangUp();
    setOpen((o) => !o);
  };

  // Keep the newest message in view
  useEffect(() => {
    if (open) bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  // Escape closes; focus the input when opening
  useEffect(() => {
    if (!open) return;
    const f = setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { hangUp(); setOpen(false); } };
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(f); document.removeEventListener('keydown', onKey); };
  }, [open, hangUp]);

  const startVoice = async () => {
    if (voice.active) return;
    setError('');
    voice.clearError();
    let s = session;
    if (!s) {
      // Voice needs a conversation to attach the transcript to
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `${VOICE_PREFIX}Started a voice call with the AI assistant`, pageUrl: window.location.href }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not start the call');
        s = { conversationId: data.conversationId, token: data.token };
        saveSession(s);
        lastAt.current = data.messages[data.messages.length - 1]?.created_at ?? null;
        setMessages(data.messages);
        setHasEmail(false);
        setSession(s);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not start the call');
        return;
      }
    }
    voice.start(s);
  };

  const send = async (raw?: string) => {
    const body = (raw ?? text).trim();
    if (!body || sending) return;
    setError('');
    setSending(true);
    setText('');
    const tempId = `tmp-${Date.now()}`;
    setMessages((prev) => [...prev, { id: tempId, sender: 'visitor', body, created_at: new Date().toISOString(), pending: true }]);

    try {
      if (!session) {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: body, pageUrl: window.location.href }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Message could not be sent');
        const s = { conversationId: data.conversationId, token: data.token };
        saveSession(s);
        lastAt.current = data.messages[data.messages.length - 1]?.created_at ?? null;
        setMessages(data.messages);
        setHasEmail(false);
        setSession(s);
      } else {
        const res = await fetch(`/api/chat/${session.conversationId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-chat-token': session.token },
          body: JSON.stringify({ message: body }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Message could not be sent');
        lastAt.current = data.message.created_at;
        setMessages((prev) => [...prev.filter((m) => m.id !== tempId), data.message]);
      }
    } catch (err) {
      setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, pending: false, failed: true } : m)));
      setError(err instanceof Error ? err.message : 'Message could not be sent');
      setText(body);
    } finally {
      setSending(false);
    }
  };

  const saveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !contact.email.trim()) return;
    setError('');
    try {
      const res = await fetch(`/api/chat/${session.conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-chat-token': session.token },
        body: JSON.stringify(contact),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save your details');
      setHasEmail(true);
      setContactSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your details');
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const hasVisitorMsg = messages.some((m) => m.sender === 'visitor' && !m.failed);
  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text.trim() || 'Hi! I am interested to know more about your services.')}`;
  const tab = open ? 0 : -1;

  return (
    <div className={`wa-widget${open ? ' is-open' : ''}`}>
      <div className="wa-panel" role="dialog" aria-label="Live chat with Qualixe" aria-hidden={!open}>
        <header className="wa-head">
          <span className="wa-head__avatar" aria-hidden="true">
            Q
            <span className="wa-head__online" />
          </span>
          <div className="wa-head__info">
            <strong>Qualixe</strong>
            <span>Live chat · we&apos;ll reply right here</span>
          </div>
          <button type="button" className="wa-head__close" onClick={() => { setSeenAdmin(adminCount); hangUp(); setOpen(false); }} aria-label="Close chat" tabIndex={tab}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7a1 1 0 1 0-1.4 1.4l4.9 4.9-4.9 4.9a1 1 0 1 0 1.4 1.4l4.9-4.9 4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4Z" /></svg>
          </button>
        </header>

        <div className="wa-body" ref={bodyRef} aria-live="polite">
          <span className="wa-day">Today</span>

          {/* Greeting (shown locally, not stored) */}
          <div className="wa-bubble">
            <p><strong>Hi there 👋</strong></p>
            <p>Thanks for visiting Qualixe! Ask us anything about your project — our team will reply right here.</p>
            <span className="wa-bubble__time">{timeOf(greetTime)}</span>
          </div>

          {messages.map((m) => {
            const isAi = m.sender === 'admin' && m.body.startsWith(AI_PREFIX);
            const isVoice = m.sender === 'visitor' && m.body.startsWith(VOICE_PREFIX);
            const body = isAi ? m.body.slice(AI_PREFIX.length) : isVoice ? m.body.slice(VOICE_PREFIX.length) : m.body;
            return (
            <div
              key={m.id}
              className={`wa-bubble${m.sender === 'visitor' ? ' wa-bubble--me' : ''}${isAi ? ' wa-bubble--ai' : ''}${m.pending ? ' is-pending' : ''}${m.failed ? ' is-failed' : ''}`}
            >
              {m.sender === 'admin' && <span className="wa-bubble__from">{isAi ? 'Moon · Qualixe AI' : 'Qualixe team'}</span>}
              {isVoice && <span className="wa-bubble__from wa-bubble__from--voice">You · voice</span>}
              <p>{body}</p>
              <span className="wa-bubble__time">
                {m.failed ? 'Not sent' : m.pending ? 'Sending…' : timeOf(m.created_at)}
                {m.sender === 'visitor' && !m.pending && !m.failed && <span className="wa-tick" aria-label="Sent"> ✓</span>}
              </span>
            </div>
            );
          })}

          {!hasVisitorMsg && (
            <div className="wa-quick" aria-label="Quick replies">
              {QUICK_REPLIES.map((q) => (
                <button key={q} type="button" className="wa-quick__btn" onClick={() => send(q)} tabIndex={tab} disabled={sending}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Ask for an email so the team can follow up if the visitor leaves */}
          {session && hasVisitorMsg && !hasEmail && !contactSaved && (
            <form className="wa-contact" onSubmit={saveContact}>
              <p>Leave your email so we can reply even if you leave the site.</p>
              <input
                type="text"
                placeholder="Your name (optional)"
                value={contact.name}
                onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                autoComplete="name"
                tabIndex={tab}
              />
              <div className="wa-contact__row">
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={contact.email}
                  onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                  autoComplete="email"
                  required
                  tabIndex={tab}
                />
                <button type="submit" tabIndex={tab}>Save</button>
              </div>
            </form>
          )}
          {contactSaved && <p className="wa-note">✓ Thanks! We&apos;ll follow up by email if we miss you here.</p>}
        </div>

        {(error || voice.error) && <p className="wa-error" role="alert">{error || voice.error}</p>}

        {voice.active ? (
          <div className={`wa-voice is-${voice.state}`} role="status" aria-live="polite">
            <span className="wa-voice__orb" aria-hidden="true"><span /><span /><span /></span>
            <div className="wa-voice__info">
              <strong>{VOICE_LABEL[voice.state] ?? ''}</strong>
              <span>Moon · AI assistant · {mmss(voice.seconds)} / {mmss(VOICE_MAX_SECONDS)}</span>
            </div>
            <button type="button" className="wa-voice__end" onClick={voice.end} tabIndex={tab}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.996.996 0 0 1 0-1.41C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85.996.996 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9Z" /></svg>
              End
            </button>
          </div>
        ) : (
        <form className="wa-compose" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <button type="button" className="wa-mic" aria-label="Talk to Moon, our AI assistant" title="Talk to Moon, our AI assistant" onClick={startVoice} tabIndex={tab}>
            <span className="wa-mic__ring" aria-hidden="true" />
            <span className="wa-mic__ring" aria-hidden="true" />
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z" /></svg>
          </button>
          <textarea
            ref={inputRef}
            className="wa-compose__input"
            rows={1}
            maxLength={2000}
            placeholder="Type your message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Your message"
            tabIndex={tab}
          />
          <button type="submit" className="wa-compose__send" aria-label="Send message" disabled={sending || !text.trim()} tabIndex={tab}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M3.4 20.4 21 12 3.4 3.6 3.39 10 16 12 3.39 14z" /></svg>
          </button>
        </form>
        )}

        <div className="wa-foot">
          <span>Prefer another app?</span>
          <span className="wa-foot__links">
            <a href={waHref} target="_blank" rel="noopener noreferrer" tabIndex={tab} className="wa-foot__wa">WhatsApp</a>
            <span aria-hidden="true">·</span>
            <a href={FB_MESSENGER} target="_blank" rel="noopener noreferrer" tabIndex={tab}>Messenger</a>
          </span>
        </div>
      </div>

      <button
        type="button"
        className="wa-launcher"
        onClick={toggleOpen}
        aria-label={open ? 'Close live chat' : `Open live chat${unread ? ` (${unread} new)` : ''}`}
        aria-expanded={open}
      >
        <span className="wa-launcher__icon wa-launcher__icon--wa" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M12 3C6.48 3 2 6.92 2 11.75c0 2.47 1.17 4.7 3.06 6.28-.12 1.2-.6 2.66-1.66 3.72 0 0 2.95-.15 5.14-1.86.99.27 2.15.41 3.46.41 5.52 0 10-3.92 10-8.55S17.52 3 12 3Zm-4 9.75a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm4 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm4 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" /></svg>
        </span>
        <span className="wa-launcher__icon wa-launcher__icon--close" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7a1 1 0 1 0-1.4 1.4l4.9 4.9-4.9 4.9a1 1 0 1 0 1.4 1.4l4.9-4.9 4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4Z" /></svg>
        </span>
        {!open && unread > 0 && <span className="wa-launcher__badge">{unread}</span>}
        {!open && !unread && <span className="wa-launcher__ping" aria-hidden="true" />}
      </button>
    </div>
  );
}

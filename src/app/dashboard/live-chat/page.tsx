'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { supabase } from '../../../../lib/supabaseClient';
import { liveChatAPI, type ChatConversation, type ChatMessage } from '../../../../lib/api/liveChat';
import './live-chat.css';

type Filter = 'open' | 'unread' | 'closed' | 'all';

function timeAgo(iso?: string | null) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return d < 7 ? `${d}d` : new Date(iso).toLocaleDateString();
}
const clock = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const nameOf = (c: ChatConversation) => c.visitor_name || c.visitor_email || `Visitor ${c.id.slice(0, 4).toUpperCase()}`;
const initials = (c: ChatConversation) => nameOf(c).replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase() || 'V';

/** Short "ding" via Web Audio (no asset needed) */
function ding() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    o.start(); o.stop(ctx.currentTime + 0.36);
  } catch { /* audio blocked */ }
}

function LiveChatInbox() {
  const params = useSearchParams();
  const [convos, setConvos] = useState<ChatConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(params.get('c'));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [filter, setFilter] = useState<Filter>('open');
  const [query, setQuery] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileThread, setMobileThread] = useState(Boolean(params.get('c')));
  const threadRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(activeId);
  activeRef.current = activeId;

  const loadConvos = useCallback(async () => {
    try {
      setConvos(await liveChatAPI.listConversations());
      setError('');
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      setError(/relation|does not exist|schema cache/i.test(msg)
        ? 'Live chat tables are missing — run lib/live-chat-schema.sql in Supabase.'
        : msg || 'Could not load conversations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadConvos(); }, [loadConvos]);

  // Load the open thread + mark it read
  useEffect(() => {
    if (!activeId) return;
    let alive = true;
    liveChatAPI.getMessages(activeId).then((m) => { if (alive) setMessages(m); }).catch(() => {});
    liveChatAPI.markRead(activeId)
      .then(() => setConvos((cs) => cs.map((c) => (c.id === activeId ? { ...c, unread_admin: 0 } : c))))
      .catch(() => {});
    return () => { alive = false; };
  }, [activeId]);

  // Realtime: new messages + conversation updates
  useEffect(() => {
    const channel = supabase
      .channel('admin-live-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        const m = payload.new as ChatMessage;
        if (m.conversation_id === activeRef.current) {
          setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
          if (m.sender === 'visitor') liveChatAPI.markRead(m.conversation_id).catch(() => {});
        }
        if (m.sender === 'visitor') ding();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_conversations' }, (payload) => {
        if (payload.eventType === 'DELETE') {
          const id = (payload.old as { id: string }).id;
          setConvos((cs) => cs.filter((c) => c.id !== id));
          return;
        }
        const c = payload.new as ChatConversation;
        setConvos((cs) => {
          const next = cs.some((x) => x.id === c.id) ? cs.map((x) => (x.id === c.id ? { ...x, ...c } : x)) : [c, ...cs];
          // the open thread is being read right now
          return next
            .map((x) => (x.id === activeRef.current ? { ...x, unread_admin: 0 } : x))
            .sort((a, b) => +new Date(b.last_message_at) - +new Date(a.last_message_at));
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Keep the thread scrolled to the newest message
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const active = convos.find((c) => c.id === activeId) ?? null;
  const totalUnread = convos.reduce((n, c) => n + (c.unread_admin || 0), 0);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return convos.filter((c) => {
      if (filter === 'open' && c.status !== 'open') return false;
      if (filter === 'closed' && c.status !== 'closed') return false;
      if (filter === 'unread' && !c.unread_admin) return false;
      if (!q) return true;
      return [c.visitor_name, c.visitor_email, c.last_message_preview].some((v) => v?.toLowerCase().includes(q));
    });
  }, [convos, filter, query]);

  const open = (id: string) => {
    setActiveId(id);
    setMessages([]);
    setMobileThread(true);
    setReply('');
  };

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!activeId || !reply.trim() || sending) return;
    setSending(true);
    try {
      const m = await liveChatAPI.reply(activeId, reply);
      setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
      setReply('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reply failed');
    } finally {
      setSending(false);
    }
  };

  const toggleStatus = async () => {
    if (!active) return;
    const next = active.status === 'open' ? 'closed' : 'open';
    await liveChatAPI.setStatus(active.id, next).catch(() => {});
    setConvos((cs) => cs.map((c) => (c.id === active.id ? { ...c, status: next } : c)));
  };

  const remove = async () => {
    if (!active || !confirm('Delete this conversation permanently? This cannot be undone.')) return;
    await liveChatAPI.remove(active.id).catch(() => {});
    setConvos((cs) => cs.filter((c) => c.id !== active.id));
    setActiveId(null);
    setMobileThread(false);
  };

  return (
    <div className="dashboard-wrapper">
      <DashboardSidebar />
      <div className="main-content">
        <DashboardHeader
          icon="bi-chat-dots"
          title="Live Chat"
          subtitle={totalUnread ? `${totalUnread} unread` : 'inbox'}
        />

        {error && <div className="alert alert-warning">{error}</div>}

        <div className={`lc-inbox${mobileThread ? ' show-thread' : ''}`}>
          {/* Conversation list */}
          <aside className="lc-list" aria-label="Conversations">
            <div className="lc-list__head">
              <div className="lc-search">
                <i className="bi bi-search" aria-hidden="true" />
                <input type="search" placeholder="Search chats…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search conversations" />
              </div>
              <div className="lc-filters" role="tablist">
                {(['open', 'unread', 'closed', 'all'] as Filter[]).map((f) => (
                  <button key={f} type="button" role="tab" aria-selected={filter === f} className={filter === f ? 'is-active' : ''} onClick={() => setFilter(f)}>
                    {f[0].toUpperCase() + f.slice(1)}
                    {f === 'unread' && totalUnread > 0 && <span className="lc-filters__n">{totalUnread}</span>}
                  </button>
                ))}
              </div>
            </div>

            <ul className="lc-list__items">
              {loading ? (
                <li className="lc-empty">Loading…</li>
              ) : visible.length === 0 ? (
                <li className="lc-empty">
                  <i className="bi bi-chat-square-dots" aria-hidden="true" />
                  {convos.length === 0 ? 'No chats yet. They’ll appear here the moment a visitor writes.' : 'No conversations match.'}
                </li>
              ) : (
                visible.map((c) => (
                  <li key={c.id}>
                    <button type="button" className={`lc-item${c.id === activeId ? ' is-active' : ''}${c.unread_admin ? ' is-unread' : ''}`} onClick={() => open(c.id)}>
                      <span className="lc-avatar" aria-hidden="true">{initials(c)}</span>
                      <span className="lc-item__main">
                        <span className="lc-item__top">
                          <strong>{nameOf(c)}</strong>
                          <span className="lc-item__time">{timeAgo(c.last_message_at)}</span>
                        </span>
                        <span className="lc-item__preview">
                          {c.last_sender === 'admin' && <span className="lc-you">You: </span>}
                          {c.last_message_preview || '…'}
                        </span>
                      </span>
                      {c.unread_admin > 0 && <span className="lc-badge">{c.unread_admin}</span>}
                      {c.status === 'closed' && <span className="lc-closed">Closed</span>}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </aside>

          {/* Thread */}
          <section className="lc-thread" aria-label="Conversation">
            {!active ? (
              <div className="lc-placeholder">
                <span className="lc-placeholder__icon" aria-hidden="true"><i className="bi bi-chat-dots" /></span>
                <h3>Select a conversation</h3>
                <p>Replies you send here appear instantly in the visitor&apos;s chat window on the website.</p>
              </div>
            ) : (
              <>
                <header className="lc-thread__head">
                  <button type="button" className="lc-back" onClick={() => setMobileThread(false)} aria-label="Back to conversations">
                    <i className="bi bi-arrow-left" aria-hidden="true" />
                  </button>
                  <span className="lc-avatar" aria-hidden="true">{initials(active)}</span>
                  <div className="lc-thread__who">
                    <strong>{nameOf(active)}</strong>
                    <span>
                      {active.visitor_email ? <a href={`mailto:${active.visitor_email}`}>{active.visitor_email}</a> : 'No email left yet'}
                      {active.page_url && (
                        <> · <a href={active.page_url} target="_blank" rel="noopener noreferrer" title={active.page_url}>started on {(() => { try { return new URL(active.page_url).pathname; } catch { return 'page'; } })()}</a></>
                      )}
                    </span>
                  </div>
                  <div className="lc-thread__actions">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={toggleStatus}>
                      <i className={`bi ${active.status === 'open' ? 'bi-check2-circle' : 'bi-arrow-counterclockwise'} me-1`} aria-hidden="true" />
                      {active.status === 'open' ? 'Close' : 'Reopen'}
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={remove} aria-label="Delete conversation">
                      <i className="bi bi-trash" aria-hidden="true" />
                    </button>
                  </div>
                </header>

                <div className="lc-messages" ref={threadRef}>
                  <span className="lc-day">Started {new Date(active.created_at).toLocaleString()}</span>
                  {messages.map((m) => (
                    <div key={m.id} className={`lc-msg lc-msg--${m.sender}`}>
                      <p>{m.body}</p>
                      <span className="lc-msg__time">{m.sender === 'admin' ? 'You · ' : ''}{clock(m.created_at)}</span>
                    </div>
                  ))}
                </div>

                <form className="lc-reply" onSubmit={send}>
                  <textarea
                    rows={1}
                    maxLength={2000}
                    placeholder={`Reply to ${nameOf(active)}…`}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                    aria-label="Your reply"
                  />
                  <button type="submit" className="btn btn-primary" disabled={sending || !reply.trim()}>
                    <i className="bi bi-send" aria-hidden="true" /> <span>Send</span>
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function LiveChatPage() {
  return (
    <Suspense fallback={null}>
      <LiveChatInbox />
    </Suspense>
  );
}

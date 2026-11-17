// SERVER ONLY — imported exclusively by /api/chat route handlers (uses the service-role key).
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

/** Service-role client — server only. Visitors never get table access. */
export function chatDb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const MAX_MESSAGE = 2000;
export const RATE_LIMIT_PER_MINUTE = 15;

export function newToken() {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function cleanText(value: unknown, max: number) {
  return typeof value === 'string' ? value.replace(/\u0000/g, '').trim().slice(0, max) : '';
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Loads a conversation and checks the visitor's token. Returns null if it doesn't match. */
export async function getVisitorConversation(conversationId: string, token: string | null) {
  if (!token || !UUID_RE.test(conversationId)) return null;
  const { data } = await chatDb()
    .from('chat_conversations')
    .select('id, visitor_token_hash, visitor_name, visitor_email, status')
    .eq('id', conversationId)
    .maybeSingle();
  if (!data || !safeEqual(data.visitor_token_hash, hashToken(token))) return null;
  return data;
}

/** True if this conversation has sent too many visitor messages in the last minute */
export async function isRateLimited(conversationId: string) {
  const since = new Date(Date.now() - 60_000).toISOString();
  const { count } = await chatDb()
    .from('chat_messages')
    .select('id', { count: 'exact', head: true })
    .eq('conversation_id', conversationId)
    .eq('sender', 'visitor')
    .gte('created_at', since);
  return (count ?? 0) >= RATE_LIMIT_PER_MINUTE;
}

/**
 * Limit new conversations per IP (5 per 10 minutes) to stop spam bots flooding the inbox.
 * In-memory, so it resets on deploy and is per server instance — a basic guard, not a firewall.
 */
const startLog = new Map<string, number[]>();
export function tooManyNewChats(ip: string) {
  const now = Date.now();
  const recent = (startLog.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 5) {
    startLog.set(ip, recent);
    return true;
  }
  recent.push(now);
  startLog.set(ip, recent);
  if (startLog.size > 5000) startLog.clear(); // keep memory bounded
  return false;
}

/**
 * Generic in-memory sliding-window limiter (per server instance; resets on deploy).
 * Returns true when `key` already used `max` slots inside `windowMs`.
 */
const windows = new Map<string, number[]>();
export function overLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (windows.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    windows.set(key, recent);
    return true;
  }
  recent.push(now);
  windows.set(key, recent);
  if (windows.size > 10000) windows.clear(); // keep memory bounded
  return false;
}

export function clientIp(req: Request) {
  return (req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown').trim();
}

/** Public shape of a message (no admin ids) */
export const MESSAGE_FIELDS = 'id, sender, body, created_at';

function notifyAddress() {
  return (
    process.env.CHAT_NOTIFY_EMAIL ||
    (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map((e) => e.trim()).filter(Boolean)[0] ||
    ''
  );
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

/** Email the team about a new chat (skipped quietly if Resend isn't configured) */
export async function notifyNewChat(opts: { conversationId: string; message: string; name?: string; email?: string; pageUrl?: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = notifyAddress();
  if (!apiKey || !to) {
    console.warn('[live-chat] RESEND_API_KEY or notify address missing — new chat email not sent');
    return;
  }
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.qualixe.com';
  const who = opts.name || opts.email || 'A website visitor';
  try {
    await new Resend(apiKey).emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Qualixe <onboarding@resend.dev>',
      to,
      subject: `💬 New live chat from ${who}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:520px">
          <h2 style="margin:0 0 12px">New live chat on qualixe.com</h2>
          <p style="margin:0 0 6px"><strong>From:</strong> ${escapeHtml(who)}${opts.email ? ` (${escapeHtml(opts.email)})` : ''}</p>
          ${opts.pageUrl ? `<p style="margin:0 0 12px;color:#666"><strong>Page:</strong> ${escapeHtml(opts.pageUrl)}</p>` : ''}
          <blockquote style="margin:0 0 16px;padding:12px 14px;background:#f4f6fb;border-left:4px solid #2f5bea;border-radius:6px">${escapeHtml(opts.message)}</blockquote>
          <a href="${base}/dashboard/live-chat?c=${opts.conversationId}" style="display:inline-block;padding:10px 18px;background:#2f5bea;color:#fff;border-radius:8px;text-decoration:none">Reply in the dashboard</a>
        </div>`,
    });
  } catch (err) {
    console.error('[live-chat] failed to send notification email', err);
  }
}

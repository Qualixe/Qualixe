/**
 * Admin email list — read from NEXT_PUBLIC_ADMIN_EMAILS env var.
 * Set in .env (local) and Vercel dashboard (production).
 *
 * Format: comma-separated, no spaces
 * Example: NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,other@example.com
 */
export const ADMIN_EMAILS: string[] = (
  process.env.NEXT_PUBLIC_ADMIN_EMAILS || ''
)
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

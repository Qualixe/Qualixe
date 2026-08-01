# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js, localhost:3000)
npm run build    # Production build
npm run start    # Start production server (after build)
npm run lint     # ESLint (eslint-config-next core-web-vitals + typescript)
```

There is no test suite configured in this repo.

Database schema changes are applied by hand: SQL files live in `lib/*.sql` and must be run manually in the Supabase SQL Editor — there is no migration runner. When adding/changing a table, add a new `lib/<name>-schema.sql` (or a `*-migration.sql` / `*-fix.sql` file for changes to existing tables) rather than editing an already-applied schema file in place.

## Architecture

Next.js 15 App Router app with Supabase (Postgres + Auth + Storage) as the sole backend. There is no separate API server — `src/app/api/**/route.ts` route handlers are the backend.

### Route groups

- `src/app/(main)/` — public marketing/storefront site (home, about, services, portfolio, blog, shop, cart, checkout, contact, team, themes). The `(main)` group shares layout/header/footer with these pages.
- `src/app/dashboard/` — admin dashboard, mirrors the content types below one-to-one (`dashboard/blog`, `dashboard/portfolio`, `dashboard/brands`, `dashboard/clients`, `dashboard/themes`, `dashboard/products`, `dashboard/orders`, `dashboard/media`, `dashboard/files`, `dashboard/users`, `dashboard/analytics`, `dashboard/contacts`, `dashboard/settings`). Every dashboard page is wrapped in `ProtectedRoute` (`src/components/ProtectedRoute.tsx`), which checks for a Supabase session and then `authAPI.isAdmin()` before rendering, redirecting non-admins to `/` and unauthenticated users to `/login`.
- `src/app/account/` — customer-facing auth (`login`, `signup`, `forgot-password`, `reset-password`, `downloads`) for shop customers, distinct from the admin `/login` and `/signup` under root.
- `src/app/api/` — route handlers, split into two trust levels:
  - Public/customer endpoints: `products`, `create-payment`, `verify-payment`, `claim-free`, `get-download-token`, `download`, `my-orders`, `site-settings`.
  - Admin-only endpoints (expect an authenticated admin caller): `admin/users`, `upload-product`, `upload-preview`, `list-files`, `file-action`.

### Data access layer

All Supabase reads/writes for a given domain are centralized in `lib/api/<domain>.ts` (e.g. `lib/api/blog.ts`, `lib/api/portfolio.ts`, `lib/api/shop.ts`, `lib/api/users.ts`, `lib/api/analytics.ts`). Components and pages should call these instead of hitting `supabase` directly. Two Supabase clients exist:
- `lib/supabaseClient.ts` — anon-key client for client-side/browser use, subject to RLS.
- Route handlers that need to bypass RLS (webhooks, downloads, admin writes) construct their own service-role client inline via `createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)` — see `lib/api/shop.ts`, `src/app/api/lemonsqueezy-webhook/route.ts`. Never expose the service-role key to client components.

Auth/authorization logic lives in `lib/auth.ts` (`authAPI`). Admin status is resolved as `user_profiles.role === 'admin'` (also checking `status !== 'suspended'/'inactive'`), with `NEXT_PUBLIC_ADMIN_EMAILS` (parsed in `lib/adminEmails.ts`) as a fallback when no profile row exists yet.

### Digital product / checkout flow (Lemon Squeezy)

The shop sells digital products with license-gated downloads, independent of the portfolio/blog/CMS side of the site:
1. `src/app/(main)/shop` lists products (`lib/api/shop.ts` / `products` table); `CartContext` (`src/context/CartContext.tsx`) + `CartDrawer`/`CartIcon` handle client-side cart state.
2. Checkout posts to `POST /api/create-payment`, which creates a Lemon Squeezy hosted checkout for the product's `lemon_squeezy_variant_id` and redirects to `/shop/success?order_id={order_id}`. Free products go through `POST /api/claim-free` instead.
3. `POST /api/lemonsqueezy-webhook` is the source of truth for fulfillment: verifies the `x-signature` HMAC against `LEMONSQUEEZY_WEBHOOK_SECRET`, is idempotent on `orders.payment_id`, inserts an `orders` row and a `download_tokens` row (48h expiry, 10 download limit), and bumps `increment_sales_count` via RPC.
4. `GET /api/get-download-token?order_id=` looks up the token for the success page; `GET /api/download` (see `src/app/api/download/route.ts`) streams the file using the token, enforcing expiry/limit.
5. `src/app/account/downloads` and `/api/my-orders` let a customer look up past orders/downloads by email.

When touching this flow, keep `orders`/`download_tokens` writes on the service-role client (webhook and download routes run server-side, unauthenticated by Supabase Auth — the Lemon Squeezy signature and download token are the only guards).

### Analytics

`lib/api/analytics.ts` + `src/components/AnalyticsTracker.tsx` implement a custom, dependency-free analytics system (page views, sessions, device/browser/OS parsing, traffic sources) written directly to Supabase tables (`page_views`, `analytics_events`, `analytics_sessions`). It's mounted on the `(main)` public layout only — dashboard/admin pages are intentionally excluded from tracking. `src/app/dashboard/analytics` reads this data back out for the admin-facing charts (Chart.js).

### Images

`next.config.ts` allows any `https` remote image host (blog featured images, product previews, etc.) in addition to the Supabase storage bucket, and forces AVIF/WebP output at quality 75. Uploaded images go through `lib/uploadImage.ts` / `src/components/ImageUploadField.tsx` into a public Supabase Storage bucket named `images`, with per-domain subfolders (`portfolio/`, `brands/`, `clients/`, `themes/`, `blog/`).

## Environment variables

Required at runtime (no `.env.example` is checked in): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_ADMIN_EMAILS`, `NEXT_PUBLIC_BASE_URL`, `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`, `LEMONSQUEEZY_WEBHOOK_SECRET`, `NEXT_PUBLIC_GTM_ID`, `RESEND_API_KEY` (optional — email notifications for the `/shopify-headless` lead form fall back to a console warning and skip sending if unset), `RESEND_FROM_EMAIL` (optional, defaults to Resend's shared sandbox sender).

## Database

Schema files under `lib/*.sql` must be applied in Supabase in dependency order: `database.sql` → `blog-schema.sql` → `blog-rls-complete-fix.sql` → `analytics-schema.sql` → `users-schema.sql` (or `fix-user-profiles.sql` if the table already exists) → `shop-schema.sql` / `shopify-service-schema.sql` / other feature schemas as needed. See `SETUP_INSTRUCTIONS.md` for the fuller ordering and known migration error fixes (e.g. `fix-user-profiles.sql` for "column email does not exist").

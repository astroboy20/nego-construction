# Design Document — NEGO Website Enhancements

## Overview

This document describes the technical design for the multi-phase enhancement of the NEGO Construction Limited website (negoconstruction.com). The work is coordinated by Winerocks Group and extends the existing Next.js 16 App Router application with four capability areas:

1. **SEO and AEO** — dynamic sitemap, robots file, per-page metadata, JSON-LD structured data
2. **Privacy and Consent** — NDPR-compliant privacy policy page and cookie consent banner
3. **Admin Dashboard** — authenticated back-office for managing knowledge base content and reading contact enquiries
4. **AI Chatbot** — company-grounded conversational interface backed by the knowledge base

All enhancements must preserve existing public routes, the SiteShell component, brand styles, and TypeScript correctness. No fabricated company data may be introduced. No secrets may appear in client-side code.

### Key Technical Facts from Codebase Audit

- **Framework**: Next.js 16.3.0 (App Router, TypeScript, Tailwind CSS 4, shadcn/ui via `@base-ui/react`)
- **Proxy**: `src/proxy.ts` — `middleware.ts` is deprecated in Next.js 16; the exported function is named `proxy`
- **Analytics**: `@vercel/analytics` is already installed; the `<Analytics />` component is rendered conditionally in `src/app/layout.tsx` when `NODE_ENV === "production"`
- **Data source**: `src/lib/site-data.ts` — single source of truth for company info, 6 projects, services, team
- **Projects**: 6 slugs — `lily-park`, `alpha-court`, `imo-hills-farm`, `abacha-road`, `eku-baptist-hospital`, `comprehensive-healthcare-centre`
- **`metadataBase`**: Currently set to `https://negoconstruction.com` (without `www`). Requirement 2.5 mandates `https://www.negoconstruction.com`. This must be reconciled — the design adopts `https://www.negoconstruction.com` as canonical and aligns `metadataBase` accordingly.
- **`typescript.ignoreBuildErrors: true`** is set in `next.config.mjs` — requirement 13.6 expects a clean build, so new code must be TypeScript-correct regardless.
- **Route groups**: Used for layout isolation. The `(admin)` route group will contain the admin dashboard and its own layout without `SiteShell`.
- **No existing Supabase, auth, chatbot, sitemap, or robots files** — all are net-new additions.

---

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Vercel / CDN Edge                       │
│                                                             │
│   src/proxy.ts ──── auth guard on /admin/* paths           │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                  Next.js 16 App Router                       │
│                                                             │
│  Public Routes                  Admin Routes                │
│  ─────────────                  ─────────────               │
│  /                              /admin               (auth) │
│  /about                         /admin/login                │
│  /contact                       /admin/knowledge-base       │
│  /projects                      /admin/enquiries            │
│  /projects/[slug]               /admin/knowledge-base/new   │
│  /portfolio                     /admin/knowledge-base/[id]  │
│  /privacy-policy                                            │
│  /sitemap.xml  (metadata file)                              │
│  /robots.txt   (metadata file)                              │
│                                                             │
│  API Routes                                                 │
│  ──────────                                                 │
│  /api/chat  (POST, streaming, rate-limited)                 │
│                                                             │
│  Client Components                                          │
│  ─────────────────                                          │
│  CookieBanner   (consent management)                        │
│  ChatbotWidget  (floating chatbot UI)                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼─────────────────────┐
        │                   │                     │
┌───────▼──────┐  ┌─────────▼──────┐  ┌──────────▼──────┐
│   Supabase   │  │  AI Provider   │  │ Vercel Analytics │
│              │  │  (OpenAI /     │  │                  │
│ knowledge_base│  │   compatible)  │  │  gated by        │
│ contact_     │  │                │  │  nego_consent    │
│ enquiries    │  │ /api/chat uses │  │  cookie          │
│ Auth         │  │ KB as context  │  │                  │
└──────────────┘  └────────────────┘  └──────────────────┘
```

### Phase Delivery Order

| Phase | Scope | Requirements |
|-------|-------|--------------|
| 0 | Repository audit & baseline report | Req 1 |
| 1 | SEO/AEO — sitemap, robots, metadata, JSON-LD | Req 2–5 |
| 2 | Privacy policy + cookie consent banner | Req 6–7 |
| 3 | Admin dashboard — auth + KB CRUD + enquiry inbox | Req 8–10 |
| 4 | AI chatbot — core + security | Req 11–12 |
| ∞ | Preservation checks (continuous) | Req 13 |

---

## Components and Interfaces

### Phase 0 — Audit Baseline

No new files are created. The deliverable is a written markdown report (not committed to the production branch) listing all findings for requirements 1.1–1.4.

---

### Phase 1 — SEO / AEO

#### `src/app/sitemap.ts`

Exports a default function returning `MetadataRoute.Sitemap`. Imports `projects` from `site-data.ts` to derive dynamic project URLs.

```
Interface: () => MetadataRoute.Sitemap
```

Static entries: `/`, `/about`, `/contact`, `/projects`, `/portfolio`
Dynamic entries: one per `project.slug` in the `projects` array

#### `src/app/robots.ts`

Exports a default function returning `MetadataRoute.Robots`. References the canonical sitemap URL.

```
Interface: () => MetadataRoute.Robots
```

#### `src/app/layout.tsx` (modified)

- Update `metadataBase` from `https://negoconstruction.com` to `https://www.negoconstruction.com`
- Add Organization JSON-LD `<script>` block using `company` data from `site-data.ts`
- Wrap `<Analytics />` in a client component that reads the `nego_consent` cookie before rendering (Phase 2 dependency, but the hook point is introduced here)

#### `src/app/page.tsx` (modified)

- Export a `metadata` object (already implicitly covered by root layout, but per-page description is needed)
- Add WebSite JSON-LD `<script>` block with `SearchAction`

#### Per-project page files (modified — all 6)

Each `src/app/projects/[slug]/page.tsx` is currently a `"use client"` component. Because `generateMetadata` can only be exported from Server Components, the pattern is:

**Decision**: Split each project page into a Server Component shell that exports `generateMetadata` and a Client Component for the interactive gallery/slideshow parts. This pattern is already documented in the Next.js `generateMetadata` docs and matches the codebase pattern used on `about/page.tsx`.

```
src/app/projects/[slug]/page.tsx      → Server Component, exports generateMetadata
src/app/projects/[slug]/client.tsx    → Client Component ("use client"), contains existing gallery logic
```

The `generateMetadata` function reads `params.slug` (a Promise in Next.js 16 — `await params`) and looks up the matching project from `site-data.ts`.

#### `src/app/about/page.tsx`, `src/app/contact/page.tsx` (modified)

Add static `metadata` exports. `contact/page.tsx` is currently `"use client"` — add metadata from a separate Server Component wrapper following the same split pattern.

#### JSON-LD Helper: `src/lib/json-ld.ts`

A shared utility for building and serialising JSON-LD, ensuring `<` is escaped as `\u003c`.

```typescript
// Interface
function buildOrganizationLD(): string
function buildWebSiteLD(): string
function buildProjectLD(project: Project): string
function serializeLD(data: Record<string, unknown>): string  // handles \u003c escaping
```

---

### Phase 2 — Privacy and Consent

#### `src/app/privacy-policy/page.tsx`

Server Component. Exports static `metadata` with `robots: { index: false, follow: false }`. Content sourced from `company` in `site-data.ts` (name, email, address). No external data dependencies.

#### `src/components/cookie-banner.tsx`

Client Component (`"use client"`). Reads `nego_consent` cookie from `document.cookie` on mount. If absent, renders the banner. On Accept/Decline, sets the cookie via `document.cookie` with the correct attributes and updates Vercel Analytics opt-in state.

```typescript
// Props: none
// Internal state: consentStatus: 'pending' | 'accepted' | 'declined' | null
// Cookie written: nego_consent=accepted|declined; SameSite=Lax; Secure; Max-Age=31536000; Path=/
```

**Analytics gating**: The `<Analytics />` component from `@vercel/analytics/next` is moved from `layout.tsx` into a new `src/components/analytics-provider.tsx` Client Component. This component reads the `nego_consent` cookie value and conditionally renders `<Analytics />` only when value is `accepted`. This component is rendered in `layout.tsx` replacing the existing direct `<Analytics />` usage.

#### Footer modification (`src/components/site.tsx`)

Add a `<Link href="/privacy-policy">Privacy Policy</Link>` entry to the Footer's "Explore" column.

---

### Phase 3 — Admin Dashboard

#### Route Group Structure

```
src/app/
  (admin)/
    layout.tsx          ← Admin layout (no SiteShell)
    admin/
      page.tsx          ← Dashboard home (redirect to /admin/knowledge-base)
      login/
        page.tsx        ← Login page (public within admin group)
      knowledge-base/
        page.tsx        ← KB list
        new/
          page.tsx      ← Create KB entry form
        [id]/
          page.tsx      ← Edit/view KB entry
      enquiries/
        page.tsx        ← Enquiry list
        [id]/
          page.tsx      ← Enquiry detail (marks as read)
```

**Note on route group path**: The `(admin)` folder is a route group — the parentheses are stripped from the URL. Routes are accessed at `/admin/...` while the layout is isolated from the public `SiteShell`.

#### `src/proxy.ts`

New file (replaces any potential `src/middleware.ts`). Exports `proxy` function (not `middleware`). Matcher targets `/admin/:path*`. Logic:

1. If path is `/admin/login` → `NextResponse.next()` (allow through)
2. Read `nego_admin_session` cookie from request
3. If cookie absent → redirect to `/admin/login`
4. Verify JWT signature and expiry using a server-side secret
5. If JWT invalid or expired → redirect to `/admin/login`
6. Otherwise → `NextResponse.next()`

```typescript
export const config = {
  matcher: ['/admin/:path*'],
}
export function proxy(request: NextRequest): NextResponse { ... }
```

#### `src/lib/supabase/server.ts`

Creates a Supabase server client using environment variables. Used in Server Components, Server Actions, and Route Handlers.

```typescript
import { createClient } from '@supabase/supabase-js'
export function createServerClient() { ... }
```

#### `src/lib/auth.ts`

Server-side auth utilities:
- `signIn(email, password)` → calls Supabase Auth, returns session or throws
- `signOut()` → deletes `nego_admin_session` cookie
- `verifySession()` → reads and validates JWT from `nego_admin_session` cookie
- `createSession(token)` → writes `nego_admin_session` cookie with correct attributes

#### `src/app/(admin)/admin/login/page.tsx`

Server Component with a Client Component for the form. On form submission, calls a Server Action `loginAction(formData)` which:
1. Calls `signIn(email, password)` via Supabase Auth
2. On success: calls `createSession(token)`, redirects to `/admin`
3. On failure: returns `{ error: 'Invalid credentials' }`

#### Server Actions: `src/app/(admin)/admin/actions.ts`

All Supabase write operations are Server Actions with `'use server'` directive:

```typescript
// Knowledge Base
export async function createKBEntry(data: KBEntryInput): Promise<ActionResult>
export async function updateKBEntry(id: string, data: KBEntryInput): Promise<ActionResult>
export async function deleteKBEntry(id: string): Promise<ActionResult>
export async function toggleKBPublished(id: string, published: boolean): Promise<ActionResult>

// Enquiries
export async function markEnquiryRead(id: string): Promise<ActionResult>

// Auth
export async function loginAction(formData: FormData): Promise<ActionResult>
export async function logoutAction(): Promise<void>
```

Each action calls `verifySession()` first and throws/redirects if unauthenticated.

#### `src/app/contact/actions.ts`

Server Action for persisting contact form submissions:

```typescript
export async function submitEnquiry(formData: FormData): Promise<ActionResult>
```

The existing `contact/page.tsx` `"use client"` form is modified to call this Server Action alongside the existing `mailto` behavior. If the Server Action throws, the `mailto` still executes (requirement 10.7 — fail-open for email).

---

### Phase 4 — AI Chatbot

#### `src/app/api/chat/route.ts`

Route Handler for `POST /api/chat`. Server-side only.

```typescript
export async function POST(request: NextRequest): Promise<Response>
```

Flow:
1. Parse and validate request body — reject if message > 1000 chars (HTTP 400)
2. Sanitise message content (strip HTML/script injection patterns)
3. Check rate limit — reject if >20 req/IP/min (HTTP 429)
4. Query Supabase for published KB entries relevant to the message
5. Build system prompt with KB context + prohibition instructions
6. Stream response from AI provider
7. Return streaming `Response` with appropriate Content-Type

**Rate limiting**: In-memory `Map<string, {count, resetAt}>` keyed by IP address (from `x-forwarded-for` header). Resets every 60 seconds. For production scale, this should be replaced with a Redis-backed store, but the in-memory approach is correct for the current deployment scale.

**AI Provider**: Vercel AI SDK (`ai` package) with OpenAI-compatible interface. The design uses `streamText` with a `ReadableStream` response. The AI model is configured via `OPENAI_API_KEY` (server-side only, never `NEXT_PUBLIC_` prefixed).

#### `src/components/chatbot-widget.tsx`

Client Component (`"use client"`). Floating action button (FAB) that opens a chat panel.

```typescript
// Internal state:
//   isOpen: boolean
//   messages: Message[]  (cleared on 30-min inactivity or tab visibility change)
//   isLoading: boolean

// Interface with server:
//   POST /api/chat  { message: string }
//   Reads streaming response using fetch + ReadableStream API
```

The widget includes:
- Disclaimer text: "Responses are AI-generated and may not be exhaustive."
- Link to `/contact` within the disclaimer
- Positioned to not overlap the existing `ScrollToTop` button (positioned `bottom-20 right-4` vs ScrollToTop's `bottom-6 right-4` — or equivalent non-overlapping offsets)

#### `src/lib/kb-retrieval.ts`

Server-side function for fetching published KB entries:

```typescript
export async function getPublishedKBEntries(): Promise<KBEntry[]>
// Returns all entries where is_published = true
// Used by /api/chat route handler
```

For the initial implementation, all published entries are included in context. A future enhancement could add semantic similarity search.

---

## Data Models

### Supabase: `knowledge_base` Table

```sql
CREATE TABLE knowledge_base (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT        NOT NULL,
  content     TEXT        NOT NULL,
  category    TEXT        NOT NULL CHECK (category IN ('about','projects','services','contact','faq')),
  is_published BOOLEAN    NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at on modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON knowledge_base
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**RLS Policies**:

```sql
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Only authenticated users (admin) can read all entries
CREATE POLICY "admin_read_kb"
  ON knowledge_base FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can insert
CREATE POLICY "admin_insert_kb"
  ON knowledge_base FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update
CREATE POLICY "admin_update_kb"
  ON knowledge_base FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can delete
CREATE POLICY "admin_delete_kb"
  ON knowledge_base FOR DELETE
  TO authenticated
  USING (true);

-- The /api/chat route handler uses service role key to bypass RLS for reading published entries
-- Alternatively, grant anon read on is_published = true only:
CREATE POLICY "public_read_published_kb"
  ON knowledge_base FOR SELECT
  TO anon
  USING (is_published = true);
```

**Design Decision**: The chatbot route handler reads published KB entries. Granting `anon` read on `is_published = true` rows means the chatbot can use the Supabase `anon` key (not the service role key), keeping the service role key out of the chat route. Admin CRUD operations use Supabase Auth sessions.

---

### Supabase: `contact_enquiries` Table

```sql
CREATE TABLE contact_enquiries (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name   TEXT        NOT NULL,
  last_name    TEXT,
  email        TEXT        NOT NULL,
  phone        TEXT,
  message      TEXT        NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_read      BOOLEAN     NOT NULL DEFAULT false
);
```

**RLS Policies**:

```sql
ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;

-- No anonymous SELECT (requirement 10.6)
-- No anonymous INSERT via Supabase client (insert happens via Server Action with service role key)
-- Only authenticated admin users can read and update
CREATE POLICY "admin_read_enquiries"
  ON contact_enquiries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "admin_update_enquiries"
  ON contact_enquiries FOR UPDATE
  TO authenticated
  USING (true);
```

**Design Decision**: Contact form submissions use a Server Action that runs with the Supabase service role key. This means the `anon` role has no INSERT or SELECT permission on this table — the service role bypasses RLS. This satisfies requirement 10.6 (no anonymous access via Supabase client).

---

### TypeScript Types (`src/lib/types.ts`)

```typescript
export type KBCategory = 'about' | 'projects' | 'services' | 'contact' | 'faq'

export interface KBEntry {
  id: string
  title: string
  content: string
  category: KBCategory
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface KBEntryInput {
  title: string
  content: string
  category: KBCategory
  is_published: boolean
}

export interface ContactEnquiry {
  id: string
  first_name: string
  last_name: string | null
  email: string
  phone: string | null
  message: string
  submitted_at: string
  is_read: boolean
}

export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
```

---

## Data Flow Diagrams

### Chatbot Request Flow

```
Visitor types message
        │
        ▼
ChatbotWidget (client)
  │  Validates message length (client-side guard)
  │  POST /api/chat { message }
        │
        ▼
/api/chat Route Handler (server)
  │  1. Parse & validate (length check → 400)
  │  2. Sanitise content
  │  3. Rate limit check (→ 429 if exceeded)
  │  4. Query Supabase: published KB entries (anon key)
  │  5. Build messages array:
  │     [system: KB context + prohibition rules,
  │      ...conversation history,
  │      user: sanitised message]
  │  6. streamText(model, messages)
        │
        ▼
AI Provider (OpenAI)
  Returns ReadableStream
        │
        ▼
/api/chat returns streaming Response
        │
        ▼
ChatbotWidget reads stream, appends tokens to UI
```

### Admin Auth Flow

```
Admin visits /admin/knowledge-base
        │
        ▼
src/proxy.ts
  │  1. Path matches /admin/:path*
  │  2. Path is not /admin/login
  │  3. Read nego_admin_session cookie
  │  4a. Cookie absent → redirect /admin/login
  │  4b. JWT invalid/expired → redirect /admin/login
  │  4c. JWT valid → NextResponse.next()
        │ (case 4c)
        ▼
/admin/knowledge-base Server Component
  │  1. verifySession() (double-check — defence in depth)
  │  2. createServerClient() with user's session
  │  3. Fetch KB entries from Supabase
  │  4. Render list
```

### Contact Form Submission Flow

```
Visitor fills contact form → clicks Submit
        │
        ▼
ContactForm (client component)
  │  1. Calls submitEnquiry(formData) Server Action
  │     ├─ Success: row inserted to contact_enquiries
  │     └─ Failure: logs error, continues (fail-open)
  │  2. Opens mailto: link (existing behavior, unconditional)
  │  3. Shows toast confirmation
```

### Cookie Consent Flow

```
Visitor loads any public page
        │
        ▼
CookieBanner (client component mounts)
  │  1. Read document.cookie for 'nego_consent'
  │  2a. Cookie present → component returns null (no re-render)
  │  2b. Cookie absent → render banner UI
        │ (case 2b)
        │  User clicks Accept
        │    → set nego_consent=accepted; Max-Age=31536000; ...
        │    → AnalyticsProvider re-reads cookie → renders <Analytics />
        │
        │  User clicks Decline
        │    → set nego_consent=declined; Max-Age=31536000; ...
        │    → AnalyticsProvider: cookie is declined → does not render <Analytics />
```

---

## New File Structure

```
src/
├── app/
│   ├── (admin)/
│   │   ├── layout.tsx                    ← Admin layout (no SiteShell)
│   │   └── admin/
│   │       ├── page.tsx                  ← Redirect to KB
│   │       ├── login/
│   │       │   └── page.tsx
│   │       ├── knowledge-base/
│   │       │   ├── page.tsx
│   │       │   ├── new/
│   │       │   │   └── page.tsx
│   │       │   └── [id]/
│   │       │       └── page.tsx
│   │       └── enquiries/
│   │           ├── page.tsx
│   │           └── [id]/
│   │               └── page.tsx
│   ├── api/
│   │   └── chat/
│   │       └── route.ts                  ← NEW
│   ├── privacy-policy/
│   │   └── page.tsx                      ← NEW
│   ├── contact/
│   │   ├── page.tsx                      ← MODIFIED (Server Component wrapper)
│   │   ├── client.tsx                    ← NEW (existing client logic extracted)
│   │   └── actions.ts                    ← NEW (submitEnquiry Server Action)
│   ├── projects/
│   │   └── [slug]/
│   │       ├── page.tsx                  ← MODIFIED (add generateMetadata, split client)
│   │       └── client.tsx                ← NEW per project (or shared pattern)
│   ├── sitemap.ts                        ← NEW
│   ├── robots.ts                         ← NEW
│   ├── layout.tsx                        ← MODIFIED (metadataBase, Org JSON-LD, AnalyticsProvider)
│   └── page.tsx                          ← MODIFIED (WebSite JSON-LD)
├── components/
│   ├── site.tsx                          ← MODIFIED (Footer privacy link)
│   ├── cookie-banner.tsx                 ← NEW
│   ├── analytics-provider.tsx            ← NEW
│   └── chatbot-widget.tsx                ← NEW
├── lib/
│   ├── site-data.ts                      ← UNCHANGED
│   ├── json-ld.ts                        ← NEW
│   ├── types.ts                          ← NEW
│   ├── auth.ts                           ← NEW
│   ├── kb-retrieval.ts                   ← NEW
│   └── supabase/
│       └── server.ts                     ← NEW
└── proxy.ts                              ← NEW (at src/ level)
```

---

## Environment Variables

All environment variables are server-side only. None use the `NEXT_PUBLIC_` prefix except where explicitly noted.

| Variable | Purpose | Used In |
|----------|---------|---------|
| `SUPABASE_URL` | Supabase project URL | `src/lib/supabase/server.ts` |
| `SUPABASE_ANON_KEY` | Public anon key (safe for server-side use; reads published KB) | `src/lib/supabase/server.ts`, `/api/chat` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypasses RLS; admin writes, contact enquiries) | `src/app/contact/actions.ts`, admin Server Actions |
| `JWT_SECRET` | Secret for signing/verifying `nego_admin_session` JWTs | `src/lib/auth.ts`, `src/proxy.ts` |
| `OPENAI_API_KEY` | AI provider API key (never `NEXT_PUBLIC_`) | `src/app/api/chat/route.ts` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for absolute URL construction in client components (optional — design can derive from constants) | Client components where needed |

**Security note**: `SUPABASE_SERVICE_ROLE_KEY` must never be passed to client components or included in any response body. It is used only in Server Actions and Route Handlers with `'use server'` directive.

---

## Key Implementation Decisions and Rationale

### 1. `proxy.ts` instead of `middleware.ts`

Next.js 16 deprecates `middleware.ts` and renames it to `proxy.ts` with the exported function renamed from `middleware` to `proxy`. The AGENTS.md and the `proxy.md` docs confirm this. Using `middleware.ts` would still work (backward compat) but would produce deprecation warnings and is the wrong convention going forward.

### 2. `generateMetadata` requires Server Components — project page split

All 6 project pages are currently `"use client"` components. `generateMetadata` and `metadata` exports are only supported in Server Components (confirmed in the `generate-metadata.md` docs). The solution is to split each project page: the outer `page.tsx` becomes a Server Component exporting `generateMetadata`, and the existing interactive gallery code moves to a `client.tsx` co-located file. This is idiomatic and matches the pattern used in `about/page.tsx`.

### 3. `params` is a Promise in Next.js 16

The Route Handler and `generateMetadata` docs show `params` as `Promise<{ slug: string }>` requiring `await params`. This is a breaking change from Next.js 14. All dynamic route handlers must `await params`.

### 4. Consent-gated Analytics

The existing `<Analytics />` is rendered unconditionally (within `NODE_ENV === "production"` guard). To respect the consent banner, it is moved to an `AnalyticsProvider` Client Component that reads the `nego_consent` cookie on the client side. Since `<Analytics />` is a client-side script loader, this is the correct place to gate it.

### 5. Supabase Auth vs. custom JWT

Supabase Auth is used for identity verification (email/password). However, the session cookie `nego_admin_session` is a separate JWT signed with `JWT_SECRET` — this keeps the session management under our control and decoupled from Supabase session tokens, which simplifies the proxy validation (no Supabase SDK calls in the proxy hot path). The proxy only needs to verify a signature and check expiry.

**Alternative considered**: Using Supabase's own session cookies. Rejected because it would require the Supabase SDK in `proxy.ts` (a cold-path overhead), and Supabase session cookies have different naming conventions that conflict with the named cookie requirement (`nego_admin_session`).

### 6. In-memory rate limiting for `/api/chat`

A `Map` keyed by IP with a reset timestamp is sufficient for a single-instance deployment on Vercel. For multi-region or high-traffic deployments, this should be replaced with an `@upstash/redis` rate limiter. The design includes the interface so it can be swapped without changing the route handler logic.

### 7. Contact form fail-open strategy

Requirement 10.7 mandates that if the Supabase insert fails, the contact form still opens the visitor's email client. The implementation calls the Server Action first but wraps it in a try/catch. The `mailto` action is triggered unconditionally after the Server Action resolves (whether success or error). This is a critical UX requirement — no enquiry should be lost due to a backend failure.

### 8. JSON-LD XSS sanitisation

The `serializeLD` helper uses `JSON.stringify` with a replacer that converts `<` → `\u003c`. This is the same approach used by React's server-side renderer for inline scripts. It prevents an attacker from injecting `</script>` into the inline JSON-LD block via maliciously-crafted project names or descriptions.

### 9. `/privacy-policy` with `noindex`

The privacy policy page uses `robots: { index: false, follow: false }` in its metadata export. This prevents the policy page from appearing as a search result snippet while still being accessible via direct link (from the footer and the consent banner). This is standard practice for legal/policy pages.

### 10. `(admin)` route group without `SiteShell`

The `(admin)` route group has its own `layout.tsx` that does not include the `SiteShell` component (no `Header`, `Footer`, `ScrollProgress`). This gives the admin section a clean slate for its own UI. The root `layout.tsx` still wraps everything with fonts, `<html>`, `<body>`, `ScrollToTop`, and the `CookieBanner` — the admin layout inherits these root-level wrappers.

---

## Error Handling

### Authentication Errors

- Invalid credentials: return `{ error: 'Invalid credentials' }` — no field specificity
- Expired session: proxy redirects to `/admin/login` — session loss is transparent to the user
- Server Action auth check fails: throw or redirect — never return sensitive details

### Supabase Errors

- KB CRUD failure: Server Action returns `{ success: false, error: 'Failed to save entry' }` — no internal error details exposed to client
- Enquiry insert failure: logged server-side; contact form proceeds with `mailto` fallback
- Query failure in `/api/chat`: return HTTP 500 with generic message; do not expose Supabase error details

### AI Provider Errors

- API key missing/invalid: return HTTP 500 with generic "Chat unavailable" message
- Rate limit from AI provider: return HTTP 503 with "Please try again later"
- Network timeout: return HTTP 504

### Cookie Consent

- Banner renders client-side; if JS is disabled, the banner won't show. Analytics will not be loaded either (JS required), so there is no PII risk from disabled-JS scenarios.

---

## Testing Strategy

This feature covers infrastructure (sitemap, robots, proxy, Supabase RLS), UI components (consent banner, chatbot widget), Server Actions, and a Route Handler. The dual approach uses property-based tests for universal correctness properties and example-based/integration tests for specific behaviors.

### Unit and Property Tests

**Recommended library**: [fast-check](https://fast-check.io/) (TypeScript-native, zero dependencies for generation)

**Minimum iterations**: 100 per property test

**Test file conventions**: co-located `*.test.ts` or in `__tests__/` directory

### Integration Tests

Integration tests cover Supabase interactions and require a test Supabase project or local Supabase CLI instance. They are tagged `@integration` and excluded from the default test run.

### Smoke Tests

Build and configuration checks run as part of CI:
- `next build` must complete with exit code 0
- No TypeScript errors (even with `ignoreBuildErrors: true`, new code is TypeScript-correct)
- Google Rich Results Test validation (manual, pre-production)

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Sitemap includes all project slugs

*For any* project in the `projects` array in `site-data.ts`, the sitemap function's output SHALL contain a URL entry of the form `https://www.negoconstruction.com/projects/{project.slug}`.

**Validates: Requirements 2.3**

---

### Property 2: All sitemap entries have required fields

*For any* URL entry returned by the sitemap function, the entry SHALL have a non-empty `url` string, a `lastModified` value, a valid `changeFrequency` string, and a `priority` number between 0 and 1 inclusive.

**Validates: Requirements 2.4**

---

### Property 3: All sitemap URLs use canonical base

*For any* URL entry returned by the sitemap function, the `url` field SHALL start with `https://www.negoconstruction.com`.

**Validates: Requirements 2.5**

---

### Property 4: Project page generateMetadata uses project data

*For any* project slug in the `projects` array, calling `generateMetadata({ params: Promise.resolve({ slug }) })` SHALL return a metadata object whose `title` contains the project's `name` and whose `description` contains content derived from the project's `description` field.

**Validates: Requirements 4.2**

---

### Property 5: Project metadata contains all required OG and Twitter fields

*For any* project page, the metadata returned by `generateMetadata` SHALL contain non-empty values for `title`, `description`, `openGraph.title`, `openGraph.description`, `openGraph.images`, `twitter.card`, and `twitter.title`.

**Validates: Requirements 4.3**

---

### Property 6: Project pages with images reference them in OG metadata

*For any* project slug that has an entry in the `projectImages` map, the `openGraph.images` field in the generated metadata SHALL contain a reference to that image path.

**Validates: Requirements 4.5**

---

### Property 7: Organization JSON-LD contains all required fields with correct values

*For any* rendering of the root layout, the Organization JSON-LD object SHALL contain non-empty values for `@type`, `name`, `url`, `logo`, `telephone`, `email`, and `address`, and these values SHALL match the corresponding fields in `site-data.ts`.

**Validates: Requirements 5.2**

---

### Property 8: Project JSON-LD contains project-specific data

*For any* project, the JSON-LD emitted on that project's page SHALL contain the project's `name`, `description`, `location`, and `client` fields.

**Validates: Requirements 5.4**

---

### Property 9: JSON-LD serialisation escapes angle brackets

*For any* string value that contains the `<` character, passing it through `serializeLD` SHALL produce output where `<` appears as `\u003c` and no raw `<` characters appear in the serialised output.

**Validates: Requirements 5.5**

---

### Property 10: Consent banner hides when consent cookie is present

*For any* client state where the `nego_consent` cookie is set to any non-empty value (`accepted` or `declined`), the `CookieBanner` component SHALL NOT render its visible banner UI.

**Validates: Requirements 7.6**

---

### Property 11: Consent choice sets cookie with correct attributes

*For any* consent action (accept or decline), the resulting `nego_consent` cookie SHALL have `SameSite=Lax`, `Max-Age=31536000`, and `Path=/`. In production environments it SHALL also have the `Secure` attribute.

**Validates: Requirements 7.3, 7.4, 7.5**

---

### Property 12: Proxy redirects all unauthenticated /admin/* requests (except login)

*For any* request path matching `/admin/*` where the path is not `/admin/login` and the `nego_admin_session` cookie is absent, the proxy SHALL return a redirect response to `/admin/login`.

**Validates: Requirements 8.2**

---

### Property 13: Proxy redirects requests with invalid or expired JWT

*For any* request to `/admin/*` (except `/admin/login`) carrying a `nego_admin_session` cookie whose JWT is expired or has an invalid signature, the proxy SHALL return a redirect response to `/admin/login`.

**Validates: Requirements 8.9**

---

### Property 14: Invalid admin credentials always show generic error

*For any* email and password combination that fails Supabase Auth verification, the `loginAction` Server Action SHALL return an error message of exactly `"Invalid credentials"` without disclosing which field (email or password) was incorrect.

**Validates: Requirements 8.6**

---

### Property 15: Knowledge Base validation rejects insufficient content

*For any* KB entry input where `title` is empty (or whitespace-only) OR `content` has fewer than 20 characters, the `createKBEntry` or `updateKBEntry` Server Action SHALL return `{ success: false, error: ... }` without writing to Supabase.

**Validates: Requirements 9.6**

---

### Property 16: Published KB entries are returned for chatbot context

*For any* Knowledge Base entry with `is_published = true`, the `getPublishedKBEntries()` function SHALL include that entry in its returned array.

**Validates: Requirements 9.4**

---

### Property 17: Unpublished KB entries are excluded from chatbot context

*For any* Knowledge Base entry with `is_published = false`, the `getPublishedKBEntries()` function SHALL NOT include that entry in its returned array.

**Validates: Requirements 9.5**

---

### Property 18: Contact enquiry persistence stores all required fields

*For any* contact form submission with valid `first_name`, `email`, and `message` values, the `submitEnquiry` Server Action SHALL persist a row to `contact_enquiries` containing all required fields (`first_name`, `last_name`, `email`, `phone`, `message`, `submitted_at`, `is_read = false`).

**Validates: Requirements 10.3**

---

### Property 19: Enquiry list is always sorted by most recent first

*For any* set of enquiries with varying `submitted_at` timestamps, the enquiries displayed at `/admin/enquiries` SHALL be ordered with the most recent `submitted_at` first.

**Validates: Requirements 10.2**

---

### Property 20: Chat endpoint rejects messages over 1000 characters

*For any* POST request to `/api/chat` where the `message` field has a length greater than 1000 characters, the handler SHALL return HTTP 400.

**Validates: Requirements 12.3**

---

### Property 21: Chat endpoint enforces rate limiting

*For any* sequence of more than 20 POST requests to `/api/chat` from the same IP address within a 60-second window, the request that exceeds the limit SHALL receive HTTP 429.

**Validates: Requirements 11.6**

---

### Property 22: Chat endpoint returns a streaming response

*For any* valid POST request to `/api/chat` with a message under 1000 characters and within rate limits, the response SHALL use a streaming response format (ReadableStream / chunked transfer encoding).

**Validates: Requirements 11.8**

---

### Property 23: All existing project routes remain accessible

*For any* slug in the existing `projects` array (`lily-park`, `alpha-court`, `imo-hills-farm`, `abacha-road`, `eku-baptist-hospital`, `comprehensive-healthcare-centre`), the corresponding route `/projects/{slug}` SHALL resolve to a non-error response after all enhancements are applied.

**Validates: Requirements 13.1**

---

### Property 24: All public pages retain SiteShell components

*For any* public-facing page (homepage, `/about`, `/contact`, `/projects`, `/projects/[slug]`, `/portfolio`, `/privacy-policy`), the rendered HTML SHALL contain the `Header`, `Footer`, and `ScrollProgress` components from `SiteShell`.

**Validates: Requirements 13.2**

---

### Property 25: Contact form fallback on Supabase failure

*For any* scenario where the `submitEnquiry` Server Action throws or returns an error, the contact form on the client SHALL still trigger the `mailto:` action so no enquiry is lost.

**Validates: Requirements 10.7**

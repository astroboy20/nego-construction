# Implementation Plan: NEGO Website Enhancements

## Overview

Phased implementation of SEO/AEO, privacy/consent, admin dashboard, and AI chatbot for the NEGO Construction Limited website. All work preserves existing public routes, the SiteShell component, brand styles, and TypeScript correctness. The project uses Next.js 16 App Router with TypeScript throughout — all code is TypeScript.

Key constraints to respect throughout:
- `src/proxy.ts` is the middleware file (exports `proxy`, not `middleware`)
- `params` is a `Promise` in Next.js 16 — always `await params`
- Project pages are `"use client"` — use Server Component wrapper + `client.tsx` split for `generateMetadata`
- No secrets in client-side code (`NEXT_PUBLIC_` prefix forbidden for API keys)
- `metadataBase` must use `https://www.negoconstruction.com`

---

## Tasks

- [x] 1. Set up foundation — types, Supabase client, JSON-LD helpers
  - Create `src/lib/types.ts` with all shared TypeScript interfaces: `KBCategory`, `KBEntry`, `KBEntryInput`, `ContactEnquiry`, `ActionResult<T>`, `ChatMessage`
  - Create `src/lib/supabase/server.ts` with `createServerClient()` using `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables
  - Create `src/lib/json-ld.ts` with `buildOrganizationLD()`, `buildWebSiteLD()`, `buildProjectLD(project)`, and `serializeLD(data)` — `serializeLD` must escape `<` as `\u003c`
  - Install required packages: `@supabase/supabase-js`, `jose` (for JWT in proxy), `ai` (Vercel AI SDK), `openai`
  - _Requirements: 5.5, 9 (types), 11_

  - [x] 1.1 Write property test for JSON-LD serialisation escaping
    - **Property 9: JSON-LD serialisation escapes angle brackets**
    - For any string containing `<`, `serializeLD` must output `\u003c` with no raw `<` in result
    - Use fast-check `fc.string()` filtered to contain `<`
    - **Validates: Requirements 5.5**

- [x] 2. Phase 1 — Sitemap and robots files
  - Create `src/app/sitemap.ts` returning `MetadataRoute.Sitemap` — static routes (`/`, `/about`, `/contact`, `/projects`, `/portfolio`) plus one dynamic entry per `project.slug` from `site-data.ts`
  - Create `src/app/robots.ts` returning `MetadataRoute.Robots` — allow all crawlers on public routes, disallow `/admin` and sub-paths, reference canonical sitemap URL
  - All sitemap entries must use `https://www.negoconstruction.com` as base, include `lastModified`, `changeFrequency`, and `priority`
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4_

  - [x] 2.1 Write property test for sitemap — all project slugs included
    - **Property 1: Sitemap includes all project slugs**
    - For any project in the `projects` array, the sitemap output must contain `https://www.negoconstruction.com/projects/{project.slug}`
    - Use fast-check to iterate over arbitrary subsets of the projects array
    - **Validates: Requirements 2.3**

  - [x] 2.2 Write property test for sitemap — all entries have required fields
    - **Property 2: All sitemap entries have required fields**
    - For any URL entry returned, it must have non-empty `url`, `lastModified`, valid `changeFrequency`, and `priority` between 0 and 1
    - **Validates: Requirements 2.4**

  - [x] 2.3 Write property test for sitemap — canonical base URL
    - **Property 3: All sitemap URLs use canonical base**
    - For any URL entry, `url` must start with `https://www.negoconstruction.com`
    - **Validates: Requirements 2.5**

- [x] 3. Phase 1 — Per-page metadata and JSON-LD
  - [x] 3.1 Update root layout metadata and add Organization JSON-LD
    - Modify `src/app/layout.tsx`: update `metadataBase` to `new URL("https://www.negoconstruction.com")`
    - Add Organization JSON-LD `<script type="application/ld+json">` block using `buildOrganizationLD()` from `src/lib/json-ld.ts`, with data from `company` in `site-data.ts`
    - Organization schema must include: `@type`, `name`, `url`, `logo`, `telephone` (array), `email`, `address` (PostalAddress with `addressCountry: "NG"`)
    - Replace direct `<Analytics />` usage with a placeholder for `AnalyticsProvider` (to be completed in Phase 2, Step 5)
    - _Requirements: 4.4, 5.1, 5.2_

  - [x] 3.2 Add WebSite JSON-LD and metadata to homepage
    - Modify `src/app/page.tsx`: add `export const metadata: Metadata` with title, description, openGraph, and twitter fields
    - Add WebSite JSON-LD `<script>` block using `buildWebSiteLD()` from `src/lib/json-ld.ts`
    - _Requirements: 4.1, 5.3_

  - [x] 3.3 Add metadata to About page
    - Modify `src/app/about/page.tsx`: add `export const metadata: Metadata` with title, description, openGraph, and twitter fields
    - The page is already a Server Component — no split needed
    - _Requirements: 4.1, 4.3_

  - [x] 3.4 Split Contact page and add metadata
    - Create `src/app/contact/client.tsx` — move all existing `"use client"` contact page logic (form, Toast, map, `submit` handler) into this file
    - Modify `src/app/contact/page.tsx` — convert to Server Component: export `metadata` with title, description, openGraph, and twitter fields; render `<ContactClient />` from `client.tsx`
    - _Requirements: 4.1, 4.3_

  - [x] 3.5 Split all 6 project pages and add generateMetadata
    - For each of the 6 project slugs (`lily-park`, `alpha-court`, `imo-hills-farm`, `abacha-road`, `eku-baptist-hospital`, `comprehensive-healthcare-centre`):
      - Create `src/app/projects/{slug}/client.tsx` — move existing `"use client"` gallery/slideshow component code into this file
      - Modify `src/app/projects/{slug}/page.tsx` — convert to Server Component exporting `generateMetadata(props)` where `params` is `Promise<{ slug: string }>` (must `await params`); render the client component
    - `generateMetadata` looks up project by slug from `site-data.ts`, returns metadata with `title`, `description`, `openGraph.*`, `twitter.*`, and `openGraph.images` referencing `projectImages` map if available
    - Add Project JSON-LD `<script>` block using `buildProjectLD(project)` in each project page Server Component
    - _Requirements: 4.2, 4.3, 4.5, 5.4_

  - [ ]* 3.6 Write property test for generateMetadata — uses project data
    - **Property 4: Project page generateMetadata uses project data**
    - For any project slug, `generateMetadata({ params: Promise.resolve({ slug }) })` must return metadata whose `title` contains the project's `name`
    - **Validates: Requirements 4.2**

  - [ ]* 3.7 Write property test for generateMetadata — all required OG/Twitter fields present
    - **Property 5: Project metadata contains all required OG and Twitter fields**
    - For any project page, generated metadata must contain non-empty `title`, `description`, `openGraph.title`, `openGraph.description`, `openGraph.images`, `twitter.card`, `twitter.title`
    - **Validates: Requirements 4.3**

  - [ ]* 3.8 Write property test for generateMetadata — image reference for projects with images
    - **Property 6: Project pages with images reference them in OG metadata**
    - For any project slug that has an entry in `projectImages`, `openGraph.images` must reference that image path
    - **Validates: Requirements 4.5**

  - [ ]* 3.9 Write property test for Organization JSON-LD — all required fields
    - **Property 7: Organization JSON-LD contains all required fields with correct values**
    - `buildOrganizationLD()` output must contain non-empty `@type`, `name`, `url`, `logo`, `telephone`, `email`, `address`, all matching `site-data.ts`
    - **Validates: Requirements 5.2**

  - [ ]* 3.10 Write property test for Project JSON-LD — project-specific data
    - **Property 8: Project JSON-LD contains project-specific data**
    - For any project, `buildProjectLD(project)` must include the project's `name`, `description`, `location`, and `client`
    - **Validates: Requirements 5.4**

- [x] 4. Checkpoint — SEO/AEO phase
  - Ensure all tests pass, ask the user if questions arise.
  - Verify `next build` completes without TypeScript errors
  - Confirm sitemap renders at `/sitemap.xml` and robots at `/robots.txt`

- [x] 5. Phase 2 — Privacy Policy page and Analytics gating
  - Create `src/app/privacy-policy/page.tsx` as a Server Component with `export const metadata` including `robots: { index: false, follow: false }` and a descriptive title
  - Page content sourced exclusively from `company` in `site-data.ts` (name, email, address); describes data collected (name, email, phone), use, retention, NDPR rights, and data controller identity
  - Create `src/components/analytics-provider.tsx` as a Client Component (`"use client"`) that reads the `nego_consent` cookie from `document.cookie` and conditionally renders `<Analytics />` only when value is `"accepted"`
  - Update `src/app/layout.tsx` to replace direct `<Analytics />` usage with `<AnalyticsProvider />`
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 7.3, 7.4_

- [x] 6. Phase 2 — Cookie consent banner
  - Create `src/components/cookie-banner.tsx` as a Client Component (`"use client"`)
  - On mount, read `document.cookie` for `nego_consent` — if present (any value), render nothing
  - If absent, render banner with "Accept" and "Decline" buttons, a link to `/privacy-policy`, and accessible keyboard-reachable elements with ARIA labels
  - On Accept: set `nego_consent=accepted; SameSite=Lax; Secure; Max-Age=31536000; Path=/`
  - On Decline: set `nego_consent=declined; SameSite=Lax; Secure; Max-Age=31536000; Path=/`
  - Banner must not obstruct navigation or critical page content (position fixed at bottom)
  - Add `<CookieBanner />` to `src/app/layout.tsx` body
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_

  - [ ]* 6.1 Write property test for cookie banner — hides when consent cookie present
    - **Property 10: Consent banner hides when consent cookie is present**
    - For any non-empty `nego_consent` cookie value (`accepted` or `declined`), `CookieBanner` must not render its banner UI
    - **Validates: Requirements 7.6**

  - [ ]* 6.2 Write property test for cookie banner — correct cookie attributes on consent
    - **Property 11: Consent choice sets cookie with correct attributes**
    - For any consent action (accept or decline), the written cookie must have `SameSite=Lax`, `Max-Age=31536000`, `Path=/`
    - **Validates: Requirements 7.3, 7.4, 7.5**

- [x] 7. Phase 2 — Footer privacy link
  - Modify `src/components/site.tsx`: add `<Link href="/privacy-policy">Privacy Policy</Link>` to the Footer's "Explore" column links
  - _Requirements: 6.5_

- [x] 8. Checkpoint — Privacy & Consent phase
  - Ensure all tests pass, ask the user if questions arise.
  - Confirm the banner appears on first visit, disappears after accept/decline, and does not reappear on subsequent loads

- [x] 9. Phase 3 — Supabase database setup and auth utilities
  - Create the `knowledge_base` table SQL (including `CHECK` constraint on `category`, `updated_at` trigger) and `contact_enquiries` table SQL — document these as migration scripts in the repo (e.g. `supabase/migrations/`)
  - Apply RLS policies: `knowledge_base` — `admin_read_kb`, `admin_insert_kb`, `admin_update_kb`, `admin_delete_kb`, `public_read_published_kb`; `contact_enquiries` — `admin_read_enquiries`, `admin_update_enquiries` (no anon INSERT or SELECT)
  - Create `src/lib/auth.ts` with `signIn(email, password)`, `signOut()`, `verifySession()`, `createSession(token)` — sessions use `HttpOnly`, `Secure`, `SameSite=Lax` cookie named `nego_admin_session` containing a signed JWT (use `jose`) with 8-hour max lifetime
  - _Requirements: 8.4, 8.5, 8.7, 9, 10_

- [x] 10. Phase 3 — Proxy (auth guard middleware)
  - Create `src/proxy.ts` exporting `proxy` function (NOT `middleware`) with `export const config = { matcher: ['/admin/:path*'] }`
  - Logic: if path is `/admin/login` → `NextResponse.next()`; otherwise read `nego_admin_session` cookie, verify JWT with `jose` using `JWT_SECRET`; if absent/invalid/expired → redirect to `/admin/login`; if valid → `NextResponse.next()`
  - _Requirements: 8.2, 8.9_

  - [x] 10.1 Write property test for proxy — redirects unauthenticated requests
    - **Property 12: Proxy redirects all unauthenticated /admin/* requests (except login)**
    - For any `/admin/*` path that is not `/admin/login` with no `nego_admin_session` cookie, proxy must return a redirect to `/admin/login`
    - Use fast-check `fc.string()` to generate arbitrary sub-paths
    - **Validates: Requirements 8.2**

  - [x] 10.2 Write property test for proxy — redirects invalid/expired JWT
    - **Property 13: Proxy redirects requests with invalid or expired JWT**
    - For any `/admin/*` path (not login) with an invalid or expired JWT in `nego_admin_session`, proxy must redirect to `/admin/login`
    - **Validates: Requirements 8.9**

- [x] 11. Phase 3 — Admin layout and Server Actions
  - Create `src/app/(admin)/layout.tsx` — minimal layout without `SiteShell`; provides admin shell with nav links (Knowledge Base, Enquiries, Sign out)
  - Create `src/app/(admin)/admin/actions.ts` with `'use server'` directive — all write operations call `verifySession()` first:
    - `loginAction(formData)`, `logoutAction()`
    - `createKBEntry(data)`, `updateKBEntry(id, data)`, `deleteKBEntry(id)`, `toggleKBPublished(id, published)` — validate title non-empty and content ≥ 20 chars before writing
    - `markEnquiryRead(id)`
  - Create `src/app/contact/actions.ts` with `submitEnquiry(formData)` Server Action using Supabase service role key to insert into `contact_enquiries`; catch errors and return `ActionResult`
  - _Requirements: 8.8, 9.2, 9.6, 9.7, 10.1, 10.6_

  - [ ]* 11.1 Write property test for KB validation — rejects insufficient content
    - **Property 15: Knowledge Base validation rejects insufficient content**
    - For any `KBEntryInput` where `title` is empty/whitespace OR `content` has < 20 characters, `createKBEntry` / `updateKBEntry` must return `{ success: false }` without calling Supabase
    - **Validates: Requirements 9.6**

  - [ ]* 11.2 Write property test for invalid credentials — always returns generic error
    - **Property 14: Invalid admin credentials always show generic error**
    - For any failing auth attempt, `loginAction` must return error message `"Invalid credentials"` (exact string) with no field specifics
    - **Validates: Requirements 8.6**

  - [ ]* 11.3 Write property test for contact enquiry persistence
    - **Property 18: Contact enquiry persistence stores all required fields**
    - For any valid submission with `first_name`, `email`, `message`, `submitEnquiry` must persist a row with all required fields including `is_read: false`
    - **Validates: Requirements 10.3**

- [-] 12. Phase 3 — Admin login page
  - Create `src/app/(admin)/admin/login/page.tsx` — Server Component shell with a Client Component form
  - Form calls `loginAction(formData)`: on success redirects to `/admin`; on failure displays `"Invalid credentials"` error message
  - Page accessible without session (proxy allows `/admin/login` through)
  - _Requirements: 8.1, 8.3, 8.6_

- [ ] 13. Phase 3 — Admin Knowledge Base CRUD pages
  - Create `src/app/(admin)/admin/page.tsx` — redirect to `/admin/knowledge-base`
  - Create `src/app/(admin)/admin/knowledge-base/page.tsx` — lists all KB entries (title, category, published status, updated_at); calls `verifySession()` for defence-in-depth; links to new/edit/delete
  - Create `src/app/(admin)/admin/knowledge-base/new/page.tsx` — form for creating a new KB entry (title, content, category dropdown with `about|projects|services|contact|faq`, is_published toggle); calls `createKBEntry` Server Action
  - Create `src/app/(admin)/admin/knowledge-base/[id]/page.tsx` — edit form pre-populated from Supabase; `params` is `Promise<{ id: string }>` — must `await params`; calls `updateKBEntry`, `deleteKBEntry`, `toggleKBPublished` Server Actions
  - Validate title non-empty and content ≥ 20 characters client-side and server-side
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [ ] 14. Phase 3 — Admin Enquiry Inbox pages
  - Create `src/app/(admin)/admin/enquiries/page.tsx` — lists all enquiries sorted by `submitted_at` descending; visually distinguishes unread (e.g. bold or accent indicator) vs read; calls `verifySession()`
  - Create `src/app/(admin)/admin/enquiries/[id]/page.tsx` — shows full enquiry detail; calls `markEnquiryRead(id)` Server Action on load; `params` is `Promise<{ id: string }>` — must `await params`
  - _Requirements: 10.2, 10.3, 10.4, 10.5_

  - [ ]* 14.1 Write property test for enquiry list sort order
    - **Property 19: Enquiry list is always sorted by most recent first**
    - For any set of enquiries with varying `submitted_at` timestamps, the list must be ordered most recent first
    - **Validates: Requirements 10.2**

- [ ] 15. Phase 3 — Contact form Server Action wiring
  - Modify `src/app/contact/client.tsx` (or `page.tsx` if not yet split): call `submitEnquiry(formData)` Server Action on form submit
  - Wrap Server Action call in try/catch — regardless of result (success or error), unconditionally trigger the `mailto:` action and show the toast
  - _Requirements: 10.1, 10.7_

  - [ ]* 15.1 Write property test for contact form fail-open
    - **Property 25: Contact form fallback on Supabase failure**
    - For any scenario where `submitEnquiry` throws or returns `{ success: false }`, the client must still trigger the `mailto:` action
    - **Validates: Requirements 10.7**

- [ ] 16. Checkpoint — Admin Dashboard phase
  - Ensure all tests pass, ask the user if questions arise.
  - Verify login redirect, session expiry redirect, KB CRUD round-trip, and enquiry mark-as-read flow

- [ ] 17. Phase 4 — KB retrieval utility
  - Create `src/lib/kb-retrieval.ts` with `getPublishedKBEntries(): Promise<KBEntry[]>` — queries Supabase for all rows where `is_published = true` using the anon key (RLS allows public read on published entries)
  - _Requirements: 9.4, 9.5, 11.2_

  - [ ]* 17.1 Write property test for KB retrieval — published entries included
    - **Property 16: Published KB entries are returned for chatbot context**
    - For any KB entry with `is_published = true`, `getPublishedKBEntries()` must include that entry
    - **Validates: Requirements 9.4**

  - [ ]* 17.2 Write property test for KB retrieval — unpublished entries excluded
    - **Property 17: Unpublished KB entries are excluded from chatbot context**
    - For any KB entry with `is_published = false`, `getPublishedKBEntries()` must NOT include it
    - **Validates: Requirements 9.5**

- [ ] 18. Phase 4 — `/api/chat` Route Handler
  - Create `src/app/api/chat/route.ts` exporting `POST(request: NextRequest)`
  - Implement in order:
    1. Parse and validate body — reject if `message` is absent or > 1000 characters (HTTP 400)
    2. Sanitise message content (strip `<script>`, HTML injection patterns)
    3. Rate limit — in-memory `Map<string, { count: number; resetAt: number }>` keyed by IP from `x-forwarded-for`; reject with HTTP 429 if > 20 requests from same IP within 60 seconds
    4. Query `getPublishedKBEntries()` for context
    5. Build messages array: `[system: KB context + prohibition (no system prompt disclosure, no bulk KB dump, no fabrication), user: sanitised message]`
    6. Call `streamText` (Vercel AI SDK) with `openai(model)` using `OPENAI_API_KEY` (never `NEXT_PUBLIC_`)
    7. Return streaming `Response` via `result.toDataStreamResponse()`
  - Handle AI provider errors (key invalid → 500, rate limited → 503, timeout → 504)
  - _Requirements: 11.5, 11.6, 11.8, 12.1, 12.2, 12.3, 12.6_

  - [ ]* 18.1 Write property test for chat endpoint — rejects messages over 1000 characters
    - **Property 20: Chat endpoint rejects messages over 1000 characters**
    - For any POST body where `message.length > 1000`, handler must return HTTP 400
    - Use fast-check `fc.string({ minLength: 1001 })` to generate oversized messages
    - **Validates: Requirements 12.3**

  - [ ]* 18.2 Write property test for chat endpoint — rate limiting
    - **Property 21: Chat endpoint enforces rate limiting**
    - For any sequence of > 20 requests from the same IP within 60 seconds, the 21st+ request must receive HTTP 429
    - **Validates: Requirements 11.6**

  - [ ]* 18.3 Write property test for chat endpoint — streaming response format
    - **Property 22: Chat endpoint returns a streaming response**
    - For any valid POST request within limits, the response must be a streaming response (check `Transfer-Encoding: chunked` or `ReadableStream`)
    - **Validates: Requirements 11.8**

- [ ] 19. Phase 4 — Chatbot widget component
  - Create `src/components/chatbot-widget.tsx` as a Client Component (`"use client"`)
  - Floating action button (FAB) at `bottom-20 right-4` (above `ScrollToTop` at `bottom-6 right-4`) that opens a chat panel
  - Internal state: `isOpen`, `messages: ChatMessage[]`, `isLoading`
  - On send: POST to `/api/chat` with `{ message }`, read `ReadableStream` response, append tokens to UI progressively (streaming display)
  - Clear `messages` on 30-minute inactivity or `visibilitychange` to `hidden`
  - Include disclaimer: "Responses are AI-generated and may not be exhaustive." with a link to `/contact`
  - Add `<ChatbotWidget />` to `src/app/layout.tsx`
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.7, 11.8, 12.4, 12.5, 13.5_

- [ ] 20. Final checkpoint — All phases complete
  - Ensure all tests pass, ask the user if questions arise.
  - Run `next build` and confirm exit code 0 with no TypeScript errors
  - Verify all 6 project routes resolve correctly after the Server Component split
  - Verify chatbot FAB does not overlap `ScrollToTop` button
  - Confirm `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are not referenced in any file with `NEXT_PUBLIC_` prefix or in any client component

  - [ ]* 20.1 Write property test for existing project routes — all remain accessible
    - **Property 23: All existing project routes remain accessible**
    - For any slug in `['lily-park', 'alpha-court', 'imo-hills-farm', 'abacha-road', 'eku-baptist-hospital', 'comprehensive-healthcare-centre']`, the route `/projects/{slug}` must resolve without error
    - **Validates: Requirements 13.1**

  - [ ]* 20.2 Write property test for public pages — SiteShell components present
    - **Property 24: All public pages retain SiteShell components**
    - For any public-facing page, rendered HTML must contain Header, Footer, and ScrollProgress from SiteShell
    - **Validates: Requirements 13.2**

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- All property tests use [fast-check](https://fast-check.io/) with minimum 100 iterations per property
- Each task references specific requirements from `.kiro/specs/nego-website-enhancements/requirements.md` for traceability
- Checkpoints (tasks 4, 8, 16, 20) ensure incremental validation at phase boundaries
- Environment variables required before Phase 3: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`; before Phase 4: `OPENAI_API_KEY`
- Supabase migration SQL should be applied to the project before running Phase 3 tasks
- The `(admin)` route group parentheses are stripped from URLs — routes are at `/admin/...` not `/(admin)/admin/...`

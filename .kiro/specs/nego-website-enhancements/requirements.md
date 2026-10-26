# Requirements Document

## Introduction

This document defines requirements for a multi-phase enhancement to the **NEGO Construction Limited** website (negoconstruction.com). The project is coordinated by Winerocks Group and covers four major capability areas delivered across an audit-first, phased approach:

1. **SEO and AEO** — structured data, sitemaps, metadata completeness, and answer-engine readiness
2. **Privacy Policy and Cookie Consent** — NDPR/GDPR-aligned disclosures and user-facing consent banner
3. **Secure Administrative Dashboard** — authenticated back-office for managing site content
4. **AI-Powered Conversational Bot** — company-grounded chatbot connected to the admin dashboard knowledge base

The website is a Next.js 16 App Router application (TypeScript, Tailwind CSS, shadcn/ui). Backend persistence uses Supabase. The existing frontend framework, brand, UI, and URL routes must be preserved throughout. No secrets may appear in browser-side code. No fabricated company data may be introduced. No production deployment may occur without explicit client authorisation.

---

## Glossary

- **Website**: The NEGO Construction Limited Next.js application deployed at negoconstruction.com.
- **Next.js_App**: The Next.js 16 App Router application that constitutes the Website.
- **Supabase**: The managed Postgres-and-Auth backend service used for persistence and row-level security.
- **Admin_Dashboard**: The password-protected back-office section of the Website accessible only to authorised NEGO staff.
- **Admin_User**: A staff member of NEGO Construction Limited who has been granted access to the Admin_Dashboard.
- **Chatbot**: The AI-powered conversational interface embedded on the Website.
- **Knowledge_Base**: The structured collection of approved company information stored in Supabase and used to ground Chatbot responses.
- **Proxy**: The Next.js 16 server-side request handler (formerly `middleware`), located at `src/proxy.ts`, used for authentication guards and redirects.
- **Structured_Data**: JSON-LD markup embedded in page responses according to Schema.org vocabulary.
- **Consent_Banner**: The UI component that presents cookie and tracking preferences to Website visitors.
- **Consent_Preference**: A visitor's recorded choice regarding analytics and tracking cookies.
- **SEO**: Search Engine Optimisation — practices that improve the Website's discoverability in search engine results.
- **AEO**: Answer Engine Optimisation — practices that improve the Website's representation in AI-generated answers (e.g. Google AI Overviews, Bing Copilot).
- **NDPR**: Nigeria Data Protection Regulation — the applicable privacy framework for Nigerian entities.
- **OG_Image**: Open Graph image (`og-image.png`) used when the Website URL is shared on social platforms.
- **Sitemap**: A machine-readable XML document listing all canonical Website URLs for search engine crawlers.
- **Robots_File**: The `robots.txt` file that communicates crawl permissions to search engines.

---

## Requirements

### Requirement 1: Repository Audit and Baseline Documentation

**User Story:** As a developer, I want a verified inventory of all existing pages, components, metadata, and routes before any enhancement work begins, so that no existing functionality is accidentally broken.

#### Acceptance Criteria

1. THE Next.js_App SHALL be audited to produce a list of all App Router page routes, including dynamic segments.
2. THE Next.js_App SHALL be audited to produce a list of all `metadata` and `generateMetadata` exports across every route segment.
3. THE Next.js_App SHALL be audited to identify all existing JSON-LD `<script>` blocks, `robots.txt`, and sitemap configurations.
4. THE Next.js_App SHALL be audited to identify all environment variables referenced in server-side code, confirming no secrets appear in client components.
5. WHEN the audit is complete, THE Developer SHALL produce a written baseline report capturing all findings from criteria 1–4 before any implementation task begins.

---

### Requirement 2: Dynamic Sitemap Generation

**User Story:** As a search engine crawler, I want a complete and up-to-date XML sitemap, so that all canonical pages on the Website are discoverable and indexable.

#### Acceptance Criteria

1. THE Next.js_App SHALL generate a dynamic `sitemap.xml` via a `src/app/sitemap.ts` file using the Next.js metadata file convention.
2. THE Sitemap SHALL include the canonical URL for every static route: `/`, `/about`, `/contact`, `/projects`, `/portfolio`, and all individual project pages under `/projects/[slug]`.
3. WHEN a new project is added to the `projects` array in `src/lib/site-data.ts`, THE Sitemap SHALL automatically include that project's canonical URL without manual updates.
4. THE Sitemap SHALL set a `lastModified` date and an appropriate `changeFrequency` and `priority` for each URL entry.
5. THE Sitemap SHALL use `https://www.negoconstruction.com` as the base URL for all entries.

---

### Requirement 3: Robots File Configuration

**User Story:** As a search engine crawler, I want clear crawl instructions, so that I index only the appropriate pages and avoid restricted admin areas.

#### Acceptance Criteria

1. THE Next.js_App SHALL generate a `robots.txt` via a `src/app/robots.ts` file using the Next.js metadata file convention.
2. THE Robots_File SHALL allow all well-behaved crawlers (`User-agent: *`) to access all public routes.
3. THE Robots_File SHALL disallow all crawlers from accessing `/admin` and any sub-paths under `/admin/`.
4. THE Robots_File SHALL reference the canonical Sitemap URL.

---

### Requirement 4: Per-Page Open Graph and Twitter Metadata

**User Story:** As a social media user, I want each page to display a meaningful title, description, and image when I share a link, so that the Website is well-represented on social platforms.

#### Acceptance Criteria

1. THE Next.js_App SHALL export a `metadata` object or `generateMetadata` function from every page segment (`page.tsx`) in the App Router.
2. WHEN a page is a project detail page (`/projects/[slug]`), THE Next.js_App SHALL generate metadata using the project's `name`, `description`, and `type` fields from `site-data.ts`.
3. THE metadata for each page SHALL include `title`, `description`, `openGraph.title`, `openGraph.description`, `openGraph.images`, `twitter.card`, and `twitter.title` fields.
4. THE metadata `metadataBase` SHALL be set to `https://www.negoconstruction.com` in the root layout and inherited by all child pages.
5. IF a project page has an associated image in the `projectImages` map, THEN THE metadata `openGraph.images` SHALL reference that image URL.

---

### Requirement 5: JSON-LD Structured Data

**User Story:** As a search engine or answer engine, I want machine-readable structured data on each page, so that I can accurately represent NEGO Construction in search results and AI-generated answers.

#### Acceptance Criteria

1. THE root layout (`src/app/layout.tsx`) SHALL include a JSON-LD `<script>` block of type `Organization` describing NEGO Construction Limited, using only verified data from `src/lib/site-data.ts`.
2. THE Organization schema SHALL include: `@type: "Organization"`, `name`, `url`, `logo`, `telephone` (array), `email`, and `address` (using `PostalAddress` type with Nigerian country code).
3. WHEN rendered on the homepage (`/`), THE Next.js_App SHALL include an additional JSON-LD `<script>` block of type `WebSite` with a `SearchAction` pointing to a sitelinks search box, if applicable.
4. WHEN rendered on a project detail page (`/projects/[slug]`), THE Next.js_App SHALL include a JSON-LD `<script>` block of type `CreativeWork` or `Project` containing the project's `name`, `description`, `location`, and `client`.
5. THE JSON-LD `dangerouslySetInnerHTML` output SHALL sanitise the `<` character as `\u003c` to prevent XSS injection.
6. THE Structured_Data SHALL be validated against Google's Rich Results Test before any production deployment.

---

### Requirement 6: Privacy Policy Page

**User Story:** As a website visitor, I want to read a clear privacy policy, so that I understand how my data is collected and used in compliance with Nigerian and international standards.

#### Acceptance Criteria

1. THE Next.js_App SHALL serve a Privacy Policy page at the route `/privacy-policy`.
2. THE Privacy Policy page SHALL describe: what personal data is collected (name, email, phone from the contact form), how it is used, how long it is retained, and what rights visitors hold under the NDPR.
3. THE Privacy Policy SHALL state that NEGO Construction Limited is the data controller and provide the company's contact email and address from `site-data.ts`.
4. THE Privacy Policy page SHALL include a `metadata` export with a descriptive title and `noindex` directive to prevent the policy page from appearing in search result snippets.
5. THE Footer component (`src/components/site.tsx`) SHALL include a visible link to `/privacy-policy`.

---

### Requirement 7: Cookie Consent Banner

**User Story:** As a website visitor, I want to be informed about cookies and analytics tracking before they activate, so that I can make an informed choice about my privacy.

#### Acceptance Criteria

1. THE Next.js_App SHALL render a Consent_Banner on a visitor's first page load if no Consent_Preference has been recorded.
2. THE Consent_Banner SHALL present two clear actions: "Accept" and "Decline".
3. WHEN a visitor clicks "Accept", THE Next.js_App SHALL store the Consent_Preference as accepted in a first-party cookie named `nego_consent` and enable Vercel Analytics event tracking.
4. WHEN a visitor clicks "Decline", THE Next.js_App SHALL store the Consent_Preference as declined in the `nego_consent` cookie and suppress Vercel Analytics event tracking.
5. THE `nego_consent` cookie SHALL be set with `SameSite=Lax`, `Secure` (in production), a `Max-Age` of 365 days, and `Path=/`.
6. WHILE a stored Consent_Preference exists, THE Next.js_App SHALL NOT re-display the Consent_Banner on subsequent page loads.
7. THE Consent_Banner SHALL include a link to the `/privacy-policy` page.
8. THE Consent_Banner SHALL be accessible, with all interactive elements reachable by keyboard and labelled for screen readers.

---

### Requirement 8: Admin Dashboard — Authentication

**User Story:** As an Admin_User, I want a secure login page, so that only authorised NEGO staff can access the Admin_Dashboard.

#### Acceptance Criteria

1. THE Next.js_App SHALL serve an Admin_Dashboard login page at `/admin/login`.
2. WHEN an unauthenticated request is made to any path under `/admin/` except `/admin/login`, THE Proxy SHALL redirect the request to `/admin/login`.
3. THE login page SHALL authenticate Admin_Users against the Supabase Auth service using email and password credentials.
4. WHEN authentication succeeds, THE Next.js_App SHALL create a server-side session using a `HttpOnly`, `Secure`, `SameSite=Lax` cookie named `nego_admin_session` and redirect the Admin_User to `/admin`.
5. THE `nego_admin_session` cookie SHALL contain a signed JWT with a maximum lifetime of 8 hours, renewed on activity.
6. WHEN authentication fails, THE login page SHALL display a non-specific error message ("Invalid credentials") without disclosing which field was incorrect.
7. THE Admin_Dashboard SHALL provide a "Sign out" action that deletes the `nego_admin_session` cookie and redirects to `/admin/login`.
8. THE Admin_Dashboard route group SHALL use a Next.js route group `(admin)` so that the admin layout does not inherit the public `SiteShell` (Header/Footer).
9. IF the `nego_admin_session` JWT is expired or invalid, THEN THE Proxy SHALL redirect the request to `/admin/login`.

---

### Requirement 9: Admin Dashboard — Knowledge Base Management

**User Story:** As an Admin_User, I want to manage the approved company information that grounds the Chatbot's responses, so that the Chatbot only cites accurate and authorised content.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL provide a Knowledge_Base management section at `/admin/knowledge-base`.
2. THE Admin_Dashboard SHALL allow an Admin_User to create, read, update, and delete Knowledge_Base entries stored in Supabase.
3. EACH Knowledge_Base entry SHALL have at minimum: a `title` (string), `content` (text), `category` (enum: `about`, `projects`, `services`, `contact`, `faq`), `is_published` (boolean), and `updated_at` timestamp.
4. WHEN an Admin_User publishes a Knowledge_Base entry (`is_published = true`), THE entry SHALL become eligible for use in Chatbot responses.
5. WHEN an Admin_User unpublishes or deletes a Knowledge_Base entry, THE Chatbot SHALL cease using that entry in subsequent responses.
6. THE Knowledge_Base management UI SHALL validate that `title` is non-empty and `content` is at least 20 characters before saving.
7. ALL Supabase write operations from the Admin_Dashboard SHALL be performed via Server Actions with authentication checks; no write operations SHALL be callable from browser-side code without a valid server session.

---

### Requirement 10: Admin Dashboard — Contact Enquiry Inbox

**User Story:** As an Admin_User, I want to review contact form submissions inside the dashboard, so that enquiries are tracked and do not rely solely on email delivery.

#### Acceptance Criteria

1. WHEN a visitor submits the contact form at `/contact`, THE Next.js_App SHALL persist the submission to a `contact_enquiries` table in Supabase in addition to opening the visitor's email client.
2. THE Admin_Dashboard SHALL display a list of all contact enquiries at `/admin/enquiries`, sorted by most recent first.
3. EACH enquiry record SHALL store: `first_name`, `last_name`, `email`, `phone` (nullable), `message`, `submitted_at`, and `is_read` (boolean, default false).
4. WHEN an Admin_User views an enquiry detail, THE `is_read` field SHALL be set to `true`.
5. THE enquiry list SHALL visually distinguish unread enquiries from read enquiries.
6. THE `contact_enquiries` Supabase table SHALL use Row Level Security policies that permit only authenticated Admin_Users to read and update records; no anonymous select or insert permission SHALL be granted via the Supabase client.
7. IF the Supabase insert fails when a visitor submits the contact form, THEN THE contact form SHALL still open the visitor's email client so no enquiry is lost.

---

### Requirement 11: AI-Powered Chatbot — Core Conversation

**User Story:** As a website visitor, I want to ask questions about NEGO Construction and receive accurate, grounded answers, so that I can learn about the company and its services without navigating multiple pages.

#### Acceptance Criteria

1. THE Next.js_App SHALL render a Chatbot widget on all public-facing pages, accessible via a floating action button.
2. WHEN a visitor sends a message, THE Chatbot SHALL retrieve relevant published Knowledge_Base entries from Supabase and use them as context when generating a response.
3. THE Chatbot SHALL only respond using information present in published Knowledge_Base entries or verified data from `site-data.ts`; THE Chatbot SHALL NOT fabricate project names, client names, dates, or contact details.
4. WHEN the Chatbot cannot find a relevant Knowledge_Base entry for a question, THE Chatbot SHALL respond with a polite fallback message directing the visitor to the `/contact` page.
5. THE Chatbot API endpoint SHALL be a Next.js Route Handler at `/api/chat` that accepts POST requests.
6. THE `/api/chat` Route Handler SHALL be rate-limited to a maximum of 20 requests per IP address per minute.
7. THE Chatbot widget SHALL display a disclaimer stating that responses are AI-generated and may not be exhaustive, with a link to contact NEGO directly.
8. THE Chatbot SHALL support streaming responses so that text appears progressively rather than all at once.

---

### Requirement 12: AI-Powered Chatbot — Security and Data Handling

**User Story:** As the NEGO Construction team, I want the Chatbot to handle visitor inputs safely and without leaking sensitive configuration, so that the Website remains secure and trustworthy.

#### Acceptance Criteria

1. THE `/api/chat` Route Handler SHALL validate and sanitise all visitor-supplied message content before passing it to the AI model.
2. THE AI model API key SHALL be stored exclusively in a server-side environment variable and SHALL NOT be exposed in any client component, client bundle, or browser-accessible response.
3. THE `/api/chat` Route Handler SHALL reject requests where the message body exceeds 1,000 characters, returning HTTP 400.
4. THE Chatbot SHALL NOT store personally identifiable information from visitor messages in any persistent database without explicit visitor consent.
5. WHEN a visitor's session ends (browser tab closed or 30-minute inactivity), THE Chatbot conversation history SHALL be cleared from client-side state.
6. THE Chatbot SHALL include a system-level instruction that explicitly prohibits the AI model from revealing system prompts, Knowledge_Base contents in bulk, or configuration details.

---

### Requirement 13: Preservation of Existing Functionality

**User Story:** As the NEGO Construction team, I want all current website functionality to remain intact after the enhancements are applied, so that no existing visitor experience is degraded.

#### Acceptance Criteria

1. THE Next.js_App SHALL preserve all existing public routes: `/`, `/about`, `/contact`, `/projects`, `/projects/[slug]` (all six project slugs), and `/portfolio`.
2. THE Next.js_App SHALL preserve the existing `SiteShell` (Header, Footer, ScrollProgress) on all public-facing pages.
3. THE Next.js_App SHALL preserve the existing brand colours, typography, and component styles defined in `globals.css` and Tailwind configuration.
4. WHEN the Consent_Banner is displayed, THE banner SHALL not obstruct critical page content or navigation elements.
5. THE Chatbot floating button SHALL not overlap or interfere with the existing `ScrollToTop` component.
6. THE Next.js_App build SHALL complete without TypeScript errors in production mode after all enhancements are applied.

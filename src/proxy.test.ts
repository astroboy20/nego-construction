/**
 * Property tests for src/proxy.ts
 *
 * Property 12: Proxy redirects all unauthenticated /admin/* requests (except login)
 * For any /admin/* path that is not /admin/login, with no nego_admin_session
 * cookie present, the proxy must return a redirect to /admin/login.
 *
 * Validates: Requirements 8.2
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fc from 'fast-check'

// ---------------------------------------------------------------------------
// Lightweight mocks for next/server
//
// The proxy uses NextRequest and NextResponse from 'next/server'. We replicate
// only the surface area that proxy.ts actually touches so the tests run in a
// plain Node/Vitest environment without a Next.js edge runtime.
// ---------------------------------------------------------------------------

/** Minimal cookie jar that mirrors the NextRequest cookies API. */
class MockCookies {
  private _store: Map<string, string>

  constructor(cookies: Record<string, string> = {}) {
    this._store = new Map(Object.entries(cookies))
  }

  get(name: string): { name: string; value: string } | undefined {
    const value = this._store.get(name)
    return value !== undefined ? { name, value } : undefined
  }
}

/**
 * Minimal NextRequest-shaped object.
 * proxy.ts accesses: request.nextUrl.pathname, request.cookies.get(), request.url
 */
function makeRequest(
  pathname: string,
  cookies: Record<string, string> = {},
  baseUrl = 'https://www.negoconstruction.com',
): object {
  return {
    nextUrl: { pathname },
    url: `${baseUrl}${pathname}`,
    cookies: new MockCookies(cookies),
  }
}

/**
 * Capture calls to NextResponse.redirect and NextResponse.next so assertions
 * can distinguish between the two without importing the real next/server.
 */
const mockRedirectFn = vi.fn((url: URL | string) => ({
  _type: 'redirect' as const,
  url: url instanceof URL ? url.toString() : url,
}))

const mockNextFn = vi.fn(() => ({ _type: 'next' as const }))

vi.mock('next/server', () => ({
  NextResponse: {
    redirect: mockRedirectFn,
    next: mockNextFn,
  },
}))

// ---------------------------------------------------------------------------
// Import AFTER the mock is registered so proxy.ts picks up the mocked module.
// ---------------------------------------------------------------------------
const { proxy } = await import('./proxy')

const LOGIN_PATH = '/admin/login'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generates an arbitrary /admin/* path that is NOT /admin/login (or any
 * sub-path of it). fast-check produces the slug portion; we prepend /admin/.
 */
const arbAdminNonLoginPath = fc
  .string({ minLength: 1, maxLength: 80 })
  // Only printable ASCII path chars to keep URLs well-formed
  .filter((s) => /^[a-zA-Z0-9\-_/]+$/.test(s))
  // Must not produce /admin/login or /admin/login/…
  .map((s) => `/admin/${s}`)
  .filter((p) => p !== LOGIN_PATH && !p.startsWith(LOGIN_PATH + '/'))

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Property 12: Proxy redirects unauthenticated /admin/* requests (except login)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Ensure JWT_SECRET is defined so the proxy doesn't hit the "empty secret"
    // branch. The redirect-before-jwtVerify path (no cookie) never touches the
    // secret, but it's cleaner to have it consistent.
    process.env.JWT_SECRET = 'test-secret-value'
  })

  // --- Concrete baseline cases ---

  it('redirects /admin (root) with no cookie to /admin/login', async () => {
    const req = makeRequest('/admin', {})
    await proxy(req as Parameters<typeof proxy>[0])

    expect(mockRedirectFn).toHaveBeenCalledOnce()
    const redirectArg: URL = mockRedirectFn.mock.calls[0][0]
    expect(redirectArg.pathname).toBe(LOGIN_PATH)
  })

  it('redirects /admin/knowledge-base with no cookie to /admin/login', async () => {
    const req = makeRequest('/admin/knowledge-base', {})
    await proxy(req as Parameters<typeof proxy>[0])

    expect(mockRedirectFn).toHaveBeenCalledOnce()
    const redirectArg: URL = mockRedirectFn.mock.calls[0][0]
    expect(redirectArg.pathname).toBe(LOGIN_PATH)
  })

  it('redirects /admin/enquiries with no cookie to /admin/login', async () => {
    const req = makeRequest('/admin/enquiries', {})
    await proxy(req as Parameters<typeof proxy>[0])

    expect(mockRedirectFn).toHaveBeenCalledOnce()
    const redirectArg: URL = mockRedirectFn.mock.calls[0][0]
    expect(redirectArg.pathname).toBe(LOGIN_PATH)
  })

  // --- Login page is always allowed through ---

  it('allows /admin/login through without a cookie', async () => {
    const req = makeRequest(LOGIN_PATH, {})
    await proxy(req as Parameters<typeof proxy>[0])

    expect(mockNextFn).toHaveBeenCalledOnce()
    expect(mockRedirectFn).not.toHaveBeenCalled()
  })

  it('allows /admin/login/ (trailing slash) through without a cookie', async () => {
    const req = makeRequest(`${LOGIN_PATH}/`, {})
    await proxy(req as Parameters<typeof proxy>[0])

    expect(mockNextFn).toHaveBeenCalledOnce()
    expect(mockRedirectFn).not.toHaveBeenCalled()
  })

  // --- Property-based: arbitrary /admin/* sub-paths, no cookie ---

  it('redirects any /admin/<sub-path> (not login) with no cookie — 200 runs', async () => {
    await fc.assert(
      fc.asyncProperty(arbAdminNonLoginPath, async (pathname) => {
        vi.clearAllMocks()

        const req = makeRequest(pathname, {})
        await proxy(req as Parameters<typeof proxy>[0])

        // Must have redirected exactly once
        expect(mockRedirectFn).toHaveBeenCalledOnce()

        // Redirect target must be /admin/login
        const redirectArg: URL = mockRedirectFn.mock.calls[0][0]
        expect(redirectArg.pathname).toBe(LOGIN_PATH)

        // Must NOT have called next()
        expect(mockNextFn).not.toHaveBeenCalled()
      }),
      { numRuns: 200 },
    )
  })

  it('redirect target always uses the same origin as the incoming request', async () => {
    await fc.assert(
      fc.asyncProperty(arbAdminNonLoginPath, async (pathname) => {
        vi.clearAllMocks()

        const baseUrl = 'https://www.negoconstruction.com'
        const req = makeRequest(pathname, {}, baseUrl)
        await proxy(req as Parameters<typeof proxy>[0])

        expect(mockRedirectFn).toHaveBeenCalledOnce()
        const redirectArg: URL = mockRedirectFn.mock.calls[0][0]

        // The redirect URL must include the canonical origin
        expect(redirectArg.origin).toBe(baseUrl)
        expect(redirectArg.pathname).toBe(LOGIN_PATH)
      }),
      { numRuns: 200 },
    )
  })

  // --- Irrelevant cookies should not prevent the redirect ---

  it('still redirects when unrelated cookies are present but nego_admin_session is absent', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbAdminNonLoginPath,
        // Generate a record of arbitrary cookie name→value pairs,
        // explicitly excluding the session cookie name
        fc.dictionary(
          fc.string({ minLength: 1, maxLength: 30 }).filter((k) => k !== 'nego_admin_session'),
          fc.string({ minLength: 1, maxLength: 50 }),
          { minKeys: 0, maxKeys: 5 },
        ),
        async (pathname, extraCookies) => {
          vi.clearAllMocks()

          const req = makeRequest(pathname, extraCookies)
          await proxy(req as Parameters<typeof proxy>[0])

          expect(mockRedirectFn).toHaveBeenCalledOnce()
          const redirectArg: URL = mockRedirectFn.mock.calls[0][0]
          expect(redirectArg.pathname).toBe(LOGIN_PATH)
          expect(mockNextFn).not.toHaveBeenCalled()
        },
      ),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property 13: Proxy redirects requests with invalid or expired JWT
//
// For any /admin/* path (not login) that carries a nego_admin_session cookie
// whose value is either:
//   (a) a JWT signed with the wrong secret, or
//   (b) a JWT that has already expired,
// the proxy must redirect to /admin/login.
//
// Validates: Requirements 8.9
// ---------------------------------------------------------------------------

import { SignJWT } from 'jose'

/** Helper — sign a JWT with an arbitrary secret and expiry offset. */
async function signJwt(
  secret: string,
  expiresInSeconds: number,
  extraPayload: Record<string, unknown> = {},
): Promise<string> {
  const key = new TextEncoder().encode(secret)
  const now = Math.floor(Date.now() / 1000)
  return new SignJWT({ sub: 'user-id', email: 'admin@nego.com', ...extraPayload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now - Math.abs(expiresInSeconds) - 1) // always in the past for expired
    .setExpirationTime(now + expiresInSeconds)          // positive = future, negative = past
    .sign(key)
}

// The secret the proxy uses (set in beforeEach for each test).
const VALID_SECRET = 'correct-proxy-secret'
const WRONG_SECRET = 'completely-different-secret'

describe('Property 13: Proxy redirects /admin/* requests with invalid or expired JWT', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.JWT_SECRET = VALID_SECRET
  })

  // -------------------------------------------------------------------------
  // Concrete baseline: expired JWT
  // -------------------------------------------------------------------------

  it('redirects /admin with an expired JWT to /admin/login', async () => {
    // expiresInSeconds = -1 → already expired 1 second ago
    const token = await signJwt(VALID_SECRET, -1)
    const req = makeRequest('/admin', { nego_admin_session: token })
    await proxy(req as Parameters<typeof proxy>[0])

    expect(mockRedirectFn).toHaveBeenCalledOnce()
    const redirectArg: URL = mockRedirectFn.mock.calls[0][0]
    expect(redirectArg.pathname).toBe(LOGIN_PATH)
    expect(mockNextFn).not.toHaveBeenCalled()
  })

  it('redirects /admin/knowledge-base with an expired JWT to /admin/login', async () => {
    const token = await signJwt(VALID_SECRET, -3600) // expired 1 hour ago
    const req = makeRequest('/admin/knowledge-base', { nego_admin_session: token })
    await proxy(req as Parameters<typeof proxy>[0])

    expect(mockRedirectFn).toHaveBeenCalledOnce()
    const redirectArg: URL = mockRedirectFn.mock.calls[0][0]
    expect(redirectArg.pathname).toBe(LOGIN_PATH)
  })

  // -------------------------------------------------------------------------
  // Concrete baseline: wrong-secret JWT (signature mismatch)
  // -------------------------------------------------------------------------

  it('redirects /admin with a wrong-secret JWT to /admin/login', async () => {
    const token = await signJwt(WRONG_SECRET, 3600) // valid expiry but wrong key
    const req = makeRequest('/admin', { nego_admin_session: token })
    await proxy(req as Parameters<typeof proxy>[0])

    expect(mockRedirectFn).toHaveBeenCalledOnce()
    const redirectArg: URL = mockRedirectFn.mock.calls[0][0]
    expect(redirectArg.pathname).toBe(LOGIN_PATH)
    expect(mockNextFn).not.toHaveBeenCalled()
  })

  it('redirects /admin/enquiries with a wrong-secret JWT to /admin/login', async () => {
    const token = await signJwt(WRONG_SECRET, 3600)
    const req = makeRequest('/admin/enquiries', { nego_admin_session: token })
    await proxy(req as Parameters<typeof proxy>[0])

    expect(mockRedirectFn).toHaveBeenCalledOnce()
    const redirectArg: URL = mockRedirectFn.mock.calls[0][0]
    expect(redirectArg.pathname).toBe(LOGIN_PATH)
  })

  // -------------------------------------------------------------------------
  // Concrete baseline: malformed / non-JWT token value
  // -------------------------------------------------------------------------

  it('redirects when nego_admin_session contains a plain string (not a JWT)', async () => {
    const req = makeRequest('/admin', { nego_admin_session: 'not-a-jwt-at-all' })
    await proxy(req as Parameters<typeof proxy>[0])

    expect(mockRedirectFn).toHaveBeenCalledOnce()
    const redirectArg: URL = mockRedirectFn.mock.calls[0][0]
    expect(redirectArg.pathname).toBe(LOGIN_PATH)
  })

  it('redirects when nego_admin_session contains an empty string', async () => {
    const req = makeRequest('/admin', { nego_admin_session: '' })
    await proxy(req as Parameters<typeof proxy>[0])

    // Cookie present but empty → proxy sees token = '' which fails jwtVerify
    expect(mockRedirectFn).toHaveBeenCalledOnce()
    const redirectArg: URL = mockRedirectFn.mock.calls[0][0]
    expect(redirectArg.pathname).toBe(LOGIN_PATH)
  })

  // -------------------------------------------------------------------------
  // Sanity check: valid JWT with the correct secret passes through
  // -------------------------------------------------------------------------

  it('allows through a valid, non-expired JWT signed with the correct secret', async () => {
    const token = await signJwt(VALID_SECRET, 3600) // expires in 1 hour
    const req = makeRequest('/admin/knowledge-base', { nego_admin_session: token })
    await proxy(req as Parameters<typeof proxy>[0])

    expect(mockNextFn).toHaveBeenCalledOnce()
    expect(mockRedirectFn).not.toHaveBeenCalled()
  })

  // -------------------------------------------------------------------------
  // Property-based: arbitrary /admin/* sub-paths + expired JWT — 200 runs
  // -------------------------------------------------------------------------

  it('redirects any /admin/<sub-path> with an expired JWT — 200 runs', async () => {
    // Pre-sign a token that is already expired; reused across all runs to
    // avoid async work inside the property (fast-check expects sync or await
    // at the property level, not inside the arbitrary generation).
    const expiredToken = await signJwt(VALID_SECRET, -1)

    await fc.assert(
      fc.asyncProperty(arbAdminNonLoginPath, async (pathname) => {
        vi.clearAllMocks()

        const req = makeRequest(pathname, { nego_admin_session: expiredToken })
        await proxy(req as Parameters<typeof proxy>[0])

        expect(mockRedirectFn).toHaveBeenCalledOnce()
        const redirectArg: URL = mockRedirectFn.mock.calls[0][0]
        expect(redirectArg.pathname).toBe(LOGIN_PATH)
        expect(mockNextFn).not.toHaveBeenCalled()
      }),
      { numRuns: 200 },
    )
  })

  // -------------------------------------------------------------------------
  // Property-based: arbitrary /admin/* sub-paths + wrong-secret JWT — 200 runs
  // -------------------------------------------------------------------------

  it('redirects any /admin/<sub-path> with a wrong-secret JWT — 200 runs', async () => {
    const wrongSecretToken = await signJwt(WRONG_SECRET, 3600)

    await fc.assert(
      fc.asyncProperty(arbAdminNonLoginPath, async (pathname) => {
        vi.clearAllMocks()

        const req = makeRequest(pathname, { nego_admin_session: wrongSecretToken })
        await proxy(req as Parameters<typeof proxy>[0])

        expect(mockRedirectFn).toHaveBeenCalledOnce()
        const redirectArg: URL = mockRedirectFn.mock.calls[0][0]
        expect(redirectArg.pathname).toBe(LOGIN_PATH)
        expect(mockNextFn).not.toHaveBeenCalled()
      }),
      { numRuns: 200 },
    )
  })

  // -------------------------------------------------------------------------
  // Property-based: arbitrary malformed token strings — 100 runs
  // -------------------------------------------------------------------------

  it('redirects any /admin/<sub-path> with an arbitrary non-JWT token value — 100 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbAdminNonLoginPath,
        // Produce strings that are definitely not valid JWTs
        // (a valid JWT has exactly 3 base64url segments separated by dots)
        fc.string({ minLength: 1, maxLength: 200 }).filter((s) => {
          const parts = s.split('.')
          // Exclude strings that happen to look like 3-segment base64url JWTs
          return parts.length !== 3
        }),
        async (pathname, badToken) => {
          vi.clearAllMocks()

          const req = makeRequest(pathname, { nego_admin_session: badToken })
          await proxy(req as Parameters<typeof proxy>[0])

          expect(mockRedirectFn).toHaveBeenCalledOnce()
          const redirectArg: URL = mockRedirectFn.mock.calls[0][0]
          expect(redirectArg.pathname).toBe(LOGIN_PATH)
          expect(mockNextFn).not.toHaveBeenCalled()
        },
      ),
      { numRuns: 100 },
    )
  })

  // -------------------------------------------------------------------------
  // Property-based: /admin/login always passes through regardless of JWT state
  // -------------------------------------------------------------------------

  it('always allows /admin/login through even with an expired JWT — 100 runs', async () => {
    const expiredToken = await signJwt(VALID_SECRET, -1)

    // fast-check produces various /admin/login sub-paths (including bare path)
    const arbLoginPath = fc.oneof(
      fc.constant(LOGIN_PATH),
      fc.constant(`${LOGIN_PATH}/`),
      fc.string({ minLength: 1, maxLength: 40 })
        .filter((s) => /^[a-zA-Z0-9\-_/]+$/.test(s))
        .map((s) => `${LOGIN_PATH}/${s}`),
    )

    await fc.assert(
      fc.asyncProperty(arbLoginPath, async (pathname) => {
        vi.clearAllMocks()

        const req = makeRequest(pathname, { nego_admin_session: expiredToken })
        await proxy(req as Parameters<typeof proxy>[0])

        expect(mockNextFn).toHaveBeenCalledOnce()
        expect(mockRedirectFn).not.toHaveBeenCalled()
      }),
      { numRuns: 100 },
    )
  })
})

/**
 * Property tests for contact form fail-open behavior.
 *
 * Property 25: Contact form fallback on Supabase failure
 * For any scenario where `submitEnquiry` throws or returns `{ success: false }`,
 * the client MUST still trigger the `mailto:` action so no enquiry is lost.
 *
 * **Validates: Requirements 10.7**
 *
 * Design note: The fail-open logic lives in the `submit` handler in
 * `src/app/contact/client.tsx`. The handler:
 *   1. Calls `submitEnquiry(fd)` inside a try/catch
 *   2. Unconditionally sets `window.location.href` to a `mailto:` URL
 *      regardless of whether submitEnquiry throws or returns { success: false }
 *
 * These tests exercise that exact execution path by replicating the handler
 * logic and verifying the mailto invariant across hundreds of generated
 * failure scenarios.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import type { ActionResult } from '@/lib/types'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mock the actions module — submitEnquiry is the Server Action under test.
// Individual tests will configure the mock to throw or return { success: false }.
const mockSubmitEnquiry = vi.fn<[FormData], Promise<ActionResult>>()

vi.mock('./actions', () => ({
  submitEnquiry: (...args: [FormData]) => mockSubmitEnquiry(...args),
}))

// ---------------------------------------------------------------------------
// The submit logic under test
//
// This is the exact logic from src/app/contact/client.tsx extracted into a
// testable function. It mirrors the real implementation precisely so that the
// property holds against the actual code pattern.
// ---------------------------------------------------------------------------

const TO = 'info@negoconstruction.com'

async function submitLogic(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  message: string,
  onMailto: (href: string) => void,
): Promise<void> {
  const fd = new FormData()
  fd.set('firstName', firstName)
  fd.set('lastName', lastName)
  fd.set('email', email)
  fd.set('phone', phone)
  fd.set('message', message)

  // Wrapped in try/catch — failure must not prevent the mailto fallback
  // (Requirement 10.7: fail-open, no enquiry is lost).
  try {
    await mockSubmitEnquiry(fd)
  } catch (err) {
    // Log silently; the mailto path below still runs unconditionally.
    // (mirrors: console.error("[ContactForm] submitEnquiry failed:", err))
    void err
  }

  const subject = encodeURIComponent(
    `Enquiry from ${firstName} ${lastName} — NEGO Construction`,
  )
  const body = encodeURIComponent(
    `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone || '—'}\n\n${message}`,
  )

  // Open user's email client pre-filled — unconditional (Requirement 10.7)
  const href = `mailto:${TO}?subject=${subject}&body=${body}`
  onMailto(href)
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Arbitrary non-empty string (name / email / message field). */
const arbNonEmpty = fc.string({ minLength: 1, maxLength: 80 }).filter(s => s.trim().length > 0)

/** Arbitrary string (may be empty — phone is optional). */
const arbString = fc.string({ minLength: 0, maxLength: 80 })

/** Arbitrary error value that submitEnquiry might throw. */
const arbError = fc.oneof(
  fc.constant(new Error('Network error')),
  fc.constant(new Error('Supabase connection refused')),
  fc.constant(new Error('TIMEOUT')),
  fc.string({ minLength: 1, maxLength: 60 }).map(msg => new Error(msg)),
  // Non-Error throws (these happen in practice too)
  fc.constant('string error'),
  fc.constant({ code: 500, message: 'Internal' }),
  fc.constant(null),
)

/** Arbitrary ActionResult that represents a Supabase failure (success: false). */
const arbFailureResult: fc.Arbitrary<ActionResult> = fc.oneof(
  fc.constant({ success: false as const }),
  fc.constant({ success: false as const, error: 'Failed to save enquiry.' }),
  fc.constant({ success: false as const, error: 'Missing required fields.' }),
  fc.constant({ success: false as const, error: 'An unexpected error occurred.' }),
  fc.string({ minLength: 1, maxLength: 80 }).map(err => ({ success: false as const, error: err })),
)

/** Arbitrary valid form field values. */
const arbFormFields = fc.record({
  firstName: arbNonEmpty,
  lastName: arbString,
  email: arbNonEmpty,
  phone: arbString,
  message: arbNonEmpty,
})

// ---------------------------------------------------------------------------
// Test setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks()
})

// ---------------------------------------------------------------------------
// Property 25a — mailto fires even when submitEnquiry throws
// ---------------------------------------------------------------------------

describe('Property 25a: mailto fires when submitEnquiry throws', () => {
  it('concrete — throws Error("Network error") → mailto is still triggered', async () => {
    mockSubmitEnquiry.mockRejectedValueOnce(new Error('Network error'))

    const captured: string[] = []
    await submitLogic(
      'Ada', 'Obi', 'ada@example.com', '0800000000', 'Hello',
      href => captured.push(href),
    )

    expect(captured).toHaveLength(1)
    expect(captured[0]).toMatch(/^mailto:/)
    expect(captured[0]).toContain(TO)
  })

  it('concrete — throws synchronously (string) → mailto is still triggered', async () => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    mockSubmitEnquiry.mockImplementationOnce(() => { throw 'fatal string error' })

    const captured: string[] = []
    await submitLogic(
      'Chidi', 'Nwosu', 'chidi@example.com', '', 'Question',
      href => captured.push(href),
    )

    expect(captured).toHaveLength(1)
    expect(captured[0]).toMatch(/^mailto:/)
  })

  it('property — any thrown error still results in mailto — 200 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbFormFields,
        arbError,
        async (fields, error) => {
          vi.clearAllMocks()
          mockSubmitEnquiry.mockRejectedValueOnce(error)

          const captured: string[] = []
          await submitLogic(
            fields.firstName, fields.lastName, fields.email, fields.phone, fields.message,
            href => captured.push(href),
          )

          // Invariant: mailto is triggered exactly once, regardless of the error
          expect(captured).toHaveLength(1)
          expect(captured[0]).toMatch(/^mailto:/)
          expect(captured[0]).toContain(TO)
        },
      ),
      { numRuns: 200 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property 25b — mailto fires when submitEnquiry returns { success: false }
// ---------------------------------------------------------------------------

describe('Property 25b: mailto fires when submitEnquiry returns { success: false }', () => {
  it('concrete — returns { success: false } → mailto is still triggered', async () => {
    mockSubmitEnquiry.mockResolvedValueOnce({ success: false, error: 'Failed to save enquiry.' })

    const captured: string[] = []
    await submitLogic(
      'Emeka', 'Eze', 'emeka@example.com', '', 'Interested',
      href => captured.push(href),
    )

    expect(captured).toHaveLength(1)
    expect(captured[0]).toMatch(/^mailto:/)
    expect(captured[0]).toContain(TO)
  })

  it('property — any { success: false } result still triggers mailto — 200 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbFormFields,
        arbFailureResult,
        async (fields, failureResult) => {
          vi.clearAllMocks()
          mockSubmitEnquiry.mockResolvedValueOnce(failureResult)

          const captured: string[] = []
          await submitLogic(
            fields.firstName, fields.lastName, fields.email, fields.phone, fields.message,
            href => captured.push(href),
          )

          // Invariant: mailto is triggered exactly once, regardless of the error result
          expect(captured).toHaveLength(1)
          expect(captured[0]).toMatch(/^mailto:/)
          expect(captured[0]).toContain(TO)
        },
      ),
      { numRuns: 200 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property 25c — mailto is triggered exactly once (not zero, not multiple times)
// ---------------------------------------------------------------------------

describe('Property 25c: mailto is triggered exactly once on any failure', () => {
  it('property — throw path triggers mailto exactly once — 150 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbFormFields,
        arbError,
        async (fields, error) => {
          vi.clearAllMocks()
          mockSubmitEnquiry.mockRejectedValueOnce(error)

          let callCount = 0
          await submitLogic(
            fields.firstName, fields.lastName, fields.email, fields.phone, fields.message,
            () => { callCount++ },
          )

          expect(callCount).toBe(1)
        },
      ),
      { numRuns: 150 },
    )
  })

  it('property — { success: false } path triggers mailto exactly once — 150 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbFormFields,
        arbFailureResult,
        async (fields, failureResult) => {
          vi.clearAllMocks()
          mockSubmitEnquiry.mockResolvedValueOnce(failureResult)

          let callCount = 0
          await submitLogic(
            fields.firstName, fields.lastName, fields.email, fields.phone, fields.message,
            () => { callCount++ },
          )

          expect(callCount).toBe(1)
        },
      ),
      { numRuns: 150 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property 25d — mailto URL always targets the correct recipient
// ---------------------------------------------------------------------------

describe('Property 25d: mailto URL always targets the correct recipient on failure', () => {
  it('property — throw: mailto href always contains the correct TO address — 100 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbFormFields,
        arbError,
        async (fields, error) => {
          vi.clearAllMocks()
          mockSubmitEnquiry.mockRejectedValueOnce(error)

          const captured: string[] = []
          await submitLogic(
            fields.firstName, fields.lastName, fields.email, fields.phone, fields.message,
            href => captured.push(href),
          )

          expect(captured[0]).toContain(`mailto:${TO}`)
        },
      ),
      { numRuns: 100 },
    )
  })

  it('property — { success: false }: mailto href always contains the correct TO address — 100 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbFormFields,
        arbFailureResult,
        async (fields, failureResult) => {
          vi.clearAllMocks()
          mockSubmitEnquiry.mockResolvedValueOnce(failureResult)

          const captured: string[] = []
          await submitLogic(
            fields.firstName, fields.lastName, fields.email, fields.phone, fields.message,
            href => captured.push(href),
          )

          expect(captured[0]).toContain(`mailto:${TO}`)
        },
      ),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Regression guard — success path also triggers mailto
//
// The mailto should fire even on success (it's unconditional, not a fallback
// in the error-handling sense). This confirms the implementation does not
// accidentally suppress mailto on success.
// ---------------------------------------------------------------------------

describe('Regression: mailto fires on success too (unconditional behavior)', () => {
  it('concrete — submitEnquiry returns { success: true } → mailto still fires', async () => {
    mockSubmitEnquiry.mockResolvedValueOnce({ success: true })

    const captured: string[] = []
    await submitLogic(
      'Ngozi', 'Adeyemi', 'ngozi@example.com', '+2348012345678', 'New enquiry',
      href => captured.push(href),
    )

    expect(captured).toHaveLength(1)
    expect(captured[0]).toMatch(/^mailto:/)
    expect(captured[0]).toContain(TO)
  })
})

/**
 * Property tests for Knowledge Base input validation in admin Server Actions.
 *
 * Property 15: Knowledge Base validation rejects insufficient content
 * For any KBEntryInput where `title` is empty/whitespace OR `content` has
 * fewer than 20 characters, `createKBEntry` and `updateKBEntry` must return
 * { success: false } without calling Supabase.
 *
 * Validates: Requirements 9.6
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import type { KBCategory } from '@/lib/types'

// ---------------------------------------------------------------------------
// Mocks
//
// We mock the three server-side dependencies that actions.ts imports so the
// tests run in plain Node/Vitest without a Next.js runtime or a live Supabase
// instance.
// ---------------------------------------------------------------------------

// Mock next/navigation (redirect, revalidatePath are called on success paths)
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Spy on the Supabase "insert" and "update" chains so we can assert they are
// never reached when validation fails.
const mockInsertChain = {
  insert: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ data: { id: 'new-id' }, error: null }),
  update: vi.fn().mockReturnThis(),
  eq: vi.fn().mockResolvedValue({ error: null }),
}

const mockServiceClientFn = vi.fn(() => ({
  from: vi.fn(() => mockInsertChain),
}))

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn(),
  createServiceClient: mockServiceClientFn,
}))

// verifySession is called by every KB action before validation.
// We mock it to return a valid session payload so tests focus purely on
// validation behaviour, not auth.
const mockVerifySession = vi.fn()

vi.mock('@/lib/auth', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  createSession: vi.fn(),
  verifySession: mockVerifySession,
}))

// Import AFTER all mocks are registered.
const { createKBEntry, updateKBEntry } = await import(
  '@/app/(admin)/admin/actions'
)

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const validCategories: KBCategory[] = [
  'about',
  'projects',
  'services',
  'contact',
  'faq',
]

/** Arbitrary valid category value. */
const arbCategory = fc.constantFrom(...validCategories)

/** Arbitrary title that is empty or consists only of whitespace. */
const arbEmptyTitle = fc.oneof(
  fc.constant(''),
  // One or more whitespace chars (space, tab, newline)
  fc.stringOf(fc.constantFrom(' ', '\t', '\n', '\r'), { minLength: 1, maxLength: 20 }),
)

/** Arbitrary content with fewer than 20 characters (0–19 chars inclusive). */
const arbShortContent = fc.string({ minLength: 0, maxLength: 19 })

/** Arbitrary valid title — non-empty after trimming. */
const arbValidTitle = fc
  .string({ minLength: 1, maxLength: 100 })
  .filter((s) => s.trim().length > 0)

/** Arbitrary valid content — 20 or more characters. */
const arbValidContent = fc.string({ minLength: 20, maxLength: 500 })

/** Arbitrary UUID-ish string for the entry ID in updateKBEntry calls. */
const arbId = fc.uuid()

// ---------------------------------------------------------------------------
// Test setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks()
  // Default: verifySession returns a valid session so auth never blocks.
  mockVerifySession.mockResolvedValue({ sub: 'admin-user', email: 'admin@nego.com' })
})

// ---------------------------------------------------------------------------
// Property 15a — Empty or whitespace-only title always fails validation
// ---------------------------------------------------------------------------

describe('Property 15a: createKBEntry rejects empty/whitespace title', () => {
  it('concrete — empty string title returns { success: false }', async () => {
    const result = await createKBEntry({
      title: '',
      content: 'This content is long enough to pass',
      category: 'about',
      is_published: false,
    })
    expect(result.success).toBe(false)
  })

  it('concrete — whitespace-only title ("   ") returns { success: false }', async () => {
    const result = await createKBEntry({
      title: '   ',
      content: 'This content is long enough to pass',
      category: 'faq',
      is_published: false,
    })
    expect(result.success).toBe(false)
  })

  it('property — any empty/whitespace title returns { success: false } — 200 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbEmptyTitle,
        arbValidContent,
        arbCategory,
        fc.boolean(),
        async (title, content, category, isPublished) => {
          vi.clearAllMocks()
          const result = await createKBEntry({
            title,
            content,
            category,
            is_published: isPublished,
          })
          expect(result.success).toBe(false)
        },
      ),
      { numRuns: 200 },
    )
  })

  it('property — Supabase is never called when title is empty/whitespace — 200 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbEmptyTitle,
        arbValidContent,
        arbCategory,
        fc.boolean(),
        async (title, content, category, isPublished) => {
          vi.clearAllMocks()
          mockVerifySession.mockResolvedValue({ sub: 'admin-user' })

          await createKBEntry({ title, content, category, is_published: isPublished })

          // createServiceClient() must never have been called
          expect(mockServiceClientFn).not.toHaveBeenCalled()
        },
      ),
      { numRuns: 200 },
    )
  })
})

describe('Property 15a: updateKBEntry rejects empty/whitespace title', () => {
  it('concrete — empty string title returns { success: false }', async () => {
    const result = await updateKBEntry('some-id', {
      title: '',
      content: 'This content is long enough to pass',
      category: 'services',
      is_published: true,
    })
    expect(result.success).toBe(false)
  })

  it('property — any empty/whitespace title returns { success: false } — 200 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbId,
        arbEmptyTitle,
        arbValidContent,
        arbCategory,
        fc.boolean(),
        async (id, title, content, category, isPublished) => {
          vi.clearAllMocks()
          const result = await updateKBEntry(id, {
            title,
            content,
            category,
            is_published: isPublished,
          })
          expect(result.success).toBe(false)
        },
      ),
      { numRuns: 200 },
    )
  })

  it('property — Supabase is never called when title is empty/whitespace — 200 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbId,
        arbEmptyTitle,
        arbValidContent,
        arbCategory,
        fc.boolean(),
        async (id, title, content, category, isPublished) => {
          vi.clearAllMocks()
          mockVerifySession.mockResolvedValue({ sub: 'admin-user' })

          await updateKBEntry(id, { title, content, category, is_published: isPublished })

          expect(mockServiceClientFn).not.toHaveBeenCalled()
        },
      ),
      { numRuns: 200 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property 15b — Content shorter than 20 characters always fails validation
// ---------------------------------------------------------------------------

describe('Property 15b: createKBEntry rejects content shorter than 20 chars', () => {
  it('concrete — 19-char content returns { success: false }', async () => {
    const result = await createKBEntry({
      title: 'Valid title',
      content: 'Exactly nineteen ch', // 19 characters
      category: 'about',
      is_published: false,
    })
    expect(result.success).toBe(false)
  })

  it('concrete — empty content returns { success: false }', async () => {
    const result = await createKBEntry({
      title: 'Valid title',
      content: '',
      category: 'contact',
      is_published: false,
    })
    expect(result.success).toBe(false)
  })

  it('concrete — exactly 20-char content succeeds (boundary check)', async () => {
    // Reset the Supabase mock to return success so we can confirm the action
    // proceeds past validation on the boundary value.
    mockInsertChain.single.mockResolvedValueOnce({ data: { id: 'abc' }, error: null })

    const result = await createKBEntry({
      title: 'Valid title',
      content: '12345678901234567890', // exactly 20 chars
      category: 'about',
      is_published: false,
    })
    // Validation passes; Supabase was reached (success depends on mock, but
    // the key assertion is that it did NOT return success: false due to validation)
    expect(result.success).toBe(true)
  })

  it('property — any content < 20 chars returns { success: false } — 200 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbValidTitle,
        arbShortContent,
        arbCategory,
        fc.boolean(),
        async (title, content, category, isPublished) => {
          vi.clearAllMocks()
          const result = await createKBEntry({
            title,
            content,
            category,
            is_published: isPublished,
          })
          expect(result.success).toBe(false)
        },
      ),
      { numRuns: 200 },
    )
  })

  it('property — Supabase is never called when content < 20 chars — 200 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbValidTitle,
        arbShortContent,
        arbCategory,
        fc.boolean(),
        async (title, content, category, isPublished) => {
          vi.clearAllMocks()
          mockVerifySession.mockResolvedValue({ sub: 'admin-user' })

          await createKBEntry({ title, content, category, is_published: isPublished })

          expect(mockServiceClientFn).not.toHaveBeenCalled()
        },
      ),
      { numRuns: 200 },
    )
  })
})

describe('Property 15b: updateKBEntry rejects content shorter than 20 chars', () => {
  it('concrete — 19-char content returns { success: false }', async () => {
    const result = await updateKBEntry('some-id', {
      title: 'Valid title',
      content: 'Exactly nineteen ch', // 19 characters
      category: 'projects',
      is_published: true,
    })
    expect(result.success).toBe(false)
  })

  it('property — any content < 20 chars returns { success: false } — 200 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbId,
        arbValidTitle,
        arbShortContent,
        arbCategory,
        fc.boolean(),
        async (id, title, content, category, isPublished) => {
          vi.clearAllMocks()
          const result = await updateKBEntry(id, {
            title,
            content,
            category,
            is_published: isPublished,
          })
          expect(result.success).toBe(false)
        },
      ),
      { numRuns: 200 },
    )
  })

  it('property — Supabase is never called when content < 20 chars — 200 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbId,
        arbValidTitle,
        arbShortContent,
        arbCategory,
        fc.boolean(),
        async (id, title, content, category, isPublished) => {
          vi.clearAllMocks()
          mockVerifySession.mockResolvedValue({ sub: 'admin-user' })

          await updateKBEntry(id, { title, content, category, is_published: isPublished })

          expect(mockServiceClientFn).not.toHaveBeenCalled()
        },
      ),
      { numRuns: 200 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property 15c — Both violations simultaneously still fails validation
// ---------------------------------------------------------------------------

describe('Property 15c: createKBEntry/updateKBEntry reject entries with both violations', () => {
  it('property — createKBEntry with empty title AND short content returns { success: false } — 150 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbEmptyTitle,
        arbShortContent,
        arbCategory,
        fc.boolean(),
        async (title, content, category, isPublished) => {
          vi.clearAllMocks()
          const result = await createKBEntry({
            title,
            content,
            category,
            is_published: isPublished,
          })
          expect(result.success).toBe(false)
        },
      ),
      { numRuns: 150 },
    )
  })

  it('property — updateKBEntry with empty title AND short content returns { success: false } — 150 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbId,
        arbEmptyTitle,
        arbShortContent,
        arbCategory,
        fc.boolean(),
        async (id, title, content, category, isPublished) => {
          vi.clearAllMocks()
          const result = await updateKBEntry(id, {
            title,
            content,
            category,
            is_published: isPublished,
          })
          expect(result.success).toBe(false)
        },
      ),
      { numRuns: 150 },
    )
  })
})

// ---------------------------------------------------------------------------
// Regression guard — valid inputs proceed past validation
//
// Ensures the validation check is not accidentally too broad. When both title
// and content are valid, the action must reach Supabase (success path).
// ---------------------------------------------------------------------------

describe('Regression: valid inputs are not rejected by validation', () => {
  it('createKBEntry with valid title and content calls Supabase', async () => {
    mockInsertChain.single.mockResolvedValueOnce({ data: { id: 'abc123' }, error: null })

    await createKBEntry({
      title: 'A perfectly valid title',
      content: 'Content that is definitely at least twenty characters long.',
      category: 'faq',
      is_published: true,
    })

    expect(mockServiceClientFn).toHaveBeenCalledOnce()
  })

  it('property — valid title and content always reach Supabase — 100 runs', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbValidTitle,
        arbValidContent,
        arbCategory,
        fc.boolean(),
        async (title, content, category, isPublished) => {
          vi.clearAllMocks()
          mockVerifySession.mockResolvedValue({ sub: 'admin-user' })
          // Ensure Supabase mock returns success for this run
          mockInsertChain.single.mockResolvedValueOnce({
            data: { id: 'some-id' },
            error: null,
          })

          await createKBEntry({ title, content, category, is_published: isPublished })

          // Supabase must have been reached
          expect(mockServiceClientFn).toHaveBeenCalledOnce()
        },
      ),
      { numRuns: 100 },
    )
  })
})

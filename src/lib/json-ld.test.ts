/**
 * Property tests for src/lib/json-ld.ts
 *
 * Property 9: JSON-LD serialisation escapes angle brackets
 * For any string containing `<`, serializeLD must output `\u003c`
 * with no raw `<` in the result.
 *
 * Validates: Requirement 5.5
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { serializeLD } from './json-ld'

describe('serializeLD — Property 9: angle-bracket escaping', () => {
  it('never contains a raw < character in the output for any input value', () => {
    // Arbitrary objects whose string values contain at least one `<`
    const arbStringWithAngle = fc
      .string()
      .filter((s) => s.includes('<'))

    fc.assert(
      fc.property(arbStringWithAngle, (value) => {
        const result = serializeLD({ field: value })

        // The serialised output must never contain a raw `<`
        expect(result).not.toContain('<')
      }),
      { numRuns: 200 },
    )
  })

  it('replaces every < with the \\u003c escape sequence', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => s.includes('<')),
        (value) => {
          const result = serializeLD({ field: value })

          // Count occurrences of `<` in the original value
          const rawCount = (value.match(/</g) ?? []).length

          // Count occurrences of the escape sequence in the output
          const escapedCount = (result.match(/\\u003c/g) ?? []).length

          // Every raw `<` must have been escaped
          expect(escapedCount).toBeGreaterThanOrEqual(rawCount)
        },
      ),
      { numRuns: 200 },
    )
  })

  it('preserves non-angle-bracket content faithfully', () => {
    // For strings without `<`, the output is identical to plain JSON.stringify
    fc.assert(
      fc.property(
        fc.string().filter((s) => !s.includes('<')),
        (value) => {
          const result = serializeLD({ field: value })
          expect(result).toBe(JSON.stringify({ field: value }))
        },
      ),
      { numRuns: 200 },
    )
  })

  it('handles nested objects with angle brackets in any string field', () => {
    // Arbitrary record with string values that may contain `<`
    const arbRecord = fc.record({
      name: fc.string().filter((s) => s.includes('<')),
      description: fc.string(),
      nested: fc.record({ value: fc.string().filter((s) => s.includes('<')) }),
    })

    fc.assert(
      fc.property(arbRecord, (data) => {
        const result = serializeLD(data as Record<string, unknown>)
        expect(result).not.toContain('<')
      }),
      { numRuns: 200 },
    )
  })

  // Concrete regression cases
  it('escapes a script-injection attempt', () => {
    const malicious = '</script><script>alert(1)</script>'
    const result = serializeLD({ xss: malicious })
    expect(result).not.toContain('<')
    expect(result).toContain('\\u003c')
  })

  it('escapes a single < character', () => {
    const result = serializeLD({ lt: '<' })
    expect(result).not.toContain('<')
    expect(result).toContain('\\u003c')
  })
})

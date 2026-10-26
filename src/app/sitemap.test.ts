import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { projects } from '@/lib/site-data'
import sitemap from './sitemap'

const BASE_URL = 'https://www.negoconstruction.com'

describe('Property 1: Sitemap includes all project slugs', () => {
  it('contains a URL entry for every project in site-data.ts', () => {
    const entries = sitemap()
    const urls = entries.map((e) => e.url)

    // For every project in the projects array, the canonical URL must appear in the sitemap
    for (const project of projects) {
      expect(urls).toContain(`${BASE_URL}/projects/${project.slug}`)
    }
  })

  it('contains a URL entry for every project in an arbitrary subset of the projects array', () => {
    // Use fast-check to generate arbitrary subsets (indices) of the real projects array
    // and verify each selected project's slug appears in the sitemap output
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.integer({ min: 0, max: projects.length - 1 })),
        (indices) => {
          const entries = sitemap()
          const urls = entries.map((e) => e.url)

          for (const i of indices) {
            const project = projects[i]
            expect(urls).toContain(`${BASE_URL}/projects/${project.slug}`)
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})

const VALID_CHANGE_FREQUENCIES = new Set([
  'always',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'never',
])

describe('Property 2: All sitemap entries have required fields', () => {
  it('every entry has a non-empty url, lastModified, valid changeFrequency, and priority in [0, 1]', () => {
    const entries = sitemap()

    for (const entry of entries) {
      // url must be a non-empty string
      expect(typeof entry.url).toBe('string')
      expect(entry.url.length).toBeGreaterThan(0)

      // lastModified must be present and a valid Date or string
      expect(entry.lastModified).toBeDefined()
      const ts = new Date(entry.lastModified as string | Date).getTime()
      expect(isNaN(ts)).toBe(false)

      // changeFrequency must be one of the valid values
      expect(VALID_CHANGE_FREQUENCIES.has(entry.changeFrequency as string)).toBe(true)

      // priority must be a number between 0 and 1 inclusive
      expect(typeof entry.priority).toBe('number')
      expect(entry.priority).toBeGreaterThanOrEqual(0)
      expect(entry.priority).toBeLessThanOrEqual(1)
    }
  })

  it('holds for every entry across 100 fast-check runs', () => {
    // The sitemap output is deterministic, but we use fast-check to repeatedly
    // assert the property and confirm no run produces an invalid entry
    fc.assert(
      fc.property(fc.constant(null), () => {
        const entries = sitemap()

        for (const entry of entries) {
          if (typeof entry.url !== 'string' || entry.url.length === 0) return false
          if (!entry.lastModified) return false
          const ts = new Date(entry.lastModified as string | Date).getTime()
          if (isNaN(ts)) return false
          if (!VALID_CHANGE_FREQUENCIES.has(entry.changeFrequency as string)) return false
          if (typeof entry.priority !== 'number') return false
          if (entry.priority < 0 || entry.priority > 1) return false
        }

        return true
      }),
      { numRuns: 100 }
    )
  })
})

describe('Property 3: All sitemap URLs use canonical base', () => {
  it('every url entry starts with https://www.negoconstruction.com', () => {
    const entries = sitemap()

    for (const entry of entries) {
      expect(entry.url).toMatch(/^https:\/\/www\.negoconstruction\.com/)
    }
  })

  it('holds across 100 fast-check runs', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const entries = sitemap()

        for (const entry of entries) {
          if (!entry.url.startsWith(BASE_URL)) return false
        }

        return true
      }),
      { numRuns: 100 }
    )
  })
})

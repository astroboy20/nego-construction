import { company, projects } from '@/lib/site-data'
import type { Project } from '@/lib/site-data'

const CANONICAL_BASE = 'https://www.negoconstruction.com'

/**
 * Serialises a JSON-LD object to a string safe for use in
 * `dangerouslySetInnerHTML`. Escapes `<` as `\u003c` to prevent
 * an attacker from injecting `</script>` into the inline JSON-LD block
 * via maliciously-crafted field values (requirement 5.5).
 */
export function serializeLD(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/**
 * Builds the Organization JSON-LD object for NEGO Construction Limited.
 * All values are sourced from `site-data.ts` — no fabricated data.
 * Satisfies requirement 5.1 and 5.2.
 */
export function buildOrganizationLD(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: CANONICAL_BASE,
    logo: `${CANONICAL_BASE}/android-chrome-512x512.png`,
    telephone: company.phones,
    email: company.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address,
      addressCountry: 'NG',
    },
    description: company.intro,
    sameAs: [],
  }
}

/**
 * Builds the WebSite JSON-LD object for the homepage.
 * Satisfies requirement 5.3.
 */
export function buildWebSiteLD(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: company.name,
    url: CANONICAL_BASE,
    description: company.intro,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${CANONICAL_BASE}/projects?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Builds a CreativeWork/Project JSON-LD object for an individual project page.
 * Uses only verified data from `site-data.ts` — no fabrication.
 * Satisfies requirement 5.4.
 */
export function buildProjectLD(project: Project): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    locationCreated: {
      '@type': 'Place',
      name: project.location,
    },
    contributor: {
      '@type': 'Organization',
      name: project.client,
    },
    creator: {
      '@type': 'Organization',
      name: company.name,
      url: CANONICAL_BASE,
    },
    url: `${CANONICAL_BASE}/projects/${project.slug}`,
    keywords: [project.type, ...project.scope].join(', '),
    additionalProperty: {
      '@type': 'PropertyValue',
      name: 'status',
      value: project.status,
    },
  }
}

// Re-export project list so consumers can iterate slugs without importing site-data directly
export { projects }

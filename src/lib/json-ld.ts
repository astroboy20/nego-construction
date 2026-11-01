import { company, projects } from '@/lib/site-data'
import type { Project } from '@/lib/site-data'

const CANONICAL_BASE = 'https://www.negoconstruction.com'

/**
 * Serialises a JSON-LD object to a string safe for use in
 * `dangerouslySetInnerHTML`. Escapes `<` as `\u003c` to prevent
 * an attacker from injecting `</script>` into the inline JSON-LD block
 * via maliciously-crafted field values.
 */
export function serializeLD(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/**
 * Builds the Organization JSON-LD object for NEGO Construction Limited.
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
    sameAs: [
      'https://www.instagram.com/nego_construction',
      'https://www.linkedin.com/company/nego-construction-limited/',
    ],
  }
}

/**
 * Builds a LocalBusiness JSON-LD object.
 * This is the highest-signal schema for AEO — it lets AI assistants and
 * local search understand who NEGO is, where they are, and what they do.
 */
export function buildLocalBusinessLD(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'GeneralContractor'],
    name: company.name,
    url: CANONICAL_BASE,
    logo: `${CANONICAL_BASE}/android-chrome-512x512.png`,
    image: `${CANONICAL_BASE}/opengraph-image`,
    telephone: company.phones[0],
    email: company.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2, Gbolahun Lawal Street, Off Ashabi Cole, Lateef Jakande Road',
      addressLocality: 'Ikeja',
      addressRegion: 'Lagos',
      addressCountry: 'NG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 6.6018,
      longitude: 3.3515,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    description: company.intro,
    foundingDate: '1999',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 10,
      maxValue: 100,
    },
    knowsAbout: [
      'Civil engineering',
      'Infrastructure construction',
      'Road construction',
      'Residential development',
      'Commercial construction',
      'Healthcare facility construction',
      'Project management',
    ],
    sameAs: [
      'https://www.instagram.com/nego_construction',
      'https://www.linkedin.com/company/nego-construction-limited/',
    ],
    hasMap: 'https://maps.google.com/?q=2+Gbolahun+Lawal+Street+Ikeja+Lagos+Nigeria',
  }
}

/**
 * Builds the WebSite JSON-LD object for the homepage.
 */
export function buildWebSiteLD(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: company.name,
    url: CANONICAL_BASE,
    description: company.intro,
  }
}

/**
 * Builds a BreadcrumbList JSON-LD for a project page.
 * Helps crawlers and AI assistants understand page hierarchy.
 */
export function buildBreadcrumbLD(
  items: Array<{ name: string; url: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Builds a FAQPage JSON-LD from a list of Q&A pairs.
 * Strong AEO signal — AI assistants surface FAQ answers directly.
 */
export function buildFAQLD(
  faqs: Array<{ question: string; answer: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }
}

/**
 * Builds a CreativeWork/Project JSON-LD object for an individual project page.
 * Uses only verified data from `site-data.ts` — no fabrication.
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

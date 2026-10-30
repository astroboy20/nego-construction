/**
 * Server-side helpers for querying the Vercel Web Analytics REST API.
 * Docs: https://vercel.com/docs/rest-api/web-analytics
 *
 * Confirmed response shapes via live API testing (Oct 2026):
 *
 * GET /visits/count
 *   → { data: { visitors: number, pageviews: number }, query: {...} }
 *
 * GET /visits/aggregate?by=day
 *   → { data: [{ timestamp: string, visitors: number, pageviews: number }] }
 *
 * GET /visits/aggregate?by=requestPath
 *   → { data: [{ requestPath: string, visitors: number, pageviews: number }] }
 *
 * GET /visits/aggregate?by=country
 *   → { data: [{ country: string, visitors: number, pageviews: number }] }
 *
 * GET /visits/aggregate?by=deviceType
 *   → { data: [{ deviceType: string, visitors: number, pageviews: number }] }
 */

const BASE = 'https://api.vercel.com/v1/query/web-analytics'

function authHeaders() {
  return {
    Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  }
}

function buildParams(extra: Record<string, string | undefined>): URLSearchParams {
  const params = new URLSearchParams()
  const projectId = process.env.VERCEL_PROJECT_ID
  const teamId = process.env.VERCEL_TEAM_ID
  if (projectId) params.set('projectId', projectId)
  if (teamId) params.set('teamId', teamId)
  for (const [k, v] of Object.entries(extra)) {
    if (v !== undefined) params.set(k, v)
  }
  return params
}

/** ISO date string for N days ago at midnight UTC */
function daysAgo(n: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - n)
  d.setUTCHours(0, 0, 0, 0)
  return d.toISOString()
}

export interface VercelAnalyticsSummary {
  totalPageViews: number
  uniqueVisitors: number
  topPages: Array<{ path: string; views: number }>
  topCountries: Array<{ country: string; views: number }>
  topDevices: Array<{ device: string; views: number }>
  pageViewsByDay: Array<{ date: string; views: number; visitors: number }>
  available: boolean
  error?: string
}

export async function getVercelAnalyticsSummary(): Promise<VercelAnalyticsSummary> {
  const token = process.env.VERCEL_ACCESS_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID

  const empty: VercelAnalyticsSummary = {
    totalPageViews: 0,
    uniqueVisitors: 0,
    topPages: [],
    topCountries: [],
    topDevices: [],
    pageViewsByDay: [],
    available: false,
  }

  if (!token || !projectId || token.startsWith('your_')) {
    return empty
  }

  const since = daysAgo(30)
  const until = new Date().toISOString()

  try {
    const [countRes, pagesRes, countriesRes, devicesRes, trendRes] = await Promise.all([
      // Count: returns { data: { visitors, pageviews } }
      fetch(
        `${BASE}/visits/count?${buildParams({ since, until })}`,
        { headers: authHeaders(), cache: 'no-store' },
      ),
      // Top pages: by=requestPath → [{ requestPath, visitors, pageviews }]
      fetch(
        `${BASE}/visits/aggregate?${buildParams({ since, until, by: 'requestPath', limit: '10' })}`,
        { headers: authHeaders(), cache: 'no-store' },
      ),
      // Top countries: by=country → [{ country, visitors, pageviews }]
      fetch(
        `${BASE}/visits/aggregate?${buildParams({ since, until, by: 'country', limit: '8' })}`,
        { headers: authHeaders(), cache: 'no-store' },
      ),
      // Devices: by=deviceType → [{ deviceType, visitors, pageviews }]
      fetch(
        `${BASE}/visits/aggregate?${buildParams({ since, until, by: 'deviceType', limit: '5' })}`,
        { headers: authHeaders(), cache: 'no-store' },
      ),
      // Daily trend: by=day → [{ timestamp, visitors, pageviews }]
      fetch(
        `${BASE}/visits/aggregate?${buildParams({ since, until, by: 'day', limit: '31' })}`,
        { headers: authHeaders(), cache: 'no-store' },
      ),
    ])

    // Log any non-OK responses to help diagnose issues
    for (const [name, res] of [
      ['count', countRes],
      ['pages', pagesRes],
      ['countries', countriesRes],
      ['devices', devicesRes],
      ['trend', trendRes],
    ] as [string, Response][]) {
      if (!res.ok) {
        const body = await res.text()
        console.warn(`[vercel-analytics] ${name} → ${res.status}: ${body}`)
      }
    }

    if (!countRes.ok) {
      return { ...empty, error: `API error ${countRes.status}` }
    }

    const [countData, pagesData, countriesData, devicesData, trendData] = await Promise.all([
      countRes.json() as Promise<{ data: { visitors: number; pageviews: number } }>,
      pagesRes.ok ? (pagesRes.json() as Promise<{ data: Array<{ requestPath: string; pageviews: number; visitors: number }> }>) : Promise.resolve({ data: [] }),
      countriesRes.ok ? (countriesRes.json() as Promise<{ data: Array<{ country: string; pageviews: number; visitors: number }> }>) : Promise.resolve({ data: [] }),
      devicesRes.ok ? (devicesRes.json() as Promise<{ data: Array<{ deviceType: string; pageviews: number; visitors: number }> }>) : Promise.resolve({ data: [] }),
      trendRes.ok ? (trendRes.json() as Promise<{ data: Array<{ timestamp: string; pageviews: number; visitors: number }> }>) : Promise.resolve({ data: [] }),
    ])

    return {
      available: true,
      totalPageViews: countData.data?.pageviews ?? 0,
      uniqueVisitors: countData.data?.visitors ?? 0,
      topPages: (pagesData.data ?? [])
        .map((r) => ({ path: r.requestPath ?? '/', views: r.pageviews ?? 0 }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10),
      topCountries: (countriesData.data ?? [])
        .map((r) => ({ country: r.country || 'Unknown', views: r.pageviews ?? 0 }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 8),
      topDevices: (devicesData.data ?? [])
        .map((r) => ({ device: r.deviceType || 'Unknown', views: r.pageviews ?? 0 }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5),
      pageViewsByDay: (trendData.data ?? [])
        .map((r) => ({
          date: r.timestamp,
          views: r.pageviews ?? 0,
          visitors: r.visitors ?? 0,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    }
  } catch (err) {
    console.warn('[vercel-analytics] Fetch error:', err)
    return { ...empty, error: String(err) }
  }
}

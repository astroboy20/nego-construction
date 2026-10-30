/**
 * Server-side helpers for querying the Vercel Web Analytics REST API.
 * Docs: https://vercel.com/docs/rest-api/web-analytics
 *
 * Requires env vars:
 *   VERCEL_ACCESS_TOKEN  — a Vercel API token with Web Analytics Read scope
 *   VERCEL_PROJECT_ID    — the project's ID from Vercel dashboard
 *   VERCEL_TEAM_ID       — the team ID (optional if personal account)
 */

const BASE = 'https://api.vercel.com/v1/query/web-analytics'

function authHeaders() {
  return {
    Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  }
}

function buildParams(
  extra: Record<string, string | undefined>,
): URLSearchParams {
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
  pageViewsByDay: Array<{ date: string; views: number }>
  available: boolean
}

/**
 * Fetches a 30-day summary from the Vercel Analytics API.
 * Returns `available: false` (with zeroed data) when the token/project are not
 * configured or the API returns an error — so the dashboard degrades gracefully.
 */
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
    // Fetch all in parallel
    const [countRes, visitorRes, pagesRes, countriesRes, devicesRes, trendRes] =
      await Promise.all([
        // Total page views count
        fetch(
          `${BASE}/visits/count?${buildParams({ since, until })}`,
          { headers: authHeaders(), next: { revalidate: 3600 } },
        ),
        // Unique visitors count
        fetch(
          `${BASE}/visitors/count?${buildParams({ since, until })}`,
          { headers: authHeaders(), next: { revalidate: 3600 } },
        ),
        // Top pages
        fetch(
          `${BASE}/visits/aggregate?${buildParams({ since, until, by: 'requestPath', limit: '10' })}`,
          { headers: authHeaders(), next: { revalidate: 3600 } },
        ),
        // Top countries
        fetch(
          `${BASE}/visits/aggregate?${buildParams({ since, until, by: 'country', limit: '8' })}`,
          { headers: authHeaders(), next: { revalidate: 3600 } },
        ),
        // Device breakdown
        fetch(
          `${BASE}/visits/aggregate?${buildParams({ since, until, by: 'deviceType', limit: '5' })}`,
          { headers: authHeaders(), next: { revalidate: 3600 } },
        ),
        // Page views by day (last 30 days)
        fetch(
          `${BASE}/visits/aggregate?${buildParams({ since, until, by: 'day', limit: '31' })}`,
          { headers: authHeaders(), next: { revalidate: 3600 } },
        ),
      ])

    if (!countRes.ok || !visitorRes.ok) {
      console.warn(
        '[vercel-analytics] API returned non-OK:',
        countRes.status,
        visitorRes.status,
      )
      return empty
    }

    const [countData, visitorData, pagesData, countriesData, devicesData, trendData] =
      await Promise.all([
        countRes.json(),
        visitorRes.json(),
        pagesRes.json(),
        countriesRes.json(),
        devicesRes.json(),
        trendRes.json(),
      ])

    return {
      available: true,
      totalPageViews: countData?.total ?? 0,
      uniqueVisitors: visitorData?.total ?? 0,
      topPages: ((pagesData?.data ?? []) as Array<{ requestPath: string; total: number }>)
        .map((r) => ({ path: r.requestPath, views: r.total }))
        .slice(0, 10),
      topCountries: ((countriesData?.data ?? []) as Array<{ country: string; total: number }>)
        .map((r) => ({ country: r.country ?? 'Unknown', views: r.total }))
        .slice(0, 8),
      topDevices: ((devicesData?.data ?? []) as Array<{ deviceType: string; total: number }>)
        .map((r) => ({ device: r.deviceType ?? 'Unknown', views: r.total }))
        .slice(0, 5),
      pageViewsByDay: ((trendData?.data ?? []) as Array<{ timestamp: string; total: number }>)
        .map((r) => ({ date: r.timestamp, views: r.total }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    }
  } catch (err) {
    console.warn('[vercel-analytics] Fetch error:', err)
    return empty
  }
}

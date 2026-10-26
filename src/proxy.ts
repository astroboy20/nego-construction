/**
 * Auth guard proxy for the NEGO admin dashboard.
 *
 * Runs before every request matched by /admin/:path*. Allows the login page
 * through unconditionally. For all other /admin/* paths it reads the
 * `nego_admin_session` cookie, verifies the JWT signature and expiry, and
 * either passes the request on or redirects to /admin/login.
 *
 * This file exports `proxy` (not `middleware`) and is placed at `src/proxy.ts`
 * per the Next.js 16 convention. See:
 *   node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 */

import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'nego_admin_session'
const LOGIN_PATH = '/admin/login'

/** Returns the JWT secret as a Uint8Array, required by jose. */
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    // In production this would be a misconfiguration — redirect to login so
    // the admin section is inaccessible rather than open.
    return new TextEncoder().encode('')
  }
  return new TextEncoder().encode(secret)
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // Always allow the login page through — the browser needs to be able to
  // reach /admin/login without a valid session.
  if (pathname === LOGIN_PATH || pathname.startsWith(LOGIN_PATH + '/')) {
    return NextResponse.next()
  }

  // Read the session cookie from the incoming request.
  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    // No session cookie present — redirect to login.
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
  }

  try {
    const secret = getJwtSecret()
    await jwtVerify(token, secret)
    // JWT is valid and not expired — allow the request through.
    return NextResponse.next()
  } catch {
    // JWT is expired, malformed, or signature mismatch — redirect to login.
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}

/**
 * Server-side authentication utilities for the NEGO admin dashboard.
 *
 * Sessions are stored as signed JWTs in an HttpOnly cookie named
 * `nego_admin_session`. The JWT is signed with JWT_SECRET and has an 8-hour
 * max lifetime. Supabase Auth is used for identity verification (email +
 * password); the resulting Supabase session token is embedded in the JWT
 * payload so the proxy can verify it without calling Supabase on every request.
 *
 * All functions in this module are server-side only — never import from a
 * Client Component.
 */

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'

const COOKIE_NAME = 'nego_admin_session'
const SESSION_MAX_AGE = 8 * 60 * 60 // 8 hours in seconds

/** Returns the JWT secret as a Uint8Array suitable for jose. */
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set.')
  }
  return new TextEncoder().encode(secret)
}

export interface SessionPayload {
  sub: string        // Supabase user ID
  email: string      // Admin user email
  accessToken: string // Supabase access token (for downstream Supabase calls)
  iat?: number
  exp?: number
}

/**
 * Sign in an admin user with email and password via Supabase Auth.
 * On success, returns the session payload. Throws on failure.
 */
export async function signIn(email: string, password: string): Promise<SessionPayload> {
  const supabase = createServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.session || !data.user) {
    throw new Error('Invalid credentials')
  }

  return {
    sub: data.user.id,
    email: data.user.email ?? email,
    accessToken: data.session.access_token,
  }
}

/**
 * Create a signed JWT and write it to the `nego_admin_session` HttpOnly cookie.
 * Call this after a successful `signIn`.
 */
export async function createSession(payload: SessionPayload): Promise<void> {
  const secret = getJwtSecret()

  const token = await new SignJWT({
    sub: payload.sub,
    email: payload.email,
    accessToken: payload.accessToken,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

/**
 * Verify the `nego_admin_session` cookie and return the decoded payload.
 * Returns `null` if the cookie is absent, invalid, or expired.
 *
 * Use this in Server Components and Server Actions for defence-in-depth checks.
 * The proxy (src/proxy.ts) performs the same check on every /admin/* request.
 */
export async function verifySession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  try {
    const secret = getJwtSecret()
    const { payload } = await jwtVerify(token, secret)

    if (
      typeof payload.sub !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.accessToken !== 'string'
    ) {
      return null
    }

    return {
      sub: payload.sub,
      email: payload.email as string,
      accessToken: payload.accessToken as string,
    }
  } catch {
    // Token is expired, malformed, or signature mismatch
    return null
  }
}

/**
 * Delete the `nego_admin_session` cookie, effectively signing the admin out.
 * Call from a Server Action or Route Handler only.
 */
export async function signOut(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
}

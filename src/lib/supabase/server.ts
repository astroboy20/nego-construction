import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client for use in Server Components, Server Actions,
 * and Route Handlers. Uses the anon key — RLS policies control data access.
 *
 * For write operations that need to bypass RLS (e.g. contact enquiry inserts),
 * pass the service role key explicitly at the call site.
 */
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing required environment variables: SUPABASE_URL and SUPABASE_ANON_KEY must be set.'
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Creates a Supabase client using the service role key, which bypasses RLS.
 * Use ONLY in trusted server-side contexts (Server Actions, Route Handlers).
 * Never pass the service role key to client components.
 */
export function createServiceClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.'
    )
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      // Disable auto-refresh and session persistence for server-side clients
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

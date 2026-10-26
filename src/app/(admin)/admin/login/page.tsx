import type { Metadata } from 'next'
import LoginForm from './login-form'

export const metadata: Metadata = {
  title: 'Sign In',
  robots: { index: false, follow: false },
}

/**
 * Admin login page — Server Component shell.
 * Accessible without a session: the proxy allows /admin/login through.
 * The interactive form is extracted to a Client Component so it can
 * manage error state and progressive enhancement.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">
            NEGO Admin
          </p>
          <h1 className="mt-3 text-2xl font-black">Sign in</h1>
        </div>

        <div className="border border-border bg-background p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

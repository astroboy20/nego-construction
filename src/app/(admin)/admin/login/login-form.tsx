'use client'

import { useState, useTransition } from 'react'
import { loginAction } from '@/app/(admin)/admin/actions'

/**
 * Login form — Client Component.
 * Calls the loginAction Server Action on submit.
 * On success the action calls redirect('/admin') server-side.
 * On failure it returns { success: false, error: 'Invalid credentials' }
 * which is displayed here.
 */
export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await loginAction(formData)
      // loginAction only returns on failure — on success it redirects server-side
      if (result && !result.success) {
        setError(result.error ?? 'Invalid credentials')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {error && (
        <p
          role="alert"
          aria-live="assertive"
          className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
        >
          {error}
        </p>
      )}

      <label className="flex flex-col gap-2 text-sm font-bold">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={isPending}
          className="border border-input bg-background px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-bold">
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          disabled={isPending}
          className="border border-input bg-background px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="button-primary mt-1 w-full disabled:opacity-50"
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}

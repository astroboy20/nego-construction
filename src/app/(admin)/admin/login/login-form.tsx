'use client'

import { useId, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

// TODO: point this at your real login endpoint / replace with your server action.
const LOGIN_ENDPOINT = '/api/admin/login'
const REDIRECT_TO = '/admin'

export default function LoginForm() {
  const router = useRouter()
  const emailId = useId()
  const passwordId = useId()
  const errorId = useId()

  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending(true)

    const data = new FormData(e.currentTarget)

    try {
      const res = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.get('email'),
          password: data.get('password'),
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setError(body?.error ?? 'Incorrect email or password. Check your details and try again.')
        setPending(false)
        return
      }

      router.replace(REDIRECT_TO)
      router.refresh()
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
      setPending(false)
    }
  }

  const inputClass =
    'block w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-base text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-[#033a21] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#033a21]/10 disabled:opacity-60'

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      {error && (
        <div
          id={errorId}
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor={emailId} className="mb-2 block text-sm font-medium text-neutral-900">
          Work email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="username"
          required
          disabled={pending}
          placeholder="you@company.com"
          aria-describedby={error ? errorId : undefined}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={passwordId} className="mb-2 block text-sm font-medium text-neutral-900">
          Password
        </label>
        <div className="relative">
          <input
            id={passwordId}
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            disabled={pending}
            placeholder="Enter your password"
            aria-describedby={error ? errorId : undefined}
            className={`${inputClass} pr-20`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-4 text-sm font-medium text-neutral-600 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#033a21]"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#033a21] px-4 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#04502d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#033a21] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? (
          <>
            <svg className="h-4 w-4 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Signing in…
          </>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  )
}
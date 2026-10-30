'use client'

import { useState, useId } from 'react'
import { CheckCircle, Send } from 'lucide-react'
import { submitFeatureRequest } from '@/app/(admin)/admin/actions'
import type { FeatureRequestPriority } from '@/lib/types'

const PRIORITY_OPTIONS: { value: FeatureRequestPriority; label: string; desc: string }[] = [
  { value: 'low', label: 'Low', desc: 'Nice to have' },
  { value: 'medium', label: 'Medium', desc: 'Would be helpful' },
  { value: 'high', label: 'High', desc: 'This is critical' },
]

/**
 * Sends an email notification via EmailJS REST API.
 * Runs client-side after a successful form submit.
 */
async function notifyAdminViaEmailJS(data: {
  name: string
  email: string
  title: string
  priority: string
}) {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    // EmailJS not configured — skip silently
    return
  }

  try {
    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          from_name: data.name,
          from_email: data.email,
          subject: `New Feature Request: ${data.title}`,
          message: `A new ${data.priority} priority feature request has been submitted.\n\nTitle: ${data.title}\nFrom: ${data.name} (${data.email})`,
        },
      }),
    })
  } catch (err) {
    // Non-fatal — form was already saved to DB
    console.warn('[FeatureRequestForm] EmailJS notification failed:', err)
  }
}

export default function FeatureRequestForm() {
  const nameId = useId()
  const emailId = useId()
  const titleId = useId()
  const descId = useId()
  const priorityId = useId()

  const [priority, setPriority] = useState<FeatureRequestPriority>('medium')
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending(true)

    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const title = (form.elements.namedItem('title') as HTMLInputElement).value.trim()
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value.trim()

    try {
      const result = await submitFeatureRequest({ name, email, title, description, priority })

      if (!result.success) {
        setError(result.error ?? 'Failed to submit. Please try again.')
        return
      }

      // Send email notification (non-blocking)
      notifyAdminViaEmailJS({ name, email, title, priority })
      setSuccess(true)
    } catch {
      setError('Could not reach the server. Please check your connection.')
    } finally {
      setPending(false)
    }
  }

  const inputCls =
    'block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-[#033a21] focus:outline-none focus:ring-4 focus:ring-[#033a21]/10 disabled:opacity-60'

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-8 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-7 w-7 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Thank you!</h2>
        <p className="max-w-xs text-sm text-neutral-600">
          Your feature request has been submitted. Our team will review it and
          get back to you via email.
        </p>
        <button
          type="button"
          onClick={() => {
            setSuccess(false)
            setError(null)
          }}
          className="mt-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm"
      noValidate
    >
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label htmlFor={nameId} className="mb-1.5 block text-sm font-medium text-neutral-900">
            Your name <span className="text-red-500" aria-hidden>*</span>
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            required
            disabled={pending}
            placeholder="John Doe"
            className={inputCls}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor={emailId} className="mb-1.5 block text-sm font-medium text-neutral-900">
            Email address <span className="text-red-500" aria-hidden>*</span>
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            disabled={pending}
            placeholder="you@example.com"
            className={inputCls}
          />
        </div>
      </div>

      {/* Title */}
      <div className="mt-5">
        <label htmlFor={titleId} className="mb-1.5 block text-sm font-medium text-neutral-900">
          Feature title <span className="text-red-500" aria-hidden>*</span>
        </label>
        <input
          id={titleId}
          name="title"
          type="text"
          required
          disabled={pending}
          placeholder="e.g. Add a dark mode for the website"
          className={inputCls}
        />
      </div>

      {/* Description */}
      <div className="mt-5">
        <label htmlFor={descId} className="mb-1.5 block text-sm font-medium text-neutral-900">
          Description <span className="text-red-500" aria-hidden>*</span>
        </label>
        <textarea
          id={descId}
          name="description"
          rows={5}
          required
          disabled={pending}
          placeholder="Describe the feature you'd like to see. Include any context about why it would be useful."
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Priority */}
      <div className="mt-5">
        <p id={priorityId} className="mb-2 block text-sm font-medium text-neutral-900">
          Priority
        </p>
        <div
          role="radiogroup"
          aria-labelledby={priorityId}
          className="flex gap-3"
        >
          {PRIORITY_OPTIONS.map(({ value, label, desc }) => (
            <label
              key={value}
              className={`flex flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-xl border py-3 text-center text-sm transition-all ${
                priority === value
                  ? 'border-[#033a21] bg-[#033a21]/5 font-semibold text-[#033a21]'
                  : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'
              }`}
            >
              <input
                type="radio"
                name="priority"
                value={value}
                checked={priority === value}
                onChange={() => setPriority(value)}
                className="sr-only"
                disabled={pending}
              />
              <span className="font-semibold">{label}</span>
              <span className="text-xs font-normal opacity-70">{desc}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#033a21] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#04502d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#033a21] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Submitting…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden />
            Submit Request
          </>
        )}
      </button>
    </form>
  )
}

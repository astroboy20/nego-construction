'use client'

import { useId, useState, type ChangeEvent, type FormEvent } from 'react'
import { CheckCircle2, Send, AlertCircle } from 'lucide-react'
import { submitFeatureRequest } from '@/app/(admin)/admin/actions'
import type { FeatureRequestPriority } from '@/lib/types'

const PRIORITY_OPTIONS: {
  value: FeatureRequestPriority
  label: string
  desc: string
  dot: string
}[] = [
  { value: 'low', label: 'Low', desc: 'Nice to have', dot: 'bg-sky-500' },
  { value: 'medium', label: 'Medium', desc: 'Would be helpful', dot: 'bg-amber-500' },
  { value: 'high', label: 'High', desc: 'This is critical', dot: 'bg-red-500' },
]

const DESC_MIN = 20
const DESC_MAX = 1000

type Fields = { name: string; email: string; title: string; description: string }
type FieldErrors = Partial<Record<keyof Fields, string>>

function validate(v: Fields): FieldErrors {
  const e: FieldErrors = {}
  if (!v.name.trim()) e.name = 'Please enter your name.'
  if (!v.email.trim()) e.email = 'Please enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    e.email = 'That email address doesn’t look right.'
  if (!v.title.trim()) e.title = 'Give your request a short title.'
  if (v.description.trim().length < DESC_MIN)
    e.description = `Please add a little more detail (at least ${DESC_MIN} characters).`
  return e
}

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

const inputBase =
  'block w-full rounded-xl border bg-neutral-50 px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 transition-colors focus:bg-white focus:outline-none focus:ring-4 disabled:opacity-60 sm:text-sm'
const inputOk = 'border-neutral-200 focus:border-[#033a21] focus:ring-[#033a21]/10'
const inputBad = 'border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-500/10'

export default function FeatureRequestForm() {
  const ids = {
    name: useId(),
    email: useId(),
    title: useId(),
    description: useId(),
    priority: useId(),
  }

  const [values, setValues] = useState<Fields>({
    name: '',
    email: '',
    title: '',
    description: '',
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [priority, setPriority] = useState<FeatureRequestPriority>('medium')
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function onChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (fieldErrors[name as keyof Fields]) {
      setFieldErrors((fe) => ({ ...fe, [name]: undefined }))
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const errs = validate(values)
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0] as keyof Fields
      document.getElementById(ids[first])?.focus()
      return
    }

    setPending(true)
    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      title: values.title.trim(),
      description: values.description.trim(),
      priority,
    }

    try {
      const result = await submitFeatureRequest(payload)

      if (!result.success) {
        setError(result.error ?? 'Failed to submit. Please try again.')
        return
      }

      // Send email notification (non-blocking)
      notifyAdminViaEmailJS({
        name: payload.name,
        email: payload.email,
        title: payload.title,
        priority,
      })
      setSuccess(true)
    } catch {
      setError('Could not reach the server. Please check your connection.')
    } finally {
      setPending(false)
    }
  }

  function reset() {
    setValues({ name: '', email: '', title: '', description: '' })
    setFieldErrors({})
    setPriority('medium')
    setError(null)
    setSuccess(false)
  }

  if (success) {
    return (
      <div
        role="status"
        className="flex flex-col items-center rounded-3xl border border-neutral-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10 sm:py-20"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-8 w-8 text-[#033a21]" aria-hidden />
        </span>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-900">
          Thank you!
        </h2>
        <p className="mt-3 max-w-sm text-base leading-relaxed text-neutral-600">
          Your feature request has been submitted. Our team will review it and
          get back to you via email.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#033a21]"
        >
          Submit another request
        </button>
      </div>
    )
  }

  const describedBy = (k: keyof Fields) =>
    fieldErrors[k] ? `${ids[k]}-error` : undefined

  const FieldError = ({ k }: { k: keyof Fields }) =>
    fieldErrors[k] ? (
      <p
        id={`${ids[k]}-error`}
        className="mt-1.5 flex items-center gap-1.5 text-sm text-red-700"
      >
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
        {fieldErrors[k]}
      </p>
    ) : null

  const labelCls = 'mb-2 block text-sm font-medium text-neutral-900'
  const descLen = values.description.length

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-10"
    >
      <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
        Tell us about your idea
      </h2>
      <p className="mt-1 text-sm text-neutral-600">
        Fields marked <span className="text-red-600">*</span> are required.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.name} className={labelCls}>
            Your name <span className="text-red-600" aria-hidden>*</span>
          </label>
          <input
            id={ids.name}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={onChange}
            disabled={pending}
            placeholder="John Doe"
            aria-invalid={!!fieldErrors.name}
            aria-describedby={describedBy('name')}
            className={`${inputBase} ${fieldErrors.name ? inputBad : inputOk}`}
          />
          <FieldError k="name" />
        </div>

        <div>
          <label htmlFor={ids.email} className={labelCls}>
            Email address <span className="text-red-600" aria-hidden>*</span>
          </label>
          <input
            id={ids.email}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={onChange}
            disabled={pending}
            placeholder="you@example.com"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={describedBy('email')}
            className={`${inputBase} ${fieldErrors.email ? inputBad : inputOk}`}
          />
          <FieldError k="email" />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor={ids.title} className={labelCls}>
          Feature title <span className="text-red-600" aria-hidden>*</span>
        </label>
        <input
          id={ids.title}
          name="title"
          type="text"
          value={values.title}
          onChange={onChange}
          disabled={pending}
          maxLength={120}
          placeholder="e.g. Add a dark mode for the website"
          aria-invalid={!!fieldErrors.title}
          aria-describedby={describedBy('title')}
          className={`${inputBase} ${fieldErrors.title ? inputBad : inputOk}`}
        />
        <FieldError k="title" />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <label htmlFor={ids.description} className="text-sm font-medium text-neutral-900">
            Description <span className="text-red-600" aria-hidden>*</span>
          </label>
          <span
            className={`text-xs tabular-nums ${
              descLen > DESC_MAX - 50 ? 'text-amber-700' : 'text-neutral-500'
            }`}
          >
            {descLen}/{DESC_MAX}
          </span>
        </div>
        <textarea
          id={ids.description}
          name="description"
          rows={6}
          value={values.description}
          onChange={onChange}
          disabled={pending}
          maxLength={DESC_MAX}
          placeholder="Describe the feature you’d like to see. Include any context about why it would be useful."
          aria-invalid={!!fieldErrors.description}
          aria-describedby={describedBy('description')}
          className={`${inputBase} resize-y ${fieldErrors.description ? inputBad : inputOk}`}
        />
        <FieldError k="description" />
      </div>

      <fieldset className="mt-6" disabled={pending}>
        <legend className={labelCls}>Priority</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PRIORITY_OPTIONS.map(({ value, label, desc, dot }) => (
            <label key={value} className="relative cursor-pointer">
              <input
                type="radio"
                name="priority"
                value={value}
                checked={priority === value}
                onChange={() => setPriority(value)}
                className="peer sr-only"
              />
              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 transition-colors hover:border-neutral-300 peer-checked:border-[#033a21] peer-checked:bg-emerald-50/60 peer-checked:ring-1 peer-checked:ring-[#033a21] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#033a21] peer-disabled:opacity-60 sm:flex-col sm:items-start sm:gap-2">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} aria-hidden />
                <span>
                  <span className="block text-sm font-semibold text-neutral-900">{label}</span>
                  <span className="block text-xs text-neutral-600">{desc}</span>
                </span>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#033a21] px-4 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#04502d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#033a21] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? (
          <>
            <svg
              className="h-4 w-4 animate-spin motion-reduce:animate-none"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Submitting…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden />
            Submit request
          </>
        )}
      </button>
    </form>
  )
}
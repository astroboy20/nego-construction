'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createKBEntry } from '@/app/(admin)/admin/actions'
import type { KBCategory } from '@/lib/types'

const CATEGORIES: { value: KBCategory; label: string }[] = [
  { value: 'about', label: 'About' },
  { value: 'projects', label: 'Projects' },
  { value: 'services', label: 'Services' },
  { value: 'contact', label: 'Contact' },
  { value: 'faq', label: 'FAQ' },
]

/**
 * New KB Entry form — Client Component.
 * Client-side validation mirrors server-side rules:
 *   - title must not be empty/whitespace
 *   - content must be ≥ 20 characters
 */
export default function NewKBEntryForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string
    content?: string
  }>({})

  function validate(title: string, content: string): boolean {
    const errors: { title?: string; content?: string } = {}
    if (!title.trim()) {
      errors.title = 'Title is required.'
    }
    if (content.trim().length < 20) {
      errors.content = 'Content must be at least 20 characters.'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const content = (form.elements.namedItem('content') as HTMLTextAreaElement)
      .value
    const category = (form.elements.namedItem('category') as HTMLSelectElement)
      .value as KBCategory
    const isPublished = (
      form.elements.namedItem('is_published') as HTMLInputElement
    ).checked

    if (!validate(title, content)) return

    startTransition(async () => {
      const result = await createKBEntry({
        title,
        content,
        category,
        is_published: isPublished,
      })

      if (result.success && result.data) {
        router.push(`/admin/knowledge-base/${result.data.id}`)
        router.refresh()
      } else {
        setError(result.error ?? 'Failed to create entry.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {error && (
        <p
          role="alert"
          aria-live="assertive"
          className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
        >
          {error}
        </p>
      )}

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="title"
          className="text-sm font-bold"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          disabled={isPending}
          aria-describedby={fieldErrors.title ? 'title-error' : undefined}
          aria-invalid={!!fieldErrors.title}
          className="border border-input bg-background px-4 py-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
        {fieldErrors.title && (
          <p id="title-error" role="alert" className="text-xs font-semibold text-destructive">
            {fieldErrors.title}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="content"
          className="text-sm font-bold"
        >
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={8}
          required
          disabled={isPending}
          aria-describedby={
            fieldErrors.content ? 'content-error' : 'content-hint'
          }
          aria-invalid={!!fieldErrors.content}
          className="border border-input bg-background px-4 py-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
        {fieldErrors.content ? (
          <p id="content-error" role="alert" className="text-xs font-semibold text-destructive">
            {fieldErrors.content}
          </p>
        ) : (
          <p id="content-hint" className="text-xs text-muted-foreground">
            Minimum 20 characters.
          </p>
        )}
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="category"
          className="text-sm font-bold"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          disabled={isPending}
          defaultValue="about"
          className="border border-input bg-background px-4 py-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        >
          {CATEGORIES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Published */}
      <label className="flex cursor-pointer items-center gap-3">
        <input
          name="is_published"
          type="checkbox"
          disabled={isPending}
          className="size-4 cursor-pointer accent-accent disabled:cursor-not-allowed"
        />
        <span className="text-sm font-bold">Publish immediately</span>
      </label>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="button-primary disabled:opacity-50"
        >
          {isPending ? 'Creating…' : 'Create Entry'}
        </button>
        <a
          href="/admin/knowledge-base"
          className="text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}

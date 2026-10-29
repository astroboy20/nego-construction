'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  updateKBEntry,
  deleteKBEntry,
  toggleKBPublished,
} from '@/app/(admin)/admin/actions'
import type { KBCategory, KBEntry } from '@/lib/types'

const CATEGORIES: { value: KBCategory; label: string }[] = [
  { value: 'about', label: 'About' },
  { value: 'projects', label: 'Projects' },
  { value: 'services', label: 'Services' },
  { value: 'contact', label: 'Contact' },
  { value: 'faq', label: 'FAQ' },
]

interface EditKBEntryFormProps {
  entry: KBEntry
}

/**
 * Edit KB Entry form — Client Component.
 * Pre-populated from the server-fetched entry. Handles:
 *   - Save (updateKBEntry)
 *   - Delete (deleteKBEntry) with confirmation
 *   - Publish/unpublish toggle (toggleKBPublished)
 *
 * Client-side validation mirrors server-side rules:
 *   - title must not be empty/whitespace
 *   - content must be ≥ 20 characters
 */
export default function EditKBEntryForm({ entry }: EditKBEntryFormProps) {
  const router = useRouter()
  const [isSaving, startSaveTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [isToggling, startToggleTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string
    content?: string
  }>({})
  const [isPublished, setIsPublished] = useState(entry.is_published)

  const isPending = isSaving || isDeleting || isToggling

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
    setSuccessMessage(null)

    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const content = (form.elements.namedItem('content') as HTMLTextAreaElement)
      .value
    const category = (form.elements.namedItem('category') as HTMLSelectElement)
      .value as KBCategory

    if (!validate(title, content)) return

    startSaveTransition(async () => {
      const result = await updateKBEntry(entry.id, {
        title,
        content,
        category,
        is_published: isPublished,
      })

      if (result.success) {
        setSuccessMessage('Entry saved successfully.')
        router.refresh()
      } else {
        setError(result.error ?? 'Failed to save entry.')
      }
    })
  }

  function handleDelete() {
    if (
      !window.confirm(
        'Are you sure you want to delete this entry? This action cannot be undone.'
      )
    ) {
      return
    }

    setError(null)
    startDeleteTransition(async () => {
      const result = await deleteKBEntry(entry.id)
      if (!result.success) {
        setError(result.error ?? 'Failed to delete entry.')
      }
      // On success, deleteKBEntry redirects to /admin/knowledge-base server-side
    })
  }

  function handleTogglePublish() {
    setError(null)
    setSuccessMessage(null)
    const newValue = !isPublished

    startToggleTransition(async () => {
      const result = await toggleKBPublished(entry.id, newValue)
      if (result.success) {
        setIsPublished(newValue)
        setSuccessMessage(
          newValue ? 'Entry published.' : 'Entry unpublished (draft).'
        )
        router.refresh()
      } else {
        setError(result.error ?? 'Failed to update publish status.')
      }
    })
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Status messages */}
      {error && (
        <p
          role="alert"
          aria-live="assertive"
          className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
        >
          {error}
        </p>
      )}
      {successMessage && (
        <p
          role="status"
          aria-live="polite"
          className="border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-400"
        >
          {successMessage}
        </p>
      )}

      {/* Publish toggle (outside the form so it can be submitted independently) */}
      <div className="flex items-center justify-between gap-4 border border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <span
            className={
              isPublished
                ? 'inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground'
            }
          >
            {isPublished ? 'Published' : 'Draft'}
          </span>
          <span className="text-sm text-muted-foreground">
            {isPublished
              ? 'Visible to the chatbot'
              : 'Hidden from the chatbot'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleTogglePublish}
          disabled={isPending}
          className="text-sm font-semibold text-foreground underline underline-offset-2 hover:text-accent disabled:opacity-50"
        >
          {isToggling
            ? 'Updating…'
            : isPublished
            ? 'Unpublish'
            : 'Publish'}
        </button>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-bold">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={entry.title}
            disabled={isPending}
            aria-describedby={fieldErrors.title ? 'title-error' : undefined}
            aria-invalid={!!fieldErrors.title}
            className="border border-input bg-background px-4 py-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          {fieldErrors.title && (
            <p
              id="title-error"
              role="alert"
              className="text-xs font-semibold text-destructive"
            >
              {fieldErrors.title}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <label htmlFor="content" className="text-sm font-bold">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={10}
            required
            defaultValue={entry.content}
            disabled={isPending}
            aria-describedby={
              fieldErrors.content ? 'content-error' : 'content-hint'
            }
            aria-invalid={!!fieldErrors.content}
            className="border border-input bg-background px-4 py-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          {fieldErrors.content ? (
            <p
              id="content-error"
              role="alert"
              className="text-xs font-semibold text-destructive"
            >
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
          <label htmlFor="category" className="text-sm font-bold">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={entry.category}
            disabled={isPending}
            className="border border-input bg-background px-4 py-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            {CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="button-primary disabled:opacity-50"
          >
            {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
          <a
            href="/admin/knowledge-base"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            Cancel
          </a>
        </div>
      </form>

      {/* Danger zone */}
      <div className="border border-destructive/30 bg-destructive/5 px-6 py-5">
        <h2 className="mb-1 text-sm font-bold text-destructive">Danger Zone</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Deleting an entry is permanent and cannot be undone.
        </p>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="border border-destructive/50 bg-destructive/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
        >
          {isDeleting ? 'Deleting…' : 'Delete Entry'}
        </button>
      </div>
    </div>
  )
}

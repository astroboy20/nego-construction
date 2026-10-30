'use client'

import { useState, useTransition } from 'react'
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  User,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { ContactEnquiry, ChatSession, ChatMessage } from '@/lib/types'
import { markEnquiryRead } from '@/app/(admin)/admin/actions'

type Tab = 'contacts' | 'chats'

interface Props {
  enquiries: ContactEnquiry[]
  chatSessions: ChatSession[]
  initialTab: Tab
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ContactEnquiryRow({ enquiry }: { enquiry: ContactEnquiry }) {
  const [isRead, setIsRead] = useState(enquiry.is_read)
  const [expanded, setExpanded] = useState(false)
  const [, startTransition] = useTransition()

  function handleMarkRead() {
    if (isRead) return
    setIsRead(true)
    startTransition(() => markEnquiryRead(enquiry.id))
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-all ${
        isRead ? 'border-neutral-100 bg-white' : 'border-blue-100 bg-blue-50/20'
      }`}
    >
      <button
        type="button"
        className="flex w-full items-start gap-4 px-5 py-4 text-left"
        onClick={() => {
          setExpanded((v) => !v)
          if (!isRead) handleMarkRead()
        }}
        aria-expanded={expanded}
      >
        {/* Unread indicator */}
        <div className="mt-1 flex-shrink-0">
          {isRead ? (
            <div className="h-2 w-2 rounded-full bg-neutral-200" />
          ) : (
            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-sm shadow-blue-300" />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-semibold text-neutral-900">
              {enquiry.first_name} {enquiry.last_name ?? ''}
            </span>
            {!isRead && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                New
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {enquiry.email}
            </span>
            {enquiry.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {enquiry.phone}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(enquiry.submitted_at)}
            </span>
          </div>
          {!expanded && (
            <p className="mt-1.5 line-clamp-1 text-sm text-neutral-500">
              {enquiry.message}
            </p>
          )}
        </div>

        <div className="flex-shrink-0 text-neutral-400">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-neutral-100 px-5 py-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
            {enquiry.message}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <a
              href={`mailto:${enquiry.email}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-700"
            >
              <Mail className="h-3.5 w-3.5" />
              Reply by email
            </a>
            {!isRead && (
              <button
                type="button"
                onClick={handleMarkRead}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-600"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Mark as read
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ChatSessionRow({ session }: { session: ChatSession }) {
  const [expanded, setExpanded] = useState(false)
  const messages: ChatMessage[] = Array.isArray(session.messages)
    ? session.messages
    : []

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white">
      <button
        type="button"
        className="flex w-full items-start gap-4 px-5 py-4 text-left"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className="mt-0.5 flex-shrink-0 rounded-xl bg-purple-100 p-2">
          <MessageSquare className="h-4 w-4 text-purple-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">
              Chat Session
            </span>
            <span className="font-mono text-xs text-neutral-400">
              #{session.session_id.slice(0, 8)}
            </span>
            <span className="ml-auto rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
              {session.message_count} message{session.message_count !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Started: {formatDate(session.started_at)}
            </span>
            {session.ip_address && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {session.ip_address}
              </span>
            )}
          </div>
          {!expanded && messages.length > 0 && (
            <p className="mt-1.5 line-clamp-1 text-sm text-neutral-500">
              {messages[0].content}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-neutral-400">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-neutral-100 px-5 py-4">
          {messages.length === 0 ? (
            <p className="text-sm text-neutral-400">No messages recorded.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#033a21] text-white'
                        : 'border border-neutral-200 bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
                      {msg.role === 'user' ? 'Visitor' : 'AI Assistant'}
                    </p>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function EnquiriesClient({
  enquiries,
  chatSessions,
  initialTab,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  const unreadCount = enquiries.filter((e) => !e.is_read).length

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#033a21]">
          Enquiries
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight text-neutral-900">
          Enquiries &amp; Conversations
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Contact form submissions and AI chatbot sessions.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-2xl border border-neutral-200 bg-neutral-50 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('contacts')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all ${
            activeTab === 'contacts'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Mail className="h-3.5 w-3.5" aria-hidden />
          Contact Enquiries
          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('chats')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all ${
            activeTab === 'chats'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" aria-hidden />
          Chat Sessions
          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700">
            {chatSessions.length}
          </span>
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'contacts' && (
        <div className="space-y-3">
          {enquiries.length === 0 ? (
            <div className="rounded-2xl border border-neutral-100 bg-white px-8 py-16 text-center">
              <Mail className="mx-auto mb-3 h-8 w-8 text-neutral-200" aria-hidden />
              <p className="text-sm font-medium text-neutral-400">No contact enquiries yet.</p>
            </div>
          ) : (
            enquiries.map((e) => <ContactEnquiryRow key={e.id} enquiry={e} />)
          )}
        </div>
      )}

      {activeTab === 'chats' && (
        <div className="space-y-3">
          {chatSessions.length === 0 ? (
            <div className="rounded-2xl border border-neutral-100 bg-white px-8 py-16 text-center">
              <MessageSquare className="mx-auto mb-3 h-8 w-8 text-neutral-200" aria-hidden />
              <p className="text-sm font-medium text-neutral-400">No chat sessions recorded yet.</p>
              <p className="mt-1 text-xs text-neutral-400">
                Chat conversations are saved automatically when users interact with the AI assistant.
              </p>
            </div>
          ) : (
            chatSessions.map((s) => <ChatSessionRow key={s.id} session={s} />)
          )}
        </div>
      )}
    </div>
  )
}

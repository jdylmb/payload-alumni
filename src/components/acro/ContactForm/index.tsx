'use client'

import React, { useState } from 'react'

const inputClass =
  'w-full border border-[#D0D5D2] bg-surface-white px-3 py-2.5 text-sm text-brand-text outline-none focus:border-green-dark'
const labelClass = 'text-xs font-semibold uppercase tracking-wide text-brand-text-secondary'

export const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setError(null)

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    try {
      const res = await fetch('/api/acro/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Submission failed.')
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Submission failed.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 p-8 text-center">
        <h3 className="font-serif text-xl font-bold text-green-dark">Message sent</h3>
        <p className="text-sm text-brand-text-secondary">
          Thank you for reaching out. Our team will get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Full Name *</label>
        <input name="name" required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Email Address *</label>
        <input name="email" type="email" required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Subject</label>
        <input name="subject" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Message *</label>
        <textarea name="message" required rows={5} className={inputClass} />
      </div>

      {status === 'error' && error && (
        <p className="bg-error/20 px-4 py-3 text-sm text-error">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center bg-green-dark px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}

'use client'

import React, { useState } from 'react'

const inputClass =
  'w-full border border-[#D0D5D2] bg-surface-white px-3 py-2.5 text-sm text-brand-text outline-none focus:border-green-dark'
const labelClass = 'text-xs font-semibold uppercase tracking-wide text-brand-text-secondary'

const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({
  label,
  children,
  className,
}) => (
  <div className={`flex flex-col gap-1.5 ${className || ''}`}>
    <label className={labelClass}>{label}</label>
    {children}
  </div>
)

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="flex flex-col gap-5 bg-surface-white p-8 shadow-sm">
    <h3 className="font-serif text-xl font-bold text-brand-text">{title}</h3>
    {children}
  </div>
)

const DEGREE_LEVELS = [
  { value: 'HS', label: 'High School' },
  { value: 'BS', label: 'Bachelor (BS)' },
  { value: 'MS', label: 'Master (MS)' },
  { value: 'PhD', label: 'Doctorate (PhD)' },
]

const CONSENT_ITEMS = [
  { name: 'consent_databaseEncoding', label: 'Alumni Database encoding' },
  { name: 'consent_alumniId', label: 'VSUAAI Alumni ID printing' },
  { name: 'consent_homecoming', label: 'VSU Alumni Homecoming invitations' },
  {
    name: 'consent_publication',
    label: 'Publication in the printed / online alumni directory',
  },
  { name: 'consent_forwarding', label: 'Forwarding of data to relevant offices' },
]

export const MembershipForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    // Assemble the degrees array from per-level inputs into a single JSON field.
    const degrees = DEGREE_LEVELS.map((lvl) => ({
      level: lvl.value,
      course: (formData.get(`degree_${lvl.value}_course`) as string)?.trim() || '',
      yearGraduated: (formData.get(`degree_${lvl.value}_year`) as string)?.trim() || '',
    })).filter((d) => d.course || d.yearGraduated)

    DEGREE_LEVELS.forEach((lvl) => {
      formData.delete(`degree_${lvl.value}_course`)
      formData.delete(`degree_${lvl.value}_year`)
    })
    formData.set('degrees', JSON.stringify(degrees))

    try {
      const res = await fetch('/api/acro/registration', { method: 'POST', body: formData })
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
      <div className="flex flex-col items-center gap-3 bg-surface-white p-12 text-center shadow-sm">
        <h3 className="font-serif text-2xl font-bold text-green-dark">Registration received</h3>
        <p className="max-w-md text-sm text-brand-text-secondary">
          Thank you for registering with ACRO. Our team will review your submission and get in
          touch with you shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <SectionCard title="Personal Information">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Full Name *">
            <input name="fullName" required className={inputClass} />
          </Field>
          <Field label="Email Address *">
            <input name="email" type="email" required className={inputClass} />
          </Field>
          <Field label="Phone Number">
            <input name="phone" className={inputClass} />
          </Field>
          <Field label="Date of Birth">
            <input name="dateOfBirth" type="date" className={inputClass} />
          </Field>
          <Field label="Sex">
            <select name="sex" className={inputClass} defaultValue="">
              <option value="">Select…</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unspecified">Prefer not to say</option>
            </select>
          </Field>
          <Field label="Civil Status">
            <select name="civilStatus" className={inputClass} defaultValue="">
              <option value="">Select…</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="widowed">Widowed</option>
              <option value="separated">Separated</option>
            </select>
          </Field>
          <Field label="Nationality">
            <input name="nationality" className={inputClass} />
          </Field>
          <Field label="Current Address" className="md:col-span-2">
            <textarea name="currentAddress" rows={2} className={inputClass} />
          </Field>
          <Field label="Permanent Address" className="md:col-span-2">
            <textarea name="permanentAddress" rows={2} className={inputClass} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Degrees Obtained at VSU">
        <p className="text-sm text-brand-text-secondary">
          Fill in the degrees you obtained at Visayas State University. Leave blank if not
          applicable.
        </p>
        <div className="flex flex-col gap-4">
          {DEGREE_LEVELS.map((lvl) => (
            <div key={lvl.value} className="grid grid-cols-1 gap-3 md:grid-cols-[160px_1fr_160px]">
              <div className="flex items-center text-sm font-semibold text-brand-text">
                {lvl.label}
              </div>
              <input
                name={`degree_${lvl.value}_course`}
                placeholder="Course / Program"
                className={inputClass}
              />
              <input
                name={`degree_${lvl.value}_year`}
                placeholder="Year graduated"
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Payment">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Payment Method">
            <select name="paymentMethod" className={inputClass} defaultValue="">
              <option value="">Select…</option>
              <option value="gcash">GCash</option>
              <option value="bank">Bank Transfer</option>
              <option value="counter">Over the Counter</option>
            </select>
          </Field>
          <Field label="Reference Number">
            <input name="referenceNumber" className={inputClass} />
          </Field>
          <Field label="Amount Paid (PHP)">
            <input name="amount" type="number" min="0" step="0.01" className={inputClass} />
          </Field>
          <Field label="Proof of Payment">
            <input
              name="proofOfPayment"
              type="file"
              accept="image/*,application/pdf"
              className="text-sm text-brand-text-secondary file:mr-3 file:border-0 file:bg-green-dark file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Data Privacy Consent">
        <p className="text-sm text-brand-text-secondary">
          I give my consent for ACRO to use my data for the following purposes:
        </p>
        <div className="flex flex-col gap-3">
          {CONSENT_ITEMS.map((item) => (
            <label key={item.name} className="flex items-start gap-3 text-sm text-brand-text">
              <input
                name={item.name}
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-green-dark"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </SectionCard>

      {status === 'error' && error && (
        <p className="bg-error/20 px-4 py-3 text-sm text-error">{error}</p>
      )}

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center bg-green-dark px-16 py-4 text-sm font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === 'submitting' ? 'Submitting…' : 'Submit Registration'}
        </button>
      </div>
    </form>
  )
}

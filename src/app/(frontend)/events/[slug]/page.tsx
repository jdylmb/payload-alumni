import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'
import React, { cache } from 'react'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { formatDate } from '@/components/acro/utils'

type Args = { params: Promise<{ slug: string }> }

const queryEventBySlug = cache(async (slug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'events',
    draft,
    overrideAccess: draft,
    depth: 2,
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})

const formatDateRange = (start: string, end?: string | null): string => {
  if (!end) return formatDate(start)
  const startStr = formatDate(start)
  const endStr = formatDate(end)
  return startStr === endStr ? startStr : `${startStr} – ${endStr}`
}

export default async function EventDetailPage({ params }: Args) {
  const { slug } = await params
  const event = await queryEventBySlug(slug)

  if (!event) notFound()

  return (
    <main>
      <section className="bg-green-dark">
        <div className="mx-auto flex w-full max-w-[820px] flex-col gap-5 px-6 py-16 md:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold transition-opacity hover:opacity-80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
          <h1 className="font-serif text-3xl font-bold leading-tight text-white md:text-4xl">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#B8D4C0]">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-gold" />
              <span>{formatDateRange(event.startDate, event.endDate)}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-gold" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <article className="bg-surface-white">
        <div className="mx-auto flex w-full max-w-[820px] flex-col gap-8 px-6 py-12 md:px-8 md:py-16">
          {event.image && typeof event.image === 'object' && (
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-green-light">
              <Media
                resource={event.image}
                fill
                imgClassName="object-cover"
                pictureClassName="absolute inset-0 h-full w-full"
              />
            </div>
          )}

          {event.description ? (
            <RichText data={event.description} enableGutter={false} />
          ) : (
            <p className="text-brand-text-secondary">No additional details for this event yet.</p>
          )}
        </div>
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const event = await queryEventBySlug(slug)

  if (!event) return { title: 'Events — ACRO' }

  return {
    title: `${event.title} — ACRO`,
    description: event.location
      ? `${formatDate(event.startDate)} · ${event.location}`
      : formatDate(event.startDate),
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'events',
    draft: false,
    limit: 100,
    pagination: false,
    select: { slug: true },
  })

  return (result.docs || []).map(({ slug }) => ({ slug }))
}

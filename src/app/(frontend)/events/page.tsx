import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { CalendarDays, MapPin } from 'lucide-react'
import React from 'react'

import type { Event } from '@/payload-types'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { PageHeaderBand } from '@/components/acro/PageHeaderBand'
import { EventCard } from '@/components/acro/EventCard'
import { EventsTimeline } from '@/components/acro/EventsTimeline'
import { CtaBand } from '@/components/acro/CtaBand'
import { formatDate } from '@/components/acro/utils'

export default async function EventsPage() {
  const page = await getCachedGlobal('eventsPage', 1)()
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const now = new Date().toISOString()

  const featuredRes = await payload.find({
    collection: 'events',
    draft,
    overrideAccess: draft,
    depth: 1,
    limit: 1,
    pagination: false,
    where: { featured: { equals: true } },
  })
  const featured = featuredRes.docs?.[0]

  const upcomingRes = await payload.find({
    collection: 'events',
    draft,
    overrideAccess: draft,
    depth: 1,
    limit: 3,
    sort: 'startDate',
    where: {
      and: [
        { startDate: { greater_than_equal: now } },
        ...(featured ? [{ id: { not_equals: featured.id } }] : []),
      ],
    },
  })
  const upcoming = upcomingRes.docs as Event[]

  const pastRes = await payload.find({
    collection: 'events',
    draft,
    overrideAccess: draft,
    depth: 1,
    limit: 6,
    sort: '-startDate',
    where: { startDate: { less_than: now } },
  })
  const past = pastRes.docs as Event[]

  return (
    <main>
      <PageHeaderBand
        caption={page?.pageHeader?.caption}
        title={page?.pageHeader?.title || 'Events'}
        description={page?.pageHeader?.description}
      />

      {featured && (
        <section className="bg-surface-white">
          <Link
            href={`/events/${featured.slug}`}
            className="group mx-auto grid w-full max-w-[1440px] grid-cols-1 md:grid-cols-2"
          >
            <div className="relative min-h-[320px] w-full overflow-hidden bg-green-light md:min-h-[480px]">
              {featured.image && typeof featured.image === 'object' && (
                <Media
                  resource={featured.image}
                  fill
                  imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
                  pictureClassName="absolute inset-0 h-full w-full"
                />
              )}
            </div>
            <div className="flex flex-col justify-center gap-4 bg-green-dark p-10 text-white md:p-14">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gold">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(featured.startDate)}</span>
              </div>
              <h2 className="font-serif text-3xl font-bold">{featured.title}</h2>
              {featured.location && (
                <div className="flex items-center gap-1.5 text-sm text-[#B8D4C0]">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{featured.location}</span>
                </div>
              )}
              {featured.description ? (
                <div className="text-[15px] leading-relaxed text-[#D6E4DA]">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <RichText data={featured.description as any} enableGutter={false} enableProse={false} />
                </div>
              ) : null}
            </div>
          </Link>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="bg-surface">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 py-20 md:px-20">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                Mark Your Calendar
              </span>
              <h2 className="font-serif text-3xl font-bold text-brand-text md:text-4xl">
                Upcoming Events
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="bg-surface-white">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 py-20 md:px-20">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                Looking Back
              </span>
              <h2 className="font-serif text-3xl font-bold text-brand-text md:text-4xl">
                Past Events
              </h2>
            </div>
            <EventsTimeline events={past} />
          </div>
        </section>
      )}

      <CtaBand data={page?.ctaBand} />
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Events — ACRO',
  description:
    'Join us for university anniversaries, alumni homecomings, and community gatherings.',
}

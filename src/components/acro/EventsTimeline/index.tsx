import React from 'react'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

import type { Event } from '@/payload-types'

import { formatDate } from '../utils'

export const EventsTimeline: React.FC<{ events: Event[] }> = ({ events }) => {
  if (!events?.length) return null

  return (
    <div className="flex flex-col gap-8">
      {events.map((event) => (
        <Link
          key={event.id}
          href={`/events/${event.slug}`}
          className="group flex flex-col gap-3 md:flex-row md:gap-8"
        >
          <div className="flex shrink-0 flex-col md:w-48">
            <span className="text-sm font-bold text-gold">{formatDate(event.startDate)}</span>
          </div>
          <div className="relative flex flex-col gap-1.5 border-l-2 border-green-mid pl-6">
            <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-green-dark" />
            <h3 className="font-serif text-lg font-bold text-brand-text transition-colors group-hover:text-green-dark">
              {event.title}
            </h3>
            {event.location && (
              <div className="flex items-center gap-1.5 text-sm text-brand-text-secondary">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

import React from 'react'
import { CalendarDays, MapPin } from 'lucide-react'

import type { Event } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatDate } from '../utils'

export const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <article className="flex flex-col overflow-hidden bg-surface-white shadow-sm">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-green-light">
        {event.image && typeof event.image === 'object' && (
          <Media
            resource={event.image}
            fill
            imgClassName="object-cover"
            pictureClassName="absolute inset-0 h-full w-full"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold">
          <CalendarDays className="h-4 w-4" />
          <span>{formatDate(event.startDate)}</span>
        </div>
        <h3 className="font-serif text-lg font-bold leading-snug text-brand-text">{event.title}</h3>
        {event.location && (
          <div className="flex items-center gap-1.5 text-sm text-brand-text-secondary">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{event.location}</span>
          </div>
        )}
      </div>
    </article>
  )
}

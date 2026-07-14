import React from 'react'

import type { Alumnus } from '@/payload-types'

import { Media } from '@/components/Media'

export const AlumniCard: React.FC<{ item: Alumnus }> = ({ item }) => {
  return (
    <article className="flex flex-col overflow-hidden bg-surface shadow-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-green-light">
        {item.photo && typeof item.photo === 'object' && (
          <Media
            resource={item.photo}
            fill
            imgClassName="object-cover"
            pictureClassName="absolute inset-0 h-full w-full"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="font-serif text-lg font-bold leading-snug text-brand-text">{item.name}</h3>
        {item.degree && <p className="text-sm text-brand-text-secondary">{item.degree}</p>}
        {item.currentRole && (
          <p className="text-sm font-medium text-green-dark">{item.currentRole}</p>
        )}
        {item.batch && (
          <p className="mt-1 text-xs uppercase tracking-wide text-gold">{item.batch}</p>
        )}
      </div>
    </article>
  )
}

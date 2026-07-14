import React from 'react'

import type { News } from '@/payload-types'

import { Media } from '@/components/Media'
import { categoryLabel, formatDate } from '../utils'

export const NewsCard: React.FC<{ item: News }> = ({ item }) => {
  return (
    <article className="flex flex-col overflow-hidden bg-surface-white shadow-sm">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-green-light">
        {item.coverImage && typeof item.coverImage === 'object' && (
          <Media
            resource={item.coverImage}
            fill
            imgClassName="object-cover"
            pictureClassName="absolute inset-0 h-full w-full"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide">
          <span className="text-gold">{categoryLabel(item.category)}</span>
          {item.publishedAt && (
            <span className="text-brand-text-secondary">{formatDate(item.publishedAt)}</span>
          )}
        </div>
        <h3 className="font-serif text-lg font-bold leading-snug text-brand-text">{item.title}</h3>
        {item.excerpt && (
          <p className="line-clamp-3 text-sm leading-relaxed text-brand-text-secondary">
            {item.excerpt}
          </p>
        )}
      </div>
    </article>
  )
}

export const FeaturedNewsCard: React.FC<{ item: News }> = ({ item }) => {
  return (
    <article className="grid grid-cols-1 overflow-hidden bg-surface-white shadow-sm md:grid-cols-2">
      <div className="relative min-h-[260px] w-full overflow-hidden bg-green-light md:min-h-[340px]">
        {item.coverImage && typeof item.coverImage === 'object' && (
          <Media
            resource={item.coverImage}
            fill
            imgClassName="object-cover"
            pictureClassName="absolute inset-0 h-full w-full"
          />
        )}
      </div>
      <div className="flex flex-col justify-center gap-3 p-8 md:p-10">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide">
          <span className="text-gold">{categoryLabel(item.category)}</span>
          {item.publishedAt && (
            <span className="text-brand-text-secondary">{formatDate(item.publishedAt)}</span>
          )}
        </div>
        <h3 className="font-serif text-2xl font-bold leading-snug text-brand-text md:text-3xl">
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="text-[15px] leading-relaxed text-brand-text-secondary">{item.excerpt}</p>
        )}
      </div>
    </article>
  )
}

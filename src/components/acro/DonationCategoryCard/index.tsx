import React from 'react'

import type { DonorsPage } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Category = NonNullable<DonorsPage['categories']>[number]

const TOP_STYLES = [
  'bg-green-dark text-white',
  'bg-green-mid text-white',
  'bg-green-dark text-white',
  'bg-gold text-brand-text',
]

export const DonationCategoryCard: React.FC<{ category: Category; index: number }> = ({
  category,
  index,
}) => {
  return (
    <article className="flex flex-col overflow-hidden bg-surface-white shadow-sm">
      <div
        className={cn(
          'flex flex-col items-center gap-2 px-6 py-8 text-center',
          TOP_STYLES[index % TOP_STYLES.length],
        )}
      >
        <h3 className="font-serif text-xl font-bold">{category.heading}</h3>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        {category.body && (
          <p className="text-sm leading-relaxed text-brand-text-secondary">{category.body}</p>
        )}
        {category.amounts && (
          <p className="mt-auto text-sm font-semibold text-green-dark">{category.amounts}</p>
        )}
      </div>
    </article>
  )
}

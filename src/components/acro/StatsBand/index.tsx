import React from 'react'

import type { AboutPage } from '@/payload-types'

type Stat = NonNullable<AboutPage['stats']>[number]

export const StatsBand: React.FC<{ stats: Stat[] }> = ({ stats }) => {
  if (!stats?.length) return null

  return (
    <section className="bg-green-dark">
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-around gap-8 px-6 py-12 md:px-20">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center gap-1 text-center">
            <span className="font-serif text-3xl font-bold text-white">{stat.value}</span>
            <span className="text-xs font-medium uppercase tracking-wide text-[#B8D4C0]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

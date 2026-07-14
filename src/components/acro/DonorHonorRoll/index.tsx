import React from 'react'

import type { Donor } from '@/payload-types'
import { cn } from '@/utilities/ui'

const TIERS: { key: Donor['tier']; label: string; accent: string }[] = [
  { key: 'gold', label: 'Gold Circle', accent: 'text-gold border-gold' },
  { key: 'silver', label: 'Silver Circle', accent: 'text-brand-text-secondary border-[#B0B0B0]' },
  { key: 'bronze', label: 'Bronze Circle', accent: 'text-[#A9773B] border-[#A9773B]' },
]

export const DonorHonorRoll: React.FC<{ donors: Donor[] }> = ({ donors }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {TIERS.map((tier) => {
        const list = donors
          .filter((d) => d.tier === tier.key)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

        return (
          <div key={tier.key} className="flex flex-col gap-4 bg-surface-white p-7 shadow-sm">
            <h3
              className={cn(
                'border-b-2 pb-3 font-serif text-lg font-bold',
                tier.accent,
              )}
            >
              {tier.label}
            </h3>
            {list.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {list.map((donor) => (
                  <li key={donor.id} className="text-sm text-brand-text">
                    {donor.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-brand-text-secondary">Be the first to give.</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

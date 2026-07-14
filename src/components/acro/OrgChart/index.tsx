import React from 'react'

import type { TeamMember } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const TIER_ORDER = ['head', 'officer', 'staff', 'support'] as const

type Tier = (typeof TIER_ORDER)[number]

const CARD_STYLES: Record<Tier, string> = {
  head: 'bg-green-dark text-white w-[280px]',
  officer: 'bg-green-light text-brand-text w-[240px]',
  staff: 'bg-green-light text-brand-text w-[220px]',
  support: 'bg-surface text-brand-text w-[190px]',
}

const NAME_STYLES: Record<Tier, string> = {
  head: 'text-white',
  officer: 'text-brand-text',
  staff: 'text-brand-text',
  support: 'text-brand-text',
}

const OrgCard: React.FC<{ member: TeamMember; level: Tier }> = ({ member, level }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 p-5 text-center shadow-sm',
        CARD_STYLES[level],
      )}
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-full bg-black/10">
        {member.photo && typeof member.photo === 'object' && (
          <Media
            resource={member.photo}
            fill
            imgClassName="object-cover"
            pictureClassName="absolute inset-0 h-full w-full"
          />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className={cn('font-serif text-base font-bold leading-tight', NAME_STYLES[level])}>
          {member.name}
        </p>
        <p
          className={cn(
            'text-xs font-medium uppercase tracking-wide',
            level === 'head' ? 'text-gold' : 'text-green-dark',
          )}
        >
          {member.position}
        </p>
      </div>
    </div>
  )
}

export const OrgChart: React.FC<{ members: TeamMember[] }> = ({ members }) => {
  const tiers = TIER_ORDER.map((level) => ({
    level,
    items: members
      .filter((m) => m.level === level)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  })).filter((t) => t.items.length > 0)

  if (tiers.length === 0) return null

  return (
    <div className="flex flex-col items-center">
      {tiers.map((tier, i) => (
        <React.Fragment key={tier.level}>
          {i > 0 && <div className="h-10 w-0.5 bg-green-mid" />}
          <div className="flex flex-wrap justify-center gap-6">
            {tier.items.map((member) => (
              <OrgCard key={member.id} member={member} level={tier.level as Tier} />
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

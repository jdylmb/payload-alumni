import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { Media as MediaType, TeamMember } from '@/payload-types'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { PageHeaderBand } from '@/components/acro/PageHeaderBand'
import { StatsBand } from '@/components/acro/StatsBand'
import { OrgChart } from '@/components/acro/OrgChart'

type ContentGroup = {
  heading?: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
  image?: number | MediaType | null
}

const ContentRow: React.FC<{ group?: ContentGroup | null; reverse?: boolean }> = ({
  group,
  reverse,
}) => {
  if (!group) return null
  const image = group.image
  return (
    <div
      className={cnRow(reverse)}
    >
      <div className="flex flex-1 flex-col justify-center gap-4">
        {group.heading && (
          <h2 className="font-serif text-3xl font-bold text-brand-text">{group.heading}</h2>
        )}
        {group.body ? (
          <div className="text-[15px] leading-relaxed text-brand-text-secondary">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <RichText data={group.body as any} enableGutter={false} enableProse={false} />
          </div>
        ) : null}
      </div>
      {image && typeof image === 'object' && (
        <div className="relative h-[300px] w-full flex-1 overflow-hidden bg-green-light">
          <Media
            resource={image}
            fill
            imgClassName="object-cover"
            pictureClassName="absolute inset-0 h-full w-full"
          />
        </div>
      )}
    </div>
  )
}

const cnRow = (reverse?: boolean) =>
  `flex flex-col gap-12 md:items-stretch ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`

export default async function AboutPage() {
  const about = await getCachedGlobal('aboutPage', 2)()
  const payload = await getPayload({ config: configPromise })

  const membersRes = await payload.find({
    collection: 'team-members',
    depth: 1,
    limit: 100,
    pagination: false,
    sort: 'order',
    where: { org: { equals: 'acro' } },
  })
  const members = membersRes.docs as TeamMember[]

  return (
    <main>
      <PageHeaderBand
        caption={about?.pageHeader?.caption}
        title={about?.pageHeader?.title || 'About ACRO'}
        description={about?.pageHeader?.description}
      />

      <section className="bg-surface">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-6 py-20 md:px-20">
          <ContentRow group={about?.mission as ContentGroup} />
          <ContentRow group={about?.vision as ContentGroup} reverse />
        </div>
      </section>

      <StatsBand stats={about?.stats || []} />

      {members.length > 0 && (
        <section className="bg-surface-white">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-12 px-6 py-20 md:px-20">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                Our Team
              </span>
              <h2 className="font-serif text-3xl font-bold text-brand-text md:text-4xl">
                Organizational Structure
              </h2>
              <p className="max-w-xl text-[15px] text-brand-text-secondary">
                Meet the dedicated team behind the Alumni &amp; Community Relations Office.
              </p>
            </div>
            <OrgChart members={members} />
          </div>
        </section>
      )}
    </main>
  )
}

export const metadata: Metadata = {
  title: 'About ACRO — Alumni & Community Relations Office',
  description:
    'Learn about the Alumni & Community Relations Office of Visayas State University and our team.',
}

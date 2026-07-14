import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { TeamMember } from '@/payload-types'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { PageHeaderBand } from '@/components/acro/PageHeaderBand'
import { OrgChart } from '@/components/acro/OrgChart'

export default async function AssociationPage() {
  const page = await getCachedGlobal('associationPage', 2)()
  const payload = await getPayload({ config: configPromise })

  const membersRes = await payload.find({
    collection: 'team-members',
    depth: 1,
    limit: 100,
    pagination: false,
    sort: 'order',
    where: { org: { equals: 'association' } },
  })
  const members = membersRes.docs as TeamMember[]

  const intro = page?.intro
  const introImage = intro?.image

  return (
    <main>
      <PageHeaderBand
        caption={page?.pageHeader?.caption}
        title={page?.pageHeader?.title || 'Alumni Association'}
        description={page?.pageHeader?.description}
      />

      <section className="bg-surface">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-6 py-20 md:px-20">
          {intro && (intro.heading || intro.body || introImage) && (
            <div className="flex flex-col gap-12 md:flex-row md:items-center">
              <div className="flex flex-1 flex-col gap-4">
                {intro.heading && (
                  <h2 className="font-serif text-3xl font-bold text-brand-text">{intro.heading}</h2>
                )}
                {intro.body ? (
                  <div className="text-[15px] leading-relaxed text-brand-text-secondary">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <RichText data={intro.body as any} enableGutter={false} enableProse={false} />
                  </div>
                ) : null}
              </div>
              {introImage && typeof introImage === 'object' && (
                <div className="relative h-[280px] w-full flex-1 overflow-hidden bg-green-light">
                  <Media
                    resource={introImage}
                    fill
                    imgClassName="object-cover"
                    pictureClassName="absolute inset-0 h-full w-full"
                  />
                </div>
              )}
            </div>
          )}

          {members.length > 0 && (
            <div className="flex flex-col items-center gap-12">
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                  Leadership
                </span>
                <h2 className="font-serif text-3xl font-bold text-brand-text md:text-4xl">
                  {page?.orgChartTitle || 'Organizational Structure'}
                </h2>
              </div>
              <OrgChart members={members} />
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Alumni Association — ACRO',
  description:
    'Explore the organizational structure and leadership of the VSU Alumni Association.',
}

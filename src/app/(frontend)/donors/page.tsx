import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { Donor } from '@/payload-types'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { PageHeaderBand } from '@/components/acro/PageHeaderBand'
import { DonationCategoryCard } from '@/components/acro/DonationCategoryCard'
import { DonorHonorRoll } from '@/components/acro/DonorHonorRoll'
import { CtaBand } from '@/components/acro/CtaBand'

export default async function DonorsPage() {
  const page = await getCachedGlobal('donorsPage', 1)()
  const payload = await getPayload({ config: configPromise })

  const donorsRes = await payload.find({
    collection: 'donors',
    depth: 0,
    limit: 200,
    pagination: false,
    sort: 'order',
  })
  const donors = donorsRes.docs as Donor[]

  const categories = page?.categories || []

  return (
    <main>
      <PageHeaderBand
        caption={page?.pageHeader?.caption}
        title={page?.pageHeader?.title || 'Donors Board'}
        description={page?.pageHeader?.description}
      />

      <section className="bg-surface">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-6 py-20 md:px-20">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="font-serif text-3xl font-bold text-brand-text md:text-4xl">
              {page?.introTitle || 'Your Generosity Makes a Difference'}
            </h2>
            {page?.introBody && (
              <p className="max-w-3xl text-[15px] leading-relaxed text-brand-text-secondary">
                {page.introBody}
              </p>
            )}
          </div>

          {categories.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category, i) => (
                <DonationCategoryCard key={i} category={category} index={i} />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-8 bg-gold-light p-12">
            <div className="flex flex-col items-center gap-3 text-center">
              {page?.honorRollCaption && (
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                  {page.honorRollCaption}
                </span>
              )}
              <h2 className="font-serif text-2xl font-bold text-brand-text md:text-3xl">
                {page?.honorRollTitle || 'Donors Honor Roll'}
              </h2>
              {page?.honorRollDescription && (
                <p className="max-w-xl text-sm text-brand-text-secondary">
                  {page.honorRollDescription}
                </p>
              )}
            </div>
            <DonorHonorRoll donors={donors} />
          </div>
        </div>
      </section>

      <CtaBand data={page?.ctaBand} />
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Donors — ACRO',
  description:
    'Support Visayas State University through donations to scholarships, infrastructure, and research.',
}

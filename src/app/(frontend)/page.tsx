import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React from 'react'

import type { News } from '@/payload-types'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { HeroSlider } from '@/components/acro/HeroSlider'
import { PageHeaderBand } from '@/components/acro/PageHeaderBand'
import { NewsCard, FeaturedNewsCard } from '@/components/acro/NewsCard'
import { AlumniCard } from '@/components/acro/AlumniCard'

export default async function HomePage() {
  const home = await getCachedGlobal('homePage', 2)()
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const featuredNewsRes = await payload.find({
    collection: 'news',
    draft,
    overrideAccess: draft,
    depth: 1,
    limit: 1,
    pagination: false,
    sort: '-publishedAt',
    where: { featured: { equals: true } },
  })
  const featuredNews = featuredNewsRes.docs?.[0]

  const newsRes = await payload.find({
    collection: 'news',
    draft,
    overrideAccess: draft,
    depth: 1,
    limit: 6,
    sort: '-publishedAt',
    where: featuredNews ? { id: { not_equals: featuredNews.id } } : {},
  })
  const news = newsRes.docs as News[]

  const featuredAlumnusRes = await payload.find({
    collection: 'alumni',
    draft,
    overrideAccess: draft,
    depth: 1,
    limit: 1,
    pagination: false,
    where: { featured: { equals: true } },
  })
  const featuredAlumnus = featuredAlumnusRes.docs?.[0]

  const alumniRes = await payload.find({
    collection: 'alumni',
    draft,
    overrideAccess: draft,
    depth: 1,
    limit: 4,
    sort: 'order',
    where: featuredAlumnus ? { id: { not_equals: featuredAlumnus.id } } : {},
  })
  const alumni = alumniRes.docs

  const slides = home?.heroSlides || []

  return (
    <main>
      {slides.length > 0 && <HeroSlider slides={slides} />}

      <PageHeaderBand
        caption={home?.pageHeader?.caption}
        title={home?.pageHeader?.title || 'Announcements'}
        description={home?.pageHeader?.description}
      />

      {/* News & Announcements */}
      <section className="bg-surface">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 py-20 md:px-20">
          <div className="flex flex-col gap-3">
            {home?.newsCaption && (
              <span className="text-[13px] font-semibold uppercase tracking-[0.15em] text-gold">
                {home.newsCaption}
              </span>
            )}
            <h2 className="font-serif text-3xl font-bold text-brand-text md:text-4xl">
              {home?.newsTitle || 'News & Announcements'}
            </h2>
          </div>

          {featuredNews && <FeaturedNewsCard item={featuredNews} />}

          {news.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {home?.newsViewAllLink && (
            <div className="flex justify-center">
              <CMSLink
                {...home.newsViewAllLink}
                label={home?.newsViewAllLabel || 'View All News'}
                appearance="inline"
                className="inline-flex items-center bg-green-dark px-9 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              />
            </div>
          )}
        </div>
      </section>

      {/* Featured Alumni */}
      <section className="bg-surface-white">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 py-20 md:px-20">
          <div className="flex flex-col items-center gap-3 text-center">
            {home?.alumniCaption && (
              <span className="text-[13px] font-semibold uppercase tracking-[0.15em] text-gold">
                {home.alumniCaption}
              </span>
            )}
            <h2 className="font-serif text-3xl font-bold text-brand-text md:text-4xl">
              {home?.alumniTitle || 'Featured Alumni'}
            </h2>
            {home?.alumniSubtitle && (
              <p className="max-w-xl text-[15px] text-brand-text-secondary">
                {home.alumniSubtitle}
              </p>
            )}
          </div>

          {featuredAlumnus && (
            <div className="grid grid-cols-1 overflow-hidden bg-green-dark text-white md:grid-cols-[480px_1fr]">
              <div className="relative min-h-[300px] w-full overflow-hidden md:min-h-[360px]">
                {featuredAlumnus.photo && typeof featuredAlumnus.photo === 'object' && (
                  <Media
                    resource={featuredAlumnus.photo}
                    fill
                    imgClassName="object-cover"
                    pictureClassName="absolute inset-0 h-full w-full"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center gap-3 p-8 md:p-12">
                <h3 className="font-serif text-2xl font-bold md:text-3xl">{featuredAlumnus.name}</h3>
                {featuredAlumnus.currentRole && (
                  <p className="text-gold">{featuredAlumnus.currentRole}</p>
                )}
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#B8D4C0]">
                  {featuredAlumnus.degree && <span>{featuredAlumnus.degree}</span>}
                  {featuredAlumnus.batch && <span>{featuredAlumnus.batch}</span>}
                </div>
                {featuredAlumnus.bio && (
                  <div className="text-[15px] leading-relaxed text-[#D6E4DA]">
                    <RichText data={featuredAlumnus.bio} enableGutter={false} enableProse={false} />
                  </div>
                )}
              </div>
            </div>
          )}

          {alumni.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {alumni.map((item) => (
                <AlumniCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {home?.alumniViewAllLink && (
            <div className="flex justify-center">
              <CMSLink
                {...home.alumniViewAllLink}
                label={home?.alumniViewAllLabel || 'View All Alumni'}
                appearance="inline"
                className="inline-flex items-center border border-green-dark px-9 py-3.5 text-sm font-semibold text-green-dark transition-colors hover:bg-green-dark hover:text-white"
              />
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export const metadata: Metadata = {
  title: 'ACRO — Alumni & Community Relations Office',
  description:
    'The Alumni & Community Relations Office of Visayas State University: news, events, alumni services, and giving.',
}

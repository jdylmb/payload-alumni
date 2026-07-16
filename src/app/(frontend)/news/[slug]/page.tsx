import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import React, { cache } from 'react'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { categoryLabel, formatDate } from '@/components/acro/utils'

type Args = { params: Promise<{ slug: string }> }

const queryNewsBySlug = cache(async (slug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'news',
    draft,
    overrideAccess: draft,
    depth: 2,
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})

export default async function NewsDetailPage({ params }: Args) {
  const { slug } = await params
  const item = await queryNewsBySlug(slug)

  if (!item) notFound()

  return (
    <main>
      <section className="bg-green-dark">
        <div className="mx-auto flex w-full max-w-[820px] flex-col gap-5 px-6 py-16 md:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold transition-opacity hover:opacity-80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide">
            <span className="text-gold">{categoryLabel(item.category)}</span>
            {item.publishedAt && (
              <span className="text-[#B8D4C0]">{formatDate(item.publishedAt)}</span>
            )}
          </div>
          <h1 className="font-serif text-3xl font-bold leading-tight text-white md:text-4xl">
            {item.title}
          </h1>
          {item.excerpt && (
            <p className="text-[15px] leading-relaxed text-[#B8D4C0]">{item.excerpt}</p>
          )}
        </div>
      </section>

      <article className="bg-surface-white">
        <div className="mx-auto flex w-full max-w-[820px] flex-col gap-8 px-6 py-12 md:px-8 md:py-16">
          {item.coverImage && typeof item.coverImage === 'object' && (
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-green-light">
              <Media
                resource={item.coverImage}
                fill
                imgClassName="object-cover"
                pictureClassName="absolute inset-0 h-full w-full"
              />
            </div>
          )}

          {item.content ? (
            <RichText data={item.content} enableGutter={false} />
          ) : (
            <p className="text-brand-text-secondary">No additional details for this item yet.</p>
          )}
        </div>
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const item = await queryNewsBySlug(slug)

  if (!item) return { title: 'News — ACRO' }

  return {
    title: `${item.title} — ACRO`,
    description: item.excerpt || undefined,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'news',
    draft: false,
    limit: 100,
    pagination: false,
    select: { slug: true },
  })

  return (result.docs || []).map(({ slug }) => ({ slug }))
}

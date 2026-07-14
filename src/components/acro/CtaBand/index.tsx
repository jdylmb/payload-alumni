import React from 'react'

import { CMSLink } from '@/components/Link'

export type CtaBandData = {
  heading?: string | null
  description?: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  primaryCta?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  secondaryCta?: any
}

export const CtaBand: React.FC<{ data?: CtaBandData | null }> = ({ data }) => {
  if (!data || (!data.heading && !data.description)) return null

  const hasPrimary = data.primaryCta?.label && data.primaryCta?.url
  const hasSecondary = data.secondaryCta?.label && data.secondaryCta?.url

  return (
    <section className="bg-green-dark">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-5 px-6 py-16 text-center md:px-20">
        {data.heading && (
          <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">{data.heading}</h2>
        )}
        {data.description && (
          <p className="max-w-xl text-[15px] leading-relaxed text-[#B8D4C0]">{data.description}</p>
        )}
        {(hasPrimary || hasSecondary) && (
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            {hasPrimary && (
              <CMSLink
                {...data.primaryCta}
                appearance="inline"
                className="inline-flex items-center bg-gold px-8 py-3.5 text-sm font-bold text-brand-text transition-opacity hover:opacity-90"
              />
            )}
            {hasSecondary && (
              <CMSLink
                {...data.secondaryCta}
                appearance="inline"
                className="inline-flex items-center border border-white px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-green-dark"
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}

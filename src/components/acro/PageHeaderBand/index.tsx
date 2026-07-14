import React from 'react'

export type PageHeaderBandProps = {
  caption?: string | null
  title?: string | null
  description?: string | null
}

/**
 * The green hero band ("Page Header Component" in the design) reused across
 * every non-home page: eyebrow caption, large serif title, centered blurb.
 */
export const PageHeaderBand: React.FC<PageHeaderBandProps> = ({ caption, title, description }) => {
  return (
    <section className="bg-green-dark">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-3 px-6 py-16 text-center md:px-20">
        {caption && (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {caption}
          </span>
        )}
        {title && (
          <h1 className="font-serif text-4xl font-bold text-white md:text-5xl">{title}</h1>
        )}
        {description && (
          <p className="max-w-xl text-[15px] leading-relaxed text-[#B8D4C0]">{description}</p>
        )}
      </div>
    </section>
  )
}

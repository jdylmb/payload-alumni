'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { HomePage } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Slide = NonNullable<HomePage['heroSlides']>[number]

export const HeroSlider: React.FC<{ slides: Slide[] }> = ({ slides }) => {
  const [active, setActive] = useState(0)
  const count = slides.length

  const goTo = useCallback((i: number) => setActive(((i % count) + count) % count), [count])
  const next = useCallback(() => setActive((a) => (a + 1) % count), [count])
  const prev = useCallback(() => setActive((a) => (a - 1 + count) % count), [count])

  useEffect(() => {
    if (count <= 1) return
    const id = setInterval(() => setActive((a) => (a + 1) % count), 6000)
    return () => clearInterval(id)
  }, [count])

  if (count === 0) return null

  return (
    <section className="relative h-[560px] w-full overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            i === active ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          aria-hidden={i !== active}
        >
          {slide.image && typeof slide.image === 'object' && (
            <Media
              resource={slide.image}
              fill
              priority={i === 0}
              imgClassName="object-cover"
              pictureClassName="absolute inset-0 h-full w-full"
            />
          )}
          <div className="absolute inset-0 bg-[#0A1F14]/70" />
          <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col items-center justify-center gap-5 px-6 text-center md:px-20">
            <h2 className="max-w-3xl font-serif text-4xl font-bold text-white md:text-5xl">
              {slide.heading}
            </h2>
            {slide.subheading && (
              <p className="max-w-xl text-base leading-relaxed text-[#D6E4DA]">
                {slide.subheading}
              </p>
            )}
            {slide.ctaLabel && slide.link && (
              <CMSLink
                {...slide.link}
                label={slide.ctaLabel}
                appearance="inline"
                className="mt-2 inline-flex items-center bg-gold px-8 py-3 text-sm font-bold uppercase tracking-wide text-brand-text transition-opacity hover:opacity-90"
              />
            )}
          </div>
        </div>
      ))}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  'rounded-full transition-all',
                  i === active ? 'h-3 w-3 bg-gold' : 'h-2.5 w-2.5 bg-white/50 hover:bg-white/80',
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

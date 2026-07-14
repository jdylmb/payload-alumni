'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="sticky top-0 z-30 border-b border-black/5 bg-surface-white"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-6 md:px-14">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="font-serif text-2xl font-bold leading-none text-green-dark">
            {data?.logoPrimary || 'ACRO'}
          </span>
          {(data?.logoSubtitle1 || data?.logoSubtitle2) && (
            <span className="flex flex-col text-[9px] font-semibold leading-tight tracking-wider text-brand-text-secondary">
              {data?.logoSubtitle1 && <span>{data.logoSubtitle1}</span>}
              {data?.logoSubtitle2 && <span>{data.logoSubtitle2}</span>}
            </span>
          )}
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}

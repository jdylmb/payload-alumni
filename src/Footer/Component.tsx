import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto bg-dark-bg text-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-8 pt-10 md:px-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <Link href="/" className="flex flex-col gap-2.5">
            <span className="font-serif text-[22px] font-bold leading-none">
              {footerData?.brand || 'ACRO'}
            </span>
            {footerData?.tagline && (
              <span className="text-xs text-[#8CA897]">{footerData.tagline}</span>
            )}
          </Link>

          <nav className="flex flex-wrap gap-6">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  key={i}
                  {...link}
                  appearance="inline"
                  className="text-xs text-[#8CA897] transition-colors hover:text-white"
                />
              )
            })}
          </nav>
        </div>

        <div className="my-6 h-px w-full bg-[#1A3D28]" />

        {footerData?.copyright && (
          <p className="text-[11px] text-[#6B8F77]">{footerData.copyright}</p>
        )}
      </div>
    </footer>
  )
}

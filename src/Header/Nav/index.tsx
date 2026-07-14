'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const registerButton = data?.registerButton

  return (
    <nav className="flex items-center gap-7">
      <div className="hidden items-center gap-7 lg:flex">
        {navItems.map(({ link }, i) => {
          return (
            <CMSLink
              key={i}
              {...link}
              appearance="inline"
              className="text-[13px] font-medium text-brand-text transition-colors hover:text-green-dark"
            />
          )
        })}
      </div>
      {registerButton?.link && (
        <CMSLink
          {...registerButton.link}
          label={registerButton.label || 'Register'}
          appearance="inline"
          className="inline-flex items-center bg-gold px-5 py-2 text-xs font-bold uppercase tracking-wide text-brand-text transition-opacity hover:opacity-90"
        />
      )}
    </nav>
  )
}

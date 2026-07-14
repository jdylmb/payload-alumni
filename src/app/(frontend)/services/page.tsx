import type { Metadata } from 'next'

import { CheckCircle2, ShieldCheck } from 'lucide-react'
import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'
import RichText from '@/components/RichText'
import { PageHeaderBand } from '@/components/acro/PageHeaderBand'
import { MembershipForm } from '@/components/acro/MembershipForm'

export default async function ServicesPage() {
  const services = await getCachedGlobal('servicesPage', 1)()
  const benefits = services?.benefits || []

  return (
    <main>
      <PageHeaderBand
        caption={services?.pageHeader?.caption}
        title={services?.pageHeader?.title || 'Alumni Membership'}
        description={services?.pageHeader?.description}
      />

      <section className="bg-surface">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 py-16 md:px-20">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="font-serif text-3xl font-bold text-brand-text">
                {services?.benefitsHeading || 'Alumni Membership Benefits'}
              </h2>
              {services?.benefitsIntro ? (
                <div className="text-[15px] leading-relaxed text-brand-text-secondary">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <RichText data={services.benefitsIntro as any} enableGutter={false} enableProse={false} />
                </div>
              ) : null}
            </div>
            {benefits.length > 0 && (
              <ul className="flex flex-1 flex-col gap-3">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] text-brand-text">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <span>{b.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {services?.privacyNotice && (
            <div className="flex items-start gap-3.5 bg-gold-light p-6">
              <ShieldCheck className="mt-0.5 h-7 w-7 shrink-0 text-gold" />
              <p className="text-sm leading-relaxed text-brand-text">{services.privacyNotice}</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-green-light">
        <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 px-6 py-16">
          <h2 className="text-center font-serif text-2xl font-bold text-brand-text">
            {services?.formIntro || 'Membership Registration Form'}
          </h2>
          <MembershipForm />
        </div>
      </section>
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Alumni Membership — ACRO',
  description:
    'Register as an official alumnus of Visayas State University and access exclusive benefits.',
}

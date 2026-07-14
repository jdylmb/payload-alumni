import type { Metadata } from 'next'

import { Clock, Mail, MapPin, Phone, Share2 } from 'lucide-react'
import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { Media } from '@/components/Media'
import { PageHeaderBand } from '@/components/acro/PageHeaderBand'
import { ContactForm } from '@/components/acro/ContactForm'

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({
  icon,
  label,
  children,
}) => (
  <div className="flex items-start gap-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-green-light text-green-dark">
      {icon}
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-gold">{label}</span>
      <div className="text-sm text-brand-text">{children}</div>
    </div>
  </div>
)

export default async function ContactPage() {
  const page = await getCachedGlobal('contactPage', 2)()
  const info = page?.contactInfo
  const socials = info?.socials || []
  const mapImage = page?.mapImage

  return (
    <main>
      <PageHeaderBand
        caption={page?.pageHeader?.caption}
        title={page?.pageHeader?.title || 'Contact Us'}
        description={page?.pageHeader?.description}
      />

      <section className="bg-surface">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-6 py-20 md:px-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <h2 className="font-serif text-3xl font-bold text-brand-text">
                  {page?.infoTitle || 'Get in Touch'}
                </h2>
                {page?.infoDescription && (
                  <p className="text-[15px] leading-relaxed text-brand-text-secondary">
                    {page.infoDescription}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-6">
                {info?.address && (
                  <InfoRow icon={<MapPin className="h-5 w-5" />} label="Office Address">
                    <span className="whitespace-pre-line">{info.address}</span>
                  </InfoRow>
                )}
                {info?.phone && (
                  <InfoRow icon={<Phone className="h-5 w-5" />} label="Phone">
                    {info.phone}
                  </InfoRow>
                )}
                {info?.email && (
                  <InfoRow icon={<Mail className="h-5 w-5" />} label="Email">
                    {info.email}
                  </InfoRow>
                )}
                {info?.hours && (
                  <InfoRow icon={<Clock className="h-5 w-5" />} label="Office Hours">
                    {info.hours}
                  </InfoRow>
                )}
                {socials.length > 0 && (
                  <InfoRow icon={<Share2 className="h-5 w-5" />} label="Social Media">
                    <div className="flex flex-wrap gap-3">
                      {socials.map((s, i) => (
                        <a
                          key={i}
                          href={s.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-dark underline-offset-2 hover:underline"
                        >
                          {s.platform}
                        </a>
                      ))}
                    </div>
                  </InfoRow>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5 border border-[#D0D5D2] bg-surface-white p-8">
              <h2 className="font-serif text-2xl font-bold text-brand-text">
                {page?.formTitle || 'Send us a Message'}
              </h2>
              <ContactForm />
            </div>
          </div>

          {mapImage && typeof mapImage === 'object' && (
            <div className="flex flex-col gap-4">
              <h2 className="font-serif text-2xl font-bold text-brand-text">Find Us</h2>
              <div className="relative h-[320px] w-full overflow-hidden bg-green-light">
                <Media
                  resource={mapImage}
                  fill
                  imgClassName="object-cover"
                  pictureClassName="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Contact Us — ACRO',
  description:
    'Reach out to the Alumni & Community Relations Office for inquiries and support.',
}

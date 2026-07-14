import type { GlobalConfig } from 'payload'

import { pageHeader } from '@/fields/pageHeader'
import { revalidateServicesPage } from './hooks/revalidateServicesPage'

export const ServicesPage: GlobalConfig = {
  slug: 'servicesPage',
  label: 'Services Page',
  access: {
    read: () => true,
  },
  fields: [
    pageHeader(),
    {
      name: 'benefitsHeading',
      type: 'text',
      defaultValue: 'Alumni Membership Benefits',
    },
    {
      name: 'benefitsIntro',
      type: 'richText',
    },
    {
      name: 'benefits',
      type: 'array',
      label: 'Benefits list',
      admin: { initCollapsed: true },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'privacyNotice',
      type: 'textarea',
      label: 'Data privacy notice',
    },
    {
      name: 'formIntro',
      type: 'text',
      label: 'Form intro heading',
      defaultValue: 'Membership Registration Form',
    },
  ],
  hooks: {
    afterChange: [revalidateServicesPage],
  },
}

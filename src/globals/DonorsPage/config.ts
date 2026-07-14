import type { GlobalConfig } from 'payload'

import { ctaBand } from '@/fields/ctaBand'
import { pageHeader } from '@/fields/pageHeader'
import { revalidateDonorsPage } from './hooks/revalidateDonorsPage'

export const DonorsPage: GlobalConfig = {
  slug: 'donorsPage',
  label: 'Donors Page',
  access: {
    read: () => true,
  },
  fields: [
    pageHeader(),
    {
      name: 'introTitle',
      type: 'text',
      defaultValue: 'Your Generosity Makes a Difference',
    },
    {
      name: 'introBody',
      type: 'textarea',
    },
    {
      name: 'categories',
      type: 'array',
      label: 'Donation categories',
      maxRows: 6,
      admin: { initCollapsed: true },
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'amounts', type: 'text', label: 'Suggested amounts' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'honorRollCaption',
          type: 'text',
          defaultValue: 'THANK YOU',
          admin: { width: '50%' },
        },
        {
          name: 'honorRollTitle',
          type: 'text',
          defaultValue: 'Donors Honor Roll',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'honorRollDescription',
      type: 'textarea',
    },
    ctaBand(),
  ],
  hooks: {
    afterChange: [revalidateDonorsPage],
  },
}

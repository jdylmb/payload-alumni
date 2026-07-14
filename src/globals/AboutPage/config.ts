import type { GlobalConfig } from 'payload'

import { pageHeader } from '@/fields/pageHeader'
import { revalidateAboutPage } from './hooks/revalidateAboutPage'

const contentGroup = (name: string, label: string): GlobalConfig['fields'][number] => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
})

export const AboutPage: GlobalConfig = {
  slug: 'aboutPage',
  label: 'About Page',
  access: {
    read: () => true,
  },
  fields: [
    pageHeader(),
    contentGroup('mission', 'Mission'),
    contentGroup('vision', 'Vision'),
    {
      name: 'stats',
      type: 'array',
      label: 'Stats band',
      maxRows: 6,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateAboutPage],
  },
}

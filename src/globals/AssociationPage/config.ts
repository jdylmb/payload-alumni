import type { GlobalConfig } from 'payload'

import { pageHeader } from '@/fields/pageHeader'
import { revalidateAssociationPage } from './hooks/revalidateAssociationPage'

export const AssociationPage: GlobalConfig = {
  slug: 'associationPage',
  label: 'Association Page',
  access: {
    read: () => true,
  },
  fields: [
    pageHeader(),
    {
      name: 'intro',
      type: 'group',
      label: 'Introduction',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'The VSU Alumni Association',
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
    },
    {
      name: 'orgChartTitle',
      type: 'text',
      defaultValue: 'Organizational Structure',
    },
  ],
  hooks: {
    afterChange: [revalidateAssociationPage],
  },
}

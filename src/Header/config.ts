import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Logo',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'logoPrimary',
          type: 'text',
          defaultValue: 'ACRO',
          label: 'Logo text',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'logoSubtitle1',
              type: 'text',
              admin: { width: '50%' },
              label: 'Subtitle line 1',
            },
            {
              name: 'logoSubtitle2',
              type: 'text',
              admin: { width: '50%' },
              label: 'Subtitle line 2',
            },
          ],
        },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'registerButton',
      type: 'group',
      label: 'Register button',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Register',
        },
        link({
          appearances: false,
          disableLabel: true,
        }),
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}

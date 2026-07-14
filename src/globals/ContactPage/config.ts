import type { GlobalConfig } from 'payload'

import { pageHeader } from '@/fields/pageHeader'
import { revalidateContactPage } from './hooks/revalidateContactPage'

export const ContactPage: GlobalConfig = {
  slug: 'contactPage',
  label: 'Contact Page',
  access: {
    read: () => true,
  },
  fields: [
    pageHeader(),
    {
      name: 'infoTitle',
      type: 'text',
      defaultValue: 'Get in Touch',
    },
    {
      name: 'infoDescription',
      type: 'textarea',
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Contact details',
      fields: [
        { name: 'address', type: 'textarea' },
        {
          type: 'row',
          fields: [
            { name: 'phone', type: 'text', admin: { width: '50%' } },
            { name: 'email', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'hours', type: 'text', label: 'Office hours' },
        {
          name: 'socials',
          type: 'array',
          label: 'Social links',
          admin: { initCollapsed: true },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'platform', type: 'text', admin: { width: '50%' } },
                { name: 'url', type: 'text', admin: { width: '50%' } },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'mapImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'formTitle',
      type: 'text',
      defaultValue: 'Send us a Message',
    },
  ],
  hooks: {
    afterChange: [revalidateContactPage],
  },
}

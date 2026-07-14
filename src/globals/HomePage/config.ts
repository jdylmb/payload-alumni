import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { pageHeader } from '@/fields/pageHeader'
import { revalidateHomePage } from './hooks/revalidateHomePage'

export const HomePage: GlobalConfig = {
  slug: 'homePage',
  label: 'Home Page',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero Slider',
          fields: [
            {
              name: 'heroSlides',
              type: 'array',
              maxRows: 6,
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'heading',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'subheading',
                  type: 'textarea',
                },
                {
                  name: 'ctaLabel',
                  type: 'text',
                },
                link({ appearances: false, disableLabel: true, optional: true }),
              ],
            },
          ],
        },
        {
          label: 'Announcements Band',
          fields: [pageHeader()],
        },
        {
          label: 'News Section',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'newsCaption',
                  type: 'text',
                  defaultValue: 'LATEST NEWS',
                  admin: { width: '50%' },
                },
                {
                  name: 'newsTitle',
                  type: 'text',
                  defaultValue: 'News & Announcements',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'newsViewAllLabel',
              type: 'text',
              defaultValue: 'View All News',
            },
            link({
              appearances: false,
              disableLabel: true,
              optional: true,
              overrides: { name: 'newsViewAllLink' },
            }),
          ],
        },
        {
          label: 'Alumni Section',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'alumniCaption',
                  type: 'text',
                  defaultValue: 'PROUD VISCANS',
                  admin: { width: '50%' },
                },
                {
                  name: 'alumniTitle',
                  type: 'text',
                  defaultValue: 'Featured Alumni',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'alumniSubtitle',
              type: 'textarea',
            },
            {
              name: 'alumniViewAllLabel',
              type: 'text',
              defaultValue: 'View All Alumni',
            },
            link({
              appearances: false,
              disableLabel: true,
              optional: true,
              overrides: { name: 'alumniViewAllLink' },
            }),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHomePage],
  },
}

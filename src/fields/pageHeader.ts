import type { GroupField } from 'payload'

import deepMerge from '@/utilities/deepMerge'

type PageHeaderType = (overrides?: Partial<GroupField>) => GroupField

/**
 * Shared "Page Header" hero band used across every non-home page global.
 * Renders as a green band with an eyebrow caption, a large title, and a
 * centered description (see PageHeaderBand component).
 */
export const pageHeader: PageHeaderType = (overrides = {}) => {
  const result: GroupField = {
    name: 'pageHeader',
    type: 'group',
    label: 'Page Header',
    fields: [
      {
        name: 'caption',
        type: 'text',
        label: 'Eyebrow caption',
      },
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        type: 'textarea',
      },
    ],
  }

  return deepMerge(result, overrides)
}

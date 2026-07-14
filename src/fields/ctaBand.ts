import type { GroupField } from 'payload'

import deepMerge from '@/utilities/deepMerge'
import { link } from './link'

type CtaBandType = (overrides?: Partial<GroupField>) => GroupField

/**
 * Shared "CTA band" — a green call-to-action strip with a heading, blurb and
 * up to two link buttons. Rendered by the CtaBand component.
 */
export const ctaBand: CtaBandType = (overrides = {}) => {
  const result: GroupField = {
    name: 'ctaBand',
    type: 'group',
    label: 'Call-to-action band',
    fields: [
      { name: 'heading', type: 'text' },
      { name: 'description', type: 'textarea' },
      link({ appearances: false, optional: true, overrides: { name: 'primaryCta' } }),
      link({ appearances: false, optional: true, overrides: { name: 'secondaryCta' } }),
    ],
  }

  return deepMerge(result, overrides)
}

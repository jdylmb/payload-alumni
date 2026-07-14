import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { revalidateDonors, revalidateDonorsDelete } from './hooks/revalidateDonors'

export const Donors: CollectionConfig = {
  slug: 'donors',
  labels: {
    singular: 'Donor',
    plural: 'Donors',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'tier', 'order'],
    useAsTitle: 'name',
  },
  defaultPopulate: {
    name: true,
    tier: true,
    order: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'tier',
          type: 'select',
          required: true,
          defaultValue: 'bronze',
          admin: { width: '50%' },
          options: [
            { label: 'Gold', value: 'gold' },
            { label: 'Silver', value: 'silver' },
            { label: 'Bronze', value: 'bronze' },
          ],
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: { width: '50%' },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateDonors],
    afterDelete: [revalidateDonorsDelete],
  },
}

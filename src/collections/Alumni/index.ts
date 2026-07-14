import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { revalidateAlumni, revalidateAlumniDelete } from './hooks/revalidateAlumni'

export const Alumni: CollectionConfig<'alumni'> = {
  slug: 'alumni',
  labels: {
    singular: 'Alumnus',
    plural: 'Alumni',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    name: true,
    slug: true,
    photo: true,
    batch: true,
    degree: true,
    currentRole: true,
    location: true,
  },
  admin: {
    defaultColumns: ['name', 'batch', 'degree', 'featured', 'order'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'batch',
          type: 'text',
          label: 'Batch / graduation year',
          admin: { width: '50%' },
        },
        {
          name: 'location',
          type: 'text',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'degree',
      type: 'text',
      label: 'Degree earned at VSU',
    },
    {
      name: 'currentRole',
      type: 'text',
      label: 'Current role / achievement',
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'Show in the highlighted alumnus slot on the home page.',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first in the grid.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
    },
    slugField({ useAsSlug: 'name' }),
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidateAlumni],
    afterDelete: [revalidateAlumniDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 25,
  },
}

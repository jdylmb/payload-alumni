import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import {
  revalidateTeamMembers,
  revalidateTeamMembersDelete,
} from './hooks/revalidateTeamMembers'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: {
    singular: 'Team Member',
    plural: 'Team Members',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'position', 'org', 'level', 'order'],
    useAsTitle: 'name',
    group: 'Organization',
  },
  defaultPopulate: {
    name: true,
    position: true,
    photo: true,
    org: true,
    level: true,
    order: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'position',
      type: 'text',
      label: 'Position / title',
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
          name: 'org',
          type: 'select',
          required: true,
          defaultValue: 'acro',
          admin: { width: '33%' },
          options: [
            { label: 'ACRO Office', value: 'acro' },
            { label: 'Alumni Association', value: 'association' },
          ],
        },
        {
          name: 'level',
          type: 'select',
          required: true,
          defaultValue: 'staff',
          admin: {
            width: '33%',
            description: 'Tier in the org chart (top to bottom).',
          },
          options: [
            { label: 'Head', value: 'head' },
            { label: 'Officer', value: 'officer' },
            { label: 'Staff', value: 'staff' },
            { label: 'Support', value: 'support' },
          ],
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: {
            width: '33%',
            description: 'Left-to-right order within a tier.',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateTeamMembers],
    afterDelete: [revalidateTeamMembersDelete],
  },
}

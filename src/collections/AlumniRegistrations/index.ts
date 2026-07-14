import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const AlumniRegistrations: CollectionConfig = {
  slug: 'alumni-registrations',
  labels: {
    singular: 'Alumni Registration',
    plural: 'Alumni Registrations',
  },
  access: {
    // Public membership form can create submissions; only staff can read/manage them.
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'status', 'createdAt'],
    group: 'Submissions',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Personal Info',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'fullName', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', admin: { width: '50%' } },
                {
                  name: 'dateOfBirth',
                  type: 'date',
                  admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'sex',
                  type: 'select',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Prefer not to say', value: 'unspecified' },
                  ],
                },
                {
                  name: 'civilStatus',
                  type: 'select',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Single', value: 'single' },
                    { label: 'Married', value: 'married' },
                    { label: 'Widowed', value: 'widowed' },
                    { label: 'Separated', value: 'separated' },
                  ],
                },
              ],
            },
            { name: 'nationality', type: 'text' },
            { name: 'currentAddress', type: 'textarea', label: 'Current address' },
            { name: 'permanentAddress', type: 'textarea', label: 'Permanent address' },
          ],
        },
        {
          label: 'Degrees',
          fields: [
            {
              name: 'degrees',
              type: 'array',
              label: 'Degrees obtained at VSU',
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'level',
                      type: 'select',
                      required: true,
                      admin: { width: '33%' },
                      options: [
                        { label: 'High School', value: 'HS' },
                        { label: 'Bachelor (BS)', value: 'BS' },
                        { label: 'Master (MS)', value: 'MS' },
                        { label: 'Doctorate (PhD)', value: 'PhD' },
                      ],
                    },
                    { name: 'course', type: 'text', admin: { width: '34%' } },
                    { name: 'yearGraduated', type: 'text', admin: { width: '33%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Payment',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'paymentMethod',
                  type: 'select',
                  admin: { width: '50%' },
                  options: [
                    { label: 'GCash', value: 'gcash' },
                    { label: 'Bank Transfer', value: 'bank' },
                    { label: 'Over the Counter', value: 'counter' },
                  ],
                },
                { name: 'referenceNumber', type: 'text', admin: { width: '50%' } },
              ],
            },
            { name: 'amount', type: 'number', label: 'Amount paid (PHP)' },
            {
              name: 'proofOfPayment',
              type: 'upload',
              relationTo: 'media',
              label: 'Proof of payment',
            },
          ],
        },
        {
          label: 'Consent',
          fields: [
            {
              name: 'consent',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'databaseEncoding',
                  type: 'checkbox',
                  label: 'Alumni Database encoding',
                },
                {
                  name: 'alumniId',
                  type: 'checkbox',
                  label: 'VSUAAI Alumni ID printing',
                },
                {
                  name: 'homecoming',
                  type: 'checkbox',
                  label: 'VSU Alumni Homecoming invitations',
                },
                {
                  name: 'publication',
                  type: 'checkbox',
                  label: 'Publication in the printed / online alumni directory',
                },
                {
                  name: 'forwarding',
                  type: 'checkbox',
                  label: 'Forwarding of data to relevant offices',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
  ],
}

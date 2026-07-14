import type { GlobalConfig } from 'payload'

import { ctaBand } from '@/fields/ctaBand'
import { pageHeader } from '@/fields/pageHeader'
import { revalidateEventsPage } from './hooks/revalidateEventsPage'

export const EventsPage: GlobalConfig = {
  slug: 'eventsPage',
  label: 'Events Page',
  access: {
    read: () => true,
  },
  fields: [pageHeader(), ctaBand()],
  hooks: {
    afterChange: [revalidateEventsPage],
  },
}

import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Event } from '../../../payload-types'

// Only revalidate for published docs — see revalidateNews for why draft
// autosave must not call revalidatePath during the admin create render.
export const revalidateEvents: CollectionAfterChangeHook<Event> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating events page`)
      revalidatePath('/events')
    }
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      revalidatePath('/events')
    }
  }

  return doc
}

export const revalidateEventsDelete: CollectionAfterDeleteHook<Event> = ({
  req: { context },
  doc,
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/events')
  }

  return doc
}

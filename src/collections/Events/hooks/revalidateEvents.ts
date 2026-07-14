import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateEvents: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating events page`)
    revalidatePath('/events')
  }

  return doc
}

export const revalidateEventsDelete: CollectionAfterDeleteHook = ({ req: { context }, doc }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/events')
  }

  return doc
}

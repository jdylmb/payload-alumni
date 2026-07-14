import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { News } from '../../../payload-types'

// Only revalidate for published docs. Draft autosave (which Payload performs
// during the admin "create" render) must NOT call revalidatePath, or Next.js
// throws "used revalidatePath during render" and the edit view renders blank.
export const revalidateNews: CollectionAfterChangeHook<News> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating home after news change`)
      revalidatePath('/')
    }
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      revalidatePath('/')
    }
  }

  return doc
}

export const revalidateNewsDelete: CollectionAfterDeleteHook<News> = ({
  req: { context },
  doc,
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/')
  }

  return doc
}

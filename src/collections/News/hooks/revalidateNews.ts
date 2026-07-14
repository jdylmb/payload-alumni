import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { News } from '../../../payload-types'

export const revalidateNews: CollectionAfterChangeHook<News> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating home after news change`)
    revalidatePath('/')
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

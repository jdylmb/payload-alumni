import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateDonors: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating donors page`)
    revalidatePath('/donors')
  }

  return doc
}

export const revalidateDonorsDelete: CollectionAfterDeleteHook = ({ req: { context }, doc }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/donors')
  }

  return doc
}

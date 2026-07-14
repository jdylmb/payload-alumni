import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateAlumni: CollectionAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating home after alumni change`)
    revalidatePath('/')
  }

  return doc
}

export const revalidateAlumniDelete: CollectionAfterDeleteHook = ({ req: { context }, doc }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/')
  }

  return doc
}

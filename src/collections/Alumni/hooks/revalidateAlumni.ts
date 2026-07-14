import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Alumnus } from '../../../payload-types'

// Only revalidate for published docs — see revalidateNews for why draft
// autosave must not call revalidatePath during the admin create render.
export const revalidateAlumni: CollectionAfterChangeHook<Alumnus> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating home after alumni change`)
      revalidatePath('/')
    }
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      revalidatePath('/')
    }
  }

  return doc
}

export const revalidateAlumniDelete: CollectionAfterDeleteHook<Alumnus> = ({
  req: { context },
  doc,
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/')
  }

  return doc
}

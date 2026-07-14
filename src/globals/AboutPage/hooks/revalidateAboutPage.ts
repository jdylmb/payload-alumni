import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateAboutPage: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating about page`)
    revalidatePath('/about')
    revalidateTag('global_aboutPage', 'max')
  }

  return doc
}

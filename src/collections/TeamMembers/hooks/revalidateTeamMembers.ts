import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

const revalidateBoth = () => {
  revalidatePath('/about')
  revalidatePath('/association')
}

export const revalidateTeamMembers: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating org-chart pages after team member change`)
    revalidateBoth()
  }

  return doc
}

export const revalidateTeamMembersDelete: CollectionAfterDeleteHook = ({ req: { context }, doc }) => {
  if (!context.disableRevalidate) {
    revalidateBoth()
  }

  return doc
}

import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateSiteSettings: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating site settings')

    // Site settings (including logo) are consumed in the root frontend layout.
    revalidatePath('/', 'layout')
  }

  return doc
}

import type { Access } from 'payload'

export const authenticatedOrActive: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    isActive: {
      equals: true,
    },
  }
}

export const authenticatedOrPublishedStatus: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    status: {
      equals: 'published',
    },
  }
}

import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args
  const metadataDoc = doc as
    | (Partial<Page> & {
        meta?: {
          description?: string | null
          image?: Media | Config['db']['defaultIDType'] | null
          title?: string | null
        }
        ogImage?: Media | Config['db']['defaultIDType'] | null
        seoDescription?: string | null
        seoTitle?: string | null
      })
    | null

  const ogImage = getImageURL(metadataDoc?.meta?.image || metadataDoc?.ogImage)
  const rawTitle = metadataDoc?.meta?.title || metadataDoc?.seoTitle
  const rawDescription = metadataDoc?.meta?.description || metadataDoc?.seoDescription

  const title = rawTitle ? rawTitle + ' | Payload Website Template' : 'Payload Website Template'

  return {
    description: rawDescription,
    openGraph: mergeOpenGraph({
      description: rawDescription || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}

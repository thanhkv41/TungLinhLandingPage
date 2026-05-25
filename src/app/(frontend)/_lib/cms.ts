import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getServerSideURL } from '@/utilities/getURL'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

export type MediaResource = {
  id?: string | number
  alt?: string | null
  filename?: string | null
  height?: number | null
  mimeType?: string | null
  updatedAt?: string | null
  url?: string | null
  width?: number | null
  sizes?: Record<string, { url?: string | null } | undefined> | null
}

export type Relationship<T> = T | string | number | null | undefined

export type SiteSettings = {
  siteName?: string | null
  logo?: Relationship<MediaResource>
  hotline?: string | null
  secondaryPhone?: string | null
  email?: string | null
  address?: string | null
  factoryAddress?: string | null
  showroomAddress?: string | null
  facebookUrl?: string | null
  zaloUrl?: string | null
  youtubeUrl?: string | null
  googleMapEmbedUrl?: string | null
  defaultSeoTitle?: string | null
  defaultSeoDescription?: string | null
  defaultOgImage?: Relationship<MediaResource>
}

export type Category = {
  id: string | number
  title?: string | null
  slug?: string | null
  description?: string | null
  image?: Relationship<MediaResource>
}

export type Product = {
  id: string | number
  title?: string | null
  slug?: string | null
  category?: Relationship<Category>
  featuredImage?: Relationship<MediaResource>
  gallery?: Relationship<MediaResource>[]
  shortDescription?: string | null
  content?: unknown
  specifications?: { id?: string | number; label?: string | null; value?: string | null }[]
  advantages?: { id?: string | number; title?: string | null; description?: string | null }[]
  applications?: { id?: string | number; title?: string | null; description?: string | null }[]
  colorOptions?: {
    id?: string | number
    name?: string | null
    swatchImage?: Relationship<MediaResource>
    description?: string | null
  }[]
  sizeOptions?: {
    id?: string | number
    name?: string | null
    previewImage?: Relationship<MediaResource>
    description?: string | null
  }[]
  catalogueFile?: Relationship<MediaResource>
  relatedProducts?: Relationship<Product>[]
  isFeatured?: boolean | null
  seoTitle?: string | null
  seoDescription?: string | null
  ogImage?: Relationship<MediaResource>
}

export type Project = {
  id: string | number
  title?: string | null
  slug?: string | null
  category?: Relationship<Category>
  location?: string | null
  clientName?: string | null
  completedYear?: number | null
  featuredImage?: Relationship<MediaResource>
  gallery?: Relationship<MediaResource>[]
  shortDescription?: string | null
  content?: unknown
  usedProducts?: Relationship<Product>[]
  isFeatured?: boolean | null
  seoTitle?: string | null
  seoDescription?: string | null
  ogImage?: Relationship<MediaResource>
}

export type Post = {
  id: string | number
  title?: string | null
  slug?: string | null
  category?: Relationship<Category>
  featuredImage?: Relationship<MediaResource>
  excerpt?: string | null
  content?: unknown
  publishedAt?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  ogImage?: Relationship<MediaResource>
}

export type Banner = {
  id: string | number
  title?: string | null
  subtitle?: string | null
  image?: Relationship<MediaResource>
  buttonText?: string | null
  buttonUrl?: string | null
}

export type Certificate = {
  id: string | number
  title?: string | null
  image?: Relationship<MediaResource>
  description?: string | null
  issuedBy?: string | null
  issuedAt?: string | null
}

export type DocumentItem = {
  id: string | number
  title?: string | null
  slug?: string | null
  file?: Relationship<MediaResource>
  description?: string | null
  category?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
}

export type StaticPage = {
  id: string | number
  title?: string | null
  slug?: string | null
  layout?: unknown[]
}

type PublicCollection =
  | 'banners'
  | 'certificates'
  | 'documents'
  | 'pages'
  | 'post-categories'
  | 'posts'
  | 'product-categories'
  | 'products'
  | 'project-categories'
  | 'projects'

const getPayloadClient = cache(async () => getPayload({ config: configPromise }))

async function findDocs<T>({
  collection,
  depth = 1,
  limit = 100,
  sort,
  where,
}: {
  collection: PublicCollection
  depth?: number
  limit?: number
  sort?: string
  where?: Where
}): Promise<T[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: collection as never,
    depth,
    limit,
    overrideAccess: false,
    pagination: false,
    sort,
    where,
  })

  return result.docs as T[]
}

const activeWhere = {
  isActive: {
    equals: true,
  },
}

const publishedWhere = {
  status: {
    equals: 'published',
  },
}

const slugWhere = (slug: string) => ({
  slug: {
    equals: decodeURIComponent(slug),
  },
})

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  const payload = await getPayloadClient()

  const settings = await payload.findGlobal({
    slug: 'site-settings' as never,
    depth: 1,
    overrideAccess: false,
  })

  return settings as SiteSettings
})

export const getActiveBanners = (limit = 3) =>
  findDocs<Banner>({ collection: 'banners', where: activeWhere, sort: 'order', limit })

export const getProductCategories = () =>
  findDocs<Category>({
    collection: 'product-categories',
    where: activeWhere,
    sort: 'order',
    limit: 100,
  })

export const getProducts = (limit = 100) =>
  findDocs<Product>({
    collection: 'products',
    where: publishedWhere,
    sort: 'order',
    limit,
    depth: 2,
  })

export const getFeaturedProducts = (limit = 6) =>
  findDocs<Product>({
    collection: 'products',
    where: {
      and: [publishedWhere, { isFeatured: { equals: true } }],
    },
    sort: 'order',
    limit,
    depth: 2,
  })

export const getProductBySlug = async (slug: string) => {
  const [product] = await findDocs<Product>({
    collection: 'products',
    where: {
      and: [publishedWhere, slugWhere(slug)],
    },
    limit: 1,
    depth: 3,
  })

  return product || null
}

export const getProjects = (limit = 100) =>
  findDocs<Project>({
    collection: 'projects',
    where: publishedWhere,
    sort: 'order',
    limit,
    depth: 2,
  })

export const getFeaturedProjects = (limit = 6) =>
  findDocs<Project>({
    collection: 'projects',
    where: {
      and: [publishedWhere, { isFeatured: { equals: true } }],
    },
    sort: 'order',
    limit,
    depth: 2,
  })

export const getProjectBySlug = async (slug: string) => {
  const [project] = await findDocs<Project>({
    collection: 'projects',
    where: {
      and: [publishedWhere, slugWhere(slug)],
    },
    limit: 1,
    depth: 3,
  })

  return project || null
}

export const getPosts = (limit = 100) =>
  findDocs<Post>({
    collection: 'posts',
    where: publishedWhere,
    sort: '-publishedAt',
    limit,
    depth: 2,
  })

export const getPostBySlug = async (slug: string) => {
  const [post] = await findDocs<Post>({
    collection: 'posts',
    where: {
      and: [publishedWhere, slugWhere(slug)],
    },
    limit: 1,
    depth: 2,
  })

  return post || null
}

export const getRelatedPosts = async (post: Post, limit = 3) => {
  const category =
    post.category && typeof post.category === 'object' && 'id' in post.category
      ? post.category.id
      : post.category

  const where: Where = category
    ? {
        and: [
          publishedWhere,
          { id: { not_equals: post.id } },
          { category: { equals: category } },
        ],
      }
    : {
        and: [publishedWhere, { id: { not_equals: post.id } }],
      }

  return findDocs<Post>({
    collection: 'posts',
    where,
    sort: '-publishedAt',
    limit,
    depth: 2,
  })
}

export const getRelatedProductsByCategory = async (product: Product, limit = 6) => {
  const category =
    product.category && typeof product.category === 'object' && 'id' in product.category
      ? product.category.id
      : product.category

  if (!category) return []

  const where: Where = {
    and: [
      publishedWhere,
      { id: { not_equals: product.id } },
      { category: { equals: category } },
    ],
  }

  return findDocs<Product>({
    collection: 'products',
    where,
    sort: 'order',
    limit,
    depth: 2,
  })
}

export const getCertificates = (limit = 12) =>
  findDocs<Certificate>({
    collection: 'certificates',
    where: activeWhere,
    sort: 'order',
    limit,
  })

export const getDocuments = () =>
  findDocs<DocumentItem>({
    collection: 'documents',
    where: activeWhere,
    sort: 'order',
    limit: 100,
    depth: 1,
  })

export const getPageBySlug = async (slug: string) => {
  const [page] = await findDocs<StaticPage>({
    collection: 'pages',
    where: slugWhere(slug),
    limit: 1,
    depth: 2,
  })

  return page || null
}

export function asMedia(resource: Relationship<MediaResource>): MediaResource | null {
  return resource && typeof resource === 'object' && 'url' in resource ? resource : null
}

export function mediaUrl(resource: Relationship<MediaResource>) {
  const media = asMedia(resource)
  return media?.url ? getMediaUrl(media.url, media.updatedAt) : ''
}

export function titleWithSite(title: string | null | undefined, settings?: SiteSettings | null) {
  const siteName = settings?.siteName || 'Tùng Linh'
  return title ? `${title} | ${siteName}` : siteName
}

export async function buildMetadata({
  description,
  image,
  title,
}: {
  description?: string | null
  image?: Relationship<MediaResource>
  title?: string | null
} = {}): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl = getServerSideURL()
  const imagePath = mediaUrl(image) || mediaUrl(settings?.defaultOgImage)
  const imageUrl = imagePath ? new URL(imagePath, siteUrl).toString() : undefined
  const metadataTitle = titleWithSite(title || settings?.defaultSeoTitle, settings)
  const metadataDescription = description || settings?.defaultSeoDescription || undefined

  return {
    title: metadataTitle,
    description: metadataDescription,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: metadataTitle,
      description: metadataDescription,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      type: 'website',
    },
  }
}

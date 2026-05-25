import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

import fs from 'node:fs/promises'

type CrawledSpecification = {
  label?: string
  value?: string
}

type CrawledProduct = {
  sourceUrl: string
  category?: {
    key?: string
    title?: string
  }
  title?: string
  slug?: string
  seoTitle?: string
  seoDescription?: string
  ogImage?: string
  shortDescription?: string
  specifications?: CrawledSpecification[]
  galleryImages?: string[]
  colors?: string[]
  colorSwatches?: { name?: string; imageUrl?: string }[]
  advantages?: string[]
  contentPlain?: string
}

type CrawlFile = {
  products?: CrawledProduct[]
}

const INPUT_PATH = 'data/imports/xingfawindow-products.json'

function cleanText(input?: string | null): string {
  if (!input) return ''
  return input.replace(/\s+/g, ' ').trim()
}

function filenameFromUrl(url: string): string {
  const pathname = new URL(url).pathname
  const part = pathname.split('/').pop()
  return part || `image-${Date.now()}.jpg`
}

function buildLexicalParagraph(text: string) {
  return {
    children: [
      {
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text,
        type: 'text',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
  }
}

function toLexicalContent(text: string) {
  const lines = text
    .split('\n')
    .map((line) => cleanText(line))
    .filter(Boolean)

  const children =
    lines.length > 0
      ? lines.map((line) => buildLexicalParagraph(line))
      : [buildLexicalParagraph('Nội dung sản phẩm đang được cập nhật.')]

  return {
    root: {
      children,
      direction: null,
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

function normalizeCategory(rawKey: string | undefined) {
  const key = cleanText(rawKey).toLowerCase()
  if (key === 'kawin') {
    return {
      slug: 'kawin',
      title: 'Hệ KAWIN (Hệ Rãnh C Châu Âu)',
      description: 'Danh mục hệ nhôm KAWIN rãnh C theo tiêu chuẩn châu Âu.',
    }
  }
  return {
    slug: 'xfa',
    title: 'Hệ XFA',
    description: 'Danh mục hệ nhôm XFA cho cửa đi, cửa sổ, mặt dựng và nội thất.',
  }
}

async function fetchRemoteFile(url: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${url} (${response.status})`)
  }
  const arrayBuffer = await response.arrayBuffer()
  const fileName = filenameFromUrl(url)
  const ext = fileName.split('.').pop()?.toLowerCase()
  const mimeType = ext ? `image/${ext === 'jpg' ? 'jpeg' : ext}` : 'image/jpeg'

  return {
    name: fileName,
    data: Buffer.from(arrayBuffer),
    mimetype: mimeType,
    size: arrayBuffer.byteLength,
  }
}

async function getOrCreateMediaId({
  payload,
  mediaCache,
  imageUrl,
  altText,
}: {
  payload: Awaited<ReturnType<typeof getPayload>>
  mediaCache: Map<string, number | string>
  imageUrl: string
  altText: string
}) {
  const cached = mediaCache.get(imageUrl)
  if (cached) return cached

  const fileName = filenameFromUrl(imageUrl)
  const existingMedia = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      filename: {
        equals: fileName,
      },
    },
  })

  let mediaId: number | string
  if (existingMedia.docs.length > 0) {
    mediaId = existingMedia.docs[0].id
  } else {
    const file = await fetchRemoteFile(imageUrl)
    const createdMedia = await payload.create({
      collection: 'media',
      data: {
        alt: altText,
      },
      file,
    })
    mediaId = createdMedia.id
  }

  mediaCache.set(imageUrl, mediaId)
  return mediaId
}

async function main() {
  const raw = await fs.readFile(INPUT_PATH, 'utf8')
  const parsed = JSON.parse(raw.replace(/^\uFEFF/, '')) as CrawlFile
  const allProducts = parsed.products ?? []
  const onlySlug = cleanText(process.env.IMPORT_PRODUCT_SLUG)
  const maxProductsRaw = Number(process.env.IMPORT_MAX_PRODUCTS || '0')
  const maxProducts = Number.isFinite(maxProductsRaw) && maxProductsRaw > 0 ? maxProductsRaw : 0

  let products = allProducts
  if (onlySlug) {
    products = products.filter((item) => cleanText(item.slug) === onlySlug)
  }
  if (maxProducts > 0) {
    products = products.slice(0, maxProducts)
  }

  if (products.length === 0) {
    throw new Error('No products found in crawl file.')
  }

  const payload = await getPayload({ config })
  const mediaCache = new Map<string, number | string>()
  const categoryMap = new Map<string, number | string>()

  const categorySet = new Map<string, ReturnType<typeof normalizeCategory>>()
  for (const product of products) {
    const category = normalizeCategory(product.category?.key)
    categorySet.set(category.slug, category)
  }

  for (const category of categorySet.values()) {
    const existing = await payload.find({
      collection: 'product-categories',
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: category.slug,
        },
      },
    })

    let categoryId: number | string
    if (existing.docs.length > 0) {
      const doc = existing.docs[0]
      categoryId = doc.id
      await payload.update({
        collection: 'product-categories',
        id: doc.id,
        data: {
          title: category.title,
          slug: category.slug,
          description: category.description,
          isActive: true,
        },
      })
      console.log(`Updated category: ${category.slug}`)
    } else {
      const doc = await payload.create({
        collection: 'product-categories',
        data: {
          title: category.title,
          slug: category.slug,
          description: category.description,
          isActive: true,
        },
      })
      categoryId = doc.id
      console.log(`Created category: ${category.slug}`)
    }
    categoryMap.set(category.slug, categoryId)
  }

  for (let index = 0; index < products.length; index++) {
    const product = products[index]
    const slug = cleanText(product.slug)
    if (!slug) {
      console.warn(`Skipped product without slug: ${product.sourceUrl}`)
      continue
    }

    const category = normalizeCategory(product.category?.key)
    const categoryId = categoryMap.get(category.slug)
    if (!categoryId) {
      console.warn(`Skipped product due to missing category: ${slug}`)
      continue
    }

    const galleryImageUrls = Array.from(
      new Set(
        (product.galleryImages ?? [])
          .map((item) => cleanText(item))
          .filter(Boolean),
      ),
    )
    const swatches = (product.colorSwatches ?? [])
      .map((item) => ({
        name: cleanText(item.name),
        imageUrl: cleanText(item.imageUrl),
      }))
      .filter((item) => item.name && item.imageUrl)

    if (galleryImageUrls.length === 0 && !cleanText(product.ogImage)) {
      console.warn(`Skipped product due to missing product images: ${slug}`)
      continue
    }

    const galleryMediaIds: Array<number | string> = []
    for (const imageUrl of galleryImageUrls) {
      const mediaId = await getOrCreateMediaId({
        payload,
        mediaCache,
        imageUrl,
        altText: cleanText(product.title) || slug,
      })
      galleryMediaIds.push(mediaId)
    }

    const colorOptions = []
    for (const swatch of swatches) {
      const mediaId = await getOrCreateMediaId({
        payload,
        mediaCache,
        imageUrl: swatch.imageUrl,
        altText: `${cleanText(product.title) || slug} - ${swatch.name}`,
      })
      colorOptions.push({
        name: swatch.name,
        swatchImage: mediaId,
        description: '',
      })
    }
    const featuredMediaId =
      galleryMediaIds[0] ||
      (cleanText(product.ogImage)
        ? await getOrCreateMediaId({
            payload,
            mediaCache,
            imageUrl: cleanText(product.ogImage),
            altText: cleanText(product.title) || slug,
          })
        : undefined)

    if (!featuredMediaId) {
      console.warn(`Skipped product due to unresolved featured image: ${slug}`)
      continue
    }

    const shortDescription = cleanText(product.shortDescription) || cleanText(product.seoDescription)
    const contentText =
      cleanText(product.contentPlain) ||
      shortDescription ||
      'Nội dung sản phẩm đang được cập nhật.'

    const specifications = (product.specifications ?? [])
      .map((item) => ({
        label: cleanText(item.label),
        value: cleanText(item.value),
      }))
      .filter((item) => item.label && item.value)

    const advantages = (product.advantages ?? [])
      .map((item) => cleanText(item))
      .filter(Boolean)
      .map((item) => ({
        title: item,
        description: '',
      }))

    const applications: Array<{ title: string; description: string }> = []

    const payloadData: any = {
      title: cleanText(product.title) || slug,
      slug,
      category: categoryId as any,
      featuredImage: featuredMediaId,
      gallery: galleryMediaIds,
      shortDescription: shortDescription || 'Thông tin sản phẩm đang được cập nhật.',
      content: toLexicalContent(contentText),
      specifications,
      advantages,
      applications,
      colorOptions,
      sizeOptions: [],
      seoTitle: cleanText(product.seoTitle) || cleanText(product.title) || slug,
      seoDescription: cleanText(product.seoDescription) || shortDescription || undefined,
      ogImage: featuredMediaId,
      isFeatured: false,
      status: 'published' as const,
      order: index + 1,
    }

    const existingProduct = await payload.find({
      collection: 'products',
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    if (existingProduct.docs.length > 0) {
      await payload.update({
        collection: 'products',
        id: existingProduct.docs[0].id,
        data: payloadData,
      })
      console.log(`Updated product: ${slug}`)
    } else {
      await payload.create({
        collection: 'products',
        data: payloadData,
      })
      console.log(`Created product: ${slug}`)
    }
  }

  console.log(`Import completed. Processed ${products.length} products.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

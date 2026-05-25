import { notFound } from 'next/navigation'
import Link from 'next/link'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { ProductDetailGallery } from '../../_components/ProductDetailGallery.client'
import {
  ButtonLink,
  ContactCTA,
  ProductCard,
  RichContent,
  Section,
} from '../../_components/website'
import {
  asMedia,
  buildMetadata,
  getProductBySlug,
  getRelatedProductsByCategory,
  getSiteSettings,
  mediaUrl,
  type Product,
} from '../../_lib/cms'

export const revalidate = 300

type Args = {
  params: Promise<{
    slug: string
  }>
}

type ColorSwatch = {
  color: string
  className: string
  image?: NonNullable<ReturnType<typeof asMedia>>
}

const colorTokens: Array<{ keywords: string[]; value: ColorSwatch }> = [
  {
    keywords: ['nau', 'nâu'],
    value: { color: 'Nâu', className: 'bg-gradient-to-br from-[#6a4a2a] to-[#2e2216]' },
  },
  {
    keywords: ['trang', 'trắng'],
    value: { color: 'Trắng', className: 'bg-gradient-to-br from-white to-slate-200' },
  },
  {
    keywords: ['van go', 'vân gỗ', 'go'],
    value: { color: 'Vân gỗ', className: 'bg-gradient-to-br from-[#bb7a33] to-[#754114]' },
  },
  {
    keywords: ['xam', 'xám', 'ghi'],
    value: { color: 'Xám', className: 'bg-gradient-to-br from-[#6e727b] to-[#4b4f57]' },
  },
  {
    keywords: ['den', 'đen'],
    value: { color: 'Đen', className: 'bg-gradient-to-br from-[#2a2e36] to-[#080b11]' },
  },
]
const defaultColorSwatches: ColorSwatch[] = [
  colorTokens[0].value,
  colorTokens[1].value,
  colorTokens[2].value,
  colorTokens[3].value,
  colorTokens[4].value,
]

export async function generateMetadata({ params }: Args) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) return buildMetadata({ title: 'Sản phẩm' })

  return buildMetadata({
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.shortDescription,
    image: product.ogImage || product.featuredImage,
  })
}

export default async function ProductDetailPage({ params }: Args) {
  const { slug } = await params
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSiteSettings()])

  if (!product) notFound()

  const categoryName =
    product.category && typeof product.category === 'object' ? product.category.title : undefined
  const gallery = (product.gallery || [])
    .map((item) => asMedia(item))
    .filter((item): item is NonNullable<ReturnType<typeof asMedia>> => Boolean(item))
  const featuredImage = asMedia(product.featuredImage)
  const galleryImages = dedupeMediaResources([...(featuredImage ? [featuredImage] : []), ...(gallery || [])])
  const catalogueUrl = mediaUrl(product.catalogueFile)
  const relatedProducts =
    product.relatedProducts?.filter(
      (item): item is Product => item !== null && typeof item === 'object' && 'id' in item,
    ) || []
  const sameCategoryProductsRaw = await getRelatedProductsByCategory(product, 8)
  const sameCategoryProducts = uniqueProductsById(sameCategoryProductsRaw).filter(
    (item) => !relatedProducts.some((related) => String(related.id) === String(item.id)),
  )

  const { colorSwatches, featureBullets } = splitProductHighlights(product)
  const visibleColorSwatches = colorSwatches.length > 0 ? colorSwatches : defaultColorSwatches

  return (
    <>
      <section className="relative overflow-hidden bg-[#05244f] py-14 text-white md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.32),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.25),transparent_40%),linear-gradient(135deg,#031530_0%,#0b2f63_60%,#0d3b75_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:repeating-linear-gradient(120deg,transparent_0,transparent_24px,rgba(148,163,184,0.2)_24px,rgba(148,163,184,0.2)_32px)]" />
        <div className="container relative">
          <nav aria-label="Breadcrumb" className="text-sm text-sky-100/90">
            <ol className="flex flex-wrap gap-2">
              <li className="flex items-center gap-2">
                <Link className="hover:text-white" href="/">
                  Trang chủ
                </Link>
                <span>/</span>
              </li>
              <li className="flex items-center gap-2">
                <Link className="hover:text-white" href="/san-pham">
                  Sản phẩm
                </Link>
                <span>/</span>
              </li>
              <li className="text-white">{product.title || 'Chi tiết sản phẩm'}</li>
            </ol>
          </nav>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-sky-200">
            Sản phẩm nhôm hệ
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{product.title}</h1>
        </div>
      </section>

      <section className="bg-[#f3f4f6] py-10 md:py-14">
        <div className="container grid items-start gap-8 lg:grid-cols-[1.05fr_1fr] xl:gap-12">
          <ProductDetailGallery images={galleryImages || []} productTitle={product.title} />

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
              {categoryName || 'Hệ nhôm cao cấp'}
            </p>
            <h2 className="mt-2 text-3xl font-semibold leading-tight text-slate-900 md:text-5xl">
              {product.title}
            </h2>

            <p className="mt-4 text-base text-slate-600">
              <span className="font-semibold text-slate-800">Thương hiệu:</span>{' '}
              <span>XINGFAWINDOW</span>
            </p>

            {product.shortDescription && (
              <p className="mt-4 text-lg leading-8 text-slate-700">{product.shortDescription}</p>
            )}

            {featureBullets.length > 0 && (
              <ul className="mt-6 list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
                {featureBullets.map((item, index) => (
                  <li key={`${item.slice(0, 24)}-${index}`}>{item}</li>
                ))}
              </ul>
            )}

            <div className="mt-7 border-t border-slate-300 pt-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Màu sắc</h3>
              <div className="mt-3 grid grid-cols-5 gap-3 sm:max-w-md">
                {visibleColorSwatches.map((item) => (
                  <div className="text-center" key={item.color}>
                    {item.image ? (
                      <Media
                        alt={item.color}
                        className="relative mx-auto h-12 w-12 overflow-hidden rounded border border-slate-300 bg-white shadow-sm"
                        fill
                        imgClassName="object-cover"
                        resource={item.image as never}
                        size="48px"
                      />
                    ) : (
                      <div
                        className={cn(
                          'mx-auto h-12 w-12 rounded border border-slate-300 shadow-sm',
                          item.className,
                        )}
                      />
                    )}
                    <p className="mt-2 text-sm text-slate-700">{item.color}</p>
                  </div>
                ))}
              </div>
            </div>

            {product.sizeOptions && product.sizeOptions.length > 0 && (
              <div className="mt-6 border-t border-slate-300 pt-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                  Kich co / Quy cach
                </h3>
                <div className="mt-3 grid gap-3 sm:max-w-md">
                  {product.sizeOptions.map((item, index) => {
                    const previewImage = asMedia(item.previewImage)
                    return (
                      <div
                        className="flex items-center gap-3 rounded border border-slate-200 bg-white p-2"
                        key={item.id || `${item.name || 'size'}-${index}`}
                      >
                        {previewImage ? (
                          <Media
                            alt={item.name || 'Kich co'}
                            className="relative h-12 w-12 overflow-hidden rounded bg-white"
                            fill
                            imgClassName="object-contain"
                            resource={previewImage as never}
                            size="48px"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded bg-slate-100" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-800">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-slate-500">{item.description}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/lien-he">Nhận tư vấn</ButtonLink>
              {catalogueUrl && (
                <ButtonLink href={catalogueUrl} variant="secondary">
                  Tải catalogue
                </ButtonLink>
              )}
            </div>
          </div>
        </div>
      </section>

      {product.content && (
        <Section className="border-t border-slate-200">
          <div className="container">
            <h2 className="mb-5 text-2xl font-semibold text-slate-950">Nội dung chi tiết</h2>
            <RichContent content={product.content} />
          </div>
        </Section>
      )}

      {product.specifications && product.specifications.length > 0 && (
        <Section className="bg-slate-50">
          <div className="container">
            <h2 className="mb-5 text-2xl font-semibold text-slate-950">Thông số kỹ thuật</h2>
            <dl className="overflow-hidden rounded-md border border-slate-200 bg-white">
              {product.specifications.map((item, index) => (
                <div
                  className="grid grid-cols-1 border-b border-slate-200 last:border-b-0 sm:grid-cols-2"
                  key={item.id || index}
                >
                  <dt className="bg-slate-50 p-3 text-sm font-semibold text-slate-800">{item.label}</dt>
                  <dd className="p-3 text-sm text-slate-600">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Section>
      )}

      {relatedProducts.length > 0 && (
        <Section>
          <div className="container">
            <h2 className="mb-10 text-center text-4xl font-semibold tracking-tight text-slate-900">
              Sản phẩm khác
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {sameCategoryProducts.length > 0 && (
        <Section className="bg-slate-50">
          <div className="container">
            <h2 className="mb-10 text-center text-4xl font-semibold tracking-tight text-slate-900">
              Sản phẩm cùng danh mục
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {sameCategoryProducts.map((sameCategoryProduct) => (
                <ProductCard key={sameCategoryProduct.id} product={sameCategoryProduct} />
              ))}
            </div>
          </div>
        </Section>
      )}

      <ContactCTA settings={settings} />
    </>
  )
}

function splitProductHighlights(
  product: Product,
): {
  colorSwatches: ColorSwatch[]
  featureBullets: string[]
} {
  const colors = new Map<string, ColorSwatch>()
  const featureBullets: string[] = []

  for (const item of product.colorOptions || []) {
    const name = (item.name || '').trim()
    if (!name) continue
    const detected = detectColorFromText(`${name} ${(item.description || '').trim()}`)
    const image = asMedia(item.swatchImage)
    const swatch: ColorSwatch = {
      color: name,
      className: detected?.className || 'bg-gradient-to-br from-slate-200 to-slate-300',
      image: image || undefined,
    }
    colors.set(normalizeText(name), swatch)
  }

  for (const item of product.advantages || []) {
    const title = (item.title || '').trim()
    const description = (item.description || '').trim()

    if (title) {
      if (isColorLabel(title)) {
        collectColors(title, colors)
      } else {
        featureBullets.push(title)
      }
    }

    if (description) {
      if (isColorLabel(description)) {
        collectColors(description, colors)
      } else {
        featureBullets.push(description)
      }
    }
  }

  for (const item of product.specifications || []) {
    const label = (item.label || '').trim()
    const value = (item.value || '').trim()

    if (label && isColorLabel(label)) {
      collectColors(value, colors)
    }
  }

  return {
    colorSwatches: Array.from(colors.values()),
    featureBullets: uniqueByText(featureBullets),
  }
}

function collectColors(text: string, colors: Map<string, ColorSwatch>) {
  const normalized = normalizeText(text)

  for (const token of colorTokens) {
    if (token.keywords.some((keyword) => normalized.includes(normalizeText(keyword)))) {
      const key = normalizeText(token.value.color)
      if (!colors.has(key)) {
        colors.set(key, token.value)
      }
    }
  }
}

function detectColorFromText(text: string) {
  const normalized = normalizeText(text)
  for (const token of colorTokens) {
    if (token.keywords.some((keyword) => normalized.includes(normalizeText(keyword)))) {
      return token.value
    }
  }
  return null
}

function isColorLabel(text: string) {
  const normalized = normalizeText(text)
  return (
    normalized.includes('mau') ||
    colorTokens.some((token) => token.keywords.some((keyword) => normalized.includes(normalizeText(keyword))))
  )
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function uniqueByText(items: string[]) {
  const seen = new Set<string>()
  const output: string[] = []

  for (const item of items) {
    const key = normalizeText(item)
    if (!key || seen.has(key)) continue
    seen.add(key)
    output.push(item)
  }

  return output
}

function dedupeMediaResources(
  items: Array<ReturnType<typeof asMedia> | null | undefined>,
): NonNullable<ReturnType<typeof asMedia>>[] {
  const seen = new Set<string>()
  const output: NonNullable<ReturnType<typeof asMedia>>[] = []

  for (const item of items) {
    if (!item || typeof item !== 'object' || typeof item.url !== 'string') continue

    const key = item.id ? `id:${String(item.id)}` : `url:${item.url}`
    if (seen.has(key)) continue

    seen.add(key)
    output.push(item)
  }

  return output
}

function uniqueProductsById(items: Product[]) {
  const seen = new Set<string>()
  const output: Product[] = []

  for (const item of items) {
    const key = String(item.id)
    if (seen.has(key)) continue

    seen.add(key)
    output.push(item)
  }

  return output
}

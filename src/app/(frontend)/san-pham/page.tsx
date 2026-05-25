import Link from 'next/link'

import { cn } from '@/utilities/ui'
import { asMedia, buildMetadata, getProductCategories, getProducts, mediaUrl } from '../_lib/cms'
import { ProductCardHome } from '../_components/ProductCardHome.client'
import { EmptyState, PageHeader, Section } from '../_components/website'

export const revalidate = 300

export const generateMetadata = () =>
  buildMetadata({
    title: 'Sản phẩm',
    description: 'Danh sách sản phẩm nhôm kính, cửa nhôm và hệ nhôm cho công trình.',
  })

type Args = {
  searchParams: Promise<{
    category?: string
  }>
}

export default async function ProductsPage({ searchParams }: Args) {
  const { category } = await searchParams
  const [categories, products] = await Promise.all([getProductCategories(), getProducts()])

  const selectedCategorySlug = category ? decodeURIComponent(category) : ''
  const hasSelectedCategory = categories.some((item) => item.slug === selectedCategorySlug)
  const visibleProducts =
    hasSelectedCategory && selectedCategorySlug
      ? products.filter(
          (product) =>
            product.category &&
            typeof product.category === 'object' &&
            'slug' in product.category &&
            product.category.slug === selectedCategorySlug,
        )
      : products

  return (
    <>
      <PageHeader
        description="Khám phá các hệ sản phẩm nhôm kính được quản lý và cập nhật trực tiếp từ CMS."
        title="Sản phẩm"
      />
      <Section>
        <div className="container">
          <h2 className="mb-4 text-2xl font-semibold text-slate-950">Danh mục sản phẩm</h2>
          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              <Link
                className={cn(
                  'rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                  !selectedCategorySlug
                    ? 'border-sky-900 bg-sky-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100',
                )}
                href="/san-pham"
              >
                Tất cả
              </Link>

              {categories.map((item) => (
                <Link
                  className={cn(
                    'rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                    selectedCategorySlug === item.slug
                      ? 'border-sky-900 bg-sky-900 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100',
                  )}
                  href={item.slug ? `/san-pham?category=${encodeURIComponent(item.slug)}` : '/san-pham'}
                  key={item.id}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-5 text-slate-600">
              Chưa có danh mục sản phẩm đang hiển thị.
            </div>
          )}
        </div>
      </Section>
      <Section className="pt-0">
        {visibleProducts.length > 0 ? (
          <div className="container grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCardHome
                key={product.id}
                product={{
                  href: product.slug ? `/san-pham/${product.slug}` : '/san-pham',
                  title: product.title || 'Sản phẩm',
                  description: product.shortDescription,
                  imageAlt: asMedia(product.featuredImage)?.alt || product.title || '',
                  imageUrl: mediaUrl(product.featuredImage) || undefined,
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState>Chưa có sản phẩm thuộc danh mục này.</EmptyState>
        )}
      </Section>
    </>
  )
}

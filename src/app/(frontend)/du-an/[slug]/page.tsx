import { notFound } from 'next/navigation'

import { buildMetadata, getProjectBySlug, getSiteSettings, type Product } from '../../_lib/cms'
import {
  Breadcrumbs,
  CMSImage,
  ContactCTA,
  ProductCard,
  RichContent,
  Section,
} from '../../_components/website'

export const revalidate = 300

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Args) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) return buildMetadata({ title: 'Dự án' })

  return buildMetadata({
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.shortDescription,
    image: project.ogImage || project.featuredImage,
  })
}

export default async function ProjectDetailPage({ params }: Args) {
  const { slug } = await params
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSiteSettings()])

  if (!project) notFound()

  const gallery = project.gallery?.filter((item) => item && typeof item === 'object') || []
  const usedProducts =
    project.usedProducts?.filter(
      (item): item is Product => item !== null && typeof item === 'object' && 'id' in item,
    ) || []

  return (
    <>
      <Section>
        <div className="container">
          <Breadcrumbs
            items={[
              { href: '/', label: 'Trang chủ' },
              { href: '/du-an', label: 'Dự án' },
              { label: project.title || 'Chi tiết dự án' },
            ]}
          />
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <CMSImage alt={project.title || ''} aspect="aspect-[4/3]" priority resource={project.featuredImage} />
            <div>
              <h1 className="text-4xl font-semibold tracking-normal text-slate-950 md:text-5xl">
                {project.title}
              </h1>
              <dl className="mt-6 grid gap-4 text-sm">
                {project.location && (
                  <div>
                    <dt className="font-semibold text-slate-950">Địa điểm</dt>
                    <dd className="mt-1 text-slate-600">{project.location}</dd>
                  </div>
                )}
                {project.clientName && (
                  <div>
                    <dt className="font-semibold text-slate-950">Khách hàng</dt>
                    <dd className="mt-1 text-slate-600">{project.clientName}</dd>
                  </div>
                )}
                {project.completedYear && (
                  <div>
                    <dt className="font-semibold text-slate-950">Năm hoàn thành</dt>
                    <dd className="mt-1 text-slate-600">{project.completedYear}</dd>
                  </div>
                )}
              </dl>
              {project.shortDescription && (
                <p className="mt-6 text-lg leading-8 text-slate-600">{project.shortDescription}</p>
              )}
            </div>
          </div>
          {gallery.length > 0 && (
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {gallery.map((image, index) => (
                <CMSImage
                  alt={`${project.title || 'Dự án'} ${index + 1}`}
                  key={`${project.id}-gallery-${index}`}
                  resource={image}
                />
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section className="border-t border-slate-200">
        <div className="container max-w-4xl">
          <h2 className="mb-5 text-2xl font-semibold text-slate-950">Nội dung dự án</h2>
          <RichContent content={project.content} />
        </div>
      </Section>

      {usedProducts.length > 0 && (
        <Section className="bg-slate-50">
          <div className="container mb-8">
            <h2 className="text-2xl font-semibold text-slate-950">Sản phẩm đã sử dụng</h2>
          </div>
          <div className="container grid gap-6 md:grid-cols-3">
            {usedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Section>
      )}

      <ContactCTA settings={settings} />
    </>
  )
}

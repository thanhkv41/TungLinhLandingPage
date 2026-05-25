import {
  Play,
  Plus,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import {
  asMedia,
  mediaUrl,
  type Banner,
  type Category,
  type Certificate,
  type MediaResource,
  type Post,
  type Product,
  type Project,
  type Relationship,
  type SiteSettings,
} from '../_lib/cms'
import { HomeHeroSlider, type HomeHeroSlide } from './HomeHeroSlider.client'
import { ProductShowcase, type ProductShowcaseItem } from './ProductShowcase.client'
import { ScrollReveal } from './ScrollReveal.client'

type HomeLandingProps = {
  banners: Banner[]
  certificates: Certificate[]
  posts: Post[]
  productCategories: Category[]
  products: Product[]
  projects: Project[]
  settings?: SiteSettings | null
}

type ImageData = {
  alt: string
  src?: string
}

export function HomeLanding({
  banners,
  certificates,
  posts,
  productCategories,
  products,
  projects,
  settings,
}: HomeLandingProps) {
  const productTabs = buildProductTabs(productCategories, products)
  const productItems = products.map(toProductShowcaseItem)

  return (
    <main className="bg-white text-slate-950">
      <HomeHero banners={banners} settings={settings} />
      <HomeAbout banner={banners[0]} settings={settings} />
      <ProductShowcase products={productItems} tabs={productTabs} />
      <CertificatesSection certificates={certificates} />
      <ProjectsSection projects={projects} />
      <NewsSection posts={posts} />
    </main>
  )
}

function HomeHero({ banners, settings }: { banners: Banner[]; settings?: SiteSettings | null }) {
  const fallbackTitle = settings?.siteName || 'Tùng Linh'
  const slides: HomeHeroSlide[] =
    banners.length > 0
      ? banners.map((banner) => {
          const image = getImageData(banner.image)
          return {
            alt: image.alt || banner.title || fallbackTitle,
            src: image.src,
          }
        })
      : [{ alt: fallbackTitle }]
  return (
    <section className="relative min-h-[680px] overflow-hidden bg-slate-950 text-white md:min-h-[740px]">
      <HomeHeroSlider slides={slides} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/10 to-slate-950/20" />
    </section>
  )
}

function HomeAbout({ banner, settings }: { banner?: Banner; settings?: SiteSettings | null }) {
  const title = settings?.siteName || 'Tùng Linh'
  const description =
    settings?.defaultSeoDescription ||
    'Thông tin giới thiệu doanh nghiệp đang được cập nhật trong CMS.'
  const image = getImageData(banner?.image || settings?.defaultOgImage)

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-4 md:grid-cols-[1fr_0.95fr] md:items-center">
        <ScrollReveal>
          <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-slate-950 md:text-4xl">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
            {description}
          </p>
          <Link
            className="mt-7 inline-flex items-center gap-3 text-sm font-extrabold uppercase text-[#e51e31]"
            href="/gioi-thieu"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e51e31] text-white">
              <Plus className="h-4 w-4" />
            </span>
            Xem thêm
          </Link>
        </ScrollReveal>

        <ScrollReveal className="group relative overflow-hidden rounded-sm shadow-xl" delay={120}>
          {image.src ? (
            <Image
              alt={image.alt || title}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              height={520}
              src={image.src}
              width={900}
            />
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center bg-slate-100 px-6 text-center text-sm text-slate-500">
              Hình ảnh giới thiệu đang được cập nhật trong CMS.
            </div>
          )}
          <button
            aria-label="Xem video giới thiệu"
            className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#e51e31] text-white shadow-2xl transition-transform duration-300 group-hover:scale-110"
            type="button"
          >
            <Play className="ml-1 h-7 w-7 fill-current" />
          </button>
        </ScrollReveal>
      </div>
    </section>
  )
}

function CertificatesSection({ certificates }: { certificates: Certificate[] }) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1180px] px-4">
        <ScrollReveal>
          <h2 className="text-center text-3xl font-black uppercase text-slate-950 md:text-4xl">
            Chứng chỉ chất lượng
          </h2>
        </ScrollReveal>
        {certificates.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {certificates.map((certificate, index) => {
              const image = getImageData(certificate.image)

              return (
                <ScrollReveal delay={index * 70} key={certificate.id}>
                  <article className="group text-center">
                    <div className="overflow-hidden rounded-sm bg-slate-50 p-3 shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
                      {image.src ? (
                        <Image
                          alt={image.alt || certificate.title || ''}
                          className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
                          height={560}
                          src={image.src}
                          width={420}
                        />
                      ) : (
                        <div className="flex aspect-[3/4] items-center justify-center bg-slate-100 text-sm text-slate-500">
                          Chưa có hình ảnh
                        </div>
                      )}
                    </div>
                    <h3 className="mt-4 text-xs font-extrabold uppercase leading-5 text-slate-900">
                      {certificate.title}
                    </h3>
                  </article>
                </ScrollReveal>
              )
            })}
          </div>
        ) : (
          <ScrollReveal className="mt-10 rounded-sm border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600">
            Chứng chỉ đang được cập nhật trong CMS.
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}

function ProjectsSection({ projects }: { projects: Project[] }) {
  const leftProjects = projects.slice(0, 3)
  const rightProjects = projects.slice(3, 5)

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1180px] px-4">
        <ScrollReveal>
          <h2 className="text-center text-3xl font-black uppercase text-slate-950 md:text-4xl">Dự án</h2>
        </ScrollReveal>
        {projects.length > 0 ? (
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="grid gap-5 sm:grid-cols-2">
              {leftProjects.map((project, index) => (
                <ScrollReveal
                  className={index === 2 ? 'sm:col-span-2' : undefined}
                  delay={index * 80}
                  key={project.id}
                >
                  <ProjectTile project={project} tall={index === 2} />
                </ScrollReveal>
              ))}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {rightProjects.map((project, index) => (
                <ScrollReveal
                  className={index === 0 ? 'sm:col-span-2' : undefined}
                  delay={120 + index * 80}
                  key={project.id}
                >
                  <ProjectTile project={project} tall={index === 0} />
                </ScrollReveal>
              ))}
              <ScrollReveal delay={280}>
                <Link
                  className="grid min-h-52 cursor-pointer place-items-center rounded-sm bg-[#e51e31] text-center text-sm font-extrabold uppercase text-white transition-colors hover:bg-[#c91525]"
                  href="/du-an"
                >
                  <span>
                    <Plus className="mx-auto mb-4 h-12 w-12 stroke-[1.5]" />
                    Tất cả
                  </span>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        ) : (
          <ScrollReveal className="mt-10 rounded-sm border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600">
            Dự án đang được cập nhật trong CMS.
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}

function ProjectTile({ project, tall = false }: { project: Project; tall?: boolean }) {
  const image = getImageData(project.featuredImage)
  const tag = getCategoryTitle(project.category) || project.location || 'Dự án'
  const href = project.slug ? `/du-an/${project.slug}` : '/du-an'

  return (
    <Link
      aria-label={`Xem dự án ${project.title}`}
      className={`group relative block cursor-pointer overflow-hidden rounded-sm bg-slate-100 ${tall ? 'min-h-[360px]' : 'min-h-[210px]'}`}
      href={href}
    >
      {image.src ? (
        <Image
          alt={image.alt || project.title || ''}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          src={image.src}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center px-5 text-center text-sm text-slate-500">
          Chưa có hình ảnh
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/10 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5">
        <span className="inline-flex rounded-sm bg-[#e51e31] px-3 py-1 text-xs font-bold text-white">
          {tag}
        </span>
        <h3 className="mt-3 text-lg font-extrabold text-white">{project.title}</h3>
      </div>
    </Link>
  )
}

function NewsSection({ posts }: { posts: Post[] }) {
  const featuredPost = posts[0]
  const featuredImage = getImageData(featuredPost?.featuredImage)
  const sidePosts = posts.slice(1, 5)

  return (
    <section className="bg-[#eef7fa] py-16 md:py-20">
      <div className="mx-auto max-w-[1180px] px-4">
        <ScrollReveal>
          <h2 className="text-center text-3xl font-black uppercase text-slate-950 md:text-4xl">
            Tin tức sự kiện
          </h2>
        </ScrollReveal>
        {featuredPost ? (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <ScrollReveal className="group relative overflow-hidden rounded-sm shadow-lg" delay={100}>
              <Link className="block cursor-pointer" href={featuredPost.slug ? `/tin-tuc/${featuredPost.slug}` : '/tin-tuc'}>
                {featuredImage.src ? (
                  <Image
                    alt={featuredImage.alt || featuredPost.title || ''}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    height={520}
                    src={featuredImage.src}
                    width={900}
                  />
                ) : (
                  <div className="flex aspect-[16/9] items-center justify-center bg-white px-6 text-center text-sm text-slate-500">
                    Chưa có hình ảnh
                  </div>
                )}
                <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#e51e31] text-white shadow-xl">
                  <Play className="ml-1 h-6 w-6 fill-current" />
                </span>
              </Link>
            </ScrollReveal>
            <div className="grid gap-4">
              {sidePosts.map((post, index) => {
                const image = getImageData(post.featuredImage)

                return (
                  <ScrollReveal delay={160 + index * 65} key={post.id}>
                    <Link
                      className="grid cursor-pointer grid-cols-[116px_1fr] gap-4 rounded-sm transition-colors hover:bg-white/70"
                      href={post.slug ? `/tin-tuc/${post.slug}` : '/tin-tuc'}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-slate-200">
                        {image.src ? (
                          <Image alt={image.alt || post.title || ''} className="object-cover" fill sizes="116px" src={image.src} />
                        ) : (
                          <div className="flex h-full items-center justify-center px-3 text-center text-xs text-slate-500">
                            Chưa có ảnh
                          </div>
                        )}
                      </div>
                      <div>
                        {post.publishedAt && (
                          <p className="text-xs font-semibold text-[#e51e31]">{formatDate(post.publishedAt)}</p>
                        )}
                        <h3 className="mt-1 line-clamp-2 text-sm font-extrabold leading-5 text-slate-950">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  </ScrollReveal>
                )
              })}
              <ScrollReveal delay={420}>
                <Link className="mt-3 inline-flex text-sm font-extrabold uppercase text-[#e51e31]" href="/tin-tuc">
                  Xem thêm tin tức
                </Link>
              </ScrollReveal>
            </div>
          </div>
        ) : (
          <ScrollReveal className="mt-10 rounded-sm border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">
            Tin tức đang được cập nhật trong CMS.
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}

export function FooterContact({ settings }: { settings?: SiteSettings | null }) {
  return (
    <section className="relative overflow-hidden bg-white py-12">
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:radial-gradient(rgba(15,23,42,.12)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="relative mx-auto grid max-w-[1180px] gap-10 px-4 md:grid-cols-2">
        <div>
          <LogoMark dark />
          <h2 className="mt-4 text-lg font-black uppercase text-slate-950">
            {settings?.siteName || 'Tùng Linh'}
          </h2>
          <div className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
            {settings?.address && <p>{settings.address}</p>}
            {settings?.hotline && <p>Hotline: {settings.hotline}</p>}
            {settings?.email && <p>Email: {settings.email}</p>}
          </div>
        </div>
        <div className="md:text-right">
          <h3 className="font-extrabold uppercase text-slate-950">Văn phòng / showroom</h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {settings?.showroomAddress || settings?.factoryAddress || 'Đang cập nhật trong CMS.'}
          </p>
          <div className="mt-5 flex gap-3 md:justify-end">
            {[
              { href: settings?.facebookUrl, label: 'f' },
              { href: settings?.zaloUrl, label: 'z' },
              { href: settings?.youtubeUrl, label: 'yt' },
            ].map((item) =>
              item.href ? (
                <Link
                  className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-xs font-bold text-slate-700"
                  href={item.href}
                  key={item.label}
                  target="_blank"
                >
                  {item.label}
                </Link>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function LogoMark({ dark = false }: { dark?: boolean }) {
  return (
    <Link className="inline-flex items-center gap-3" href="/">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e51e31] text-sm font-black text-white">
        TL
      </span>
      <span className={`text-lg font-black uppercase ${dark ? 'text-slate-950' : 'text-white'}`}>
        Tùng Linh
      </span>
    </Link>
  )
}

function getImageData(resource: Relationship<MediaResource>): ImageData {
  const media = asMedia(resource)
  const src = mediaUrl(resource)

  return {
    alt: media?.alt || '',
    src: src || undefined,
  }
}

function getCategoryTitle(category: Product['category'] | Project['category']) {
  return category && typeof category === 'object' && 'title' in category
    ? category.title || undefined
    : undefined
}

function buildProductTabs(categories: Category[], products: Product[]) {
  const categoryTitles = categories.map((category) => category.title).filter(Boolean) as string[]
  const productCategoryTitles = products
    .map((product) => getCategoryTitle(product.category))
    .filter(Boolean) as string[]

  return Array.from(new Set([...categoryTitles, ...productCategoryTitles]))
}

function toProductShowcaseItem(product: Product): ProductShowcaseItem {
  const image = getImageData(product.featuredImage)

  return {
    categoryTitle: getCategoryTitle(product.category),
    description: product.shortDescription,
    href: product.slug ? `/san-pham/${product.slug}` : '/san-pham',
    id: String(product.id),
    imageAlt: image.alt,
    imageUrl: image.src,
    title: product.title || 'Sản phẩm chưa có tên',
  }
}

function formatDate(date?: string | null) {
  if (!date) return ''

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

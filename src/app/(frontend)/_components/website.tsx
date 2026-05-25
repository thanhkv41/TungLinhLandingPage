import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import {
  asMedia,
  mediaUrl,
  type Certificate,
  type DocumentItem,
  type MediaResource,
  type Post,
  type Product,
  type Project,
  type Relationship,
  type SiteSettings,
} from '../_lib/cms'

export function ButtonLink({
  children,
  className,
  href,
  variant = 'primary',
}: {
  children: React.ReactNode
  className?: string
  href: string
  variant?: 'primary' | 'secondary' | 'ghost'
}) {
  return (
    <Link
      className={cn(
        'inline-flex min-h-11 items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition-colors',
        variant === 'primary' && 'bg-sky-900 text-white hover:bg-sky-800',
        variant === 'secondary' && 'border border-slate-300 bg-white text-slate-950 hover:bg-slate-50',
        variant === 'ghost' && 'text-sky-900 hover:text-sky-700',
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  )
}

export function Section({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <section className={cn('bg-white py-12 md:py-16', className)}>{children}</section>
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="container mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-sm font-semibold uppercase text-sky-800">{eyebrow}</p>}
        <h2 className="text-3xl font-semibold tracking-normal text-slate-950 md:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function PageHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-12 md:py-16">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-normal text-slate-950 md:text-5xl">{title}</h1>
        {description && <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>}
      </div>
    </section>
  )
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-slate-600">
        {children}
      </div>
    </div>
  )
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
      <ol className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <li className="flex items-center gap-2" key={`${item.label}-${index}`}>
            {item.href ? (
              <Link className="hover:text-sky-800" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-800">{item.label}</span>
            )}
            {index < items.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function CMSImage({
  alt,
  aspect = 'aspect-[4/3]',
  className,
  fit = 'cover',
  priority,
  resource,
}: {
  alt?: string
  aspect?: string
  className?: string
  fit?: 'cover' | 'contain'
  priority?: boolean
  resource?: Relationship<MediaResource>
}) {
  const media = asMedia(resource)

  if (!media) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-sm text-slate-500',
          aspect,
          className,
        )}
      >
        Chưa có hình ảnh
      </div>
    )
  }

  return (
    <Media
      alt={alt || media.alt || ''}
      className={cn('relative block overflow-hidden rounded-md bg-slate-100', aspect, className)}
      fill
      imgClassName={fit === 'contain' ? 'object-contain' : 'object-cover'}
      priority={priority}
      resource={media as never}
      size="(max-width: 768px) 100vw, 50vw"
    />
  )
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CMSImage
        alt={product.title || ''}
        resource={product.featuredImage}
        fit="contain"
        className="bg-white p-2"
      />
      <div className="p-5">
        <h3 className="text-xl font-semibold text-slate-950">{product.title}</h3>
        {product.shortDescription && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
            {product.shortDescription}
          </p>
        )}
        {product.slug && (
          <ButtonLink className="mt-5" href={`/san-pham/${product.slug}`} variant="secondary">
            Xem chi tiết
          </ButtonLink>
        )}
      </div>
    </article>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CMSImage alt={project.title || ''} resource={project.featuredImage} />
      <div className="p-5">
        <h3 className="text-xl font-semibold text-slate-950">{project.title}</h3>
        {project.location && <p className="mt-2 text-sm font-medium text-sky-900">{project.location}</p>}
        {project.shortDescription && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
            {project.shortDescription}
          </p>
        )}
        {project.slug && (
          <ButtonLink className="mt-5" href={`/du-an/${project.slug}`} variant="secondary">
            Xem dự án
          </ButtonLink>
        )}
      </div>
    </article>
  )
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CMSImage alt={post.title || ''} resource={post.featuredImage} />
      <div className="p-5">
        {post.publishedAt && (
          <p className="mb-2 text-sm text-slate-500">{formatDate(post.publishedAt)}</p>
        )}
        <h3 className="text-xl font-semibold text-slate-950">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>}
        {post.slug && (
          <ButtonLink className="mt-5" href={`/tin-tuc/${post.slug}`} variant="secondary">
            Đọc tiếp
          </ButtonLink>
        )}
      </div>
    </article>
  )
}

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-4">
      <CMSImage alt={certificate.title || ''} aspect="aspect-[3/4]" resource={certificate.image} />
      <h3 className="mt-4 font-semibold text-slate-950">{certificate.title}</h3>
      {certificate.description && <p className="mt-2 text-sm leading-6 text-slate-600">{certificate.description}</p>}
    </article>
  )
}

export function DocumentCard({ document }: { document: DocumentItem }) {
  const fileUrl = mediaUrl(document.file)

  return (
    <article className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">{document.title}</h2>
      {document.description && <p className="mt-2 text-sm leading-6 text-slate-600">{document.description}</p>}
      {fileUrl ? (
        <ButtonLink className="mt-5" href={fileUrl} variant="primary">
          Tải catalogue
        </ButtonLink>
      ) : (
        <p className="mt-5 text-sm text-slate-500">Chưa có file tải về.</p>
      )}
    </article>
  )
}

export function RichContent({ content }: { content?: unknown }) {
  if (!content || typeof content !== 'object') {
    return <p className="text-slate-600">Nội dung đang được cập nhật.</p>
  }

  return (
    <RichText
      className="prose-slate max-w-none text-slate-700"
      data={content as never}
      enableGutter={false}
    />
  )
}

export function ContactCTA({ settings }: { settings?: SiteSettings | null }) {
  return (
    <section className="bg-sky-950 py-12 text-white md:py-16">
      <div className="container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-sky-200">Tư vấn kỹ thuật</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal">Cần báo giá cho công trình?</h2>
          <p className="mt-3 max-w-2xl text-sky-100">
            Gửi thông tin dự án để đội ngũ kỹ thuật tư vấn hệ nhôm kính phù hợp.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {settings?.hotline && (
            <ButtonLink className="bg-white text-sky-950 hover:bg-slate-100" href={`tel:${settings.hotline}`}>
              Gọi {settings.hotline}
            </ButtonLink>
          )}
          <ButtonLink
            className="border-white bg-transparent text-white hover:bg-white/10"
            href="/lien-he"
            variant="secondary"
          >
            Nhận tư vấn
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

export function formatDate(date?: string | null) {
  if (!date) return ''

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

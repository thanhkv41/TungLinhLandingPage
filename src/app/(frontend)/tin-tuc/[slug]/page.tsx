import { notFound } from 'next/navigation'

import { buildMetadata, getPostBySlug, getRelatedPosts } from '../../_lib/cms'
import { Breadcrumbs, CMSImage, PostCard, RichContent, Section, formatDate } from '../../_components/website'

export const revalidate = 300

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Args) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return buildMetadata({ title: 'Tin tức' })

  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    image: post.ogImage || post.featuredImage,
  })
}

export default async function PostDetailPage({ params }: Args) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const relatedPosts = await getRelatedPosts(post, 3)

  return (
    <>
      <Section>
        <article className="container max-w-4xl">
          <Breadcrumbs
            items={[
              { href: '/', label: 'Trang chủ' },
              { href: '/tin-tuc', label: 'Tin tức' },
              { label: post.title || 'Chi tiết bài viết' },
            ]}
          />
          {post.publishedAt && <p className="mb-3 text-sm text-slate-500">{formatDate(post.publishedAt)}</p>}
          <h1 className="text-4xl font-semibold tracking-normal text-slate-950 md:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mt-5 text-lg leading-8 text-slate-600">{post.excerpt}</p>}
          <CMSImage
            alt={post.title || ''}
            aspect="aspect-[16/9]"
            className="mt-8"
            priority
            resource={post.featuredImage}
          />
          <div className="mt-10">
            <RichContent content={post.content} />
          </div>
        </article>
      </Section>

      {relatedPosts.length > 0 && (
        <Section className="bg-slate-50">
          <div className="container mb-8">
            <h2 className="text-2xl font-semibold text-slate-950">Bài viết liên quan</h2>
          </div>
          <div className="container grid gap-6 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

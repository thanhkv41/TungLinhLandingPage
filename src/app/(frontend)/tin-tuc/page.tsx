import { buildMetadata, getPosts } from '../_lib/cms'
import { EmptyState, PageHeader, PostCard, Section } from '../_components/website'

export const revalidate = 300

export const generateMetadata = () =>
  buildMetadata({
    title: 'Tin tức',
    description: 'Tin tức và bài viết về nhôm kính, cửa nhôm và công trình.',
  })

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <>
      <PageHeader
        description="Cập nhật thông tin sản phẩm, kỹ thuật và các hoạt động công trình."
        title="Tin tức"
      />
      <Section>
        {posts.length > 0 ? (
          <div className="container grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState>Chưa có bài viết được xuất bản.</EmptyState>
        )}
      </Section>
    </>
  )
}

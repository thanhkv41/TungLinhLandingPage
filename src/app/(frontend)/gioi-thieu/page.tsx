import { RenderBlocks } from '@/blocks/RenderBlocks'

import { buildMetadata, getPageBySlug, getSiteSettings } from '../_lib/cms'
import { ButtonLink, EmptyState, PageHeader, Section } from '../_components/website'

export const revalidate = 300

export const generateMetadata = () =>
  buildMetadata({
    title: 'Giới thiệu',
    description: 'Giới thiệu công ty nhôm kính và năng lực thi công công trình.',
  })

export default async function AboutPage() {
  const [page, settings] = await Promise.all([getPageBySlug('gioi-thieu'), getSiteSettings()])

  return (
    <>
      <PageHeader
        description="Thông tin tổng quan về doanh nghiệp, năng lực sản xuất và định hướng phục vụ công trình."
        title="Giới thiệu"
      />
      {page?.layout && Array.isArray(page.layout) && page.layout.length > 0 ? (
        <Section>
          <RenderBlocks blocks={page.layout as never} />
        </Section>
      ) : (
        <Section>
          <div className="container grid gap-8 md:grid-cols-[1fr_360px]">
            <div>
              <h2 className="text-3xl font-semibold text-slate-950">
                {settings?.siteName || 'Công ty nhôm kính chuyên phục vụ công trình'}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Nội dung giới thiệu chi tiết đang được cập nhật trong CMS. Bạn có thể tạo trang
                `gioi-thieu` trong Pages để quản trị nội dung phần này.
              </p>
              <ButtonLink className="mt-6" href="/lien-he">
                Nhận tư vấn
              </ButtonLink>
            </div>
            <EmptyState>Chưa có nội dung giới thiệu từ CMS.</EmptyState>
          </div>
        </Section>
      )}
    </>
  )
}

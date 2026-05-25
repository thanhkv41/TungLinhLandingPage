import { buildMetadata, getDocuments } from '../_lib/cms'
import { DocumentCard, EmptyState, PageHeader, Section } from '../_components/website'

export const revalidate = 300

export const generateMetadata = () =>
  buildMetadata({
    title: 'Tài liệu tải về',
    description: 'Catalogue, hồ sơ năng lực và tài liệu kỹ thuật.',
  })

export default async function DocumentsPage() {
  const documents = await getDocuments()

  return (
    <>
      <PageHeader
        description="Tải catalogue, hồ sơ năng lực và tài liệu kỹ thuật đang được công bố."
        title="Tài liệu tải về"
      />
      <Section>
        {documents.length > 0 ? (
          <div className="container grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => (
              <DocumentCard document={document} key={document.id} />
            ))}
          </div>
        ) : (
          <EmptyState>Chưa có tài liệu đang hiển thị.</EmptyState>
        )}
      </Section>
    </>
  )
}

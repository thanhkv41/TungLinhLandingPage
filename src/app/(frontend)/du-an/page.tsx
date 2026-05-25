import { buildMetadata, getProjects } from '../_lib/cms'
import { EmptyState, PageHeader, ProjectCard, Section } from '../_components/website'

export const revalidate = 300

export const generateMetadata = () =>
  buildMetadata({
    title: 'Dự án',
    description: 'Các dự án nhôm kính và công trình tiêu biểu.',
  })

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <>
      <PageHeader
        description="Danh sách dự án được xuất bản từ CMS, gồm hình ảnh, địa điểm và thông tin công trình."
        title="Dự án"
      />
      <Section>
        {projects.length > 0 ? (
          <div className="container grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState>Chưa có dự án được xuất bản.</EmptyState>
        )}
      </Section>
    </>
  )
}

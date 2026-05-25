import { permanentRedirect } from 'next/navigation'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function LegacyPostPage({ params }: Args) {
  const { slug = '' } = await params

  permanentRedirect(slug ? `/tin-tuc/${slug}` : '/tin-tuc')
}

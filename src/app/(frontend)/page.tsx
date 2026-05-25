import type { Metadata } from 'next'

import { HomeLanding } from './_components/HomeLanding'
import {
  buildMetadata,
  getActiveBanners,
  getCertificates,
  getFeaturedProducts,
  getFeaturedProjects,
  getPosts,
  getProductCategories,
  getProducts,
  getProjects,
  getSiteSettings,
} from './_lib/cms'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return buildMetadata({
    description: settings?.defaultSeoDescription,
    image: settings?.defaultOgImage,
    title: settings?.defaultSeoTitle || settings?.siteName,
  })
}

export default async function HomePage() {
  const [
    settings,
    banners,
    productCategories,
    featuredProducts,
    latestProducts,
    featuredProjects,
    latestProjects,
    certificates,
    posts,
  ] = await Promise.all([
    getSiteSettings(),
    getActiveBanners(5),
    getProductCategories(),
    getFeaturedProducts(8),
    getProducts(8),
    getFeaturedProjects(5),
    getProjects(5),
    getCertificates(4),
    getPosts(5),
  ])

  return (
    <HomeLanding
      banners={banners}
      certificates={certificates}
      posts={posts}
      productCategories={productCategories}
      products={featuredProducts.length > 0 ? featuredProducts : latestProducts}
      projects={featuredProjects.length > 0 ? featuredProjects : latestProjects}
      settings={settings}
    />
  )
}

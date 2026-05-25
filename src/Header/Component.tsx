import { asMedia, getProductCategories, mediaUrl, type SiteSettings } from '@/app/(frontend)/_lib/cms'

import { HeaderClient } from './Component.client'

export async function Header({ settings }: { settings?: SiteSettings | null }) {
  const logo = asMedia(settings?.logo)
  const productCategories = await getProductCategories()

  return (
    <HeaderClient
      logoAlt={logo?.alt || settings?.siteName || 'Tùng Linh'}
      logoUrl={mediaUrl(settings?.logo)}
      productCategories={productCategories}
      siteName={settings?.siteName}
    />
  )
}

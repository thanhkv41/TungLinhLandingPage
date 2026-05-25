import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Cài đặt website',
  access: {
    read: anyone,
    update: authenticated,
    readVersions: authenticated,
  },
  admin: {
    group: 'Cấu hình',
  },
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thông tin chung',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              label: 'Tên website',
              required: true,
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
            },
            {
              name: 'hotline',
              type: 'text',
              label: 'Hotline',
              required: true,
            },
            {
              name: 'secondaryPhone',
              type: 'text',
              label: 'Số điện thoại phụ',
            },
            {
              name: 'email',
              type: 'email',
              label: 'Email',
              required: true,
            },
            {
              name: 'address',
              type: 'textarea',
              label: 'Địa chỉ',
            },
            {
              name: 'factoryAddress',
              type: 'textarea',
              label: 'Địa chỉ xưởng',
            },
            {
              name: 'showroomAddress',
              type: 'textarea',
              label: 'Địa chỉ showroom',
            },
          ],
        },
        {
          label: 'Liên kết',
          fields: [
            {
              name: 'facebookUrl',
              type: 'text',
              label: 'Đường dẫn Facebook',
            },
            {
              name: 'zaloUrl',
              type: 'text',
              label: 'Đường dẫn Zalo',
            },
            {
              name: 'youtubeUrl',
              type: 'text',
              label: 'Đường dẫn YouTube',
            },
            {
              name: 'googleMapEmbedUrl',
              type: 'textarea',
              label: 'Mã nhúng Google Map',
            },
          ],
        },
        {
          label: 'SEO mặc định',
          fields: [
            {
              name: 'defaultSeoTitle',
              type: 'text',
              label: 'Tiêu đề SEO mặc định',
            },
            {
              name: 'defaultSeoDescription',
              type: 'textarea',
              label: 'Mô tả SEO mặc định',
            },
            {
              name: 'defaultOgImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Ảnh chia sẻ mặc định',
            },
          ],
        },
      ],
    },
  ],
}

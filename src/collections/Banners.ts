import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrActive } from '@/access/publicContent'
import { activeField, orderField } from '@/fields/cmsFields'

export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: {
    singular: 'Banner',
    plural: 'Banner',
  },
  access: {
    create: authenticated,
    read: authenticatedOrActive,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Nội dung',
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'isActive'],
    listSearchableFields: ['title', 'subtitle'],
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề',
      required: true,
      index: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Mô tả phụ',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Hình ảnh',
      required: true,
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Nội dung nút',
    },
    {
      name: 'buttonUrl',
      type: 'text',
      label: 'Đường dẫn nút',
    },
    orderField(),
    activeField(),
  ],
}

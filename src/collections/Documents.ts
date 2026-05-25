import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrActive } from '@/access/publicContent'
import { activeField, orderField, seoFields, slug } from '@/fields/cmsFields'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: {
    singular: 'Tài liệu',
    plural: 'Tài liệu',
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
    defaultColumns: ['title', 'category', 'order', 'isActive'],
    listSearchableFields: ['title', 'slug', 'description'],
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tên tài liệu',
      required: true,
      index: true,
    },
    slug(),
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'File tài liệu',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Loại tài liệu',
      required: true,
      options: [
        {
          label: 'Catalogue',
          value: 'catalogue',
        },
        {
          label: 'Hồ sơ năng lực',
          value: 'company-profile',
        },
        {
          label: 'Tài liệu kỹ thuật',
          value: 'technical',
        },
        {
          label: 'Khác',
          value: 'other',
        },
      ],
      defaultValue: 'catalogue',
    },
    {
      type: 'collapsible',
      label: 'SEO',
      admin: {
        initCollapsed: true,
      },
      fields: seoFields({ includeOgImage: false }),
    },
    orderField(),
    activeField(),
  ],
}

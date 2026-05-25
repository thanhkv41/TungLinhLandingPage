import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrActive } from '@/access/publicContent'
import { activeField, orderField, seoFields, slug } from '@/fields/cmsFields'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: {
    singular: 'Danh mục sản phẩm',
    plural: 'Danh mục sản phẩm',
  },
  access: {
    create: authenticated,
    read: authenticatedOrActive,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Sản phẩm',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', 'isActive'],
    listSearchableFields: ['title', 'slug'],
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tên danh mục',
      required: true,
      index: true,
    },
    slug(),
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Hình ảnh',
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

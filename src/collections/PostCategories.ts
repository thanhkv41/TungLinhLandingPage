import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrActive } from '@/access/publicContent'
import { activeField, orderField, slug } from '@/fields/cmsFields'

export const PostCategories: CollectionConfig = {
  slug: 'post-categories',
  labels: {
    singular: 'Danh mục tin tức',
    plural: 'Danh mục tin tức',
  },
  access: {
    create: authenticated,
    read: authenticatedOrActive,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Tin tức',
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
    orderField(),
    activeField(),
  ],
}

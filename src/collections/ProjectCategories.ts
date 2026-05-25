import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrActive } from '@/access/publicContent'
import { activeField, orderField, slug } from '@/fields/cmsFields'

export const ProjectCategories: CollectionConfig = {
  slug: 'project-categories',
  labels: {
    singular: 'Danh mục dự án',
    plural: 'Danh mục dự án',
  },
  access: {
    create: authenticated,
    read: authenticatedOrActive,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Dự án',
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

import type { CollectionConfig, CollectionSlug } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublishedStatus } from '@/access/publicContent'
import { galleryField, orderField, publishStatusField, seoFields, slug } from '@/fields/cmsFields'

const projectCategoriesSlug = 'project-categories' as CollectionSlug
const productsSlug = 'products' as CollectionSlug

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Dự án',
    plural: 'Dự án',
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublishedStatus,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Dự án',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'location', 'completedYear', 'status', 'isFeatured'],
    listSearchableFields: ['title', 'slug', 'location', 'clientName'],
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tên dự án',
      required: true,
      index: true,
    },
    slug(),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Nội dung',
          fields: [
            {
              name: 'category',
              type: 'relationship',
              relationTo: projectCategoriesSlug,
              label: 'Danh mục',
              required: true,
            },
            {
              name: 'location',
              type: 'text',
              label: 'Địa điểm',
              required: true,
            },
            {
              name: 'clientName',
              type: 'text',
              label: 'Chủ đầu tư / khách hàng',
            },
            {
              name: 'completedYear',
              type: 'number',
              label: 'Năm hoàn thành',
              admin: {
                step: 1,
              },
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Ảnh đại diện',
              required: true,
            },
            galleryField(),
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Mô tả ngắn',
              required: true,
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Nội dung chi tiết',
              required: true,
            },
            {
              name: 'usedProducts',
              type: 'relationship',
              relationTo: productsSlug,
              hasMany: true,
              label: 'Sản phẩm đã sử dụng',
            },
          ],
        },
        {
          label: 'SEO',
          fields: seoFields(),
        },
      ],
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Dự án nổi bật',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    orderField(),
    publishStatusField(),
  ],
  timestamps: true,
}

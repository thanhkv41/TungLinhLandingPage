import type { CollectionConfig, CollectionSlug } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublishedStatus } from '@/access/publicContent'
import { publishStatusField, seoFields, slug } from '@/fields/cmsFields'

const postCategoriesSlug = 'post-categories' as CollectionSlug

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Tin tức',
    plural: 'Tin tức',
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublishedStatus,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Tin tức',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
    listSearchableFields: ['title', 'slug', 'excerpt'],
  },
  defaultSort: '-publishedAt',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề',
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
              relationTo: postCategoriesSlug,
              label: 'Danh mục',
              required: true,
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Ảnh đại diện',
              required: true,
            },
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Mô tả ngắn',
              required: true,
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Nội dung',
              required: true,
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
      name: 'publishedAt',
      type: 'date',
      label: 'Ngày đăng',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData.status === 'published' && !value) {
              return new Date()
            }

            return value
          },
        ],
      },
    },
    publishStatusField(),
  ],
  timestamps: true,
}

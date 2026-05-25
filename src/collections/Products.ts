import type { CollectionConfig, CollectionSlug } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublishedStatus } from '@/access/publicContent'
import { galleryField, orderField, publishStatusField, seoFields, slug } from '@/fields/cmsFields'

const productCategoriesSlug = 'product-categories' as CollectionSlug
const productsSlug = 'products' as CollectionSlug

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Sản phẩm',
    plural: 'Sản phẩm',
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublishedStatus,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Sản phẩm',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'isFeatured', 'order'],
    listSearchableFields: ['title', 'slug', 'shortDescription'],
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tên sản phẩm',
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
              relationTo: productCategoriesSlug,
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
              name: 'specifications',
              type: 'array',
              label: 'Thông số kỹ thuật',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Tên thông số',
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  label: 'Giá trị',
                  required: true,
                },
              ],
            },
            {
              name: 'advantages',
              type: 'array',
              label: 'Ưu điểm',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Tiêu đề',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Mô tả',
                },
              ],
            },
            {
              name: 'applications',
              type: 'array',
              label: 'Ứng dụng',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Tiêu đề',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Mô tả',
                },
              ],
            },
            {
              name: 'catalogueFile',
              type: 'upload',
              relationTo: 'media',
              label: 'File catalogue',
            },
            {
              name: 'colorOptions',
              type: 'array',
              label: 'Mau sac',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Ten mau',
                  required: true,
                },
                {
                  name: 'swatchImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Anh mau',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Mo ta',
                },
              ],
            },
            {
              name: 'sizeOptions',
              type: 'array',
              label: 'Kich co / Quy cach',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Ten kich co',
                  required: true,
                },
                {
                  name: 'previewImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Anh minh hoa',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Mo ta',
                },
              ],
            },
            {
              name: 'relatedProducts',
              type: 'relationship',
              relationTo: productsSlug,
              hasMany: true,
              label: 'Sản phẩm liên quan',
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
      label: 'Sản phẩm nổi bật',
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

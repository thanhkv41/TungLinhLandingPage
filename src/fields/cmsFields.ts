import { slugField, type Field } from 'payload'

export const activeField = (): Field => ({
  name: 'isActive',
  type: 'checkbox',
  label: 'Đang hiển thị',
  defaultValue: true,
  admin: {
    position: 'sidebar',
  },
})

export const orderField = (): Field => ({
  name: 'order',
  type: 'number',
  label: 'Thứ tự',
  defaultValue: 0,
  admin: {
    position: 'sidebar',
    step: 1,
  },
})

export const publishStatusField = (): Field => ({
  name: 'status',
  type: 'select',
  label: 'Trạng thái',
  required: true,
  defaultValue: 'draft',
  options: [
    {
      label: 'Bản nháp',
      value: 'draft',
    },
    {
      label: 'Đã xuất bản',
      value: 'published',
    },
  ],
  admin: {
    position: 'sidebar',
  },
})

export const slug = () =>
  slugField({
    required: true,
    overrides: (field) => ({
      ...field,
      fields: field.fields.map((childField) => {
        if ('name' in childField && childField.name === 'slug') {
          return {
            ...childField,
            label: 'Đường dẫn',
          }
        }

        if ('name' in childField && childField.name === 'generateSlug') {
          return {
            ...childField,
            label: 'Tự tạo đường dẫn',
          }
        }

        return childField
      }),
    }),
  })

export const seoFields = ({ includeOgImage = true }: { includeOgImage?: boolean } = {}): Field[] => [
  {
    name: 'seoTitle',
    type: 'text',
    label: 'Tiêu đề SEO',
  },
  {
    name: 'seoDescription',
    type: 'textarea',
    label: 'Mô tả SEO',
  },
  ...(includeOgImage
    ? [
        {
          name: 'ogImage',
          type: 'upload' as const,
          relationTo: 'media' as const,
          label: 'Ảnh chia sẻ',
        },
      ]
    : []),
]

export const galleryField = (): Field => ({
  name: 'gallery',
  type: 'upload',
  relationTo: 'media',
  label: 'Thư viện ảnh',
  hasMany: true,
})

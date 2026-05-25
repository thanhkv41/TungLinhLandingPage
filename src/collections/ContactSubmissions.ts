import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Liên hệ',
    plural: 'Liên hệ',
  },
  access: {
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Liên hệ',
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'phone', 'email', 'status', 'createdAt'],
    listSearchableFields: ['fullName', 'phone', 'email', 'message'],
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'fullName',
      type: 'text',
      label: 'Họ và tên',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Số điện thoại',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'productInterest',
      type: 'text',
      label: 'Sản phẩm quan tâm',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Nội dung',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Trạng thái xử lý',
      required: true,
      defaultValue: 'new',
      access: {
        create: ({ req: { user } }) => Boolean(user),
        update: ({ req: { user } }) => Boolean(user),
      },
      options: [
        {
          label: 'Mới',
          value: 'new',
        },
        {
          label: 'Đã liên hệ',
          value: 'contacted',
        },
        {
          label: 'Đã đóng',
          value: 'closed',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}

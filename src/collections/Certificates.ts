import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrActive } from '@/access/publicContent'
import { activeField, orderField } from '@/fields/cmsFields'

export const Certificates: CollectionConfig = {
  slug: 'certificates',
  labels: {
    singular: 'Chứng chỉ',
    plural: 'Chứng chỉ',
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
    defaultColumns: ['title', 'issuedBy', 'issuedAt', 'order', 'isActive'],
    listSearchableFields: ['title', 'issuedBy'],
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tên chứng chỉ',
      required: true,
      index: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Hình ảnh',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
    },
    {
      name: 'issuedBy',
      type: 'text',
      label: 'Đơn vị cấp',
    },
    {
      name: 'issuedAt',
      type: 'date',
      label: 'Ngày cấp',
    },
    orderField(),
    activeField(),
  ],
}

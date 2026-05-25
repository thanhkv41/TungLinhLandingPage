import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      label: 'Tệp media',
      relationTo: 'media',
      required: true,
    },
  ],
  labels: {
    plural: 'Khối media',
    singular: 'Khối media',
  },
}

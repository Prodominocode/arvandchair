import type { CollectionConfig } from 'payload'

import { isContentEditor, publicRead } from '@/access/roles'

/** docs/02-data-model.md بخش ۳ — بخش «اعتماد» صفحه‌ی اصلی (بسته‌ی ۱). */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'authorName',
  },
  access: {
    read: publicRead,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  fields: [
    { name: 'authorName', type: 'text', localized: true, required: true },
    { name: 'authorCompany', type: 'text', localized: true },
    { name: 'quote', type: 'textarea', localized: true, required: true },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
    },
  ],
}

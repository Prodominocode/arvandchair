import type { CollectionConfig } from 'payload'

import { isContentEditor, publicRead } from '@/access/roles'
import { seoField } from './fields/seo'
import { slugField } from './fields/slug'

/**
 * docs/02-data-model.md بخش ۲. `salesMode` پیش‌فرض دسته‌های پروژه‌محور (آمفی‌تئاتر/همایش-سینما)
 * طبق تصمیم فاز ۴ همیشه `quote-only` است — همان مقداری که الان در Seed/Mock استفاده می‌شود.
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent', 'salesMode'],
  },
  access: {
    read: publicRead,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    slugField,
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'salesMode',
      type: 'select',
      required: true,
      defaultValue: 'direct-purchase',
      options: [
        { label: 'خرید مستقیم', value: 'direct-purchase' },
        { label: 'فقط استعلام', value: 'quote-only' },
        { label: 'ترکیبی', value: 'mixed' },
      ],
    },
    seoField,
  ],
}

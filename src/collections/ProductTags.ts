import type { CollectionConfig } from 'payload'

import { isContentEditor, publicRead } from '@/access/roles'
import { keyField } from './fields/key'

/** واژه‌نامه‌ی کنترل‌شده‌ی برچسب محصول (docs/02-data-model.md بخش ۲؛ افزوده‌ی فاز ۳ برای فیلتر آرشیو). */
export const ProductTags: CollectionConfig = {
  slug: 'product-tags',
  admin: {
    useAsTitle: 'label',
  },
  access: {
    read: publicRead,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  fields: [
    keyField,
    {
      name: 'label',
      type: 'text',
      localized: true,
      required: true,
    },
  ],
}

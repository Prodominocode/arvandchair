import type { CollectionConfig } from 'payload'

import { isContentEditor, publicRead } from '@/access/roles'
import { keyField } from './fields/key'

/** واژه‌نامه‌ی کنترل‌شده‌ی متریال محصول، جدا از `Products.specs.material` (docs/02-data-model.md بخش ۲). */
export const ProductMaterials: CollectionConfig = {
  slug: 'product-materials',
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

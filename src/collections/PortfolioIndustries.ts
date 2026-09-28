import type { CollectionConfig } from 'payload'

import { isContentEditor, publicRead } from '@/access/roles'
import { keyField } from './fields/key'

/** واژه‌نامه‌ی کنترل‌شده‌ی صنعت نمونه‌کار، جدا از `PortfolioProjects.industry` (docs/02-data-model.md بخش ۳). */
export const PortfolioIndustries: CollectionConfig = {
  slug: 'portfolio-industries',
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

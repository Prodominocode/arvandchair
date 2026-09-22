import type { CollectionConfig } from 'payload'

import { isContentEditor, publicRead } from '@/access/roles'
import { seoField } from './fields/seo'
import { slugField } from './fields/slug'

/** docs/02-data-model.md بخش ۳ — شکل نهایی هم‌راستا با `lib/mock-data/portfolio-projects.ts` (بسته‌ی ۳). */
export const PortfolioProjects: CollectionConfig = {
  slug: 'portfolio-projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'industry', 'completionYear', 'featured'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: publicRead,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    slugField,
    { name: 'clientName', type: 'text', localized: true },
    {
      name: 'industry',
      type: 'text',
      localized: true,
      admin: { description: 'متن نمایشی آزاد روی کارت/جزئیات.' },
    },
    {
      name: 'industryRef',
      type: 'relationship',
      relationTo: 'portfolio-industries',
      required: true,
      admin: { description: 'مبنای فیلتر Facet آرشیو — مستقل از فیلد «industry» بالا.' },
    },
    { name: 'location', type: 'text', localized: true },
    { name: 'scope', type: 'text', localized: true },
    { name: 'duration', type: 'text', localized: true },
    { name: 'completionYear', type: 'number' },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    { name: 'summary', type: 'textarea', localized: true },
    { name: 'challenge', type: 'textarea', localized: true },
    { name: 'solution', type: 'textarea', localized: true },
    {
      name: 'productsUsed',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    seoField,
  ],
}

import type { CollectionConfig } from 'payload'

import { isContentEditor, publicRead } from '@/access/roles'
import { seoField } from './fields/seo'
import { slugField } from './fields/slug'

/** docs/02-data-model.md بخش ۳ — شکل نهایی هم‌راستا با `lib/mock-data/blog-posts.ts` (بسته‌ی ۳). */
export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedDate'],
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
    { name: 'excerpt', type: 'textarea', localized: true, required: true },
    { name: 'content', type: 'richText', localized: true },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'category',
      type: 'text',
      localized: true,
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: { description: 'برچسب آزاد (نه واژه‌نامه‌ی کنترل‌شده) — مطابق نیاز فعلی UI.' },
    },
    {
      name: 'publishedDate',
      type: 'date',
    },
    seoField,
  ],
}

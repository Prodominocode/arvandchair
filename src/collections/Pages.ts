import type { Block, CollectionConfig } from 'payload'

import { isContentEditor, publicRead } from '@/access/roles'
import { seoField } from './fields/seo'
import { slugField } from './fields/slug'

/**
 * docs/02-data-model.md بخش ۳. دامنه‌ی این Collection طبق تصمیم فاز ۳ (رجوع به
 * `lib/mock-data/pages.ts`) فقط صفحات ساده‌ی حقوقی/متنی است (حریم‌خصوصی، شرایط استفاده) —
 * صفحات با روایت اختصاصی (About، Loyalty Club) Route مستقل دارند، نه رندر بلوکی. بلوک‌های
 * فرضی سند اولیه (Hero3D/Gallery/ScrollStory/TestimonialGrid/FAQAccordion) که هیچ‌وقت مصرف
 * نشدند، طبق قانون فاز ۴ («فیلد/بلوک حدسی را حذف کن») اینجا وجود ندارند.
 */
const richTextBlock: Block = {
  slug: 'rich-text',
  labels: { singular: 'متن', plural: 'بلوک‌های متن' },
  fields: [{ name: 'content', type: 'richText', localized: true }],
}

const ctaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'بلوک‌های CTA' },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'buttonLabel', type: 'text', localized: true, required: true },
    { name: 'href', type: 'text', required: true },
  ],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
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
    {
      name: 'layout',
      type: 'blocks',
      blocks: [richTextBlock, ctaBlock],
    },
    seoField,
  ],
}

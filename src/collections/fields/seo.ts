import type { Field } from 'payload'

/**
 * گروه SEO مشترک بین Collectionهای محتوایی (docs/02-data-model.md). فقط metaTitle/metaDescription
 * — بدون ogImage: در Mock/UI واقعی فاز ۳ (`lib/mock-data/types.ts` → `SeoFields`) هرگز از
 * ogImage استفاده نشد، پس طبق قانون فاز ۴ («فیلد حدسی/بلااستفاده را حذف کن») اضافه نشد.
 */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  fields: [
    { name: 'metaTitle', type: 'text', localized: true },
    { name: 'metaDescription', type: 'textarea', localized: true },
  ],
}

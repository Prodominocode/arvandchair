/**
 * Mock data برای Collection `Pages` (docs/02-data-model.md بخش ۳) — صفحات پویای Block-based.
 *
 * تصمیم فاز ۳: صفحات با روایت اختصاصی و پیچیده (About با اسکرول GSAP، Loyalty Club) به‌صورت
 * مستقیم به‌عنوان Route اختصاصی در `app/(frontend)/[locale]/...` ساخته می‌شوند، نه با رندر
 * دینامیک بلوک — چون طراحی هر کدام آن‌قدر خاص است که یک بلوک‌ساز عمومی در این فاز توجیه ندارد
 * (آن تصمیم معماری به فاز ۴ موکول است). این فایل فقط صفحات ساده‌ی حقوقی/متنی (بسته‌ی ۶) را از
 * قبل مدل می‌کند تا لایه‌ی Data Access این Collection هم کامل باشد.
 */

import type { LocalizedText, SeoFields } from './types'

export type PageBlock =
  | { type: 'rich-text'; content: LocalizedText }
  | { type: 'cta'; title: LocalizedText; buttonLabel: LocalizedText; href: string }

export type Page = {
  id: string
  title: LocalizedText
  slug: LocalizedText
  layout: PageBlock[]
  seo: SeoFields
}

export const pages: Page[] = [
  {
    id: 'privacy-policy',
    title: { fa: 'حریم خصوصی', en: 'Privacy Policy' },
    slug: { fa: 'privacy-policy', en: 'privacy-policy' },
    layout: [
      {
        type: 'rich-text',
        content: {
          fa: 'این متن جای‌گذار سیاست حریم خصوصی است — محتوای نهایی در بسته‌ی ۶ فاز ۳ نوشته می‌شود.',
          en: 'This is placeholder privacy-policy text — final content is written in Package 6 of Phase 3.',
        },
      },
    ],
    seo: {
      metaTitle: {
        fa: 'حریم خصوصی | اروند',
        en: 'Privacy Policy | Arvand',
      },
      metaDescription: {
        fa: 'سیاست حریم خصوصی فروشگاه اروند.',
        en: 'Arvand store privacy policy.',
      },
    },
  },
  {
    id: 'terms-of-service',
    title: { fa: 'شرایط استفاده', en: 'Terms of Service' },
    slug: { fa: 'terms-of-service', en: 'terms-of-service' },
    layout: [
      {
        type: 'rich-text',
        content: {
          fa: 'این متن جای‌گذار شرایط استفاده است — محتوای نهایی در بسته‌ی ۶ فاز ۳ نوشته می‌شود.',
          en: 'This is placeholder terms-of-service text — final content is written in Package 6 of Phase 3.',
        },
      },
    ],
    seo: {
      metaTitle: {
        fa: 'شرایط استفاده | اروند',
        en: 'Terms of Service | Arvand',
      },
      metaDescription: {
        fa: 'شرایط استفاده از فروشگاه اروند.',
        en: 'Arvand store terms of service.',
      },
    },
  },
]

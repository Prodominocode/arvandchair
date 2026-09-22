/**
 * Mock data برای Collection سبک `ProductTags` — واژه‌نامه‌ی کنترل‌شده‌ی برچسب‌های ویژگی/بازاریابی
 * محصول (نه دسته‌بندی). طبق قانون `05-pages-build-order.md` («اگر موردی به فیلدی نیاز داشت که در
 * ۰۲ نبود، اول Type را در lib/mock-data اضافه کن») برای صفحه‌ی آرشیو محصول (بسته‌ی ۲ #۵) اضافه شد؛
 * یادداشت متناظر در `docs/02-data-model.md` هم ثبت شده.
 *
 * چرا یک Collection جدا و نه رشته‌ی آزاد روی Product؟ چون فیلتر «تگ» در آرشیو باید بین محصولات
 * قابل‌مقایسه باشد (همان id، نه ترجمه‌ی آزاد هر محصول) — دقیقاً همان الگوی relation که
 * `Categories` از قبل دارد.
 */

import type { LocalizedText } from './types'

export type ProductTag = {
  id: string
  label: LocalizedText
}

export const productTags: ProductTag[] = [
  {
    id: 'bestseller',
    label: { fa: 'پرفروش', en: 'Bestseller' },
  },
  {
    id: 'new-arrival',
    label: { fa: 'تازه‌وارد', en: 'New Arrival' },
  },
  {
    id: 'height-adjustable',
    label: { fa: 'قابل تنظیم ارتفاع', en: 'Height Adjustable' },
  },
  {
    id: 'swivel-base',
    label: { fa: 'پایه‌ی چرخان', en: 'Swivel Base' },
  },
  {
    id: 'stackable',
    label: { fa: 'قابل چیدن روی هم', en: 'Stackable' },
  },
  {
    id: 'mesh-back',
    label: { fa: 'پشتی مش', en: 'Mesh Back' },
  },
  {
    id: 'lockable',
    label: { fa: 'دارای قفل', en: 'Lockable' },
  },
  {
    id: 'project-grade',
    label: { fa: 'درجه‌ی پروژه‌ای (تیراژ بالا)', en: 'Project Grade' },
  },
]

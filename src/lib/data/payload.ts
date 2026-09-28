/**
 * ابزار مشترک Adapterهای فاز ۵ — تبدیل خروجی Payload به همان شکل Mock فاز ۳ (تصمیم بسته‌شده:
 * UI دست نمی‌خورد). همه‌ی خواندن‌ها با `locale: 'all'` انجام می‌شود تا فیلدهای Localized مستقیم
 * به شکل `{ fa, en }` (= `LocalizedText`) برگردند، نه یک رشته‌ی تک‌زبانه.
 *
 * فقط سمت سرور — هیچ Client Component‌ای نباید (حتی غیرمستقیم) از فایلی که این را import
 * می‌کند مقدار (نه Type) بگیرد؛ ثابت‌های مشترک UI در `*.shared.ts` کنار هر فایل هستند.
 */

import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Media } from '@/payload-types'
import type { LocalizedText, MockImage, SeoFields } from '@/lib/mock-data/types'

export const getPayloadClient = cache(() => getPayload({ config }))

/** مقدار یک فیلد Localized در حالت `locale: 'all'`. */
export type LocalizedValue = Partial<Record<'fa' | 'en', string | null>> | string | null | undefined

/**
 * `{ fa, en }` خروجی Payload → `LocalizedText`. زبان خالی به فارسی Fallback می‌کند (همان رفتار
 * `fallback: true` در payload.config) تا UI هیچ‌وقت رشته‌ی undefined نگیرد.
 */
export function toLocalized(value: LocalizedValue): LocalizedText {
  if (typeof value === 'string') return { fa: value, en: value }
  const fa = value?.fa ?? ''
  return { fa, en: value?.en || fa }
}

/** relation در Payload بسته به depth یا id خام است یا سند Populate‌شده. */
export function relationId(value: unknown): string | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'object' && 'id' in value) return String((value as { id: unknown }).id)
  return String(value)
}

/** تصویر جایگزین وقتی فیلد upload خالی است/Media پاک شده (UI فاز ۳ همیشه یک src دارد). */
const FALLBACK_IMAGE_SRC = '/images/mock/icon-hero-brand.svg'

export function toImage(
  media: unknown,
  fallbackAlt?: LocalizedText,
  fallbackSrc = FALLBACK_IMAGE_SRC,
): MockImage {
  if (media && typeof media === 'object' && 'url' in media) {
    const doc = media as Media & { alt?: LocalizedValue }
    if (doc.url) return { src: doc.url, alt: toLocalized(doc.alt) }
  }
  return { src: fallbackSrc, alt: fallbackAlt ?? { fa: '', en: '' } }
}

export function toImages(media: unknown): MockImage[] {
  if (!Array.isArray(media)) return []
  return media
    .filter((item) => item && typeof item === 'object' && 'url' in item)
    .map((item) => toImage(item))
}

/**
 * Timestamp → `YYYY-MM-DD` در منطقه‌ی زمانی تهران (شکل تاریخ‌های Mock). برش ساده‌ی رشته‌ی UTC کافی
 * نیست: روزی که ویرایشگر در پنل از تهران انتخاب می‌کند ممکن است به‌صورت `...T20:30:00Z` روز قبل
 * ذخیره شود.
 */
export function toTehranDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Asia/Tehran' })
}

export type VocabularyItem = { id: string; label: LocalizedText }

/**
 * واژه‌نامه‌های ساده (`product-tags`/`product-materials`/`portfolio-industries`) — `id` خروجی همان
 * `key` پایدار است (نه id عددی)، چون در URL فیلترها (`?tag=bestseller`) و در `tagIds`/`materialIds`
 * /`industryId` محصولات/پروژه‌ها به همین مقدار ارجاع داده می‌شود.
 */
export const loadVocabulary = cache(
  async (
    collection: 'product-tags' | 'product-materials' | 'portfolio-industries',
  ): Promise<VocabularyItem[]> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection,
      locale: 'all',
      depth: 0,
      pagination: false,
      sort: 'id',
    })
    return (docs as unknown as { key: string; label: LocalizedValue }[]).map((doc) => ({
      id: doc.key,
      label: toLocalized(doc.label),
    }))
  },
)

export function toSeo(
  seo: { metaTitle?: LocalizedValue; metaDescription?: LocalizedValue } | null | undefined,
): SeoFields {
  return {
    metaTitle: toLocalized(seo?.metaTitle),
    metaDescription: toLocalized(seo?.metaDescription),
  }
}

/**
 * کاروسل صفحه‌ی اصلی — Global `home-carousel` در پنل. خروجی همان شکل `Look` کاروسل است.
 * اگر لیست خالی بود (یا دیتابیس در دسترس نبود) مقادیر پیش‌فرض کد (`getChairs`) برمی‌گردد تا
 * صفحه‌ی اصلی هیچ‌وقت بدون کاروسل نماند.
 */

import { cache } from 'react'

import { getChairs } from '@/components/look-carousel/chairs'
import type { Look, LookDetail } from '@/components/look-carousel/looks'
import type { AppLocale } from '@/i18n/routing'
import { getPayloadClient, toImage, toLocalized, type LocalizedValue } from './payload'

type RawSpec = {
  id?: string | null
  kind: LocalizedValue
  value: LocalizedValue
  swatch?: string | null
}
type RawChair = {
  id?: string | null
  name: LocalizedValue
  caption?: LocalizedValue
  image?: unknown
  gallery?: unknown[] | null
  specs?: RawSpec[] | null
}

const HEX = /^#[0-9a-f]{3,8}$/i

export const getHomeCarousel = cache(async (locale: AppLocale): Promise<Look[]> => {
  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'home-carousel',
      locale: 'all',
      depth: 1,
    })) as unknown as { chairs?: RawChair[] | null }

    const looks: Look[] = []
    ;(doc.chairs ?? []).forEach((chair, index) => {
      const main = toImage(chair.image, undefined, '')
      if (!main.src) return // بدون تصویر اصلی اسلاید ساخته نمی‌شود

      const name = toLocalized(chair.name)[locale]
      const gallery: LookDetail[] = (chair.gallery ?? [])
        .map((media, g) => {
          const img = toImage(media, undefined, '')
          if (!img.src) return null
          const label = img.alt[locale] // عنوان بالا-چپ تصویر در سایدبار = alt رسانه در پنل
          return {
            src: img.src,
            alt: label || `${name} — ${g + 1}`,
            ...(label ? { title: label } : {}),
          }
        })
        .filter((d): d is LookDetail => d !== null)

      looks.push({
        id: chair.id ?? `chair-${index + 1}`,
        src: main.src,
        name,
        caption: toLocalized(chair.caption)[locale],
        items: (chair.specs ?? []).map((spec) => ({
          kind: toLocalized(spec.kind)[locale],
          name: toLocalized(spec.value)[locale],
          ...(spec.swatch && HEX.test(spec.swatch.trim()) ? { swatch: spec.swatch.trim() } : {}),
        })),
        gallery,
      })
    })

    return looks.length ? looks : getChairs(locale)
  } catch {
    return getChairs(locale)
  }
})

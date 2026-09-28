/**
 * لایه‌ی Data Access برای Collection `Testimonials` — فاز ۵ به Payload وصل شد؛ خروجی به شکل Mock
 * (`Testimonial`) Adapt می‌شود. توضیح کلی معماری در `lib/data/categories.ts`.
 */

import { cache } from 'react'

import type { Testimonial } from '@/lib/mock-data/testimonials'
import { getPayloadClient, toImage, toLocalized, type LocalizedValue } from './payload'

/** آواتار خالی (فیلد اختیاری در Payload) → همان آیکون عمومی آواتار Mock فاز ۳. */
const FALLBACK_AVATAR_SRC = '/images/mock/icon-avatar.svg'

type LocalizedTestimonialDoc = {
  id: number
  authorName: LocalizedValue
  authorCompany?: LocalizedValue
  quote: LocalizedValue
  avatar?: unknown
  rating?: number | null
}

function toTestimonial(doc: LocalizedTestimonialDoc): Testimonial {
  const authorName = toLocalized(doc.authorName)
  return {
    id: String(doc.id),
    authorName,
    authorCompany: toLocalized(doc.authorCompany),
    quote: toLocalized(doc.quote),
    avatar: toImage(doc.avatar, authorName, FALLBACK_AVATAR_SRC),
    rating: doc.rating ?? 5,
  }
}

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'testimonials',
    locale: 'all',
    depth: 1,
    pagination: false,
    sort: 'id',
  })
  return (docs as unknown as LocalizedTestimonialDoc[]).map(toTestimonial)
})

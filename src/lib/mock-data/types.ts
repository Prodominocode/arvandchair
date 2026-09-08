/**
 * انواع پایه‌ی مشترک بین همه‌ی فایل‌های lib/mock-data — شکل داده دقیقاً هم‌راستا با
 * docs/02-data-model.md (Draft v1). این فایل خودش یک Collection نیست، فقط Buildingblock
 * فایل‌های دیگر (Category/Product/...) است.
 */

import type { AppLocale } from '@/i18n/routing'

/** فیلد 🌐 در docs/02-data-model.md — مقدار جدا به‌ازای هر زبان فعال/غیرفعال. */
export type LocalizedText = Record<AppLocale, string>

export type MockImage = {
  src: string
  alt: LocalizedText
}

export type SeoFields = {
  metaTitle: LocalizedText
  metaDescription: LocalizedText
}

/** آدرس داخل ایران — Checkout/Customers فعلاً فقط همین ساختار را می‌پذیرند (سند ۰۰ بخش ۱). */
export type IranAddress = {
  title: string
  province: string
  city: string
  street: string
  postalCode: string
  recipientPhone: string
}

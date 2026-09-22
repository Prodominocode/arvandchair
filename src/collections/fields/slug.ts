import type { Field } from 'payload'

/**
 * فیلد Slug مشترک — `localized: true` + `unique: true` یعنی یکتایی به‌ازای هر Locale جدا
 * بررسی می‌شود، نه در کل جدول (تصمیم: «Schema برای هر زبان مستقل پیاده‌سازی شود»). به همین
 * دلیل مقدار یکسان لاتین در fa/en (رفتار فعلی Mock) مشکلی ایجاد نمی‌کند، و بعداً اگر Slug
 * فارسی جدا انتخاب شد فقط مقدار عوض می‌شود، نه Schema.
 */
export const slugField: Field = {
  name: 'slug',
  type: 'text',
  localized: true,
  required: true,
  unique: true,
  index: true,
}

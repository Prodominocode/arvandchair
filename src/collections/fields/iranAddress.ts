import type { Field } from 'payload'

/**
 * ساختار آدرس داخل ایران — docs/02-data-model.md (`IranAddress`، `lib/mock-data/types.ts`).
 * مصرف‌کننده‌ی فعلی: `SiteSettings.offices[].address`. `Customers.addresses[]` هم قرار است
 * همین ساختار را بگیرد، ولی چون `Customers` به بسته‌ی UI بعدی موکول شده، فعلاً اینجا تعریف
 * نمی‌شود — فقط همین یک export برای وقتی که لازم شد.
 */
export const iranAddressFields: Field[] = [
  { name: 'title', type: 'text', required: true },
  { name: 'province', type: 'text', required: true },
  { name: 'city', type: 'text', required: true },
  { name: 'street', type: 'text', required: true },
  { name: 'postalCode', type: 'text', required: true },
  { name: 'recipientPhone', type: 'text', required: true },
]

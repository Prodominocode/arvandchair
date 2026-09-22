import type { GlobalConfig } from 'payload'

import { isContentEditor } from '@/access/roles'
import { iranAddressFields } from '@/collections/fields/iranAddress'

/**
 * docs/02-data-model.md بخش ۳. شکل نهایی هم‌راستا با `lib/mock-data/site-settings.ts` (بسته‌ی ۱).
 * `enabledLocales` قبلاً وجود داشت و دست‌نخورده ماند — منبع واقعی تشخیص فعال/غیرفعال‌بودن en
 * در `[locale]/layout.tsx` همین فیلد است.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: isContentEditor,
  },
  fields: [
    {
      name: 'enabledLocales',
      type: 'select',
      hasMany: true,
      defaultValue: ['en'],
      options: [{ label: 'English', value: 'en' }],
      admin: {
        description:
          'فارسی همیشه فعال است. زبان‌هایی که اینجا انتخاب نشوند، مسیر عمومی‌شان 404 برمی‌گرداند.',
      },
    },
    { name: 'siteName', type: 'text', localized: true, required: true },
    { name: 'tagline', type: 'text', localized: true },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'نسخه‌ی متن تیره — برای پس‌زمینه‌ی روشن.' },
    },
    {
      name: 'logoOnDark',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'نسخه‌ی متن سفید — برای پس‌زمینه‌ی تیره.' },
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'اینستاگرام', value: 'instagram' },
            { label: 'لینکدین', value: 'linkedin' },
            { label: 'تلگرام', value: 'telegram' },
          ],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'navMenu',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: { description: 'مسیر بدون پیشوند locale.' },
        },
        {
          name: 'children',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', localized: true, required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'offices',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'کارخانه', value: 'factory' },
            { label: 'نمایشگاه', value: 'showroom' },
            { label: 'دفتر فروش', value: 'sales-office' },
          ],
        },
        {
          name: 'address',
          type: 'group',
          fields: iranAddressFields,
        },
        { name: 'phone', type: 'text', required: true },
        {
          name: 'hours',
          type: 'text',
          localized: true,
          admin: { description: 'برای Structured Data آینده (LocalBusiness، سند ۰۳).' },
        },
      ],
    },
    { name: 'contactEmail', type: 'email' },
    { name: 'contactPhone', type: 'text' },
  ],
}

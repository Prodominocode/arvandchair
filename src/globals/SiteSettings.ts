import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    description: 'تنظیمات عمومی سایت — در فاز ۴ تکمیل می‌شود.',
  },
  fields: [
    {
      name: 'enabledLocales',
      type: 'select',
      hasMany: true,
      defaultValue: ['en', 'ar'],
      options: [
        { label: 'English', value: 'en' },
        { label: 'العربية', value: 'ar' },
      ],
      admin: {
        description:
          'فارسی همیشه فعال است. زبان‌هایی که اینجا انتخاب نشوند، مسیر عمومی‌شان 404 برمی‌گرداند.',
      },
    },
  ],
}

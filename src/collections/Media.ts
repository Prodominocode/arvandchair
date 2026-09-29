import path from 'node:path'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    description:
      'ذخیره‌سازی دیسک لوکال (media/) — بدون S3/R2. جایگزینی با Liara Object Storage فقط در فاز ۵.',
  },
  access: {
    read: () => true,
  },
  upload: {
    // نسبت به پوشه‌ی اجرا، نه import.meta.url: در build، مسیر مطلقِ ماشینِ build داخل باندل ثابت
    // می‌شود. در لیارا (standalone) دیسک `media` نسبت به ریشه‌ی اجرای برنامه mount می‌شود (liara.json).
    staticDir: path.resolve(process.cwd(), 'media'),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
    },
  ],
}

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CollectionConfig } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
    staticDir: path.resolve(dirname, '../../media'),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}

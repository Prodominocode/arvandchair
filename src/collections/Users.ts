import type { CollectionConfig } from 'payload'

/** docs/02-data-model.md بخش ۱ — کاربران داخلی/ادمین (جدا از `Customers` که به فاز بعد موکول شده). */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'content-editor',
      options: [
        { label: 'سوپرادمین', value: 'superadmin' },
        { label: 'فروش', value: 'sales' },
        { label: 'ویرایشگر محتوا', value: 'content-editor' },
        { label: 'پشتیبانی', value: 'support' },
      ],
      access: {
        // فقط سوپرادمین می‌تواند نقش را تغییر دهد؛ اولین کاربر (بدون req.user) هم مجاز است تا Bootstrap ممکن باشد.
        update: ({ req }) => !req.user || req.user.role === 'superadmin',
      },
    },
  ],
}

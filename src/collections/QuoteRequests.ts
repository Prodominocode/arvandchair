import type { CollectionConfig } from 'payload'

import { isSales, isSalesField, publicRead } from '@/access/roles'

/**
 * docs/02-data-model.md بخش ۴ — تنها Collection «فروش» که در دامنه‌ی فعلی فاز ۴ مانده (بقیه‌ی
 * بسته‌ی ۴/۵ موکول شده). ایجاد عمومی (فرم سایت، بدون لاگین)؛ مشاهده/ویرایش فقط تیم فروش.
 */
export const QuoteRequests: CollectionConfig = {
  slug: 'quote-requests',
  admin: {
    useAsTitle: 'company',
    defaultColumns: ['company', 'contactName', 'status', 'createdAt'],
  },
  access: {
    read: isSales,
    create: publicRead,
    update: isSales,
    delete: isSales,
  },
  fields: [
    { name: 'company', type: 'text', required: true },
    { name: 'contactName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        { name: 'qty', type: 'number', required: true, min: 1 },
        { name: 'notes', type: 'textarea' },
      ],
    },
    { name: 'message', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'جدید', value: 'new' },
        { label: 'در حال بررسی', value: 'in-review' },
        { label: 'استعلام شده', value: 'quoted' },
        { label: 'موفق', value: 'won' },
        { label: 'ناموفق', value: 'lost' },
      ],
      access: {
        // مشتری هنگام ثبت فرم عمومی نباید بتواند وضعیت را ست کند — فقط تیم فروش (هم در ایجاد، هم در ویرایش).
        create: isSalesField,
        update: isSalesField,
      },
    },
    {
      name: 'assignedSalesRep',
      type: 'relationship',
      relationTo: 'users',
      access: {
        create: isSalesField,
        update: isSalesField,
      },
    },
  ],
}

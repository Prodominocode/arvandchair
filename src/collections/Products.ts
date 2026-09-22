import type { CollectionConfig } from 'payload'

import { isContentEditor, publicRead } from '@/access/roles'
import { seoField } from './fields/seo'
import { slugField } from './fields/slug'

/**
 * docs/02-data-model.md بخش ۲. شکل فیلدها دقیقاً هم‌راستا با `lib/mock-data/products.ts`
 * (فاز ۳، UI تأییدشده) است — نه نسخه‌ی حدسی Draft v1. `model3d`/محدودیت فایل سه‌بعدی عمداً
 * به فاز بعد موکول شده (فعلاً فقط یک relation ساده به Media است، بدون محدودیت فرمت/حجم).
 */
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'basePrice', 'salesMode', 'stock'],
  },
  access: {
    read: publicRead,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    slugField,
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'مشترک بین زبان‌ها — Localized نیست.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'model3d',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'فایل glTF/GLB — پایپ‌لاین فشرده‌سازی/سقف حجم عمداً به فاز بعد موکول شده.',
      },
    },
    {
      name: 'specs',
      type: 'group',
      fields: [
        {
          name: 'dimensions',
          type: 'group',
          fields: [
            { name: 'lengthCm', type: 'number', required: true },
            { name: 'widthCm', type: 'number', required: true },
            { name: 'heightCm', type: 'number', required: true },
          ],
        },
        { name: 'material', type: 'text', localized: true },
        { name: 'weightKg', type: 'number' },
        {
          name: 'capacity',
          type: 'text',
          localized: true,
          admin: {
            description: 'فقط برای محصولات پروژه‌محور (آمفی‌تئاتر/همایش) معنادار است.',
          },
        },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'priceModifier', type: 'number', defaultValue: 0 },
        { name: 'stock', type: 'number', defaultValue: 0 },
      ],
    },
    {
      name: 'basePrice',
      type: 'number',
      required: true,
      admin: { description: 'به تومان.' },
    },
    {
      name: 'currency',
      type: 'select',
      defaultValue: 'IRR',
      options: [{ label: 'ریال ایران (تومان)', value: 'IRR' }],
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'salesMode',
      type: 'select',
      required: true,
      defaultValue: 'inherit-from-category',
      options: [
        { label: 'ارث‌بری از دسته', value: 'inherit-from-category' },
        { label: 'خرید مستقیم', value: 'direct-purchase' },
        { label: 'فقط استعلام', value: 'quote-only' },
      ],
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'product-tags',
      hasMany: true,
    },
    {
      name: 'materials',
      type: 'relationship',
      relationTo: 'product-materials',
      hasMany: true,
    },
    {
      name: 'features',
      type: 'array',
      admin: {
        description: 'اختیاری — بلوک‌های روایت تصویری/متنی صفحه‌ی جزئیات (بسته‌ی ۲ #۷).',
      },
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'text', type: 'textarea', localized: true, required: true },
        {
          name: 'images',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
        },
      ],
    },
    seoField,
  ],
}
